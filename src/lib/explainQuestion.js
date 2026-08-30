import explanationsByTopic from "../explanations/index.js";

/**
 * Look up a structured explanation for a question.
 *
 * @param {object} question  - Question object from the bank
 * @param {number|string} topicId - Numeric topic id (e.g. 1, "01")
 * @returns {object|null} Explanation object or null if not found
 */
export function explainQuestion(question, topicId) {
  if (!topicId || !question) return null;

  const paddedId = String(topicId).padStart(2, "0");
  const topicKey = `tema-${paddedId}`;
  const topicExplanations = explanationsByTopic[topicKey];
  if (!topicExplanations) return null;

  const questionNumber = String(question.number ?? question.id ?? "");
  return topicExplanations[questionNumber] ?? null;
}
