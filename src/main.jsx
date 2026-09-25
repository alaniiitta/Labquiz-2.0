import React,{useEffect,useMemo,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import {Home,BookOpen,Brain,RotateCcw,BarChart3,Trophy,Search,ChevronRight,Star,FlaskConical,Menu,X,ArrowLeft,Target,Layers3,Settings,Download,Upload,ShieldCheck,CheckCircle2,Moon,Sun,Play,Hourglass} from "lucide-react";
import "./styles.css";

import questionBank from "./questions";
import summaryBank from "./summaries/index.js";
import visualSummaryBank,{sharedDefs as visualSummaryDefs} from "./summaries/visual/index.js";
import {parsePdfQuestions} from "./pdfPipeline.js";
import {getQuestionIdForProgress,getTopicProgress,isQuestionCurrentlyFailed,markQuestionAsLearned,recordQuestionAnswer,selectSmartQuestions,shuffleQuestionOptions} from "./smartQuestionSelector.js";
import ExplanationDisplay from "./components/ExplanationDisplay.jsx";
import {explainQuestion} from "./lib/explainQuestion.js";
import {clearTestSession,createBackup,loadSavedTest,loadUserData,parseBackup,saveTestSession,saveUserData} from "./lib/storage.js";
import {EXAM_DATE,getCountdown} from "./lib/studyPlan.js";

const pdfFiles=import.meta.glob("/pdfs/*.pdf",{query:"?url",import:"default",eager:true});

const topics=[
 {id:1,title:"Conceptos generales"}, {id:2,title:"Líquidos biológicos"},
 {id:3,title:"Análisis urinario y función renal"}, {id:4,title:"Función digestiva"},
 {id:5,title:"Función hepática y proteínas"}, {id:6,title:"Enzimas"},
 {id:7,title:"Técnicas instrumentales"}, {id:8,title:"Hematología"},
 {id:9,title:"Coagulación"}, {id:10,title:"Banco de sangre"},
 {id:11,title:"Inmunología"}, {id:12,title:"Serología"},
 {id:13,title:"Bacteriología"}, {id:14,title:"Parásitos, hongos y virus"},
 {id:15,title:"Equilibrio ácido-base e iones"}, {id:16,title:"Metabolismo lipídico"},
 {id:17,title:"Metabolismo de hidratos de carbono"}, {id:18,title:"Hormonas"},
 {id:19,title:"Genética"}, {id:20,title:"Reproducción y cribados"},
 {id:21,title:"Drogas de abuso y fármacos"}, {id:22,title:"Marcadores tumorales"},
 {id:23,title:"Técnicas de laboratorio"}
];

const getTopicKey=id=>`tema-${String(id).padStart(2,"0")}`;
const getQuestionBank=id=>(questionBank[getTopicKey(id)] ?? []);
const getSummary=id=>summaryBank[getTopicKey(id)];
const getVisualSummary=id=>visualSummaryBank[getTopicKey(id)];
const formatEmphasis=text=>String(text).split(/(\*\*[^*]+\*\*|__[^_]+__)/g).filter(Boolean).map((part,index)=>{
 if(part.startsWith("**")&&part.endsWith("**")) return <strong key={index}>{part.slice(2,-2)}</strong>;
 if(part.startsWith("__")&&part.endsWith("__")) return <u key={index}>{part.slice(2,-2)}</u>;
 return part;
});
const getPdfUrl=id=>Object.entries(pdfFiles).find(([path])=>new RegExp(`(?:tema|topic)[-_\\s]*${String(id).padStart(2,"0")}(?:\\D|$)` ,"i").test(path))?.[1]
    ?? Object.entries(pdfFiles).find(([path])=>new RegExp(`(?:tema|topic)[-_\\s]*${id}(?:\\D|$)` ,"i").test(path))?.[1];
const getAllQuestions=()=>topics.flatMap(topic=>getQuestionBank(topic.id).map(question=>({...question,topicId:topic.id})));
const getFailedQuestions=progress=>getAllQuestions().filter(question=>isQuestionCurrentlyFailed(progress[getQuestionIdForProgress(question)]));
const getFavoriteQuestions=favorites=>getAllQuestions().filter(question=>favorites.includes(getQuestionIdForProgress(question)));
const sameAnswerSet=(a=[],b=[])=>a.length===b.length&&[...a].sort().join("\u0000")===[...b].sort().join("\u0000");
// Recupera el test en curso solo si todas sus preguntas siguen en el banco sin cambios.
const loadResumableTest=()=>{
 const session=loadSavedTest();
 if(!session||!Array.isArray(session.questions)||!session.questions.length||!["topic","failed","mixed"].includes(session.mode)) return null;
 const bankById=new Map(getAllQuestions().map(question=>[getQuestionIdForProgress(question),question]));
 const questions=session.questions.map(saved=>{
  const current=bankById.get(getQuestionIdForProgress(saved));
  if(!current||current.question!==saved.question||!sameAnswerSet(current.answers,saved.answers)) return null;
  const correctAnswer=saved.answers.indexOf(current.answers[current.correctAnswer]);
  return correctAnswer<0?null:{...current,answers:saved.answers,correctAnswer};
 });
 if(questions.some(question=>!question)) return null;
 const index=Math.min(Math.max(0,Number(session.index)||0),questions.length-1);
 const answers=Object.fromEntries(Object.entries(session.answers??{}).filter(([key,value])=>Number(key)<questions.length&&Number.isInteger(value)));
 return {mode:session.mode,topicId:session.topicId??null,questions,index,answers};
};

function App(){
 const [page,setPage]=useState("home"),[selected,setSelected]=useState(null),[mobile,setMobile]=useState(false),[testConfig,setTestConfig]=useState({topicId:null,mode:"topic",questionIds:null,sessionId:0}),[userData,setUserData]=useState(loadUserData);
 const show=p=>{setPage(p);setMobile(false);window.scrollTo(0,0)};
 const openTest=(topicId,mode="topic",questionIds=null,questionCount=null)=>{setTestConfig(config=>({topicId,mode,questionIds,questionCount,sessionId:config.sessionId+1}));show("test")};
 // ir a "test" sin configuración abre siempre el selector de temas, no el último test
 const go=p=>p==="test"?openTest(null):show(p);
 const toggleFavorite=question=>setUserData(data=>{const id=getQuestionIdForProgress(question);return {...data,favorites:data.favorites.includes(id)?data.favorites.filter(favoriteId=>favoriteId!==id):[...data.favorites,id]}});
 const markLearned=question=>setUserData(data=>({...data,progress:markQuestionAsLearned(question,data.progress)}));
 const [saveFailed,setSaveFailed]=useState(false);
 useEffect(()=>setSaveFailed(!saveUserData(userData)),[userData]);
 useEffect(()=>{document.documentElement.dataset.theme=userData.theme??"light"},[userData.theme]);
 return <div className="app">
  <aside className={"sidebar "+(mobile?"open":"")}><div className="brand"><div className="logo">LQ</div><span>LabQuiz <b>2.0</b></span></div>
  <button className="close" type="button" onClick={()=>setMobile(false)} aria-label="Cerrar menú"><X/></button>
    <nav className="nav">{[
    ["home","Inicio",Home],["summaries","Resúmenes",BookOpen],["test","Test",Brain],["wrong","Preguntas falladas",RotateCcw],["review","Repaso",RotateCcw],["progress","Progreso",BarChart3],["settings","Configuración",Settings]
   ].map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>go(id)}><Icon/><span>{label}</span></button>)}</nav>
   <div className="sidecard"><FlaskConical/><strong>Tu preparación</strong><small>Construye tu dominio tema a tema.</small></div>
  </aside>
  <main className={page==="test"?"testMain":""}><header className={page==="home"?"homeHeader":""}><button className="mobileMenu" type="button" onClick={()=>setMobile(true)} aria-label="Abrir menú"><Menu/></button><div><span className="eyebrow">OPOSICIONES · LABORATORIO</span><h1>{page==="home"?"Hola, Alana 👋":pageTitle(page)}</h1></div></header>
  {saveFailed&&<div className="saveWarning" role="alert"><b>⚠️ Tu progreso no se está guardando en este navegador.</b> Puede que el almacenamiento esté lleno o bloqueado (por ejemplo, en modo privado). Descarga una copia de seguridad para no perder tus datos. <button className="homeTextButton" type="button" onClick={()=>go("settings")}>Ir a Configuración <ChevronRight/></button></div>}
  {page==="home"&&<HomePage go={go} openTest={openTest} progress={userData.progress}/>}
  {page==="summaries"&&<SummaryPage openTopic={t=>{setSelected(t);go("topic")}}/>}
  {page==="topic"&&selected&&<TopicPage topic={selected} go={go} onStartTest={()=>openTest(selected.id)}/>}
  {page==="test"&&<TestPage key={`${testConfig.mode}-${testConfig.topicId??"selector"}-${testConfig.sessionId}`} go={go} onChangeTopic={()=>openTest(null)} initialTopicId={testConfig.topicId} initialQuestionIds={testConfig.questionIds} initialQuestionCount={testConfig.questionCount} mode={testConfig.mode} questionProgress={userData.progress} onProgressChange={progress=>setUserData(data=>({...data,progress}))} favorites={userData.favorites} onToggleFavorite={toggleFavorite} onMarkLearned={markLearned}/>}
  {page==="review"&&<ReviewPage go={go} onStart={count=>openTest(null,"mixed",null,count)}/>}
  {page==="wrong"&&<WrongPage progress={userData.progress} onStart={questionIds=>openTest(null,"failed",questionIds)} onMarkLearned={markLearned} go={go}/>}
  {page==="favorites"&&<FavoritesPage favorites={userData.favorites} onToggleFavorite={toggleFavorite} go={go}/>}
  {page==="progress"&&<ProgressPage progress={userData.progress} onStart={topicId=>openTest(topicId)}/>}
  {page==="simulacrum"&&<SimulacrumPage go={go}/>}
  {page==="settings"&&<SettingsPage userData={userData} onRestore={setUserData} onThemeChange={theme=>setUserData(data=>({...data,theme}))}/>}
  </main>
 </div>
}
const pageTitle=p=>({summaries:"Resúmenes",topic:"Tema",test:"Test",review:"Repaso",wrong:"Preguntas falladas",favorites:"Favoritas",progress:"Progreso",simulacrum:"Simulacro",settings:"Configuración"}[p]);

function ExamCountdown({go}){
 const [now,setNow]=useState(()=>new Date());
 useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),1000);return ()=>clearInterval(timer)},[]);
 const {days,hours,minutes,seconds,isPast}=getCountdown(now);
 const examDateLabel=EXAM_DATE.toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"});
 return <section className="homeCountdown" aria-labelledby="countdown-title">
  <div className="countdownInfo"><span className="eyebrow"><Hourglass/> EXAMEN OPE</span><h3 id="countdown-title">{isPast?"¡El examen ya está aquí!":"Cuenta atrás hasta el examen"}</h3><p>{examDateLabel}</p></div>
  <div className="countdownBlocks">
   <div className="countdownBlock"><strong>{days}</strong><small>días</small></div>
   <div className="countdownBlock"><strong>{String(hours).padStart(2,"0")}</strong><small>horas</small></div>
   <div className="countdownBlock"><strong>{String(minutes).padStart(2,"0")}</strong><small>min</small></div>
   <div className="countdownBlock"><strong>{String(seconds).padStart(2,"0")}</strong><small>seg</small></div>
  </div>
 </section>
}

function HomePage({go,openTest,progress}){
 const availableTopics=topics.filter(topic=>getQuestionBank(topic.id).length||getPdfUrl(topic.id));
 const totalQuestions=topics.reduce((total,topic)=>total+getQuestionBank(topic.id).length,0);
 const progressByTopic=availableTopics.map(topic=>{const questions=getQuestionBank(topic.id);return {...getTopicProgress(questions,progress,topic.id),total:questions.length}});
 const practicedQuestions=progressByTopic.reduce((total,topic)=>total+topic.answered,0);
 const startedTopics=progressByTopic.filter(topic=>topic.answered>0).length;
 const globalMastery=totalQuestions?Math.round(progressByTopic.reduce((total,topic)=>total+topic.mastery*topic.total,0)/totalQuestions):0;
 const featuredTopics=availableTopics.slice(0,6);
 return <div className="homeDashboard">
  <ExamCountdown go={go}/>
  <section className="homeStart">
   <div><span className="eyebrow">SESIÓN DE ESTUDIO</span><h2>¿Qué quieres practicar hoy?</h2><p>Elige un tema y empieza un test con su banco de preguntas.</p></div>
    <button className="homePrimaryAction" onClick={()=>openTest(null)}><span><Brain/></span><div><b>Test por temas</b><small>{availableTopics.length} temas disponibles</small></div><ChevronRight/></button>
  </section>
  <section className="homeSection" aria-labelledby="quick-access-title">
   <div className="homeSectionTitle"><div><span className="eyebrow">ACCESOS DIRECTOS</span><h3 id="quick-access-title">Tu estudio, a un toque</h3></div></div>
   <div className="homeQuickGrid">
    <button className="homeQuickAction failed" onClick={()=>go("wrong")}><span className="homeQuickIcon"><RotateCcw/></span><div><b>Preguntas falladas</b><small>Vuelve sobre tus errores</small></div><ChevronRight/></button>
    <button className="homeQuickAction favorite" onClick={()=>go("favorites")}><span className="homeQuickIcon"><Star/></span><div><b>Preguntas favoritas</b><small>Practica las que guardes</small></div><ChevronRight/></button>
    <button className="homeQuickAction progress" onClick={()=>go("progress")}><span className="homeQuickIcon"><BarChart3/></span><div><b>Ver mi progreso</b><small>Consulta tu evolución</small></div><ChevronRight/></button>
   </div>
  </section>
  <section className="homeProgress" aria-labelledby="progress-summary-title">
   <div className="homeSectionTitle"><div><span className="eyebrow">TU PROGRESO</span><h3 id="progress-summary-title">Resumen de actividad</h3></div><button className="homeTextButton" onClick={()=>go("progress")}>Ver detalle <ChevronRight/></button></div>
   <div className="homeProgressGrid">
    <div className="homeMetric"><span><Target/></span><div><strong>{globalMastery}%</strong><small>Dominio global</small></div></div>
    <div className="homeMetric"><span><Layers3/></span><div><strong>{startedTopics} de {availableTopics.length}</strong><small>Temas iniciados</small></div></div>
    <div className="homeMetric"><span><Brain/></span><div><strong>{practicedQuestions.toLocaleString("es-ES")}</strong><small>Preguntas practicadas</small></div></div>
   </div>
  </section>
  <section className="homeSection" aria-labelledby="featured-topics-title">
   <div className="homeSectionTitle"><div><span className="eyebrow">EMPIEZA POR UN TEMA</span><h3 id="featured-topics-title">Temas disponibles</h3></div><button className="homeTextButton" onClick={()=>go("test")}>Ver todos <ChevronRight/></button></div>
    <div className="homeTopicGrid">{featuredTopics.map(topic=><button className="homeTopicButton" key={topic.id} onClick={()=>openTest(topic.id)}><span>{String(topic.id).padStart(2,"0")}</span><div><b>{topic.title}</b><small>{getQuestionBank(topic.id).length.toLocaleString("es-ES")} preguntas</small></div><ChevronRight/></button>)}</div>
  </section>
 </div>
}

function Stat({icon,value,label}){return <div className="stat"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function TopicRow({t,onClick}){return <button className="topicRow" onClick={onClick}><div className="num">{String(t.id).padStart(2,"0")}</div><div className="topicInfo"><b>{t.title}</b><small>Banco de preguntas</small></div></button>}

function SummaryPage({openTopic}){const [q,setQ]=useState("");const filtered=topics.filter(t=>t.title.toLowerCase().includes(q.toLowerCase()));return <div>
 <div className="pageIntro"><p>Selecciona un tema para consultar su contenido.</p><div className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar tema..."/></div></div>
 <div className="filterRow"><span>{topics.length} temas</span></div>
 <div className="resumeGrid">{filtered.map(t=>{const summary=getSummary(t.id);return <article className="resumeCard" key={t.id} role="button" tabIndex={0} onClick={()=>openTopic(t)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openTopic(t)}}}><div className="resumeTop"><span className="num">{String(t.id).padStart(2,"0")}</span></div><h3>{t.title}</h3><p>{summary?.intro ?? "Contenido pendiente de añadir."}</p><div className="resumeLinks"><span>Banco del tema</span><ChevronRight/></div></article>})}</div>
 </div>}

function VisualSummary({html}){const ref=useRef(null);
 // Los índices del resumen son enlaces "#vs-sN": se desplaza dentro de la página sin tocar la URL.
 const onClick=e=>{const link=e.target.closest?.('a[href^="#vs-"]');if(!link)return;e.preventDefault();ref.current?.querySelector(link.getAttribute("href"))?.scrollIntoView({behavior:"smooth",block:"start"})};
 // Marca en la barra fija la pestaña del bloque que se está leyendo.
 useEffect(()=>{const root=ref.current;if(!root||!("IntersectionObserver" in window))return;
  const setActive=id=>root.querySelectorAll(".chips a").forEach(a=>{const on=a.getAttribute("href")===`#${id}`;a.classList.toggle("active",on);if(on){const bar=a.parentElement;bar.scrollTo({left:a.offsetLeft-bar.clientWidth/2+a.offsetWidth/2,behavior:"smooth"})}});
  const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(visible)setActive(visible.target.id)},{rootMargin:"-70px 0px -65% 0px"});
  root.querySelectorAll('h2[id^="vs-"]').forEach(h=>observer.observe(h));return()=>observer.disconnect()},[html]);
 return <div className="vsum" ref={ref} onClick={onClick} dangerouslySetInnerHTML={{__html:visualSummaryDefs+html}}/>}

function TopicPage({topic,go,onStartTest}){const summary=getSummary(topic.id);const visual=getVisualSummary(topic.id);return <div>
 <button className="back" onClick={()=>go("summaries")}><ArrowLeft/> Volver a resúmenes</button>
 <header className="topicHeader"><div><span className="topicEyebrow">TEMA {String(topic.id).padStart(2,"0")}</span><h2>{topic.title}</h2></div><button className="topicTestButton" onClick={onStartTest}><Brain/><span>Hacer test</span></button></header>
 {visual?<div className="visualLayout"><VisualSummary html={visual}/><TopicActions go={go} onStartTest={onStartTest}/></div>:
 <div className="topicLayout"><article className="studyCard"><h3>📌 Resumen esencial</h3>{summary?<div className="summaryContent">
   {summary.sections.map(section=><section className="summarySection" key={section.heading}><h4>{section.heading}</h4><ul>{section.points.map(point=><li key={point}>{formatEmphasis(point)}</li>)}</ul></section>)}
   {summary.keyFacts?.length>0&&<section className="summarySection keyFacts"><h4>⭐ Datos y valores que debes saber sí o sí</h4><ul>{summary.keyFacts.map(fact=><li key={fact}>{formatEmphasis(fact)}</li>)}</ul></section>}
   {summary.commonMistakes?.length>0&&<section className="summarySection commonMistakes"><h4>⚠️ Errores frecuentes en examen</h4><ul>{summary.commonMistakes.map(mistake=><li key={mistake}>{formatEmphasis(mistake)}</li>)}</ul></section>}
  </div>:<div className="placeholder"><h4>Lo imprescindible</h4><p>Aquí irá el contenido estructurado del tema. La plantilla está preparada para añadir el resumen, conceptos clave, valores, técnicas y puntos de examen sin cambiar el diseño.</p><ul><li>Conceptos fundamentales</li><li>Datos y valores que memorizar</li><li>Interpretación de resultados</li><li>Errores frecuentes en examen</li></ul></div>}
  <h3>⭐ Preguntas que debes dominar</h3><div className="questionStrip">Añade aquí las preguntas estrella del tema.</div>
  <h3>🧠 Reglas mnemotécnicas</h3>{summary?.mnemonics?.length>0?<ul className="mnemonicList">{summary.mnemonics.map(rule=><li key={rule}>{formatEmphasis(rule)}</li>)}</ul>:<div className="questionStrip">Espacio preparado para tus reglas y trucos de memoria.</div>}
 </article>
 <TopicActions go={go} onStartTest={onStartTest}/></div>}
 </div>}

function TopicActions({go,onStartTest}){return <aside className="topicActions"><div className="card"><h3>¿Qué hacemos ahora?</h3><button className="action" onClick={onStartTest}><Brain/><div><b>Hacer test</b><small>Preguntas disponibles del tema</small></div><ChevronRight/></button><button className="action"><Star/><div><b>Marcar para repasar</b><small>Guardar este tema</small></div></button><button className="action" onClick={()=>go("wrong")}><RotateCcw/><div><b>Repasar errores</b><small>Solo preguntas falladas</small></div></button></div></aside>}

const crossTopicCopy={
 failed:{backPage:"wrong",backLabel:"Volver a preguntas falladas",emptyTitle:"No tienes preguntas falladas",emptyText:"Las preguntas que falles aparecerán aquí para volver a practicarlas.",restartLabel:"Volver a falladas"},
 mixed:{backPage:"review",backLabel:"Volver al repaso general",emptyTitle:"No hay preguntas disponibles todavía",emptyText:"Añade preguntas a los temas para poder generar un repaso general.",restartLabel:"Volver al repaso"}
};

function TestPage({go,onChangeTopic,initialTopicId=null,initialQuestionIds=null,initialQuestionCount=null,mode:initialMode="topic",questionProgress={},onProgressChange,favorites=[],onToggleFavorite,onMarkLearned}){
 const [mode,setMode]=useState(initialMode);
 const [selectedTopicId,setSelectedTopicId]=useState(initialTopicId);
 const [savedTest,setSavedTest]=useState(()=>initialMode==="topic"&&!initialTopicId?loadResumableTest():null);
 const [questionCount,setQuestionCount]=useState(20);
 const isCrossTopic=mode==="failed"||mode==="mixed";
 const [testQuestions,setTestQuestions]=useState(()=>{
  if(initialMode==="failed"){const failedQuestions=getFailedQuestions(questionProgress);const selectedFailedQuestions=initialQuestionIds?.length?failedQuestions.filter(question=>initialQuestionIds.includes(getQuestionIdForProgress(question))):failedQuestions;return selectSmartQuestions(selectedFailedQuestions,questionProgress,selectedFailedQuestions.length).map(question=>shuffleQuestionOptions(question));}
  if(initialMode==="mixed") return selectSmartQuestions(getAllQuestions(),questionProgress,initialQuestionCount??20).map(question=>shuffleQuestionOptions(question));
  return initialTopicId?selectSmartQuestions(getQuestionBank(initialTopicId).map(question=>({...question,topicId:initialTopicId})),questionProgress,20).map(question=>shuffleQuestionOptions(question)):[];
 });
 const [i,setI]=useState(0);
 const [answersByIndex,setAnswersByIndex]=useState({});
 const [done,setDone]=useState(false);
 const [loadedQuestions,setLoadedQuestions]=useState({});
 const [loading,setLoading]=useState(false);

 const currentTopic=mode==="failed"?{id:0,title:"Preguntas falladas"}:mode==="mixed"?{id:0,title:"Repaso general"}:selectedTopicId ? topics.find(t=>t.id===selectedTopicId) : null;
 const totalQuestions=testQuestions.length;
 const q=testQuestions[i] ?? null;
 const selectedAnswer=answersByIndex[i] ?? null;
 const showResult=Object.prototype.hasOwnProperty.call(answersByIndex,i);
 const score=testQuestions.reduce((total,question,index)=>total+(answersByIndex[index]===question.correctAnswer?1:0),0);
 const isFavorite=q?favorites.includes(getQuestionIdForProgress(q)):false;
 const isLearned=q?questionProgress[getQuestionIdForProgress(q)]?.marcadaAprendida===true:false;
 const structuredExplanation=q?explainQuestion(q,q.topicId??currentTopic?.id):null;

 const startTopicTest=topicId=>{
  const questions=(loadedQuestions[topicId]??getQuestionBank(topicId)).map(question=>({...question,topicId}));
  setSelectedTopicId(topicId);
  setTestQuestions(selectSmartQuestions(questions,questionProgress,questionCount).map(question=>shuffleQuestionOptions(question)));
  setI(0);
  setAnswersByIndex({});
  setDone(false);
 };

 useEffect(()=>{
    if(!selectedTopicId || loadedQuestions[selectedTopicId] || getQuestionBank(selectedTopicId).length) return;
    const pdfUrl=getPdfUrl(selectedTopicId);
    if(!pdfUrl) return;
    setLoading(true);
    parsePdfQuestions(pdfUrl)
      .then(questions=>{
       setLoadedQuestions(prev=>({...prev,[selectedTopicId]:questions}));
       setTestQuestions(selectSmartQuestions(questions.map(question=>({...question,topicId:selectedTopicId})),questionProgress,questionCount).map(question=>shuffleQuestionOptions(question)));
      })
     .catch(error=>console.error("No se pudo cargar el PDF del tema",selectedTopicId,error))
     .finally(()=>setLoading(false));
 },[selectedTopicId,loadedQuestions]);

 const resetSelection=()=>{
  setSelectedTopicId(null);
  setI(0);
  setAnswersByIndex({});
  setDone(false);
  setTestQuestions([]);
 };

 // guarda el test en curso para poder continuarlo al volver o tras recargar la página
 useEffect(()=>{
  if(done){clearTestSession();return;}
  if(!testQuestions.length||!Object.keys(answersByIndex).length) return;
  saveTestSession({mode,topicId:selectedTopicId,questions:testQuestions.map(({id,number,topicId,question,answers})=>({id,number,topicId,question,answers})),index:i,answers:answersByIndex,savedAt:Date.now()});
 },[mode,selectedTopicId,testQuestions,i,answersByIndex,done]);

 const resumeSavedTest=()=>{
  if(!savedTest) return;
  setMode(savedTest.mode);
  setSelectedTopicId(savedTest.topicId);
  setTestQuestions(savedTest.questions);
  setI(savedTest.index);
  setAnswersByIndex(savedTest.answers);
  setDone(false);
  setSavedTest(null);
 };

 const discardSavedTest=()=>{clearTestSession();setSavedTest(null)};

 const handleAnswer=(answerIndex)=>{
  if(!q || showResult) return;
  setAnswersByIndex(answers=>({...answers,[i]:answerIndex}));
  onProgressChange?.(recordQuestionAnswer(q,questionProgress,answerIndex===q.correctAnswer,Date.now(),answerIndex));
 };

 const handleNext=()=>{
  if(!q) return;
  if(i>=totalQuestions-1){
   setDone(true);
   return;
  }
  setI(prev=>prev+1);
 };

 const handlePrevious=()=>setI(index=>Math.max(0,index-1));

 if(!isCrossTopic&&!selectedTopicId){
   return <div className="testThemeSelector"><div className="testMeta"><span>SELECCIÓN DE TEMA</span><b>{topics.length} temas</b></div>{savedTest&&<div className="resumeTestBanner" role="status"><div><b>Tienes un test sin terminar</b><small>{savedTest.mode==="failed"?"Preguntas falladas":savedTest.mode==="mixed"?"Repaso general":`Tema ${String(savedTest.topicId).padStart(2,"0")}`} · {Object.keys(savedTest.answers).length} de {savedTest.questions.length} respondidas</small></div><div className="resumeTestActions"><button className="primary" type="button" onClick={resumeSavedTest}><Play/> Continuar</button><button className="secondary" type="button" onClick={discardSavedTest}>Descartar</button></div></div>}<div className="testCountSelector"><span>Preguntas por test</span><div className="choiceRow">{[10,20,30].map(count=><button key={count} className={questionCount===count?"selected":""} onClick={()=>setQuestionCount(count)}>{count}</button>)}</div><small>La selección prioriza preguntas nuevas, errores pendientes y repasos programados.</small></div><div className="testTopicsGrid">{topics.map(topic=>{const questions=getQuestionBank(topic.id);const questionTotal=questions.length;const topicMastery=getTopicProgress(questions,questionProgress,topic.id);return <button key={topic.id} className="topicSelectCard" onClick={()=>startTopicTest(topic.id)}><span className="badge">Tema {String(topic.id).padStart(2,"0")}</span><h3>{topic.title}</h3><small>{questionTotal?`${questionTotal.toLocaleString("es-ES")} preguntas disponibles`:getPdfUrl(topic.id)?"PDF disponible":"Sin preguntas cargadas"}</small>{questionTotal>0&&<div className="topicMastery"><div><span>{topicMastery.answered} de {questionTotal.toLocaleString("es-ES")} practicadas</span><b>{topicMastery.mastery}%</b></div><i><em style={{width:`${topicMastery.mastery}%`}}/></i></div>}</button>})}</div></div>;
 }

 if(loading){
  return <div className="result card"><div className="resultIcon">📄</div><h2>Cargando preguntas</h2><p>Estamos leyendo el PDF del tema seleccionado.</p></div>;
 }

 if(!q){
  return <div className="result card"><div className="resultIcon">📘</div><h2>{isCrossTopic?crossTopicCopy[mode].emptyTitle:"Este tema aún no tiene preguntas"}</h2><p>{isCrossTopic?crossTopicCopy[mode].emptyText:"El banco de preguntas está preparado para añadirse desde archivos separados por tema."}</p><button className="primary" onClick={()=>go(isCrossTopic?crossTopicCopy[mode].backPage:"test")}>{isCrossTopic?crossTopicCopy[mode].backLabel:"Volver a temas"}</button></div>;
 }

 if(done){
  return <div className="result card"><div className="resultIcon">🏆</div><h2>Sesión terminada</h2><strong>{score}/{totalQuestions}</strong><p>Has completado una selección inteligente de este banco.</p><button className="primary" onClick={()=>isCrossTopic?go(crossTopicCopy[mode].backPage):startTopicTest(selectedTopicId)}>Crear otro test</button><button className="secondary" onClick={()=>isCrossTopic?go(crossTopicCopy[mode].backPage):onChangeTopic()}>{isCrossTopic?crossTopicCopy[mode].restartLabel:"Elegir otro tema"}</button></div>;
 }

 return <div className="testWrap"><div className="testMeta"><span>{currentTopic.title.toUpperCase()}</span><b>{i+1} / {totalQuestions}</b></div><div className="progressLine"><i style={{width:((i+1)/totalQuestions*100)+"%"}}/></div><div className="testCard"><span className="badge">{isCrossTopic?`Tema ${String(q.topicId).padStart(2,"0")}`:`Tema ${String(currentTopic.id).padStart(2,"0")}`}</span><h2>{q.number}. {q.question}</h2><div className="answers">{q.answers.map((answer,index)=><button key={answer+index} type="button" onClick={()=>handleAnswer(index)} disabled={showResult} className={showResult ? (index===q.correctAnswer ? "correct" : (selectedAnswer===index ? "incorrect" : "")) : ""}><span>{String.fromCharCode(65+index)}</span>{answer}</button>)}</div>{showResult&&<div className="testFeedback"><ExplanationDisplay structured={structuredExplanation} fallback={q.explanation} correctAnswerText={q.answers[q.correctAnswer]} isCorrect={selectedAnswer===q.correctAnswer}/></div>}{mode==="failed"&&showResult&&<div className="failedQuestionAction"><button className="markLearnedButton" onClick={()=>onMarkLearned(q)} disabled={isLearned}><CheckCircle2/>{isLearned?"Marcada como aprendida":"Marcar como aprendida"}</button></div>}<div className="testActions"><button className="secondary" onClick={handlePrevious} disabled={i===0}><ArrowLeft/> Anterior</button><button className={isFavorite?"secondary favoriteAction active":"secondary favoriteAction"} onClick={()=>onToggleFavorite(q)}><Star fill={isFavorite?"currentColor":"none"}/> Favoritos</button><button className="primary" onClick={handleNext}>{i===totalQuestions-1?"Finalizar":"Siguiente"} <ChevronRight/></button></div><button className="changeTopicButton" onClick={()=>isCrossTopic?go(crossTopicCopy[mode].backPage):onChangeTopic()}>{isCrossTopic?crossTopicCopy[mode].backLabel:"Cambiar de tema"}</button></div></div>;
}

function ReviewPage({go,onStart}){
 const [count,setCount]=useState(20);
 const totalAvailable=useMemo(()=>getAllQuestions().length,[]);
 if(!totalAvailable) return <div><div className="reviewHero"><h2>Tu zona de repaso</h2><p>El repaso se activará cuando haya preguntas cargadas en los temas.</p><button className="primary" onClick={()=>go("test")}>Empezar un test</button></div></div>;
 return <div className="reviewPage">
  <div className="reviewHero"><h2>Repaso general</h2><p>Test aleatorio que mezcla preguntas de los {topics.length} temas para practicar un repaso real, como en el examen.</p></div>
  <div className="reviewSetup">
   <span className="reviewSetupLabel">Preguntas por test</span>
   <div className="reviewCountRow">{[10,20,30,50].map(value=><button key={value} type="button" className={count===value?"selected":""} onClick={()=>setCount(value)}>{value}</button>)}</div>
   <button className="primary" type="button" onClick={()=>onStart(count)}>Empezar repaso aleatorio</button>
  </div>
 </div>;
}

function WrongPage({progress,onStart,onMarkLearned,go}){
 const failedQuestions=getFailedQuestions(progress);
 const failedCount=failedQuestions.length;
 if(!failedCount) return <div><div className="reviewHero"><h2>Preguntas falladas</h2><p>Aquí aparecerán las preguntas que respondas incorrectamente.</p><button className="primary" onClick={()=>go("test")}>Empezar un test</button></div></div>;
 return <div className="wrongPage"><div className="reviewHero"><h2>Preguntas falladas</h2><p>Tienes {failedCount} {failedCount===1?"pregunta pendiente":"preguntas pendientes"}. Pulsa una pregunta para practicarla o haz el test completo.</p><button className="primary" onClick={()=>onStart()}>Hacer todas las falladas</button></div><div className="wrongQuestionList">{failedQuestions.map(question=>{const id=getQuestionIdForProgress(question);const state=progress[id];return <article className="wrongQuestion" key={id}><button className="wrongQuestionBody" onClick={()=>onStart([id])}><div className="wrongQuestionMeta"><span className="badge">Tema {String(question.topicId).padStart(2,"0")}</span><span>{state?.vecesFallada??1} {(state?.vecesFallada??1)===1?"fallo":"fallos"}</span></div><h3>{question.question}</h3><small className="wrongPracticeHint"><Play/> Practicar esta pregunta</small></button><button className="markLearnedButton" onClick={()=>onMarkLearned(question)} title="Quitar de preguntas falladas"><CheckCircle2/> Marcar como aprendida</button></article>})}</div></div>;
}

function FavoritesPage({favorites,onToggleFavorite,go}){const questions=getFavoriteQuestions(favorites);if(!questions.length)return <div><div className="reviewHero"><Star/><h2>Tus preguntas favoritas</h2><p>Las preguntas que marques como favoritas aparecerán aquí.</p><button className="primary" onClick={()=>go("test")}>Explorar preguntas</button></div></div>;return <div className="favoritesPage"><div className="pageIntro"><div><span className="eyebrow">GUARDADAS</span><h2>Tus preguntas favoritas</h2><p>{questions.length} {questions.length===1?"pregunta guardada":"preguntas guardadas"}</p></div></div><div className="favoriteQuestionList">{questions.map(question=><article className="favoriteQuestion" key={getQuestionIdForProgress(question)}><div><span className="badge">Tema {String(question.topicId).padStart(2,"0")}</span><h3>{question.question}</h3></div><button className="favoriteRemove" onClick={()=>onToggleFavorite(question)} title="Quitar de favoritos"><Star fill="currentColor"/></button></article>)}</div></div>}

function ProgressPage({progress,onStart}){
 const topicProgress=topics.map(topic=>{const questions=getQuestionBank(topic.id);return {...topic,total:questions.length,...getTopicProgress(questions,progress,topic.id)}});
 const available=topicProgress.filter(topic=>topic.total>0);
 const totalQuestions=available.reduce((total,topic)=>total+topic.total,0);
 const answered=available.reduce((total,topic)=>total+topic.answered,0);
 const attempts=available.reduce((total,topic)=>total+topic.attempts,0);
 const correct=available.reduce((total,topic)=>total+topic.correct,0);
 const globalMastery=totalQuestions?Math.round(available.reduce((total,topic)=>total+topic.mastery*topic.total,0)/totalQuestions):0;
 const accuracy=attempts?Math.round(correct/attempts*100):0;
 return <div className="progressPage">
  <section className="progressOverview"><div><span className="eyebrow">DOMINIO GLOBAL</span><strong>{globalMastery}%</strong><p>Tu dominio aumenta al consolidar preguntas de cada tema.</p></div><div className="progressSummary"><div><b>{answered.toLocaleString("es-ES")}</b><small>Preguntas practicadas</small></div><div><b>{accuracy}%</b><small>Aciertos totales</small></div><div><b>{available.filter(topic=>topic.answered>0).length}</b><small>Temas iniciados</small></div></div></section>
  <section className="progressTopics" aria-labelledby="topic-progress-title"><div className="progressSectionTitle"><div><span className="eyebrow">POR TEMA</span><h2 id="topic-progress-title">Tu avance</h2></div><small>{answered} de {totalQuestions.toLocaleString("es-ES")} preguntas practicadas</small></div><div className="progressTopicList">{topicProgress.map(topic=><article className="progressTopic" key={topic.id}><span className="progressTopicNumber">{String(topic.id).padStart(2,"0")}</span><div className="progressTopicBody"><div className="progressTopicHeading"><div><h3>{topic.title}</h3><small>{topic.total?`${topic.answered} de ${topic.total.toLocaleString("es-ES")} preguntas · ${topic.attempts?Math.round(topic.correct/topic.attempts*100):0}% aciertos`:"Banco pendiente"}</small></div><strong>{topic.mastery}%</strong></div><div className="progressTrack" role="progressbar" aria-label={`Dominio de ${topic.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={topic.mastery}><i style={{width:`${topic.mastery}%`}}/></div></div>{topic.total>0&&<button className="progressPractice" onClick={()=>onStart(topic.id)} title={`Practicar ${topic.title}`}><ChevronRight/></button>}</article>)}</div></section>
 </div>
}

function SettingsPage({userData,onRestore,onThemeChange}){
 const importInput=useRef(null);
 const [message,setMessage]=useState(null);
 const progressCount=Object.keys(userData.progress??{}).length;
 const favoritesCount=userData.favorites?.length??0;

 const exportBackup=()=>{
  const content=JSON.stringify(createBackup(userData),null,2);
  const url=URL.createObjectURL(new Blob([content],{type:"application/json"}));
  const link=document.createElement("a");
  link.href=url;
  link.download=`labquiz-copia-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setMessage({type:"success",text:"Copia creada. Guárdala en Archivos, iCloud Drive o en otro lugar seguro."});
 };

 const importBackup=async event=>{
  const file=event.target.files?.[0];
  event.target.value="";
  if(!file)return;
  try{
   const restored=parseBackup(await file.text());
   const confirmed=window.confirm("Esta copia sustituirá el progreso y los favoritos guardados en este navegador. ¿Quieres continuar?");
   if(!confirmed)return;
   onRestore(restored);
   setMessage({type:"success",text:"Copia restaurada correctamente. Tu progreso ya está actualizado."});
  }catch(error){
   setMessage({type:"error",text:error instanceof Error?error.message:"No se pudo leer la copia de seguridad."});
  }
 };

 return <div className="settingsPage">
  <section className="settingsIntro"><span className="settingsIcon"><ShieldCheck/></span><div><span className="eyebrow">DATOS Y SEGURIDAD</span><h2>Protege tu progreso</h2><p>Descarga una copia para recuperar tus datos si cambias de móvil, navegador o borras los datos del sitio.</p></div></section>
  <section className="settingsCard themeSetting"><div className="settingsCardText"><h3>Modo noche</h3><p>Reduce el brillo de la interfaz para estudiar con poca luz.</p></div><div className="themeControl"><Sun/><button className="themeSwitch" type="button" role="switch" aria-checked={userData.theme==="dark"} aria-label="Activar modo noche" onClick={()=>onThemeChange(userData.theme==="dark"?"light":"dark")}><span/></button><Moon/></div></section>
  <section className="settingsCard"><div className="settingsCardText"><h3>Copia de seguridad</h3><p>Incluye tu dominio por tema, respuestas, preguntas falladas y favoritas.</p><div className="backupSummary"><span><b>{progressCount}</b> preguntas con actividad</span><span><b>{favoritesCount}</b> favoritas</span></div></div><div className="settingsActions"><button className="primary" onClick={exportBackup}><Download/> Descargar copia</button><button className="secondary" onClick={()=>importInput.current?.click()}><Upload/> Restaurar copia</button><input ref={importInput} className="backupFileInput" type="file" accept="application/json,.json" onChange={importBackup}/></div></section>
  {message&&<div className={`backupMessage ${message.type}`} role="status">{message.text}</div>}
  <section className="settingsNotice"><h3>Dónde guardarla</h3><p>En iPhone, elige <b>Guardar en Archivos</b> y selecciona iCloud Drive. La copia contiene datos de estudio, pero no contraseñas ni información bancaria.</p></section>
 </div>
}

function SimulacrumPage({go}){return <div><section className="simHero"><Trophy/><h2>Simulacro de oposición</h2><p>El simulacro estará disponible cuando haya preguntas cargadas.</p><button className="secondary" onClick={()=>go("test")}>Ver temas disponibles</button></section></div>}

createRoot(document.getElementById("root")).render(<App/>);
