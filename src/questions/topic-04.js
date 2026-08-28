import source from "./tema4_funcion_digestiva_questions.json" with { type: "json" };

const questions = source.questions.map((question) => {
	const optionKeys = Object.keys(question.options);

	return {
		id: question.id,
		number: question.id,
		question: question.question,
		answers: optionKeys.map((key) => question.options[key]),
		correctAnswer: optionKeys.indexOf(question.correctAnswer),
		explanation: "",
	};
});

export default questions;
