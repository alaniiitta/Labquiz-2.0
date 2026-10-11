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
  // aclaraciones propias por pregunta: { [id de progreso]: { text, updatedAt } }
  notes: {},
  streak: 0,
};

const isPlainObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);
// Solo conserva aclaraciones con texto; descarta lo que no tenga la forma esperada.
export const sanitizeNotes = (notes) => Object.fromEntries(
  Object.entries(isPlainObject(notes) ? notes : {})
    .filter(([, note]) => isPlainObject(note) && typeof note.text === "string" && note.text.trim())
    .map(([id, note]) => [id, { text: note.text, updatedAt: Number(note.updatedAt) || 0 }]),
);

// Formato compacto en el navegador: los nombres de los campos de cada pregunta se repiten
// miles de veces y ocupaban más que los datos (el iPhone/iPad deja unos 5 MB por web).
// Solo cambia cómo se guarda aquí: en memoria, en la copia de seguridad y en la nube sigue igual.
const PROGRESS_FORMAT = "compact-1";
const SHORT_KEYS = {
  vecesVista: "v", vecesAcertada: "a", vecesFallada: "f", marcadaAprendida: "m",
  ultimaVezVista: "uv", ultimaVezAcertada: "ua", ultimaVezFallada: "uf", fechaProximoRepaso: "p",
  nivelDominio: "n", estado: "s", intervaloRepasoDias: "i", rachaAciertos: "r", tema: "t",
  numeroPregunta: "q", respuestaElegida: "e", respuestaCorrecta: "c", pendienteRecuperacion: "pr",
  actualizadoEn: "u",
};
const LONG_KEYS = Object.fromEntries(Object.entries(SHORT_KEYS).map(([long, short]) => [short, long]));
const SHORT_STATES = { NUEVA: 0, APRENDIENDO: 1, DIFICIL: 2, DOMINADA: 3 };
const LONG_STATES = Object.fromEntries(Object.entries(SHORT_STATES).map(([long, short]) => [short, long]));

const compactEntry = (entry) => Object.fromEntries(Object.entries(entry ?? {}).map(([key, value]) => {
  if (key === "estado" && value in SHORT_STATES) return ["s", SHORT_STATES[value]];
  // un campo desconocido que coincida con un nombre corto se marca para no confundirlo
  return [SHORT_KEYS[key] ?? (key in LONG_KEYS ? `~${key}` : key), value];
}));
const expandEntry = (entry) => Object.fromEntries(Object.entries(entry ?? {}).map(([key, value]) => {
  if (key === "s" && typeof value === "number") return ["estado", LONG_STATES[value] ?? value];
  return [LONG_KEYS[key] ?? (key.startsWith("~") ? key.slice(1) : key), value];
}));

export const packUserData = (userData) => ({
  ...userData,
  progressFormat: PROGRESS_FORMAT,
  progress: Object.fromEntries(Object.entries(userData?.progress ?? {}).map(([id, entry]) => [id, compactEntry(entry)])),
});
export const unpackUserData = (stored) => {
  if (stored?.progressFormat !== PROGRESS_FORMAT) return stored;
  const { progressFormat, ...rest } = stored;
  return { ...rest, progress: Object.fromEntries(Object.entries(stored.progress ?? {}).map(([id, entry]) => [id, expandEntry(entry)])) };
};

export const loadUserData = () => {
  try {
    return {
      ...EMPTY_USER_DATA,
      ...unpackUserData(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")),
    };
  } catch {
    return EMPTY_USER_DATA;
  }
};

// Libera espacio que no hace falta (restos de versiones anteriores) por si el navegador está lleno.
const freeSpace = () => {
  try {
    localStorage.removeItem("labquiz.sync.v1");
    const account = JSON.parse(localStorage.getItem("labquiz.account.v1") || "null");
    if (account && typeof account.lastSignature === "string" && account.lastSignature.length > 64) {
      localStorage.setItem("labquiz.account.v1", JSON.stringify({ ...account, lastSignature: null }));
    }
  } catch {
    // si no se puede, se intenta guardar igualmente
  }
};

export const saveUserData = (userData) => {
  const content = JSON.stringify(packUserData(userData));
  try {
    localStorage.setItem(STORAGE_KEY, content);
    return true;
  } catch (error) {
    freeSpace();
    try {
      localStorage.setItem(STORAGE_KEY, content);
      return true;
    } catch {
      console.error("No se pudo guardar el progreso", error);
      return false;
    }
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
    notes: sanitizeNotes(data.notes),
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
  const notes = isPlainObject(userData?.notes) ? userData.notes : {};
  if (!entries.some(([removed]) => progress[removed] || favorites.includes(removed) || notes[removed])) return userData;

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
  // una aclaración de una pregunta repetida pasa a la que se conserva (si esa no tenía ya una, se unen)
  const nextNotes = { ...notes };
  entries.forEach(([removed, kept]) => {
    const old = nextNotes[removed];
    if (!old) return;
    const current = nextNotes[kept];
    nextNotes[kept] = current ? { text: `${current.text}\n\n${old.text}`, updatedAt: Math.max(current.updatedAt ?? 0, old.updatedAt ?? 0) } : old;
    delete nextNotes[removed];
  });
  return { ...userData, progress: nextProgress, favorites: nextFavorites, notes: nextNotes };
};
