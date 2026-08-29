import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {Home,BookOpen,Brain,RotateCcw,BarChart3,Trophy,Search,ChevronRight,Clock3,CheckCircle2,AlertCircle,Star,FlaskConical,Menu,X,ArrowLeft,FileText,LayoutGrid,Target,CircleX,History,Play} from "lucide-react";
import "./styles.css";

import questionBank from "./questions";
import {parsePdfQuestions} from "./pdfPipeline.js";
import {getQuestionIdForProgress,isQuestionCurrentlyFailed,recordQuestionAnswer,selectQuestionsByMode,shuffleQuestionOptions} from "./smartQuestionSelector.js";

const pdfFiles=import.meta.glob("/pdfs/*.pdf",{query:"?url",import:"default",eager:true});

const topics=[
 {id:1,title:"Conceptos básicos"}, {id:2,title:"Líquidos biológicos"},
 {id:3,title:"Análisis urinario y función renal"}, {id:4,title:"Función digestiva"},
 {id:5,title:"Función hepática y proteínas"}, {id:6,title:"Enzimas"},
 {id:7,title:"Técnicas Instrumentales"}, {id:8,title:"Hematología"},
 {id:9,title:"Coagulación"}, {id:10,title:"Banco de sangre"},
 {id:11,title:"Inmunología"}, {id:12,title:"Serología"},
 {id:13,title:"Bacteriología"}, {id:14,title:"Parásitos, hongos y virus"},
 {id:15,title:"Equilibrio ácido-base e iones"}, {id:16,title:"Metabolismo lipídico"},
 {id:17,title:"Metabolismo hidratos de carbono"}, {id:18,title:"Hormonas"},
 {id:19,title:"Genética"}, {id:20,title:"Reproducción y cribados"},
    {id:21,title:"Drogas de abuso y Fármacos"}, {id:22,title:"Marcadores tumorales"},
    {id:23,title:"Técnicas de laboratorio"}
];

const getTopicKey=id=>`tema-${String(id).padStart(2,"0")}`;
// distintos temas reutilizan los mismos ids numéricos; etiquetar con topicId evita que se mezclen
const getQuestionBank=id=>(questionBank[getTopicKey(id)] ?? []).map(question=>question.topicId!=null?question:{...question,topicId:id});
const STORAGE_KEY="labquiz.learning.v2";
const TEST_SESSION_KEY="labquiz.test-session.v1";
const EMPTY_USER_DATA={tests:0,answered:0,correct:0,incorrect:0,favorites:[],history:[],progress:{},streak:0};
const loadUserData=()=>{try{return {...EMPTY_USER_DATA,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}}catch{return EMPTY_USER_DATA}};
const loadSavedTest=()=>{try{return JSON.parse(localStorage.getItem(TEST_SESSION_KEY)||"null")}catch{return null}};
const saveTestSession=session=>{try{localStorage.setItem(TEST_SESSION_KEY,JSON.stringify(session))}catch(error){console.error("No se pudo guardar el test en curso",error)}};
const clearTestSession=()=>{try{localStorage.removeItem(TEST_SESSION_KEY)}catch(error){console.error("No se pudo limpiar el test en curso",error)}};
const getPdfUrl=id=>Object.entries(pdfFiles).find(([path])=>new RegExp(`(?:tema|topic)[-_\\s]*${String(id).padStart(2,"0")}(?:\\D|$)` ,"i").test(path))?.[1]
    ?? Object.entries(pdfFiles).find(([path])=>new RegExp(`(?:tema|topic)[-_\\s]*${id}(?:\\D|$)` ,"i").test(path))?.[1];

const getAnswerExplanation=question=>{const explanation=String(question.explanation||"").trim();if(explanation&&!explanation.includes("automáticamente por el resaltado"))return explanation;const correct=question.answers?.[question.correctAnswer]??"la opción marcada";return `La respuesta correcta es «${correct}», porque es la opción que corresponde al enunciado y al contenido evaluado en esta pregunta.`};
// una cifra decimal evita que unas pocas respuestas queden ocultas por el redondeo en bancos grandes
const computeMastery=(bank,progress)=>{if(!bank.length)return 0;const total=bank.reduce((sum,question,index)=>sum+(progress[getQuestionIdForProgress(question,index)]?.nivelDominio??0),0);return Math.round((total/(bank.length*5))*1000)/10};
const getTopicMastery=(topicId,progress)=>computeMastery(getQuestionBank(topicId),progress);
const getGlobalMastery=progress=>computeMastery(topics.flatMap(topic=>getQuestionBank(topic.id)),progress);

function App(){
 const [page,setPage]=useState("home"),[mobile,setMobile]=useState(false);
 const [testConfig,setTestConfig]=useState({count:30,mode:"smart",topicId:0});
 const [testEntry,setTestEntry]=useState(0);
 const [userData,setUserData]=useState(loadUserData);
 useEffect(()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(userData)),[userData]);
 const go=p=>{setPage(p);setMobile(false);window.scrollTo(0,0)};
 const openTopicPicker=()=>{clearTestSession();setTestConfig(prev=>({...prev,topicId:null}));setTestEntry(entry=>entry+1);go("test");};
 const startTest=config=>{clearTestSession();setTestConfig(config);setTestEntry(entry=>entry+1);go("test");};
 return <div className="app">
  <aside className={"sidebar "+(mobile?"open":"")}><div className="brand"><div className="logo">LQ</div><span>LabQuiz <b>2.0</b></span></div>
   <button className="close" onClick={()=>setMobile(false)}><X/></button>
    <nav className="nav">{[
    ["home","Inicio",Home],["test","Hacer test",Brain],["wrong","Falladas",CircleX],["review","Repaso",RotateCcw],["progress","Mi progreso",BarChart3]
   ].map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>go(id)}><Icon/><span>{label}</span></button>)}<button onClick={openTopicPicker}><LayoutGrid/><span>Test por tema</span></button></nav>
   <div className="sidecard"><FlaskConical/><strong>Tu preparación</strong><small>Construye tu dominio tema a tema.</small></div>
  </aside>
  <main><header className={page==="home"?"homeHeader":""}><button className="mobileMenu" onClick={()=>setMobile(true)}><Menu/></button><div><span className="eyebrow">OPOSICIONES · LABORATORIO</span><h1>{page==="home"?"Hola, Alana 👋":pageTitle(page)}</h1></div></header>
    {page==="home"&&<HomePage data={userData} onStart={startTest}/>}
    {page==="test"&&<TestPage key={testEntry} go={go} initialConfig={testConfig} questionProgress={userData.progress} onQuestionAnswered={next=>setUserData(prev=>({...prev,progress:next}))} onSessionComplete={result=>setUserData(prev=>({...prev,tests:prev.tests+1,answered:prev.answered+result.answered,correct:prev.correct+result.correct,incorrect:prev.incorrect+result.incorrect,history:[...prev.history,result]}))} />}
   {page==="review"&&<ReviewPage go={go}/>}
    {page==="progress"&&<ProgressPage data={userData}/>}
    {page==="wrong"&&<WrongPage data={userData} onStart={startTest} go={go}/>}
    {page==="favorites"&&<EmptyDataPage title="Favoritas" message="Aquí aparecerán las preguntas que marques como favoritas." go={go}/>}
    {page==="history"&&<HistoryPage data={userData} go={go}/>}
   {page==="simulacrum"&&<SimulacrumPage go={go}/>}
  </main>
 </div>
}
const pageTitle=p=>({test:"Test",review:"Modo repaso",progress:"Progreso",wrong:"Preguntas falladas",favorites:"Favoritas",history:"Historial",simulacrum:"Simulacro"}[p]);

const testModes=[
 ["smart","Test inteligente","Combina preguntas nuevas y repasos",Brain],
 ["failed","Preguntas falladas","Refuerza tus errores",CircleX],
 ["new","Preguntas nuevas","Avanza por el banco",FileText],
 ["review","Repaso","Practica lo pendiente",RotateCcw]
];

function HomePage({data,onStart}){const [count,setCount]=useState(30);const [mode,setMode]=useState("smart");const [topicId,setTopicId]=useState(0);return <div className="testHome">
 <section className="testLaunch"><span className="eyebrow">LABQUIZ</span><h2>Practica. Aprende. <em>Repite.</em></h2><p>Tests rápidos y enfocados para preparar tus oposiciones.</p><button className="launchButton" onClick={()=>onStart({count,mode})}><Play/> Hacer test</button></section>
 <section className="testSetup"><div className="setupGroup"><span>Número de preguntas</span><div className="choiceRow">{[10,20,30,50].map(value=><button className={count===value?"selected":""} key={value} onClick={()=>setCount(value)}>{value}</button>)}</div></div><div className="setupGroup"><span>Tipo de test</span><div className="modeGrid">{testModes.map(([id,label,description,Icon])=><button className={mode===id?"selected":""} key={id} onClick={()=>setMode(id)}><Icon/><span><b>{label}</b><small>{description}</small></span></button>)}</div></div><div className="setupGroup topicSetup"><label htmlFor="test-topic">Tema del test</label><select id="test-topic" value={topicId} onChange={event=>setTopicId(Number(event.target.value))}><option value={0}>Todos los temas</option>{topics.map(topic=><option value={topic.id} key={topic.id}>Tema {String(topic.id).padStart(2,"0")} · {topic.title}</option>)}</select></div></section>
 <section className="testHomeFooter"><span>{data.tests} tests realizados</span><button className="textBtn" onClick={()=>onStart({count,mode,topicId})}>Empezar con esta configuración <ChevronRight/></button></section>
 </div>}

function Stat({icon,value,label}){return <div className="stat"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function TopicRow({t,onClick}){return <button className="topicRow" onClick={onClick}><div className="num">{String(t.id).padStart(2,"0")}</div><div className="topicInfo"><b>{t.title}</b><small>Banco de preguntas</small></div></button>}

function SummaryPage({openTopic}){const [q,setQ]=useState("");const filtered=topics.filter(t=>t.title.toLowerCase().includes(q.toLowerCase()));return <div>
 <div className="pageIntro"><p>Selecciona un tema para consultar su contenido.</p><div className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar tema..."/></div></div>
 <div className="filterRow"><span>{topics.length} temas</span></div>
 <div className="resumeGrid">{filtered.map(t=><article className="resumeCard" key={t.id} onClick={()=>openTopic(t)}><div className="resumeTop"><span className="num">{String(t.id).padStart(2,"0")}</span></div><h3>{t.title}</h3><p>Contenido pendiente de añadir.</p><div className="resumeLinks"><span>Banco del tema</span><ChevronRight/></div></article>)}</div>
 </div>}

function TopicPage({topic,go}){return <div>
 <button className="back" onClick={()=>go("test")}><ArrowLeft/> Volver al test</button>
 <section className="topicHero"><div><span className="badge">TEMA {String(topic.id).padStart(2,"0")}</span><h2>{topic.title}</h2><p>Contenido pendiente de añadir.</p></div></section>
 <div className="topicLayout"><article className="studyCard"><h3>📌 Resumen esencial</h3><div className="placeholder"><h4>Lo imprescindible</h4><p>Aquí irá el contenido estructurado del tema. La plantilla está preparada para añadir el resumen, conceptos clave, valores, técnicas y puntos de examen sin cambiar el diseño.</p><ul><li>Conceptos fundamentales</li><li>Datos y valores que memorizar</li><li>Interpretación de resultados</li><li>Errores frecuentes en examen</li></ul></div><h3>⭐ Preguntas que debes dominar</h3><div className="questionStrip">Añade aquí las preguntas estrella del tema.</div><h3>🧠 Reglas mnemotécnicas</h3><div className="questionStrip">Espacio preparado para tus reglas y trucos de memoria.</div></article>
 <aside className="topicActions"><div className="card"><h3>¿Qué hacemos ahora?</h3><button className="action" onClick={()=>go("test")}><Brain/><div><b>Hacer test</b><small>Preguntas disponibles del tema</small></div><ChevronRight/></button><button className="action"><Star/><div><b>Marcar para repasar</b><small>Guardar este tema</small></div></button><button className="action" onClick={()=>go("review")}><RotateCcw/><div><b>Repasar errores</b><small>Solo preguntas falladas</small></div></button></div></aside></div>
 </div>}

function TestPage({go,initialConfig,questionProgress,onQuestionAnswered,onSessionComplete}){
 const [savedSession]=useState(loadSavedTest);
 const [selectedTopicId,setSelectedTopicId]=useState(savedSession?.selectedTopicId ?? initialConfig?.topicId??null);
 const [testConfig,setTestConfig]=useState(savedSession?.testConfig ?? (initialConfig||{count:30,mode:"smart",topicId:0}));
 const [i,setI]=useState(savedSession?.i ?? 0);
 const [score,setScore]=useState(savedSession?.score ?? 0);
 const [skippedCount,setSkippedCount]=useState(savedSession?.skippedCount ?? 0);
 const [selectedAnswer,setSelectedAnswer]=useState(savedSession?.selectedAnswer ?? null);
 const [showResult,setShowResult]=useState(Boolean(savedSession?.showResult));
 const [done,setDone]=useState(Boolean(savedSession?.done));
 const [loadedQuestions,setLoadedQuestions]=useState({});
 const [loading,setLoading]=useState(false);
 const [testQuestions,setTestQuestions]=useState(savedSession?.testQuestions ?? []);
 const [failedQuestions,setFailedQuestions]=useState(savedSession?.failedQuestions ?? []);
 const [restoredSession,setRestoredSession]=useState(Boolean(savedSession?.testQuestions?.length));
 const currentTopic=selectedTopicId===0?{id:0,title:"Todos los temas"}:selectedTopicId?topics.find(t=>t.id===selectedTopicId):null;
  const totalQuestions=testQuestions.length;
  const q=testQuestions[i] ?? null;
 const finishTest=(nextSkippedCount=skippedCount)=>{
   const answeredCount=Math.max(totalQuestions-nextSkippedCount,0);
   const finalCorrect=score;
   clearTestSession();
   onSessionComplete?.({topicId:selectedTopicId,topicIds:[...new Set(testQuestions.map(question=>question.topicId))],answered:answeredCount,correct:finalCorrect,incorrect:Math.max(answeredCount-finalCorrect,0),skipped:nextSkippedCount,percentage:answeredCount?Math.round(finalCorrect/answeredCount*100):0,questionIds:testQuestions.map(question=>getQuestionIdForProgress(question,0)),completedAt:new Date().toISOString()});
   setDone(true);
   setSelectedAnswer(null);
   setShowResult(false);
 };
 useEffect(()=>{
    if(testQuestions.length){
      saveTestSession({selectedTopicId,testConfig,i,score,skippedCount,selectedAnswer,showResult,done,testQuestions,failedQuestions});
      return;
    }
    if(selectedTopicId===null) return;
    const topicIds=selectedTopicId===0?topics.map(topic=>topic.id):[selectedTopicId];
    const missing=topicIds.filter(topicId=>!loadedQuestions[topicId]&&!getQuestionBank(topicId).length&&getPdfUrl(topicId));
    if(!missing.length){
      const available=topicIds.flatMap(topicId=>(loadedQuestions[topicId]??getQuestionBank(topicId)).map(question=>({...question,topicId,id:question.id??`${topicId}-${question.number}`})));
      setTestQuestions(selectQuestionsByMode(available,questionProgress,testConfig.count,testConfig.mode,selectedTopicId===0?null:selectedTopicId).map(question=>shuffleQuestionOptions(question)));
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(missing.map(topicId=>parsePdfQuestions(getPdfUrl(topicId)).then(questions=>[topicId,questions.map(question=>({...question,topicId,id:question.id??`${topicId}-${question.number}`}))])))
    .then(entries=>setLoadedQuestions(prev=>({...prev,...Object.fromEntries(entries)})))
     .catch(error=>console.error("No se pudo cargar el PDF del tema",error))
     .finally(()=>setLoading(false));
 },[selectedTopicId,loadedQuestions,testConfig,testQuestions,i,score,skippedCount,selectedAnswer,showResult,done,failedQuestions]);

 const resetSelection=()=>{
  clearTestSession();
  setRestoredSession(false);
  setSelectedTopicId(null);
  setI(0);
  setScore(0);
  setSkippedCount(0);
  setSelectedAnswer(null);
  setShowResult(false);
  setDone(false);
    setTestQuestions([]);
   setFailedQuestions([]);
 };

 const handleAnswer=(answerIndex)=>{
  if(!q || showResult) return;
  setSelectedAnswer(answerIndex);
  setShowResult(true);
  onQuestionAnswered?.(recordQuestionAnswer(q,questionProgress,answerIndex===q.correctAnswer));
  if(answerIndex===q.correctAnswer) setScore(prev=>prev+1);
  else setFailedQuestions(prev=>[...prev,q]);
 };

 const handleNext=()=>{
  if(i>=totalQuestions-1){
   finishTest();
   return;
  }
  setI(prev=>prev+1);
   setSelectedAnswer(null);
   setShowResult(false);
 };

 const handleSkip=()=>{
  if(!q || showResult) return;
  const nextSkippedCount=skippedCount+1;
  setSkippedCount(nextSkippedCount);
  if(i>=totalQuestions-1){
   finishTest(nextSkippedCount);
   return;
  }
  setI(prev=>prev+1);
 };

 if(selectedTopicId===null){
    const globalMastery=getGlobalMastery(questionProgress);
   return <div className="testThemeSelector"><div className="testMeta"><span>SELECCIÓN DE TEMA</span><b>{topics.length} temas</b></div><div className="testTopicsGrid"><button className="topicSelectCard" onClick={()=>{setSelectedTopicId(0);setI(0);setScore(0);setSkippedCount(0);setSelectedAnswer(null);setShowResult(false);setDone(false);}}><span className="badge">TEST GLOBAL</span><h3>Todos los temas</h3><small>Todos los bancos disponibles</small><div className="topicMastery"><div><span>Dominio global</span><b>{globalMastery}%</b></div><i><em style={{width:`${globalMastery}%`}}/></i></div></button>{topics.map(topic=>{const questionCount=getQuestionBank(topic.id).length;const available=questionCount||getPdfUrl(topic.id);const mastery=getTopicMastery(topic.id,questionProgress);return <button key={topic.id} className="topicSelectCard" onClick={()=>{setSelectedTopicId(topic.id);setI(0);setScore(0);setSkippedCount(0);setSelectedAnswer(null);setShowResult(false);setDone(false);}}><span className="badge">Tema {String(topic.id).padStart(2,"0")}</span><h3>{topic.title}</h3><small>{available?(questionCount?`${questionCount} preguntas`:"Preguntas disponibles"):"Próximamente"}</small>{available&&<div className="topicMastery"><div><span>Dominio</span><b>{mastery}%</b></div><i><em style={{width:`${mastery}%`}}/></i></div>}</button>})}</div></div>;
 }

 if(loading){
  return <div className="result card"><div className="resultIcon">📄</div><h2>Cargando preguntas</h2><p>Estamos leyendo el PDF del tema seleccionado.</p></div>;
 }

 if(!q){
  return <div className="result card"><div className="resultIcon">📘</div><h2>Este tema aún no tiene preguntas</h2><p>El banco de preguntas está preparado para añadirse desde archivos separados por tema.</p><button className="primary" onClick={resetSelection}>Volver a temas</button></div>;
 }

 if(done){
  const answeredCount=Math.max(totalQuestions-skippedCount,0);
  const accuracy=answeredCount?Math.round(score/answeredCount*100):0;
  return <div className="result card"><div className="resultIcon">🏆</div><h2>Test completado</h2><strong>{score}/{answeredCount||totalQuestions}</strong><p>{accuracy} %</p><p>✅ {score} aciertos · ❌ {Math.max(answeredCount-score,0)} fallos{skippedCount>0?` · ⏭ ${skippedCount} omitidas`:""}</p>{failedQuestions.length>0&&<button className="primary" onClick={()=>{setTestQuestions(failedQuestions);setI(0);setScore(0);setSkippedCount(0);setFailedQuestions([]);setDone(false)}}>Repasar fallos</button>}<button className="secondary" onClick={()=>{setI(0);setScore(0);setSkippedCount(0);setSelectedAnswer(null);setShowResult(false);setDone(false)}}>Repetir test</button><button className="secondary" onClick={resetSelection}>Cambiar test</button></div>;
 }

 return <div className="testWrap"><div className="testMeta"><span>{currentTopic.title.toUpperCase()}</span><b>{i+1} / {totalQuestions}</b></div><div className="progressLine"><i style={{width:((i+1)/totalQuestions*100)+"%"}}/></div><div className="testCard"><span className="badge">Tema {String(currentTopic.id).padStart(2,"0")}</span>{restoredSession&&<p className="testResumeHint">Has retomado tu test guardado.</p>}<h2>{q.question}</h2><div className="answers">{q.answers.map((answer,index)=><button key={answer+index} type="button" onClick={()=>handleAnswer(index)} disabled={showResult} className={showResult ? (index===q.correctAnswer ? "correct" : (selectedAnswer===index ? "incorrect" : "")) : (selectedAnswer===index ? "selected" : "")}><span>{String.fromCharCode(65+index)}</span>{answer}</button>)}</div>{showResult&&<div className="testFeedback"><p className={selectedAnswer===q.correctAnswer?"testStatus success":"testStatus error"}>{selectedAnswer===q.correctAnswer?"✅ Correcto":"❌ Incorrecto"}</p><p><strong>Respuesta correcta:</strong> {q.answers[q.correctAnswer]}</p><p><strong>Explicación:</strong> {getAnswerExplanation(q)}</p></div>}<div className="testActions">{showResult?<button className="primary" onClick={handleNext}>{i===totalQuestions-1?"Ver resultado":"Siguiente"}</button>:<button className="secondary" onClick={handleSkip}>{i===totalQuestions-1?"Terminar sin responder":"Siguiente sin responder"}</button>}<button className="secondary" onClick={resetSelection}>Cambiar test</button></div></div></div>;
}

function ReviewPage({go}){return <div><div className="reviewHero"><h2>Tu zona de repaso</h2><p>El repaso se activará cuando respondas tus primeras preguntas.</p><button className="primary" onClick={()=>go("test")}>Empezar un test</button></div></div>}

function ProgressPage({data}){const accuracy=data.answered?Math.round(data.correct/data.answered*100):0;return <div><div className="stats"><Stat icon="🎯" value={`${accuracy}%`} label="Aciertos"/><Stat icon="🧠" value={data.answered} label="Preguntas respondidas"/><Stat icon="✅" value={data.correct} label="Aciertos"/><Stat icon="❌" value={data.incorrect} label="Fallos"/></div><section className="section card"><h3>{data.tests?"Progreso por tema":"Sin datos de progreso"}</h3><p>{data.tests?"Tu avance se guarda automáticamente mientras haces tests y las estadísticas se resumen al completar cada uno.":"Tu progreso se guardará automáticamente cuando empieces tus primeros tests."}</p></section></div>}

function EmptyDataPage({title,message,go}){return <div className="emptyPage"><div className="emptyIcon"><History/></div><h2>{title}</h2><p>{message}</p><button className="primary" onClick={()=>go("test")}><Play/> Empezar test</button></div>}

function WrongPage({data,onStart,go}){
 // sigue "fallada" mientras el último intento haya sido incorrecto; se corrige al acertarla de nuevo
 const failedCount=topics.reduce((sum,topic)=>sum+getQuestionBank(topic.id).filter(question=>isQuestionCurrentlyFailed(data.progress[getQuestionIdForProgress(question)])).length,0);
 if(!failedCount) return <EmptyDataPage title="Preguntas falladas" message="Aquí aparecerán las preguntas que respondas incorrectamente." go={go}/>;
 return <div><div className="reviewHero"><h2>Preguntas falladas</h2><p>Tienes {failedCount} preguntas falladas pendientes de reforzar.</p><button className="primary" onClick={()=>onStart({count:30,mode:"failed",topicId:0})}><Play/> Hacer test de falladas</button></div></div>;
}

function HistoryPage({data,go}){if(!data.history.length)return <EmptyDataPage title="Historial" message="Todavía no has realizado ningún test." go={go}/>;return <div><div className="pageIntro"><div><span className="eyebrow">HISTORIAL</span><h2>Tests realizados</h2></div></div><div className="historyList">{data.history.map((session,index)=><article className="historyItem" key={`${session.completedAt}-${index}`}><div><b>{session.topicIds?.length>1?"Todos los temas":`Tema ${String(session.topicId).padStart(2,"0")}`}</b><small>{new Date(session.completedAt).toLocaleString("es-ES")}</small></div><strong>{session.correct}/{session.answered}</strong></article>)}</div><button className="primary" onClick={()=>go("test")}><Play/> Hacer otro test</button></div>}

function SimulacrumPage({go}){return <div><section className="simHero"><Trophy/><h2>Simulacro de oposición</h2><p>El simulacro estará disponible cuando haya preguntas cargadas.</p><button className="secondary" onClick={()=>go("test")}>Ver temas disponibles</button></section></div>}

createRoot(document.getElementById("root")).render(<App/>);
