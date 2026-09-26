// Medidor de dificultad de las preguntas.
// 1) Dificultad estimada: rasgos de la propia pregunta que suelen hacerla más difícil
//    (formato «señale la falsa», cifras, opciones parecidas, detalle poco tratado en el resumen).
//    La puntuación se convierte en percentil dentro de todo el banco.
// 2) Dificultad personal: la estimación se corrige con tus aciertos y fallos en esa pregunta.

const plain = text => String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const NEGATIVE = /\b(falsa|falso|falsas|incorrecta|incorrecto|incorrectas|erronea|erroneo|excepto|salvo|no es|no son|no se|no esta|no corresponde|no pertenece|no suele|no seria|no tiene|no produce|no presenta)\b/;
const COMBINED = /^(todas|ninguna|ambas|las dos|a y b|a y c|b y c|son correctas|son falsas)/;
const NUMBER = /\d/;

const words = text => new Set((plain(text).match(/[a-z0-9]{3,}/g) ?? []));
const jaccard = (a, b) => {
 if (!a.size || !b.size) return 0;
 let shared = 0;
 a.forEach(word => { if (b.has(word)) shared++; });
 return shared / (a.size + b.size - shared);
};

// Opciones que se diferencian en poco («Factor X» / «Factor Xa», «aumentado» / «disminuido»).
const answerSimilarity = answers => {
 const sets = answers.filter(answer => !COMBINED.test(plain(answer).trim())).map(words);
 let total = 0, pairs = 0;
 for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) { total += jaccard(sets[i], sets[j]); pairs++; }
 return pairs ? total / pairs : 0;
};

// Puntuación bruta sin el resumen (cuanto más alta, más difícil).
export function intrinsicScore(question) {
 const text = plain(question.question);
 const answers = question.answers ?? [];
 let score = 0;
 if (NEGATIVE.test(text)) score += 1;
 const numeric = answers.filter(answer => NUMBER.test(answer)).length;
 if (numeric >= 2) score += 0.8;
 score += 1.6 * answerSimilarity(answers);
 if (answers.some(answer => COMBINED.test(plain(answer).trim()))) score += 0.5;
 const answerLength = answers.reduce((sum, answer) => sum + String(answer).length, 0);
 if (answerLength > 220) score += 0.3;
 if (text.length > 180) score += 0.2;
 return score;
}

// Parte que aporta el resumen: si la pregunta apenas encaja con él, es un detalle poco tratado.
// «coverage» es el percentil de afinidad con el resumen dentro de su tema (0 = la que menos).
export const coverageTerm = coverage => coverage == null ? 0.5 : 1 - coverage;

// Cuantiles (cada 5 %) de la puntuación bruta en todo el banco, calculados con las 6868 preguntas.
// Así cada tema se puede puntuar por separado y seguir siendo comparable con el resto.
const BANK_QUANTILES = [0.004, 0.194, 0.315, 0.416, 0.507, 0.585, 0.656, 0.725, 0.799, 0.865, 0.937, 1.01, 1.112, 1.236, 1.34, 1.466, 1.607, 1.76, 1.938, 2.255, 3.987];

export function bankPercentile(raw) {
 const q = BANK_QUANTILES;
 if (raw <= q[0]) return 0;
 for (let i = 1; i < q.length; i++) {
  if (raw <= q[i]) return (i - 1 + (raw - q[i - 1]) / (q[i] - q[i - 1])) / (q.length - 1);
 }
 return 1;
}

// Probabilidad de fallo esperada según el percentil de dificultad (0 = la más fácil del banco).
export const priorFailRate = percentile => 0.15 + 0.5 * percentile;

const PRIOR_WEIGHT = 2;
export const LEVEL_THRESHOLDS = [0.35, 0.52];
export const DIFFICULTY_LEVELS = [
 { id: "easy", label: "Fácil", bars: 1 },
 { id: "medium", label: "Media", bars: 2 },
 { id: "hard", label: "Difícil", bars: 3 },
];

// Combina la estimación con tu historial: la estimación cuenta como 2 respuestas «virtuales».
export function difficultyFor(percentile, progressEntry) {
 const prior = priorFailRate(percentile ?? 0.5);
 const seen = progressEntry?.vecesVista ?? 0;
 const failed = progressEntry?.vecesFallada ?? 0;
 const failRate = (prior * PRIOR_WEIGHT + failed) / (PRIOR_WEIGHT + seen);
 const index = failRate < LEVEL_THRESHOLDS[0] ? 0 : failRate < LEVEL_THRESHOLDS[1] ? 1 : 2;
 return { ...DIFFICULTY_LEVELS[index], failRate, personal: seen > 0 };
}
