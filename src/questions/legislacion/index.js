// Tema 24 · Legislación: el «contenido jurídico común» (temas 1 a 10) del temario de técnico
// especialista de laboratorio del IB-Salut (BOIB núm. 115, de 30-08-2025). Las preguntas salen del
// texto consolidado de cada norma en el BOE; la explicación cita el artículo.
import constitucion from "./constitucion.js";
import estatuto from "./estatuto.js";
import lgs from "./lgs.js";
import cohesion from "./cohesion.js";
import ebep from "./ebep.js";
import marco from "./marco.js";
import igualdad from "./igualdad.js";
import prl from "./prl.js";
import lopd from "./lopd.js";
import autonomia from "./autonomia.js";

// orden del temario oficial; cada ley lleva su clave (forma parte del id de sus preguntas)
export const LAWS = [
 { key: "constitucion", title: "Constitución española de 1978", questions: constitucion },
 { key: "estatuto", title: "Estatuto de Autonomía de las Illes Balears", questions: estatuto },
 { key: "lgs", title: "Ley General de Sanidad (Ley 14/1986)", questions: lgs },
 { key: "cohesion", title: "Cohesión y calidad del SNS (Ley 16/2003)", questions: cohesion },
 { key: "autonomia", title: "Autonomía del paciente (Ley 41/2002)", questions: autonomia },
 { key: "ebep", title: "Estatuto Básico del Empleado Público (RDL 5/2015)", questions: ebep },
 { key: "marco", title: "Estatuto Marco (Ley 55/2003)", questions: marco },
 { key: "igualdad", title: "Igualdad (Ley 11/2016) y violencia de género (LO 1/2004)", questions: igualdad },
 { key: "prl", title: "Prevención de riesgos laborales (Ley 31/1995)", questions: prl },
 { key: "lopd", title: "Protección de datos (LO 3/2018)", questions: lopd },
];

const LETTERS = ["A", "B", "C", "D"];

// Preguntas que se salen del «contenido jurídico común» del temario (BOIB núm. 115, de 30-08-2025):
// se ocultan sin borrarlas para que no cambie el id de las demás ni se pierda el progreso.
// - constitucion-40: estructura de la Constitución (el temario pide valores, principios, derechos y salud)
// - cohesion-1/2/14-17: objeto, principios, catálogo y cartera (solo pide tarjeta sanitaria y usuario del SNS)
// - ebep-1 a 4: clases de empleados y ámbito (solo pide derechos y deberes)
// - igualdad-10: Observatorio para la Igualdad
// - prl-28 a 34: delegados de prevención y Comité de Seguridad y Salud (consulta y participación)
const HIDDEN = new Set([
 "constitucion-40",
 "cohesion-1", "cohesion-2", "cohesion-14", "cohesion-15", "cohesion-16", "cohesion-17",
 "ebep-1", "ebep-2", "ebep-3", "ebep-4",
 "igualdad-10",
 "prl-28", "prl-29", "prl-30", "prl-31", "prl-32", "prl-33", "prl-34",
]);

// Preguntas en el formato del banco: id «24.<ley>-<n>»; la explicación se busca por «<ley>-<n>».
export const lawQuestions = LAWS.flatMap(({ key, questions }) => questions.map(([question, answers, correct], index) => ({
 id: `24.${key}-${index + 1}`,
 number: index + 1,
 explanationId: `${key}-${index + 1}`,
 question,
 answers,
 correctAnswer: correct,
 explanation: "",
}))).filter(question => !HIDDEN.has(question.explanationId));

export const lawExplanations = Object.fromEntries(LAWS.flatMap(({ key, questions }) => questions.map(([, , correct, why, memo], index) => [
 `${key}-${index + 1}`,
 { respuestaCorrecta: LETTERS[correct], porQueLaCorrecta: why, claveMemorizar: memo },
])));
