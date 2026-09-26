import { getQuestionId } from "../smartQuestionSelector.js";
import topic01 from "./topic-01";
import topic02 from "./topic-02";
import topic03 from "./topic-03";
import topic04 from "./topic-04";
import topic05 from "./topic-05";
import topic06 from "./topic-06";
import topic07 from "./topic-07";
import topic08 from "./topic-08";
import topic09 from "./topic-09";
import topic10 from "./topic-10";
import topic11 from "./topic-11";
import topic12 from "./topic-12";
import topic13 from "./topic-13";
import topic14 from "./topic-14";
import topic15 from "./topic-15";
import topic16 from "./topic-16";
import topic17 from "./topic-17";
import topic18 from "./topic-18";
import topic19 from "./topic-19";
import topic20 from "./topic-20";
import topic21 from "./topic-21";
import topic22 from "./topic-22";
import topic23 from "./topic-23";

const normalize = (value) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

// ID de progreso de cada pregunta repetida que se ha quitado → ID de la que se conserva.
// Sirve para trasladar al usuario el progreso que tuviera guardado en la repetida.
export const duplicateAliases = {};

// Quita las preguntas repetidas dentro de un tema (mismo enunciado y mismas opciones,
// en cualquier orden). Se conserva la primera; el resto de IDs no cambia.
const withoutDuplicates = (topicId, questions) => {
 const seen = new Map();
 return questions.filter((question) => {
  const key = `${normalize(question.question)}||${(question.answers ?? []).map(normalize).sort().join("|")}`;
  const first = seen.get(key);
  if (!first) { seen.set(key, question); return true; }
  duplicateAliases[getQuestionId({ ...question, topicId })] = getQuestionId({ ...first, topicId });
  return false;
 });
};

const topicsById = [
 topic01, topic02, topic03, topic04, topic05, topic06, topic07, topic08, topic09, topic10, topic11, topic12,
 topic13, topic14, topic15, topic16, topic17, topic18, topic19, topic20, topic21, topic22, topic23,
];

export default Object.fromEntries(
 topicsById.map((questions, index) => [`tema-${String(index + 1).padStart(2, "0")}`, withoutDuplicates(index + 1, questions)]),
);
