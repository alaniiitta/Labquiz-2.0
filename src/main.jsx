import React,{useEffect,useMemo,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import {Home,BookOpen,Brain,RotateCcw,BarChart3,Trophy,Search,ChevronRight,Star,FlaskConical,Menu,X,ArrowLeft,Target,Layers3,Settings,Download,Upload,ShieldCheck,CheckCircle2,Moon,Sun,Play,Hourglass,Timer,Flag,LayoutGrid} from "lucide-react";
import "./styles.css";

import questionBank,{duplicateAliases} from "./questions";
import summaryBank from "./summaries/index.js";
import visualSummaryBank,{sharedDefs as visualSummaryDefs} from "./summaries/visual/index.js";
import {parsePdfQuestions} from "./pdfPipeline.js";
import {getQuestionIdForProgress,getTopicProgress,isQuestionCurrentlyFailed,markQuestionAsLearned,recordQuestionAnswer,selectSmartQuestions,shuffleQuestionOptions} from "./smartQuestionSelector.js";
import ExplanationDisplay from "./components/ExplanationDisplay.jsx";
import {explainQuestion} from "./lib/explainQuestion.js";
import {clearExamSession,clearTestSession,createBackup,loadSavedExam,loadSavedTest,saveExamSession,loadUserData,migrateDuplicateProgress,parseBackup,saveTestSession,saveUserData} from "./lib/storage.js";
import {EXAM_DATE,getCountdown} from "./lib/studyPlan.js";
import {buildTopicIndex,highlightTerms} from "./lib/summaryLinks.js";

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
 {id:23,title:"Epidemiología, bioética y estadística"}
];

const getTopicKey=id=>`tema-${String(id).padStart(2,"0")}`;
const getQuestionBank=id=>(questionBank[getTopicKey(id)] ?? []);
const getSummary=id=>summaryBank[getTopicKey(id)];
const getVisualSummary=id=>visualSummaryBank[getTopicKey(id)]
// apartados del resumen visual y qué preguntas del banco explica cada uno
const getSummaryIndex=topicId=>{const html=getVisualSummary(topicId);if(!html)return null;return buildTopicIndex(topicId,html,getQuestionBank(topicId).map(question=>({...question,topicId})),getQuestionIdForProgress,question=>explainQuestion(question,topicId))};
const formatEmphasis=text=>String(text).split(/(\*\*[^*]+\*\*|__[^_]+__)/g).filter(Boolean).map((part,index)=>{
 if(part.startsWith("**")&&part.endsWith("**")) return <strong key={index}>{part.slice(2,-2)}</strong>;
 if(part.startsWith("__")&&part.endsWith("__")) return <u key={index}>{part.slice(2,-2)}</u>;
 return part;
});
const getPdfUrl=id=>Object.entries(pdfFiles).find(([path])=>new RegExp(`(?:tema|topic)[-_\\s]*${String(id).padStart(2,"0")}(?:\\D|$)` ,"i").test(path))?.[1]
    ?? Object.entries(pdfFiles).find(([path])=>new RegExp(`(?:tema|topic)[-_\\s]*${id}(?:\\D|$)` ,"i").test(path))?.[1];
const getAllQuestions=()=>topics.flatMap(topic=>getQuestionBank(topic.id).map(question=>({...question,topicId:topic.id})));
// simulacro: preguntas repartidas entre temas en proporción al tamaño de cada banco
const SIMULACRUM_MIN=60;
// examen real: solo el simulacro de 100 (1 h 30 min, cada 4 fallos restan 1 acierto, las en blanco no restan)
const EXAM_COUNT=100;
const EXAM_DURATION=90*60*1000;
const EXAM_PENALTY=1/4;
const selectSimulacrumQuestions=(count,progress)=>{
 const pools=topics.map(topic=>getQuestionBank(topic.id).map(question=>({...question,topicId:topic.id}))).filter(pool=>pool.length);
 const total=pools.reduce((sum,pool)=>sum+pool.length,0);
 const quotas=pools.map(pool=>count*pool.length/total);
 const counts=quotas.map(Math.floor);
 // reparte los huecos que faltan a los temas con mayor resto
 quotas.map((quota,index)=>[quota-Math.floor(quota),index]).sort((a,b)=>b[0]-a[0]).slice(0,count-counts.reduce((a,b)=>a+b,0)).forEach(([,index])=>{counts[index]+=1});
 const picked=pools.flatMap((pool,index)=>selectSmartQuestions(pool,progress,counts[index]));
 for(let i=picked.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[picked[i],picked[j]]=[picked[j],picked[i]]}
 return picked;
};
const getFailedQuestions=progress=>getAllQuestions().filter(question=>isQuestionCurrentlyFailed(progress[getQuestionIdForProgress(question)]));
const getFavoriteQuestions=favorites=>getAllQuestions().filter(question=>favorites.includes(getQuestionIdForProgress(question)));
const sameAnswerSet=(a=[],b=[])=>a.length===b.length&&[...a].sort().join("\u0000")===[...b].sort().join("\u0000");
// Recupera el test en curso solo si todas sus preguntas siguen en el banco sin cambios.
const restoreSavedQuestions=saved=>{
 if(!Array.isArray(saved)||!saved.length) return null;
 const bankById=new Map(getAllQuestions().map(question=>[getQuestionIdForProgress(question),question]));
 const questions=saved.map(item=>{
  const current=bankById.get(getQuestionIdForProgress(item));
  if(!current||current.question!==item.question||!sameAnswerSet(current.answers,item.answers)) return null;
  const correctAnswer=item.answers.indexOf(current.answers[current.correctAnswer]);
  return correctAnswer<0?null:{...current,answers:item.answers,correctAnswer};
 });
 return questions.some(question=>!question)?null:questions;
};
const loadResumableTest=()=>{
 const session=loadSavedTest();
 if(!session||!["topic","failed","mixed"].includes(session.mode)) return null;
 const questions=restoreSavedQuestions(session.questions);
 if(!questions) return null;
 const index=Math.min(Math.max(0,Number(session.index)||0),questions.length-1);
 const answers=Object.fromEntries(Object.entries(session.answers??{}).filter(([key,value])=>Number(key)<questions.length&&Number.isInteger(value)));
 return {mode:session.mode,topicId:session.topicId??null,questions,index,answers};
};

// Recupera el simulacro en curso (con su reloj) si sus preguntas siguen igual en el banco.
const loadResumableExam=()=>{
 const session=loadSavedExam();
 if(!session||!Number.isFinite(session.deadline)||!Number.isFinite(session.startedAt)) return null;
 const questions=restoreSavedQuestions(session.questions);
 if(!questions) return null;
 const answers=Object.fromEntries(Object.entries(session.answers??{}).filter(([key,value])=>Number(key)<questions.length&&Number.isInteger(value)));
 const flags=(Array.isArray(session.flags)?session.flags:[]).filter(index=>Number.isInteger(index)&&index<questions.length);
 return {questions,answers,flags,index:Math.min(Math.max(0,Number(session.index)||0),questions.length-1),startedAt:session.startedAt,deadline:session.deadline};
};
const formatClock=ms=>{const total=Math.max(0,Math.ceil(ms/1000));const h=Math.floor(total/3600),m=Math.floor(total%3600/60),sec=total%60;return `${h?h+":":""}${String(m).padStart(h?2:1,"0")}:${String(sec).padStart(2,"0")}`};
const formatScore=value=>value.toLocaleString("es-ES",{maximumFractionDigits:2});

function App(){
 const [page,setPage]=useState("home"),[selected,setSelected]=useState(null),[mobile,setMobile]=useState(false),[testConfig,setTestConfig]=useState({topicId:null,mode:"topic",questionIds:null,sessionId:0}),[focusSection,setFocusSection]=useState(null),[examConfig,setExamConfig]=useState({resume:false,sessionId:0}),[userData,setUserData]=useState(()=>migrateDuplicateProgress(loadUserData(),duplicateAliases));
 const show=p=>{setPage(p);setMobile(false);window.scrollTo(0,0)};
 const openTest=(topicId,mode="topic",questionIds=null,questionCount=null,label=null)=>{setTestConfig(config=>({topicId,mode,questionIds,questionCount,label,sessionId:config.sessionId+1}));show("test")};
 // simulacro de 100 preguntas en modo examen real (nuevo o continuando el guardado)
 const openExam=(resume=false)=>{setExamConfig(config=>({resume,sessionId:config.sessionId+1}));show("exam")};
 // abre el resumen de un tema colocado en un apartado concreto
 const openSummaryAt=(topicId,sectionId=null)=>{setSelected(topics.find(t=>t.id===topicId));setFocusSection(sectionId);show("topic")};
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
  <main className={page==="test"||page==="exam"?"testMain":""}><header className={page==="home"?"homeHeader":""}><button className="mobileMenu" type="button" onClick={()=>setMobile(true)} aria-label="Abrir menú"><Menu/></button><div><span className="eyebrow">OPOSICIONES · LABORATORIO</span><h1>{page==="home"?"Hola, Alana 👋":pageTitle(page)}</h1></div></header>
  {saveFailed&&<div className="saveWarning" role="alert"><b>⚠️ Tu progreso no se está guardando en este navegador.</b> Puede que el almacenamiento esté lleno o bloqueado (por ejemplo, en modo privado). Descarga una copia de seguridad para no perder tus datos. <button className="homeTextButton" type="button" onClick={()=>go("settings")}>Ir a Configuración <ChevronRight/></button></div>}
  {page==="home"&&<HomePage go={go} openTest={openTest} progress={userData.progress}/>}
  {page==="summaries"&&<SummaryPage progress={userData.progress} openTopic={t=>openSummaryAt(t.id)}/>}
  {page==="topic"&&selected&&<TopicPage topic={selected} go={go} focusSection={focusSection} onStartTest={()=>openTest(selected.id)} onPractice={(ids,label)=>openTest(selected.id,"topic",ids,null,label)}/>}
  {page==="test"&&<TestPage key={`${testConfig.mode}-${testConfig.topicId??"selector"}-${testConfig.sessionId}`} go={go} onChangeTopic={()=>openTest(null)} initialTopicId={testConfig.topicId} initialQuestionIds={testConfig.questionIds} initialQuestionCount={testConfig.questionCount} label={testConfig.label} onOpenSummary={openSummaryAt} mode={testConfig.mode} questionProgress={userData.progress} onProgressChange={progress=>setUserData(data=>({...data,progress}))} favorites={userData.favorites} onToggleFavorite={toggleFavorite} onMarkLearned={markLearned}/>}
  {page==="review"&&<ReviewPage go={go} onStart={count=>count===EXAM_COUNT?openExam(false):openTest(null,"mixed",null,count,count>=SIMULACRUM_MIN?`Simulacro · ${count} preguntas`:null)} onResumeExam={()=>openExam(true)}/>}
  {page==="exam"&&<ExamPage key={examConfig.sessionId} resume={examConfig.resume} go={go} onOpenSummary={openSummaryAt} questionProgress={userData.progress} onProgressChange={progress=>setUserData(data=>({...data,progress}))} favorites={userData.favorites} onToggleFavorite={toggleFavorite}/>}
  {page==="wrong"&&<WrongPage progress={userData.progress} onStart={questionIds=>openTest(null,"failed",questionIds)} onMarkLearned={markLearned} go={go}/>}
  {page==="favorites"&&<FavoritesPage favorites={userData.favorites} onToggleFavorite={toggleFavorite} go={go}/>}
  {page==="progress"&&<ProgressPage progress={userData.progress} onStart={topicId=>openTest(topicId)}/>}
  {page==="simulacrum"&&<SimulacrumPage go={go}/>}
  {page==="settings"&&<SettingsPage userData={userData} onRestore={data=>setUserData(migrateDuplicateProgress(data,duplicateAliases))} onThemeChange={theme=>setUserData(data=>({...data,theme}))}/>}
  </main>
 </div>
}
const pageTitle=p=>({summaries:"Resúmenes",topic:"Tema",test:"Test",review:"Repaso",exam:"Simulacro de examen",wrong:"Preguntas falladas",favorites:"Favoritas",progress:"Progreso",simulacrum:"Simulacro",settings:"Configuración"}[p]);

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

const getTopicMeter=(topicId,progress={})=>{const questions=getQuestionBank(topicId);let mastered=0,learning=0,failed=0;for(const question of questions){const state=progress[getQuestionIdForProgress({...question,topicId})];if(!state?.vecesVista)continue;if(state.pendienteRecuperacion&&!state.marcadaAprendida)failed++;else if(state.rachaAciertos>=4||state.estado==="DOMINADA")mastered++;else learning++}return {total:questions.length,mastered,learning,failed,mastery:getTopicProgress(questions,progress,topicId).mastery}}
function TopicMeter({meter}){const {total,mastered,learning,failed,mastery}=meter;const started=mastered+learning+failed>0;return <span className="meter" title={`${mastered+learning+failed} de ${total} preguntas vistas`}><span className="meterBar"><i style={{width:`${mastery}%`}}/></span><em className={started?"":"off"}>{started?`${mastery} %`:"Sin empezar"}</em></span>}
function SummaryPage({openTopic,progress}){const [q,setQ]=useState("");const term=q.trim().toLowerCase();const filtered=topics.filter(t=>!term||t.title.toLowerCase().includes(term)||String(t.id).padStart(2,"0").includes(term));return <div>
 <div className="sumTools"><div className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar tema o número..."/></div><span className="sumCount">{topics.length} temas</span></div>
 <div className="sumList">{filtered.map(t=>{const visual=getVisualSummary(t.id);return <button className={"sumRow"+(visual?"":" pending")} key={t.id} onClick={()=>openTopic(t)}><span className="num">{String(t.id).padStart(2,"0")}</span><span className="sumInfo"><b>{t.title}</b><TopicMeter meter={getTopicMeter(t.id,progress)}/></span><ChevronRight/></button>})}</div>
 {!filtered.length&&<p className="sumEmpty">No hay temas que coincidan con «{q}».</p>}
 </div>}

function VisualSummary({html,topicId,focus,onPractice}){const ref=useRef(null);
 const index=useMemo(()=>topicId?getSummaryIndex(topicId):null,[topicId,html]);
 // bajo cada apartado con preguntas asociadas, un botón para practicarlo
 const content=useMemo(()=>{if(!index||!onPractice)return html;return html.replace(/(<h2 id="(vs-s\d+)">[\s\S]*?<\/h2>)/g,(full,heading,id)=>{const count=index.bySection.get(id)?.length??0;return count>=3?`${heading}<button type="button" class="practiceSec" data-practice="${id}">▶ Practicar este apartado · ${count} preguntas</button>`:full})},[html,index,onPractice]);
 // Los índices del resumen son enlaces "#vs-sN": se desplaza dentro de la página sin tocar la URL.
 const onClick=e=>{const practice=e.target.closest?.("[data-practice]");if(practice&&index){const section=index.sections.find(s=>s.id===practice.dataset.practice);onPractice?.(index.bySection.get(practice.dataset.practice)??[],section?.title);return}
  const link=e.target.closest?.('a[href^="#vs-"]');if(!link)return;e.preventDefault();ref.current?.querySelector(link.getAttribute("href"))?.scrollIntoView({behavior:"smooth",block:"start"})};
 // si se llega desde un test, baja directamente al apartado
 useEffect(()=>{if(!focus)return;const timer=setTimeout(()=>ref.current?.querySelector(`#${focus}`)?.scrollIntoView({block:"start"}),60);return()=>clearTimeout(timer)},[focus,html]);
 // Marca en la barra fija la pestaña del bloque que se está leyendo.
 useEffect(()=>{const root=ref.current;if(!root||!("IntersectionObserver" in window))return;
  const setActive=id=>root.querySelectorAll(".chips a").forEach(a=>{const on=a.getAttribute("href")===`#${id}`;a.classList.toggle("active",on);if(on){const bar=a.parentElement;bar.scrollTo({left:a.offsetLeft-bar.clientWidth/2+a.offsetWidth/2,behavior:"smooth"})}});
  const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(visible)setActive(visible.target.id)},{rootMargin:"-70px 0px -65% 0px"});
  root.querySelectorAll('h2[id^="vs-"]').forEach(h=>observer.observe(h));return()=>observer.disconnect()},[html]);
 return <div className="vsum" ref={ref} onClick={onClick} dangerouslySetInnerHTML={{__html:visualSummaryDefs+content}}/>}

function TopicPage({topic,go,focusSection,onStartTest,onPractice}){const summary=getSummary(topic.id);const visual=getVisualSummary(topic.id);return <div>
 <button className="back" onClick={()=>go("summaries")}><ArrowLeft/> Volver a resúmenes</button>
 <header className="topicHeader"><div><span className="topicEyebrow">TEMA {String(topic.id).padStart(2,"0")}</span><h2>{topic.title}</h2></div><button className="topicTestButton" onClick={onStartTest}><Brain/><span>Hacer test</span></button></header>
 {visual?<div className="visualLayout"><VisualSummary html={visual} topicId={topic.id} focus={focusSection} onPractice={onPractice}/><TopicActions go={go} onStartTest={onStartTest}/></div>:
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

function TestPage({go,onChangeTopic,initialTopicId=null,initialQuestionIds=null,initialQuestionCount=null,label=null,onOpenSummary,mode:initialMode="topic",questionProgress={},onProgressChange,favorites=[],onToggleFavorite,onMarkLearned}){
 const [mode,setMode]=useState(initialMode);
 const [selectedTopicId,setSelectedTopicId]=useState(initialTopicId);
 const [savedTest,setSavedTest]=useState(()=>initialMode==="topic"&&!initialTopicId?loadResumableTest():null);
 const [questionCount,setQuestionCount]=useState(20);
 const isCrossTopic=mode==="failed"||mode==="mixed";
 const [testQuestions,setTestQuestions]=useState(()=>{
  if(initialMode==="failed"){const failedQuestions=getFailedQuestions(questionProgress);const selectedFailedQuestions=initialQuestionIds?.length?failedQuestions.filter(question=>initialQuestionIds.includes(getQuestionIdForProgress(question))):failedQuestions;return selectSmartQuestions(selectedFailedQuestions,questionProgress,selectedFailedQuestions.length).map(question=>shuffleQuestionOptions(question));}
  if(initialMode==="mixed") return ((initialQuestionCount??20)>=SIMULACRUM_MIN?selectSimulacrumQuestions(initialQuestionCount,questionProgress):selectSmartQuestions(getAllQuestions(),questionProgress,initialQuestionCount??20)).map(question=>shuffleQuestionOptions(question));
  if(!initialTopicId) return [];
  let pool=getQuestionBank(initialTopicId).map(question=>({...question,topicId:initialTopicId}));
  // test de un apartado del resumen: solo sus preguntas
  if(initialQuestionIds?.length){const ids=new Set(initialQuestionIds);pool=pool.filter(question=>ids.has(getQuestionIdForProgress(question)))}
  return selectSmartQuestions(pool,questionProgress,initialQuestionIds?.length?Math.min(20,pool.length):20).map(question=>shuffleQuestionOptions(question));
 });
 const [i,setI]=useState(0);
 const [answersByIndex,setAnswersByIndex]=useState({});
 const [done,setDone]=useState(false);
 const [loadedQuestions,setLoadedQuestions]=useState({});
 const [loading,setLoading]=useState(false);

 const currentTopic=mode==="failed"?{id:0,title:"Preguntas falladas"}:mode==="mixed"?{id:0,title:label?.startsWith("Simulacro")?"Simulacro de examen":"Repaso general"}:selectedTopicId ? topics.find(t=>t.id===selectedTopicId) : null;
 const totalQuestions=testQuestions.length;
 const q=testQuestions[i] ?? null;
 const selectedAnswer=answersByIndex[i] ?? null;
 const showResult=Object.prototype.hasOwnProperty.call(answersByIndex,i);
 const score=testQuestions.reduce((total,question,index)=>total+(answersByIndex[index]===question.correctAnswer?1:0),0);
 const isFavorite=q?favorites.includes(getQuestionIdForProgress(q)):false;
 const isLearned=q?questionProgress[getQuestionIdForProgress(q)]?.marcadaAprendida===true:false;
 const structuredExplanation=q?explainQuestion(q,q.topicId??currentTopic?.id):null;
 const [sheet,setSheet]=useState(null);
 const questionTopicId=q?(q.topicId??currentTopic?.id):null;
 const summaryIndex=q&&questionTopicId?getSummaryIndex(questionTopicId):null;
 const linkedId=q&&questionTopicId?getQuestionIdForProgress({...q,topicId:questionTopicId}):null;
 const linkedSections=summaryIndex?(summaryIndex.byQuestion.get(linkedId)??[]).map(entry=>summaryIndex.sections.find(section=>section.id===entry.id)).filter(Boolean):[];
 const linkedSection=linkedSections[0]??null;
 useEffect(()=>{if(!sheet)return;const onKey=e=>{if(e.key==="Escape")setSheet(null)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[sheet]);

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
  return <div className="result card"><div className="resultIcon">🏆</div><h2>Sesión terminada</h2><strong>{score}/{totalQuestions}</strong><p className="resultPct">{Math.round(score/totalQuestions*100)} % de aciertos</p><p>{label?.startsWith("Simulacro")?"Has terminado el simulacro de examen.":"Has completado una selección inteligente de este banco."}</p><button className="primary" onClick={()=>isCrossTopic?go(crossTopicCopy[mode].backPage):startTopicTest(selectedTopicId)}>Crear otro test</button><button className="secondary" onClick={()=>isCrossTopic?go(crossTopicCopy[mode].backPage):onChangeTopic()}>{isCrossTopic?crossTopicCopy[mode].restartLabel:"Elegir otro tema"}</button></div>;
 }

 return <div className="testWrap"><div className="testMeta"><span>{(label?`${currentTopic.title} · ${label.replace(/^Simulacro · /,"")}`:currentTopic.title).toUpperCase()}</span><b>{i+1} / {totalQuestions}</b></div><div className="progressLine"><i style={{width:((i+1)/totalQuestions*100)+"%"}}/></div><div className="testCard"><span className="badge">{isCrossTopic?`Tema ${String(q.topicId).padStart(2,"0")}`:`Tema ${String(currentTopic.id).padStart(2,"0")}`}</span><h2>{q.number}. {q.question}</h2><div className="answers">{q.answers.map((answer,index)=><button key={answer+index} type="button" onClick={()=>handleAnswer(index)} disabled={showResult} className={showResult ? (index===q.correctAnswer ? "correct" : (selectedAnswer===index ? "incorrect" : "")) : ""}><span>{String.fromCharCode(65+index)}</span>{answer}</button>)}</div>{showResult&&<div className="testFeedback"><ExplanationDisplay structured={structuredExplanation} fallback={q.explanation} correctAnswerText={q.answers[q.correctAnswer]} isCorrect={selectedAnswer===q.correctAnswer}/>{linkedSection&&<button type="button" className="summaryLinkButton" onClick={()=>setSheet({topicId:questionTopicId,section:linkedSection,sections:linkedSections,defs:summaryIndex.defs,terms:summaryIndex.termsByQuestion.get(linkedId)??[]})}><BookOpen/><span>Ver en el resumen<small>{linkedSection.title}</small></span></button>}</div>}{mode==="failed"&&showResult&&<div className="failedQuestionAction"><button className="markLearnedButton" onClick={()=>onMarkLearned(q)} disabled={isLearned}><CheckCircle2/>{isLearned?"Marcada como aprendida":"Marcar como aprendida"}</button></div>}<div className="testActions"><button className="secondary" onClick={handlePrevious} disabled={i===0}><ArrowLeft/> Anterior</button><button className={isFavorite?"secondary favoriteAction active":"secondary favoriteAction"} onClick={()=>onToggleFavorite(q)}><Star fill={isFavorite?"currentColor":"none"}/> Favoritos</button><button className="primary" onClick={handleNext}>{i===totalQuestions-1?"Finalizar":"Siguiente"} <ChevronRight/></button></div><button className="changeTopicButton" onClick={()=>isCrossTopic?go(crossTopicCopy[mode].backPage):onChangeTopic()}>{isCrossTopic?crossTopicCopy[mode].backLabel:"Cambiar de tema"}</button></div>{sheet&&<SummarySheet sheet={sheet} onClose={()=>setSheet(null)} onSwitch={section=>setSheet(current=>({...current,section}))} onOpenFull={()=>onOpenSummary?.(sheet.topicId,sheet.section.id)}/>}</div>;
}

// Simulacro en modo examen real: sin soluciones hasta entregar, con reloj y penalización por fallo.
function ExamPage({go,resume,onOpenSummary,questionProgress={},onProgressChange,favorites=[],onToggleFavorite}){
 const [exam]=useState(()=>{
  const saved=resume?loadResumableExam():null;
  if(saved) return saved;
  clearExamSession();
  const startedAt=Date.now();
  return {questions:selectSimulacrumQuestions(EXAM_COUNT,questionProgress).map(question=>shuffleQuestionOptions(question)),answers:{},flags:[],index:0,startedAt,deadline:startedAt+EXAM_DURATION};
 });
 const {questions,startedAt,deadline}=exam;
 const total=questions.length;
 const [answers,setAnswers]=useState(exam.answers);
 const [flags,setFlags]=useState(exam.flags);
 const [i,setI]=useState(exam.index);
 const [phase,setPhase]=useState("exam");
 const [now,setNow]=useState(Date.now());
 const [finish,setFinish]=useState(null);
 const [showGrid,setShowGrid]=useState(false);
 const [confirming,setConfirming]=useState(false);
 const [sheet,setSheet]=useState(null);
 const finishedRef=useRef(false);
 const remaining=deadline-now;
 const answeredCount=Object.keys(answers).length;

 const submit=(auto=false)=>{
  if(finishedRef.current) return;
  finishedRef.current=true;
  const endedAt=Math.min(Date.now(),deadline);
  // el progreso solo cuenta las preguntas respondidas, y se guarda al entregar
  let progress=questionProgress;
  questions.forEach((question,index)=>{if(Object.prototype.hasOwnProperty.call(answers,index))progress=recordQuestionAnswer(question,progress,answers[index]===question.correctAnswer,endedAt,answers[index])});
  onProgressChange?.(progress);
  clearExamSession();
  setFinish({auto,endedAt});
  setConfirming(false);setShowGrid(false);
  setPhase("result");
  window.scrollTo(0,0);
 };

 useEffect(()=>{if(phase!=="exam")return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[phase]);
 useEffect(()=>{if(phase==="exam"&&remaining<=0)submit(true)},[phase,remaining]);
 useEffect(()=>{if(phase==="exam"&&!finishedRef.current)saveExamSession({questions:questions.map(({id,number,topicId,question,answers})=>({id,number,topicId,question,answers})),answers,flags,index:i,startedAt,deadline,savedAt:Date.now()})},[phase,answers,flags,i]);
 useEffect(()=>{if(!sheet)return;const onKey=e=>{if(e.key==="Escape")setSheet(null)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[sheet]);

 const results=useMemo(()=>{
  let correct=0,wrong=0;
  const byTopic=new Map();
  questions.forEach((question,index)=>{
   const entry=byTopic.get(question.topicId)??{topicId:question.topicId,total:0,correct:0,wrong:0};
   entry.total++;
   if(Object.prototype.hasOwnProperty.call(answers,index)){if(answers[index]===question.correctAnswer){correct++;entry.correct++}else{wrong++;entry.wrong++}}
   byTopic.set(question.topicId,entry);
  });
  const net=correct-wrong*EXAM_PENALTY;
  return {correct,wrong,blank:total-correct-wrong,net,grade:Math.max(0,net)/total*10,topics:[...byTopic.values()].map(entry=>({...entry,net:entry.correct-entry.wrong*EXAM_PENALTY})).sort((a,b)=>a.net/a.total-b.net/b.total)};
 },[questions,answers,total]);

 const q=questions[i];
 const hasAnswer=Object.prototype.hasOwnProperty.call(answers,i);
 const selected=hasAnswer?answers[i]:null;
 const status=index=>!Object.prototype.hasOwnProperty.call(answers,index)?"blank":answers[index]===questions[index].correctAnswer?"right":"wrong";
 const pick=answerIndex=>setAnswers(current=>{const next={...current};if(next[i]===answerIndex)delete next[i];else next[i]=answerIndex;return next});
 const toggleFlag=()=>setFlags(current=>current.includes(i)?current.filter(index=>index!==i):[...current,i]);
 const goTo=index=>{setI(index);setShowGrid(false);window.scrollTo(0,0)};

 if(phase==="result"){
  const used=finish.endedAt-startedAt;
  return <div className="result card examResult">
   <div className="resultIcon">🏆</div>
   <h2>{finish.auto?"Se acabó el tiempo":"Examen entregado"}</h2>
   <strong>{formatScore(results.grade)}<small> / 10</small></strong>
   <p className="resultPct">Puntuación neta: <b>{formatScore(results.net)}</b> de {total}</p>
   <div className="examScore">
    <div className="ok"><b>{results.correct}</b><span>Aciertos</span><small>+{results.correct}</small></div>
    <div className="ko"><b>{results.wrong}</b><span>Fallos</span><small>−{formatScore(results.wrong*EXAM_PENALTY)}</small></div>
    <div className="bl"><b>{results.blank}</b><span>En blanco</span><small>0</small></div>
   </div>
   <p className="examFormula">Aciertos − fallos ÷ 4 · tiempo usado {formatClock(used)} de 1:30:00</p>
   <div className="examTopics"><span className="reviewSetupLabel">Por temas (de peor a mejor)</span>{results.topics.map(entry=><div key={entry.topicId} className="examTopicRow"><span>T{String(entry.topicId).padStart(2,"0")}</span><em>{topics.find(topic=>topic.id===entry.topicId)?.title}</em><small>{entry.correct}✓ {entry.wrong}✗ {entry.total-entry.correct-entry.wrong}○</small><i><b style={{width:`${Math.max(0,entry.net)/entry.total*100}%`}}/></i></div>)}</div>
   <button className="primary" onClick={()=>{setPhase("review");goTo(0)}}>Revisar el examen</button>
   <button className="secondary" onClick={()=>go("review")}>Volver a Repaso</button>
  </div>;
 }

 const reviewing=phase==="review";
 const questionTopicId=q.topicId;
 const summaryIndex=reviewing?getSummaryIndex(questionTopicId):null;
 const linkedId=getQuestionIdForProgress(q);
 const linkedSections=summaryIndex?(summaryIndex.byQuestion.get(linkedId)??[]).map(entry=>summaryIndex.sections.find(section=>section.id===entry.id)).filter(Boolean):[];
 const linkedSection=linkedSections[0]??null;
 const isFavorite=favorites.includes(linkedId);
 const lowTime=!reviewing&&remaining<=5*60*1000;
 const blank=total-answeredCount;

 return <div className="testWrap examWrap">
  <div className="testMeta"><span>{reviewing?"REVISIÓN DEL SIMULACRO":"SIMULACRO DE EXAMEN"}</span>{reviewing?<b>{i+1} / {total}</b>:<b className={lowTime?"examClock low":"examClock"} role="timer" aria-label="Tiempo restante"><Timer/>{formatClock(remaining)}</b>}</div>
  <div className="progressLine"><i style={{width:(reviewing?(i+1)/total:answeredCount/total)*100+"%"}}/></div>
  <div className="examBar">
   <button type="button" className={showGrid?"examGridToggle open":"examGridToggle"} onClick={()=>setShowGrid(open=>!open)} aria-expanded={showGrid}><LayoutGrid/>{reviewing?`${results.correct} ✓ · ${results.wrong} ✗ · ${results.blank} en blanco`:`Pregunta ${i+1} de ${total} · ${answeredCount} respondidas`}</button>
  </div>
  {showGrid&&<div className="examGrid">{questions.map((question,index)=><button key={index} type="button" onClick={()=>goTo(index)} className={[index===i?"current":"",reviewing?status(index):Object.prototype.hasOwnProperty.call(answers,index)?"answered":"",flags.includes(index)?"flagged":""].join(" ")} aria-label={`Pregunta ${index+1}`}>{index+1}</button>)}</div>}
  <div className="testCard">
   <span className="badge">Tema {String(q.topicId).padStart(2,"0")}</span>
   <h2>{i+1}. {q.question}</h2>
   <div className="answers">{q.answers.map((answer,index)=><button key={answer+index} type="button" onClick={()=>!reviewing&&pick(index)} disabled={reviewing} aria-pressed={!reviewing?selected===index:undefined} className={reviewing?(index===q.correctAnswer?(selected===index?"correct":"correct missed"):selected===index?"incorrect":""):selected===index?"picked":""}><span>{String.fromCharCode(65+index)}</span>{answer}</button>)}</div>
   {!reviewing&&<p className="examHint">{hasAnswer?"Toca de nuevo tu respuesta para dejarla en blanco.":"Si no la sabes, déjala en blanco: no resta."}</p>}
   {reviewing&&<div className="testFeedback"><ExplanationDisplay structured={explainQuestion(q,q.topicId)} fallback={q.explanation} correctAnswerText={q.answers[q.correctAnswer]} isCorrect={hasAnswer?selected===q.correctAnswer:null}/>{linkedSection&&<button type="button" className="summaryLinkButton" onClick={()=>setSheet({topicId:questionTopicId,section:linkedSection,sections:linkedSections,defs:summaryIndex.defs,terms:summaryIndex.termsByQuestion.get(linkedId)??[]})}><BookOpen/><span>Ver en el resumen<small>{linkedSection.title}</small></span></button>}</div>}
   <div className="testActions">
    <button className="secondary" onClick={()=>goTo(Math.max(0,i-1))} disabled={i===0}><ArrowLeft/> Anterior</button>
    {reviewing?<button className={isFavorite?"secondary favoriteAction active":"secondary favoriteAction"} onClick={()=>onToggleFavorite(q)}><Star fill={isFavorite?"currentColor":"none"}/> Favoritos</button>:<button className={flags.includes(i)?"secondary favoriteAction active":"secondary favoriteAction"} onClick={toggleFlag}><Flag fill={flags.includes(i)?"currentColor":"none"}/> {flags.includes(i)?"Marcada":"Marcar"}</button>}
    {i<total-1?<button className="primary" onClick={()=>goTo(i+1)}>Siguiente <ChevronRight/></button>:reviewing?<button className="primary" onClick={()=>setPhase("result")}>Ver nota <ChevronRight/></button>:<button className="primary" onClick={()=>setConfirming(true)}>Entregar <ChevronRight/></button>}
   </div>
   {reviewing?<button className="changeTopicButton" onClick={()=>setPhase("result")}>Volver a la nota</button>:<div className="examFoot"><button className="changeTopicButton" onClick={()=>go("review")}>Salir (el reloj sigue corriendo)</button><button className="changeTopicButton examSubmit" onClick={()=>setConfirming(true)}>Entregar examen</button></div>}
  </div>
  {confirming&&<div className="sheetBackdrop" onClick={()=>setConfirming(false)}><div className="examConfirm card" role="dialog" aria-modal="true" aria-label="Entregar examen" onClick={e=>e.stopPropagation()}>
   <h3>¿Entregar el examen?</h3>
   <p>Has respondido <b>{answeredCount}</b> de {total}{blank?<> · <b>{blank}</b> en blanco</>:null}{flags.length?<> · <b>{flags.length}</b> marcadas para revisar</>:null}.</p>
   <p>Te quedan <b>{formatClock(remaining)}</b>. Después verás la nota y las soluciones.</p>
   <div className="testActions"><button className="secondary" onClick={()=>setConfirming(false)}>Seguir</button><button className="primary" onClick={()=>submit(false)}>Entregar</button></div>
  </div></div>}
  {sheet&&<SummarySheet sheet={sheet} onClose={()=>setSheet(null)} onSwitch={section=>setSheet(current=>({...current,section}))} onOpenFull={()=>onOpenSummary?.(sheet.topicId,sheet.section.id)}/>}
 </div>;
}

// hoja con un apartado del resumen, sin salir del test
function SummarySheet({sheet,onClose,onSwitch,onOpenFull}){const topic=topics.find(t=>t.id===sheet.topicId);const bodyRef=useRef(null);const [found,setFound]=useState(true);
 // resalta en el apartado las palabras clave de la pregunta y baja a la primera
 useEffect(()=>{const body=bodyRef.current;if(!body)return;body.scrollTop=0;const focus=highlightTerms(body.querySelector(".vsum"),sheet.terms);setFound(!!focus);if(focus){focus.classList.add("hlFocus");const top=focus.getBoundingClientRect().top-body.getBoundingClientRect().top;if(top>body.clientHeight*.45)body.scrollTop=top-body.clientHeight*.2}},[sheet.section.id]);
 const others=(sheet.sections??[]).filter(section=>section.id!==sheet.section.id);
 return <div className="sheetBackdrop" onClick={onClose}><div className="sheet" role="dialog" aria-modal="true" aria-label={`Resumen: ${sheet.section.title}`} onClick={e=>e.stopPropagation()}>
 <div className="sheetHead"><div><small>TEMA {String(sheet.topicId).padStart(2,"0")} · {topic?.title}</small><b>{sheet.section.title}</b></div><button type="button" className="sheetClose" onClick={onClose} aria-label="Cerrar"><X/></button></div>
 {(others.length>0||found)&&<div className="sheetInfo">{found&&<span className="sheetHint"><mark className="hl">Resaltado</mark> lo relacionado con la pregunta</span>}{others.length>0&&<span className="sheetAlt">También en: {others.map(section=><button type="button" key={section.id} onClick={()=>onSwitch(section)}>{section.title}</button>)}</span>}</div>}
 <div className="sheetBody" ref={bodyRef}><div className="vsum" key={sheet.section.id} dangerouslySetInnerHTML={{__html:visualSummaryDefs+sheet.defs+sheet.section.html}}/></div>
 <div className="sheetFoot"><button type="button" className="secondary" onClick={onClose}>Volver</button><button type="button" className="primary" onClick={onOpenFull}><BookOpen/> Resumen completo</button></div>
</div></div>}

function ReviewPage({go,onStart,onResumeExam}){
 const [count,setCount]=useState(20);
 const [savedExam,setSavedExam]=useState(()=>loadResumableExam());
 const totalAvailable=useMemo(()=>getAllQuestions().length,[]);
 if(!totalAvailable) return <div><div className="reviewHero"><h2>Tu zona de repaso</h2><p>El repaso se activará cuando haya preguntas cargadas en los temas.</p><button className="primary" onClick={()=>go("test")}>Empezar un test</button></div></div>;
 const isExam=count>=SIMULACRUM_MIN;
 return <div className="reviewPage">
  <div className="reviewHero"><h2>Repaso general</h2><p>Test que mezcla preguntas de los {topics.length} temas para practicar un repaso real, como en el examen.</p></div>
  {savedExam&&<div className="resumeTestBanner" role="status"><div><b>{savedExam.deadline>Date.now()?"Tienes un simulacro en curso":"Tu simulacro se quedó sin tiempo"}</b><small>{Object.keys(savedExam.answers).length} de {savedExam.questions.length} respondidas · {savedExam.deadline>Date.now()?`quedan ${formatClock(savedExam.deadline-Date.now())}`:"se entregará con lo que respondiste"}</small></div><div className="resumeTestActions"><button className="primary" type="button" onClick={onResumeExam}><Play/> {savedExam.deadline>Date.now()?"Continuar":"Ver nota"}</button><button className="secondary" type="button" onClick={()=>{clearExamSession();setSavedExam(null)}}>Descartar</button></div></div>}
  <div className="reviewSetup">
   <span className="reviewSetupLabel">Repaso rápido</span>
   <div className="reviewCountRow">{[10,20,30,50].map(value=><button key={value} type="button" className={count===value?"selected":""} onClick={()=>setCount(value)}>{value}</button>)}</div>
   <span className="reviewSetupLabel">Simulacro de examen</span>
   <div className="reviewCountRow examRow">{[60,100].map(value=><button key={value} type="button" className={count===value?"selected":""} onClick={()=>setCount(value)}><Trophy/>{value}</button>)}</div>
   {isExam&&<p className="examNote">Las preguntas se reparten entre los {topics.length} temas según el peso de cada uno en el banco.{count===EXAM_COUNT?<> <b>Modo examen real:</b> 1 h 30 min, sin soluciones hasta entregar y cada 4 fallos restan 1 acierto (las en blanco no restan).</>:" Verás la solución de cada pregunta al responderla."}</p>}
   <button className="primary" type="button" onClick={()=>onStart(count)}>{count===EXAM_COUNT?"Empezar examen de 100 · 1 h 30 min":isExam?`Empezar simulacro de ${count}`:"Empezar repaso aleatorio"}</button>
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
