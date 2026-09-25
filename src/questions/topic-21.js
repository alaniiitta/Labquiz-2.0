import blockOne from "./imports/topic-21_1.json" with { type: "json" };
import blockTwo from "./imports/topic-21_2.json" with { type: "json" };

// El bloque 21.1 conserva el id numérico que usaba la lectura del PDF en tiempo real,
// para no perder el progreso ya guardado.
const convertQuestions = (source, getId, block) => source.questions
	.map((question) => {
		const optionKeys = Object.keys(question.options);
		return {
			id: getId(question),
			number: question.id,
			// los números se repiten entre bloques: la explicación se busca por bloque-número
			explanationId: `${block}-${question.id}`,
			question: question.question,
			answers: optionKeys.map((key) => question.options[key]),
			correctAnswer: optionKeys.indexOf(question.correctAnswer),
			explanation: question.explanation ?? "",
		};
	})
	// descarta preguntas con opciones truncadas/vacías en el JSON fuente
	.filter((question) => question.answers.every((answer) => answer.trim() !== ""));

export default [
	...convertQuestions(blockOne, (question) => question.id, 1),
	...convertQuestions(blockTwo, (question) => `21.2-${question.id}`, 2),
];
