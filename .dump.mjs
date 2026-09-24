// Vuelca las preguntas de un tema sin explicación, agrupando repetidas
import {createServer} from "vite";import fs from "fs";
const t=Number(process.argv[2]);
const s=await createServer({server:{middlewareMode:true},appType:"custom",logLevel:"error"});
const bank=(await s.ssrLoadModule("/src/questions/index.js")).default;
const {explainQuestion}=await s.ssrLoadModule("/src/lib/explainQuestion.js");await s.close();
const n=x=>String(x).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,"");
const groups=new Map();
for(const q of bank["tema-"+String(t).padStart(2,"0")]){if(explainQuestion(q,t))continue;
 const key=String(q.explanationId??q.number??q.id);
 const g=n(q.question)+"|"+n(q.answers[q.correctAnswer]);
 if(!groups.has(g))groups.set(g,{keys:[],q:q.question,o:q.answers.map((a,i)=>(i===q.correctAnswer?"✔":"")+String.fromCharCode(65+i)+") "+a),letter:String.fromCharCode(65+q.correctAnswer)});
 groups.get(g).keys.push({key,letter:String.fromCharCode(65+q.correctAnswer)});}
const list=[...groups.values()];
fs.writeFileSync("/tmp/claude-0/-home-user-Labquiz-2-0/24aaba12-1488-55ac-be68-671615daace0/scratchpad/todo-"+t+".json",JSON.stringify(list));
console.log("tema",t,": preguntas",list.reduce((a,g)=>a+g.keys.length,0),"grupos",list.length);
