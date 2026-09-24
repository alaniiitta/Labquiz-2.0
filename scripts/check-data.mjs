// Comprueba la integridad del banco de preguntas y de las explicaciones.
// Uso: npm run check:data   (sale con código 1 si encuentra errores)
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const errors = [];
const warnings = [];
const normalize = (value) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const compact = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9áéíóúñü]/g, "");
const LETTER_REFERENCE = /\b[A-D]\b\s*(?:,\s*(?:y|e|o)?|y|e|o)\s*\b[A-D]\b/;

try {
  const questionBank = (await server.ssrLoadModule("/src/questions/index.js")).default;
  const { getQuestionId, shuffleQuestionOptions } = await server.ssrLoadModule("/src/smartQuestionSelector.js");
  const { explainQuestion } = await server.ssrLoadModule("/src/lib/explainQuestion.js");

  let total = 0;
  for (const [topicKey, questions] of Object.entries(questionBank)) {
    const topicId = Number(topicKey.slice(5));
    const ids = new Set();
    const stems = new Set();
    let duplicates = 0;

    questions.forEach((question) => {
      const label = `${topicKey} pregunta ${question.id}`;
      const progressId = getQuestionId({ ...question, topicId });
      if (ids.has(progressId)) errors.push(`${label}: id de progreso duplicado (${progressId})`);
      ids.add(progressId);

      if (!normalize(question.question)) errors.push(`${label}: enunciado vacío`);
      if (!Array.isArray(question.answers) || question.answers.length < 2) errors.push(`${label}: menos de 2 opciones`);
      else if (question.answers.some((answer) => !normalize(answer))) errors.push(`${label}: opción vacía`);
      if (!Number.isInteger(question.correctAnswer) || question.correctAnswer < 0 || question.correctAnswer >= (question.answers?.length ?? 0)) {
        errors.push(`${label}: correctAnswer fuera de rango (${question.correctAnswer})`);
        return;
      }

      if (question.answers.some((answer) => LETTER_REFERENCE.test(answer)) && shuffleQuestionOptions(question) !== question) {
        errors.push(`${label}: tiene opciones que citan letras y aun así se barajan`);
      }

      const stemKey = `${normalize(question.question)}||${question.answers.map(normalize).sort().join("|")}`;
      if (stems.has(stemKey)) duplicates += 1;
      stems.add(stemKey);

      const explanation = explainQuestion(question, topicId);
      if (!explanation?.respuestaCorrecta) return;
      const expected = String(explanation.respuestaCorrecta).trim();
      const letter = String.fromCharCode(65 + question.correctAnswer);
      const matches = /^[A-E]\)?\.?$/.test(expected)
        ? expected[0] === letter
        : (() => {
          const a = compact(question.answers[question.correctAnswer]);
          const b = compact(expected.replace(/^[A-E]\)\s*/, ""));
          return b.includes(a.slice(0, 20)) || a.includes(b.slice(0, 20));
        })();
      if (!matches) errors.push(`${label}: la explicación no coincide con la respuesta correcta`);
    });

    if (duplicates) warnings.push(`${topicKey}: ${duplicates} preguntas repetidas (mismo enunciado y opciones)`);
    total += questions.length;
    console.log(`${topicKey}: ${questions.length} preguntas`);
  }

  console.log(`\nTotal: ${total} preguntas`);
} finally {
  await server.close();
}

warnings.forEach((warning) => console.warn(`⚠️  ${warning}`));
if (errors.length) {
  errors.forEach((error) => console.error(`❌ ${error}`));
  console.error(`\n${errors.length} errores encontrados`);
  process.exit(1);
}
console.log("✅ Banco de preguntas correcto");
