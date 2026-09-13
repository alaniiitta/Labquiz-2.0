export default {
  id: 9,
  title: "Coagulación",
  intro:
    "Hemostasia primaria, coagulación y fibrinólisis: factores de la coagulación, vías intrínseca/extrínseca/común, pruebas de laboratorio, fármacos anticoagulantes, hemofilias, CID y enfermedad de Von Willebrand.",
  status: "Tema 9 completo",
  sections: [
    {
      heading: "🩹 Hemostasia primaria",
      points: [
        "Conjunto de mecanismos para detener las hemorragias y mantener la integridad del sistema circulatorio. Tres fases: **hemostasia primaria**, **coagulación** y **fibrinólisis**.",
        "Función provisional: forma el trombo plaquetario mientras se produce la coagulación. El primer componente en actuar es la **pared vascular** (capas endotelial, subendotelial, muscular y adventicia).",
        "**Vasoconstricción**: forma inmediata mediada por el sistema nervioso simpático y forma tardía por sustancias plaquetarias como el **tromboxano A2**.",
        "**Adhesión plaquetaria**: requiere la **GPIb** de la membrana plaquetaria y el **factor de von Willebrand (FvW)**, que se unen al colágeno subendotelial expuesto.",
        "**Agregación plaquetaria**: mediada principalmente por el **ADP**; la GPIIb-IIIa se une al fibrinógeno. Dura __3-10 minutos__. __La causa más frecuente de sangrado es la trombopenia__.",
      ],
    },
    {
      heading: "🧵 Coagulación y fibrinólisis",
      points: [
        "Sobre el trombo plaquetario se forma una red de fibrina que da lugar al **coágulo** (si viaja, **émbolo**; si permanece fijo, **trombo**). Dura __5-10 minutos__.",
        "El **fibrinógeno** (proteína soluble) se transforma en **fibrina** (insoluble) mediante una cascada de reacciones de los factores de la coagulación.",
        "**Fibrinólisis**: transformación del **plasminógeno** en **plasmina**, que hidroliza la fibrina y genera productos de degradación (PDF): precoces (X, Y) y tardíos (E y **dímero D**).",
        "Activadores de la fibrinólisis: **u-PA** y **t-PA**. Inhibidores: **PAI-1**, **PAI-2**, **TAFI** y alfa-2-antiplasmina.",
      ],
    },
    {
      heading: "🔢 Factores de la coagulación: clasificación",
      points: [
        "Proteínas inactivas en el torrente circulatorio que se activan en cascada para transformar el fibrinógeno en fibrina.",
        "Por procedencia: **hepáticos** (I, II, V, VII, VIII, IX, X, XIII, precalicreína, HMWK), tisulares (FP3, tromboplastina) y plaquetarios.",
        "Por sensibilidad: **vitamina K dependientes (X, IX, II, VII)** y **sensibles a la trombina (I, V, VIII, XIII)**, que se consumen durante la coagulación.",
        "Regla nemotécnica: __«Factores vitamina K son los de la generación del 27» (1927: X, IX, II, VII__; también proteínas C y S).",
      ],
    },
    {
      heading: "📋 Factores de la coagulación más preguntables",
      points: [
        "**Factor I (fibrinógeno)**: forma plasmática de síntesis hepática y forma plaquetaria de los megacariocitos; __ausente en el suero__.",
        "**Factor II (protrombina)**: hepático, __vitamina K dependiente__, vida media 4-6 días; se activa mediante el complejo **protrombinasa** (Xa + Va + Ca²⁺); factor común a ambas vías.",
        "**Factor III (tisular o tromboplastina)**: inicia la **vía extrínseca** al liberarse tras un traumatismo, activando al factor VII.",
        "**Factor V**: se activa por la trombina y actúa como cofactor; se inhibe por la **proteína C**. El **factor V Leiden** (mutación G1691A) es la causa hereditaria más frecuente de hipercoagulabilidad.",
        "**Factor VIII**: viaja en sangre unido al FvW, que lo protege; su déficit causa la **hemofilia A** (cromosoma X).",
        "**Factor IX**: vitamina K dependiente; su déficit causa la **hemofilia B** o enfermedad de Christmas.",
        "**Factor XII o de Hageman**: activa la vía intrínseca por contacto con superficies de carga negativa; __su déficit no produce clínica hemorrágica__.",
        "**Factor XIII**: estabiliza el coágulo de fibrina; su déficit provoca la __disolución precoz del coágulo__ (prueba con urea 5M o ácido monocloroacético).",
      ],
    },
    {
      heading: "🛤️ Vías de la coagulación",
      points: [
        "**Vía intrínseca**: factores XII, XI, IX y VIII (+ precalicreína y HMWK); se explora con el **TTPA**.",
        "**Vía extrínseca**: factor tisular (III), VII y calcio; se explora con el **TP**.",
        "**Vía común**: factores X, V, II (protrombina → trombina) y I (fibrinógeno → fibrina); se explora con el **TT**.",
        "Reglas nemotécnicas: __extrínseca = TaPa__, __intrínseca = IN-APeTTencia__. Regla del 10: común 5×2×1=10, extrínseca 3+7=10, intrínseca del 8 al 12 sin el 10.",
      ],
    },
    {
      heading: "🚫 Inhibidores de la coagulación",
      points: [
        "**Antitrombina III**: __el inhibidor más importante__; inactiva la trombina y los factores IXa, Xa, XIa y XIIa.",
        "**Proteína C**: síntesis hepática y vitamina K dependiente; se activa por la trombina e inhibe los factores **Va y VIIIa**.",
        "**Proteína S**: vitamina K dependiente; actúa como **cofactor de la proteína C**.",
        "Otros inhibidores: alfa-2-macroglobulina, alfa-2-antiplasmina, cofactor II de la heparina y el C1 inhibidor.",
      ],
    },
    {
      heading: "⚠️ Alteraciones de la coagulación",
      points: [
        "Manifestaciones hemorrágicas: **petequias** (puntos rojos), **equimosis** (cardenales), **púrpura** (extravasaciones extensas), **hematoma** (con efecto masa) y **hemartrosis**.",
        "**Hipercoagulabilidad o trombofilia**: tendencia a desarrollar trombosis. Causa congénita más frecuente: **factor V Leiden**. Causas adquiridas: **síndrome antifosfolipídico**, hiperhomocisteinemia.",
      ],
    },
    {
      heading: "🧪 Preanalítica en coagulación",
      points: [
        "Ayuno mínimo de 6 horas, evitar la vía heparinizada y realizar la extracción con __daño tisular y estasis mínimos__.",
        "Tubo de **citrato de sodio** (relación 1 anticoagulante : 9 sangre, tapón azul); procesar antes de 30 minutos o conservar a 5ºC. __Si se llena de menos, se prolongan los tiempos de coagulación__.",
        "**Plasma pobre en plaquetas (PPP)** para las pruebas de coagulación; **plasma rico en plaquetas (PRP)** para los estudios plaquetarios. El suero, a diferencia del plasma, carece de fibrinógeno y factores de coagulación.",
      ],
    },
    {
      heading: "🔬 Pruebas de la hemostasia primaria",
      points: [
        "**Tiempo de sangría**: método de **IVY** (normal <10 minutos) y método de **Duke** (normal <4 minutos).",
        "Fragilidad capilar: prueba del **torniquete o de Rumpel-Leede** (positiva si aparecen __más de 10 petequias__).",
        "**Agregación plaquetaria** (método fotométrico de Born, densidad óptica): el **ADP** agrega de forma directa y el colágeno/adrenalina de forma indirecta; valor normal ≈**75%**.",
        "**Retracción del coágulo**: se inicia a los 15-20 minutos y finaliza a los 60; está __disminuida en la trombastenia de Glanzmann__.",
        "**Cofactor de la ristocetina**: valora indirectamente el FvW; valores normales **50-150 U/dL**.",
      ],
    },
    {
      heading: "⏱️ Pruebas que estudian la coagulación",
      points: [
        "Estudio global: tiempo de coagulación (5-15 min) y tiempo de recalcificación del plasma (90-250 seg).",
        "Vía intrínseca: **TTPA** (25-35 seg; patológico si la relación con el control es >1,20). __Es la prueba más sensible para esta vía__.",
        "Vía extrínseca: **TP o tiempo de Quick** (12-15 seg, normal 70-100%); en anticoagulados orales se expresa como **INR** (normal 0,9-1,2).",
        "Vía común: **tiempo de trombina (TT)** (15-20 seg) y **tiempo de reptilasa** (no se afecta por la heparina, útil para confirmar su efecto).",
        "**Fibrinógeno**: valores normales **150-450 mg/dL**; el método de referencia es el de **Clauss** (fibrinógeno funcional).",
      ],
    },
    {
      heading: "🧪 Prueba de mezclas y anticoagulantes circulantes",
      points: [
        "**Prueba de mezclas** (plasma problema + normal al 50%): __se corrige = déficit de factores__; __no se corrige = presencia de inhibidores__. Índice de Rosner: corrección <12% · zona gris 12-15% · no corrección >15%.",
        "**Anticoagulante lúpico**: prolonga el APTT __in vitro__, pero produce **hipercoagulabilidad in vivo**; forma parte del perfil antifosfolipídico junto a los anticuerpos anticardiolipina y anti-beta-2-glicoproteína.",
      ],
    },
    {
      heading: "📉 Fibrinólisis, hipercoagulabilidad y dímero D",
      points: [
        "Estudio de la fibrinólisis: tiempo de lisis del coágulo de euglobinas (**método de von Kaulla**, normal 2-4 horas).",
        "**Dímero D** (<0,25 μg/mL): __elevado valor predictivo negativo__ para trombosis venosa profunda (TVP) y tromboembolismo pulmonar (TEP).",
        "Estudio de la trombofilia: factor V Leiden, mutación de la protrombina, proteínas C y S, antitrombina III, perfil antifosfolipídico y homocisteína.",
      ],
    },
    {
      heading: "💊 Fármacos que afectan la coagulación",
      points: [
        "**Antiagregantes plaquetarios** (aspirina, clopidogrel, ticlopidina): __no requieren monitorización__ de la hemostasia.",
        "**Heparina no fraccionada**: potencia la antitrombina III; se monitoriza con el **TTPA** (relación objetivo 1,5-2,5); su antídoto es el **sulfato de protamina**; puede provocar **trombocitopenia**.",
        "**Heparina de bajo peso molecular (HBPM)**: gran poder anti-Xa; solo se administra por vía subcutánea; si es necesario, se monitoriza con la **actividad anti-Xa**.",
        "**Anticoagulantes orales anti-vitamina K** (acenocumarol/Sintrom, warfarina): se monitorizan con el **INR** (objetivo habitual 2-5); su efecto no es inmediato (24-48 h).",
        "**Trombolíticos** (estreptoquinasa, urocinasa, t-PA): activan la plasmina para disolver el trombo; riesgo de hemorragia; se controla el **fibrinógeno cada 12 horas**.",
      ],
    },
    {
      heading: "🧬 Hemofilias",
      points: [
        "**Hemofilia A**: déficit del **factor VIII**. **Hemofilia B**: déficit del **factor IX**. **Hemofilia C**: déficit del factor XI.",
        "Herencia __recesiva ligada al cromosoma X__ (hemofilia A y B); patrón analítico típico: **TP normal, TTPA alargado, TT normal**.",
        "La clínica depende del nivel de factor: __<50% implica tendencia a las hemorragias__; las hemorragias internas (hemartrosis) son las peligrosas, frente a las superficiales.",
      ],
    },
    {
      heading: "🚨 CID y enfermedad de Von Willebrand",
      points: [
        "**Coagulación intravascular diseminada (CID)**: activación excesiva de la coagulación con consumo de plaquetas y factores (↑TP, ↑APTT, ↑TT), exceso de fibrinólisis (↑dímero D, ↑PDF) y microtrombos que fragmentan hematíes (esquistocitos, anemia hemolítica). Causas: sepsis, neoplasias, complicaciones obstétricas.",
        "**Enfermedad de Von Willebrand**: __la diátesis hemorrágica hereditaria más frecuente__ (autosómica dominante, cromosoma 12). Recuento de plaquetas y tiempos de coagulación normales, pero __tiempo de sangría alargado__ y FvW antigénico/actividad disminuidos.",
      ],
    },
  ],
  keyFacts: [
    "Tiempo de sangría: IVY **<10 min** · Duke **<4 min**",
    "TTPA (vía intrínseca): **25-35 seg** (patológico si ratio >1,20)",
    "TP o tiempo de Quick (vía extrínseca): **12-15 seg** (normal 70-100%) · INR normal **0,9-1,2**",
    "Tiempo de trombina (TT, vía común): **15-20 seg**",
    "Fibrinógeno: **150-450 mg/dL**",
    "Agregación plaquetaria normal: **≈75%**",
    "Cofactor de la ristocetina: **50-150 U/dL**",
    "Dímero D: **<0,25 μg/mL**",
    "Citrato de sodio para coagulación: relación **1:9** (tapón azul)",
    "Retracción del coágulo: inicio **15-20 min**, fin a los **60 min**",
    "INR objetivo en anticoagulación oral: **2-5**",
    "Prueba de mezclas (índice de Rosner): corrección **<12%** · zona gris **12-15%** · no corrección **>15%**",
  ],
  commonMistakes: [
    "Confundir la __vía intrínseca__ (se mide con TTPA) con la __vía extrínseca__ (se mide con TP).",
    "Confundir __hemofilia A__ (déficit de factor VIII) con __hemofilia B__ (déficit de factor IX).",
    "En la prueba de mezclas, confundir __se corrige = déficit de factores__ con __no se corrige = presencia de inhibidores__.",
    "Confundir el __suero__ (sin fibrinógeno ni factores de coagulación) con el __plasma__ (los conserva).",
    "Confundir la monitorización de la __heparina__ (TTPA) con la de los __anticoagulantes orales__ (INR/TP).",
    "Confundir __émbolo__ (coágulo que se desprende y viaja) con __trombo__ (coágulo que permanece fijo).",
  ],
  mnemonics: [
    "Vías de la coagulación: **TaPa** para la extrínseca (TP) e **IN-APeTTencia** para la intrínseca (TTPA).",
    "Regla del 10: extrínseca 3+7=10; intrínseca del 8 al 12 sin el 10; común 5×2×1=10.",
    "Factores vitamina K dependientes: «la generación del 27» → **1927: X, IX, II, VII** (+ proteínas C y S).",
    "Hemofilia B: «falta el factor nueBe» (**IX**).",
  ],
};
