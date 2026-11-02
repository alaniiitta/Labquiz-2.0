import React,{useMemo,useState} from "react";
import {CheckCircle2,Eye,EyeOff,MessageCircle,Search,Shuffle,Trash2} from "lucide-react";
import {loadToShare,questionMessage,saveToShare,solutionMessage} from "./ShareWhatsApp.jsx";
import {REAL_EXAMS} from "../questions/realExams/index.js";

// Apartado «Compartir»: elegir una pregunta, mandarla al grupo de WhatsApp y,
// cuando hayan contestado, mandar la solución. Lo enviado se recuerda en este
// dispositivo para poder mandar la solución más tarde.
const SENT_KEY="labquiz.shared.v1";
const SENT_MAX=30;
const LETTERS="ABCDE";
const loadSent=()=>{try{const list=JSON.parse(localStorage.getItem(SENT_KEY)||"[]");return Array.isArray(list)?list:[]}catch{return []}};
const saveSent=list=>{try{localStorage.setItem(SENT_KEY,JSON.stringify(list.slice(0,SENT_MAX)))}catch{}};
const openWhatsApp=text=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank","noopener");
const plain=text=>String(text??"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const pickRandom=(list,avoid)=>{if(!list.length)return null;const pool=list.length>1?list.filter(item=>item.key!==avoid):list;return pool[Math.floor(Math.random()*pool.length)]};
const when=at=>{const minutes=Math.round((Date.now()-at)/60000);if(minutes<1)return "ahora";if(minutes<60)return `hace ${minutes} min`;const hours=Math.round(minutes/60);if(hours<24)return `hace ${hours} h`;return new Date(at).toLocaleDateString("es-ES",{day:"numeric",month:"short"})};

const SOURCES=[["random","Al azar"],["topic","Por tema"],["failed","Mis falladas"],["real","Exámenes reales"],["search","Buscar"]];

// bank: preguntas del banco ya con su explicación; failed: las falladas
export default function SharePage({topics,bank,failed,explain}){
 const [source,setSource]=useState("random");
 const [topicId,setTopicId]=useState(topics[0]?.id??null);
 const [query,setQuery]=useState("");
 const [current,setCurrent]=useState(null);
 const [reveal,setReveal]=useState(false);
 const [sent,setSent]=useState(loadSent);
 const [saved,setSaved]=useState(loadToShare);
 const unsave=key=>{const list=saved.filter(item=>item.key!==key);setSaved(list);saveToShare(list)};

 const realPool=useMemo(()=>REAL_EXAMS.flatMap(exam=>exam.questions.filter(question=>!question.annulled&&question.correctAnswer>=0).map(question=>({key:`${exam.id}#${question.number}`,question:question.question,answers:question.answers,correctAnswer:question.correctAnswer,explanation:question.why??"",source:`Examen real ${exam.title}`,image:question.image}))),[]);
 const pool=useMemo(()=>{
  if(source==="real") return realPool.filter(item=>!item.image);
  if(source==="failed") return failed;
  if(source==="topic") return bank.filter(item=>item.topicId===topicId);
  if(source==="search"){const words=plain(query).split(/[^a-z0-9]+/).filter(word=>word.length>=3);if(!words.length)return [];return [...bank,...realPool].filter(item=>{const text=` ${plain(item.question)} ${plain(item.answers.join(" "))}`;return words.every(word=>text.includes(` ${word}`))})}
  return bank;
 },[source,topicId,query,bank,failed,realPool]);

 // la explicación se busca solo para la pregunta elegida (el banco es grande)
 const next=()=>{const item=pickRandom(pool,current?.key);if(!item){setCurrent(null);return}const {raw,...rest}=item;setCurrent(raw?{...rest,explanation:explain(raw)}:rest);setReveal(false)};
 const remember=item=>{const entry={...item,at:Date.now(),solved:false};const list=[entry,...sent.filter(old=>old.key!==item.key)];setSent(list);saveSent(list)};
 // al enviarla, la guardada pasa a «Enviadas al grupo»
 const sendQuestion=item=>{openWhatsApp(questionMessage(item));remember(item);if(saved.some(old=>old.key===item.key))unsave(item.key)};
 const sendSolution=item=>{openWhatsApp(solutionMessage(item));const list=sent.map(old=>old.key===item.key?{...old,solved:true}:old);setSent(list);saveSent(list)};
 const forget=key=>{const list=sent.filter(old=>old.key!==key);setSent(list);saveSent(list)};
 const chooseSource=id=>{setSource(id);setCurrent(null);setReveal(false)};

 return <div className="reviewPage sharePage">
  <div className="reviewHero"><h2>Compartir con tus compañeras</h2><p>Elige una pregunta, mándala al grupo de WhatsApp y, cuando hayan contestado, envía la solución.</p></div>

  {saved.length>0&&<div className="reviewSetup">
   <span className="reviewSetupLabel">Guardadas para compartir · {saved.length}</span>
   <div className="shareSentList">{saved.map(item=><div key={item.key} className={current?.key===item.key?"shareSent active":"shareSent"}>
    <div><b>{item.question}</b><small>{item.source??""}{item.source?" · ":""}guardada {when(item.at)}</small></div>
    <button type="button" onClick={()=>{setCurrent(item);setReveal(false);setTimeout(()=>document.querySelector(".shareCard")?.scrollIntoView({behavior:"smooth",block:"start"}),50)}}><MessageCircle/>Abrir</button>
    <button type="button" className="shareForget" onClick={()=>unsave(item.key)} aria-label="Quitar de guardadas"><Trash2/></button>
   </div>)}</div>
  </div>}

  <div className="reviewSetup">
   <span className="reviewSetupLabel">¿De dónde sale la pregunta?</span>
   <div className="shareSources">{SOURCES.map(([id,label])=><button key={id} type="button" className={source===id?"selected":""} onClick={()=>chooseSource(id)}>{label}</button>)}</div>
   {source==="topic"&&<select className="shareSelect" value={topicId??""} onChange={e=>{setTopicId(Number(e.target.value));setCurrent(null)}}>{topics.map(topic=><option key={topic.id} value={topic.id}>T{String(topic.id).padStart(2,"0")} · {topic.title}</option>)}</select>}
   {source==="search"&&<label className="shareSearch"><Search/><input value={query} onChange={e=>{setQuery(e.target.value);setCurrent(null)}} placeholder="Escribe una palabra: gram, ACTH, coagulación…"/></label>}
   <small className="freshSummary">{source==="search"&&!query.trim()?"Escribe al menos una palabra":`${pool.length} ${pool.length===1?"pregunta disponible":"preguntas disponibles"}`}{source==="failed"&&!pool.length?" · todavía no tienes falladas":""}</small>
   <button className="primary" type="button" onClick={next} disabled={!pool.length}><Shuffle/> {current?"Otra pregunta":"Elegir una pregunta"}</button>
  </div>

  {current&&<div className="reviewSetup shareCard">
   <span className="reviewSetupLabel">{current.source}</span>
   <h3>{current.question}</h3>
   <ol className="shareOptions">{current.answers.map((answer,index)=><li key={index} className={reveal&&index===current.correctAnswer?"correct":""}><b>{LETTERS[index]}</b>{answer}</li>)}</ol>
   <button type="button" className="shareReveal" onClick={()=>setReveal(value=>!value)}>{reveal?<><EyeOff/> Ocultar solución</>:<><Eye/> Ver la solución</>}</button>
   {reveal&&current.explanation&&<p className="shareExplanation">💡 {current.explanation}</p>}
   <div className="shareWhatsAppRow">
    <button type="button" onClick={()=>sendQuestion(current)}><MessageCircle/> Enviar pregunta</button>
    <button type="button" onClick={()=>sendSolution(current)}><CheckCircle2/> Enviar solución</button>
   </div>
  </div>}

  <div className="reviewSetup">
   <span className="reviewSetupLabel">Enviadas al grupo</span>
   {!sent.length?<p className="freshNote">Aquí verás las preguntas que mandes, para enviar la solución cuando hayan contestado.</p>:
   <div className="shareSentList">{sent.map(item=><div key={item.key} className="shareSent">
    <div><b>{item.question}</b><small>{when(item.at)} · {item.solved?"solución enviada":"falta la solución"}</small></div>
    <button type="button" className={item.solved?"done":""} onClick={()=>sendSolution(item)} aria-label="Enviar solución"><CheckCircle2/>{item.solved?"Reenviar":"Solución"}</button>
    <button type="button" className="shareForget" onClick={()=>forget(item.key)} aria-label="Quitar de la lista"><Trash2/></button>
   </div>)}</div>}
  </div>
 </div>;
}
