import React,{useEffect,useMemo,useRef,useState} from "react";
import {ArrowLeft,ChevronRight,FileText,Flag,LayoutGrid,Play,RotateCcw,Timer,Trash2} from "lucide-react";
import ExplanationDisplay from "./ExplanationDisplay.jsx";
import {REAL_EXAMS,realExamById} from "../questions/realExams/index.js";
import {askConfirm} from "../lib/confirm.js";

// Exámenes reales de convocatorias anteriores: mismo orden, mismas opciones y la clave oficial.
// Se hacen con su reloj y su penalización; las preguntas de reserva se responden pero no puntúan.
const SESSION_KEY="labquiz.real-exam-session.v1";
const LETTERS="ABCD";
const has=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
const clock=ms=>{const total=Math.max(0,Math.ceil(ms/1000));const h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;return `${h?h+":":""}${String(m).padStart(h?2:1,"0")}:${String(s).padStart(2,"0")}`};
const score=value=>value.toLocaleString("es-ES",{maximumFractionDigits:2}).replace("-","−");
const minutesLabel=minutes=>minutes%60?`${Math.floor(minutes/60)} h ${minutes%60} min`:`${minutes/60} h`;

export const loadRealSession=()=>{try{const session=JSON.parse(localStorage.getItem(SESSION_KEY)||"null");return session&&realExamById(session.examId)&&Number.isFinite(session.deadline)?session:null}catch{return null}};
const saveRealSession=session=>{try{localStorage.setItem(SESSION_KEY,JSON.stringify(session))}catch{}};
const clearRealSession=()=>{try{localStorage.removeItem(SESSION_KEY)}catch{}};

// Qué preguntas puntúan: las normales que no anuló el tribunal y, en lugar de las anuladas,
// las primeras de reserva (por orden). Las respuestas se guardan por posición en el cuadernillo.
const scoringPlan=exam=>{
 const annulled=exam.questions.filter(question=>!question.reserve&&question.annulled).length;
 const reserves=exam.questions.filter(question=>question.reserve&&!question.annulled);
 const substitutes=new Set(reserves.slice(0,annulled));
 return {counts:question=>!question.annulled&&(!question.reserve||substitutes.has(question)),substitutes,annulled};
};
// nota de un intento: solo puntúan las preguntas que cuentan según la plantilla definitiva
export function realExamScore(exam,answers={}){
 const plan=scoringPlan(exam);
 const tally=list=>{let correct=0,wrong=0;list.forEach(question=>{const key=exam.questions.indexOf(question);if(!has(answers,key))return;if(answers[key]===question.correctAnswer)correct++;else wrong++});return {correct,wrong,blank:list.length-correct-wrong,total:list.length}};
 const main=tally(exam.questions.filter(plan.counts));
 const reserve=tally(exam.questions.filter(question=>question.reserve&&!question.annulled&&!plan.substitutes.has(question)));
 const net=main.correct-main.wrong*exam.penalty;
 return {...main,net,grade:Math.max(0,net)/main.total*10,reserve};
}

// Tarjeta para la página de Repaso
export function RealExamsCard({history=[],onOpen}){
 const session=loadRealSession();
 return <div className="reviewSetup realExamsCard">
  <span className="reviewSetupLabel"><FileText/> Exámenes reales</span>
  <p className="freshNote">El examen oficial tal cual salió: mismas preguntas, mismo orden, su tiempo y la clave correctora oficial.</p>
  {REAL_EXAMS.map(exam=>{
   const tries=history.filter(entry=>entry.examId===exam.id);
   const last=tries[0]?realExamScore(exam,tries[0].answers):null;
   const running=session?.examId===exam.id;
   return <button key={exam.id} type="button" className="realExamRow" onClick={()=>onOpen(exam.id)}>
    <div><b>{exam.title}</b><small>{exam.scored} preguntas + {exam.questions.length-exam.scored} de reserva · {minutesLabel(exam.minutes)}</small>{running?<small className="realExamRunning"><Play/> Tienes este examen a medias</small>:last?<small>Último intento: <b>{score(last.grade)}</b> / 10 · {tries.length} {tries.length===1?"intento":"intentos"}</small>:<small>Sin hacer todavía</small>}</div>
    <ChevronRight/>
   </button>;
  })}
 </div>;
}

export function RealExamPage({examId,history=[],onRecord,onDelete,go}){
 const exam=realExamById(examId)??REAL_EXAMS[0];
 const tries=history.filter(entry=>entry.examId===exam.id);
 const [session,setSession]=useState(()=>{const saved=loadRealSession();return saved?.examId===exam.id?saved:null});
 const [phase,setPhase]=useState(()=>session?"exam":"intro");
 const [attempt,setAttempt]=useState(null);
 const [i,setI]=useState(session?.index??0);
 const [now,setNow]=useState(Date.now());
 const [showGrid,setShowGrid]=useState(false);
 const [confirming,setConfirming]=useState(false);
 const finishedRef=useRef(false);
 const plan=useMemo(()=>scoringPlan(exam),[exam]);
 const questions=exam.questions,total=questions.length;
 const answers=phase==="exam"?session?.answers??{}:attempt?.answers??{};
 const flags=session?.flags??[];
 const remaining=(session?.deadline??0)-now;
 const answeredCount=Object.keys(answers).length;

 const start=()=>{const startedAt=Date.now();const next={examId:exam.id,startedAt,deadline:startedAt+exam.minutes*60000,answers:{},flags:[],index:0};finishedRef.current=false;saveRealSession(next);setSession(next);setI(0);setNow(startedAt);setPhase("exam");window.scrollTo(0,0)};
 const update=change=>setSession(current=>{const next={...current,...change(current)};saveRealSession(next);return next});
 const submit=(auto=false)=>{
  if(finishedRef.current||!session) return;
  finishedRef.current=true;
  const entry={id:session.startedAt,examId:exam.id,startedAt:session.startedAt,endedAt:Math.min(Date.now(),session.deadline),auto,answers:session.answers};
  onRecord?.(entry);clearRealSession();setSession(null);setAttempt(entry);setConfirming(false);setShowGrid(false);setPhase("result");window.scrollTo(0,0);
 };
 useEffect(()=>{if(phase!=="exam")return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[phase]);
 useEffect(()=>{if(phase==="exam"&&session&&remaining<=0)submit(true)},[phase,remaining]);
 const result=useMemo(()=>realExamScore(exam,answers),[exam,answers]);
 const goTo=index=>{setI(index);setShowGrid(false);if(phase==="exam")update(()=>({index}));window.scrollTo(0,0)};
 const openAttempt=entry=>{setAttempt(entry);setPhase("result");window.scrollTo(0,0)};

 if(phase==="intro") return <div className="reviewPage realExamIntro">
  <div className="reviewHero"><h2>Examen real · {exam.title}</h2><p>{exam.subtitle}</p></div>
  <div className="reviewSetup">
   <span className="reviewSetupLabel">Cómo fue el examen</span>
   <ul className="realExamFacts">
    <li><b>{exam.scored}</b> preguntas que puntúan y <b>{total-exam.scored}</b> de reserva (solo cuentan si el tribunal anula alguna)</li>
    <li><b>{minutesLabel(exam.minutes)}</b> para todo</li>
    <li>{exam.points===1?"Cada acierto suma 1":`Cada acierto vale ${score(exam.points)} puntos`} y cada fallo resta ¼ de acierto; las en blanco no restan</li>
    <li>{exam.keyNote}</li>
    {plan.annulled>0&&<li>Al corregir verás las anuladas marcadas; en su lugar cuentan {Math.min(plan.annulled,plan.substitutes.size)===1?"la primera de reserva":`las ${plan.substitutes.size} primeras de reserva`}</li>}
   </ul>
   <p className="examNote">Estas preguntas son aparte de tu banco: no cambian tu progreso ni tus falladas. Las opciones salen en su orden original.</p>
   <button className="primary" type="button" onClick={start}><Play/> Empezar · {minutesLabel(exam.minutes)}</button>
  </div>
  {tries.length>0&&<div className="reviewSetup examHistory">
   <span className="reviewSetupLabel">Tus intentos</span>
   <div className="examHistoryList">{tries.map(entry=>{const s=realExamScore(exam,entry.answers);return <div key={entry.id} className="examHistoryRow"><button type="button" className="examHistoryOpen" onClick={()=>openAttempt(entry)}><span className={`examGrade${s.grade>=5?" pass":""}`}>{score(Math.round(s.grade*100)/100)}</span><div><b>{new Date(entry.endedAt).toLocaleString("es-ES",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</b><small>{s.correct}✓ {s.wrong}✗ {s.blank} en blanco · neta {score(s.net)}</small></div><span>Revisar <ChevronRight/></span></button><button type="button" className="examHistoryDelete" aria-label="Borrar este intento" onClick={()=>askConfirm("¿Borrar este intento del examen real?").then(ok=>{if(ok)onDelete?.(entry.id)})}><Trash2/></button></div>})}</div>
  </div>}
  <button className="changeTopicButton" onClick={()=>go("review")}>Volver a Repaso</button>
 </div>;

 if(phase==="result"){
  const used=attempt.endedAt-attempt.startedAt;
  return <div className="result card examResult">
   <div className="resultIcon">📝</div>
   <h2>{exam.title} · {attempt.auto?"se acabó el tiempo":"examen entregado"}</h2>
   <p className="examFormula">{new Date(attempt.endedAt).toLocaleString("es-ES",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}</p>
   <strong>{score(result.grade)}<small> / 10</small></strong>
   <p className="resultPct">Puntuación neta: <b>{score(result.net)}</b> de {result.total}{exam.points!==1&&<> · <b>{score(Math.round(Math.max(0,result.net)*exam.points*100)/100)}</b> de {score(Math.round(result.total*exam.points))} puntos</>}</p>
   <div className="examScore">
    <div className="ok"><b>{result.correct}</b><span>Aciertos</span><small>+{result.correct}</small></div>
    <div className="ko"><b>{result.wrong}</b><span>Fallos</span><small>−{score(result.wrong*exam.penalty)}</small></div>
    <div className="bl"><b>{result.blank}</b><span>En blanco</span><small>0</small></div>
   </div>
   <p className="examFormula">Aciertos − fallos ÷ 4 sobre las {result.total} que puntúan · tiempo usado {clock(used)} de {minutesLabel(exam.minutes)}</p>
   {result.reserve.total>0&&<p className="examFormula">Reserva (no puntúa): {result.reserve.correct}✓ {result.reserve.wrong}✗ {result.reserve.blank}○ de {result.reserve.total}</p>}
   <div className="resultActions">
    <button className="primary" onClick={()=>{setPhase("review");setI(0);window.scrollTo(0,0)}}>Revisar con la clave oficial</button>
    <button className="secondary" onClick={start}><RotateCcw/> Volver a hacerlo</button>
    <button className="secondary" onClick={()=>setPhase("intro")}>Ver todos los intentos</button>
    <button className="secondary" onClick={()=>go("review")}>Volver a Repaso</button>
   </div>
  </div>;
 }

 const reviewing=phase==="review";
 const q=questions[i];
 const hasAnswer=has(answers,i);
 const selected=hasAnswer?answers[i]:null;
 const status=index=>questions[index].annulled?"annulled":!has(answers,index)?"blank":answers[index]===questions[index].correctAnswer?"right":"wrong";
 const pick=answerIndex=>update(current=>{const next={...current.answers};if(next[i]===answerIndex)delete next[i];else next[i]=answerIndex;return {answers:next}});
 const toggleFlag=()=>update(current=>({flags:current.flags.includes(i)?current.flags.filter(index=>index!==i):[...current.flags,i]}));
 const lowTime=!reviewing&&remaining<=5*60*1000;
 const blank=total-answeredCount;
 return <div className="testWrap examWrap">
  <div className="testMeta"><span>{reviewing?`REVISIÓN · ${exam.title.toUpperCase()}`:`EXAMEN REAL · ${exam.title.toUpperCase()}`}</span>{reviewing?<b>{i+1} / {total}</b>:<b className={lowTime?"examClock low":"examClock"} role="timer" aria-label="Tiempo restante"><Timer/>{clock(remaining)}</b>}</div>
  <div className="progressLine"><i style={{width:(reviewing?(i+1)/total:answeredCount/total)*100+"%"}}/></div>
  <div className="examBar"><button type="button" className={showGrid?"examGridToggle open":"examGridToggle"} onClick={()=>setShowGrid(open=>!open)} aria-expanded={showGrid}><LayoutGrid/>{reviewing?`${result.correct} ✓ · ${result.wrong} ✗ · ${result.blank} en blanco`:`Pregunta ${i+1} de ${total} · ${answeredCount} respondidas`}</button></div>
  {showGrid&&<div className="examGrid">{questions.map((question,index)=><button key={index} type="button" onClick={()=>goTo(index)} className={[index===i?"current":"",reviewing?status(index):has(answers,index)?"answered":"",flags.includes(index)?"flagged":"",question.reserve?"reserve":""].join(" ")} aria-label={`Pregunta ${question.number}${question.reserve?" (reserva)":""}`}>{question.number}</button>)}</div>}
  <div className="testCard">
   <div className="qTags"><span className="badge">{q.reserve?"Pregunta de reserva":exam.title}</span>{reviewing&&q.annulled&&<span className="badge realAnnulled">Anulada por el tribunal</span>}{reviewing&&plan.substitutes.has(q)&&<span className="badge">Cuenta en lugar de una anulada</span>}</div>
   {q.context&&(i===0||questions[i-1].context!==q.context)&&<p className="realExamCase">{q.context}</p>}
   {q.context&&i>0&&questions[i-1].context===q.context&&<details className="realExamCase"><summary>{q.context.split(":")[0]} (ver el enunciado)</summary>{q.context}</details>}
   <h2>{q.number}. {q.question}</h2>
   <div className="answers">{q.answers.map((answer,index)=><button key={index} type="button" onClick={()=>!reviewing&&pick(index)} disabled={reviewing} aria-pressed={!reviewing?selected===index:undefined} className={reviewing&&q.annulled?(selected===index?"picked":""):reviewing?(index===q.correctAnswer?(selected===index?"correct":"correct missed"):selected===index?"incorrect":""):selected===index?"picked":""}><span>{LETTERS[index]}</span>{answer}</button>)}</div>
   {!reviewing&&<p className="examHint">{hasAnswer?"Toca de nuevo tu respuesta para dejarla en blanco.":q.reserve?"Pregunta de reserva: no puntúa, pero practícala.":"Si no la sabes, déjala en blanco: no resta."}</p>}
   {reviewing&&q.annulled&&<p className="examHint">El tribunal anuló esta pregunta en la plantilla definitiva: no cuenta para la nota{plan.substitutes.size?" y en su lugar puntúa una de reserva":""}.</p>}
   {reviewing&&!q.annulled&&<div className="testFeedback"><ExplanationDisplay structured={{porQueLaCorrecta:q.why}} correctAnswerText={`${LETTERS[q.correctAnswer]}) ${q.answers[q.correctAnswer]}`} isCorrect={hasAnswer?selected===q.correctAnswer:null}/></div>}
   <div className="testActions">
    <button className="secondary" onClick={()=>goTo(Math.max(0,i-1))} disabled={i===0}><ArrowLeft/> Anterior</button>
    {!reviewing&&<button className={flags.includes(i)?"secondary favoriteAction active":"secondary favoriteAction"} onClick={toggleFlag}><Flag fill={flags.includes(i)?"currentColor":"none"}/> {flags.includes(i)?"Marcada":"Marcar"}</button>}
    {i<total-1?<button className="primary" onClick={()=>goTo(i+1)}>Siguiente <ChevronRight/></button>:reviewing?<button className="primary" onClick={()=>setPhase("result")}>Ver nota <ChevronRight/></button>:<button className="primary" onClick={()=>setConfirming(true)}>Entregar <ChevronRight/></button>}
   </div>
   {reviewing?<button className="changeTopicButton" onClick={()=>setPhase("result")}>Volver a la nota</button>:<div className="examFoot"><button className="changeTopicButton" onClick={()=>go("review")}>Salir (el reloj sigue corriendo)</button><button className="changeTopicButton examSubmit" onClick={()=>setConfirming(true)}>Entregar examen</button></div>}
  </div>
  {confirming&&<div className="sheetBackdrop" onClick={()=>setConfirming(false)}><div className="examConfirm card" role="dialog" aria-modal="true" aria-label="Entregar examen" onClick={e=>e.stopPropagation()}>
   <h3>¿Entregar el examen?</h3>
   <p>Has respondido <b>{answeredCount}</b> de {total}{blank?<> · <b>{blank}</b> en blanco</>:null}{flags.length?<> · <b>{flags.length}</b> marcadas</>:null}.</p>
   <p>Te quedan <b>{clock(remaining)}</b>. Después verás la nota con la clave oficial.</p>
   <div className="testActions"><button className="secondary" onClick={()=>setConfirming(false)}>Seguir</button><button className="primary" onClick={()=>submit(false)}>Entregar</button></div>
  </div></div>}
 </div>;
}
