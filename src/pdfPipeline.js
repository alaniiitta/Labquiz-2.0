import { extractPdfPages, parseQuestionsFromPdfPages } from './pdfReader.js';

export async function parsePdfQuestions(filePath) {
  return parseQuestionsFromPdfPages(await extractPdfPages(filePath));
}

export async function loadPdfQuestionsFromFolder(fileList) {
  const results = {};

  for (const file of fileList) {
    const name = file.name || file.path || file.url || '';
    const topicMatch = name.match(/(?:tema|topic)[-_\s]*(\d{1,2})/i);
    if (!topicMatch) continue;
    const topicKey = `tema-${String(topicMatch[1]).padStart(2, '0')}`;
    results[topicKey] = await parsePdfQuestions(file.url || file.path || file);
  }

  return results;
}
