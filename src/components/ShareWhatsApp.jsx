import React from "react";
import {MessageCircle,CheckCircle2,Forward} from "lucide-react";

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

// Flecha para guardar (o quitar) la pregunta de la lista para compartir.
// getItem se llama solo al guardar, para no calcular la explicación en cada pregunta.
export function SaveToShareButton({itemKey,getItem}){
 const [saved,setSaved]=React.useState(()=>loadToShare().some(item=>item.key===itemKey));
 React.useEffect(()=>{setSaved(loadToShare().some(item=>item.key===itemKey))},[itemKey]);
 const toggle=()=>{
  const list=loadToShare();
  if(list.some(item=>item.key===itemKey)){saveToShare(list.filter(item=>item.key!==itemKey));setSaved(false);return}
  saveToShare([{...getItem(),key:itemKey,at:Date.now()},...list]);setSaved(true);
 };
 return <button type="button" className={saved?"saveToShare saved":"saveToShare"} onClick={toggle} aria-pressed={saved} title={saved?"Guardada para compartir (toca para quitarla)":"Guardar para compartir con tus compañeras"}><Forward/>{saved?"Guardada":"Compartir"}</button>;
}
