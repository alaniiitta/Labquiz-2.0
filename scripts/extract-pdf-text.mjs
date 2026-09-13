import fs from "node:fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Uso: node scripts/extract-pdf-text.mjs <pdf> <salida.txt>");
  process.exit(1);
}

const data = new Uint8Array(fs.readFileSync(inputPath));
const doc = await pdfjsLib.getDocument({ data }).promise;
let out = "";
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map((it) => it.str).join(" ");
  out += `\n--- PAGE ${i} ---\n${text}`;
}
fs.writeFileSync(outputPath, out);
console.log("Páginas:", doc.numPages, "Caracteres:", out.length);
