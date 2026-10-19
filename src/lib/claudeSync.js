// Sincronización cuando la app se abre dentro de claude.ai (publicada como artifact), sin Vercel:
// el progreso se guarda en la base de datos privada de cada persona en claude.ai
// (data/users/<id>/…, que nadie más puede leer). Va comprimido y troceado porque cada documento
// admite como mucho 256 KiB:
//   meta   → { n, fp, updatedAt }  (n trozos y la huella de los datos guardados)
//   partN  → { gz }                (trozo N del JSON comprimido en base64)
// Se escriben primero los trozos y después meta; si otro dispositivo lee a medias, la lectura
// falla y se reintenta en la siguiente sincronización.
import { gunzipBase64, gzipBase64 } from "./sync.js";
import { syncFingerprint } from "./syncMerge.js";

export const inClaude = () => typeof window !== "undefined" && typeof window.claude?.use === "function";

const CHUNK = 200_000;

let connection = null;
export function connectClaude() {
 if (!connection) {
  connection = (async () => {
   const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
   const id = await user?.id?.();
   return db && id ? { col: db.collection(`data/users/${id}`), parts: 0 } : null;
  })().catch(() => null);
 }
 return connection;
}

// Lo guardado en la nube. Si su huella es knownFp (ya lo tenemos) no se descargan los trozos.
export async function pullClaude(conn, knownFp) {
 const meta = await conn.col.doc("meta").get();
 if (!meta.exists) return null;
 const { n, fp, updatedAt } = meta.data();
 conn.parts = Math.max(conn.parts, Number(n) || 0);
 if (fp && fp === knownFp) return { same: true, fp, updatedAt };
 const parts = await Promise.all(Array.from({ length: n }, (_, index) => conn.col.doc(`part${index}`).get()));
 if (parts.some(part => !part.exists)) throw new Error("incomplete");
 const data = JSON.parse(await gunzipBase64(parts.map(part => part.data().gz).join("")));
 return { data, fp, updatedAt };
}

export async function pushClaude(conn, data) {
 const gz = await gzipBase64(JSON.stringify(data));
 const chunks = [];
 for (let start = 0; start < gz.length || !chunks.length; start += CHUNK) chunks.push(gz.slice(start, start + CHUNK));
 // una escritura cada vez por documento
 for (let index = 0; index < chunks.length; index++) await conn.col.doc(`part${index}`).set({ gz: chunks[index] });
 const fp = syncFingerprint(data);
 await conn.col.doc("meta").set({ n: chunks.length, fp, updatedAt: Date.now() });
 for (let index = chunks.length; index < conn.parts; index++) await conn.col.doc(`part${index}`).delete();
 conn.parts = chunks.length;
 return fp;
}

// Botón de descarga: dentro de claude.ai los enlaces de descarga no funcionan y hay que pedirlo.
export async function saveFileInClaude(filename, text) {
 const downloads = await window.claude.use("downloads");
 if (!downloads) return false;
 await downloads.save({ filename, data: new Blob([text], { type: "application/json" }) });
 return true;
}
