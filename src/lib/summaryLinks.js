// Relaciona las preguntas del banco con los apartados del resumen visual de su tema.
// Cada apartado es un <h2 id="vs-sN"> del HTML del resumen. La pregunta (enunciado,
// respuesta correcta y explicación) se compara con cada apartado con un BM25 sencillo:
// cuentan más los términos poco comunes, los títulos y las negritas, y se corrige
// el sesgo de los apartados muy largos.

const STOPWORDS = new Set(("para como cual cuales cuando donde entre esta este esto estos estas sobre tiene tienen puede pueden "
 + "siguiente siguientes señale señala indique indica respuesta correcta correcto incorrecta falsa falso cierta cierto ciertas todas todos ninguna "
 + "anteriores anterior mediante través según hace desde hasta porque también otros otras otro otra muy más menos solo sólo "
 + "será son ser está están hay dicho dicha cuyo cuya afirmación opción opciones siempre nunca pero aunque sino "
 + "utiliza utilizan utilizado utilizada emplea empleado usado usada caso casos forma tipo tipos valor valores prueba pruebas "
 + "paciente pacientes muestra muestras método métodos mayor menor principal principales característica características "
 + "denomina llama conoce produce producen causa causado debe deben tras antes después mismo misma cada dentro fuera "
 + "respecto relación general frecuente frecuentes importante nivel niveles alta alto baja bajo diferentes distintos "
 + "temario dato datos generalmente además poco mucho semana semanas mujer hombre años días horas última último ellos ellas").split(" "));

const plain = text => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const stripTags = html => html.replace(/<(style|script)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
// iguala grafías latinas y castellanas (Mycobacterium/micobacteria, Staphylococcus/estafilococo)
const spelling = word => word.replace(/ph/g, "f").replace(/th/g, "t").replace(/y/g, "i").replace(/k/g, "c").replace(/^es(?=[bcdfgptl])/, "s");
let STEM = 6;
export const setStemLength = n => { STEM = n; };
const stem = word => {const w = spelling(word);return w.length > STEM ? w.slice(0, STEM) : w;};
const STOP_PLAIN = new Set([...STOPWORDS].map(plain));

export const tokenize = text => {
 const words = plain(text).match(/[a-z0-9]+/g) ?? [];
 // siglas en mayúsculas (VIH, LCR, PCR, VSG…): cuentan aunque sean cortas
 const acronyms = (plain(text.replace(/[^A-ZÁÉÍÓÚÑ0-9]+/g, " ")).match(/\b[a-z][a-z0-9]{1,2}\b/g) ?? []).filter(word => !/^(ac|de|la|el|en|y|o|del|las|los|por|con)$/.test(word));
 const kept = words.filter(word => (word.length >= 4 || /\d/.test(word) && word.length >= 2) && !STOP_PLAIN.has(word));
 // raíz (para plurales y derivados) + palabra entera (para no confundir inmunoglobulina con inmunodeficiencia)
 return [...acronyms.map(word => "#" + word), ...kept.flatMap(word => {const w = spelling(word).replace(/(es|s)$/, "");return w.length > STEM ? [stem(word), "=" + w] : [stem(word)];})];
};

// Respuestas que no dicen nada del contenido («Todas son correctas», «A y B»…).
const VAGUE_ANSWER = /^(todas|ninguna|ambas|las dos|hay mas|a y b|a y c|b y c|a, b|son correctas|son falsas|todas las anteriores)/;

const SKIP_TITLE = /trampas|te lo sabes|autotest/i;

// Trocea el HTML del resumen en apartados.
export function parseSections(html) {
 const defs = html.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)?.[0] ?? "";
 const sections = [];
 const re = /<h2 id="(vs-s\d+)">([\s\S]*?)<\/h2>/g;
 let match;
 while ((match = re.exec(html))) {
  const start = match.index;
  const rest = html.slice(re.lastIndex);
  const stop = rest.search(/<h2[\s>]|<div class="blk|<!--/);
  const body = stop === -1 ? rest : rest.slice(0, stop);
  const title = stripTags(match[2]).replace(/^\s*\d+\s*/, "").replace(/\s+/g, " ").trim();
  const bold = (body.match(/<(b|i|th)>([\s\S]*?)<\/\1>/g) ?? []).map(stripTags).join(" ");
  const bodyTerms = tokenize(stripTags(body) + " " + title);
  sections.push({
   id: match[1],
   title,
   html: html.slice(start, re.lastIndex) + body,
   titleTerms: new Set(tokenize(title)),
   boldTerms: new Set(tokenize(bold)),
   terms: new Set(bodyTerms),
   length: bodyTerms.length,
   practicable: !SKIP_TITLE.test(title),
  });
 }
 return { defs, sections };
}

// Términos de una pregunta con su peso (el mayor si aparece en varias partes).
function questionTerms(question, explanation, explanationWeight = 0.7, keyWeight = 1) {
 const terms = new Map();
 const add = (text, weight) => tokenize(text ?? "").forEach(term => terms.set(term, Math.max(terms.get(term) ?? 0, weight)));
 const correct = question.answers?.[question.correctAnswer] ?? "";
 add(question.question, 1);
 if (VAGUE_ANSWER.test(plain(correct).trim())) (question.answers ?? []).forEach(answer => add(answer, 0.6));
 else add(correct, 1.5);
 if (explanation) {
  add(explanation.porQueLaCorrecta, explanationWeight);
  add(explanation.claveMemorizar, keyWeight);
 }
 return terms;
}

const cache = new Map();

// Índice de un tema: apartados + asignación pregunta → apartados ordenados por afinidad.
export function buildTopicIndex(topicId, html, questions, getId, getExplanation = () => null, options = {}) {
 const { k1 = 1.2, b = 0.3, explanationWeight = 0.7, keyWeight = 1, titleBoost = 3, boldBoost = 1.6 } = options;
 const cached = cache.get(topicId);
 if (cached && cached.html === html && cached.count === questions.length) return cached;
 const { defs, sections } = parseSections(html);
 const candidates = sections.filter(section => section.practicable);
 const total = candidates.length;
 const avgLength = candidates.reduce((sum, section) => sum + section.length, 0) / Math.max(1, total);
 const df = new Map();
 candidates.forEach(section => section.terms.forEach(term => df.set(term, (df.get(term) ?? 0) + 1)));
 const idf = term => Math.log(1 + (total - (df.get(term) ?? total) + 0.5) / ((df.get(term) ?? total) + 0.5));

 const byQuestion = new Map();
 const bySection = new Map(candidates.map(section => [section.id, []]));
 const termsByQuestion = new Map();
 for (const question of questions) {
  const terms = questionTerms(question, getExplanation(question), explanationWeight, keyWeight);
  const ranked = candidates.map(section => {
   const norm = (k1 + 1) / (1 + k1 * (1 - b + b * section.length / avgLength));
   let score = 0;
   terms.forEach((weight, term) => {
    if (!section.terms.has(term)) return;
    let w = idf(term) * weight * norm;
    if (section.boldTerms.has(term)) w *= boldBoost;
    if (section.titleTerms.has(term)) w *= titleBoost;
    score += w;
   });
   return { id: section.id, score };
  }).filter(entry => entry.score > 0).sort((x, y) => y.score - x.score);
  const best = ranked[0];
  if (!best || best.score < 1) continue;
  const id = getId(question);
  byQuestion.set(id, ranked.filter(entry => entry.score >= best.score * 0.6).slice(0, 3));
  bySection.get(best.id).push(id);
  // términos distintivos (en pocos apartados) para resaltarlos al abrir el resumen
  termsByQuestion.set(id, [...terms.keys()].map(term => term.replace(/^#/, "")).filter(term => !term.startsWith("=") && !/^\d+$/.test(term) && (df.get(term) ?? 0) > 0 && (df.get(term) ?? 0) <= Math.max(2, total * 0.2)));
 }
 const index = { html, count: questions.length, defs, sections, byQuestion, bySection, termsByQuestion };
 cache.set(topicId, index);
 return index;
}

// Envuelve en <mark> las palabras de un nodo que empiezan por alguno de los términos.
export function highlightTerms(root, terms) {
 const words = (terms ?? []).map(term => term.replace(/[^a-z0-9]/g, "")).filter(word => word.length >= 3);
 if (!root || !words.length) return null;
 const pattern = new RegExp(`\\b(?:${words.join("|")})[a-z0-9]*`, "g");
 const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
  acceptNode: node => node.parentElement?.closest("svg,mark,h2,script,style") || !node.nodeValue.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
 });
 const nodes = [];
 while (walker.nextNode()) nodes.push(walker.currentNode);
 let first = null;
 nodes.forEach(node => {
  const text = node.nodeValue;
  // versión sin tildes con la misma longitud para poder mapear posiciones
  const flat = [...text].map(ch => plain(ch)[0] ?? ch).join("").replace(/y/g, "i").replace(/k/g, "c");
  const ranges = [];
  let m;
  pattern.lastIndex = 0;
  while ((m = pattern.exec(flat))) ranges.push([m.index, m.index + m[0].length]);
  if (!ranges.length || flat.length !== text.length) return;
  const fragment = document.createDocumentFragment();
  let cursor = 0;
  ranges.forEach(([from, to]) => {
   if (from > cursor) fragment.append(text.slice(cursor, from));
   const mark = document.createElement("mark");
   mark.className = "hl";
   mark.textContent = text.slice(from, to);
   fragment.append(mark);
   first ??= mark;
   cursor = to;
  });
  if (cursor < text.length) fragment.append(text.slice(cursor));
  node.replaceWith(fragment);
 });
 return first;
}
