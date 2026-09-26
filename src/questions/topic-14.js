import blockOne from "./imports/topic-14_1-clean.json" with { type: "json" };
import blockTwo from "./imports/topic-14_2_3-clean.json" with { type: "json" };

// preguntas retiradas por estar mal planteadas (se conserva el ID del resto)
// 14.1-84: da «pigmento de Maurer» como el pigmento de neutrófilos y monocitos; es la hemozoína
const retiredIds = new Set(["14.1-84"]);

const convertQuestions = (source, block) => source.questions
	.map((question) => {
		const optionKeys = Object.keys(question.options);
		return {
			id: `14.${block}-${question.id}`,
			number: question.id,
			// los números se repiten entre bloques: la explicación se busca por bloque-número
			explanationId: `${block}-${question.id}`,
			question: question.question,
			answers: optionKeys.map((key) => question.options[key]),
			correctAnswer: optionKeys.indexOf(question.correctAnswer),
			explanation: "",
		};
	})
	// descarta preguntas con opciones truncadas/vacías en el JSON fuente
	.filter((question) => question.answers.every((answer) => answer.trim() !== ""))
	.filter((question) => !retiredIds.has(question.id));

export default [
	...convertQuestions(blockOne, 1),
	...convertQuestions(blockTwo, 2),
];
