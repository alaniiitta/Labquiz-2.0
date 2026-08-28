import source from "./imports/topic-05.json" with { type: "json" };

const questions = source.questions
	.map((question) => {
		const optionKeys = Object.keys(question.options);
		return {
			id: question.id,
			number: question.id,
			question: question.question,
			answers: optionKeys.map((key) => question.options[key]),
			correctAnswer: optionKeys.indexOf(question.correctAnswer),
			explanation: "",
		};
	})
	// descarta preguntas con opciones truncadas/vacías en el JSON fuente
	.filter((question) => question.answers.every((answer) => answer.trim() !== ""));

export default questions;
