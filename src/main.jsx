import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import {Home,BookOpen,Brain,RotateCcw,BarChart3,Trophy,Search,ChevronRight,Clock3,CheckCircle2,AlertCircle,Star,FlaskConical,Menu,X,ArrowLeft} from "lucide-react";
import "./styles.css";

const topics=[
 {id:1,title:"Líquidos biológicos",priority:"Alta",progress:82,questions:68,summary:"Muestras, características, análisis y valores clave."},
 {id:2,title:"Genética y biología molecular",priority:"Media",progress:38,questions:54,summary:"ADN, ARN, replicación, expresión y técnicas moleculares."},
 {id:3,title:"Inmunología",priority:"Media",progress:45,questions:61,summary:"Respuesta inmune, anticuerpos, complemento y técnicas."},
 {id:4,title:"Hematología",priority:"Alta",progress:56,questions:76,summary:"Células sanguíneas, hemograma, coagulación y diagnóstico."},
 {id:5,title:"Función hepática",priority:"Alta",progress:71,questions:54,summary:"Bilirrubina, enzimas, proteínas y pruebas hepáticas."},
 {id:6,title:"Función renal",priority:"Media",progress:41,questions:49,summary:"Filtrado glomerular, función tubular y marcadores."},
 {id:7,title:"Microbiología",priority:"Alta",progress:63,questions:91,summary:"Cultivos, identificación, antibiograma y control de calidad."},
 {id:8,title:"Parasitología",priority:"Baja",progress:22,questions:43,summary:"Parásitos de interés clínico y métodos diagnósticos."},
 {id:9,title:"Bioquímica clínica",priority:"Alta",progress:58,questions:72,summary:"Metabolitos, enzimas, perfiles y control analítico."},
 {id:10,title:"Orina y sedimento",priority:"Media",progress:34,questions:47,summary:"Tira reactiva, sedimento y principales alteraciones."},
 {id:11,title:"Endocrinología",priority:"Baja",progress:19,questions:52,summary:"Hormonas, ejes endocrinos y pruebas funcionales."},
 {id:12,title:"Banco de sangre",priority:"Alta",progress:49,questions:65,summary:"Grupos sanguíneos, compatibilidad y transfusión."},
 {id:13,title:"Inmunohematología",priority:"Baja",progress:18,questions:39,summary:"Antígenos, anticuerpos y pruebas pretransfusionales."},
 {id:14,title:"Microbiología II",priority:"Media",progress:31,questions:57,summary:"Procesamiento de muestras y diagnóstico microbiológico."},
 {id:15,title:"Virología",priority:"Baja",progress:14,questions:45,summary:"Virus de interés clínico y métodos de detección."},
 {id:16,title:"Micología",priority:"Baja",progress:11,questions:37,summary:"Hongos patógenos y diagnóstico de laboratorio."},
 {id:17,title:"Citología",priority:"Media",progress:27,questions:42,summary:"Procesamiento, tinciones y reconocimiento citológico."},
 {id:18,title:"Anatomía patológica",priority:"Media",progress:24,questions:51,summary:"Procesamiento histológico y técnicas auxiliares."},
 {id:19,title:"Calidad de laboratorio",priority:"Alta",progress:52,questions:58,summary:"Control de calidad, errores, trazabilidad y seguridad."},
 {id:20,title:"Prevención y riesgos",priority:"Media",progress:36,questions:44,summary:"Bioseguridad, residuos, prevención y actuación."},
 {id:21,title:"Instrumentación",priority:"Media",progress:29,questions:63,summary:"Equipos, calibración, mantenimiento y principios analíticos."},
 {id:22,title:"Gestión de muestras",priority:"Alta",progress:67,questions:46,summary:"Preanalítica, identificación, transporte y conservación."},
 {id:23,title:"Técnicas de laboratorio",priority:"Alta",progress:61,questions:88,summary:"Principios, procedimientos y aplicaciones prácticas."}
];

const demoQuestions=[
 {q:"¿Qué prueba valora principalmente la vía extrínseca de la coagulación?",a:["Tiempo de protrombina (TP)","Tiempo de trombina","Tiempo de sangría","Tiempo de coagulación"],correct:0,topic:5,explain:"El TP evalúa principalmente la vía extrínseca y común."},
 {q:"¿Cuál es la principal proteína plasmática sintetizada por el hígado?",a:["Albúmina","Hemoglobina","Troponina","Mioglobina"],correct:0,topic:5,explain:"La albúmina se sintetiza principalmente en el hígado."},
 {q:"¿Qué muestra se utiliza habitualmente para un hemograma?",a:["Sangre con EDTA","Suero","Orina","LCR"],correct:0,topic:4,explain:"El hemograma se realiza sobre sangre total anticoagulada con EDTA."}
];

function App(){
 const [page,setPage]=useState("home"),[selected,setSelected]=useState(null),[mobile,setMobile]=useState(false);
 const go=p=>{setPage(p);setMobile(false);window.scrollTo(0,0)};
 return <div className="app">
  <aside className={"sidebar "+(mobile?"open":"")}><div className="brand"><div className="logo">LQ</div><span>LabQuiz <b>2.0</b></span></div>
   <button className="close" onClick={()=>setMobile(false)}><X/></button>
    <nav className="nav">{[
    ["home","Inicio",Home],["summaries","Resúmenes",BookOpen],["test","Test",Brain],["review","Repaso",RotateCcw],["progress","Progreso",BarChart3],["simulacrum","Simulacro",Trophy]
   ].map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>go(id)}><Icon/><span>{label}</span></button>)}</nav>
   <div className="sidecard"><FlaskConical/><strong>Tu preparación</strong><small>Construye tu dominio tema a tema.</small></div>
  </aside>
  <main><header><button className="mobileMenu" onClick={()=>setMobile(true)}><Menu/></button><div><span className="eyebrow">OPOSICIONES · LABORATORIO</span><h1>{page==="home"?"Hola, Alana 👋":pageTitle(page)}</h1></div><div className="avatar">A</div></header>
   {page==="home"&&<HomePage go={go} openTopic={t=>{setSelected(t);go("topic")}}/>}
   {page==="summaries"&&<SummaryPage openTopic={t=>{setSelected(t);go("topic")}}/>}
   {page==="topic"&&selected&&<TopicPage topic={selected} go={go}/>}
   {page==="test"&&<TestPage go={go}/>}
   {page==="review"&&<ReviewPage go={go}/>}
   {page==="progress"&&<ProgressPage/>}
   {page==="simulacrum"&&<SimulacrumPage go={go}/>}
  </main>
 </div>
}
const pageTitle=p=>({summaries:"Resúmenes",topic:"Tema",test:"Test",review:"Repaso",progress:"Progreso",simulacrum:"Simulacro"}[p]);

function HomePage({go,openTopic}){return <div>
 <section className="hero"><div><span className="eyebrow">TU SESIÓN DE HOY</span><h2>Estudia rápido. <em>Avanza de verdad.</em></h2><p>Elige un resumen, haz unas preguntas y convierte tus errores en puntos.</p><div className="heroBtns"><button className="primary" onClick={()=>go("test")}>⚡ Test rápido <ChevronRight/></button><button className="secondary" onClick={()=>go("summaries")}>📚 Ver resúmenes</button></div></div><div className="heroOrb">🧪</div></section>
 <section className="section"><div className="sectionHead"><div><h3>Tu progreso</h3><p>Una visión rápida de tu preparación</p></div></div><div className="stats"><Stat icon="🎯" value="78%" label="Aciertos"/><Stat icon="🧠" value="342" label="Preguntas"/><Stat icon="🔥" value="7 días" label="Racha"/><Stat icon="⭐" value="24" label="Difíciles"/></div></section>
 <section className="twoCol section"><div className="card"><div className="sectionHead"><div><h3>Temas prioritarios</h3><p>Donde más te interesa invertir tiempo</p></div><button className="textBtn" onClick={()=>go("summaries")}>Ver todos</button></div>{topics.slice(0,4).map(t=><TopicRow key={t.id} t={t} onClick={()=>openTopic(t)}/>)}</div>
 <div className="card"><h3>Plan de hoy</h3><div className="plan"><CheckCircle2/><div><b>Repasa Tema 5</b><small>10 min · Función hepática</small></div></div><div className="plan"><Brain/><div><b>10 preguntas</b><small>5 min · modo rápido</small></div></div><div className="plan"><RotateCcw/><div><b>Revisa tus errores</b><small>8 preguntas pendientes</small></div></div><button className="primary full" onClick={()=>go("test")}>Empezar sesión</button></div></section>
 </div>}

function Stat({icon,value,label}){return <div className="stat"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function TopicRow({t,onClick}){return <button className="topicRow" onClick={onClick}><div className="num">{String(t.id).padStart(2,"0")}</div><div className="topicInfo"><b>{t.title}</b><small>Prioridad {t.priority.toLowerCase()} · {t.questions} preguntas</small><div className="bar"><i style={{width:t.progress+"%"}}/></div></div><strong>{t.progress}%</strong></button>}

function SummaryPage({openTopic}){const [q,setQ]=useState("");const filtered=topics.filter(t=>(t.title+" "+t.summary).toLowerCase().includes(q.toLowerCase()));return <div>
 <div className="pageIntro"><p>Tu biblioteca de estudio. Cada tema tendrá el mismo formato para que estudiar sea automático.</p><div className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar tema..."/></div></div>
 <div className="filterRow"><span>23 temas</span><button>Todos</button><button>⭐ Prioritarios</button><button>🧠 En progreso</button></div>
 <div className="resumeGrid">{filtered.map(t=><article className="resumeCard" key={t.id} onClick={()=>openTopic(t)}><div className="resumeTop"><span className="num">{String(t.id).padStart(2,"0")}</span><span className={"priority "+t.priority.toLowerCase()}>{t.priority}</span></div><h3>{t.title}</h3><p>{t.summary}</p><div className="miniProgress"><span><i style={{width:t.progress+"%"}}/></span><b>{t.progress}%</b></div><div className="resumeLinks"><span>⭐ Imprescindibles</span><span>🧠 Mnemotecnias</span><ChevronRight/></div></article>)}</div>
 </div>}

function TopicPage({topic,go}){return <div>
 <button className="back" onClick={()=>go("summaries")}><ArrowLeft/> Volver a resúmenes</button>
 <section className="topicHero"><div><span className="badge">TEMA {String(topic.id).padStart(2,"0")} · PRIORIDAD {topic.priority.toUpperCase()}</span><h2>{topic.title}</h2><p>{topic.summary}</p></div><div className="topicScore"><strong>{topic.progress}%</strong><small>dominio</small></div></section>
 <div className="topicLayout"><article className="studyCard"><h3>📌 Resumen esencial</h3><div className="placeholder"><h4>Lo imprescindible</h4><p>Aquí irá el contenido estructurado del tema. La plantilla está preparada para añadir el resumen, conceptos clave, valores, técnicas y puntos de examen sin cambiar el diseño.</p><ul><li>Conceptos fundamentales</li><li>Datos y valores que memorizar</li><li>Interpretación de resultados</li><li>Errores frecuentes en examen</li></ul></div><h3>⭐ Preguntas que debes dominar</h3><div className="questionStrip">Añade aquí las preguntas estrella del tema.</div><h3>🧠 Reglas mnemotécnicas</h3><div className="questionStrip">Espacio preparado para tus reglas y trucos de memoria.</div></article>
 <aside className="topicActions"><div className="card"><h3>¿Qué hacemos ahora?</h3><button className="action" onClick={()=>go("test")}><Brain/><div><b>Hacer test</b><small>10 preguntas del tema</small></div><ChevronRight/></button><button className="action"><Star/><div><b>Marcar para repasar</b><small>Guardar este tema</small></div></button><button className="action" onClick={()=>go("review")}><RotateCcw/><div><b>Repasar errores</b><small>Solo preguntas falladas</small></div></button></div></aside></div>
 </div>}

function TestPage({go}){const [i,setI]=useState(0),[score,setScore]=useState(0),[done,setDone]=useState(false);const q=demoQuestions[i];if(done)return <div className="result card"><div className="resultIcon">🏆</div><h2>Sesión terminada</h2><strong>{score}/{demoQuestions.length}</strong><p>Las preguntas falladas quedarán disponibles en Repaso.</p><button className="primary" onClick={()=>{setI(0);setScore(0);setDone(false)}}>Repetir</button><button className="secondary" onClick={()=>go("review")}>Ver repaso</button></div>;return <div className="testWrap"><div className="testMeta"><span>TEST RÁPIDO</span><b>{i+1} / {demoQuestions.length}</b></div><div className="progressLine"><i style={{width:((i+1)/demoQuestions.length*100)+"%"}}/></div><div className="testCard"><span className="badge">Tema {String(q.topic).padStart(2,"0")}</span><h2>{q.q}</h2><div className="answers">{q.a.map((a,n)=><button key={a} onClick={()=>{if(n===q.correct)setScore(score+1);if(i===demoQuestions.length-1)setDone(true);else setI(i+1)}}><span>{String.fromCharCode(65+n)}</span>{a}</button>)}</div><div className="testTip">💡 Al responder, te mostramos la explicación y la pregunta quedará registrada.</div></div></div>}

function ReviewPage({go}){return <div><div className="reviewHero"><h2>Tu zona de repaso</h2><p>No pierdas tiempo repitiendo lo que ya sabes. Aquí se concentra lo que necesitas reforzar.</p></div><div className="reviewGrid"><div className="card"><span className="bigIcon">🔴</span><h3>8 preguntas falladas</h3><p>Preguntas que has contestado mal recientemente.</p><button className="primary" onClick={()=>go("test")}>Repasar ahora</button></div><div className="card"><span className="bigIcon">⭐</span><h3>24 preguntas difíciles</h3><p>Marcadas para volver a ellas cuando tengas tiempo.</p><button className="secondary">Ver difíciles</button></div><div className="card"><span className="bigIcon">⏳</span><h3>12 para recuperar</h3><p>Contenido que llevas días sin repasar.</p><button className="secondary">Empezar repaso</button></div></div></div>}

function ProgressPage(){return <div><div className="stats"><Stat icon="🎯" value="78%" label="Aciertos globales"/><Stat icon="📚" value="23" label="Temas"/><Stat icon="🧠" value="342" label="Preguntas"/><Stat icon="🏆" value="B+" label="Nivel actual"/></div><section className="section card"><div className="sectionHead"><div><h3>Dominio por tema</h3><p>Actualizado después de cada test</p></div></div>{topics.map(t=><TopicRow key={t.id} t={t} onClick={()=>{}}/>)}</section></div>}

function SimulacrumPage({go}){return <div><section className="simHero"><Trophy/><h2>Simulacro de oposición</h2><p>Cuando estés preparada, podrás enfrentarte a un examen completo con tiempo, puntuación y revisión final.</p><div className="simStats"><span><b>50</b> preguntas</span><span><b>60</b> minutos</span><span><b>+1 / -0,25</b> puntuación</span></div><button className="primary" onClick={()=>go("test")}>Iniciar simulacro →</button></section><div className="card section"><h3>Antes de empezar</h3><ul className="checks"><li><CheckCircle2/> No podrás ver las respuestas hasta finalizar.</li><li><CheckCircle2/> El tiempo se controla automáticamente.</li><li><CheckCircle2/> Al terminar tendrás un análisis por temas.</li></ul></div></div>}

createRoot(document.getElementById("root")).render(<App/>);
