import blockOne from "./imports/topic-23_1.json" with { type: "json" };
import blockTwo from "./imports/topic-23_2.json" with { type: "json" };
import blockThree from "./imports/topic-23_3.json" with { type: "json" };
import blockFour from "./imports/topic-23_4.json" with { type: "json" };
import blockFive from "./imports/topic-23_5.json" with { type: "json" };

const convertQuestions = (source, block) => source.questions
	.map((question) => {
		const optionKeys = Object.keys(question.options);
		return {
			id: `23.${block}-${question.id}`,
			number: question.id,
			question: question.question,
			answers: optionKeys.map((key) => question.options[key]),
			correctAnswer: optionKeys.indexOf(question.correctAnswer),
			explanation: question.explanation ?? "",
		};
	})
	// descarta preguntas con opciones truncadas/vacías en el JSON fuente
	.filter((question) => question.answers.every((answer) => answer.trim() !== ""));

export default [
	...convertQuestions(blockOne, 1),
	...convertQuestions(blockTwo, 2),
	...convertQuestions(blockThree, 3),
	...convertQuestions(blockFour, 4),
	...convertQuestions(blockFive, 5),
];
