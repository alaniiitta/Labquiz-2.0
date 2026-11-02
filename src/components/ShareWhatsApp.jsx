import React from "react";
import {MessageCircle,CheckCircle2} from "lucide-react";

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
