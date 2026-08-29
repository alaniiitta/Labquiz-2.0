const DAY_MS = 24 * 60 * 60 * 1000;
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];

export const LEARNING_STATUS = Object.freeze({
  NEW: "NUEVA",
  LEARNING: "APRENDIENDO",
  DIFFICULT: "DIFICIL",
  MASTERED: "DOMINADA",
});

export const createInitialQuestionProgress = () => ({
  vecesVista: 0,
  vecesAcertada: 0,
  vecesFallada: 0,
  ultimaVezVista: null,
  ultimaVezAcertada: null,
  ultimaVezFallada: null,
  fechaProximoRepaso: null,
  nivelDominio: 0,
  estado: LEARNING_STATUS.NEW,
  intervaloRepasoDias: 0,
  rachaAciertos: 0,
});

export function getQuestionId(question, index = 0) {
  const topic = question.topicId ?? question.tema ?? question.topic;
  const base = question.id ?? question.number ?? index;
  // el tema forma parte de la clave: temas distintos reutilizan los mismos ids numéricos
  return topic == null ? String(base) : `${topic}-${base}`;
}

export function getQuestionTopic(question) {
  return question.tema ?? question.topicId ?? question.topic ?? null;
}

export function getQuestionPriority(question, progress = {}, now = Date.now()) {
  const state = { ...createInitialQuestionProgress(), ...progress };
  if (!state.vecesVista) return 1000;

  const overdueDays = state.fechaProximoRepaso
    ? Math.max(0, (now - state.fechaProximoRepaso) / DAY_MS)
    : 0;
  const daysSinceSeen = state.ultimaVezVista
    ? Math.max(0, (now - state.ultimaVezVista) / DAY_MS)
    : 0;
  const recentFailure = state.ultimaVezFallada
    ? Math.max(0, 30 - (now - state.ultimaVezFallada) / DAY_MS)
    : 0;

  return (
    state.vecesFallada * 180
    + (state.estado === LEARNING_STATUS.DIFFICULT ? 180 : 0)
    + recentFailure * 6
    + overdueDays * 12
    + Math.min(daysSinceSeen, 90) * 1.5
    + state.vecesAcertada * 2
    - state.nivelDominio * 25
  );
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

function pickFromGroup(group, amount, random) {
  const selected = [];
  const remaining = [...group];
  while (remaining.length && selected.length < amount) {
    const next = weightedPick(remaining, random);
    selected.push(next);
    remaining.splice(remaining.indexOf(next), 1);
  }
  return selected;
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function selectSmartQuestions(allQuestions = [], userProgress = {}, count = 30, topicFilter = null, random = Math.random, now = Date.now()) {
  const unique = [];
  const seenIds = new Set();
  allQuestions
    .filter((question) => topicFilter == null || String(getQuestionTopic(question)) === String(topicFilter))
    .forEach((question, index) => {
      const id = getQuestionId(question, index);
      if (seenIds.has(id)) return;
      seenIds.add(id);
      unique.push({ question, id, state: userProgress[id] ?? createInitialQuestionProgress(), priority: getQuestionPriority(question, userProgress[id], now) });
    });

  const target = Math.min(count, unique.length);
  const remaining = [...unique];
  const selected = [];
  const groups = [
    { items: unique.filter((item) => !item.state.vecesVista), ratio: 0.35 },
    { items: unique.filter((item) => item.state.vecesFallada || item.state.estado === LEARNING_STATUS.DIFFICULT), ratio: 0.35 },
    { items: unique.filter((item) => item.state.vecesVista && item.state.fechaProximoRepaso && item.state.fechaProximoRepaso <= now), ratio: 0.2 },
    { items: unique, ratio: 0.1 },
  ];

  groups.forEach((group, groupIndex) => {
    const available = group.items.filter((item) => remaining.includes(item));
    const amount = groupIndex === groups.length - 1 ? target - selected.length : Math.min(Math.round(target * group.ratio), available.length);
    const picked = pickFromGroup(available, amount, random);
    selected.push(...picked);
    picked.forEach((item) => remaining.splice(remaining.indexOf(item), 1));
  });

  while (selected.length < target && remaining.length) {
    const next = weightedPick(remaining, random);
    selected.push(next);
    remaining.splice(remaining.indexOf(next), 1);
  }
  return shuffle(selected.map((item) => item.question), random);
}

// sigue "fallada" mientras el último intento haya sido incorrecto; se corrige al acertarla de nuevo
export function isQuestionCurrentlyFailed(state = createInitialQuestionProgress()) {
  return state.vecesFallada > 0 && (!state.ultimaVezAcertada || state.ultimaVezFallada > state.ultimaVezAcertada);
}

export function selectQuestionsByMode(allQuestions = [], userProgress = {}, count = 30, mode = "smart", topicFilter = null, random = Math.random, now = Date.now()) {
  const eligible = allQuestions.filter((question, index) => {
    const state = userProgress[getQuestionId(question, index)] ?? createInitialQuestionProgress();
    if (mode === "failed") return isQuestionCurrentlyFailed(state);
    if (mode === "new") return state.vecesVista === 0;
    if (mode === "review") return state.vecesVista > 0 && (!state.fechaProximoRepaso || state.fechaProximoRepaso <= now);
    return true;
  });
  return selectSmartQuestions(eligible, userProgress, count, topicFilter, random, now);
}

export function recordQuestionAnswer(question, userProgress = {}, isCorrect, now = Date.now()) {
  const id = getQuestionId(question);
  const current = { ...createInitialQuestionProgress(), ...(userProgress[id] || {}) };
  const nextCorrect = current.vecesAcertada + (isCorrect ? 1 : 0);
  const nextFailed = current.vecesFallada + (isCorrect ? 0 : 1);
  const nextStreak = isCorrect ? current.rachaAciertos + 1 : 0;
  const interval = isCorrect ? REVIEW_INTERVALS[Math.min(nextStreak - 1, REVIEW_INTERVALS.length - 1)] : 1;
  const successRate = (nextCorrect / (current.vecesVista + 1)) * 5;
  const next = {
    ...current,
    vecesVista: current.vecesVista + 1,
    vecesAcertada: nextCorrect,
    vecesFallada: nextFailed,
    ultimaVezVista: now,
    ultimaVezAcertada: isCorrect ? now : current.ultimaVezAcertada,
    ultimaVezFallada: isCorrect ? current.ultimaVezFallada : now,
    fechaProximoRepaso: now + interval * DAY_MS,
    intervaloRepasoDias: interval,
    rachaAciertos: nextStreak,
    nivelDominio: Math.max(0, Math.min(5, Math.round(successRate))),
    estado: !isCorrect && nextFailed >= 2
      ? LEARNING_STATUS.DIFFICULT
      : isCorrect && nextStreak >= 4
        ? LEARNING_STATUS.MASTERED
        : LEARNING_STATUS.LEARNING,
  };
  return { ...userProgress, [id]: next };
}

export function shuffleQuestionOptions(question, random = Math.random) {
  const optionsKey = Array.isArray(question.opciones) ? "opciones" : "answers";
  const correctKey = Object.prototype.hasOwnProperty.call(question, "respuestaCorrecta") ? "respuestaCorrecta" : "correctAnswer";
  const options = question[optionsKey] ?? [];
  const correctIndex = typeof question[correctKey] === "number"
    ? question[correctKey]
    : options.indexOf(question[correctKey]);
  const shuffled = shuffle(options.map((text, index) => ({ text, index })), random);
  return { ...question, [optionsKey]: shuffled.map((item) => item.text), [correctKey]: shuffled.findIndex((item) => item.index === correctIndex) };
}

export const getQuestionIdForProgress = getQuestionId;
