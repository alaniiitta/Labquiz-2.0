// Cuenta de usuario y sincronización del progreso entre dispositivos (función de Vercel).
// Guarda los datos en Redis (Upstash o Redis, plan gratuito, conectado desde Vercel → Storage).
//
// POST /api/sync con { action, ... }:
//   register { user, password }  → crea la cuenta y devuelve { user, token }
//   login    { user, password }  → devuelve { user, token }
//   sync     { token, data }     → une lo recibido con lo guardado y devuelve { data, updatedAt }
//   logout   { token }           → cierra esa sesión
//   password { token, password } → cambia la contraseña (con la sesión abierta)
//   recovery { token }           → crea un código de recuperación nuevo y lo devuelve una sola vez
//   reset    { user, code, password } → con el código, pone otra contraseña y entra
//   account  { token }           → dice si ya hay código de recuperación (y desde cuándo)
//
// No hay email: para recuperar la contraseña sin sesión hace falta el código de recuperación.
// Se guarda cifrado como la contraseña y deja de valer en cuanto se usa o se crea otro.
//
// La contraseña se guarda cifrada con scrypt (sal propia por usuario) y las sesiones
// solo por su huella SHA-256: en la base de datos no hay nada que se pueda reutilizar.

import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { mergeUserData } from "../src/lib/syncMerge.js";

const USER = /^[a-z0-9._-]{3,30}$/;
const MIN_PASSWORD = 6;
const MAX_BYTES = 2_000_000;
const MAX_FAILS = 10;
const FAIL_WINDOW_S = 15 * 60;
const SESSION_TTL_S = 365 * 24 * 60 * 60;

// Vercel crea las variables al conectar la base de datos. Según el proveedor son de tipo
// REST (Upstash: KV_REST_API_URL + KV_REST_API_TOKEN) o una URL redis:// (Redis: REDIS_URL),
// y a veces llevan un prefijo (p. ej. STORAGE_REDIS_URL), así que se buscan por el final del nombre.
const findEnv = suffix => Object.keys(process.env).find(key => (key === suffix || key.endsWith(`_${suffix}`)) && process.env[key]);

const restConfig = () => {
 for (const [urlSuffix, tokenSuffix] of [["KV_REST_API_URL", "KV_REST_API_TOKEN"], ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]]) {
  const urlKey = findEnv(urlSuffix);
  if (!urlKey) continue;
  const token = process.env[urlKey.slice(0, urlKey.length - urlSuffix.length) + tokenSuffix];
  if (token) return { url: process.env[urlKey], token };
 }
 return null;
};

const redisUrl = () => {
 const key = findEnv("REDIS_URL") ?? findEnv("KV_URL");
 const value = key ? process.env[key] : null;
 return value && /^rediss?:\/\//.test(value) ? value : null;
};

const isConfigured = () => !!(restConfig() || redisUrl());

// Nombres (nunca valores) de las variables que parecen de base de datos, para diagnosticar.
const seenVariables = () => Object.keys(process.env).filter(key => /REDIS|UPSTASH|(^|_)KV_/.test(key)).sort();

async function restCommand({ url, token }, command) {
 const response = await fetch(url, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(command),
 });
 const body = await response.json().catch(() => ({}));
 if (!response.ok || body.error) throw new Error(body.error || `Redis respondió ${response.status}`);
 return body.result;
}

// Conexión redis:// reutilizada entre llamadas mientras la función siga «caliente».
let clientPromise = null;
async function tcpClient(url) {
 if (!clientPromise) {
  clientPromise = import("redis").then(async ({ createClient }) => {
   const client = createClient({ url, socket: { connectTimeout: 5000, reconnectStrategy: retries => (retries > 2 ? false : 200) } });
   client.on("error", error => console.error("redis", error.message));
   await client.connect();
   return client;
  }).catch(error => { clientPromise = null; throw error; });
 }
 return clientPromise;
}

async function redis(command) {
 const rest = restConfig();
 if (rest) return restCommand(rest, command);
 const client = await tcpClient(redisUrl());
 return client.sendCommand(command.map(String));
}

const sha256 = text => createHash("sha256").update(text).digest("hex");
const keys = {
 user: user => `labquiz:user:${user}`,
 data: user => `labquiz:data:${user}`,
 session: token => `labquiz:session:${sha256(token)}`,
 fails: user => `labquiz:fails:${user}`,
};

const hashPassword = (password, salt) => new Promise((resolve, reject) =>
 scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)));

const normalizeUser = value => String(value ?? "").trim().toLowerCase();

// sin 0/O, 1/I/L para que no haya dudas al copiarlo a mano
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 16;
const normalizeCode = value => String(value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const newCode = () => Array.from(randomBytes(CODE_LENGTH), byte => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
const formatCode = code => code.match(/.{4}/g).join("-");

const readUser = async user => {
 const raw = await redis(["GET", keys.user(user)]);
 return raw ? JSON.parse(raw) : null;
};
const writeUser = (user, record) => redis(["SET", keys.user(user), JSON.stringify(record)]);

const secretRecord = async secret => {
 const salt = randomBytes(16);
 return { salt: salt.toString("base64"), hash: (await hashPassword(secret, salt)).toString("base64") };
};

// compara siempre (también si no hay nada guardado) para tardar lo mismo
async function matches(secret, stored) {
 const expected = stored?.hash ? Buffer.from(stored.hash, "base64") : null;
 const actual = await hashPassword(secret, stored?.salt ? Buffer.from(stored.salt, "base64") : randomBytes(16));
 return !!expected && expected.length === actual.length && timingSafeEqual(expected, actual);
}

const tooManyFails = async user => (Number(await redis(["GET", keys.fails(user)])) || 0) >= MAX_FAILS;
async function countFail(user) {
 await redis(["INCR", keys.fails(user)]);
 await redis(["EXPIRE", keys.fails(user), FAIL_WINDOW_S]);
}

async function newSession(user) {
 const token = randomBytes(32).toString("base64url");
 await redis(["SET", keys.session(token), user, "EX", SESSION_TTL_S]);
 return token;
}

async function register(body) {
 const user = normalizeUser(body.user);
 const password = String(body.password ?? "");
 if (!USER.test(user)) return [400, { error: "invalid-user" }];
 if (password.length < MIN_PASSWORD) return [400, { error: "weak-password" }];
 const salt = randomBytes(16);
 const hash = await hashPassword(password, salt);
 const record = JSON.stringify({ salt: salt.toString("base64"), hash: hash.toString("base64"), createdAt: Date.now() });
 // NX: solo se crea si el usuario no existe todavía
 const created = await redis(["SET", keys.user(user), record, "NX"]);
 if (created !== "OK") return [409, { error: "user-taken" }];
 return [200, { user, token: await newSession(user) }];
}

async function login(body) {
 const user = normalizeUser(body.user);
 const password = String(body.password ?? "");
 if (!USER.test(user) || !password) return [401, { error: "bad-credentials" }];
 if (await tooManyFails(user)) return [429, { error: "too-many" }];
 if (!(await matches(password, await readUser(user)))) {
  await countFail(user);
  return [401, { error: "bad-credentials" }];
 }
 await redis(["DEL", keys.fails(user)]);
 return [200, { user, token: await newSession(user) }];
}

async function sessionUser(token) {
 if (typeof token !== "string" || token.length < 20) return null;
 return await redis(["GET", keys.session(token)]);
}

async function sync(body) {
 const user = await sessionUser(body.token);
 if (!user) return [401, { error: "unauthorized" }];
 if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return [400, { error: "bad-data" }];
 const raw = await redis(["GET", keys.data(user)]);
 const stored = raw ? JSON.parse(raw) : null;
 const record = { data: mergeUserData(body.data, stored?.data ?? {}), updatedAt: Date.now() };
 const serialized = JSON.stringify(record);
 if (serialized.length > MAX_BYTES) return [413, { error: "too-large" }];
 await redis(["SET", keys.data(user), serialized]);
 return [200, { user, ...record }];
}

async function logout(body) {
 if (typeof body.token === "string" && body.token) await redis(["DEL", keys.session(body.token)]);
 return [200, { ok: true }];
}

async function changePassword(body) {
 const user = await sessionUser(body.token);
 if (!user) return [401, { error: "unauthorized" }];
 const password = String(body.password ?? "");
 if (password.length < MIN_PASSWORD) return [400, { error: "weak-password" }];
 const stored = await readUser(user);
 if (!stored) return [401, { error: "unauthorized" }];
 await writeUser(user, { ...stored, ...(await secretRecord(password)), passwordChangedAt: Date.now() });
 return [200, { ok: true }];
}

async function createRecovery(body) {
 const user = await sessionUser(body.token);
 if (!user) return [401, { error: "unauthorized" }];
 const stored = await readUser(user);
 if (!stored) return [401, { error: "unauthorized" }];
 const code = newCode();
 await writeUser(user, { ...stored, recovery: { ...(await secretRecord(code)), createdAt: Date.now() } });
 return [200, { code: formatCode(code), createdAt: Date.now() }];
}

async function reset(body) {
 const user = normalizeUser(body.user);
 const code = normalizeCode(body.code);
 const password = String(body.password ?? "");
 if (!USER.test(user) || code.length !== CODE_LENGTH) return [401, { error: "bad-code" }];
 if (password.length < MIN_PASSWORD) return [400, { error: "weak-password" }];
 if (await tooManyFails(user)) return [429, { error: "too-many" }];
 const stored = await readUser(user);
 if (!(await matches(code, stored?.recovery))) {
  await countFail(user);
  return [401, { error: "bad-code" }];
 }
 // el código solo vale una vez: se borra y hay que crear otro desde la cuenta
 const { recovery, ...rest } = stored;
 await writeUser(user, { ...rest, ...(await secretRecord(password)), passwordChangedAt: Date.now() });
 await redis(["DEL", keys.fails(user)]);
 return [200, { user, token: await newSession(user) }];
}

async function accountInfo(body) {
 const user = await sessionUser(body.token);
 if (!user) return [401, { error: "unauthorized" }];
 const stored = await readUser(user);
 return [200, { user, recoveryAt: stored?.recovery?.createdAt ?? null }];
}

const actions = { register, login, sync, logout, password: changePassword, recovery: createRecovery, reset, account: accountInfo };

export default async function handler(req, res) {
 res.setHeader("Cache-Control", "no-store");
 if (req.method !== "POST") {
  res.setHeader("Allow", "POST");
  return res.status(405).json({ error: "method-not-allowed" });
 }
 if (!isConfigured()) {
  const seen = seenVariables();
  console.error("sync: sin base de datos; variables vistas:", seen.join(", ") || "ninguna");
  return res.status(503).json({ error: "not-configured", seen });
 }
 try {
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  const action = actions[body.action];
  if (!action) return res.status(400).json({ error: "bad-action" });
  const [status, payload] = await action(body);
  return res.status(status).json(payload);
 } catch (error) {
  console.error("sync", error);
  return res.status(500).json({ error: "server-error" });
 }
}
