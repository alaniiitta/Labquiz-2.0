import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export async function extractTextFromPdf(fileUrl) {
  const loadingTask = pdfjsLib.getDocument(fileUrl);
  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const textContent = await page.getTextContent();
    pages.push(
      textContent.items
        .map((item) => item.str)
        .join(' ')
    );
  }

  return pages.join('\n\n');
}

export function normalizeQuestionText(value = '') {
  return String(value)
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseQuestionsFromPdfText(rawText = '') {
  const text = rawText.replace(/\r/g, '');
  const blocks = text.split(/(?=\b(?:Pregunta|PREGUNTA|Q\d+|\d+\s*\)))/i).filter(Boolean);

  return blocks.map((block) => {
    const cleaned = block.replace(/\s+/g, ' ').trim();

    const answerMatch = cleaned.match(/(?:A\)|A\.|A\s*[-:]\s*)([^;\n]+)/i);
    const bMatch = cleaned.match(/(?:B\)|B\.|B\s*[-:]\s*)([^;\n]+)/i);
    const cMatch = cleaned.match(/(?:C\)|C\.|C\s*[-:]\s*)([^;\n]+)/i);
    const dMatch = cleaned.match(/(?:D\)|D\.|D\s*[-:]\s*)([^;\n]+)/i);

    const questionMatch = cleaned.match(/(?:Pregunta\s*[:\-]?|PREGUNTA\s*[:\-]?|Q\d+\s*[:\-]?)(.*?)(?=\s*(?:A\)|A\.|A\s*[-:])|$)/i);
    const correctMatch = cleaned.match(/(?:respuesta\s*correcta|correcta|marcada\s*en\s*amarillo|amarillo)\s*[:\-]?\s*([A-D])/i);

    const question = questionMatch ? normalizeQuestionText(questionMatch[1]) : normalizeQuestionText(cleaned);
    const answers = [
      answerMatch ? normalizeQuestionText(answerMatch[1]) : '',
      bMatch ? normalizeQuestionText(bMatch[1]) : '',
      cMatch ? normalizeQuestionText(cMatch[1]) : '',
      dMatch ? normalizeQuestionText(dMatch[1]) : ''
    ];

    const correctLetter = correctMatch ? correctMatch[1].toUpperCase() : null;
    const correctAnswer = correctLetter ? { A: 0, B: 1, C: 2, D: 3 }[correctLetter] ?? null : null;

    return {
      question: question || 'Pregunta sin texto',
      answers,
      correctAnswer,
      explanation: 'Se detectará automáticamente con la respuesta marcada en amarillo tras procesar el PDF.',
    };
  }).filter((entry) => entry.answers.some(Boolean));
}
