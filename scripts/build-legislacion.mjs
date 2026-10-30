// Monta src/summaries/visual/tema-24.html (resumen de Legislación) a partir de los fragmentos de
// src/summaries/visual/legislacion/, en el orden del temario oficial, numerando los apartados y
// generando la barra de accesos. Uso: node scripts/build-legislacion.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const dir = new URL("../src/summaries/visual/legislacion/", import.meta.url);
const ORDER = ["constitucion", "estatuto", "lgs", "cohesion", "autonomia", "ebep", "marco", "igualdad", "prl", "lopd"];
const SHORT = { constitucion: "CE", estatuto: "Estatuto", lgs: "LGS", cohesion: "L. 16/2003", autonomia: "L. 41/2002", ebep: "EBEP", marco: "EM", igualdad: "Igualdad", prl: "PRL", lopd: "LOPD" };

let n = 0;
const chips = [];
const body = ORDER.filter(key => existsSync(new URL(`${key}.html`, dir))).map(key => {
 const html = readFileSync(new URL(`${key}.html`, dir), "utf8");
 return html.replace(/<h2>([\s\S]*?)<\/h2>/g, (match, title) => {
  n += 1;
  const label = title.replace(/<[^>]+>/g, "").replace(/^[^·]*·\s*/, "").trim();
  chips.push(`<a class="chip" href="#vs-s${n}">${SHORT[key]} · ${label}</a>`);
  return `<h2 id="vs-s${n}"><span class="n">${n}</span> ${title}</h2>`;
 });
}).join("\n");

const intro = readFileSync(new URL("_intro.html", dir), "utf8");
writeFileSync(new URL("../tema-24.html", dir), `<nav class="chips">${chips.join("")}</nav>\n\n${intro}${body}`);
console.log(`tema-24.html: ${n} apartados`);
