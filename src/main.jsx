import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import {Home,BookOpen,Brain,RotateCcw,BarChart3,Trophy,Search,ChevronRight,Clock3,CheckCircle2,AlertCircle,Star,FlaskConical,Menu,X,ArrowLeft} from "lucide-react";
import "./styles.css";

import questionBank from "./questions";

const topics=[
 {id:1,title:"Conceptos básicos",priority:"Alta",progress:0,questions:0,summary:""},
 {id:2,title:"Líquidos biológicos",priority:"Media",progress:0,questions:0,summary:""},
 {id:3,title:"Análisis urinario y función renal",priority:"Media",progress:0,questions:0,summary:""},
 {id:4,title:"Función digestiva",priority:"Alta",progress:0,questions:0,summary:""},
 {id:5,title:"Función hepática y proteínas",priority:"Alta",progress:0,questions:0,summary:""},
 {id:6,title:"Enzimas",priority:"Media",progress:0,questions:0,summary:""},
 {id:7,title:"Técnicas Instrumentales",priority:"Alta",progress:0,questions:0,summary:""},
 {id:8,title:"Hematología",priority:"Baja",progress:0,questions:0,summary:""},
 {id:9,title:"Coagulación",priority:"Alta",progress:0,questions:0,summary:""},
 {id:10,title:"Banco de sangre",priority:"Media",progress:0,questions:0,summary:""},
 {id:11,title:"Inmunología",priority:"Baja",progress:0,questions:0,summary:""},
 {id:12,title:"Serología",priority:"Alta",progress:0,questions:0,summary:""},
 {id:13,title:"Bacteriología",priority:"Baja",progress:0,questions:0,summary:""},
 {id:14,title:"Parásitos, hongos y virus",priority:"Media",progress:0,questions:0,summary:""},
 {id:15,title:"Equilibrio ácido-base e iones",priority:"Baja",progress:0,questions:0,summary:""},
 {id:16,title:"Metabolismo lipídico",priority:"Baja",progress:0,questions:0,summary:""},
 {id:17,title:"Metabolismo hidratos de carbono",priority:"Media",progress:0,questions:0,summary:""},
 {id:18,title:"Hormonas",priority:"Media",progress:0,questions:0,summary:""},
 {id:19,title:"Genética",priority:"Alta",progress:0,questions:0,summary:""},
 {id:20,title:"Reproducción y cribados",priority:"Media",progress:0,questions:0,summary:""},
 {id:21,title:"Drogas de abuso y Fármacos",priority:"Media",progress:0,questions:0,summary:""},
 {id:22,title:"Marcadores tumorales",priority:"Alta",progress:0,questions:0,summary:""}
];

const getTopicKey=id=>`tema-${String(id).padStart(2,"0")}`;
const getQuestionBank=id=>(questionBank[getTopicKey(id)] ?? []);

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
  <main><header className={page==="home"?"homeHeader":""}><button className="mobileMenu" onClick={()=>setMobile(true)}><Menu/></button><div><span className="eyebrow">OPOSICIONES · LABORATORIO</span><h1>{page==="home"?"Hola, Alana 👋":pageTitle(page)}</h1></div></header>
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

function HomePage({go,openTopic}){return <div className="homeDashboard">
 <section className="hero"><div><span className="eyebrow">TU SESIÓN DE HOY</span><h2>Estudia rápido. <em>Avanza de verdad.</em></h2><p>Elige un resumen, haz unas preguntas y convierte tus errores en puntos.</p><div className="heroBtns"><button className="primary" onClick={()=>go("test")}>⚡ Test rápido <ChevronRight/></button><button className="secondary" onClick={()=>go("summaries")}>📚 Ver resúmenes</button></div></div><div className="heroOrb">🧪</div></section>
 <section className="section"><div className="sectionHead"><div><h3>Tu progreso</h3><p>Una visión rápida de tu preparación</p></div></div><div className="stats"><Stat icon="🎯" value="0%" label="Aciertos"/><Stat icon="🧠" value="0" label="Preguntas"/><Stat icon="🔥" value="0 días" label="Racha"/><Stat icon="⭐" value="0" label="Difíciles"/></div></section>
 <section className="twoCol section"><div className="card"><div className="sectionHead"><div><h3>Temas prioritarios</h3><p>Donde más te interesa invertir tiempo</p></div><button className="textBtn" onClick={()=>go("summaries")}>Ver todos</button></div>{topics.slice(0,4).map(t=><TopicRow key={t.id} t={t} onClick={()=>openTopic(t)}/>)}</div>
 <div className="card"><h3>Plan de hoy</h3><div className="plan"><CheckCircle2/><div><b>Sin actividad</b><small>Aún no hay preguntas respondidas</small></div></div><div className="plan"><Brain/><div><b>0 preguntas</b><small>Añade preguntas para empezar</small></div></div><div className="plan"><RotateCcw/><div><b>Sin errores</b><small>No hay preguntas falladas</small></div></div><button className="primary full" onClick={()=>go("test")}>Empezar sesión</button></div></section>
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

function TestPage({go}){
 const [selectedTopicId,setSelectedTopicId]=useState(null);
 const [i,setI]=useState(0);
 const [score,setScore]=useState(0);
 const [selectedAnswer,setSelectedAnswer]=useState(null);
 const [showResult,setShowResult]=useState(false);
 const [done,setDone]=useState(false);

 const currentTopic=selectedTopicId ? topics.find(t=>t.id===selectedTopicId) : null;
 const questionBankForTopic=selectedTopicId ? getQuestionBank(selectedTopicId) : [];
 const totalQuestions=questionBankForTopic.length;
 const q=questionBankForTopic[i] ?? null;

 const resetSelection=()=>{
  setSelectedTopicId(null);
  setI(0);
  setScore(0);
  setSelectedAnswer(null);
  setShowResult(false);
  setDone(false);
 };

 const handleAnswer=(answerIndex)=>{
  if(!q || showResult) return;
  setSelectedAnswer(answerIndex);
  setShowResult(true);
  if(answerIndex===q.correctAnswer) setScore(prev=>prev+1);
 };

 const handleNext=()=>{
  if(!q) return;
  if(i>=totalQuestions-1){
   setDone(true);
   setSelectedAnswer(null);
   setShowResult(false);
   return;
  }
  setI(prev=>prev+1);
  setSelectedAnswer(null);
  setShowResult(false);
 };

 if(!selectedTopicId){
  return <div className="testThemeSelector"><div className="testMeta"><span>SELECCIÓN DE TEMA</span><b>{topics.length} temas</b></div><div className="testTopicsGrid">{topics.map(topic=><button key={topic.id} className="topicSelectCard" onClick={()=>{setSelectedTopicId(topic.id);setI(0);setScore(0);setSelectedAnswer(null);setShowResult(false);setDone(false);}}><span className="badge">Tema {String(topic.id).padStart(2,"0")}</span><h3>{topic.title}</h3><small>{topic.questions} preguntas · {topic.priority}</small></button>)}</div></div>;
 }

 if(!q){
  return <div className="result card"><div className="resultIcon">📘</div><h2>Este tema aún no tiene preguntas</h2><p>El banco de preguntas está preparado para añadirse desde archivos separados por tema.</p><button className="primary" onClick={resetSelection}>Volver a temas</button></div>;
 }

 if(done){
  return <div className="result card"><div className="resultIcon">🏆</div><h2>Sesión terminada</h2><strong>{score}/{totalQuestions}</strong><p>Cuando añadas preguntas a este tema, la sesión se completará con su contenido propio.</p><button className="primary" onClick={()=>{setI(0);setScore(0);setSelectedAnswer(null);setShowResult(false);setDone(false)}}>Repetir</button><button className="secondary" onClick={resetSelection}>Elegir otro tema</button></div>;
 }

 return <div className="testWrap"><div className="testMeta"><span>{currentTopic.title.toUpperCase()}</span><b>{i+1} / {totalQuestions}</b></div><div className="progressLine"><i style={{width:((i+1)/totalQuestions*100)+"%"}}/></div><div className="testCard"><span className="badge">Tema {String(currentTopic.id).padStart(2,"0")}</span><h2>{q.question}</h2><div className="answers">{q.answers.map((answer,index)=><button key={answer+index} type="button" onClick={()=>handleAnswer(index)} disabled={showResult} className={showResult ? (index===q.correctAnswer ? "correct" : (selectedAnswer===index ? "incorrect" : "")) : ""}><span>{String.fromCharCode(65+index)}</span>{answer}</button>)}</div>{showResult&&<div className="testFeedback"><p className={selectedAnswer===q.correctAnswer?"testStatus success":"testStatus error"}>{selectedAnswer===q.correctAnswer?"✅ Correcto":"❌ Incorrecto"}</p><p><strong>Respuesta correcta:</strong> {q.answers[q.correctAnswer]}</p><p><strong>Explicación:</strong> {q.explanation}</p></div>}<div className="testActions">{showResult&&<button className="primary" onClick={handleNext}>{i===totalQuestions-1?"Ver resultado":"Siguiente pregunta"}</button>}<button className="secondary" onClick={resetSelection}>Cambiar tema</button></div></div></div>;
}

function ReviewPage({go}){return <div><div className="reviewHero"><h2>Tu zona de repaso</h2><p>No hay actividad de repaso todavía.</p></div><div className="reviewGrid"><div className="card"><span className="bigIcon">🔴</span><h3>0 preguntas falladas</h3><p>No hay preguntas contestadas incorrectamente.</p><button className="primary" onClick={()=>go("test")}>Repasar ahora</button></div><div className="card"><span className="bigIcon">⭐</span><h3>0 preguntas difíciles</h3><p>No hay preguntas marcadas para repasar.</p><button className="secondary">Ver difíciles</button></div><div className="card"><span className="bigIcon">⏳</span><h3>0 para recuperar</h3><p>No hay contenido pendiente de repaso.</p><button className="secondary">Empezar repaso</button></div></div></div>}

function ProgressPage(){return <div><div className="stats"><Stat icon="🎯" value="0%" label="Aciertos globales"/><Stat icon="📚" value="22" label="Temas"/><Stat icon="🧠" value="0" label="Preguntas"/><Stat icon="🏆" value="Inicial" label="Nivel actual"/></div><section className="section card"><div className="sectionHead"><div><h3>Dominio por tema</h3><p>Actualizado después de cada test</p></div></div>{topics.map(t=><TopicRow key={t.id} t={t} onClick={()=>{}}/>)}</section></div>}

function SimulacrumPage({go}){return <div><section className="simHero"><Trophy/><h2>Simulacro de oposición</h2><p>Cuando estés preparada, podrás enfrentarte a un examen completo con tiempo, puntuación y revisión final.</p><div className="simStats"><span><b>50</b> preguntas</span><span><b>60</b> minutos</span><span><b>+1 / -0,25</b> puntuación</span></div><button className="primary" onClick={()=>go("test")}>Iniciar simulacro →</button></section><div className="card section"><h3>Antes de empezar</h3><ul className="checks"><li><CheckCircle2/> No podrás ver las respuestas hasta finalizar.</li><li><CheckCircle2/> El tiempo se controla automáticamente.</li><li><CheckCircle2/> Al terminar tendrás un análisis por temas.</li></ul></div></div>}

createRoot(document.getElementById("root")).render(<App/>);
