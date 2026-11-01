// Exámenes reales de convocatorias anteriores (aparte del banco de preguntas por temas).
import ibsalut2023 from "./ibsalut-2023.js";
import ibsalut2018 from "./ibsalut-2018.js";

export const REAL_EXAMS = [ibsalut2023, ibsalut2018];
export const realExamById = id => REAL_EXAMS.find(exam => exam.id === id) ?? null;
