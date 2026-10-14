// Recortes opcionales del temario: preguntas de un tema que entran en el examen.
// Cada recorte indica qué preguntas se quedan (ids o una función) y si viene activado de serie.
// No se borra ninguna pregunta: si el recorte está activado, el resto simplemente
// no sale en los tests (y se puede volver a activar todo cuando se quiera).

export const examScopes = {
 // Tema 18 · Hormonas: solo hormona tiroidea (eje TRH-TSH-T3/T4, patología tiroidea,
 // anticuerpos antitiroideos, tiroglobulina y yodo). Quedan fuera suprarrenales, hipófisis
 // no tiroidea, hormonas sexuales, PTH/calcio y conceptos generales.
 18: {
  id: "tiroides",
  label: "Solo hormona tiroidea",
  unit: "de tiroides",
  ids: new Set([
   1, 2, 3, 8, 9, 15, 18, 20, 21, 22, 26, 29, 31, 35, 36, 41, 44, 51, 68, 69, 70, 71, 73, 78, 79,
   81, 83, 84, 85, 90, 91, 92, 93, 94, 97, 101, 103, 104, 107, 112, 113, 114, 119, 122, 123, 124,
   125, 129, 131, 134, 136, 138, 140, 141, 144, 147, 158, 161, 168, 174, 179, 182, 183, 190, 194,
   197, 198, 199, 205, 213, 216, 220, 222, 225, 228, 234, 236, 240, 248, 254, 255,
  ]),
 },
 // Tema 20: 20.1 (reproducción) y 20.2 (seminograma) no entran; solo 20.3 Cribados.
 20: {
  id: "cribados",
  label: "Solo 20.3 Cribados",
  unit: "de cribados (20.3)",
  defaultOn: true,
  match: (question) => String(question.id).startsWith("20.3-"),
 },
};

export const isInScope = (scope, question) => (scope.ids ? scope.ids.has(question.id) : scope.match(question));
export const isScopeOn = (scope, config) => (config?.on ?? !!scope.defaultOn);
