import fs from "node:fs";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const topic = process.env.TOPIC ?? "4";
const topicFiles = {
	4: {
		pdfPath: "pdfs/Test tema 4 Funcion digestiva (respuestas).pdf",
		jsonPath: "src/questions/tema4_funcion_digestiva_questions.json",
	},
	5: {
		pdfPath: "pdfs/Test tema 5 Función hepática y proteínas (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-05.json",
	},
	6: {
		pdfPath: "pdfs/Test tema 6 Enzimas (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-06.json",
	},
	7: {
		pdfPath: "pdfs/Test tema 7 tecnicas instrumentales (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-07.json",
	},
	"8.1": {
		pdfPath:
			"pdfs/Test tema 8.1 Fisiología y metabolismo eritrocitario (respuestas)_652efe00ac2bfe331bbd1c9740877f68.pdf",
		jsonPath: "src/questions/imports/topic-08.json",
	},
	"8.2": {
		pdfPath:
			"pdfs/TEST Tema 8.2 Fisiología y metabolismo leucocitario y plaquetar (respuestas)_d37190aae644347653d96c6922afb89b.pdf",
		jsonPath: "src/questions/imports/topic-08_2.json",
	},
	9: {
		pdfPath: "pdfs/Test tema 9 Coagulación (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-09.json",
	},
	10: {
		pdfPath: "pdfs/TEST tema 10 Banco de sangre (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-10.json",
	},
	11: {
		pdfPath: "pdfs/TEST tema 11 Inmunología (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-11-clean.json",
	},
	12: {
		pdfPath: "pdfs/TEST tema 12 serología (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-12-clean.json",
	},
	"13.1_5": {
		pdfPath:
			"pdfs/TEST 13.1 y 13.5 Microbiología patógenos (respuestas) v2.pdf",
		jsonPath: "src/questions/imports/topic-13_1_5-clean.json",
	},
	"13.2": {
		pdfPath:
			"pdfs/TEST 13.2 Tinciones, bioquímica, morfología (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-13_2-clean.json",
	},
	"13.3_4": {
		pdfPath:
			"pdfs/TEST 13.3 y 13.4 Medios de cultivo, siembras y antibiograma (respuestas) v2.pdf",
		jsonPath: "src/questions/imports/topic-13_3_4-clean.json",
	},
	"13.6_8": {
		pdfPath:
			"pdfs/TEST 13.6 al 13.8 Enfermedades bacterianas (respuestas).pdf",
		jsonPath: "src/questions/imports/topic-13_6_8-clean.json",
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
		.replace(/\bheteró filos\b/g, "heterófilos")
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
		const standardMatch = combined.match(/^([A-E])\s*[).]/i);
		const unpunctuatedMatch = combined.match(/^([D])\s+[A-ZÁÉÍÓÚÑ]/);
		const inferredKey =
			topic === "4" &&
			items[0]?.str.trim() === "206." &&
			expectedKey === "D" &&
			current === "El"
				? "D"
				: undefined;
		const key = (
			standardMatch?.[1] ??
			unpunctuatedMatch?.[1] ??
			inferredKey
		)?.toUpperCase();

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

function normalizeOptionLabels(question) {
	return question.items.map((item, index) => {
		let text = item.str;

		if (topic === "9" && question.id === 96 && text.startsWith("E)")) {
			text = text.replace(/^E\)/, "C)");
		}
		if (
			topic === "9" &&
			((question.id === 118 && index === 14) ||
				(question.id === 228 && index === 9))
		) {
			text = text.replace(/^D\)/, "C)");
		}
		if (topic === "9" && question.id === 124) {
			const keyByIndex = new Map([
				[5, "A"],
				[7, "B"],
				[9, "C"],
				[11, "D"],
			]);
			const key = keyByIndex.get(index);
			if (key) text = `${key}) ${text}`;
		}
		if (topic === "11" && question.id === 292 && index === 39) {
			text = text.replace(/^A\s+/, "A) ");
		}
		if (topic === "13.1_5" && question.id === 139) {
			const keyByIndex = new Map([
				[7, "B"],
				[9, "C"],
				[11, "D"],
			]);
			const key = keyByIndex.get(index);
			if (key) text = `${key}) ${text}`;
		}
		if (topic === "13.1_5" && question.id === 212 && index === 12) {
			text = text.replace(/^D$/, "C");
		}
		if (topic === "13.2" && question.id === 8 && index === 6) {
			text = text.replace(/^B\s+/, "B) ");
		}
		if (topic === "13.3_4" && question.id === 155 && index === 8) {
			text = text.replace(/^D\)/, "C)");
		}

		return text === item.str ? item : { ...item, str: text };
	});
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
		if (verticalPosition > 760 || verticalPosition < 100) continue;

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
	const normalizedItems = normalizeOptionLabels(question);
	let extraQuestionIndex = -1;
	if (topic === "8.2" && question.id === 222) {
		extraQuestionIndex = normalizedItems.findIndex(
			(item) => item.str.trim() === "1.",
		);
	}
	if (topic === "13.1_5" && question.id === 139) extraQuestionIndex = 13;
	if (topic === "13.1_5" && question.id === 290) extraQuestionIndex = 26;
	const questionItems =
		extraQuestionIndex > 0
			? normalizedItems.slice(0, extraQuestionIndex)
			: normalizedItems;
	const markers = findOptionMarkers(questionItems);
	if (markers.length < 3 || markers.length > 5) {
		errors.push(`Pregunta ${question.id}: detectadas ${markers.length} opciones`);
		continue;
	}

	const questionText = joinItems(
		questionItems.slice(1, markers[0].index),
	);
	const options = {};
	for (let index = 0; index < markers.length; index += 1) {
		const marker = markers[index];
		const end = markers[index + 1]?.index ?? questionItems.length;
		const optionText = joinItems(questionItems.slice(marker.index, end));
		const cleanedOptionText = marker.inferred
			? optionText
			: optionText
					.replace(/^[A-E](?:\s*[).]|\s+(?=[A-ZÁÉÍÓÚÑ]))\s*/i, "")
					.trim();
		options[marker.key] = cleanedOptionText
			.replace(/\s+(?:NOTA|COMENTARIO|EXPLICACIÓN)\s*[.:]\s.*$/i, "")
			.trim();
	}

	const highlightScores = markers.map((marker) => {
		const markerIndex = markers.indexOf(marker);
		const end = markers[markerIndex + 1]?.index ?? questionItems.length;
		const score = questionItems
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