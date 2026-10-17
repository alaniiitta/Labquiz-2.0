// Dibujos para las explicaciones: cristales, cilindros y células del sedimento (tema 3) y
// formas, inclusiones y alteraciones de las células de la sangre (tema 8).
// Se reutilizan los dibujos de los resúmenes visuales; aquí solo se indica con qué palabras
// de la pregunta o la explicación se reconoce cada uno.
import visualSummaryBank from "../summaries/visual/index.js";

const SOURCES = { 3: ["vs-s8", "vs-s9"], 8: ["vs-s7", "vs-s8", "vs-s12", "vs-s14"] };

const ALIASES = {
  "Hialino": ["cilindro hialino", "cilindros hialinos"],
  "Hemático": ["cilindro hematico", "cilindros hematicos", "cilindro eritrocitario", "cilindros eritrocitarios", "cilindros de hematies"],
  "Leucocitario": ["cilindro leucocitario", "cilindros leucocitarios", "cilindros de leucocitos"],
  "Céreo": ["cilindro cereo", "cilindros cereos"],
  "Granuloso": ["cilindro granuloso", "cilindros granulosos"],
  "Cuerpos grasos ovales": ["cuerpos grasos ovales", "cuerpos ovales grasos", "cuerpo graso oval"],
  "Hematíe dismórfico": ["dismorfic", "acantocituria"],
  "Célula escamosa": ["celulas escamosas", "celula escamosa", "epitelio escamoso", "epiteliales escamosas"],
  "Cilindro epitelial": ["cilindro epitelial", "cilindros epiteliales", "cilindros de celulas epiteliales"],
  "Cilindro graso": ["cilindro graso", "cilindros grasos"],
  "Leucocito en orina": ["piuria", "leucocituria", "leucocitos en orina"],
  "Célula tubular renal": ["celulas tubulares", "celula tubular", "epitelio tubular"],
  "Célula de transición": ["celulas de transicion", "celula de transicion", "urotelial", "transicionales"],
  "Levaduras": ["levadura", "gemacion"],
  "Trichomonas": ["trichomona", "tricomona"],
  "Oxalato cálcico dihidratado": ["sobre de carta", "dihidratado", "weddellita", "oxalato calcico", "oxalato de calcio", "oxalatos"],
  "Oxalato monohidratado": ["monohidratado", "whewellita", "mancuerna"],
  "Ácido úrico": ["acido urico"],
  "Cistina": ["cistina"],
  "Fosfato triple": ["fosfato triple", "fosfatos triples", "ataud", "estruvita", "fosfato amonico magnesico", "fosfato amonico-magnesico"],
  "Biurato amónico": ["biurato", "urato amonico"],
  "Colesterol": ["cristales de colesterol", "cristal de colesterol"],
  "Leucina": ["leucina", "cruz de malta"],
  "Tirosina": ["tirosina"],
  "Uratos amorfos": ["uratos amorfos", "polvo de ladrillo"],
  "Fosfatos amorfos": ["fosfatos amorfos"],
  "Carbonato cálcico": ["carbonato calcico", "carbonato de calcio"],
  "Brushita": ["brushita", "fosfato calcico", "fosfato de calcio"],
  "Discocito": ["discocito"],
  "Esferocito": ["esferocit"],
  "Eliptocito": ["eliptocit", "ovalocit"],
  "Dianocito": ["dianocit", "codocit", "celulas diana", "celula diana", "en diana"],
  "Estomatocito": ["estomatocit"],
  "Acantocito": ["acantocit"],
  "Equinocito": ["equinocit", "crenad", "en erizo", "burr"],
  "Esquistocito": ["esquistocit", "fragmentocit", "hematies fragmentados", "en casco"],
  "Dacriocito": ["dacriocit", "en lagrima", "en raqueta"],
  "Drepanocito": ["drepanocit", "falciforme", "en hoz"],
  "Rouleaux": ["rouleaux", "pilas de monedas", "pila de monedas"],
  "Crioaglutininas": ["crioaglutin", "aglutinacion en frio"],
  "Punteado basófilo": ["punteado basofilo"],
  "Howell-Jolly": ["howell"],
  "Anillo de Cabot": ["cabot"],
  "Cuerpos de Heinz": ["heinz"],
  "Pappenheimer": ["pappenheimer", "siderocito"],
  "Reticulocito": ["reticulocit"],
  "Neutrófilo": ["neutrofilo", "segmentado"],
  "Eosinófilo": ["eosinofilo"],
  "Basófilo": ["basofilo"],
  "Linfocito": ["linfocito"],
  "Monocito": ["monocito"],
  "Pelger-Hüet": ["pelger"],
  "Pleocariocito": ["pleocariocit", "hipersegment"],
  "Cuerpos de Döhle": ["dohle"],
  "Bastones de Auer": ["auer"],
  "Sombras de Gumprecht": ["gumprecht", "celulas en cesta"],
  "Linfocito activado": ["linfocito activado", "linfocitos activados", "linfocitos atipicos", "linfocito atipico", "virocito", "linfocitos reactivos"],
  "Célula de Sézary": ["sezary"],
  "Tricoleucocito": ["tricoleucocit", "tricoleucemia", "celulas peludas", "celula peluda"],
  "Reed-Sternberg": ["reed"],
  "Chédiak-Higashi": ["chediak"],
};

// Células muy nombradas: solo se dibujan si salen en la pregunta o en la respuesta correcta,
// no por aparecer de pasada en la explicación.
const STRICT = new Set(["Neutrófilo", "Eosinófilo", "Basófilo", "Linfocito", "Monocito", "Reticulocito"]);

const plain = (text) => String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const stripTags = (html) => String(html ?? "").replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");

let library = null;
function getLibrary() {
  if (library) return library;
  library = {};
  Object.entries(SOURCES).forEach(([topicId, sections]) => {
    const html = visualSummaryBank[`tema-${String(topicId).padStart(2, "0")}`] ?? "";
    const figures = [];
    html.split(/(?=<h2 id="vs-s\d+">)/).forEach((part) => {
      const section = part.match(/^<h2 id="(vs-s\d+)">/)?.[1];
      if (!sections.includes(section)) return;
      for (const match of part.matchAll(/<div class="gi">(<svg[\s\S]*?<\/svg>)<b>([\s\S]*?)<\/b>(?:<small>([\s\S]*?)<\/small>)?<\/div>/g)) {
        const name = stripTags(match[2]).trim();
        figures.push({ name, svg: match[1], caption: stripTags(match[3]).trim(), aliases: (ALIASES[name] ?? [plain(name)]).map(plain) });
      }
    });
    library[topicId] = figures;
  });
  return library;
}

// Dibujos que encajan con una pregunta. Primero los de la respuesta correcta; se buscan los
// nombres más largos antes para que «punteado basófilo» no saque también el basófilo.
export function figuresFor(question, topicId, explanation, max = 3) {
  const figures = getLibrary()[String(topicId)];
  if (!figures?.length || !question) return [];
  const correct = question.answers?.[question.correctAnswer] ?? "";
  const texts = [correct, question.question, explanation?.porQueLaCorrecta, explanation?.claveMemorizar].map(plain);
  const candidates = figures.flatMap((figure) => figure.aliases.map((alias) => ({ figure, alias }))).sort((a, b) => b.alias.length - a.alias.length);
  const found = [];
  texts.forEach((original, index) => {
    let text = original;
    candidates.forEach(({ figure, alias }) => {
      if (!text.includes(alias)) return;
      if (index > 1 && STRICT.has(figure.name)) return;
      text = text.split(alias).join(" ".repeat(alias.length));
      if (!found.includes(figure)) found.push(figure);
    });
  });
  return found.slice(0, max);
}
