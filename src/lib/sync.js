// Cliente de la sincronización entre dispositivos (ver api/sync.js).
export const SYNC_KEY = "labquiz.sync.v1";

// Sin I, O, 0 ni 1 para que el código no se preste a confusión al copiarlo a mano.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE = /^[A-Z2-9]{4}(-[A-Z2-9]{4}){4}$/;

export function generateSyncCode() {
 const bytes = new Uint8Array(20);
 crypto.getRandomValues(bytes);
 const chars = [...bytes].map(byte => ALPHABET[byte % ALPHABET.length]).join("");
 return chars.match(/.{4}/g).join("-");
}

// Acepta el código con o sin guiones, en minúsculas o con espacios.
export function normalizeSyncCode(input) {
 const chars = String(input ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
 const code = (chars.match(/.{1,4}/g) ?? []).join("-");
 return CODE.test(code) ? code : null;
}

export const loadSyncSettings = () => {
 try {
  const saved = JSON.parse(localStorage.getItem(SYNC_KEY) || "null");
  return saved && CODE.test(saved.code ?? "") ? saved : null;
 } catch {
  return null;
 }
};

export const saveSyncSettings = settings => {
 try {
  if (settings) localStorage.setItem(SYNC_KEY, JSON.stringify(settings));
  else localStorage.removeItem(SYNC_KEY);
 } catch (error) {
  console.error("No se pudo guardar la configuración de sincronización", error);
 }
};

export class SyncError extends Error {
 constructor(kind, message) {
  super(message ?? kind);
  this.kind = kind;
 }
}

// Sube los datos locales; el servidor los une con los guardados y devuelve el resultado.
export async function pushSync(code, data) {
 let response;
 try {
  response = await fetch("/api/sync", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ code, data }),
  });
 } catch {
  throw new SyncError("offline");
 }
 const body = await response.json().catch(() => ({}));
 if (response.status === 503 && body.error === "not-configured") throw new SyncError("not-configured");
 if (!response.ok || !body.data) throw new SyncError("error", body.error);
 return body;
}
