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

// Sube los datos locales; el servidor los une con los guardados y devuelve el resultado.
export async function pushSync(token, data) {
 const body = await call({ action: "sync", token, data });
 if (!body.data) throw new SyncError("error");
 return body;
}
