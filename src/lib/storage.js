export const STORAGE_KEY = "labquiz.learning.v2";
export const TEST_SESSION_KEY = "labquiz.test-session.v1";

export const EMPTY_USER_DATA = {
  theme: "light",
  tests: 0,
  answered: 0,
  correct: 0,
  incorrect: 0,
  favorites: [],
  history: [],
  progress: {},
  streak: 0,
};

export const loadUserData = () => {
  try {
    return {
      ...EMPTY_USER_DATA,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    };
  } catch {
    return EMPTY_USER_DATA;
  }
};

export const saveUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("No se pudo guardar el progreso", error);
    return false;
  }
};

export const createBackup = (userData, exportedAt = new Date().toISOString()) => ({
  app: "LabQuiz 2.0",
  version: 1,
  exportedAt,
  data: userData,
});

export const parseBackup = (content) => {
  const parsed = JSON.parse(content);
  const data = parsed?.data ?? parsed;

  if (!data || typeof data !== "object" || Array.isArray(data)
    || !data.progress || typeof data.progress !== "object" || Array.isArray(data.progress)) {
    throw new Error("El archivo no contiene una copia válida de LabQuiz.");
  }

  return {
    ...EMPTY_USER_DATA,
    ...data,
    progress: data.progress,
    favorites: Array.isArray(data.favorites) ? data.favorites : [],
  };
};

export const loadSavedTest = () => {
  try {
    return JSON.parse(localStorage.getItem(TEST_SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

export const saveTestSession = (session) => {
  try {
    localStorage.setItem(TEST_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("No se pudo guardar el test en curso", error);
  }
};

export const clearTestSession = () => {
  try {
    localStorage.removeItem(TEST_SESSION_KEY);
  } catch (error) {
    console.error("No se pudo limpiar el test en curso", error);
  }
};

// Simulacro de examen en curso (se guarda aparte del test normal: tiene su propio reloj).
export const EXAM_SESSION_KEY = "labquiz.exam-session.v1";

export const loadSavedExam = () => {
  try {
    return JSON.parse(localStorage.getItem(EXAM_SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

export const saveExamSession = (session) => {
  try {
    localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("No se pudo guardar el examen en curso", error);
  }
};

export const clearExamSession = () => {
  try {
    localStorage.removeItem(EXAM_SESSION_KEY);
  } catch (error) {
    console.error("No se pudo limpiar el examen en curso", error);
  }
};

// Traslada el progreso y los favoritos de preguntas repetidas (ya retiradas del banco)
// a la pregunta que se conserva. Si las dos tienen progreso, suma los intentos.
export const migrateDuplicateProgress = (userData, aliases) => {
  const entries = Object.entries(aliases ?? {});
  const progress = userData?.progress ?? {};
  const favorites = Array.isArray(userData?.favorites) ? userData.favorites : [];
  if (!entries.some(([removed]) => progress[removed] || favorites.includes(removed))) return userData;

  const nextProgress = { ...progress };
  entries.forEach(([removed, kept]) => {
    const old = nextProgress[removed];
    if (!old) return;
    const current = nextProgress[kept];
    if (!current) {
      nextProgress[kept] = old;
    } else {
      const latest = (old.ultimaVezVista ?? 0) > (current.ultimaVezVista ?? 0) ? old : current;
      const maxDate = (a, b) => (Math.max(a ?? 0, b ?? 0) || null);
      nextProgress[kept] = {
        ...latest,
        vecesVista: (current.vecesVista ?? 0) + (old.vecesVista ?? 0),
        vecesAcertada: (current.vecesAcertada ?? 0) + (old.vecesAcertada ?? 0),
        vecesFallada: (current.vecesFallada ?? 0) + (old.vecesFallada ?? 0),
        ultimaVezAcertada: maxDate(current.ultimaVezAcertada, old.ultimaVezAcertada),
        ultimaVezFallada: maxDate(current.ultimaVezFallada, old.ultimaVezFallada),
      };
    }
    delete nextProgress[removed];
  });
  const nextFavorites = [...new Set(favorites.map((id) => aliases[id] ?? id))];
  return { ...userData, progress: nextProgress, favorites: nextFavorites };
};
