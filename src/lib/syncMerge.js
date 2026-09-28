// Une los datos de estudio de dos dispositivos sin perder nada.
// Se usa en el navegador y en la función /api/sync, así que no depende del DOM.
//
// - progress: por pregunta gana la versión más reciente (última respuesta o última marca).
// - favorites: cada alta o baja lleva fecha (favoriteChanges); gana el cambio más reciente.
// - notes: por pregunta gana la más reciente; un borrado (noteDeletions) gana si es posterior.
// - El tema claro/oscuro es de cada dispositivo y no se sincroniza.

const isObject = value => !!value && typeof value === "object" && !Array.isArray(value);

// Momento de la última modificación de una pregunta.
const progressStamp = entry => Math.max(Number(entry?.actualizadoEn) || 0, Number(entry?.ultimaVezVista) || 0);

function mergeProgress(a = {}, b = {}) {
 const merged = { ...a };
 Object.entries(b).forEach(([id, entry]) => {
  const current = merged[id];
  if (!current) { merged[id] = entry; return; }
  const diff = progressStamp(entry) - progressStamp(current);
  if (diff > 0 || (diff === 0 && (entry.vecesVista ?? 0) > (current.vecesVista ?? 0))) merged[id] = entry;
 });
 return merged;
}

// Cambios de favoritos: los que no tienen fecha (datos antiguos) cuentan como altas muy viejas.
function favoriteState(data) {
 const state = {};
 (Array.isArray(data?.favorites) ? data.favorites : []).forEach(id => { state[id] = { on: true, at: 0 }; });
 Object.entries(isObject(data?.favoriteChanges) ? data.favoriteChanges : {}).forEach(([id, change]) => {
  if (isObject(change) && (Number(change.at) || 0) >= (state[id]?.at ?? -1)) state[id] = { on: !!change.on, at: Number(change.at) || 0 };
 });
 return state;
}

function mergeFavorites(a, b) {
 const left = favoriteState(a);
 const right = favoriteState(b);
 const changes = { ...left };
 Object.entries(right).forEach(([id, change]) => {
  if (!changes[id] || change.at > changes[id].at || (change.at === changes[id].at && change.on)) changes[id] = change;
 });
 const favorites = Object.entries(changes).filter(([, change]) => change.on).map(([id]) => id);
 // solo se guardan las fechas que hacen falta para resolver conflictos
 const favoriteChanges = Object.fromEntries(Object.entries(changes).filter(([, change]) => change.at > 0));
 return { favorites, favoriteChanges };
}

function mergeNotes(a, b) {
 const notes = { ...(isObject(a?.notes) ? a.notes : {}) };
 Object.entries(isObject(b?.notes) ? b.notes : {}).forEach(([id, note]) => {
  if (!notes[id] || (note?.updatedAt ?? 0) > (notes[id].updatedAt ?? 0)) notes[id] = note;
 });
 const noteDeletions = { ...(isObject(a?.noteDeletions) ? a.noteDeletions : {}) };
 Object.entries(isObject(b?.noteDeletions) ? b.noteDeletions : {}).forEach(([id, at]) => {
  noteDeletions[id] = Math.max(Number(noteDeletions[id]) || 0, Number(at) || 0);
 });
 Object.entries(noteDeletions).forEach(([id, at]) => {
  if (notes[id] && (notes[id].updatedAt ?? 0) <= at) delete notes[id];
  else if (notes[id]) delete noteDeletions[id];
 });
 return { notes, noteDeletions };
}

// Datos que viajan a la nube (sin preferencias propias del dispositivo).
export function syncPayload(data) {
 const { theme, ...rest } = isObject(data) ? data : {};
 return rest;
}

export function mergeUserData(a, b) {
 const left = syncPayload(a);
 const right = syncPayload(b);
 const counters = Object.fromEntries(["tests", "answered", "correct", "incorrect", "streak"].map(key => [key, Math.max(Number(left[key]) || 0, Number(right[key]) || 0)]));
 return {
  ...right,
  ...left,
  ...counters,
  progress: mergeProgress(isObject(left.progress) ? left.progress : {}, isObject(right.progress) ? right.progress : {}),
  ...mergeFavorites(left, right),
  ...mergeNotes(left, right),
 };
}

// Comparación estable para saber si hay algo nuevo que subir o que aplicar.
export function syncSignature(data) {
 const payload = syncPayload(data);
 const sortKeys = value => Array.isArray(value) ? value.map(sortKeys)
  : isObject(value) ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sortKeys(value[key])]))
  : value;
 const normalized = sortKeys({ ...payload, favorites: [...(payload.favorites ?? [])].sort() });
 return JSON.stringify(normalized);
}
