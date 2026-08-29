import blockOne from "./imports/topic-14_1-clean.json" with { type: "json" };
import blockTwo from "./imports/topic-14_2_3-clean.json" with { type: "json" };

const convertQuestions = (source, block) => source.questions
	.map((question) => {
		const optionKeys = Object.keys(question.options);
		return {
			id: `14.${block}-${question.id}`,
			number: question.id,
			question: question.question,
			answers: optionKeys.map((key) => question.options[key]),
			correctAnswer: optionKeys.indexOf(question.correctAnswer),
			explanation: "",
		};
	})
	// descarta preguntas con opciones truncadas/vacías en el JSON fuente
	.filter((question) => question.answers.every((answer) => answer.trim() !== ""));

export default [
	...convertQuestions(blockOne, 1),
	...convertQuestions(blockTwo, 2),
];
