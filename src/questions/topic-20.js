import blockOneTwo from "./imports/topic-20_1_2-clean.json" with { type: "json" };
import blockThree from "./imports/topic-20_3.json" with { type: "json" };

// 20.1 y 20.2 (reproducción y seminograma) conservan sus IDs numéricos de siempre para no perder
// el progreso guardado; las de 20.3 (cribados) llevan el prefijo «20.3-» para no chocar con ellas.
const convertQuestions = (source, idFor, explanationFor) => source.questions
	.map((question) => {
		const optionKeys = Object.keys(question.options);
		return {
			id: idFor(question.id),
			number: question.id,
			explanationId: explanationFor(question.id),
			question: question.question,
			answers: optionKeys.map((key) => question.options[key]),
			correctAnswer: optionKeys.indexOf(question.correctAnswer),
			explanation: "",
		};
	})
	// descarta preguntas con opciones truncadas/vacías en el JSON fuente
	.filter((question) => question.answers.every((answer) => answer.trim() !== ""));

// Preguntas cuya clave oficial choca con la de otra pregunta: la respuesta oficial se marca con un
// asterisco mientras se responde (12 acepta «punción venosa en el talón»; 44 la rechaza).
const STARRED = new Set(["20.3-12", "20.3-44"]);

export default [
	...convertQuestions(blockOneTwo, (id) => id, (id) => id),
	...convertQuestions(blockThree, (id) => `20.3-${id}`, (id) => `3-${id}`),
].map((question) => (STARRED.has(question.id) ? { ...question, starCorrect: true } : question));
