import questionBank from "../questions";

export const topics = [
  { id: 1, title: "Conceptos básicos" },
  { id: 2, title: "Líquidos biológicos" },
  { id: 3, title: "Análisis urinario y función renal" },
  { id: 4, title: "Función digestiva" },
  { id: 5, title: "Función hepática y proteínas" },
  { id: 6, title: "Enzimas" },
  { id: 7, title: "Técnicas Instrumentales" },
  { id: 8, title: "Hematología" },
  { id: 9, title: "Coagulación" },
  { id: 10, title: "Banco de sangre" },
  { id: 11, title: "Inmunología" },
  { id: 12, title: "Serología" },
  { id: 13, title: "Bacteriología" },
  { id: 14, title: "Parásitos, hongos y virus" },
  { id: 15, title: "Equilibrio ácido-base e iones" },
  { id: 16, title: "Metabolismo lipídico" },
  { id: 17, title: "Metabolismo hidratos de carbono" },
  { id: 18, title: "Hormonas" },
  { id: 19, title: "Genética" },
  { id: 20, title: "Reproducción y cribados" },
  { id: 21, title: "Drogas de abuso y Fármacos" },
  { id: 22, title: "Marcadores tumorales" },
  { id: 23, title: "Técnicas de laboratorio" },
];

const getTopicKey = (id) => `tema-${String(id).padStart(2, "0")}`;

export const getQuestionBank = (id) =>
  (questionBank[getTopicKey(id)] ?? []).map((question) =>
    question.topicId != null ? question : { ...question, topicId: id }
  );
