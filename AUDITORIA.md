# Auditoría de LabQuiz 2.0

Fecha: 24/09/2026 · Commit auditado: `f96af05`

## Resumen

| Área | Estado |
|---|---|
| Build (`npm run build`) | ✅ Compila sin errores |
| Dependencias (`npm audit`) | ✅ 0 vulnerabilidades |
| Banco de preguntas (6.282 preguntas, temas 1–20) | ✅ Todas las `correctAnswer` son índices válidos y no hay IDs duplicados |
| Explicaciones (2.056) | ✅ Coinciden con la respuesta correcta de su pregunta en el 100 % de los casos |
| Lógica del test | ⚠️ 2 bugs que afectan a lo que ve la usuaria (ver 🔴) |
| Temas 21–23 | ⚠️ Incompletos o sin preguntas |
| Rendimiento | ⚠️ JS de 4,6 MB y 79 MB de PDFs en el build |
| Tests automáticos / CI | ❌ No hay |

Las comprobaciones de datos se hicieron cargando los módulos reales de la app con Vite y recorriendo el banco completo.

---

## ✅ Estado de las correcciones (segunda ronda)

| # | Punto | Estado |
|---|---|---|
| 1 | Barajado de opciones que citan letras | ✅ Corregido. `npm run check:data` lo comprueba |
| 2 | Navegación a «Test» | ✅ Corregido: el menú, «Ver todos», los estados vacíos y «Hacer test» de cada tema abren el test que corresponde |
| 3 | Test en curso | ✅ Se guarda en el navegador y el selector ofrece «Continuar / Descartar». Si alguna pregunta cambió en el banco, se descarta |
| 4 | Temas 21–23 | ✅ Convertidos a JSON: 21 (103, con 21.2 Fármacos), 22 (124) y 23 (500). Ver la nota de abajo |
| 6 | «Temas iniciados» incoherente | ✅ Ahora se calcula igual en Inicio y en Progreso |
| 8 | Fallo al guardar el progreso | ✅ Se muestra un aviso con acceso a la copia de seguridad |
| — | Explicaciones del tema 1 | ✅ Se muestran «Ojo en el examen» y el motivo de cada opción incorrecta, también con las opciones barajadas |
| — | Accesibilidad | ✅ `aria-label` en el menú móvil y las tarjetas de resumen se pueden usar con el teclado |
| 5, 7, 9 y resto | Duplicados, auto-aprendida, tamaño del bundle, código muerto… | ⏸️ Pendientes. Cambian datos o la estructura, así que se decidirán aparte |

**Corrección a la primera versión de este informe (punto 4):** decía que el lector de PDF extraía bien los temas 21 y 22, pero no era así. La comprobación tenía un error (`null >= 0` es `true` en JavaScript). En realidad, alrededor del **85 % de las preguntas se quedaban sin respuesta correcta**, así que cualquier respuesta se marcaba como fallada. La causa estaba en `pdfReader.js`: no restauraba el color de relleno después de `save/restore` y perdía casi todos los resaltados amarillos. Ya está corregido, el lector descarta las preguntas que no tienen exactamente una opción resaltada, y `scripts/import-pdf-topics.mjs` genera los JSON. Algunas preguntas no se pueden extraer por la maquetación del PDF (por ejemplo, unas 70 del tema 22). También se ha excluido una pregunta que depende de una imagen (pictograma).

> Si ya practicaste los temas 21 o 22, puede que algunas preguntas aparezcan en «Preguntas falladas» por culpa de este error. El progreso se ha conservado tal cual. Puedes quitarlas con «Marcar como aprendida».

---

## 🔴 Prioridad alta (dan respuestas incorrectas o rompen la navegación)

### 1. Se barajan opciones que hacen referencia a otras por letra
`src/smartQuestionSelector.js:95` — el patrón `SELF_REFERENTIAL_OPTION_PATTERN` no detecta variantes muy frecuentes en el banco:

- `A, B, y C son ciertas` (coma antes de la «y»)
- `B y C son ciertos` (masculino: el patrón solo reconoce `cierta/ciertas`)
- `B y C` (sin verbo)

**37 preguntas** se barajan aunque tienen una de estas opciones. Por ejemplo, en tema 4 pregunta 18 la respuesta correcta es «B y C son ciertos», pero tras barajar las opciones B y C ya no son las mismas, así que la respuesta marcada como correcta deja de tener sentido. Otros ejemplos: tema 2 preguntas 35, 42, 43 y 44, y tema 4 pregunta 20.

**Solución:** ampliar el patrón para que acepte listas de letras separadas por comas o «y/o» y el género masculino, o hacer la regla más estricta y no barajar nunca una pregunta con una opción que contenga dos letras aisladas (A–D).

### 2. El botón «Test» del menú vuelve a abrir el último test en lugar del selector de temas
`src/main.jsx:51-53, 70` — `testConfig` sobrevive al cambiar de página. `TestPage` se desmonta y se vuelve a montar con la configuración anterior, así que:

- Después de «Hacer todas las falladas», el menú **Test** abre otra vez un test de falladas.
- Después de un test del tema 5, **Test** (o «Ver todos» en Inicio) empieza otro test del tema 5 en lugar de mostrar el selector.
- En la página de un tema, «Hacer test» (`main.jsx:155`) no abre el test de ese tema, sino el último que se configuró.

**Solución:** hacer que la navegación a `"test"` desde el menú llame a `openTest(null)`, y que en `TopicPage` se llame a `openTest(topic.id)`.

### 3. Si sales de un test, pierdes el que estaba en curso
`TestPage` guarda las respuestas solo en el estado de React. Al cambiar de página o recargar, el test en curso se pierde, aunque el progreso de cada pregunta sí se guarda. En `storage.js` ya existen `saveTestSession`, `loadSavedTest` y `clearTestSession`, pero ninguna se usa.

---

## 🟠 Prioridad media

### 4. Temas 21, 22 y 23
- **Tema 21**: sin banco. Se leen en tiempo real las preguntas del PDF, pero `getPdfUrl` solo devuelve el primero que coincide (`21.1 Drogas de abuso`, con 42 preguntas). **El PDF 21.2 Fármacos nunca se carga.**
- **Tema 22**: el PDF se lee en tiempo real y da 134 preguntas.
- **Tema 23**: los 5 PDFs se llaman `23. Test …`, que no coincide con el patrón `tema|topic`, así que la app muestra «Sin preguntas cargadas».
- Las preguntas que se leen de un PDF **no cuentan** para Progreso, Preguntas falladas, Repaso general ni Inicio, porque todas esas pantallas leen solo el banco estático. Si fallas una pregunta del tema 22, nunca aparecerá en «Preguntas falladas».

**Solución:** convertir los PDFs a JSON con el mismo proceso que los temas 2–20. `pdfReader` ya extrae bien esos PDFs.

### 5. Una pregunta fallada no sale de «Falladas» hasta que la marcas a mano
`isQuestionCurrentlyFailed` solo depende de `vecesFallada > 0` y `marcadaAprendida`. Aunque aciertes una pregunta 5 veces seguidas, sigue en la lista. El campo `pendienteRecuperacion` se guarda, pero nunca se lee. Como mejora, se podría quitar de la lista de forma automática tras N aciertos seguidos (`rachaAciertos`).

### 6. Métricas incoherentes entre pantallas
«Temas iniciados» se calcula como `answered > 0` en Inicio (`main.jsx:103`) y como `mastery > 0` en Progreso (`main.jsx:288`). Si fallas la primera pregunta de un tema, ese tema cuenta en Inicio pero no en Progreso.

### 7. Preguntas duplicadas
Hay **116 preguntas repetidas** dentro de un mismo tema, con el mismo enunciado y las mismas opciones. Ninguna tiene respuestas contradictorias. Otras ~300 comparten enunciado pero tienen opciones distintas. Los duplicados exactos inflan el total y hacen que se repitan preguntas en un mismo test. Por ejemplo, el tema 13 tiene 60 enunciados repetidos.

### 8. Espacio de `localStorage`
Si se responde todo el banco, `progress` ocupa unos **2,5 MB**. Cabe en el límite habitual de ~5 MB, pero si `setItem` falla, `saveUserData` solo lo escribe en la consola: **la usuaria no se entera de que su progreso ha dejado de guardarse**. Conviene mostrar un aviso y recomendar descargar una copia de seguridad.

### 9. Rendimiento y tamaño del build
- El bundle JS pesa **4,6 MB** (1,2 MB en gzip). Incluye todas las preguntas, todas las explicaciones y `pdfjs-dist`, aunque solo lo necesitan los temas 21 y 22. Se recomienda cargar cada tema con `import()` dinámico y cargar `pdfReader` en diferido.
- `import.meta.glob("/pdfs/*.pdf", {eager:true})` copia en `dist/` **los 36 PDFs de tests con respuestas**, además de los 26 temarios, aunque la app solo usa unos pocos. En total son unos 79 MB desplegados.

---

## 🟡 Prioridad baja / pulido

- **Funciones de la interfaz que no hacen nada o no se ven:**
  - «Marcar para repasar» en la página del tema no tiene `onClick`.
  - «Preguntas que debes dominar» es un texto de relleno.
  - `SimulacrumPage` no se puede abrir desde ningún sitio.
  - «Preguntas favoritas» promete «Practica las que guardes», pero solo muestra una lista y no deja hacer un test con ellas.
- **Explicaciones:** `porQueNoLasOtras` y `ojoEnElExamen` (5 explicaciones del tema 1) nunca se muestran en `ExplanationDisplay`.
- **Test:** puedes pulsar «Siguiente» sin responder. Las preguntas saltadas cuentan como fallos en la nota final, pero no se registran en el progreso.
- **Selector de nº de preguntas:** si empiezas desde Inicio o Progreso, el test siempre tiene 20 preguntas y no respeta lo que elegiste antes.
- **`useEffect` que carga el PDF** (`main.jsx:197-209`): le faltan dependencias (`questionProgress`, `questionCount`).
- **Accesibilidad:**
  - Las tarjetas de resumen son `<article onClick>`, así que no se pueden usar con el teclado.
  - El botón de menú móvil no tiene `aria-label`.
  - El saludo «Hola, Alana 👋» está escrito directamente en el código.
- **Copias de seguridad:** `parseBackup` acepta cualquier campo extra y no comprueba el formato de `favorites` ni de cada entrada de `progress`.

---

## 🧹 Mantenimiento del repositorio

- **Código muerto:**
  - `src/components/SecondaryPages.jsx` y `src/lib/analytics.js` no se importan desde ningún sitio.
  - `src/lib/topics.js` solo lo usa ese código muerto, y además tiene títulos distintos a los de `main.jsx` (por ejemplo «Conceptos básicos» frente a «Conceptos generales»).
  - Funciones sin usar: `selectQuestionsByMode`, `validateQuestionSync`, `hasQuestionEverFailed` y las funciones de sesión de `storage.js`.
- **Código duplicado:** `topic-02.js` … `topic-20.js` repiten la misma función `convertQuestions` con pequeñas variaciones. Se podría extraer a un helper común.
- **Repositorio pesado:** `.git` ocupa 66 MB y hay 79 MB de PDFs versionados. Además está `LabQuiz-2.0-prototipo-completo.zip`, que es una versión antigua del prototipo y sobra.
- **`package.json`:**
  - `vite` y `@vitejs/plugin-react` deberían ir en `devDependencies`.
  - No hay script de `lint` ni de `test`.
- **Sin tests ni CI.** Las comprobaciones de este informe, como la validez de `correctAnswer`, los duplicados, que las explicaciones coincidan con la respuesta correcta o que no se barajen opciones que citan letras, se podrían convertir en un script `npm run check:data` que se ejecute en cada push.
- **README.md desactualizado:** describe el prototipo inicial («Simulacro», «23 temas con plantilla»), no el estado actual.

---

## Plan de acción recomendado

1. Arreglar el patrón de barajado (#1) y la navegación a Test (#2). Son cambios pequeños con mucho impacto.
2. Convertir a JSON los temas 21 (incluido 21.2), 22 y 23 (#4).
3. Quitar las 116 preguntas duplicadas (#7) y añadir `npm run check:data` como test de regresión del banco.
4. Guardar el test en curso (#3) y avisar si falla el guardado (#8).
5. Dividir el código por temas y dejar de copiar al build los PDFs que no se usan (#9).
6. Limpiar el código muerto, el `.zip` y actualizar el README.
