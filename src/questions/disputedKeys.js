// Preguntas cuya clave oficial es dudosa o choca con la de otra pregunta. Mientras se responde,
// la respuesta oficial se marca con un asterisco (la explicación cuenta por qué es discutible).
// Se identifican por tema y por la clave de su explicación (explanationId o número).
const DISPUTED = {
 1: ["314", "418"],
 10: ["49", "54"],
 11: ["279", "306"],
 13: ["1-279"],
 14: ["1-108", "2-99"],
 18: ["42"],
 19: ["92", "155", "316"],
 20: ["3-1", "3-12", "3-14", "3-44"],
 21: ["2-30"],
 23: ["2-14"],
};

const disputedSets = Object.fromEntries(Object.entries(DISPUTED).map(([topicId, keys]) => [topicId, new Set(keys)]));

export const isDisputedKey = (question, topicId) => {
 const keys = disputedSets[String(topicId)];
 return !!keys && keys.has(String(question?.explanationId ?? question?.number ?? question?.id ?? ""));
};
