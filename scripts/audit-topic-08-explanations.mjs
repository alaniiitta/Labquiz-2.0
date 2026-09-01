import fs from "node:fs";

const banks = [
  { block: 1, path: "src/questions/imports/topic-08.json" },
  { block: 2, path: "src/questions/imports/topic-08_2.json" },
];
const parts = Array.from({ length: 12 }, (_, index) =>
  JSON.parse(
    fs.readFileSync(
      `src/explanations/topic-08-parts/part-${String(index + 1).padStart(2, "0")}.json`,
      "utf8",
    ),
  ),
);
const explanations = Object.assign({}, ...parts);
const errors = [];
const expectedIds = new Set();
const mainExplanations = new Map();
const sortOptions = (options) => [...options].sort((a, b) => a.localeCompare(b));
let questionCount = 0;

for (const bankConfig of banks) {
  const bank = JSON.parse(fs.readFileSync(bankConfig.path, "utf8"));

  for (const question of bank.questions) {
    questionCount += 1;
    const id = `${bankConfig.block}-${question.id}`;
    expectedIds.add(id);
    const explanation = explanations[id];

    if (!explanation) {
      errors.push(`Pregunta ${id}: falta la explicación`);
      continue;
    }

    if (explanation.respuestaCorrecta !== question.correctAnswer) {
      errors.push(`Pregunta ${id}: la respuesta correcta no coincide con el banco`);
    }

    for (const field of ["porQueLaCorrecta", "claveMemorizar", "fuente"]) {
      if (!explanation[field]?.trim()) {
        errors.push(`Pregunta ${id}: falta ${field}`);
      }
    }

    const previousId = mainExplanations.get(explanation.porQueLaCorrecta);
    if (previousId) {
      errors.push(
        `Preguntas ${previousId} y ${id}: explicación principal duplicada`,
      );
    }
    mainExplanations.set(explanation.porQueLaCorrecta, id);

    const expectedOptions = Object.entries(question.options)
      .filter(([key]) => key !== question.correctAnswer)
      .map(([, text]) => text);
    const explainedOptions = Object.keys(explanation.motivosPorOpcion ?? {});

    if (
      JSON.stringify(sortOptions(explainedOptions)) !==
      JSON.stringify(sortOptions(expectedOptions))
    ) {
      errors.push(`Pregunta ${id}: los distractores no coinciden con el banco`);
    }

    for (const reason of Object.values(explanation.motivosPorOpcion ?? {})) {
      if (/porque (la )?(respuesta|opción) correcta|no es (la )?correcta/i.test(reason)) {
        errors.push(`Pregunta ${id}: contiene un motivo circular`);
      }
    }
  }
}

for (const id of Object.keys(explanations)) {
  if (!expectedIds.has(id)) errors.push(`Explicación ${id}: no existe en el banco`);
}

const warningIds = Object.entries(explanations)
  .filter(([, explanation]) => explanation.advertenciaRevision)
  .map(([id]) => id);

console.log(
  JSON.stringify(
    {
      preguntas: questionCount,
      explicaciones: Object.keys(explanations).length,
      advertenciasRevision: warningIds.length,
      idsConAdvertencia: warningIds,
      errores: errors,
    },
    null,
    2,
  ),
);

if (errors.length) process.exitCode = 1;