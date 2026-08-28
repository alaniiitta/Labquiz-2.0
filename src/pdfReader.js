import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { OPS } from 'pdfjs-dist/legacy/build/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = (typeof window === 'undefined'
  ? new URL('../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url)
  : new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url)
).toString();

const OPTION_PATTERN = /^([A-D])[.)]\s*(.*)$/i;
const QUESTION_PATTERN = /^(\d{1,3})[.)]\s*(.*)$/;

export function normalizeQuestionText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function getPathRect(pathArgs) {
  const bounds = pathArgs?.[2];
  if (bounds && [bounds[0], bounds[1], bounds[2], bounds[3]].every(Number.isFinite)) {
    return [bounds[0], bounds[1], bounds[2], bounds[3]];
  }

  const rect = pathArgs?.find((value) => value && typeof value.length === 'number'
    && value.length === 4 && [...value].every(Number.isFinite));
  return rect ? [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]] : null;
}

function getYellowRects(operatorList) {
  const rectangles = [];
  let yellowFill = false;

  operatorList.fnArray.forEach((fn, index) => {
    if (fn === OPS.setFillRGBColor) {
      yellowFill = JSON.stringify(operatorList.argsArray[index]) === '["#ffff00"]';
      return;
    }

    if (yellowFill && fn === OPS.constructPath) {
      const rect = getPathRect(operatorList.argsArray[index]);
        if (rect && Math.abs(rect[2] - rect[0]) < 500 && Math.abs(rect[3] - rect[1]) < 500) rectangles.push([...rect]);
    }
  });

  return rectangles.map(([x1, y1, x2, y2]) => ({
    left: Math.min(x1, x2),
    right: Math.max(x1, x2),
    bottom: Math.min(y1, y2),
    top: Math.max(y1, y2),
  }));
}

function groupTextItems(items) {
  const lines = [];

  items.filter((item) => normalizeQuestionText(item.str)).forEach((item) => {
    const [scaleX, , , scaleY, x, y] = item.transform;
    const height = Math.abs(scaleY) || item.height || 10;
    const column = x < 290 ? 'left' : 'right';
    const current = lines.find((line) => line.column === column && Math.abs(line.baseline - y) < 2);

    if (current) {
      current.items.push({
        text: item.str,
        left: x,
        right: x + item.width,
        bottom: y,
        top: y + height,
        column,
      });
      current.items.sort((a, b) => a.left - b.left);
      current.text = normalizeQuestionText(current.items.map((part) => part.text).join(' '));
      current.left = Math.min(current.left, x);
      current.right = Math.max(current.right, x + item.width);
      current.bottom = Math.min(current.bottom, y);
      current.top = Math.max(current.top, y + height);
    } else {
      lines.push({
        baseline: y,
        column,
        text: normalizeQuestionText(item.str),
        left: x,
        right: x + item.width,
        bottom: y,
        top: y + height,
        items: [{ text: item.str, left: x, right: x + item.width, bottom: y, top: y + height }],
      });
    }
  });

  return lines.sort((a, b) => b.baseline - a.baseline);
}

function lineIsHighlighted(line, rectangles) {
  return rectangles.some((rect) => {
    const horizontalOverlap = line.right > rect.left && line.left < rect.right;
    const verticalOverlap = line.top > rect.bottom && line.bottom < rect.top;
    return horizontalOverlap && verticalOverlap;
  });
}

function orderLinesByColumns(lines) {
  const leftColumn = lines.filter((line) => line.left < 290);
  const rightColumn = lines.filter((line) => line.left >= 290);
  const byReadingOrder = (a, b) => b.baseline - a.baseline;
  const deferredQuestions = [];
  const expandLines = (columnLines, isLeftColumn) => columnLines
    .sort(byReadingOrder)
    .flatMap((line) => {
      const embeddedQuestion = isLeftColumn && line.left < 50
        ? line.text.match(/\s+(\d{1,3})[.)]\s+(.+)$/)
        : null;
      if (!embeddedQuestion) return [line];

      const questionStart = line.text.lastIndexOf(embeddedQuestion[0]);
      const optionLine = { ...line, text: line.text.slice(0, questionStart).trim() };
      deferredQuestions.push({
        ...line,
        text: `${embeddedQuestion[1]}. ${embeddedQuestion[2]}`,
        left: 290,
      });
      return [optionLine];
    });

  return [...expandLines(leftColumn, true), ...deferredQuestions, ...expandLines(rightColumn, false)];
}

function isNoiseLine(text) {
  return /^(Página \d+ de \d+|RESPUESTAS DE EXÁMENES OFICIALES|Test tema \d+:|Academia Contraste de Fases|Síguenos:)/i.test(text);
}

export async function extractPdfPages(fileUrl) {
  const source = typeof fileUrl === 'string' ? { url: fileUrl } : fileUrl;
  const options = typeof window === 'undefined'
    ? { ...source, disableWorker: true }
    : source;
  const pdf = await pdfjsLib.getDocument(options).promise;
  const pages = [];

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const [textContent, operatorList] = await Promise.all([
      page.getTextContent(),
      page.getOperatorList(),
    ]);
    pages.push({
      lines: groupTextItems(textContent.items),
      yellowRects: getYellowRects(operatorList),
    });
  }

  return pages;
}

export async function extractTextFromPdf(fileUrl) {
  const pages = await extractPdfPages(fileUrl);
  return pages.map((page) => page.lines.map((line) => line.text).join('\n')).join('\n\n');
}

export function parseQuestionsFromPdfPages(pages = []) {
  const questions = [];
  let currentQuestion = null;
  let currentOption = null;

  pages.forEach((page, pageIndex) => {
    orderLinesByColumns(page.lines).forEach((line) => {
      if (isNoiseLine(line.text)) return;
      const cleanLine = {
        ...line,
        text: line.text.replace(/(?:^|\s+)(?:Academia Contraste de Fases|Síguenos:|https?:\/\/|www\.)[^]*$/i, '').trim(),
      };
      const questionMatch = (cleanLine.left < 30 || (cleanLine.left >= 290 && cleanLine.left < 310))
        ? cleanLine.text.match(QUESTION_PATTERN)
        : null;
      const optionMatch = cleanLine.text.match(OPTION_PATTERN);

      if (questionMatch) {
        if (currentQuestion && currentQuestion.answers.every(Boolean)) questions.push(currentQuestion);
        currentQuestion = {
          number: Number(questionMatch[1]),
          question: normalizeQuestionText(questionMatch[2]),
          answers: ['', '', '', ''],
          correctAnswer: null,
          explanation: '',
          optionLines: [],
        };
        currentOption = null;
        return;
      }

      if (!currentQuestion) return;

      if (optionMatch) {
        const optionIndex = optionMatch[1].toUpperCase().charCodeAt(0) - 65;
        currentOption = optionIndex;
        currentQuestion.answers[optionIndex] = normalizeQuestionText(optionMatch[2]);
        currentQuestion.optionLines[optionIndex] = { pageIndex, line: cleanLine };
        if (lineIsHighlighted(cleanLine, page.yellowRects)) currentQuestion.correctAnswer = optionIndex;
        return;
      }

      if (currentOption !== null) {
        currentQuestion.answers[currentOption] = normalizeQuestionText(`${currentQuestion.answers[currentOption]} ${cleanLine.text}`);
      } else {
        currentQuestion.question = normalizeQuestionText(`${currentQuestion.question} ${cleanLine.text}`);
      }
    });

  });

  if (currentQuestion && currentQuestion.answers.every(Boolean)) questions.push(currentQuestion);

  return questions.map(({ optionLines, number, ...question }) => ({
    id: number,
    number,
    ...question,
    explanation: question.explanation || 'Respuesta identificada automáticamente por el resaltado amarillo del PDF.',
  }));
}

export function parseQuestionsFromPdfText(rawText = '') {
  const pages = rawText.split(/\n{2,}/).map((text) => ({
    lines: text.split('\n').map((line) => ({ text: normalizeQuestionText(line) })).filter((line) => line.text),
    yellowRects: [],
  }));
  return parseQuestionsFromPdfPages(pages);
}
