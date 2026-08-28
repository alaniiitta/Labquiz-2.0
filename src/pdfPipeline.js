import { extractTextFromPdf, parseQuestionsFromPdfText } from './pdfReader.js';

export async function parsePdfQuestions(filePath) {
  const rawText = await extractTextFromPdf(filePath);
  const questions = parseQuestionsFromPdfText(rawText);
  return questions;
}

export async function loadPdfQuestionsFromFolder(fileList) {
  const results = {};

  for (const file of fileList) {
    const key = file.name.replace(/\.[^/.]+$/, '').toLowerCase();
    results[key] = await parsePdfQuestions(file.url || file.path || file);
  }

  return results;
}
