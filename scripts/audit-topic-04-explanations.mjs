import fs from "node:fs";

const bank = JSON.parse(
  fs.readFileSync("src/questions/tema4_funcion_digestiva_questions.json", "utf8"),
);
const parts = Array.from({ length: 6 }, (_, index) =>
  JSON.parse(
    fs.readFileSync(
      `src/explanations/topic-04-parts/part-0${index + 1}.json`,
      "utf8",
    ),
  ),
);
const explanations = Object.assign({}, ...parts);
const errors = [];
const mainExplanations = new Map();

for (const question of bank.questions) {
  const id = String(question.id);
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

  if (JSON.stringify(explainedOptions) !== JSON.stringify(expectedOptions)) {
    errors.push(`Pregunta ${id}: los distractores no coinciden con el banco`);
  }

  for (const reason of Object.values(explanation.motivosPorOpcion ?? {})) {
    if (/porque (la )?(respuesta|opción) correcta|no es (la )?correcta/i.test(reason)) {
      errors.push(`Pregunta ${id}: contiene un motivo circular`);
    }
  }
}

const expectedIds = new Set(bank.questions.map(({ id }) => String(id)));
for (const id of Object.keys(explanations)) {
  if (!expectedIds.has(id)) errors.push(`Explicación ${id}: no existe en el banco`);
}

const warningIds = Object.entries(explanations)
  .filter(([, explanation]) => explanation.advertenciaRevision)
  .map(([id]) => Number(id));

console.log(
  JSON.stringify(
    {
      preguntas: bank.questions.length,
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