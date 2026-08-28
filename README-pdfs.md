# Preparación de PDFs para LabQuiz 2.0

## Carpeta

Crea los archivos PDF dentro de la carpeta `pdfs/` del proyecto raiz.

Ejemplo:

- `pdfs/tema-01.pdf`
- `pdfs/tema-02.pdf`
- `pdfs/tema-03.pdf`
- ...
- `pdfs/tema-23.pdf`

## Naming convention

Los nombres deben seguir este patrón:

- `tema-01.pdf`
- `tema-02.pdf`
- `tema-03.pdf`
- ...
- `tema-23.pdf`

Esto permite relacionar cada PDF con su tema en la aplicación.

## Qué hace el parser

La lógica preparada en `src/pdfReader.js` y `src/pdfPipeline.js`:

- abre el PDF con `pdfjs-dist`
- extrae texto de todas las páginas
- identifica bloques de preguntas
- intenta detectar respuestas A/B/C/D
- detecta la respuesta marcada como correcta, prioritando el texto que indique respuesta correcta o marca amarilla
- devuelve un array de preguntas compatible con el modelo actual de la app

## Importante

El sistema preparado no inserta preguntas manualmente. Solo crea la infraestructura de lectura para que luego se puedan convertir los PDFs en preguntas automáticamente.

## Recomendación para los PDFs

Para que la extracción funcione mejor:

- usa una estructura clara por pregunta
- marca cada opción como A, B, C, D
- la respuesta correcta puede ir indicada por texto como `Respuesta correcta: B` o por una marca amarilla visible en la imagen del PDF
- evita PDFs con texto escaneado sin OCR o con demasiada mezcla de columnas

## Cómo probarlo

En el futuro puedes cargar los PDFs desde `pdfs/` y ejecutar una función como:

```js
import { parsePdfQuestions } from './src/pdfPipeline.js';

const questions = await parsePdfQuestions('/pdfs/tema-01.pdf');
console.log(questions);
```
