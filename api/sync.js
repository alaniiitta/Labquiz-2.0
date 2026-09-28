// Cuenta de usuario y sincronización del progreso entre dispositivos (función de Vercel).
// Guarda los datos en Upstash Redis (plan gratuito, conectado desde Vercel → Storage).
//
// POST /api/sync con { action, ... }:
//   register { user, password }  → crea la cuenta y devuelve { user, token }
//   login    { user, password }  → devuelve { user, token }
//   sync     { token, data }     → une lo recibido con lo guardado y devuelve { data, updatedAt }
//   logout   { token }           → cierra esa sesión
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

// Vercel crea las variables al conectar la base de datos; según cómo se conecte llevan
// un prefijo (p. ej. STORAGE_KV_REST_API_URL), así que se buscan por el final del nombre.
const redisConfig = () => {
 const env = process.env;
 for (const [urlSuffix, tokenSuffix] of [["KV_REST_API_URL", "KV_REST_API_TOKEN"], ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]]) {
  const urlKey = Object.keys(env).find(key => (key === urlSuffix || key.endsWith(`_${urlSuffix}`)) && env[key]);
  if (!urlKey) continue;
  const token = env[urlKey.slice(0, urlKey.length - urlSuffix.length) + tokenSuffix];
  if (token) return { url: env[urlKey], token };
 }
 return { url: null, token: null };
};

async function redis(command) {
 const { url, token } = redisConfig();
 const response = await fetch(url, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(command),
 });
 const body = await response.json().catch(() => ({}));
 if (!response.ok || body.error) throw new Error(body.error || `Redis respondió ${response.status}`);
 return body.result;
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
 const fails = Number(await redis(["GET", keys.fails(user)])) || 0;
 if (fails >= MAX_FAILS) return [429, { error: "too-many" }];
 const raw = await redis(["GET", keys.user(user)]);
 const stored = raw ? JSON.parse(raw) : null;
 const expected = stored ? Buffer.from(stored.hash, "base64") : null;
 const actual = await hashPassword(password, stored ? Buffer.from(stored.salt, "base64") : randomBytes(16));
 if (!expected || expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
  await redis(["INCR", keys.fails(user)]);
  await redis(["EXPIRE", keys.fails(user), FAIL_WINDOW_S]);
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

const actions = { register, login, sync, logout };

export default async function handler(req, res) {
 res.setHeader("Cache-Control", "no-store");
 if (req.method !== "POST") {
  res.setHeader("Allow", "POST");
  return res.status(405).json({ error: "method-not-allowed" });
 }
 const { url, token } = redisConfig();
 if (!url || !token) return res.status(503).json({ error: "not-configured" });
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
