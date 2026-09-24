import explanationsByTopic from "../explanations/index.js";

/**
 * Look up a structured explanation for a question.
 *
 * @param {object} question  - Question object from the bank
 * @param {number|string} topicId - Numeric topic id (e.g. 1, "01")
 * @param {string[]} [originalAnswers] - Options in their original (unshuffled) order
 * @returns {object|null} Explanation object or null if not found
 */
export function explainQuestion(question, topicId, originalAnswers = question?.answers) {
  if (!topicId || !question) return null;

  const paddedId = String(topicId).padStart(2, "0");
  const topicKey = `tema-${paddedId}`;
  const topicExplanations = explanationsByTopic[topicKey];
  if (!topicExplanations) return null;

  const questionNumber = String(
    question.explanationId ?? question.number ?? question.id ?? "",
  );
  const explanation = topicExplanations[questionNumber] ?? null;
  if (!explanation?.porQueNoLasOtras || explanation.motivosPorOpcion) return explanation;

  // porQueNoLasOtras usa las letras originales (A-D); se traduce al texto de cada opción
  // para que siga siendo válido cuando las opciones se muestran barajadas.
  const motivosPorOpcion = Object.fromEntries(
    Object.entries(explanation.porQueNoLasOtras)
      .map(([letter, reason]) => [originalAnswers?.[letter.toUpperCase().charCodeAt(0) - 65], reason])
      .filter(([answer]) => answer != null),
  );
  return { ...explanation, motivosPorOpcion };
}
