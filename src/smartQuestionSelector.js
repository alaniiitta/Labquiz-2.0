const DAY_MS = 24 * 60 * 60 * 1000;

export const createInitialQuestionProgress = () => ({
  vecesVista: 0,
  vecesAcertada: 0,
  vecesFallada: 0,
  ultimaVezVista: null,
  ultimaVezAcertada: null,
  ultimaVezFallada: null,
  nivelDominio: 0,
});

const getQuestionId = (question, index) => String(question.id ?? question.number ?? `${question.topicId ?? "question"}-${index}`);

export function getQuestionPriority(question, progress = {}, now = Date.now()) {
  const state = { ...createInitialQuestionProgress(), ...progress };
  const ageDays = state.vecesVista && state.ultimaVezVista ? Math.max(0, (now - state.ultimaVezVista) / DAY_MS) : 0;
  const failureRecency = state.ultimaVezFallada ? Math.max(0, 30 - (now - state.ultimaVezFallada) / DAY_MS) : 0;
  const failureWeight = state.vecesFallada * 70;
  const unseenWeight = state.vecesVista === 0 ? 150 : 0;
  const masteryPenalty = state.nivelDominio * 10;
  return unseenWeight + failureWeight + failureRecency * 4 + Math.min(ageDays, 90) * 1.5 - masteryPenalty;
}

function weightedPick(items, random) {
  const total = items.reduce((sum, item) => sum + Math.max(1, item.priority), 0);
  let cursor = random() * total;
  for (const item of items) {
    cursor -= Math.max(1, item.priority);
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function selectSmartQuestions(allQuestions = [], userProgress = {}, count = 30, topicFilter = null, random = Math.random) {
  const filtered = allQuestions.filter((question) => topicFilter == null || String(question.topicId ?? question.topic) === String(topicFilter));
  const unique = [];
  const seen = new Set();
  filtered.forEach((question, index) => {
    const id = getQuestionId(question, index);
    if (!seen.has(id)) {
      seen.add(id);
      unique.push({ question, id, priority: getQuestionPriority(question, userProgress[id], Date.now()) });
    }
  });
  const selected = [];
  const remaining = [...unique];
  while (remaining.length && selected.length < Math.min(count, unique.length)) {
    const unseen = remaining.filter((item) => !(userProgress[item.id]?.vecesVista));
    const candidates = unseen.length ? unseen : remaining;
    const next = weightedPick(candidates, random);
    selected.push(next.question);
    remaining.splice(remaining.indexOf(next), 1);
  }
  return shuffle(selected, random);
}

export function recordQuestionAnswer(question, userProgress = {}, isCorrect, now = Date.now()) {
  const id = getQuestionId(question, 0);
  const current = { ...createInitialQuestionProgress(), ...(userProgress[id] || {}) };
  const next = {
    ...current,
    vecesVista: current.vecesVista + 1,
    ultimaVezVista: now,
    [isCorrect ? "vecesAcertada" : "vecesFallada"]: current[isCorrect ? "vecesAcertada" : "vecesFallada"] + 1,
    [isCorrect ? "ultimaVezAcertada" : "ultimaVezFallada"]: now,
  };
  const successRate = next.vecesAcertada / next.vecesVista;
  next.nivelDominio = Math.max(0, Math.min(5, Math.round(successRate * 5) - (next.vecesFallada ? 1 : 0)));
  return { ...userProgress, [id]: next };
}

export const getQuestionIdForProgress = getQuestionId;
