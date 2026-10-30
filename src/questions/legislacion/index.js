// Tema 24 · Legislación: el «contenido jurídico común» (temas 1 a 10) del temario de técnico
// especialista de laboratorio del IB-Salut (BOIB núm. 115, de 30-08-2025). Las preguntas salen del
// texto consolidado de cada norma en el BOE; la explicación cita el artículo.
import constitucion from "./constitucion.js";
import lgs from "./lgs.js";
import marco from "./marco.js";
import prl from "./prl.js";
import autonomia from "./autonomia.js";

// orden del temario oficial; cada ley lleva su clave (forma parte del id de sus preguntas)
export const LAWS = [
 { key: "constitucion", title: "Constitución española de 1978", questions: constitucion },
 { key: "lgs", title: "Ley General de Sanidad (Ley 14/1986)", questions: lgs },
 { key: "autonomia", title: "Autonomía del paciente (Ley 41/2002)", questions: autonomia },
 { key: "marco", title: "Estatuto Marco (Ley 55/2003)", questions: marco },
 { key: "prl", title: "Prevención de riesgos laborales (Ley 31/1995)", questions: prl },
];

const LETTERS = ["A", "B", "C", "D"];

// Preguntas en el formato del banco: id «24.<ley>-<n>»; la explicación se busca por «<ley>-<n>».
export const lawQuestions = LAWS.flatMap(({ key, questions }) => questions.map(([question, answers, correct], index) => ({
 id: `24.${key}-${index + 1}`,
 number: index + 1,
 explanationId: `${key}-${index + 1}`,
 question,
 answers,
 correctAnswer: correct,
 explanation: "",
})));

export const lawExplanations = Object.fromEntries(LAWS.flatMap(({ key, questions }) => questions.map(([, , correct, why, memo], index) => [
 `${key}-${index + 1}`,
 { respuestaCorrecta: LETTERS[correct], porQueLaCorrecta: why, claveMemorizar: memo },
])));
