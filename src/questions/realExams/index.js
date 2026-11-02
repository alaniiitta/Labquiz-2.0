// Exámenes reales de convocatorias anteriores (aparte del banco de preguntas por temas).
// group: "baleares" (IB-Salut, la convocatoria de la usuaria) u "other" (otras comunidades).
import ibsalut2023 from "./ibsalut-2023.js";
import ibsalut2018 from "./ibsalut-2018.js";
import sas2025 from "./sas-2025.js";
import sas2023 from "./sas-2023.js";
import sas2021 from "./sas-2021.js";
import cantabria2026 from "./cantabria-2026.js";
import cantabria2025 from "./cantabria-2025.js";
import cantabria2024 from "./cantabria-2024.js";
import hgv2024 from "./hgv-2024.js";
import sacyl2023 from "./sacyl-2023.js";
import aragon2022 from "./aragon-2022.js";
import cvalenciana2022 from "./cvalenciana-2022.js";
import sescam2022 from "./sescam-2022.js";
import sescam2022Extra from "./sescam-2022-extra.js";
import costaSol2021 from "./costa-sol-2021.js";
import sermas2019 from "./sermas-2019.js";
import asturias2019 from "./asturias-2019.js";
import sacyl2019 from "./sacyl-2019.js";
import hgv2017 from "./hgv-2017.js";

const BALEARES = [ibsalut2023, ibsalut2018].map(exam => ({ ...exam, group: "baleares" }));
// otras comunidades, de la más reciente a la más antigua
const OTHER = [cantabria2026, cantabria2025, cantabria2024, sas2025, hgv2024, sacyl2023, sas2023, aragon2022, cvalenciana2022, sescam2022, sescam2022Extra, costaSol2021, sas2021, sermas2019, asturias2019, sacyl2019, hgv2017].map(exam => ({ ...exam, group: "other" }));

export const REAL_EXAMS = [...BALEARES, ...OTHER];
export const REAL_EXAM_GROUPS = [
 { id: "baleares", title: "IB-Salut (Baleares)" },
 { id: "other", title: "Otras comunidades" },
];
export const realExamById = id => REAL_EXAMS.find(exam => exam.id === id) ?? null;
