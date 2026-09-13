export default {
  id: 8,
  title: "Hematología",
  intro:
    "Fisiología y metabolismo eritrocitario, leucocitario y plaquetar: características de la sangre, hematíes, hemoglobina, anemias, hemoglobinopatías, leucocitos, leucemias y plaquetas.",
  status: "Tema 8.1 y 8.2 completos",
  sections: [
    {
      heading: "🩸 Características y funciones de la sangre",
      points: [
        "Tejido conjuntivo especializado con fase sólida (**elementos formes**: hematíes, leucocitos y plaquetas) y fase líquida (**plasma**: proteínas, hormonas, anticuerpos, vitaminas...).",
        "Funciones: **respiratoria** (transporte de O2/CO2), **nutritiva**, **excretora** (urea, ácido úrico, creatinina), **inmunitaria**, **homeostática** (pH, electrolitos, volumen), **hemostática** (coagulación) y **termorreguladora**.",
        "**Volemia ≈ 5 L** (normovolemia/hipervolemia/hipovolemia). **Densidad 1052-1060 g/L** (depende sobre todo de los hematíes). **pH entre 7,35 y 7,45**.",
        "Viscosidad: depende principalmente del **hematocrito**; __a mayor hematocrito, mayor viscosidad__.",
      ],
    },
    {
      heading: "🧪 Preanalítica en hematología",
      points: [
        "Hemograma: **EDTA** es la muestra de elección (K2 o K3; se recomienda **K2**, que altera menos el VCM).",
        "VSG: **citrato 4:1** (tapón negro) — __no confundir__ con el **citrato de coagulación 9:1** (tapón azul). También puede hacerse en EDTA.",
        "**Pseudoplaquetopenia por EDTA** (agregados): __recontar plaquetas en citrato__ (tapón azul).",
      ],
    },
    {
      heading: "⏱️ Velocidad de sedimentación globular (VSG)",
      points: [
        "Prueba **inespecífica**. Fases: agregación en pilas de monedas o rouleaux (10 min), sedimentación (45 min) y concentración en el fondo del tubo.",
        "**Aumentada** en: infecciones agudas, inflamación, embarazo, anemias intensas, macrocitosis, neoplasias, gammapatía monoclonal, síndrome nefrótico, edad, vejez.",
        "**Disminuida** en: policitemia, anemia drepanocítica, esferocitosis, microcitosis, hiperglucemia, hipofibrinogenemia, leucocitosis extrema.",
        "Métodos: **Westergren** (manual, de referencia; lectura a 60 y 120 min), **Wintrobe** (manual, menos sensible) y automático.",
      ],
    },
    {
      heading: "🔬 Técnicas instrumentales y microscópicas",
      points: [
        "**Contador Coulter** (conductimetría/impedancia): cada célula interrumpe la corriente al pasar por el orificio; el nº de interrupciones indica el nº de partículas y la intensidad del voltaje su tamaño.",
        "**Citometría de flujo**: anticuerpos monoclonales marcados con fluorocromos excitados por láser; permite inmunofenotipo, cuantificación de ADN/ARN y separación celular.",
        "Cámaras de recuento (Neubauer, Thoma, Bürker) con líquidos de dilución: **Hayem** para hematíes (1/200), **Türk** para leucocitos (1/20) y **Rees-Ecker** para plaquetas (1/100).",
        "Frotis: tinciones panópticas con **eosina** (tiñe de rojo la hemoglobina) y **azul de metileno** (tiñe de azul los ácidos nucleicos): Giemsa, May-Grünwald, Wright, Romanowsky.",
        "Tinciones específicas: **Perls** para hemosiderina (siderocitos); **azul de cresil brillante** (tinción vital) para reticulocitos.",
      ],
    },
    {
      heading: "🔴 Serie roja: los hematíes",
      points: [
        "Célula bicóncava (7-8,5 μm), anucleada y sin orgánulos (sin ribosomas, mitocondrias ni Golgi); **vida media 120 días**.",
        "Eritropoyesis regulada por **eritropoyetina (EPO)** renal: proeritroblasto → basófilo (inicia Hb) → policromatófilo (__último con mitosis__) → ortocromático → reticulocito (ARN) → eritrocito.",
        "Destrucción a los 120 días en bazo e hígado (**hemocateresis** o **eriptosis**).",
        "Descenso de eritrocitos = **eritrocitopenia**; aumento = **policitemia** (primaria, mutación JAK2, o secundaria por hipoxia).",
      ],
    },
    {
      heading: "📊 Hemograma: parámetros eritrocitarios",
      points: [
        "Hemoglobina: método de **cianmetahemoglobina** (espectrofotometría); la lipemia puede dar falsos aumentos.",
        "Hematocrito (**valores de referencia 38-47%**): micrométodo (centrifugación 10.000-15.000 rpm, método más usado) o macrométodo con tubos de Wintrobe.",
        "Índices de distribución eritrocitaria (anisocitosis): **RDW-SD (37-54 fL)** y **RDW-CV (11-16%)**.",
        "Regla práctica en individuos sanos: __Hemoglobina x 3 = Hematocrito__.",
      ],
    },
    {
      heading: "🔎 Alteraciones morfológicas de los hematíes",
      points: [
        "Tamaño (VCM): normocitosis; **microcitosis (<80 fL)**: ferropénica, sideroblástica, talasemias; **macrocitosis (>100 fL)**: megaloblástica, aplásica, hepatopatías; megalocitosis (>11 μm); anisocitosis (se refleja en el RDW).",
        "Forma (__poiquilocitosis si es adquirida__, no en congénitas): acantocitos (hepatopatías), estomatocitos (alcoholismo), equinocitos (déficit ATP/piruvato quinasa), dianocitos (talasemia, HbC), esquistocitos/dacriocitos (CID, mielofibrosis), **drepanocitos (HbS)**, **esferocitos** (esferocitosis hereditaria).",
        "Color (HCM/CHCM): **hipocromía** (ferropénica), **hipercromía** (esferocitosis), **policromasia** (reticulocitos jóvenes, ricos en ARN) y anisocromía.",
        "Inclusiones: **punteado basófilo** (saturnismo), **cuerpos de Howell-Jolly** (esplenectomía), **cuerpos de Pappenheimer** (siderocitos, anemia sideroblástica), **anillos de Cabot** (diseritropoyesis), **cuerpos de Heinz** (déficit de G6PDH).",
        "Agrupación: **rouleaux** (mieloma múltiple), __crioaglutininas__ (IgM, aglutinan en frío) frente a __crioglobulinas__ (inmunoglobulinas que precipitan de forma reversible en frío).",
      ],
    },
    {
      heading: "🅾️ Hemoglobina",
      points: [
        "Heteroproteína: **grupo hemo** (Fe2+, transporta O2; si se oxida a Fe3+ es **metahemoglobina**, valor de referencia <1%) + **globina** (4 cadenas de 140 aminoácidos).",
        "Estados: oxihemoglobina (saturada de O2), desoxihemoglobina (libre), carbaminohemoglobina (con CO2) y **carboxihemoglobina** (con CO, __muy peligrosa__).",
        "Curva de disociación sigmoidea; favorecen la liberación de O2: ↑temperatura, ↓pH, ↑CO2, ↑2,3-bifosfoglicerato. **P50 ≈ 25-28 mmHg**.",
        "Técnica de elección: **cianmetahemoglobina** (espectrofotometría a 540 nm).",
        "Tipos en adulto: **HbA1 (97%)**, **HbA2 (2%)**, **HbF (1%)**; en el feto predomina la **HbF (98%)**.",
        "**Test de Kleihauer** y **test de Rosette**: detectan hemorragia fetomaterna en madres Rh D negativo (la HbF es más resistente al medio ácido).",
      ],
    },
    {
      heading: "⚙️ Metabolismo del hierro",
      points: [
        "Se absorbe como **Fe2+** y se transporta unido a la **transferrina** como Fe3+.",
        "Reserva: **ferritina** (forma soluble) y **hemosiderina** (forma insoluble), en macrófagos de médula ósea, bazo e hígado.",
        "Proteínas clave: ferrorreductasa, hefaestina y **hepcidina** (regula la salida de hierro; __a más hepcidina, menos hierro se libera a la sangre__).",
        "Ferritina y transferrina son **reactantes de fase aguda**: en inflamación __la ferritina aumenta y la transferrina disminuye__.",
        "% saturación de transferrina = (hierro sérico / transferrina) x 100; **referencia 15-55%**.",
      ],
    },
    {
      heading: "📉 Anemias",
      points: [
        "La anemia es __un signo__ (descenso de Hb), __no una enfermedad__; se clasifica según la capacidad regenerativa (↑ reticulocitos = regenerativa).",
        "**Anemia ferropénica**: __la más frecuente__; ↓ferritina (primer parámetro alterado), ↓sideremia, ↓IST, ↓VCM, ↓HCM, ↑transferrina y ↑RDW.",
        "**Anemia sideroblástica**: eritropoyesis ineficaz con acúmulo de hierro mitocondrial (sideroblastos en anillo); ↑sideremia, ↑ferritina, ↑IST, cuerpos de Pappenheimer.",
        "**Anemias hemolíticas**: ↑LDH, ↓haptoglobina, ↑bilirrubina indirecta, ↑reticulocitos. Causas intracorpusculares (G6PDH, piruvato quinasa, HPN) o extracorpusculares (autoinmunes, mecánicas).",
        "**Hemoglobinuria paroxística nocturna**: mutación adquirida del gen PIG-A, déficit de GPI y sensibilidad al complemento; se estudia por citometría de flujo (CD55/CD59) y pruebas de Ham-Dacie y Donath-Landsteiner.",
      ],
    },
    {
      heading: "🧬 Hemoglobinopatías",
      points: [
        "**Talasemias** (cuantitativas): defecto en la síntesis de una cadena de globina. **Alfa**: HbH y Hb Bart (incompatible con la vida). **Beta** (más frecuente): forma homocigota grave (**anemia de Cooley**) con HbA2 elevada.",
        "**Hemoglobinopatías estructurales** (cualitativas): cambio de aminoácido. **HbS** o anemia drepanocítica (ácido glutámico → valina en posición 6 de la cadena β, da drepanocitos), **HbC** (glutámico → lisina) y HbS-C.",
        "Diagnóstico de talasemias: hierro y ferritina normales, VCM bajo, reticulocitos normales/aumentados, electroforesis y cuantificación de HbF/HbA2, análisis de ADN.",
      ],
    },
    {
      heading: "⚪ Leucocitos: tipos, tinciones y hallazgos no patológicos",
      points: [
        "Mononucleares: **monocitos (12-20 μm)** y **linfocitos (7-8 μm)**. Polinucleares o granulocitos (8-12 μm): neutrófilos, eosinófilos y basófilos (estos dos últimos con núcleo bilobulado).",
        "Mismas tinciones panópticas que en la serie roja: la **eosina** (ácida) tiñe de rojo los componentes acidófilos y el **azul de metileno** (básico) tiñe de azul/violeta los componentes basófilos (ácidos nucleicos).",
        "Hallazgos no patológicos: **corpúsculo de Barr** en neutrófilos de mujeres (inactivación del cromosoma X) y vacuolas en monocitos.",
      ],
    },
    {
      heading: "🧫 Maduración y valoración de los neutrófilos",
      points: [
        "**Gránulos primarios o azurófilos** (desde el promielocito): mieloperoxidasa, enzimas lisosómicas, proteínas antimicrobianas. **Gránulos secundarios o específicos** (desde el mielocito): lactoferrina, lisozima, gelatinasas.",
        "**Recuento de Schilling**: % formas inmaduras / % formas maduras; si es __>0,2 hay desviación a la izquierda__ (sugiere sepsis en neonatos).",
        "**Índice de Arneth** o de lobularidad: nº de lóbulos / nº de neutrófilos; __<1,9 desviación a la izquierda__ y __>3 desviación a la derecha__ (pleocariocitos de Pittaluga).",
      ],
    },
    {
      heading: "🛡️ Funciones de granulocitos, monocitos y linfocitos",
      points: [
        "**Neutrófilos**: fagocitosis. **Eosinófilos**: reacciones anafilácticas y control de parasitosis. **Basófilos**: reacciones de hipersensibilidad y alergias. **Mastocitos**: gránulos de histamina y proteasas (triptasa, quimasa).",
        "**Monocitos**: permanecen en sangre periférica __12-24 horas__ y luego migran a los tejidos convirtiéndose en **macrófagos** (sistema fagocítico mononuclear).",
      ],
    },
    {
      heading: "🔍 Alteraciones cualitativas de los leucocitos",
      points: [
        "**Pelger-Hüet**: neutrófilos con núcleos bilobulados. **Pleocariocito de Pittaluga**: neutrófilo con más de 5 lóbulos (anemia megaloblástica).",
        "**Cuerpos de Döhle** (ARN ribosomal, anomalía de May-Hegglin), granulación tóxica y vacuolas tóxicas: infecciones, fármacos, hemopatías.",
        "**Sombras de Gumprecht** (linfocitos rotos, característico de **LLC**) y **bastones de Auer** (leucemias mieloides agudas, ej. promielocítica).",
        "**Linfocito activado** o células de Downey (infecciones víricas); **tricoleucemia** o «células peludas».",
      ],
    },
    {
      heading: "📈 Alteraciones cuantitativas de los leucocitos",
      points: [
        "Sufijo **-citosis = aumento**; **-penia = disminución**. Neutrófilos y linfocitos aumentan sobre todo en infecciones; eosinófilos en alergias/parasitosis; basófilos en síndromes mieloproliferativos crónicos.",
        "**Pancitopenia**: disminución de las tres series (eritrocitos, leucocitos y plaquetas); __descartar primero errores preanalíticos__ (muestra de vía con medicación, coágulo, etc.).",
        "En niños hay más leucocitos y linfocitos, y menos neutrófilos que en el adulto.",
      ],
    },
    {
      heading: "🎗️ Leucemias, linfomas y síndromes mielodisplásicos/mieloproliferativos",
      points: [
        "**Leucemias**: se clasifican por estirpe (mieloide/linfoide) y agresividad (aguda/crónica): LMA, LLA, LMC, LLC. __Diagnóstico definitivo en médula ósea__; punto de corte **≥20% de blastos** para leucemia aguda.",
        "**Hiato leucémico**: formas inmaduras y maduras __sin formas intermedias__, signo sugerente de leucemia aguda (en las crónicas se ven todos los estadios).",
        "Clasificación **FAB** (M0-M7, morfológica) frente a clasificación **OMS** (factores pronósticos).",
        "Linfomas: **Hodgkin** (células de Reed-Sternberg) frente a **no Hodgkin**.",
        "**Síndromes mielodisplásicos**: hematopoyesis ineficaz y clonal, displasia morfológica y citopenias en sangre periférica.",
        "**Síndromes mieloproliferativos crónicos**: LMC (**cromosoma Philadelphia t(9;22)**, gen BCR-ABL, presente en el **90%** de los casos), policitemia vera y trombocitemia esencial (**mutación JAK2 V617F**), y mielofibrosis primaria.",
      ],
    },
    {
      heading: "🧪 Pruebas diagnósticas oncohematológicas",
      points: [
        "**Citometría de flujo**: gating (separación de poblaciones celulares) mediante tamaño, granularidad y antígenos CD marcados con fluorocromos. **CD45** se expresa en casi todas las células sanguíneas; **CD34/TdT** marcan blastos.",
        "Citoquímica: **mieloperoxidasa** y **Sudán negro B** (blastos mieloides), **PAS en bloques** (linfoblastos), **TdT** (positiva en linfoblastos), **FAG** (baja en LMC) y **fosfatasa ácida resistente a tartrato** (tricoleucemia).",
        "Citogenética y biología molecular: cariotipo, FISH y PCR para detectar translocaciones (**BCR-ABL** en LMC, **MYC** en linfoma de Burkitt, **PML-RARα** en leucemia promielocítica aguda).",
      ],
    },
    {
      heading: "🦠 Mononucleosis infecciosa y mieloma múltiple",
      points: [
        "**Mononucleosis infecciosa**: virus de **Epstein-Barr**, linfocitos activados, anticuerpos heterófilos IgM (reacción de Paul-Bunnell-Davidsohn).",
        "**Mieloma múltiple**: células plasmáticas que producen una inmunoglobulina monoclonal (**paraproteína**), rouleaux en sangre periférica. Síntomas **CRAB**: hiperCalcemia, daño Renal, Anemia, lesiones óseas (Bone). **MGUS** = estado premieloma sin síntomas.",
      ],
    },
    {
      heading: "🧬 Alteraciones hereditarias de los leucocitos",
      points: [
        "**Anomalía de Chédiak-Higashi**: gránulos lisosómicos gigantes, alteración de la fagocitosis, albinismo y neutropenia.",
        "**Anomalía de May-Hegglin**: trombocitopenia y macroplaquetas con cuerpos de Döhle; __la función leucocitaria no se ve afectada__.",
        "**Anomalía de Pelger-Hüet**: hiposegmentación nuclear, sin alteraciones inmunológicas asociadas.",
      ],
    },
    {
      heading: "🟡 Plaquetas: características, estructura y función",
      points: [
        "Fragmentos citoplasmáticos anucleados de los megacariocitos (2-4 μm); **recuento normal 140.000-400.000/mm³**; **vida media 8-13 días**; producción regulada por la **trombopoyetina**.",
        "Funciones: control de hemorragias (hemostasia primaria), activación de la hemostasia secundaria (factor plaquetario 3) y retracción del coágulo de fibrina.",
        "Gránulos **alfa** (los más frecuentes: factor plaquetario 4, PDGF, fibrinógeno, factor von Willebrand) y gránulos **densos** (serotonina, ADP, ATP, calcio).",
        "Integrinas de membrana: complejo **Ib-IX** (unión al factor von Willebrand en reposo) y complejo **IIb-IIIa** (receptor de fibrinógeno cuando se activan).",
      ],
    },
    {
      heading: "🩹 Alteraciones de las plaquetas",
      points: [
        "**Trombopenia <130.000/mm³** (__riesgo de hemorragia grave si <50.000/mm³__); **trombocitosis >400.000/mm³**. La pseudotrombocitopenia por EDTA obliga a __repetir el recuento en citrato__.",
        "Trombopatías congénitas: **síndrome de Bernard-Soulier** (déficit del complejo GPIb-IX, defecto de adhesión, plaquetas gigantes) y **trombastenia de Glanzmann** (déficit de GPIIb-IIIa, defecto de agregación).",
        "**Púrpura trombocitopénica idiopática (PTI)**: anticuerpos antiplaquetas, tiempo de sangría alargado con TP y APTT normales. **Trombocitemia esencial**: 750.000-1.000.000/mm³.",
        "**Enfermedad de von Willebrand**: __diátesis hemorrágica hereditaria más frecuente__; déficit cuantitativo (tipos 1 y 3) o cualitativo (tipo 2) del factor von Willebrand.",
      ],
    },
  ],
  keyFacts: [
    "Hematocrito de referencia: **38-47%**",
    "pH sanguíneo: **7,35-7,45**",
    "Vida media del hematíe: **120 días**",
    "Reticulocitos: hombres **0,6-2,6%** · mujeres **0,4-2,4%** · recién nacidos **2,5-6,5%**",
    "RDW-SD: **37-54 fL** · RDW-CV: **11-16%**",
    "Ferritina: hombres **30-300 μg/L** · mujeres **30-200 μg/L**",
    "Transferrina: **200-400 mg/dL** · saturación de referencia **15-55%**",
    "Hb (criterio OMS de anemia): hombre **<13 g/dL** · mujer **<12 g/dL** · embarazada **<11 g/dL**",
    "Microcitosis **<80 fL** · Macrocitosis **>100 fL**",
    "Hemoglobina adulta: HbA1 **97%** · HbA2 **2%** · HbF **1%**",
    "Plaquetas: **140.000-400.000/mm³** · vida media **8-13 días** · reguladas por trombopoyetina",
    "Trombopenia **<130.000/mm³** (riesgo hemorrágico grave **<50.000/mm³**) · Trombocitosis **>400.000/mm³** · Trombocitemia esencial **750.000-1.000.000/mm³**",
    "Recuento de Schilling **>0,2** = desviación a la izquierda; índice de Arneth **<1,9** = izquierda, **>3** = derecha",
    "Leucemia aguda: **≥20%** de blastos en médula ósea · Cromosoma Philadelphia t(9;22) BCR-ABL presente en el **90%** de las LMC",
  ],
  commonMistakes: [
    "Confundir el citrato de la VSG (**4 sangre:1**, tapón negro) con el citrato de coagulación (**9:1**, tapón azul).",
    "Confundir __anemia ferropénica__ (hierro, ferritina e IST bajos) con __anemia sideroblástica__ (hierro y ferritina altos, con cuerpos de Pappenheimer).",
    "Confundir __crioaglutininas__ (IgM que aglutina hematíes en frío) con __crioglobulinas__ (inmunoglobulinas que precipitan de forma reversible en frío).",
    "Confundir __hemosiderina__ (insoluble, Perls positivo) con __ferritina__ (forma de reserva soluble).",
    "Confundir __alfa-talasemia__ (HbH, Hb Bart) con __beta-talasemia__ (HbA2 elevada, anemia de Cooley).",
    "Confundir __desviación a la izquierda__ (formas inmaduras, típica de infección) con __desviación a la derecha__ (hipersegmentación, pleocariocitos de Pittaluga, anemia megaloblástica).",
    "Confundir __síndrome de Bernard-Soulier__ (déficit GPIb-IX, defecto de adhesión) con __trombastenia de Glanzmann__ (déficit GPIIb-IIIa, defecto de agregación).",
    "Confundir el __hiato leucémico__ (leucemia aguda, sin formas intermedias) con la presencia de todos los estadios madurativos (típica de leucemia crónica).",
    "No repetir en citrato ante una plaquetopenia sospechosa: __descartar siempre la pseudotrombocitopenia por EDTA__.",
  ],
  mnemonics: [
    "Tubos: **EDTA** para el hemograma, **citrato 4:1** para la VSG y **citrato 9:1** para la coagulación.",
    "Eritropoyesis: **Pro-Baso-Poli-Orto-Reti-Eri** (proeritroblasto, basófilo, policromatófilo, ortocromático, reticulocito, eritrocito).",
    "Ferropénica: casi todo baja (hierro, ferritina, IST, VCM), __solo suben la transferrina y el RDW__.",
    "Mieloma múltiple, síntomas **CRAB**: hiperCalcemia, daño Renal, Anemia, lesiones óseas (Bone).",
    "Desviación del neutrófilo: __izquierda = inmaduro/infección__; __derecha = hipersegmentado/megaloblástica__.",
  ],
};
