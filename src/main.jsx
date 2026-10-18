import React,{useEffect,useMemo,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import {Home,BookOpen,Brain,RotateCcw,BarChart3,Trophy,Search,ChevronRight,Star,FlaskConical,Menu,X,ArrowLeft,Target,Layers3,Settings,Download,Upload,ShieldCheck,CheckCircle2,Moon,Sun,Play,Hourglass,Timer,Flag,LayoutGrid,Sparkles,ExternalLink,NotebookPen,Pencil,Trash2,ClipboardPaste,Copy,Cloud,CloudOff,RefreshCw,LogIn,LogOut,UserRound,Eye,EyeOff,HardDrive,ScrollText,CalendarDays,Hash,ShieldQuestion,Check} from "lucide-react";
import "./styles.css";
import "./theme-day.css";
import "./theme-night.css";

import questionBank,{duplicateAliases} from "./questions";
import {examScopes,isInScope,isScopeOn} from "./questions/examScopes.js";
import {isDisputedKey} from "./questions/disputedKeys.js";
import {figuresFor} from "./lib/figures.js";
import {recoverPastExams} from "./lib/recoverExams.js";
import {BREAK_EVEN,CONFIDENCE_LEVELS,confidenceAdvice,confidenceStats,expectedValue,recordConfidence} from "./lib/confidence.js";
import summaryBank from "./summaries/index.js";
import visualSummaryBank,{sharedDefs as visualSummaryDefs} from "./summaries/visual/index.js";
import {hasSelfReferentialOption,getQuestionIdForProgress,getTopicProgress,isQuestionCurrentlyFailed,markQuestionAsLearned,recordQuestionAnswer,selectSmartQuestions,shuffleQuestionOptions} from "./smartQuestionSelector.js";
import ExplanationDisplay from "./components/ExplanationDisplay.jsx";
import {explainQuestion} from "./lib/explainQuestion.js";
import {EXAM_HISTORY_KEY,loadExamHistory,clearExamSession,clearTestSession,createBackup,loadSavedExam,loadSavedTest,saveExamSession,loadUserData,migrateDuplicateProgress,parseBackup,saveTestSession,saveUserData} from "./lib/storage.js";
import {EXAM_DATE,getCountdown} from "./lib/studyPlan.js";
import {buildTopicIndex} from "./lib/summaryLinks.js";
import {MIN_PASSWORD,USER_PATTERN,loadSyncSettings,loginAccount,logoutAccount,pushSync,registerAccount,saveSyncSettings} from "./lib/sync.js";
import {mergeUserData,syncFingerprint,syncSignature} from "./lib/syncMerge.js";
import {bankPercentile,coverageTerm,difficultyFor,intrinsicScore} from "./lib/difficulty.js";


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
const fullQuestionBank=id=>(questionBank[getTopicKey(id)] ?? []);
// Recortes del temario activados (p. ej. Hormonas: solo tiroides). Las preguntas que quedan fuera
// no se borran ni pierden su progreso: solo dejan de salir en los tests mientras esté activado.
let activeScopes={},activeScopeKey="";
const scopedBanks=new Map();
const applyExamScopes=config=>{
 const next=Object.fromEntries(Object.entries(examScopes).filter(([topicId,scope])=>isScopeOn(scope,config?.[topicId])).map(([topicId,scope])=>[topicId,scope]));
 const key=Object.keys(next).sort().join(",");
 if(key===activeScopeKey) return;
 activeScopes=next;activeScopeKey=key;scopedBanks.clear();
};
const getQuestionBank=id=>{
 const scope=activeScopes[id];if(!scope) return fullQuestionBank(id);
 if(!scopedBanks.has(id)) scopedBanks.set(id,fullQuestionBank(id).filter(question=>isInScope(scope,question)));
 return scopedBanks.get(id);
};
const getSummary=id=>summaryBank[getTopicKey(id)];
const getVisualSummary=id=>visualSummaryBank[getTopicKey(id)]
// apartados del resumen visual y qué preguntas del banco explica cada uno
const getSummaryIndex=(topicId,full=false)=>{const html=getVisualSummary(topicId);if(!html)return null;return buildTopicIndex(topicId,html,(full?fullQuestionBank:getQuestionBank)(topicId).map(question=>({...question,topicId})),getQuestionIdForProgress,question=>explainQuestion(question,topicId))};
// dificultad estimada de cada pregunta de un tema (percentil en el banco, 0 = la más fácil);
// se calcula siempre con el tema completo para que no cambie al activar un recorte
const difficultyCache=new Map();
const getTopicDifficulty=topicId=>{
 if(difficultyCache.has(topicId)) return difficultyCache.get(topicId);
 const questions=fullQuestionBank(topicId).map(question=>({...question,topicId}));
 const index=getSummaryIndex(topicId,true);
 const best=questions.map(question=>index?.byQuestion.get(getQuestionIdForProgress(question))?.[0]?.score??0);
 const sorted=[...best].sort((a,b)=>a-b);
 const coverage=score=>!index?null:score===0?0:sorted.findIndex(value=>value>=score)/sorted.length;
 const table=new Map(questions.map((question,i)=>[getQuestionIdForProgress(question),bankPercentile(intrinsicScore(question)+coverageTerm(coverage(best[i])))]));
 difficultyCache.set(topicId,table);
 return table;
};
const getQuestionDifficulty=(question,progress={},estimatedOnly=false)=>{
 if(question?.topicId==null) return null;
 const id=getQuestionIdForProgress(question);
 const percentile=getTopicDifficulty(question.topicId).get(id);
 return percentile==null?null:difficultyFor(percentile,estimatedOnly?null:progress[id]);
};
// Abre Claude con la pregunta ya escrita para pedir una explicación más a fondo.
const letter=index=>String.fromCharCode(65+index);
const buildClaudePrompt=(question,topicId,selected)=>{
 const topic=topics.find(t=>t.id===topicId);
 const explanation=explainQuestion(question,topicId);
 const lines=[
  `Estoy preparando una oposición de técnico de laboratorio clínico (tema ${topicId}${topic?` · ${topic.title}`:""}).`,
  "",
  `Pregunta: ${question.question}`,
  ...question.answers.map((answer,index)=>`${letter(index)}) ${answer}`),
  "",
  `Respuesta correcta: ${letter(question.correctAnswer)}) ${question.answers[question.correctAnswer]}`,
  selected==null?"La dejé en blanco.":selected===question.correctAnswer?"La acerté, pero quiero entenderla mejor.":`Yo respondí: ${letter(selected)}) ${question.answers[selected]}`,
 ];
 const known=[explanation?.porQueLaCorrecta||question.explanation,explanation?.claveMemorizar].filter(Boolean).join(" ");
 if(known) lines.push(`Explicación que tengo: ${known}`);
 lines.push("","Explícame con más detalle por qué es la correcta, por qué no son las otras opciones (una a una) y dame un truco para recordarlo. Responde en español y de forma breve.");
 return lines.join("\n");
};
function AskClaudeButton({question,topicId,selected}){
 const [copied,setCopied]=useState(false);
 const ask=()=>{
  const prompt=buildClaudePrompt(question,topicId,selected);
  // se copia también por si el enlace no deja la pregunta escrita
  try{navigator.clipboard?.writeText(prompt).then(()=>setCopied(true),()=>{})}catch{}
  window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`,"_blank","noopener");
 };
 return <><button type="button" className="askClaudeButton" onClick={ask}><Sparkles/><span>Pregúntale a Claude por qué<small>Abre Claude con la pregunta ya escrita</small></span><ExternalLink className="askExt"/></button>{copied&&<p className="askCopied">Pregunta copiada: si no aparece escrita en Claude, pégala.</p>}</>;
}
function DifficultyMeter({difficulty}){
 if(!difficulty) return null;
 const hint=difficulty.personal?"Dificultad ajustada con tus respuestas":"Dificultad estimada";
 return <span className={`diffMeter ${difficulty.id}`} title={hint} aria-label={`${hint}: ${difficulty.label}`}><span className="diffBars" aria-hidden="true">{[1,2,3].map(bar=><i key={bar} className={bar<=difficulty.bars?"on":""}/>)}</span>{difficulty.label}</span>;
}
const formatEmphasis=text=>String(text).split(/(\*\*[^*]+\*\*|__[^_]+__)/g).filter(Boolean).map((part,index)=>{
 if(part.startsWith("**")&&part.endsWith("**")) return <strong key={index}>{part.slice(2,-2)}</strong>;
 if(part.startsWith("__")&&part.endsWith("__")) return <u key={index}>{part.slice(2,-2)}</u>;
 return part;
});
// full: incluye también lo que deja fuera un recorte (aclaraciones, favoritas, tests guardados)
const getAllQuestions=(full=false)=>topics.flatMap(topic=>(full?fullQuestionBank:getQuestionBank)(topic.id).map(question=>({...question,topicId:topic.id})));
// simulacro: preguntas repartidas entre temas en proporción al tamaño de cada banco
// baraja una copia (Fisher-Yates) para repetir un test en otro orden
const shuffledCopy=items=>{const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
const SIMULACRUM_MIN=60;
// examen real: solo el simulacro de 100 (1 h 30 min, cada 4 fallos restan 1 acierto, las en blanco no restan)
const EXAM_COUNT=100;
const EXAM_DURATION=90*60*1000;
// los simulacros de 60 van en modo examen con el mismo ritmo: 54 minutos
const examDuration=count=>Math.round(EXAM_DURATION*count/EXAM_COUNT);
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
// «Test de cifras y valores»: preguntas con al menos dos opciones numéricas (semanas, %, mg/dL…)
const isNumberQuestion=question=>(question.answers??[]).filter(answer=>/\d/.test(answer)).length>=2;
const getNumberQuestions=()=>getAllQuestions().filter(isNumberQuestion);
const getFailedQuestions=progress=>getAllQuestions().filter(question=>isQuestionCurrentlyFailed(progress[getQuestionIdForProgress(question)]));
const getFavoriteQuestions=favorites=>getAllQuestions(true).filter(question=>favorites.includes(getQuestionIdForProgress(question)));
const sameAnswerSet=(a=[],b=[])=>a.length===b.length&&[...a].sort().join("\u0000")===[...b].sort().join("\u0000");
// Recupera el test en curso solo si todas sus preguntas siguen en el banco sin cambios.
const restoreSavedQuestions=saved=>{
 if(!Array.isArray(saved)||!saved.length) return null;
 const bankById=new Map(getAllQuestions(true).map(question=>[getQuestionIdForProgress(question),question]));
 const questions=saved.map(item=>{
  const current=bankById.get(getQuestionIdForProgress(item));
  if(!current||current.question!==item.question||!sameAnswerSet(current.answers,item.answers)) return null;
  const correctAnswer=item.answers.indexOf(current.answers[current.correctAnswer]);
  // orden original de cada opción, para que la explicación cite las letras tal como se ven
  const originalOrder=item.answers.map(answer=>current.answers.indexOf(answer));
  return correctAnswer<0?null:{...current,answers:item.answers,correctAnswer,originalOrder};
 });
 return questions.some(question=>!question)?null:questions;
};
const loadResumableTest=()=>{
 const session=loadSavedTest();
 if(!session||!["topic","failed","mixed","notes"].includes(session.mode)) return null;
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
 const confidence=Object.fromEntries(Object.entries(session.confidence??{}).filter(([key,value])=>Number(key)<questions.length&&CONFIDENCE_LEVELS.some(level=>level.id===value)));
 const scratch=Object.fromEntries(Object.entries(session.scratch??{}).filter(([key,value])=>Number(key)<questions.length&&typeof value==="string"&&value.trim()));
 return {questions,answers,flags,confidence,scratch,index:Math.min(Math.max(0,Number(session.index)||0),questions.length-1),startedAt:session.startedAt,deadline:session.deadline};
};
// Simulacros guardados: se rehacen las preguntas con el orden de opciones con el que salieron
// kind: «exam» (100 con reloj y penalización) o «sim» (simulacro con solución al momento).
// Cada pregunta se guarda como «id|orden de sus opciones» para ocupar poco y poder sincronizarse.
const examHistoryEntry=({kind="exam",questions,answers,flags=[],confidence={},scratch={},startedAt,finish})=>({id:startedAt,kind,startedAt,endedAt:finish.endedAt,auto:!!finish.auto,q:questions.map(question=>`${getQuestionIdForProgress(question)}|${(Array.isArray(question.originalOrder)?question.originalOrder:question.answers.map((answer,index)=>index)).join("")}`),answers,flags,confidence,scratch});
const restoreExamFromHistory=entry=>{
 if(!entry||!(Array.isArray(entry.q)||Array.isArray(entry.questions))) return null;
 const bankById=new Map(getAllQuestions(true).map(question=>[getQuestionIdForProgress(question),question]));
 const items=Array.isArray(entry.q)?entry.q.map(item=>{const cut=String(item).lastIndexOf("|");return {id:item.slice(0,cut),order:[...item.slice(cut+1)].map(Number)}}):entry.questions;
 const questions=items.map(({id,order})=>{const question=bankById.get(id);if(!question||!Array.isArray(order)||order.length!==question.answers.length)return null;return {...question,answers:order.map(index=>question.answers[index]),correctAnswer:order.indexOf(question.correctAnswer),originalOrder:order}});
 if(questions.some(question=>!question)) return null;
 return {questions,answers:entry.answers??{},flags:entry.flags??[],confidence:entry.confidence??{},scratch:entry.scratch??{},index:0,startedAt:entry.startedAt,deadline:entry.startedAt+examDuration(entry.kind==="sim"||!entry.recovered?questions.length:EXAM_COUNT),finish:{auto:!!entry.auto,endedAt:entry.endedAt},kind:entry.kind??"exam",recovered:!!entry.recovered,nominalTotal:entry.recovered&&entry.kind!=="sim"?Math.max(EXAM_COUNT,questions.length):questions.length};
};
// nota de un simulacro guardado (para la lista de Repaso)
const examEntryScore=entry=>{const restored=restoreExamFromHistory(entry);if(!restored)return null;let correct=0,wrong=0;restored.questions.forEach((question,index)=>{if(!Object.prototype.hasOwnProperty.call(restored.answers,index))return;if(restored.answers[index]===question.correctAnswer)correct++;else wrong++});const total=restored.nominalTotal??restored.questions.length;const net=correct-wrong*EXAM_PENALTY;return {correct,wrong,blank:total-correct-wrong,total,net,grade:Math.max(0,net)/total*10}};
// Simulacros anteriores al registro, reconstruidos a partir del progreso (ver lib/recoverExams.js)
const recoveredExamEntries=(progress,recorded=[])=>{
 const bank=new Map(getAllQuestions(true).map(question=>[getQuestionIdForProgress(question),question]));
 return recoverPastExams(progress,new Set(bank.keys()),recorded).map(({items,...entry})=>({...entry,q:items.map(item=>`${item.id}|${bank.get(item.id).answers.map((answer,index)=>index).join("")}`),answers:Object.fromEntries(items.map((item,index)=>{const question=bank.get(item.id);
  // la opción marcada solo se sabe en las preguntas que no se barajan («todas las anteriores», «A y C»…)
  const chosenKnown=hasSelfReferentialOption(question.answers)&&Number.isInteger(item.chosen)&&item.chosen<question.answers.length&&item.shownCorrect===question.correctAnswer;
  return [index,item.failed?(chosenKnown?item.chosen:-1):question.correctAnswer]})),flags:[],confidence:{},scratch:{}}));
};
const formatClock=ms=>{const total=Math.max(0,Math.ceil(ms/1000));const h=Math.floor(total/3600),m=Math.floor(total%3600/60),sec=total%60;return `${h?h+":":""}${String(m).padStart(h?2:1,"0")}:${String(sec).padStart(2,"0")}`};
const formatScore=value=>value.toLocaleString("es-ES",{maximumFractionDigits:2}).replace("-","−");

function App(){
 const [page,setPage]=useState("home"),[selected,setSelected]=useState(null),[mobile,setMobile]=useState(false),[testConfig,setTestConfig]=useState({topicId:null,mode:"topic",questionIds:null,sessionId:0}),[focusSection,setFocusSection]=useState(null),[examConfig,setExamConfig]=useState({resume:false,sessionId:0}),[userData,setUserData]=useState(()=>migrateDuplicateProgress(loadUserData(),duplicateAliases));
 const show=p=>{setPage(p);setMobile(false);window.scrollTo(0,0)};
 // returnTo: apartado del resumen desde el que se lanzó el test, para poder volver a él al acabar
 const openTest=(topicId,mode="topic",questionIds=null,questionCount=null,label=null,returnTo=null)=>{setTestConfig(config=>({topicId,mode,questionIds,questionCount,label,returnTo,sessionId:config.sessionId+1}));show("test")};
 // simulacro de 100 preguntas en modo examen real (nuevo o continuando el guardado)
 // questions: para repetir un simulacro con las mismas preguntas
 // history: un simulacro ya entregado, para revisarlo
 // count: 100 (1 h 30 min) o 60 (54 min), los dos en modo examen real
 const openExam=(resume=false,questions=null,history=null,count=EXAM_COUNT)=>{setExamConfig(config=>({resume,questions,history,count,sessionId:config.sessionId+1}));show("exam")};
 // abre el resumen de un tema colocado en un apartado concreto
 const openSummaryAt=(topicId,sectionId=null)=>{setSelected(topics.find(t=>t.id===topicId));setFocusSection(sectionId);show("topic")};
 // ir a "test" sin configuración abre siempre el selector de temas, no el último test
 // «Progreso» ahora está dentro de la página de Test
 const go=p=>p==="test"||p==="progress"?openTest(null):show(p);
 // cada alta o baja de favoritos lleva fecha para poder unirlas entre dispositivos
 const toggleFavorite=question=>setUserData(data=>{const id=getQuestionIdForProgress(question);const on=!data.favorites.includes(id);return {...data,favorites:on?[...data.favorites,id]:data.favorites.filter(favoriteId=>favoriteId!==id),favoriteChanges:{...(data.favoriteChanges??{}),[id]:{on,at:Date.now()}}}});
 const markLearned=question=>setUserData(data=>({...data,progress:markQuestionAsLearned(question,data.progress)}));
 // guarda (o borra, si queda vacía) la aclaración propia de una pregunta
 const saveNote=(question,text)=>setUserData(data=>{const id=getQuestionIdForProgress(question);const notes={...(data.notes??{})};const noteDeletions={...(data.noteDeletions??{})};if(text.trim())notes[id]={text:text.trim(),updatedAt:Date.now()};else{delete notes[id];noteDeletions[id]=Date.now()}return {...data,notes,noteDeletions}});
 applyExamScopes(userData.examScopes);
 const setExamScope=(topicId,on)=>setUserData(data=>({...data,examScopes:{...(data.examScopes??{}),[topicId]:{on,at:Date.now()}}}));
 // «¿segura o dudando?»: se guarda la última respuesta de cada pregunta con su seguridad
 const saveConfidence=entries=>{if(!entries?.length)return;setUserData(data=>{let log=data.confidence??{};entries.forEach(([question,level,correct])=>{log=recordConfidence(log,getQuestionIdForProgress(question),level,correct)});return {...data,confidence:log}})};
 // tareas del plan marcadas como hechas (por día) y los temas del día
 const setPlanCheck=(day,task,value)=>setUserData(data=>{const checks={...(data.planChecks??{})};checks[day]={...(checks[day]??{}),[task]:[value,Date.now()]};return {...data,planChecks:checks}});
 const togglePlanCheck=(day,task)=>setPlanCheck(day,task,!userData.planChecks?.[day]?.[task]?.[0]);
 // simulacros hechos (se sincronizan); los borrados se recuerdan para que no vuelvan desde otro dispositivo
 const recordExam=entry=>setUserData(data=>({...data,examHistory:[entry,...(data.examHistory??[]).filter(item=>item.id!==entry.id)].slice(0,40)}));
 const deleteExam=id=>setUserData(data=>({...data,examHistory:(data.examHistory??[]).filter(item=>item.id!==id),examHistoryDeleted:{...(data.examHistoryDeleted??{}),[id]:Date.now()}}));
 // los simulacros que versiones anteriores guardaban solo en este dispositivo pasan a la cuenta
 useEffect(()=>{const old=loadExamHistory();if(!old.length)return;setUserData(data=>{const ids=new Set((data.examHistory??[]).map(item=>item.id));return {...data,examHistory:[...(data.examHistory??[]),...old.filter(item=>!ids.has(item.id))].sort((a,b)=>b.endedAt-a.endedAt).slice(0,40)}});try{localStorage.removeItem(EXAM_HISTORY_KEY)}catch{}},[]);
 const sync=useSync(userData,setUserData);
 const [saveFailed,setSaveFailed]=useState(false);
 useEffect(()=>setSaveFailed(!saveUserData(userData)),[userData]);
 useEffect(()=>{document.documentElement.dataset.theme=userData.theme??"light"},[userData.theme]);
 return <div className="app">
  <aside className={"sidebar "+(mobile?"open":"")}><div className="brand"><div className="logo">LQ</div><span>LabQuiz <b>2.0</b></span></div>
  <button className="close" type="button" onClick={()=>setMobile(false)} aria-label="Cerrar menú"><X/></button>
    <nav className="nav">{[
    ["home","Inicio",Home],["summaries","Resúmenes",BookOpen],["test","Test y progreso",Brain,"Test"],["wrong","Preguntas falladas",RotateCcw,"Falladas"],["cheatsheet","Chuleta de fallos",ScrollText,"Chuleta"],["notes","Aclaraciones",NotebookPen],["review","Repaso",Layers3],["exams","Mis simulacros",Trophy,"Simulacros"],["settings","Configuración",Settings,"Ajustes"]
   ].map(([id,label,Icon,short])=><button key={id} className={page===id?"active":""} onClick={()=>go(id)} aria-label={label}><Icon/><span>{label}</span><small className="navShort" aria-hidden="true">{short??label}</small></button>)}</nav>
   <div className="sidecard"><FlaskConical/><strong>Tu preparación</strong><small>Construye tu dominio tema a tema.</small></div>
  </aside>
  <div className="svgDefs" aria-hidden="true" dangerouslySetInnerHTML={{__html:visualSummaryDefs}}/>
  <main className={page==="test"||page==="exam"?"testMain":""}><header className={page==="home"?"homeHeader":""}><button className="mobileMenu" type="button" onClick={()=>setMobile(true)} aria-label="Abrir menú"><Menu/></button><div><span className="eyebrow">OPOSICIONES · LABORATORIO</span><h1>{page==="home"?"Hola, Alana 👋":pageTitle(page)}</h1></div></header>
  {saveFailed&&<div className="saveWarning" role="alert"><b>⚠️ Tu progreso no se está guardando en este navegador.</b> Puede que el almacenamiento esté lleno o bloqueado (por ejemplo, en modo privado). Descarga una copia de seguridad para no perder tus datos. <button className="homeTextButton" type="button" onClick={()=>go("settings")}>Ir a Configuración <ChevronRight/></button></div>}
  {page==="home"&&<HomePage go={go} openTest={openTest} openExam={openExam} progress={userData.progress} planChecks={userData.planChecks} onTogglePlan={togglePlanCheck} onSetPlanTopics={(day,ids)=>setPlanCheck(day,"topics",ids)}/>}
  {page==="summaries"&&<SummaryPage progress={userData.progress} openTopic={t=>openSummaryAt(t.id)}/>}
  {page==="topic"&&selected&&<TopicPage examScopeConfig={userData.examScopes} onExamScope={setExamScope} topic={selected} go={go} progress={userData.progress} focusSection={focusSection} onStartTest={()=>openTest(selected.id)} onPractice={(ids,label,sectionId)=>openTest(selected.id,"topic",ids,null,label,{topicId:selected.id,sectionId,title:label})}/>}
  {page==="test"&&<TestPage key={`${testConfig.mode}-${testConfig.topicId??"selector"}-${testConfig.sessionId}`} go={go} onChangeTopic={()=>openTest(null)} initialTopicId={testConfig.topicId} initialQuestionIds={testConfig.questionIds} initialQuestionCount={testConfig.questionCount} label={testConfig.label} returnTo={testConfig.returnTo} onReturn={target=>openSummaryAt(target.topicId,target.sectionId)} mode={testConfig.mode} questionProgress={userData.progress} onProgressChange={progress=>setUserData(data=>({...data,progress}))} favorites={userData.favorites} onToggleFavorite={toggleFavorite} onMarkLearned={markLearned} notes={userData.notes??{}} onSaveNote={saveNote} onConfidence={saveConfidence} confidenceLog={userData.confidence??{}} onRecordExam={recordExam}/>}
  {page==="review"&&<ReviewPage go={go} examHistory={userData.examHistory} examDeleted={userData.examHistoryDeleted} progress={userData.progress} onReviewExam={entry=>openExam(false,null,entry)} onNumbers={count=>openTest(null,"numbers",null,count)} onStart={count=>count>=SIMULACRUM_MIN?openExam(false,null,null,count):openTest(null,"mixed",null,count)} onResumeExam={()=>openExam(true)}/>}
  {page==="exam"&&<ExamPage key={examConfig.sessionId} examCount={examConfig.count??EXAM_COUNT} onRecord={recordExam} resume={examConfig.resume} historyEntry={examConfig.history} repeatQuestions={examConfig.questions} onRepeat={questions=>openExam(false,questions)} onPracticeFailed={ids=>openTest(null,"failed",ids)} go={go} questionProgress={userData.progress} onProgressChange={progress=>setUserData(data=>({...data,progress}))} favorites={userData.favorites} onToggleFavorite={toggleFavorite} notes={userData.notes??{}} onSaveNote={saveNote} onConfidence={saveConfidence}/>}
  {page==="notes"&&<NotesPage notes={userData.notes??{}} onSaveNote={saveNote} onStart={questionIds=>openTest(null,"notes",questionIds)} go={go}/>}
  {page==="exams"&&<ExamsPage deleted={userData.examHistoryDeleted} onStart={count=>count==="resume"?openExam(true):openExam(false,null,null,count)} history={userData.examHistory} progress={userData.progress} onReview={entry=>openExam(false,null,entry)} onDelete={deleteExam} go={go}/>}
  {page==="cheatsheet"&&<CheatSheetPage progress={userData.progress} go={go} onStart={questionIds=>openTest(null,"cheat",questionIds)}/>}
  {page==="wrong"&&<WrongPage progress={userData.progress} onStart={questionIds=>openTest(null,"failed",questionIds)} onMarkLearned={markLearned} go={go}/>}
  {page==="favorites"&&<FavoritesPage favorites={userData.favorites} onToggleFavorite={toggleFavorite} go={go}/>}
  {page==="progress"&&<ProgressPage progress={userData.progress} confidence={userData.confidence??{}} onStart={topicId=>openTest(topicId)}/>}
  {page==="simulacrum"&&<SimulacrumPage go={go}/>}
  {page==="settings"&&<SettingsPage onExamScope={setExamScope} sync={sync} userData={userData} onRestore={data=>setUserData(migrateDuplicateProgress(data,duplicateAliases))} onThemeChange={theme=>setUserData(data=>({...data,theme}))}/>}
  </main>
 </div>
}
const pageTitle=p=>({exams:"Mis simulacros",cheatsheet:"Chuleta de fallos",summaries:"Resúmenes",topic:"Tema",test:"Test y progreso",review:"Repaso",notes:"Aclaraciones",exam:"Simulacro de examen",wrong:"Preguntas falladas",favorites:"Favoritas",progress:"Progreso",simulacrum:"Simulacro",settings:"Configuración"}[p]);

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

function HomePage({go,openTest,openExam,progress,planChecks,onTogglePlan,onSetPlanTopics}){
 const availableTopics=topics.filter(topic=>getQuestionBank(topic.id).length);
 const totalQuestions=topics.reduce((total,topic)=>total+getQuestionBank(topic.id).length,0);
 const progressByTopic=availableTopics.map(topic=>{const questions=getQuestionBank(topic.id);return {...getTopicProgress(questions,progress,topic.id),total:questions.length}});
 const practicedQuestions=progressByTopic.reduce((total,topic)=>total+topic.answered,0);
 const startedTopics=progressByTopic.filter(topic=>topic.answered>0).length;
 const globalMastery=totalQuestions?Math.round(progressByTopic.reduce((total,topic)=>total+topic.mastery*topic.total,0)/totalQuestions):0;
 const featuredTopics=availableTopics.slice(0,6);
 return <div className="homeDashboard">
  <ExamCountdown go={go}/>
  <StudyPlan progress={progress} planChecks={planChecks} onToggle={onTogglePlan} onSetTopics={onSetPlanTopics} openTest={openTest} openExam={openExam} go={go}/>
  <section className="homeStart">
   <div><span className="eyebrow">SESIÓN DE ESTUDIO</span><h2>¿Qué quieres practicar hoy?</h2><p>Elige un tema y empieza un test con su banco de preguntas.</p></div>
    <button className="homePrimaryAction" onClick={()=>openTest(null)}><span><Brain/></span><div><b>Test por temas</b><small>{availableTopics.length} temas disponibles</small></div><ChevronRight/></button>
  </section>
  <section className="homeSection" aria-labelledby="quick-access-title">
   <div className="homeSectionTitle"><div><span className="eyebrow">ACCESOS DIRECTOS</span><h3 id="quick-access-title">Tu estudio, a un toque</h3></div></div>
   <div className="homeQuickGrid">
    <button className="homeQuickAction failed" onClick={()=>go("wrong")}><span className="homeQuickIcon"><RotateCcw/></span><div><b>Preguntas falladas</b><small>Vuelve sobre tus errores</small></div><ChevronRight/></button>
    <button className="homeQuickAction exams" onClick={()=>go("exams")}><span className="homeQuickIcon"><Trophy/></span><div><b>Mis simulacros</b><small>Revisa los que ya has hecho</small></div><ChevronRight/></button>
    <button className="homeQuickAction cheat" onClick={()=>go("cheatsheet")}><span className="homeQuickIcon"><ScrollText/></span><div><b>Chuleta de fallos</b><small>Las claves de lo que se te escapa</small></div><ChevronRight/></button>
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

function VisualSummary({html,topicId,progress={},focus,onPractice}){const ref=useRef(null);
 const index=useMemo(()=>topicId?getSummaryIndex(topicId):null,[topicId,html,activeScopeKey]);
 // bajo cada apartado con preguntas asociadas, un botón para practicarlo con cuántas llevas hechas;
 // si están todas, el botón y la pestaña de arriba lo marcan con ✓
 const content=useMemo(()=>{if(!index||!onPractice)return html;
  const done=new Set();
  const withButtons=html.replace(/(<h2 id="(vs-s\d+)">[\s\S]*?<\/h2>)/g,(full,heading,id)=>{
   const ids=index.bySection.get(id)??[];const count=ids.length;if(count<3)return full;
   const seen=ids.filter(questionId=>(progress[questionId]?.vecesVista??0)>0).length;const complete=seen===count;if(complete)done.add(id);
   const title=complete?heading.replace(/<\/h2>$/,'<span class="secStar" title="Apartado completado" aria-label="Apartado completado">★</span></h2>'):heading;
   return `${title}<button type="button" class="practiceSec${complete?" complete":""}" data-practice="${id}" style="--done:${Math.round(seen/count*100)}%" aria-label="${complete?"Apartado completado":"Practicar este apartado"}: ${seen} de ${count} preguntas hechas">${complete?"<span class=\"secStarMini\">★</span> Apartado completado":"▶ Practicar este apartado"} · <b>${seen}/${count}</b> hechas</button>`;
  });
  return withButtons.replace(/<a class="chip" href="#(vs-s\d+)">/g,(full,id)=>done.has(id)?`<a class="chip secDone" href="#${id}">`:full);
 },[html,index,onPractice,progress]);
 // Los índices del resumen son enlaces "#vs-sN": se desplaza dentro de la página sin tocar la URL.
 // «Practicar este apartado»: en iOS el toque no siempre llega a convertirse en clic (si la página aún
 // se estaba desplazando, o en HTML insertado), así que también se atiende el propio toque. El contenedor
 // no se sustituye nunca, por eso las escuchas van en él y siguen valiendo aunque cambie el contenido.
 const practiceRef=useRef(null);
 // un mismo toque puede llegar por varias vías: solo cuenta una vez
 const lastPracticeRef=useRef(0);
 const firePractice=button=>{const now=Date.now();if(now-lastPracticeRef.current<700)return;lastPracticeRef.current=now;practiceRef.current?.(button.dataset.practice)};
 practiceRef.current=id=>{if(!index)return;const section=index.sections.find(s=>s.id===id);onPractice?.(index.bySection.get(id)??[],section?.title,id)};
 useEffect(()=>{const root=ref.current;if(!root)return;
  let start=null;
  const onTouchStart=e=>{const touch=e.touches[0];start=e.target.closest?.("[data-practice]")&&touch?{x:touch.clientX,y:touch.clientY}:null};
  const onTouchEnd=e=>{const button=e.target.closest?.("[data-practice]");const touch=e.changedTouches[0];
   if(!button||!start||!touch)return;const moved=Math.hypot(touch.clientX-start.x,touch.clientY-start.y);start=null;
   if(moved>12)return;e.preventDefault();firePractice(button)};
  const onClick=e=>{const button=e.target.closest?.("[data-practice]");if(!button)return;e.preventDefault();e.stopPropagation();firePractice(button)};
  root.addEventListener("touchstart",onTouchStart,{passive:true});
  root.addEventListener("touchend",onTouchEnd,{passive:false});
  root.addEventListener("click",onClick);
  return()=>{root.removeEventListener("touchstart",onTouchStart);root.removeEventListener("touchend",onTouchEnd);root.removeEventListener("click",onClick)}},[]);
 // y además cada botón escucha su propio clic, por si el del contenedor no llega
 useEffect(()=>{const root=ref.current;if(!root)return;
  const buttons=[...root.querySelectorAll("[data-practice]")];
  const handlers=buttons.map(button=>{const handler=e=>{e.preventDefault();e.stopPropagation();firePractice(button)};button.addEventListener("click",handler);return handler});
  return()=>buttons.forEach((button,i)=>button.removeEventListener("click",handlers[i]))},[content]);
 const onClick=e=>{if(e.target.closest?.("[data-practice]"))return;
  const link=e.target.closest?.('a[href^="#vs-"]');if(!link)return;e.preventDefault();ref.current?.querySelector(link.getAttribute("href"))?.scrollIntoView({behavior:"smooth",block:"start"})};
 // si se llega desde un test, baja directamente al apartado
 useEffect(()=>{if(!focus)return;const timer=setTimeout(()=>ref.current?.querySelector(`#${focus}`)?.scrollIntoView({block:"start"}),60);return()=>clearTimeout(timer)},[focus,html]);
 // Marca en la barra fija la pestaña del bloque que se está leyendo.
 useEffect(()=>{const root=ref.current;if(!root||!("IntersectionObserver" in window))return;
  const setActive=id=>root.querySelectorAll(".chips a").forEach(a=>{const on=a.getAttribute("href")===`#${id}`;a.classList.toggle("active",on);if(on){const bar=a.parentElement;bar.scrollTo({left:a.offsetLeft-bar.clientWidth/2+a.offsetWidth/2,behavior:"smooth"})}});
  const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(visible)setActive(visible.target.id)},{rootMargin:"-70px 0px -65% 0px"});
  root.querySelectorAll('h2[id^="vs-"]').forEach(h=>observer.observe(h));return()=>observer.disconnect()},[html]);
 // React vuelve a escribir todo el HTML si este objeto cambia, aunque el texto sea el mismo: se guarda
 // para no sustituir los botones (p. ej. al acabar de sincronizar) justo cuando se están tocando
 const inner=useMemo(()=>({__html:visualSummaryDefs+content}),[content]);
 return <div className="vsum" ref={ref} onClick={onClick} dangerouslySetInnerHTML={inner}/>}

// Interruptor de un recorte del temario (p. ej. Hormonas: solo tiroides)
function ExamScopeSwitch({topicId,scopes,onChange,className="scopeBanner"}){const scope=examScopes[topicId];if(!scope)return null;
 const on=isScopeOn(scope,scopes?.[topicId]);const total=fullQuestionBank(topicId).length;const inScope=fullQuestionBank(topicId).filter(question=>isInScope(scope,question)).length;
 const title=topics.find(t=>t.id===Number(topicId))?.title;
 return <section className={className}><div className="settingsCardText"><h3>{title}: {scope.label.charAt(0).toLowerCase()+scope.label.slice(1)}</h3><p>{on?`Los tests de este tema solo usan las ${inScope} preguntas ${scope.unit} (de ${total}). Las demás no se borran: vuelven al desactivarlo.`:`Actívalo para practicar solo las ${inScope} preguntas ${scope.unit} y saltarte las otras ${total-inScope}.`}</p></div>
  <button className="themeSwitch" type="button" role="switch" aria-checked={on} aria-label={scope.label} onClick={()=>onChange(topicId,!on)}><span/></button></section>}

function TopicPage({topic,go,progress,focusSection,onStartTest,onPractice,examScopeConfig,onExamScope}){const summary=getSummary(topic.id);const visual=getVisualSummary(topic.id);return <div>
 <button className="back" onClick={()=>go("summaries")}><ArrowLeft/> Volver a resúmenes</button>
 <header className="topicHeader"><div><span className="topicEyebrow">TEMA {String(topic.id).padStart(2,"0")}</span><h2>{topic.title}</h2></div><button className="topicTestButton" onClick={onStartTest}><Brain/><span>Hacer test</span></button></header>
 <ExamScopeSwitch topicId={topic.id} scopes={examScopeConfig} onChange={onExamScope}/>
 {visual?<div className="visualLayout"><VisualSummary html={visual} topicId={topic.id} progress={progress} focus={focusSection} onPractice={onPractice}/><TopicActions go={go} onStartTest={onStartTest}/></div>:
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
 notes:{backPage:"notes",backLabel:"Volver a aclaraciones",emptyTitle:"No tienes aclaraciones",emptyText:"Guarda una aclaración después de responder una pregunta y aparecerá aquí.",restartLabel:"Volver a aclaraciones"},
 mixed:{backPage:"review",backLabel:"Volver al repaso general",emptyTitle:"No hay preguntas disponibles todavía",emptyText:"Añade preguntas a los temas para poder generar un repaso general.",restartLabel:"Volver al repaso"},
 numbers:{backPage:"review",backLabel:"Volver a Repaso",emptyTitle:"No hay preguntas de cifras",emptyText:"No se han encontrado preguntas con valores numéricos en los temas activos.",restartLabel:"Otro test de cifras"},
 cheat:{backPage:"cheatsheet",backLabel:"Volver a la chuleta",emptyTitle:"No hay preguntas en la chuleta",emptyText:"Las preguntas que falles aparecerán en la chuleta.",restartLabel:"Volver a la chuleta"}
};
const crossTopicTitle={failed:"Preguntas falladas",notes:"Mis aclaraciones",numbers:"Cifras y valores",cheat:"Chuleta de fallos"};

function TestPage({go,onChangeTopic,initialTopicId=null,initialQuestionIds=null,initialQuestionCount=null,label=null,returnTo=null,onReturn,mode:initialMode="topic",questionProgress={},onProgressChange,favorites=[],onToggleFavorite,onMarkLearned,notes={},onSaveNote,onConfidence,confidenceLog={},onRecordExam}){
 const [mode,setMode]=useState(initialMode);
 const [topicOrder,setTopicOrder]=useState("number");
 const [selectedTopicId,setSelectedTopicId]=useState(initialTopicId);
 const [savedTest,setSavedTest]=useState(()=>initialMode==="topic"&&!initialTopicId?loadResumableTest():null);
 const [questionCount,setQuestionCount]=useState(20);
 const [onlyHard,setOnlyHard]=useState(false);
 const isCrossTopic=mode in crossTopicCopy;
 const [testQuestions,setTestQuestions]=useState(()=>{
  if(initialMode==="failed"){const failedQuestions=getFailedQuestions(questionProgress);const selectedFailedQuestions=initialQuestionIds?.length?failedQuestions.filter(question=>initialQuestionIds.includes(getQuestionIdForProgress(question))):failedQuestions;return selectSmartQuestions(selectedFailedQuestions,questionProgress,selectedFailedQuestions.length).map(question=>shuffleQuestionOptions(question));}
  if(initialMode==="numbers"){const pool=getNumberQuestions();return selectSmartQuestions(pool,questionProgress,Math.min(initialQuestionCount??20,pool.length)).map(question=>shuffleQuestionOptions(question));}
  if(initialMode==="notes"||initialMode==="cheat"){const ids=new Set(initialQuestionIds??[]);const pool=getAllQuestions(true).filter(question=>ids.has(getQuestionIdForProgress(question)));return selectSmartQuestions(pool,questionProgress,pool.length).map(question=>shuffleQuestionOptions(question));}
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
 // «¿segura o dudando?» de cada pregunta (si no se toca, cuenta como segura)
 const [confByIndex,setConfByIndex]=useState({});
 // revisión al terminar: «all» todas o «failed» solo las falladas (null = no se está revisando)
 const [reviewMode,setReviewMode]=useState(null);
 // los simulacros se registran al terminarlos (una vez por intento) para poder revisarlos otro día
 const isSimulacrum=mode==="mixed"&&label?.startsWith("Simulacro");
 const attemptRef=useRef(Date.now());
 const recordedRef=useRef(null);
 useEffect(()=>{if(!done||!isSimulacrum||recordedRef.current===attemptRef.current||!Object.keys(answersByIndex).length)return;recordedRef.current=attemptRef.current;onRecordExam?.(examHistoryEntry({kind:"sim",questions:testQuestions,answers:answersByIndex,confidence:confByIndex,startedAt:attemptRef.current,finish:{auto:false,endedAt:Date.now()}}))},[done]);

 const currentTopic=crossTopicTitle[mode]?{id:0,title:crossTopicTitle[mode]}:mode==="mixed"?{id:0,title:label?.startsWith("Simulacro")?"Simulacro de examen":"Repaso general"}:selectedTopicId ? topics.find(t=>t.id===selectedTopicId) : null;
 const totalQuestions=testQuestions.length;
 const q=testQuestions[i] ?? null;
 const selectedAnswer=answersByIndex[i] ?? null;
 const showResult=Object.prototype.hasOwnProperty.call(answersByIndex,i);
 const score=testQuestions.reduce((total,question,index)=>total+(answersByIndex[index]===question.correctAnswer?1:0),0);
 const isFavorite=q?favorites.includes(getQuestionIdForProgress(q)):false;
 const isLearned=q?questionProgress[getQuestionIdForProgress(q)]?.marcadaAprendida===true:false;
 const structuredExplanation=q?explainQuestion(q,q.topicId??currentTopic?.id):null;
 const questionTopicId=q?(q.topicId??currentTopic?.id):null;

 const startTopicTest=topicId=>{
  let questions=getQuestionBank(topicId).map(question=>({...question,topicId}));
  // «solo difíciles»: las que la estimación, ajustada con tus respuestas, marca como difíciles
  if(onlyHard){const hard=questions.filter(question=>getQuestionDifficulty(question,questionProgress)?.id==="hard");if(hard.length)questions=hard;}
  setSelectedTopicId(topicId);
  setTestQuestions(selectSmartQuestions(questions,questionProgress,questionCount).map(question=>shuffleQuestionOptions(question)));
  setI(0);
  setAnswersByIndex({});
  setConfByIndex({});
  setDone(false);
 };


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

 // vuelve a empezar con estas preguntas, en otro orden y con las opciones barajadas de nuevo
 const restartWith=questions=>{setTestQuestions(shuffledCopy(questions).map(question=>shuffleQuestionOptions(question)));setI(0);setAnswersByIndex({});setConfByIndex({});setReviewMode(null);setDone(false);attemptRef.current=Date.now();window.scrollTo(0,0);};

 const handleAnswer=(answerIndex)=>{
  if(!q || showResult) return;
  setAnswersByIndex(answers=>({...answers,[i]:answerIndex}));
  onProgressChange?.(recordQuestionAnswer(q,questionProgress,answerIndex===q.correctAnswer,Date.now(),answerIndex));
  onConfidence?.([[q,confByIndex[i]??"s",answerIndex===q.correctAnswer]]);
 };

 const reviewList=reviewMode?testQuestions.map((question,index)=>index).filter(index=>reviewMode==="all"||(Object.prototype.hasOwnProperty.call(answersByIndex,index)&&answersByIndex[index]!==testQuestions[index].correctAnswer)):null;
 const startReview=filter=>{const first=testQuestions.findIndex((question,index)=>filter==="all"||(Object.prototype.hasOwnProperty.call(answersByIndex,index)&&answersByIndex[index]!==question.correctAnswer));setReviewMode(filter);setI(Math.max(0,first));setDone(false);window.scrollTo(0,0)};
 const endReview=()=>{setReviewMode(null);setDone(true);window.scrollTo(0,0)};
 const handleNext=()=>{
  if(!q) return;
  if(reviewList){const next=reviewList.find(index=>index>i);if(next==null)endReview();else{setI(next);window.scrollTo(0,0)}return;}
  if(i>=totalQuestions-1){
   setDone(true);
   return;
  }
  setI(prev=>prev+1);
 };

 const handlePrevious=()=>{if(reviewList){const prev=[...reviewList].reverse().find(index=>index<i);if(prev!=null){setI(prev);window.scrollTo(0,0)}return;}setI(index=>Math.max(0,index-1))};

 if(!isCrossTopic&&!selectedTopicId){
   return <div className="testThemeSelector"><div className="testMeta"><span>SELECCIÓN DE TEMA</span><b>{topics.length} temas</b></div>{savedTest&&<div className="resumeTestBanner" role="status"><div><b>Tienes un test sin terminar</b><small>{crossTopicTitle[savedTest.mode]??(savedTest.mode==="mixed"?"Repaso general":null)??`Tema ${String(savedTest.topicId).padStart(2,"0")}`} · {Object.keys(savedTest.answers).length} de {savedTest.questions.length} respondidas</small></div><div className="resumeTestActions"><button className="primary" type="button" onClick={resumeSavedTest}><Play/> Continuar</button><button className="secondary" type="button" onClick={discardSavedTest}>Descartar</button></div></div>}<ProgressOverview progress={questionProgress}/><div className="testCountSelector"><span>Preguntas por test</span><div className="choiceRow">{[10,20,30].map(count=><button key={count} className={questionCount===count?"selected":""} onClick={()=>setQuestionCount(count)}>{count}</button>)}</div><small>La selección prioriza preguntas nuevas, errores pendientes y repasos programados.</small><span className="diffFilterLabel">Dificultad</span><div className="choiceRow diffChoice"><button className={!onlyHard?"selected":""} onClick={()=>setOnlyHard(false)}>Todas</button><button className={onlyHard?"selected":""} onClick={()=>setOnlyHard(true)}><DifficultyMeter difficulty={{id:"hard",label:"Solo difíciles",bars:3}}/></button></div></div><TopicsProgressGrid progress={questionProgress} order={topicOrder} onOrder={setTopicOrder} onPick={startTopicTest}/><ConfidenceCard log={confidenceLog}/></div>;
 }


 if(!q){
  return <div className="result card"><div className="resultIcon">📘</div><h2>{isCrossTopic?crossTopicCopy[mode].emptyTitle:"Este tema aún no tiene preguntas"}</h2><p>{isCrossTopic?crossTopicCopy[mode].emptyText:"El banco de preguntas está preparado para añadirse desde archivos separados por tema."}</p><button className="primary" onClick={()=>go(isCrossTopic?crossTopicCopy[mode].backPage:"test")}>{isCrossTopic?crossTopicCopy[mode].backLabel:"Volver a temas"}</button></div>;
 }

 if(done){
  const failedQuestions=testQuestions.filter((question,index)=>Object.prototype.hasOwnProperty.call(answersByIndex,index)&&answersByIndex[index]!==question.correctAnswer);
  return <div className="result card"><div className="resultIcon">🏆</div><h2>Sesión terminada</h2><strong>{score}/{totalQuestions}</strong><p className="resultPct">{Math.round(score/totalQuestions*100)} % de aciertos</p><p>{label?.startsWith("Simulacro")?"Has terminado el simulacro de examen.":"Has completado una selección inteligente de este banco."}</p>
   <ConfidenceSummary questions={testQuestions} answers={answersByIndex} confidence={confByIndex}/>
   {isSimulacrum&&<p className="examFormula"><Trophy/> Guardado en «Mis simulacros»: puedes revisarlo cuando quieras.</p>}
   <div className="resultActions">
    {returnTo&&<button className="primary" onClick={()=>onReturn?.(returnTo)}><BookOpen/> Volver al apartado «{returnTo.title}»</button>}
    <button className={returnTo?"secondary":"primary"} onClick={()=>startReview("all")}><Eye/> Revisar pregunta por pregunta</button>
    {failedQuestions.length>0&&<button className="secondary" onClick={()=>startReview("failed")}><Eye/> Revisar solo las {failedQuestions.length} falladas</button>}
    <button className="secondary" onClick={()=>restartWith(testQuestions)}><RotateCcw/> Repetir el mismo test</button>
    {failedQuestions.length>0&&<button className="secondary" onClick={()=>restartWith(failedQuestions)}><Target/> Repetir solo las {failedQuestions.length} falladas</button>}
    <button className="secondary" onClick={()=>isCrossTopic?go(crossTopicCopy[mode].backPage):startTopicTest(selectedTopicId)}>{isCrossTopic?crossTopicCopy[mode].restartLabel:"Crear otro test"}</button>
    {!isCrossTopic&&<button className="secondary" onClick={onChangeTopic}>Elegir otro tema</button>}
   </div>
  </div>;
 }

 return <div className="testWrap"><div className="testMeta"><span>{(label?`${currentTopic.title} · ${label.replace(/^Simulacro · /,"")}`:currentTopic.title).toUpperCase()}</span><b>{reviewList?`Revisión ${reviewList.indexOf(i)+1} / ${reviewList.length}`:`${i+1} / ${totalQuestions}`}</b></div><div className="progressLine"><i style={{width:((i+1)/totalQuestions*100)+"%"}}/></div><div className="testCard"><div className="qTags"><span className="badge">{isCrossTopic?`Tema ${String(q.topicId).padStart(2,"0")}`:`Tema ${String(currentTopic.id).padStart(2,"0")}`}</span><DifficultyMeter difficulty={questionTopicId?getQuestionDifficulty({...q,topicId:questionTopicId},questionProgress):null}/></div><h2>{q.number}. {q.question}</h2><ConfidencePicker value={confByIndex[i]??"s"} onChange={level=>setConfByIndex(current=>({...current,[i]:level}))} locked={showResult}/><div className="answers">{q.answers.map((answer,index)=><button key={answer+index} type="button" onClick={()=>handleAnswer(index)} disabled={showResult} className={showResult ? (index===q.correctAnswer ? "correct" : (selectedAnswer===index ? "incorrect" : "")) : ""}><span>{String.fromCharCode(65+index)}</span>{answer}{isDisputedKey(q,q.topicId??currentTopic?.id)&&index===q.correctAnswer&&<b className="keyStar" aria-label="respuesta de la clave oficial"> *</b>}</button>)}</div>{isDisputedKey(q,q.topicId??currentTopic?.id)&&<p className="keyStarNote">* La que da por buena la clave oficial, que es discutible: míralo en la explicación.</p>}{showResult&&<div className="testFeedback"><ExplanationDisplay structured={structuredExplanation} fallback={q.explanation} correctAnswerText={q.answers[q.correctAnswer]} isCorrect={selectedAnswer===q.correctAnswer}/><ExplanationFigures question={q} topicId={questionTopicId} explanation={structuredExplanation}/><AskClaudeButton key={i} question={q} topicId={questionTopicId} selected={selectedAnswer}/>{questionTopicId&&<NoteEditor key={`note-${i}`} question={{...q,topicId:questionTopicId}} note={notes[getQuestionIdForProgress({...q,topicId:questionTopicId})]} onSave={onSaveNote}/>}</div>}{mode==="failed"&&showResult&&<div className="failedQuestionAction"><button className="markLearnedButton" onClick={()=>onMarkLearned(q)} disabled={isLearned}><CheckCircle2/>{isLearned?"Marcada como aprendida":"Marcar como aprendida"}</button></div>}<div className="testActions"><button className="secondary" onClick={handlePrevious} disabled={reviewList?reviewList[0]===i:i===0}><ArrowLeft/> Anterior</button><button className={isFavorite?"secondary favoriteAction active":"secondary favoriteAction"} onClick={()=>onToggleFavorite(q)}><Star fill={isFavorite?"currentColor":"none"}/> Favoritos</button><button className="primary" onClick={handleNext}>{reviewList?(reviewList[reviewList.length-1]===i?"Ver resultado":"Siguiente"):i===totalQuestions-1?"Finalizar":"Siguiente"} <ChevronRight/></button></div>{reviewList?<button className="changeTopicButton" onClick={endReview}>Volver al resultado</button>:<button className="changeTopicButton" onClick={()=>returnTo?onReturn?.(returnTo):isCrossTopic?go(crossTopicCopy[mode].backPage):onChangeTopic()}>{returnTo?"Volver al resumen":isCrossTopic?crossTopicCopy[mode].backLabel:"Cambiar de tema"}</button>}</div></div>;
}

// Simulacro en modo examen real: sin soluciones hasta entregar, con reloj y penalización por fallo.
function ExamPage({go,resume,examCount=EXAM_COUNT,historyEntry=null,repeatQuestions=null,onRepeat,onPracticeFailed,questionProgress={},onProgressChange,favorites=[],onToggleFavorite,notes={},onSaveNote,onConfidence,onRecord}){
 const [exam]=useState(()=>{
  // un simulacro ya entregado, abierto desde el historial para revisarlo
  const past=historyEntry?restoreExamFromHistory(historyEntry):null;
  if(past) return past;
  const saved=resume?loadResumableExam():null;
  if(saved) return saved;
  clearExamSession();
  const startedAt=Date.now();
  const base=repeatQuestions?.length?shuffledCopy(repeatQuestions):selectSimulacrumQuestions(examCount,questionProgress);
  return {questions:base.map(question=>shuffleQuestionOptions(question)),answers:{},flags:[],index:0,startedAt,deadline:startedAt+examDuration(base.length)};
 });
 const {questions,startedAt,deadline}=exam;
 const total=questions.length;
 const [answers,setAnswers]=useState(exam.answers);
 const [flags,setFlags]=useState(exam.flags);
 const [confidence,setConfidence]=useState(exam.confidence??{});
 // notas que se apuntan durante el examen en cada pregunta (se leen en la revisión)
 const [scratch,setScratch]=useState(exam.scratch??{});
 const [i,setI]=useState(exam.index);
 const [phase,setPhase]=useState(exam.finish?"result":"exam");
 const [now,setNow]=useState(Date.now());
 const [finish,setFinish]=useState(exam.finish??null);
 const [showGrid,setShowGrid]=useState(false);
 const [confirming,setConfirming]=useState(false);
 const finishedRef=useRef(!!exam.finish);
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
  onConfidence?.(questions.flatMap((question,index)=>Object.prototype.hasOwnProperty.call(answers,index)?[[question,confidence[index]??"s",answers[index]===question.correctAnswer]]:[]));
  clearExamSession();
  onRecord?.(examHistoryEntry({kind:"exam",questions,answers,flags,confidence,scratch,startedAt,finish:{auto,endedAt}}));
  setFinish({auto,endedAt});
  setConfirming(false);setShowGrid(false);
  setPhase("result");
  window.scrollTo(0,0);
 };

 useEffect(()=>{if(phase!=="exam")return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[phase]);
 useEffect(()=>{if(phase==="exam"&&remaining<=0)submit(true)},[phase,remaining]);
 useEffect(()=>{if(phase==="exam"&&!finishedRef.current)saveExamSession({questions:questions.map(({id,number,topicId,question,answers})=>({id,number,topicId,question,answers})),answers,flags,confidence,scratch,index:i,startedAt,deadline,savedAt:Date.now()})},[phase,answers,flags,confidence,scratch,i]);

 const results=useMemo(()=>{
  let correct=0,wrong=0;
  const byTopic=new Map();
  questions.forEach((question,index)=>{
   const entry=byTopic.get(question.topicId)??{topicId:question.topicId,total:0,correct:0,wrong:0};
   entry.total++;
   if(Object.prototype.hasOwnProperty.call(answers,index)){if(answers[index]===question.correctAnswer){correct++;entry.correct++}else{wrong++;entry.wrong++}}
   byTopic.set(question.topicId,entry);
  });
  // por dificultad estimada (sin tus respuestas, para que no cambie al entregar)
  const levels=["easy","medium","hard"].map(id=>({id,total:0,correct:0,wrong:0}));
  questions.forEach((question,index)=>{const level=levels.find(entry=>entry.id===getQuestionDifficulty(question,{},true)?.id);if(!level)return;level.total++;if(Object.prototype.hasOwnProperty.call(answers,index)){if(answers[index]===question.correctAnswer)level.correct++;else level.wrong++}});
  const net=correct-wrong*EXAM_PENALTY;
  const nominal=exam.nominalTotal??total;
  return {correct,wrong,blank:nominal-correct-wrong,net,levels:levels.filter(level=>level.total),grade:Math.max(0,net)/nominal*10,topics:[...byTopic.values()].map(entry=>({...entry,net:entry.correct-entry.wrong*EXAM_PENALTY})).sort((a,b)=>a.net/a.total-b.net/b.total)};
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
   <h2>{exam.kind==="sim"?`Simulacro de ${total} preguntas`:finish.auto?"Se acabó el tiempo":"Examen entregado"}</h2>
   {exam.recovered&&<p className="examTip">Recuperado de tu progreso: están las preguntas que respondiste en este simulacro y si las acertaste. No se guardaba qué opción marcaste al fallar ni cuáles dejaste en blanco, y si después volviste a responder alguna, ya cuenta en otro sitio.</p>}
   {historyEntry&&<p className="examFormula">Simulacro del {new Date(finish.endedAt).toLocaleString("es-ES",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}</p>}
   <strong>{formatScore(results.grade)}<small> / 10</small></strong>
   <p className="resultPct">Puntuación neta: <b>{formatScore(results.net)}</b> de {total}</p>
   <div className="examScore">
    <div className="ok"><b>{results.correct}</b><span>Aciertos</span><small>+{results.correct}</small></div>
    <div className="ko"><b>{results.wrong}</b><span>Fallos</span><small>−{formatScore(results.wrong*EXAM_PENALTY)}</small></div>
    <div className="bl"><b>{results.blank}</b><span>En blanco</span><small>0</small></div>
   </div>
   <p className="examFormula">Aciertos − fallos ÷ 4{exam.kind==="sim"?" (calculada como en el examen real)":` · tiempo usado ${formatClock(used)} de ${formatClock(deadline-startedAt)}`}</p>
   <div className="examLevels"><span className="reviewSetupLabel">Por dificultad</span>{results.levels.map(level=><div key={level.id} className="examLevelRow"><DifficultyMeter difficulty={{id:level.id,label:{easy:"Fáciles",medium:"Medias",hard:"Difíciles"}[level.id],bars:{easy:1,medium:2,hard:3}[level.id]}}/><small>{level.correct}✓ {level.wrong}✗ {level.total-level.correct-level.wrong}○ de {level.total}</small><b>{formatScore(level.correct-level.wrong*EXAM_PENALTY)}</b></div>)}{(()=>{const hard=results.levels.find(level=>level.id==="hard");return hard&&hard.wrong*EXAM_PENALTY>hard.correct*0.5?<p className="examTip">Pierdes muchos puntos en las difíciles: si dudas entre varias opciones, mejor dejarla en blanco.</p>:null})()}</div>
   <ConfidenceSummary questions={questions} answers={answers} confidence={confidence} exam/>
   {Object.keys(scratch).length>0&&<p className="examFormula"><Pencil/> Apuntaste notas en {Object.keys(scratch).length} {Object.keys(scratch).length===1?"pregunta":"preguntas"}: las verás al revisar el examen (marcadas con un punto en la cuadrícula).</p>}
   <div className="examTopics"><span className="reviewSetupLabel">Por temas (de peor a mejor)</span>{results.topics.map(entry=><div key={entry.topicId} className="examTopicRow"><span>T{String(entry.topicId).padStart(2,"0")}</span><em>{topics.find(topic=>topic.id===entry.topicId)?.title}</em><small>{entry.correct}✓ {entry.wrong}✗ {entry.total-entry.correct-entry.wrong}○</small><i><b style={{width:`${Math.max(0,entry.net)/entry.total*100}%`}}/></i></div>)}</div>
   <div className="resultActions">
    <button className="primary" onClick={()=>{setPhase("review");goTo(0)}}>Revisar el examen</button>
    <button className="secondary" onClick={()=>onRepeat?.(questions)}><RotateCcw/> Repetir el mismo examen</button>
    {results.wrong>0&&<button className="secondary" onClick={()=>onPracticeFailed?.(questions.filter((question,index)=>status(index)==="wrong").map(question=>getQuestionIdForProgress(question)))}><Target/> Practicar las {results.wrong} falladas</button>}
    {historyEntry?<button className="secondary" onClick={()=>go("exams")}>Volver a Mis simulacros</button>:<><button className="secondary" onClick={()=>go("exams")}><Trophy/> Ver en Mis simulacros</button><button className="secondary" onClick={()=>go("review")}>Volver a Repaso</button></>}
   </div>
  </div>;
 }

 const reviewing=phase==="review";
 const linkedId=getQuestionIdForProgress(q);
 const isFavorite=favorites.includes(linkedId);
 const lowTime=!reviewing&&remaining<=5*60*1000;
 const blank=total-answeredCount;

 return <div className="testWrap examWrap">
  <div className="testMeta"><span>{reviewing?"REVISIÓN DEL SIMULACRO":"SIMULACRO DE EXAMEN"}</span>{reviewing?<b>{i+1} / {total}</b>:<b className={lowTime?"examClock low":"examClock"} role="timer" aria-label="Tiempo restante"><Timer/>{formatClock(remaining)}</b>}</div>
  <div className="progressLine"><i style={{width:(reviewing?(i+1)/total:answeredCount/total)*100+"%"}}/></div>
  <div className="examBar">
   <button type="button" className={showGrid?"examGridToggle open":"examGridToggle"} onClick={()=>setShowGrid(open=>!open)} aria-expanded={showGrid}><LayoutGrid/>{reviewing?`${results.correct} ✓ · ${results.wrong} ✗ · ${results.blank} en blanco`:`Pregunta ${i+1} de ${total} · ${answeredCount} respondidas`}</button>
  </div>
  {showGrid&&<div className="examGrid">{questions.map((question,index)=><button key={index} type="button" onClick={()=>goTo(index)} className={[index===i?"current":"",reviewing?status(index):Object.prototype.hasOwnProperty.call(answers,index)?"answered":"",flags.includes(index)?"flagged":"",scratch[index]?.trim()?"noted":""].join(" ")} aria-label={`Pregunta ${index+1}${scratch[index]?.trim()?" (con nota)":""}`}>{index+1}</button>)}</div>}
  <div className="testCard">
   <div className="qTags"><span className="badge">Tema {String(q.topicId).padStart(2,"0")}</span><DifficultyMeter difficulty={getQuestionDifficulty(q,questionProgress)}/></div>
   <h2>{i+1}. {q.question}</h2>
   <ConfidencePicker value={confidence[i]??"s"} onChange={level=>setConfidence(current=>({...current,[i]:level}))} locked={reviewing}/>
   <div className="answers">{q.answers.map((answer,index)=><button key={answer+index} type="button" onClick={()=>!reviewing&&pick(index)} disabled={reviewing} aria-pressed={!reviewing?selected===index:undefined} className={reviewing?(index===q.correctAnswer?(selected===index?"correct":"correct missed"):selected===index?"incorrect":""):selected===index?"picked":""}><span>{String.fromCharCode(65+index)}</span>{answer}{isDisputedKey(q,q.topicId)&&index===q.correctAnswer&&<b className="keyStar" aria-label="respuesta de la clave oficial"> *</b>}</button>)}</div>{isDisputedKey(q,q.topicId)&&<p className="keyStarNote">* La que da por buena la clave oficial, que es discutible: míralo en la explicación.</p>}
   {!reviewing&&<p className="examHint">{hasAnswer?"Toca de nuevo tu respuesta para dejarla en blanco.":"Si no la sabes, déjala en blanco: no resta."}</p>}
   {!reviewing&&<label className="examScratch"><span><Pencil/> Mis notas</span><textarea rows={2} value={scratch[i]??""} onChange={e=>{const text=e.target.value;setScratch(current=>{const next={...current};if(text)next[i]=text;else delete next[i];return next})}} placeholder="Apunta lo que quieras de esta pregunta: lo verás al revisar el examen"/></label>}
   {reviewing&&exam.recovered&&status(i)==="wrong"&&selected===-1&&<p className="examHint">La fallaste en este simulacro (no se guardó qué opción marcaste).</p>}
   {reviewing&&scratch[i]?.trim()&&<div className="examScratchRead"><span><Pencil/> Tu nota durante el examen</span><p>{scratch[i]}</p></div>}
   {reviewing&&<div className="testFeedback"><ExplanationDisplay structured={explainQuestion(q,q.topicId)} fallback={q.explanation} correctAnswerText={q.answers[q.correctAnswer]} isCorrect={hasAnswer?selected===q.correctAnswer:null}/><ExplanationFigures question={q} topicId={q.topicId} explanation={explainQuestion(q,q.topicId)}/><AskClaudeButton key={i} question={q} topicId={q.topicId} selected={hasAnswer?selected:null}/><NoteEditor key={`note-${i}`} question={q} note={notes[linkedId]} onSave={onSaveNote}/></div>}
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
  
 </div>;
}


// Dibujos de lo que se pregunta (cristales, cilindros, células y sus alteraciones)
function ExplanationFigures({question,topicId,explanation}){
 const figures=useMemo(()=>figuresFor(question,topicId,explanation),[question,topicId,explanation]);
 if(!figures.length) return null;
 return <div className="explFigures"><span className="explFiguresTitle">Así se ve</span><div className="explFiguresRow">{figures.map(figure=><figure key={figure.name}><div className="explFigureImg" dangerouslySetInnerHTML={{__html:figure.svg}}/><figcaption><b>{figure.name}</b>{figure.caption&&<small>{figure.caption}</small>}</figcaption></figure>)}</div><small className="explFiguresNote">Dibujo esquemático, no foto real.</small></div>;
}

// «¿Dudas?»: solo se toca si no estás segura (si no se toca, cuenta como segura).
// Tocar otra vez el botón marcado lo desmarca.
function ConfidencePicker({value="s",onChange,locked=false}){
 if(locked&&value==="s") return null;
 const levels=CONFIDENCE_LEVELS.filter(level=>level.id!=="s");
 return <div className={locked?"confRow locked":"confRow"} role="group" aria-label="¿Dudas con esta pregunta?"><span className="confLabel"><ShieldQuestion/> {locked?"Marcaste":"¿Dudas?"}</span>{levels.map(level=><button key={level.id} type="button" aria-pressed={value===level.id} className={value===level.id?"on":""} disabled={locked&&value!==level.id} onClick={()=>!locked&&onChange?.(value===level.id?"s":level.id)} title={level.hint}>{level.short}</button>)}</div>;
}

// Resultado de un test o simulacro según la seguridad con la que se respondió
function ConfidenceSummary({questions,answers,confidence,exam=false}){
 const rows=CONFIDENCE_LEVELS.map(level=>{let correct=0,wrong=0;questions.forEach((question,index)=>{if(!Object.prototype.hasOwnProperty.call(answers,index)||(confidence[index]??"s")!==level.id)return;if(answers[index]===question.correctAnswer)correct++;else wrong++});return {...level,correct,wrong,net:correct-wrong*EXAM_PENALTY}}).filter(row=>row.correct+row.wrong);
 if(!rows.length||(rows.length===1&&rows[0].id==="s")) return null;
 const blind=rows.find(row=>row.id==="c");
 return <div className="confSummary"><span className="reviewSetupLabel">Según tu seguridad</span>{exam&&<small className="confSummaryHelp">El número de la derecha son los puntos que te ha dado cada tipo de respuesta (aciertos − fallos ÷ 4).</small>}{rows.map(row=><div key={row.id} className={`confSummaryRow conf-${row.id}`}><b>{row.label}</b><small>{row.correct}✓ {row.wrong}✗</small><em>{Math.round(row.correct/(row.correct+row.wrong)*100)} %</em>{exam&&<strong className={row.net<0?"neg":""}>{row.net>0?"+":""}{formatScore(row.net)}</strong>}</div>)}
  {exam&&blind&&<p className="examTip">{blind.net<0?<>Las que contestaste <b>a ciegas</b> te restaron {formatScore(-blind.net)} puntos: en blanco habrías sacado más nota.</>:<>Las que contestaste <b>a ciegas</b> te sumaron {formatScore(blind.net)} puntos: arriesgar te salió bien.</>}</p>}
 </div>;
}

// ¿Arriesgar o dejar en blanco? Se calcula con todas tus respuestas marcadas
function ConfidenceCard({log}){
 const stats=confidenceStats(log);
 const total=stats.reduce((sum,entry)=>sum+entry.total,0);
 return <section className="confCard card" aria-labelledby="conf-title">
  <div className="progressSectionTitle"><div><span className="eyebrow">ESTRATEGIA DE EXAMEN</span><h2 id="conf-title">¿Arriesgar o dejar en blanco?</h2></div><small>{total} respuestas marcadas</small></div>
  <p className="confIntro">Con 4 opciones y cada 4 fallos restando 1, contestar compensa si aciertas más del {Math.round(BREAK_EVEN*100)} %. Antes de responder, marca si estás <b>segura</b>, <b>dudas entre 2</b> o vas <b>a ciegas</b>, y aquí verás qué te conviene.</p>
  <div className="confStats">{stats.map(entry=>{const advice=confidenceAdvice(entry);return <div key={entry.id} className={`confStat conf-${entry.id}`}><div><b>{entry.label}</b><small>{entry.total?`${entry.correct} de ${entry.total} acertadas`:"Sin respuestas todavía"}</small></div><strong>{entry.rate==null?"—":`${Math.round(entry.rate*100)} %`}</strong><span className={`confAdvice ${advice.tone}`}>{advice.text}</span>{entry.ev!=null&&entry.total>=5&&<small className="confEv">{entry.ev>=0?"+":"−"}{Math.abs(entry.ev*100).toFixed(0)} puntos por cada 100 que contestes así</small>}</div>})}</div>
 </section>;
}

// Chuleta: las claves de las preguntas que has fallado, para repasarlas en pocos minutos
function CheatSheetPage({progress,go,onStart}){
 const [scope,setScope]=useState("pending");
 const [topicFilter,setTopicFilter]=useState("all");
 const [hidden,setHidden]=useState(false);
 const [revealed,setRevealed]=useState(()=>new Set());
 const [limit,setLimit]=useState(40);
 const items=useMemo(()=>getAllQuestions().map(question=>({question,id:getQuestionIdForProgress(question),state:progress[getQuestionIdForProgress(question)]})).filter(({state})=>(state?.vecesFallada??0)>0&&(scope==="all"||isQuestionCurrentlyFailed(state))).sort((a,b)=>(b.state.vecesFallada-a.state.vecesFallada)||((b.state.ultimaVezVista??0)-(a.state.ultimaVezVista??0))),[progress,scope,activeScopeKey]);
 const topicIds=[...new Set(items.map(item=>item.question.topicId))].sort((a,b)=>a-b);
 const shown=items.filter(item=>topicFilter==="all"||item.question.topicId===Number(topicFilter));
 const toggle=id=>setRevealed(current=>{const next=new Set(current);next.has(id)?next.delete(id):next.add(id);return next});
 return <div className="cheatPage">
  <div className="reviewHero"><h2>Lo que se te escapa</h2><p>Cada pregunta que has fallado, con su respuesta y la clave para recordarla. Las que más veces fallas salen primero. Con «Modo tarjeta» se tapan las respuestas para ponerte a prueba.</p></div>
  <div className="cheatTools">
   <div className="choiceRow"><button className={scope==="pending"?"selected":""} onClick={()=>{setScope("pending");setLimit(40)}}>Pendientes</button><button className={scope==="all"?"selected":""} onClick={()=>{setScope("all");setLimit(40)}}>Todas las falladas alguna vez</button></div>
   <div className="cheatRow2"><select value={topicFilter} onChange={e=>{setTopicFilter(e.target.value);setLimit(40)}} aria-label="Filtrar por tema"><option value="all">Todos los temas ({items.length})</option>{topicIds.map(id=><option key={id} value={id}>Tema {String(id).padStart(2,"0")} · {topics.find(t=>t.id===id)?.title} ({items.filter(item=>item.question.topicId===id).length})</option>)}</select>
   <button type="button" className={hidden?"secondary cheatHide on":"secondary cheatHide"} onClick={()=>{setHidden(value=>!value);setRevealed(new Set())}}>{hidden?<Eye/>:<EyeOff/>}{hidden?"Mostrar respuestas":"Modo tarjeta"}</button></div>
  </div>
  {!shown.length?<div className="reviewHero"><p>{scope==="pending"?"No tienes fallos pendientes. Prueba con «Todas las falladas alguna vez».":"Aún no has fallado ninguna pregunta en estos temas."}</p><button className="primary" onClick={()=>go("test")}>Hacer un test</button></div>:<>
  <div className="cheatList">{shown.slice(0,limit).map(({question,id,state})=>{const explanation=explainQuestion(question,question.topicId);const open=!hidden||revealed.has(id);return <article key={id} className={open?"cheatCard":"cheatCard closed"} onClick={()=>hidden&&toggle(id)}>
   <div className="wrongQuestionMeta"><span className="badge">Tema {String(question.topicId).padStart(2,"0")}</span><span>{state.vecesFallada} {state.vecesFallada===1?"fallo":"fallos"}</span></div>
   <h3>{question.question}</h3>
   {open?<><p className="cheatAnswer"><Check/> {question.answers[question.correctAnswer]}</p>{explanation?.claveMemorizar&&<p className="cheatKey">⭐ {explanation.claveMemorizar}</p>}<ExplanationFigures question={question} topicId={question.topicId} explanation={explanation}/></>:<p className="cheatTap">Toca para ver la respuesta</p>}
  </article>})}</div>
  {shown.length>limit&&<button className="secondary cheatMore" onClick={()=>setLimit(value=>value+40)}>Ver más ({shown.length-limit} restantes)</button>}
  <button className="primary cheatPractice" onClick={()=>onStart(shown.slice(0,Math.max(limit,20)).map(item=>item.id))}><Play/> Hacer test con estas {Math.min(shown.length,Math.max(limit,20))}</button></>}
 </div>;
}

// Plan hasta el examen: lo que toca hoy según los días que quedan y cómo vas
const dayKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const SIMULACRUM_DAYS=[21,17,14,10,7,4];
function StudyPlan({progress,planChecks={},onToggle,onSetTopics,openTest,openExam,go}){
 const today=new Date();today.setHours(0,0,0,0);
 const examDay=new Date(EXAM_DATE);examDay.setHours(0,0,0,0);
 const daysLeft=Math.round((examDay-today)/86400000);
 const key=dayKey(today);
 const checks=planChecks[key]??{};
 const all=getAllQuestions();
 const unseen=all.filter(question=>!((progress[getQuestionIdForProgress(question)]?.vecesVista??0)>0)).length;
 const failed=getFailedQuestions(progress).length;
 const answeredToday=Object.values(progress).filter(state=>(state?.ultimaVezVista??0)>=today.getTime()).length;
 const finalDays=daysLeft<=2;
 const newPerDay=finalDays?0:Math.ceil(unseen/Math.max(1,daysLeft-2));
 const dailyTarget=finalDays?Math.max(20,Math.min(failed,80)):Math.min(300,Math.max(60,newPerDay+Math.min(failed,40)));
 // los 2 temas más flojos se eligen una vez al día (y se guardan para que no cambien al practicarlos)
 const storedTopics=Array.isArray(checks.topics?.[0])?checks.topics[0]:null;
 // uno ya empezado en el que vas peor y otro con mucho por ver
 const weakTopics=useMemo(()=>{if(storedTopics)return storedTopics;
  const list=topics.map(topic=>{const questions=getQuestionBank(topic.id);return {id:topic.id,total:questions.length,...getTopicProgress(questions,progress,topic.id)}}).filter(topic=>topic.total);
  const weakest=list.filter(topic=>topic.answered>=10).sort((a,b)=>a.mastery-b.mastery)[0];
  const leastSeen=list.filter(topic=>topic.id!==weakest?.id).sort((a,b)=>(a.answered/a.total)-(b.answered/b.total)||b.total-a.total)[0];
  return [weakest,leastSeen].filter(Boolean).map(topic=>topic.id);
 },[key,storedTopics?.join(",")]);
 useEffect(()=>{if(!storedTopics&&weakTopics.length&&daysLeft>=0)onSetTopics?.(key,weakTopics)},[key,storedTopics?.join(","),weakTopics.join(",")]);
 if(daysLeft<0) return null;
 const nextSim=SIMULACRUM_DAYS.find(day=>day<daysLeft);
 const tasks=[];
 if(daysLeft===0) tasks.push({id:"cheat",icon:ScrollText,title:"Un último vistazo a la chuleta",detail:"Solo las claves, sin agobios. ¡Mucha suerte!",action:()=>go("cheatsheet")});
 else{
  if(SIMULACRUM_DAYS.includes(daysLeft)) tasks.push({id:"sim",icon:Trophy,title:"Simulacro de 100 · 1 h 30 min",detail:"En condiciones de examen. Marca tu seguridad en cada pregunta.",action:()=>openExam(false)});
  if(!finalDays) weakTopics.forEach(topicId=>{const topic=topics.find(t=>t.id===topicId);const questions=getQuestionBank(topicId);const {mastery}=getTopicProgress(questions,progress,topicId);const {answered}=getTopicProgress(questions,progress,topicId);const seen=Math.round(answered/questions.length*100);tasks.push({id:`topic-${topicId}`,icon:Brain,title:`Test del tema ${String(topicId).padStart(2,"0")} · ${topic?.title}`,detail:answered>=10&&seen>=15?`Es donde vas peor: dominio ${mastery} %`:`Te queda mucho por ver: llevas el ${seen} % de sus preguntas`,action:()=>openTest(topicId)})});
  if(failed) tasks.push({id:"failed",icon:RotateCcw,title:"Repasa tus falladas",detail:`${failed} pendientes${finalDays?" · hoy, todas":""}`,action:()=>openTest(null,"failed")});
  if(!finalDays&&daysLeft%2===0) tasks.push({id:"numbers",icon:Hash,title:"Test de cifras y valores",detail:"20 preguntas con números: valores, semanas, porcentajes",action:()=>openTest(null,"numbers",null,20)});
  tasks.push({id:"cheat",icon:ScrollText,title:"Chuleta de fallos",detail:finalDays?"Repásala entera, sin preguntas nuevas":"10 minutos en un rato muerto",action:()=>go("cheatsheet")});
 }
 const doneCount=tasks.filter(task=>checks[task.id]?.[0]).length;
 const phase=daysLeft===0?"Día del examen":finalDays?"Fase final: solo repaso":daysLeft<=14?"Fase 2: afianzar y simulacros":"Fase 1: completar el temario";
 const pct=Math.min(100,Math.round(answeredToday/dailyTarget*100));
 return <section className="studyPlan card" aria-labelledby="plan-title">
  <div className="planHead"><span className="planIcon"><CalendarDays/></span><div><span className="eyebrow">PLAN HASTA EL EXAMEN · {daysLeft===0?"HOY":`QUEDAN ${daysLeft} ${daysLeft===1?"DÍA":"DÍAS"}`}</span><h3 id="plan-title">{phase}</h3></div><b className="planDone">{doneCount}/{tasks.length}</b></div>
  {daysLeft>0&&<div className="planGoal"><div><span>Preguntas de hoy</span><b>{answeredToday} de {dailyTarget}</b></div><i><em style={{width:`${pct}%`}}/></i><small>{finalDays?"Estos días, nada nuevo: falladas y chuleta.":`${unseen.toLocaleString("es-ES")} preguntas sin ver · unas ${newPerDay} nuevas al día para verlas todas antes del repaso final.`}{nextSim&&!SIMULACRUM_DAYS.includes(daysLeft)?` Próximo simulacro: dentro de ${daysLeft-nextSim} ${daysLeft-nextSim===1?"día":"días"}.`:""}</small></div>}
  <ul className="planTasks">{tasks.map(task=>{const Icon=task.icon;const done=!!checks[task.id]?.[0];return <li key={task.id} className={done?"done":""}><button type="button" className="planCheck" role="checkbox" aria-checked={done} aria-label={`Marcar «${task.title}» como hecha`} onClick={()=>onToggle?.(key,task.id)}>{done&&<Check/>}</button><button type="button" className="planTask" onClick={task.action}><Icon/><div><b>{task.title}</b><small>{task.detail}</small></div><ChevronRight/></button></li>})}</ul>
 </section>;
}

// Test de cifras y valores: solo preguntas con números en las opciones
function NumbersCard({onStart}){
 const [count,setCount]=useState(20);
 const available=useMemo(()=>getNumberQuestions().length,[activeScopeKey]);
 if(!available) return null;
 return <div className="reviewSetup numbersCard">
  <span className="reviewSetupLabel"><Hash/> Test de cifras y valores</span>
  <p className="examNote">Solo preguntas con números en las respuestas: valores de referencia, semanas, porcentajes, temperaturas, tiempos… Hay {available.toLocaleString("es-ES")} en los temas que entran.</p>
  <div className="reviewCountRow">{[10,20,30,50].map(value=><button key={value} type="button" className={count===value?"selected":""} onClick={()=>setCount(value)}>{value}</button>)}</div>
  <button className="primary" type="button" onClick={()=>onStart?.(count)}>Empezar test de cifras</button>
 </div>;
}

// Simulacros hechos: evolución de la nota y lista para revisarlos otro día
// deleted: los borrados (también los recuperados, que no están guardados y se reconstruyen cada vez)
const examRows=(history,progress,deleted={})=>[...(history??[]),...(progress?recoveredExamEntries(progress,history??[]).filter(entry=>!deleted[entry.id]):[])].map(entry=>({entry,score:examEntryScore(entry)})).filter(row=>row.score).sort((a,b)=>b.entry.endedAt-a.entry.endedAt);
const formatExamDate=time=>{const text=new Date(time).toLocaleDateString("es-ES",{weekday:"short",day:"numeric",month:"short"});return text.charAt(0).toUpperCase()+text.slice(1)};
function ExamRow({entry,score,onReview,onDelete}){
 const total=score.correct+score.wrong+score.blank;
 return <div className="examHistoryRow"><button type="button" className="examHistoryOpen" onClick={()=>onReview?.(entry)}><span className={`examGrade${score.grade>=5?" pass":""}`}>{formatScore(Math.round(score.grade*100)/100)}</span><div><b>{formatExamDate(entry.endedAt)} · {entry.kind==="sim"?`Simulacro de ${total} (con soluciones)`:`Examen de ${total}`}{entry.recovered&&<em className="recoveredTag">recuperado</em>}</b><small>{score.correct}✓ {score.wrong}✗ {score.blank} en blanco · neta {formatScore(score.net)}</small></div><span>Revisar <ChevronRight/></span></button>{onDelete&&<button type="button" className="examHistoryDelete" aria-label="Borrar este simulacro" onClick={()=>{if(window.confirm("¿Borrar este simulacro de tu registro?"))onDelete(entry.id)}}><Trash2/></button>}</div>;
}
// Botones para empezar un simulacro desde «Mis simulacros»
function StartExamButtons({onStart}){
 const [saved]=useState(()=>loadResumableExam());
 return <div className="examStart">
  {saved&&<button type="button" className="primary" onClick={()=>onStart?.("resume")}><Play/> {saved.deadline>Date.now()?"Continuar":"Ver nota"}</button>}
  <button type="button" className={saved?"secondary":"primary"} onClick={()=>onStart?.(EXAM_COUNT)} title="1 h 30 min · sin soluciones hasta entregar · cada 4 fallos restan 1"><Timer/> Examen de 100</button>
  <button type="button" className="secondary" onClick={()=>onStart?.(60)} title="54 min · sin soluciones hasta entregar · cada 4 fallos restan 1"><Timer/> Examen de 60</button>
 </div>;
}

function ExamsPage({history,progress,deleted,onReview,onDelete,onStart,go}){
 const [kind,setKind]=useState("all");
 const rows=useMemo(()=>examRows(history,progress,deleted),[history,progress,deleted]);
 const shown=rows.filter(row=>kind==="all"||(kind==="100"?row.score.total>=EXAM_COUNT:row.score.total<EXAM_COUNT));
 if(!rows.length) return <div className="reviewHero"><h2>Aún no has hecho ningún simulacro</h2><p>Cada examen que termines (de 100 o de 60) se guarda aquí con su nota para que puedas revisarlo cuando quieras, también desde tus otros dispositivos.</p><StartExamButtons onStart={onStart}/></div>;
 const grades=shown.map(row=>row.score.grade);
 const avg=grades.length?grades.reduce((a,b)=>a+b,0)/grades.length:0;
 const chron=[...shown].reverse();
 const last=chron.length>1?chron[chron.length-1].score.grade-chron[chron.length-2].score.grade:null;
 return <div className="examsPage">
  <section className="testOverview examsOverview" aria-label="Resumen de tus simulacros">
   <div className="testOverviewStats"><div><b>{shown.length}</b><small>{shown.length===1?"simulacro":"simulacros"}</small></div><div><b>{formatScore(Math.round(avg*100)/100)}</b><small>nota media</small></div><div><b>{grades.length?formatScore(Math.round(Math.max(...grades)*100)/100):"—"}</b><small>mejor nota</small></div></div>
   {chron.length>1&&<div className="examTrend" aria-label="Evolución de la nota">{chron.slice(-12).map(row=><i key={row.entry.id} title={`${formatExamDate(row.entry.endedAt)}: ${formatScore(row.score.grade)}`} className={row.score.grade>=5?"pass":""} style={{height:`${Math.max(4,row.score.grade*10)}%`}}/>)}<small>{last==null?"":last>=0?`▲ ${formatScore(Math.round(last*100)/100)} respecto al anterior`:`▼ ${formatScore(Math.round(-last*100)/100)} respecto al anterior`}</small></div>}
  </section>
  <StartExamButtons onStart={onStart}/>
  <div className="topicOrderRow"><span>Registro</span><div className="choiceRow"><button className={kind==="all"?"selected":""} onClick={()=>setKind("all")}>Todos</button><button className={kind==="100"?"selected":""} onClick={()=>setKind("100")}>De 100</button><button className={kind==="60"?"selected":""} onClick={()=>setKind("60")}>De 60</button></div></div>
  <div className="examHistoryList">{shown.map(({entry,score})=><ExamRow key={entry.id} entry={entry} score={score} onReview={onReview} onDelete={onDelete}/>)}</div>
  <p className="examNote">Se guardan tus {EXAM_HISTORY_LIMIT} últimos simulacros y se sincronizan con tu cuenta.{rows.some(row=>row.entry.recovered)?" Los marcados como «recuperado» son de antes de que existiera este registro: se han reconstruido con tu progreso (preguntas respondidas y si las acertaste).":""}</p>
 </div>;
}
// En Repaso: los 3 últimos y acceso al registro completo
function ExamHistory({history,progress,deleted,onReview,go}){
 const rows=useMemo(()=>examRows(history,progress,deleted).slice(0,3),[history,progress,deleted]);
 return <div className="reviewSetup examHistory">
  <span className="reviewSetupLabel"><Trophy/> Mis simulacros</span>
  {!rows.length&&<p className="examNote">Aún no tienes ninguno guardado. Cada examen que termines (de 100 o de 60) se guarda aquí con su nota para revisarlo otro día.</p>}
  {rows.map(({entry,score})=><ExamRow key={entry.id} entry={entry} score={score} onReview={onReview}/>)}
  {rows.length>0&&<button type="button" className="secondary" onClick={()=>go("exams")}>Ver todos mis simulacros <ChevronRight/></button>}
 </div>;
}
const EXAM_HISTORY_LIMIT=40;

function ReviewPage({go,onStart,onResumeExam,onNumbers,onReviewExam,examHistory,examDeleted,progress}){
 const [count,setCount]=useState(20);
 const [savedExam,setSavedExam]=useState(()=>loadResumableExam());
 const totalAvailable=useMemo(()=>getAllQuestions().length,[activeScopeKey]);
 if(!totalAvailable) return <div><div className="reviewHero"><h2>Tu zona de repaso</h2><p>El repaso se activará cuando haya preguntas cargadas en los temas.</p><button className="primary" onClick={()=>go("test")}>Empezar un test</button></div></div>;
 const isExam=count>=SIMULACRUM_MIN;
 return <div className="reviewPage">
  <div className="reviewHero"><h2>Repaso general</h2><p>Test que mezcla preguntas de los {topics.length} temas para practicar un repaso real, como en el examen.</p></div>
  <ExamHistory history={examHistory} progress={progress} deleted={examDeleted} onReview={onReviewExam} go={go}/>
  {savedExam&&<div className="resumeTestBanner" role="status"><div><b>{savedExam.deadline>Date.now()?"Tienes un simulacro en curso":"Tu simulacro se quedó sin tiempo"}</b><small>{Object.keys(savedExam.answers).length} de {savedExam.questions.length} respondidas · {savedExam.deadline>Date.now()?`quedan ${formatClock(savedExam.deadline-Date.now())}`:"se entregará con lo que respondiste"}</small></div><div className="resumeTestActions"><button className="primary" type="button" onClick={onResumeExam}><Play/> {savedExam.deadline>Date.now()?"Continuar":"Ver nota"}</button><button className="secondary" type="button" onClick={()=>{clearExamSession();setSavedExam(null)}}>Descartar</button></div></div>}
  <div className="reviewSetup">
   <span className="reviewSetupLabel">Repaso rápido</span>
   <div className="reviewCountRow">{[10,20,30,50].map(value=><button key={value} type="button" className={count===value?"selected":""} onClick={()=>setCount(value)}>{value}</button>)}</div>
   <span className="reviewSetupLabel">Simulacro de examen</span>
   <div className="reviewCountRow examRow">{[60,100].map(value=><button key={value} type="button" className={count===value?"selected":""} onClick={()=>setCount(value)}><Trophy/>{value}</button>)}</div>
   {isExam&&<p className="examNote">Las preguntas se reparten entre los {topics.length} temas según el peso de cada uno en el banco.<> <b>Modo examen real:</b> {count===EXAM_COUNT?"1 h 30 min":"54 min (el mismo ritmo que el de 100)"}, sin soluciones hasta entregar y cada 4 fallos restan 1 acierto (las en blanco no restan).</></p>}
   <button className="primary" type="button" onClick={()=>onStart(count)}>{count===EXAM_COUNT?"Empezar examen de 100 · 1 h 30 min":isExam?`Empezar examen de ${count} · 54 min`:"Empezar repaso aleatorio"}</button>
  </div>
  <NumbersCard onStart={onNumbers}/>
  <button type="button" className="homeQuickAction cheat reviewCheat" onClick={()=>go("cheatsheet")}><span className="homeQuickIcon"><ScrollText/></span><div><b>Chuleta de fallos</b><small>Repasa en pocos minutos las claves de lo que has fallado</small></div><ChevronRight/></button>
 </div>;
}

function WrongPage({progress,onStart,onMarkLearned,go}){
 const failedQuestions=getFailedQuestions(progress);
 const failedCount=failedQuestions.length;
 if(!failedCount) return <div><div className="reviewHero"><h2>Preguntas falladas</h2><p>Aquí aparecerán las preguntas que respondas incorrectamente.</p><button className="primary" onClick={()=>go("test")}>Empezar un test</button></div></div>;
 return <div className="wrongPage"><div className="reviewHero"><h2>Preguntas falladas</h2><p>Tienes {failedCount} {failedCount===1?"pregunta pendiente":"preguntas pendientes"}. Pulsa una pregunta para practicarla o haz el test completo.</p><button className="primary" onClick={()=>onStart()}>Hacer todas las falladas</button></div><div className="wrongQuestionList">{failedQuestions.map(question=>{const id=getQuestionIdForProgress(question);const state=progress[id];return <article className="wrongQuestion" key={id}><button className="wrongQuestionBody" onClick={()=>onStart([id])}><div className="wrongQuestionMeta"><span className="badge">Tema {String(question.topicId).padStart(2,"0")}</span><span>{state?.vecesFallada??1} {(state?.vecesFallada??1)===1?"fallo":"fallos"}</span></div><h3>{question.question}</h3><small className="wrongPracticeHint"><Play/> Practicar esta pregunta</small></button><button className="markLearnedButton" onClick={()=>onMarkLearned(question)} title="Quitar de preguntas falladas"><CheckCircle2/> Marcar como aprendida</button></article>})}</div></div>;
}

// Texto de una aclaración: respeta párrafos y listas, las **negritas** y las *cursivas* (como las copia Claude).
const formatNoteInline=text=>String(text).split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|`[^`]+`)/g).filter(Boolean).map((part,index)=>{
 if(/^(\*\*|__).+\1$/.test(part)) return <strong key={index}>{part.slice(2,-2)}</strong>;
 if(/^\*.+\*$/.test(part)) return <em key={index}>{part.slice(1,-1)}</em>;
 if(/^`.+`$/.test(part)) return <code key={index}>{part.slice(1,-1)}</code>;
 return part;
});
function NoteText({text}){
 const blocks=[];
 String(text).split("\n").forEach(line=>{
  const item=line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)/);
  const clean=line.replace(/^\s*#{1,6}\s*/,"");
  if(item){const last=blocks[blocks.length-1];if(last?.type==="list")last.items.push(item[1]);else blocks.push({type:"list",items:[item[1]]});}
  else if(clean.trim()) blocks.push({type:"p",text:clean});
 });
 return <div className="noteText">{blocks.map((block,index)=>block.type==="list"?<ul key={index}>{block.items.map((entry,k)=><li key={k}>{formatNoteInline(entry)}</li>)}</ul>:<p key={index}>{formatNoteInline(block.text)}</p>)}</div>;
}

// Aclaración propia de una pregunta: se ve, se edita o se borra debajo de la explicación.
function NoteEditor({question,note,onSave}){
 const [editing,setEditing]=useState(false);
 const [draft,setDraft]=useState(note?.text??"");
 const [pasteFailed,setPasteFailed]=useState(false);
 const start=()=>{setDraft(note?.text??"");setEditing(true)};
 const paste=async()=>{try{const text=await navigator.clipboard.readText();if(text)setDraft(current=>current.trim()?`${current}\n\n${text}`:text);else setPasteFailed(true)}catch{setPasteFailed(true)}};
 const save=()=>{onSave?.(question,draft);setEditing(false)};
 if(editing) return <div className="noteBox editing">
  <label className="noteLabel" htmlFor={`note-${getQuestionIdForProgress(question)}`}><NotebookPen/> Tu aclaración</label>
  <textarea id={`note-${getQuestionIdForProgress(question)}`} value={draft} onChange={e=>setDraft(e.target.value)} rows={5} placeholder="Pega aquí la respuesta de Claude o escribe tu propia nota…" autoFocus/>
  {pasteFailed&&<small className="noteHint">No se pudo pegar automáticamente: mantén pulsado el cuadro y elige «Pegar».</small>}
  <div className="noteActions"><button type="button" className="secondary" onClick={paste}><ClipboardPaste/> Pegar</button><button type="button" className="secondary" onClick={()=>setEditing(false)}>Cancelar</button><button type="button" className="primary" onClick={save} disabled={!draft.trim()&&!note}>{!draft.trim()&&note?"Borrar":"Guardar"}</button></div>
 </div>;
 if(!note) return <button type="button" className="noteAdd" onClick={start}><NotebookPen/> Guardar aclaración</button>;
 return <div className="noteBox">
  <div className="noteHead"><span className="noteLabel"><NotebookPen/> Tu aclaración</span><button type="button" onClick={start} aria-label="Editar aclaración"><Pencil/></button><button type="button" onClick={()=>{if(window.confirm("¿Borrar esta aclaración?"))onSave?.(question,"")}} aria-label="Borrar aclaración"><Trash2/></button></div>
  <NoteText text={note.text}/>
 </div>;
}

function NotesPage({notes,onSaveNote,onStart,go}){
 const [query,setQuery]=useState("");
 const [copiedTopic,setCopiedTopic]=useState(null);
 const entries=useMemo(()=>{const byId=new Map(getAllQuestions(true).map(question=>[getQuestionIdForProgress(question),question]));return Object.entries(notes).map(([id,note])=>({id,note,question:byId.get(id)})).filter(entry=>entry.question)},[notes]);
 if(!entries.length) return <div><div className="reviewHero"><NotebookPen/><h2>Tus aclaraciones</h2><p>Después de responder una pregunta, toca «Guardar aclaración» para pegar lo que te explique Claude o escribir tu propia nota. Aparecerán aquí, ordenadas por tema.</p><button className="primary" onClick={()=>go("test")}>Hacer un test</button></div></div>;
 const needle=query.trim().toLocaleLowerCase("es");
 const visible=needle?entries.filter(({note,question})=>[note.text,question.question,question.answers[question.correctAnswer]].join(" ").toLocaleLowerCase("es").includes(needle)):entries;
 const groups=topics.map(topic=>({topic,items:visible.filter(entry=>entry.question.topicId===topic.id).sort((a,b)=>b.note.updatedAt-a.note.updatedAt)})).filter(group=>group.items.length);
 // texto listo para pasármelo y que lo incorpore a los resúmenes
 const copyTopic=group=>{const text=[`Aclaraciones · Tema ${group.topic.id} · ${group.topic.title}`,"",...group.items.flatMap(({note,question})=>[`Pregunta: ${question.question}`,`Correcta: ${question.answers[question.correctAnswer]}`,`Aclaración: ${note.text}`,""])].join("\n");try{navigator.clipboard?.writeText(text).then(()=>{setCopiedTopic(group.topic.id);setTimeout(()=>setCopiedTopic(null),2500)},()=>{})}catch{}};
 return <div className="notesPage">
  <div className="notesTop">
   <div><span className="eyebrow">TU CUADERNO</span><h2>{entries.length} {entries.length===1?"aclaración":"aclaraciones"}</h2></div>
   <button className="primary" type="button" onClick={()=>onStart(entries.map(entry=>entry.id))}><Play/> Test con todas</button>
  </div>
  <label className="search notesSearch"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar en tus aclaraciones…" aria-label="Buscar en tus aclaraciones"/></label>
  {!groups.length&&<p className="notesEmpty">No hay aclaraciones que coincidan con «{query}».</p>}
  {groups.map(group=><section key={group.topic.id} className="notesGroup">
   <div className="notesGroupHead"><span className="num">{String(group.topic.id).padStart(2,"0")}</span><b>{group.topic.title}</b><button type="button" className="notesMini" onClick={()=>copyTopic(group)} title="Copiar para enviarlas y añadirlas al resumen"><Copy/>{copiedTopic===group.topic.id?"Copiadas":"Copiar"}</button><button type="button" className="notesMini" onClick={()=>onStart(group.items.map(entry=>entry.id))}><Play/>Test</button></div>
   {group.items.map(({id,note,question})=><article key={id} className="noteCard">
    <h3>{question.question}</h3>
    <p className="noteAnswer"><CheckCircle2/> {question.answers[question.correctAnswer]}</p>
    <NoteEditor key={note.updatedAt} question={question} note={note} onSave={onSaveNote}/>
   </article>)}
  </section>)}
 </div>;
}

function FavoritesPage({favorites,onToggleFavorite,go}){const questions=getFavoriteQuestions(favorites);if(!questions.length)return <div><div className="reviewHero"><Star/><h2>Tus preguntas favoritas</h2><p>Las preguntas que marques como favoritas aparecerán aquí.</p><button className="primary" onClick={()=>go("test")}>Explorar preguntas</button></div></div>;return <div className="favoritesPage"><div className="pageIntro"><div><span className="eyebrow">GUARDADAS</span><h2>Tus preguntas favoritas</h2><p>{questions.length} {questions.length===1?"pregunta guardada":"preguntas guardadas"}</p></div></div><div className="favoriteQuestionList">{questions.map(question=><article className="favoriteQuestion" key={getQuestionIdForProgress(question)}><div><span className="badge">Tema {String(question.topicId).padStart(2,"0")}</span><h3>{question.question}</h3></div><button className="favoriteRemove" onClick={()=>onToggleFavorite(question)} title="Quitar de favoritos"><Star fill="currentColor"/></button></article>)}</div></div>}

// Resumen global de progreso (arriba de la página de Test)
function ProgressOverview({progress}){
 const available=topics.map(topic=>{const questions=getQuestionBank(topic.id);return {total:questions.length,...getTopicProgress(questions,progress,topic.id)}}).filter(topic=>topic.total>0);
 const totalQuestions=available.reduce((total,topic)=>total+topic.total,0);
 const answered=available.reduce((total,topic)=>total+topic.answered,0);
 const attempts=available.reduce((total,topic)=>total+topic.attempts,0);
 const correct=available.reduce((total,topic)=>total+topic.correct,0);
 const globalMastery=totalQuestions?Math.round(available.reduce((total,topic)=>total+topic.mastery*topic.total,0)/totalQuestions):0;
 const failed=getFailedQuestions(progress).length;
 return <section className="testOverview" aria-label="Tu progreso">
  <div className="testOverviewMain"><span className="eyebrow">DOMINIO GLOBAL</span><strong>{globalMastery}%</strong><i><em style={{width:`${globalMastery}%`}}/></i></div>
  <div className="testOverviewStats"><div><b>{answered.toLocaleString("es-ES")}</b><small>de {totalQuestions.toLocaleString("es-ES")} vistas</small></div><div><b>{attempts?Math.round(correct/attempts*100):0}%</b><small>aciertos</small></div><div><b>{failed}</b><small>falladas</small></div></div>
 </section>;
}

// Temas con su progreso: dominio, preguntas vistas, aciertos y falladas pendientes
function TopicsProgressGrid({progress,order,onOrder,onPick}){
 const list=topics.map(topic=>{const questions=getQuestionBank(topic.id);const stats=getTopicProgress(questions,progress,topic.id);const failed=questions.filter(question=>isQuestionCurrentlyFailed(progress[getQuestionIdForProgress({...question,topicId:topic.id})])).length;return {...topic,total:questions.length,failed,...stats}});
 const sorted=order==="weak"?[...list].filter(topic=>topic.total).sort((a,b)=>a.mastery-b.mastery||a.answered/a.total-b.answered/b.total):list;
 return <>
  <div className="topicOrderRow"><span>Temas</span><div className="choiceRow"><button className={order==="number"?"selected":""} onClick={()=>onOrder("number")}>Por número</button><button className={order==="weak"?"selected":""} onClick={()=>onOrder("weak")}>Peor dominio primero</button></div></div>
  <div className="testTopicsGrid">{sorted.map(topic=><button key={topic.id} className="topicSelectCard" onClick={()=>onPick(topic.id)}><span className="badge">Tema {String(topic.id).padStart(2,"0")}</span><h3>{topic.title}</h3>{!topic.total?<small>Sin preguntas cargadas</small>:<>
   <div className="topicStats"><span><b>{topic.answered}</b>/{topic.total.toLocaleString("es-ES")} vistas</span>{topic.attempts>0&&<span><b>{Math.round(topic.correct/topic.attempts*100)}%</b> aciertos</span>}{topic.failed>0&&<span className="failed"><b>{topic.failed}</b> {topic.failed===1?"fallada":"falladas"}</span>}</div>
   <div className="topicMastery"><div><span>Dominio</span><b>{topic.mastery}%</b></div><i><em style={{width:`${topic.mastery}%`}}/></i></div></>}</button>)}</div>
 </>;
}

function ProgressPage({progress,confidence={},onStart}){
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
  <ConfidenceCard log={confidence}/>
  <section className="progressTopics" aria-labelledby="topic-progress-title"><div className="progressSectionTitle"><div><span className="eyebrow">POR TEMA</span><h2 id="topic-progress-title">Tu avance</h2></div><small>{answered} de {totalQuestions.toLocaleString("es-ES")} preguntas practicadas</small></div><div className="progressTopicList">{topicProgress.map(topic=><article className="progressTopic" key={topic.id}><span className="progressTopicNumber">{String(topic.id).padStart(2,"0")}</span><div className="progressTopicBody"><div className="progressTopicHeading"><div><h3>{topic.title}</h3><small>{topic.total?`${topic.answered} de ${topic.total.toLocaleString("es-ES")} preguntas · ${topic.attempts?Math.round(topic.correct/topic.attempts*100):0}% aciertos`:"Banco pendiente"}</small></div><strong>{topic.mastery}%</strong></div><div className="progressTrack" role="progressbar" aria-label={`Dominio de ${topic.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={topic.mastery}><i style={{width:`${topic.mastery}%`}}/></div></div>{topic.total>0&&<button className="progressPractice" onClick={()=>onStart(topic.id)} title={`Practicar ${topic.title}`}><ChevronRight/></button>}</article>)}</div></section>
 </div>
}

function SettingsPage({sync,userData,onRestore,onThemeChange,onExamScope}){
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
  {Object.keys(examScopes).map(topicId=><ExamScopeSwitch key={topicId} className="settingsCard scopeSetting" topicId={topicId} scopes={userData.examScopes} onChange={onExamScope}/>)}
  <SyncCard sync={sync}/>
  <StorageCard/>
  <section className="settingsCard"><div className="settingsCardText"><h3>Copia de seguridad</h3><p>Incluye tu dominio por tema, respuestas, preguntas falladas y favoritas.</p><div className="backupSummary"><span><b>{progressCount}</b> preguntas con actividad</span><span><b>{favoritesCount}</b> favoritas</span></div></div><div className="settingsActions"><button className="primary" onClick={exportBackup}><Download/> Descargar copia</button><button className="secondary" onClick={()=>importInput.current?.click()}><Upload/> Restaurar copia</button><input ref={importInput} className="backupFileInput" type="file" accept="application/json,.json" onChange={importBackup}/></div></section>
  {message&&<div className={`backupMessage ${message.type}`} role="status">{message.text}</div>}
  <section className="settingsNotice"><h3>Dónde guardarla</h3><p>En iPhone, elige <b>Guardar en Archivos</b> y selecciona iCloud Drive. La copia contiene datos de estudio, pero no contraseñas ni información bancaria.</p></section>
 </div>
}

// Sincronización automática con la nube (con tu cuenta): al abrir, al volver a la app,
// al recuperar la conexión y unos segundos después de cada cambio. Une los datos, nunca los sustituye.
function useSync(userData,setUserData){
 const [settings,setSettings]=useState(()=>loadSyncSettings());
 const [status,setStatus]=useState(settings?"idle":"off");
 const dataRef=useRef(userData);
 const runningRef=useRef(false);
 const pendingRef=useRef(false);
 dataRef.current=userData;

 const syncNow=async(account=settings)=>{
  if(!account?.token) return;
  if(runningRef.current){pendingRef.current=true;return;}
  runningRef.current=true;
  setStatus("syncing");
  try{
   const record=await pushSync(account.token,dataRef.current);
   const remoteSignature=syncFingerprint(record.data);
   setUserData(local=>{
    const merged=mergeUserData(local,record.data);
    return syncSignature(merged)===syncSignature(local)?local:{...merged,theme:local.theme};
   });
   const next={...account,lastSyncAt:Date.now(),lastSignature:remoteSignature};
   saveSyncSettings(next);setSettings(next);setStatus("ok");
  }catch(error){
   // la sesión ya no es válida (p. ej. se cerró desde otro sitio): hay que volver a entrar
   if(error?.kind==="unauthorized"){saveSyncSettings(null);setSettings(null);setStatus("expired");}
   else setStatus(error?.kind==="offline"||!navigator.onLine?"offline":error?.kind==="not-configured"?"not-configured":"error");
  }finally{
   runningRef.current=false;
   if(pendingRef.current){pendingRef.current=false;setTimeout(()=>syncNow(),500);}
  }
 };

 // tras cada cambio local (espera 3 s para agrupar varias respuestas seguidas)
 useEffect(()=>{
  if(!settings?.token) return;
  if(syncFingerprint(userData)===settings.lastSignature) return;
  const timer=setTimeout(()=>syncNow(),3000);
  return ()=>clearTimeout(timer);
 },[userData,settings?.token]);

 useEffect(()=>{
  if(!settings?.token) return;
  syncNow();
  const onVisible=()=>{if(document.visibilityState==="visible")syncNow()};
  const onOnline=()=>syncNow();
  document.addEventListener("visibilitychange",onVisible);
  window.addEventListener("online",onOnline);
  return()=>{document.removeEventListener("visibilitychange",onVisible);window.removeEventListener("online",onOnline)};
 },[settings?.token]);

 // crea la cuenta o entra; lanza SyncError con el motivo si no se puede
 const signIn=async(mode,user,password)=>{
  const result=await (mode==="register"?registerAccount:loginAccount)(user,password);
  const account={user:result.user,token:result.token,lastSyncAt:null,lastSignature:null};
  saveSyncSettings(account);setSettings(account);setStatus("idle");
 };
 const signOut=async()=>{const token=settings?.token;saveSyncSettings(null);setSettings(null);setStatus("off");if(token)await logoutAccount(token);};
 return {user:settings?.user??null,lastSyncAt:settings?.lastSyncAt??null,status,syncNow:()=>syncNow(),signIn,signOut};
}

const timeAgo=ms=>{if(!ms)return "todavía no";const minutes=Math.round((Date.now()-ms)/60000);if(minutes<1)return "hace un momento";if(minutes<60)return `hace ${minutes} min`;const hours=Math.round(minutes/60);if(hours<24)return `hace ${hours} h`;return new Date(ms).toLocaleDateString("es-ES",{day:"numeric",month:"short"});};

const accountErrors={
 "invalid-user":"El usuario debe tener entre 3 y 30 caracteres: letras sin tilde, números, punto, guion o guion bajo.",
 "weak-password":`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`,
 "user-taken":"Ese usuario ya existe. Si es tuyo, pulsa «Iniciar sesión».",
 "bad-credentials":"Usuario o contraseña incorrectos.",
 "too-many":"Demasiados intentos fallidos. Espera 15 minutos y vuelve a probar.",
 "offline":"Sin conexión a internet. Inténtalo cuando tengas conexión.",
 "not-configured":"Falta conectar la base de datos en Vercel (Storage).",
};

function SyncCard({sync}){
 const [mode,setMode]=useState(null);
 const [user,setUser]=useState("");
 const [password,setPassword]=useState("");
 const [showPassword,setShowPassword]=useState(false);
 const [error,setError]=useState(null);
 const [busy,setBusy]=useState(false);
 const [,tick]=useState(0);
 useEffect(()=>{const timer=setInterval(()=>tick(n=>n+1),30000);return()=>clearInterval(timer)},[]);

 const submit=async e=>{
  e.preventDefault();
  const name=user.trim().toLowerCase();
  if(!USER_PATTERN.test(name)){setError(accountErrors["invalid-user"]);return;}
  if(mode==="register"&&password.length<MIN_PASSWORD){setError(accountErrors["weak-password"]);return;}
  setBusy(true);setError(null);
  try{await sync.signIn(mode,name,password);setMode(null);setPassword("");}
  catch(err){
   const base=accountErrors[err?.kind]??"No se pudo completar. Vuelve a intentarlo.";
   setError(err?.kind==="not-configured"&&err.detail?`${base} ${err.detail.length?`Variables que ve Vercel: ${err.detail.join(", ")}.`:"Vercel no ve ninguna variable de base de datos: conéctala al proyecto y haz Redeploy."}`:base);
  }
  finally{setBusy(false);}
 };

 if(!sync.user) return <section className="settingsCard syncCard">
  <div className="settingsCardText"><h3><UserRound/> Tu cuenta</h3><p>Entra con tu usuario en el móvil y en el iPad para estudiar con el mismo progreso, favoritos y aclaraciones. Se unen automáticamente: no se pierde lo que hagas en cada uno.</p>
   {sync.status==="expired"&&<p className="syncStatus error"><CloudOff/>Tu sesión se cerró. Vuelve a iniciar sesión.</p>}
   {mode&&<form className="accountForm" onSubmit={submit}>
    <b className="accountTitle">{mode==="register"?"Crear cuenta":"Iniciar sesión"}</b>
    <label>Usuario<input value={user} onChange={e=>{setUser(e.target.value);setError(null)}} autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="p. ej. alana" autoFocus/></label>
    <label>Contraseña<span className="pwWrap"><input type={showPassword?"text":"password"} value={password} onChange={e=>{setPassword(e.target.value);setError(null)}} autoComplete={mode==="register"?"new-password":"current-password"} placeholder={mode==="register"?`Mínimo ${MIN_PASSWORD} caracteres`:""}/><button type="button" className="pwToggle" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Ocultar contraseña":"Mostrar contraseña"}>{showPassword?<EyeOff/>:<Eye/>}</button></span></label>
    {mode==="register"&&<small className="syncHint">No hay recuperación por email: apunta la contraseña o deja que el iPhone la guarde. Si la olvidas, tu progreso sigue en tus dispositivos y puedes crear otra cuenta.</small>}
    {error&&<small className="syncError" role="alert">{error}</small>}
    <div className="accountActions"><button className="secondary" type="button" onClick={()=>{setMode(null);setError(null)}}>Cancelar</button><button className="primary" type="submit" disabled={busy}>{busy?"Un momento…":mode==="register"?"Crear cuenta":"Entrar"}</button></div>
   </form>}
  </div>
  {!mode&&<div className="settingsActions"><button className="primary" type="button" onClick={()=>{setMode("register");setError(null)}}><UserRound/> Crear cuenta</button><button className="secondary" type="button" onClick={()=>{setMode("login");setError(null)}}><LogIn/> Iniciar sesión</button></div>}
 </section>;

 const statusText={idle:"Preparando…",syncing:"Sincronizando…",ok:`Sincronizado ${timeAgo(sync.lastSyncAt)}`,offline:"Sin conexión: se sincronizará al volver a tener internet",error:"No se pudo sincronizar. Se volverá a intentar.",["not-configured"]:accountErrors["not-configured"]}[sync.status];
 return <section className="settingsCard syncCard on">
  <div className="settingsCardText"><h3><UserRound/> Tu cuenta</h3><p>Sesión iniciada como <b>{sync.user}</b>. En el otro dispositivo, entra en Configuración → <b>Iniciar sesión</b> con el mismo usuario.</p>
   <p className={`syncStatus ${sync.status}`}>{sync.status==="offline"||sync.status==="error"||sync.status==="not-configured"?<CloudOff/>:<Cloud/>}{statusText}</p>
  </div>
  <div className="settingsActions"><button className="primary" type="button" onClick={sync.syncNow} disabled={sync.status==="syncing"}><RefreshCw/> Sincronizar ahora</button><button className="secondary" type="button" onClick={()=>{if(window.confirm("¿Cerrar sesión en este dispositivo? Tu progreso se queda guardado aquí y en tu cuenta."))sync.signOut()}}><LogOut/> Cerrar sesión</button></div>
 </section>;
}

// Qué ocupa espacio en este dispositivo (lo que la página guarda en el navegador).
// El navegador guarda el texto en UTF-16: cada carácter son 2 bytes. Safari deja unos 5 MB por web.
const BROWSER_LIMIT=5*1024*1024;
const formatBytes=bytes=>bytes<1024?`${bytes} B`:bytes<1024*1024?`${(bytes/1024).toLocaleString("es-ES",{maximumFractionDigits:bytes<10240?1:0})} KB`:`${(bytes/1024/1024).toLocaleString("es-ES",{maximumFractionDigits:2})} MB`;
const readStorageUsage=()=>{
 const size=text=>(text?.length??0)*2;
 const rows=[];
 try{
  const raw=localStorage.getItem("labquiz.learning.v2");
  let main={};try{main=JSON.parse(raw||"{}")}catch{}
  const part=(...keys)=>size(JSON.stringify(Object.fromEntries(keys.filter(key=>main[key]!=null).map(key=>[key,main[key]]))));
  const progress=part("progress","progressFormat"),notes=part("notes","noteDeletions"),favorites=part("favorites","favoriteChanges");
  rows.push({label:"Tu progreso",detail:`${Object.keys(main.progress??{}).length.toLocaleString("es-ES")} preguntas practicadas`,bytes:progress});
  rows.push({label:"Aclaraciones",detail:`${Object.keys(main.notes??{}).length} guardadas`,bytes:notes});
  rows.push({label:"Favoritos",detail:`${(main.favorites??[]).length} preguntas`,bytes:favorites});
  const exams=part("examHistory","examHistoryDeleted");
  rows.push({label:"Simulacros guardados",detail:`${(main.examHistory??[]).length} para revisar`,bytes:exams});
  rows.push({label:"Ajustes y contadores",detail:"modo noche, plan, seguridad al responder",bytes:Math.max(0,size(raw)-progress-notes-favorites-exams)});
  const known={"labquiz.account.v1":["Sesión de tu cuenta","usuario y última sincronización"],"labquiz.test-session.v1":["Test a medias","para poder continuarlo"],"labquiz.exam-session.v1":["Simulacro a medias","para poder continuarlo"],"labquiz.exam-history.v1":["Simulacros entregados","los últimos, para revisarlos"]};
  let others=0;
  for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key==="labquiz.learning.v2")continue;const bytes=size(key)+size(localStorage.getItem(key));if(known[key])rows.push({label:known[key][0],detail:known[key][1],bytes});else others+=bytes;}
  if(others)rows.push({label:"Otros restos",detail:"datos sueltos de versiones anteriores",bytes:others});
 }catch{}
 return rows.sort((a,b)=>b.bytes-a.bytes);
};
function StorageCard(){
 const [rows,setRows]=useState(()=>readStorageUsage());
 const refresh=()=>setRows(readStorageUsage());
 const total=rows.reduce((sum,row)=>sum+row.bytes,0);
 const percent=Math.min(100,total/BROWSER_LIMIT*100);
 return <section className="settingsCard storageCard">
  <div className="settingsCardText"><h3><HardDrive/> Espacio en este dispositivo</h3><p>Lo que la página guarda en el navegador. Las preguntas y los resúmenes no cuentan: vienen con la página.</p>
   <div className="storageTotal"><b>{formatBytes(total)}</b><span>de unos 5 MB disponibles · {percent<1?"menos del 1":Math.round(percent)} %</span></div>
   <i className="storageBar"><em style={{width:`${Math.max(percent,1)}%`}}/></i>
   <ul className="storageList">{rows.map(row=><li key={row.label}><span><b>{row.label}</b><small>{row.detail}</small></span><em>{formatBytes(row.bytes)}</em></li>)}</ul>
  </div>
  <div className="settingsActions"><button className="secondary" type="button" onClick={refresh}><RefreshCw/> Actualizar</button></div>
 </section>;
}

function SimulacrumPage({go}){return <div><section className="simHero"><Trophy/><h2>Simulacro de oposición</h2><p>El simulacro estará disponible cuando haya preguntas cargadas.</p><button className="secondary" onClick={()=>go("test")}>Ver temas disponibles</button></section></div>}

createRoot(document.getElementById("root")).render(<App/>);
