import React from "react";
import {MessageCircle,CheckCircle2,Forward,Bookmark} from "lucide-react";

// Compartir una pregunta por WhatsApp para comentarla con las compañeras:
// primero la pregunta (para que contesten con la letra) y después la solución.
// Las letras siguen el orden en que se ven las opciones en pantalla.
const LETTERS="ABCDE";
const clean=text=>String(text??"").replace(/\s+/g," ").trim();
const openWhatsApp=text=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank","noopener");

export function questionMessage({question,answers,source}){
 return [
  `🧪 *Pregunta de repaso*${source?` · ${clean(source)}`:""}`,
  "",
  `*${clean(question)}*`,
  "",
  ...answers.map((answer,index)=>`${LETTERS[index]}) ${clean(answer)}`),
  "",
  "_Responde con la letra_ 👇",
 ].join("\n");
}

export function solutionMessage({question,answers,correctAnswer,explanation}){
 const short=clean(question);
 return [
  `🔎 *Solución* · _${short.length>90?short.slice(0,87)+"…":short}_`,
  "",
  `✅ *${LETTERS[correctAnswer]}) ${clean(answers[correctAnswer])}*`,
  ...(clean(explanation)?["",`💡 ${clean(explanation)}`]:[]),
 ].join("\n");
}

export default function ShareWhatsApp({question,answers,correctAnswer,explanation,source}){
 if(!question||!Array.isArray(answers)||!answers.length) return null;
 const hasSolution=Number.isInteger(correctAnswer)&&correctAnswer>=0&&correctAnswer<answers.length;
 return <div className="shareWhatsApp">
  <span className="shareWhatsAppLabel">Comentarla con tus compañeras</span>
  <div className="shareWhatsAppRow">
   <button type="button" onClick={()=>openWhatsApp(questionMessage({question,answers,source}))}><MessageCircle/> Enviar pregunta</button>
   {hasSolution&&<button type="button" onClick={()=>openWhatsApp(solutionMessage({question,answers,correctAnswer,explanation}))}><CheckCircle2/> Enviar solución</button>}
  </div>
 </div>;
}

// Preguntas guardadas desde los test para compartirlas más tarde (se ven en «Compartir»).
// Se guardan en este dispositivo con su texto, sus opciones y la explicación.
const TO_SHARE_KEY="labquiz.toshare.v1";
const TO_SHARE_MAX=60;
export const loadToShare=()=>{try{const list=JSON.parse(localStorage.getItem(TO_SHARE_KEY)||"[]");return Array.isArray(list)?list:[]}catch{return []}};
export const saveToShare=list=>{try{localStorage.setItem(TO_SHARE_KEY,JSON.stringify(list.slice(0,TO_SHARE_MAX)))}catch{}};

// Preguntas ya enviadas al grupo (para mandar la solución más tarde desde «Compartir»).
const SENT_KEY="labquiz.shared.v1";
const SENT_MAX=30;
export const loadSent=()=>{try{const list=JSON.parse(localStorage.getItem(SENT_KEY)||"[]");return Array.isArray(list)?list:[]}catch{return []}};
export const saveSent=list=>{try{localStorage.setItem(SENT_KEY,JSON.stringify(list.slice(0,SENT_MAX)))}catch{}};
export const markSent=(item,solved=false)=>{const list=loadSent();const old=list.find(entry=>entry.key===item.key);const entry={...item,at:old?.at??Date.now(),solved:solved||!!old?.solved};saveSent([entry,...list.filter(other=>other.key!==item.key)]);return entry};

// Botón «Compartir» de los test: abre un menú para mandar la pregunta (o la solución)
// por WhatsApp o guardarla para más tarde. getItem se llama solo al usarlo, para no
// calcular la explicación en cada pregunta.
export function SaveToShareButton({itemKey,getItem}){
 const [saved,setSaved]=React.useState(()=>loadToShare().some(item=>item.key===itemKey));
 const [open,setOpen]=React.useState(false);
 const [done,setDone]=React.useState(null);
 const ref=React.useRef(null);
 React.useEffect(()=>{setSaved(loadToShare().some(item=>item.key===itemKey));setOpen(false);setDone(null)},[itemKey]);
 React.useEffect(()=>{if(!open)return;const close=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close)},[open]);
 const item=()=>({...getItem(),key:itemKey});
 const unsave=()=>{saveToShare(loadToShare().filter(entry=>entry.key!==itemKey));setSaved(false)};
 const toggleSaved=()=>{if(saved)unsave();else{saveToShare([{...item(),at:Date.now()},...loadToShare()]);setSaved(true)}setOpen(false)};
 // al enviarla pasa a «Enviadas al grupo» (y deja de estar en guardadas)
 const sendQuestion=()=>{const data=item();openWhatsApp(questionMessage(data));markSent(data);if(saved)unsave();setDone("question");setOpen(false)};
 const sendSolution=()=>{const data=item();openWhatsApp(solutionMessage(data));markSent(data,true);if(saved)unsave();setDone("solution");setOpen(false)};
 const label=done==="question"?"Enviada":done==="solution"?"Solución enviada":saved?"Guardada":"Compartir";
 return <span className="shareMenuWrap" ref={ref}>
  <button type="button" className={saved||done?"saveToShare saved":"saveToShare"} onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-haspopup="menu"><Forward/>{label}</button>
  {open&&<span className="shareMenu" role="menu">
   <button type="button" role="menuitem" onClick={sendQuestion}><MessageCircle/>Enviar a WhatsApp</button>
   <button type="button" role="menuitem" onClick={sendSolution}><CheckCircle2/>Enviar solución</button>
   <button type="button" role="menuitem" onClick={toggleSaved}><Bookmark/>{saved?"Quitar de guardadas":"Guardar para luego"}</button>
  </span>}
 </span>;
}
