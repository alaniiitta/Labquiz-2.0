import fs from "node:fs";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const topic = Number(process.env.TOPIC ?? 4);
const topicFiles = {
	4: {
		pdfPath: "pdfs/Test tema 4 Funcion digestiva (respuestas).pdf",
		jsonPath: "src/questions/tema4_funcion_digestiva_questions.json",
	},
	5: {
		pdfPath: "pdfs/Test tema 5 Función hepática y proteínas (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-05.json",
	},
};
const files = topicFiles[topic];

if (!files) throw new Error(`El tema ${topic} no está configurado`);

const { pdfPath, jsonPath } = files;
const optionKeys = ["A", "B", "C", "D", "E"];
const scale = 2;

function normalizeText(value) {
	return value
		.normalize("NFC")
		.replace(/_+/g, " ")
		.replace(/\s+/g, " ")
		.replace(/\s+([,.;:?!])/g, "$1")
		.replace(/([¿¡])\s+/g, "$1")
		.replace(/\btrioleí na\b/g, "trioleína")
		.replace("marcador de.la pérdida", "marcador de .la pérdida")
		.trim();
}

function joinItems(items) {
	let result = "";
	let previous;

	for (const item of items) {
		if (!item.str) continue;

		let separator = "";
		if (previous) {
			const sameLine =
				item.page === previous.page &&
				Math.abs(item.transform[5] - previous.transform[5]) < 1;
			const gap = item.transform[4] - (previous.transform[4] + previous.width);
			separator = sameLine && gap < 1.5 ? "" : " ";
		}

		result += separator + item.str;
		previous = item;
	}

	return normalizeText(result);
}

function findOptionMarkers(items) {
	const markers = [];

	for (let index = 0; index < items.length; index += 1) {
		const current = items[index].str.trim();
		const next = items[index + 1]?.str.trim() ?? "";
		const expectedKey = optionKeys[markers.length];
		const combined = `${current}${next}`;
		const standardMatch = combined.match(/^([A-E])\s*[).]/);
		const unpunctuatedMatch = combined.match(/^([D])\s+[A-ZÁÉÍÓÚÑ]/);
		const inferredKey =
			topic === 4 &&
			items[0]?.str.trim() === "206." &&
			expectedKey === "D" &&
			current === "El"
				? "D"
				: undefined;
		const key = standardMatch?.[1] ?? unpunctuatedMatch?.[1] ?? inferredKey;

		if (key && key === expectedKey) {
			markers.push({ key, index, inferred: Boolean(inferredKey) });
		}
	}

	return markers;
}

function yellowPixelCount(context, viewport, item) {
	const x = Math.max(0, Math.floor(item.transform[4] * scale));
	const y = Math.max(
		0,
		Math.floor((viewport.height / scale - item.transform[5] - 8) * scale),
	);
	const width = Math.max(8, Math.ceil(Math.max(item.width, 5) * scale));
	const height = Math.min(24, viewport.height - y);
	const pixels = context.getImageData(x, y, width, height).data;
	let count = 0;

	for (let index = 0; index < pixels.length; index += 4) {
		if (
			pixels[index] > 240 &&
			pixels[index + 1] > 220 &&
			pixels[index + 2] < 40
		) {
			count += 1;
		}
	}

	return count;
}

const source = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const pdf = await getDocument({
	data: new Uint8Array(fs.readFileSync(pdfPath)),
}).promise;
const questions = [];
const pageRenderings = new Map();
let expectedId = 1;
let currentQuestion;

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
	const page = await pdf.getPage(pageNumber);
	const textContent = await page.getTextContent();
	const viewport = page.getViewport({ scale });
	const canvas = createCanvas(viewport.width, viewport.height);
	const context = canvas.getContext("2d");
	await page.render({ canvasContext: context, viewport }).promise;
	pageRenderings.set(pageNumber, { context, viewport });

	for (const rawItem of textContent.items) {
		const item = { ...rawItem, page: pageNumber };
		const verticalPosition = item.transform[5];
		if (verticalPosition > 750 || verticalPosition < 100) continue;

		if (item.str.trim() === `${expectedId}.`) {
			currentQuestion = { id: expectedId, page: pageNumber, items: [] };
			questions.push(currentQuestion);
			expectedId += 1;
		}

		if (currentQuestion) currentQuestion.items.push(item);
	}
}

const parsed = [];
const errors = [];

for (const question of questions) {
	const markers = findOptionMarkers(question.items);
	if (markers.length < 3 || markers.length > 5) {
		errors.push(`Pregunta ${question.id}: detectadas ${markers.length} opciones`);
		continue;
	}

	const questionText = joinItems(
		question.items.slice(1, markers[0].index),
	);
	const options = {};
	for (let index = 0; index < markers.length; index += 1) {
		const marker = markers[index];
		const end = markers[index + 1]?.index ?? question.items.length;
		const optionText = joinItems(question.items.slice(marker.index, end));
		const cleanedOptionText = marker.inferred
			? optionText
			: optionText.replace(/^[A-E](?:\s*[).]|\s+(?=[A-ZÁÉÍÓÚÑ]))\s*/, "").trim();
		options[marker.key] = cleanedOptionText
			.replace(/\s+NOTA:\s.*$/i, "")
			.trim();
	}

	const highlightScores = markers.map((marker) => {
		const markerIndex = markers.indexOf(marker);
		const end = markers[markerIndex + 1]?.index ?? question.items.length;
		const score = question.items
			.slice(marker.index, end)
			.filter((item) => item.str.trim())
			.reduce((total, item) => {
				const rendering = pageRenderings.get(item.page);
				return (
					total + yellowPixelCount(rendering.context, rendering.viewport, item)
				);
			}, 0);
		return { ...marker, score };
	});
	const maximumScore = Math.max(...highlightScores.map(({ score }) => score));
	const highlighted = highlightScores.filter(
		({ score }) => score === maximumScore && score > 0,
	);

	if (highlighted.length !== 1) {
		errors.push(
			`Pregunta ${question.id}: detectadas ${highlighted.length} respuestas amarillas`,
		);
		continue;
	}

	const correctAnswer = highlighted[0].key;
	parsed.push({
		id: question.id,
		question: questionText,
		options,
		page: question.page,
		correctAnswer,
		correctText: options[correctAnswer],
	});
}

const changedQuestions = parsed.filter((question) => {
	const previous = source.questions.find((item) => item.id === question.id);
	return JSON.stringify(previous) !== JSON.stringify(question);
});
const changedAnswers = parsed.filter((question) => {
	const previous = source.questions.find((item) => item.id === question.id);
	return previous?.correctAnswer !== question.correctAnswer;
});

console.log(
	JSON.stringify(
		{
			pdfPages: pdf.numPages,
			questionMarkers: questions.length,
			parsedQuestions: parsed.length,
			errors,
			changedQuestions: changedQuestions.length,
			changedAnswers: changedAnswers.map((question) => ({
				id: question.id,
				before: source.questions.find((item) => item.id === question.id)
					?.correctAnswer,
				after: question.correctAnswer,
			})),
		},
		null,
		2,
	),
);

if (process.argv.includes("--write")) {
	if (errors.length || parsed.length !== source.total_questions) {
		throw new Error("No se escribe el JSON porque la auditoría no es completa");
	}

	fs.writeFileSync(
		jsonPath,
		`${JSON.stringify({ ...source, questions: parsed }, null, 2)}\n`,
	);
}