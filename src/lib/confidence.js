// «¿Segura o dudando?»: antes de responder se marca la seguridad y así se aprende cuándo
// compensa arriesgar con la penalización del examen (cada 4 fallos restan 1 acierto).
//
// Se guarda la última respuesta de cada pregunta: { [idPregunta]: [nivel, acierto 0/1, fecha] }.

export const CONFIDENCE_LEVELS = [
  { id: "s", label: "Segura", short: "Segura", hint: "La sé" },
  { id: "d", label: "Dudo entre 2", short: "Dudo", hint: "Descarto 2 opciones" },
  { id: "c", label: "A ciegas", short: "A ciegas", hint: "No tengo ni idea" },
];

// Con 4 opciones y −0,25 por fallo, contestar compensa si se acierta más del 20 %.
export const PENALTY = 0.25;
export const BREAK_EVEN = PENALTY / (1 + PENALTY);

export const isConfidence = (value) => CONFIDENCE_LEVELS.some((level) => level.id === value);

export const recordConfidence = (log = {}, questionId, level, correct, at = Date.now()) =>
  isConfidence(level) ? { ...log, [questionId]: [level, correct ? 1 : 0, at] } : log;

// Puntos que se ganan de media por cada pregunta que se contesta con ese porcentaje de acierto.
export const expectedValue = (rate) => rate - (1 - rate) * PENALTY;

export function confidenceStats(log = {}) {
  const stats = Object.fromEntries(CONFIDENCE_LEVELS.map((level) => [level.id, { ...level, total: 0, correct: 0 }]));
  Object.values(log).forEach((entry) => {
    if (!Array.isArray(entry) || !stats[entry[0]]) return;
    stats[entry[0]].total += 1;
    stats[entry[0]].correct += entry[1] ? 1 : 0;
  });
  return CONFIDENCE_LEVELS.map((level) => {
    const entry = stats[level.id];
    const rate = entry.total ? entry.correct / entry.total : null;
    return { ...entry, rate, ev: rate == null ? null : expectedValue(rate) };
  });
}

// Consejo para cada nivel según tus datos (hacen falta unas cuantas respuestas para fiarse).
export const MIN_ANSWERS = 15;
export function confidenceAdvice(entry) {
  if (!entry.total || entry.total < MIN_ANSWERS) return { tone: "wait", text: `Faltan datos (${entry.total}/${MIN_ANSWERS})` };
  if (entry.rate > BREAK_EVEN + 0.05) return { tone: "go", text: "Contesta: te sale a cuenta" };
  if (entry.rate >= BREAK_EVEN) return { tone: "mid", text: "Casi empate: contesta solo si descartas alguna" };
  return { tone: "stop", text: "Déjala en blanco: pierdes puntos" };
}

// Une los registros de dos dispositivos: por pregunta gana la respuesta más reciente.
export function mergeConfidence(a = {}, b = {}) {
  const merged = { ...a };
  Object.entries(b).forEach(([id, entry]) => {
    if (!Array.isArray(entry)) return;
    if (!Array.isArray(merged[id]) || (Number(entry[2]) || 0) > (Number(merged[id][2]) || 0)) merged[id] = entry;
  });
  return merged;
}
