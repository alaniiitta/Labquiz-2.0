import blockOne from "./imports/topic-13_1_5-clean.json" with { type: "json" };
import blockTwo from "./imports/topic-13_2-clean.json" with { type: "json" };
import blockThree from "./imports/topic-13_3_4-clean.json" with { type: "json" };
import blockFour from "./imports/topic-13_6_8-clean.json" with { type: "json" };

// preguntas retiradas por estar mal planteadas (se conserva el ID del resto)
// 13.3-322: pide quién necesita los factores V y X y Haemophilus no está entre las opciones
const retiredIds = new Set(["13.3-322"]);

const convertQuestions = (source, block) => source.questions
	.map((question) => {
		const optionKeys = Object.keys(question.options);
		return {
			id: `13.${block}-${question.id}`,
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
	...convertQuestions(blockThree, 3),
	...convertQuestions(blockFour, 4),
];
