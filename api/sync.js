// Sincronización del progreso entre dispositivos (función de Vercel).
// Guarda los datos en Upstash Redis (plan gratuito, conectado desde Vercel → Storage).
// Cada grupo de dispositivos comparte un código secreto; en la base de datos solo se
// guarda su huella (SHA-256), nunca el código.
//
//   GET  /api/sync?code=XXXX-...   → { data, updatedAt }  (data = null si aún no hay nada)
//   POST /api/sync { code, data }  → une lo recibido con lo guardado y devuelve el resultado

import { createHash } from "node:crypto";
import { mergeUserData } from "../src/lib/syncMerge.js";

const CODE = /^[A-Z2-9]{4}(-[A-Z2-9]{4}){4}$/;
const MAX_BYTES = 2_000_000;

const redisConfig = () => ({
 url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
 token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

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

const keyFor = code => `labquiz:sync:${createHash("sha256").update(code).digest("hex")}`;

async function load(key) {
 const raw = await redis(["GET", key]);
 return raw ? JSON.parse(raw) : null;
}

export default async function handler(req, res) {
 res.setHeader("Cache-Control", "no-store");
 const { url, token } = redisConfig();
 if (!url || !token) return res.status(503).json({ error: "not-configured" });

 try {
  if (req.method === "GET") {
   const code = String(req.query?.code ?? "").toUpperCase();
   if (!CODE.test(code)) return res.status(400).json({ error: "bad-code" });
   const stored = await load(keyFor(code));
   return res.status(200).json(stored ?? { data: null, updatedAt: null });
  }

  if (req.method === "POST") {
   const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
   const code = String(body.code ?? "").toUpperCase();
   if (!CODE.test(code)) return res.status(400).json({ error: "bad-code" });
   if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return res.status(400).json({ error: "bad-data" });
   const key = keyFor(code);
   const stored = await load(key);
   const merged = stored?.data ? mergeUserData(body.data, stored.data) : mergeUserData(body.data, {});
   const record = { data: merged, updatedAt: Date.now() };
   const serialized = JSON.stringify(record);
   if (serialized.length > MAX_BYTES) return res.status(413).json({ error: "too-large" });
   await redis(["SET", key, serialized]);
   return res.status(200).json(record);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method-not-allowed" });
 } catch (error) {
  console.error("sync", error);
  return res.status(500).json({ error: "server-error" });
 }
}
