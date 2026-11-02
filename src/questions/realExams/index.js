// Exámenes reales de convocatorias anteriores (aparte del banco de preguntas por temas).
import ibsalut2023 from "./ibsalut-2023.js";
import ibsalut2018 from "./ibsalut-2018.js";
import sas2025 from "./sas-2025.js";
import sas2023 from "./sas-2023.js";
import sas2021 from "./sas-2021.js";

export const REAL_EXAMS = [ibsalut2023, ibsalut2018, sas2025, sas2023, sas2021];
export const realExamById = id => REAL_EXAMS.find(exam => exam.id === id) ?? null;
