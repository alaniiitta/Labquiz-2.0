// Genera los bancos JSON de los temas 21-23 a partir de los PDFs con respuestas resaltadas.
// Uso: node scripts/import-pdf-topics.mjs
// OJO: sobrescribe los JSON de los temas 21-23 y deshace las correcciones manuales
// (palabras partidas, espacios) hechas después sobre ellos. Revisar el diff tras ejecutarlo.
// Solo se importan preguntas con exactamente una opción resaltada en amarillo.
import fs from "node:fs";
import { extractPdfPages, parseQuestionsFromPdfPages } from "../src/pdfReader.js";

const sources = [
  { tema: 21, block: "21_1", titulo: "Drogas de abuso", match: /tema 21\.1/i },
  { tema: 21, block: "21_2", titulo: "Fármacos", match: /tema 21\.2/i },
  { tema: 22, block: "22", titulo: "Marcadores tumorales", match: /tema 22/i },
  { tema: 23, block: "23_1", titulo: "Ética profesional y confidencialidad", match: /^23\..*tica profesional/i },
  { tema: 23, block: "23_2", titulo: "Principales riesgos y medidas de prevención", match: /^23\..*riesgos/i },
  { tema: 23, block: "23_3", titulo: "Epidemiología", match: /^23\..*epidemiolog/i },
  { tema: 23, block: "23_4", titulo: "Estadística", match: /^23\..*estadisticas/i },
  { tema: 23, block: "23_5", titulo: "Titulación ácido-base y gravimetría", match: /^23\..*titulaci/i },
];

const NOISE = [
  /\s*(?:PREGUNTAS|RESPUESTAS) DE EX[ÁA]MENES OFICIALES(?:\s+TEMAS?\s+[\d.]+\s*:\s*\S+)?/gi,
  /\s*_{3,}/g,
  /\s*Test tema \d+(?:\.\d+)?:\s*(?:Drogas de abuso|Fármacos)/gi,
  /\s*Test temas? 22 Marcadores tumorales/gi,
  /\s*:?\s*TEMA 23 (?:BALEARES: BIOÉTICA Y SECRETO PROFESIONAL|Principales riesgos y prevención)/gi,
  /\s*Comentario\..*$/g,
];
const REQUIRES_IMAGE = /\b(?:este|esta|la siguiente|el siguiente)\s+(?:pictograma|imagen|figura|gráfico|dibujo)\b/i;
const clean = (text) => NOISE.reduce((value, pattern) => value.replace(pattern, " "), text).replace(/\s+/g, " ").trim();

const pdfFiles = fs.readdirSync("pdfs").filter((file) => file.toLowerCase().endsWith(".pdf"));

for (const source of sources) {
  const file = pdfFiles.find((name) => source.match.test(name.normalize("NFC")));
  if (!file) throw new Error(`No se encuentra el PDF del bloque ${source.block}`);

  const parsed = parseQuestionsFromPdfPages(await extractPdfPages(`pdfs/${file}`));
  const questions = parsed
    // preguntas que dependen de una imagen del PDF: sin ella no se pueden responder
    .filter((question) => !REQUIRES_IMAGE.test(question.question))
    .map((question) => {
      const answers = question.answers.map(clean);
      // algunas opciones arrastran la explicación del PDF: se separa del texto de la opción
      let explanation = "";
      const lastIndex = answers.length - 1;
      const explanationMatch = answers[lastIndex].match(/^(.*?)\s*Explicaci[óo]n\.?\s*(.+)$/i);
      if (explanationMatch) {
        answers[lastIndex] = explanationMatch[1].trim();
        explanation = explanationMatch[2].trim();
      }
      const letters = ["A", "B", "C", "D"].slice(0, answers.length);
      return {
        id: question.number,
        question: clean(question.question),
        options: Object.fromEntries(letters.map((letter, index) => [letter, answers[index]])),
        correctAnswer: letters[question.correctAnswer],
        correctText: answers[question.correctAnswer],
        ...(explanation ? { explanation } : {}),
      };
    });

  const output = {
    tema: source.tema,
    titulo: source.titulo,
    source_file: file,
    total_questions: questions.length,
    questions,
  };
  const outputPath = `src/questions/imports/topic-${source.block}.json`;
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`${outputPath}: ${questions.length} preguntas`);
}
