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

  const questionNumber = String(
    question.explanationId ?? question.number ?? question.id ?? "",
  );
  const explanation = topicExplanations[questionNumber] ?? null;
  return explanation && Array.isArray(question.originalOrder) ? remapLetters(explanation, question.originalOrder) : explanation;
}

// Las opciones se barajan en cada test: «la C es incorrecta» tiene que pasar a la letra con la que
// se ve ahora esa opción. Solo se cambian las letras que se refieren a una opción («la A»,
// «opción B», «afirmaciones A y C»), no «vitamina D», «la D-xilosa» ni «la B-48».
const LETTERS = ["A", "B", "C", "D", "E"];
const LETTER_REFERENCE = /\b([Ll]as?|[Oo]pci[óo]n(?:es)?|[Aa]firmaci[óo]n(?:es)?|[Rr]espuestas?)(\s+)([A-E])(?![\p{L}\p{N}\-])((?:\s*(?:,|y|e|o)\s*(?:la\s+)?[A-E](?![\p{L}\p{N}\-]))*)/gu;

const remapText = (text, order) => text.replace(LETTER_REFERENCE, (match, word, space, letter, rest) => {
  const map = (original) => {
    const position = order.indexOf(LETTERS.indexOf(original));
    return position === -1 ? original : LETTERS[position];
  };
  const tail = rest.replace(/[A-E](?![\p{L}\p{N}\-])/gu, map);
  return `${word}${space}${map(letter)}${tail}`;
});

export function remapLetters(value, order) {
  if (typeof value === "string") return remapText(value, order);
  if (Array.isArray(value)) return value.map((item) => remapLetters(item, order));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, remapLetters(item, order)]));
  return value;
}
