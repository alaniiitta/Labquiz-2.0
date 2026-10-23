// Simulacros hechos antes de que existiera el registro: se reconstruyen a partir del progreso.
// - Examen de 100: al entregarlo, todas las respuestas se guardan con la MISMA hora, así que
//   se reconocen como un grupo de preguntas con idéntica «ultimaVezVista».
// - Simulacro de 60: preguntas de muchos temas respondidas seguidas (sin pausas largas).
// Limitaciones: solo se conoce la última respuesta de cada pregunta (si la volviste a responder
// después, ya no cuenta para el simulacro antiguo), no se sabe qué opción marcaste al fallar y
// no se guardaban las que dejaste en blanco.

const MIN_EXAM_GROUP = 20;
const MIN_SIM_QUESTIONS = 40;
const MIN_SIM_TOPICS = 6;
const SESSION_GAP = 30 * 60 * 1000;
// Desde el 18-10-2026 (09:40, hora de Madrid) todos los simulacros se guardan en el registro: lo
// posterior no se reconstruye, porque un repaso largo de varios temas se confundiría con un simulacro.
export const REGISTRY_SINCE = Date.UTC(2026, 9, 18, 7, 40);

const topicOf = (id, state) => Number(state?.tema ?? String(id).split("-")[0]);

export function recoverPastExams(progress = {}, knownIds = new Set(), recorded = []) {
  const entries = Object.entries(progress)
    .filter(([id, state]) => knownIds.has(id) && Number(state?.ultimaVezVista) > 0 && Number(state?.ultimaVezVista) < REGISTRY_SINCE && (state?.vecesVista ?? 0) > 0)
    .map(([id, state]) => ({ id, state, at: Number(state.ultimaVezVista), failed: Number(state.ultimaVezFallada) === Number(state.ultimaVezVista) }));
  // no repetir los que ya están en el registro
  const covered = (at) => recorded.some((entry) => at >= Number(entry.startedAt) - 60000 && at <= Number(entry.endedAt) + 60000);
  const found = [];

  const byTime = new Map();
  entries.forEach((entry) => byTime.set(entry.at, [...(byTime.get(entry.at) ?? []), entry]));
  const examTimes = new Set();
  byTime.forEach((group, at) => {
    if (group.length < MIN_EXAM_GROUP || covered(at)) return;
    examTimes.add(at);
    found.push({ kind: "exam", endedAt: at, startedAt: at, items: group });
  });

  const rest = entries.filter((entry) => !examTimes.has(entry.at) && !covered(entry.at)).sort((a, b) => a.at - b.at);
  let session = [];
  const closeSession = () => {
    const topics = new Set(session.map((entry) => topicOf(entry.id, entry.state)));
    if (session.length >= MIN_SIM_QUESTIONS && topics.size >= MIN_SIM_TOPICS) {
      found.push({ kind: "sim", startedAt: session[0].at, endedAt: session[session.length - 1].at, items: session });
    }
    session = [];
  };
  rest.forEach((entry) => {
    if (session.length && entry.at - session[session.length - 1].at > SESSION_GAP) closeSession();
    session.push(entry);
  });
  closeSession();

  return found.map(({ kind, startedAt, endedAt, items }) => ({
    id: `rec-${kind}-${endedAt}`,
    kind,
    recovered: true,
    startedAt,
    endedAt,
    // orden original de las opciones; las falladas llevan −1 porque no se sabe qué se marcó
    items: items.sort((a, b) => a.at - b.at).map((entry) => ({ id: entry.id, failed: entry.failed, chosen: entry.state.respuestaElegida, shownCorrect: entry.state.respuestaCorrecta })),
  })).sort((a, b) => b.endedAt - a.endedAt);
}
