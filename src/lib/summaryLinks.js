// Relaciona las preguntas del banco con los apartados del resumen visual de su tema.
// Cada apartado es un <h2 id="vs-sN"> del HTML del resumen; la pregunta se asigna al
// apartado con el que comparte más términos poco comunes (TF-IDF sencillo).

const STOPWORDS = new Set(("para como cual cuales cuando donde entre esta este esto estos estas sobre tiene tienen puede pueden "
 + "siguiente siguientes señale señala indique indica respuesta correcta incorrecta falsa cierta ciertas todas todos ninguna "
 + "anteriores anterior mediante través según hace desde hasta porque también otros otras otro otra muy más menos solo sólo "
 + "será son ser está están hay dicho dicha cuyo cuya afirmación opción opciones siempre nunca pero aunque sino "
 + "utiliza utilizan utilizado utilizada emplea empleado usado usada caso casos forma tipo tipos valor valores prueba pruebas "
 + "paciente pacientes muestra muestras método métodos").split(" "));

const plain = text => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const stripTags = html => html.replace(/<(style|script)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
const stem = word => (word.length > 6 ? word.slice(0, 6) : word);

export const tokenize = text => {
 const words = plain(text).match(/[a-z0-9]+/g) ?? [];
 return words.filter(word => (word.length >= 4 || /\d/.test(word) && word.length >= 2) && !STOPWORDS.has(word)).map(stem);
};

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
  sections.push({
   id: match[1],
   title,
   html: html.slice(start, re.lastIndex) + body,
   titleTerms: new Set(tokenize(title)),
   boldTerms: new Set(tokenize(bold)),
   terms: new Set(tokenize(stripTags(body) + " " + title)),
   practicable: !SKIP_TITLE.test(title),
  });
 }
 return { defs, sections };
}

const cache = new Map();

// Índice de un tema: apartados + asignación pregunta → apartado.
export function buildTopicIndex(topicId, html, questions, getId) {
 const key = topicId;
 const cached = cache.get(key);
 if (cached && cached.html === html && cached.count === questions.length) return cached;
 const { defs, sections } = parseSections(html);
 const candidates = sections.filter(section => section.practicable);
 const df = new Map();
 candidates.forEach(section => section.terms.forEach(term => df.set(term, (df.get(term) ?? 0) + 1)));
 const idf = term => Math.log(1 + candidates.length / (df.get(term) ?? candidates.length));

 const byQuestion = new Map();
 const bySection = new Map(candidates.map(section => [section.id, []]));
 for (const question of questions) {
  const correct = question.answers?.[question.correctAnswer] ?? "";
  const terms = new Map();
  tokenize(question.question).forEach(term => terms.set(term, Math.max(terms.get(term) ?? 0, 1)));
  tokenize(correct).forEach(term => terms.set(term, Math.max(terms.get(term) ?? 0, 1.5)));
  let best = null;
  let bestScore = 0;
  for (const section of candidates) {
   let score = 0;
   terms.forEach((weight, term) => {
    if (!section.terms.has(term)) return;
    let w = idf(term) * weight;
    if (section.boldTerms.has(term)) w *= 1.6;
    if (section.titleTerms.has(term)) w *= 2;
    score += w;
   });
   if (score > bestScore) { bestScore = score; best = section; }
  }
  if (best && bestScore >= 1.2) {
   const id = getId(question);
   byQuestion.set(id, best.id);
   bySection.get(best.id).push(id);
  }
 }
 const index = { html, count: questions.length, defs, sections, byQuestion, bySection };
 cache.set(key, index);
 return index;
}
