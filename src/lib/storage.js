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
  } catch (error) {
    console.error("No se pudo guardar el progreso", error);
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
