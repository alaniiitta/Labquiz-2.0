// Cliente de la cuenta y la sincronización entre dispositivos (ver api/sync.js).
export const SYNC_KEY = "labquiz.account.v1";
const LEGACY_SYNC_KEY = "labquiz.sync.v1";

export const USER_PATTERN = /^[a-z0-9._-]{3,30}$/;
export const MIN_PASSWORD = 6;

export const loadSyncSettings = () => {
 try {
  // el código de sincronización anterior nunca llegó a guardar nada en la nube: se descarta
  localStorage.removeItem(LEGACY_SYNC_KEY);
  const saved = JSON.parse(localStorage.getItem(SYNC_KEY) || "null");
  if (!saved || typeof saved.token !== "string" || typeof saved.user !== "string") return null;
  // versiones anteriores guardaban aquí una copia completa del progreso: se cambia por la huella corta
  if (typeof saved.lastSignature === "string" && saved.lastSignature.length > 64) {
   saved.lastSignature = null;
   localStorage.setItem(SYNC_KEY, JSON.stringify(saved));
  }
  return saved;
 } catch {
  return null;
 }
};

export const saveSyncSettings = settings => {
 try {
  if (settings) localStorage.setItem(SYNC_KEY, JSON.stringify(settings));
  else localStorage.removeItem(SYNC_KEY);
 } catch (error) {
  console.error("No se pudo guardar la sesión", error);
 }
};

export class SyncError extends Error {
 constructor(kind, detail = null) {
  super(kind);
  this.kind = kind;
  // si falta la base de datos: nombres de las variables que ve el servidor (para diagnosticar)
  this.detail = detail;
 }
}

async function call(payload) {
 let response;
 try {
  response = await fetch("/api/sync", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(payload),
  });
 } catch {
  throw new SyncError("offline");
 }
 const body = await response.json().catch(() => ({}));
 if (!response.ok) throw new SyncError(body.error || (response.status === 404 ? "not-configured" : "error"), Array.isArray(body.seen) ? body.seen : null);
 return body;
}

export const registerAccount = (user, password) => call({ action: "register", user, password });
export const loginAccount = (user, password) => call({ action: "login", user, password });
export const changePassword = (token, password) => call({ action: "password", token, password });
export const createRecoveryCode = token => call({ action: "recovery", token });
export const resetPassword = (user, code, password) => call({ action: "reset", user, code, password });
export const accountInfo = token => call({ action: "account", token });
export const logoutAccount = token => call({ action: "logout", token }).catch(() => null);

// gzip + base64 con las herramientas del navegador (Safari 16.4+); si no las hay, se envía sin comprimir.
const canCompress = typeof CompressionStream === "function" && typeof DecompressionStream === "function";

async function gzipBase64(text) {
 const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
 const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
 let binary = "";
 for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
 return btoa(binary);
}

async function gunzipBase64(base64) {
 const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
 const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
 return new Response(stream).text();
}

// Sube los datos locales; el servidor los une con los guardados. Si data es null solo se comprueba
// si hay algo nuevo en la nube. fp es la huella de lo que ya tiene este dispositivo: si coincide con
// la de la nube, el servidor contesta { same: true } sin volver a mandar todo el progreso.
export async function pushSync(token, data, fp) {
 const payload = { action: "sync", token, fp, acceptGz: canCompress };
 if (data != null) {
  if (canCompress) payload.gz = await gzipBase64(JSON.stringify(data));
  else payload.data = data;
 }
 const body = await call(payload);
 if (body.same) return body;
 if (typeof body.gz === "string") return { ...body, data: JSON.parse(await gunzipBase64(body.gz)) };
 if (!body.data) throw new SyncError("error");
 return body;
}
