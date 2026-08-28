const questions = [
  {
    "id": 1,
    "number": 1,
    "question": "En una recta de calibrado de concentraciones 1 - 2 - 5 - 10 - 25 - 50 ng/mL, los controles de calidad más adecuados serían:",
    "answers": [
      "3 - 20 - 40 ng/mL",
      "1 - 10 - 20 ng/mL",
      "1 - 5 - 45 ng/mL",
      "4 - 8 - 16 ng/Ml"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 2,
    "number": 2,
    "question": "El objetivo de la calidad de un laboratorio es responsabilidad de:",
    "answers": [
      "El Jefe del laboratorio.",
      "Supervisor del laboratorio.",
      "Todo el personal del laboratorio.",
      "Unidad de calidad del Hospital."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 3,
    "number": 3,
    "question": "Al conjunto de operaciones que se realizan a un instrumento analítico o equipo de medida para que nos garantice la exactitud de sus especificaciones, se denomina:",
    "answers": [
      "Control de calidad.",
      "Calibración.",
      "Verificación.",
      "Mantenimiento."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 4,
    "number": 4,
    "question": "¿Qué es lo primero que hay que hacer cuando llega la muestra al laboratorio?:",
    "answers": [
      "Comprobar que la petición médica, y el etiquetado de las muestras sean correctos.",
      "Centrifugar la muestra.",
      "Registrar la muestra.",
      "Procesar la muestra en los distintos servicios del laboratorio."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 5,
    "number": 5,
    "question": "Al conjunto de normas Internacionales sobre calidad y su gestión, se le denomina:",
    "answers": [
      "Normas Políticas.",
      "Normas ISO.",
      "Normas de responsabilidades.",
      "Normas Jurídicas."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 6,
    "number": 6,
    "question": "El control de calidad externo consiste en:",
    "answers": [
      "Analizar unas muestras conociendo los resultados esperados. _______________________________________________________________________________________",
      "Analizar muestras de las cuales se desconocen los resultados que debemos obtener.",
      "Pasarlo cada día, antes de empezar la rutina de trabajo.",
      "No se emplean controles externos, salvo los internos."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 7,
    "number": 7,
    "question": "Una vez implementado un sistema de seguridad y certificado, las revisiones mínimas que se tendrían que hacer de dicho sistema serían:",
    "answers": [
      "Cada 6 meses.",
      "Una vez acreditado y certificado por ENAC, no haría falta.",
      "Al menos una vez al año.",
      "Cada 3 años."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 8,
    "number": 8,
    "question": "Se denominan Interferencias:",
    "answers": [
      "La aparición de errores no programados en la realización de una prueba.",
      "La presencia de sustancias que alteran la determinación de un analito específico.",
      "La disminución de la sensibilidad de una prueba.",
      "La mala utilización de un método."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 9,
    "number": 9,
    "question": "¿Cuál sería el primer paso en la recepción de muestras recibidas?",
    "answers": [
      "Confirmación de solicitud, muestra e identificación.",
      "Repartir las muestras a distintas unidades.",
      "Pasar la solicitud al personal administrativo.",
      "Ninguno de los pasos anteriores."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 10,
    "number": 10,
    "question": "Atendiendo a los motivos de rechazo de muestras, ¿Cuál sería una causa?",
    "answers": [
      "Tubos sin etiquetas o mal identificados.",
      "Peticiones incompletas.",
      "No correspondencia de tubo y petición.",
      "Todos serían motivos de rechazo."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 11,
    "number": 11,
    "question": "En la organización en el trabajo de un laboratorio. ¿Qué crees que sería beneficioso para un buen funcionamiento?",
    "answers": [
      "Optimización de recursos.",
      "Coordinación de las actividades.",
      "A y B son correctas.",
      "Ninguna es correcta"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 12,
    "number": 12,
    "question": "El servicio de recepción de muestras deberá rechazar una orina cuando:",
    "answers": [
      "Venga debidamente etiquetada e identificada.",
      "Que se haya recogido tras lavar los genitales.",
      "Que venga de un niño pequeño y haya sido recogida en bolsa de polietileno.",
      "Cuando venga en cualquier recipiente con tapadera."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 13,
    "number": 13,
    "question": "A la recepción llegan muestras de toda índole, ¿Qué tipo de muestras en tubo no debería de centrifugar Carlos?",
    "answers": [
      "Tubo para hemograma.",
      "Tubo para bioquímica.",
      "Tubo de coagulación.",
      "Se centrifugan todos los tubos."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 14,
    "number": 14,
    "question": "Para realizar el estudio basal bioquímico de sangre, el paciente debe estar en ayunas durante:",
    "answers": [
      "6 horas.",
      "4 horas.",
      "10 horas.",
      "No hace falta estar en ayunas."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 15,
    "number": 15,
    "question": "Una solución al 10% (p/v) contiene:",
    "answers": [
      "10 g del soluto + 100 ml del disolvente.",
      "10 ml del soluto + 100 ml del disolvente.",
      "10 g del soluto + 90 g del disolvente.",
      "10 g del soluto en un volumen final de 100 ml de solución."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 16,
    "number": 16,
    "question": "La desviación típica o desviación estándar es un parámetro que indica:",
    "answers": [
      "La precisión de una serie de resultados analíticos.",
      "La exactitud de una serie de resultados analíticos.",
      "La precisión y la exactitud de una serie de resultados analíticos.",
      "El intervalo total de variabilidad de una serie de resultados analíticos."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 17,
    "number": 17,
    "question": "Las gráficas de control estadístico o gráficas de Levy- Jenning para los resultados analíticos son _______________________________________________________________________________________ imprescindibles en el laboratorio clínico para conocer:",
    "answers": [
      "La exactitud y precisión entre pruebas de los resultados analíticos obtenidos con un mismo suero control.",
      "La exactitud y precisión día a día de los resultados analíticos obtenidos con un mismo suero control.",
      "La precisión día a día de los resultados analíticos obtenidos con un mismo suero control.",
      "La exactitud día a día de los resultados analíticos obtenidos con un mismo suero control."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 18,
    "number": 18,
    "question": "La forma más sencilla de registrar los datos de un control de calidad (QC) es a través de gráficos. Entre los no utilizados está:",
    "answers": [
      "Levy-Jennings.",
      "Bayes.",
      "Youden.",
      "CuSum."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 19,
    "number": 19,
    "question": "La probabilidad de la existencia de un tumor entre un grupo de control heterogéneo, ante un resultado positivo de la prueba analítica, se denomina:",
    "answers": [
      "Valor predictivo positivo.",
      "Valor predictivo negativo.",
      "Especificidad.",
      "Sensibilidad."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 20,
    "number": 20,
    "question": "¿Qué gráfica está especialmente diseñada para el control externo de calidad?",
    "answers": [
      "Gráfica de CuSum.",
      "Gráfica de Youden.",
      "Gráfica de Levey-Jennings.",
      "Gráfica externa."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 21,
    "number": 21,
    "question": "¿Cuál de las siguientes determinaciones se ve más afectada por la hemólisis de la muestra?",
    "answers": [
      "Proteínas totales.",
      "LDH.",
      "Calcio.",
      "Magnesio."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 22,
    "number": 22,
    "question": "De los siguientes tubos ¿cuál es el más adecuado para recoger una muestra de sangre en la que queremos determinar lactato?",
    "answers": [
      "De tapón rojo.",
      "De tapón azul.",
      "De tapón gris.",
      "De tapón amarillo."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 23,
    "number": 23,
    "question": "La existencia de una inexactitud constante se denomina:",
    "answers": [
      "Error aleatorio.",
      "Sesgo.",
      "Variabilidad.",
      "Distribución normal."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 24,
    "number": 24,
    "question": "El grado en que una medida obtenida se aproxima al valor real se denomina:",
    "answers": [
      "Especificidad.",
      "Precisión.",
      "Sensibilidad.",
      "Exactitud."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 25,
    "number": 25,
    "question": "Acreditación es:",
    "answers": [
      "Procedimiento mediante el cual un organismo independiente y reconocido garantiza por escrito que un producto, proceso o servicio cumple los requisitos especificados.",
      "procedimiento mediante el cual un organismo autorizado reconoce formalmente que una organización es competente para llevar a cabo unas tareas específicas.",
      "Actividad encaminada a adaptar los procesos de una organización a las directrices dadas en los documentos normativos pertinentes.",
      "Reconocimiento legal del laboratorio por parte de la administración, con el fin de asegurar que reúne las condiciones adecuadas y garantizar a los potenciales usuarios un nivel correcto de calidad asistencial."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 26,
    "number": 26,
    "question": "Para cuantificar el tiempo de respuesta se pueden usar los parámetros estadísticos siguientes, EXCEPTO:",
    "answers": [
      "Percentiles (generalmente 90 o 95) _______________________________________________________________________________________",
      "Proporción de resultados entregados en un tiempo inferior al marcado",
      "Desviación típica",
      "Mediana"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 27,
    "number": 27,
    "question": "¿Cuál es la finalidad del control de calidad externo?",
    "answers": [
      "Es la misma que la del control de calidad interno, pero realizado por personal ajeno al laboratorio.",
      "Conseguir sueros control fiables para validar metodologías.",
      "Obtener factores de corrección aplicables a los resultados de pacientes, a partir de una evaluación de la inexactitud.",
      "Evaluar el programa de calidad interno, la dispersión de resultados entre laboratorios, así como ayudar a la selección de nuevas metodologías."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 28,
    "number": 28,
    "question": "La especificidad de una prueba se calcula:",
    "answers": [
      "Verdaderos positivos divididos por total de pacientes con la enfermedad.",
      "Verdaderos negativos divididos por total de pacientes sin la enfermedad.",
      "Verdaderos positivos dividido por total de pacientes con o sin la enfermedad.",
      "Verdaderos negativos por total de pacientes con o sin enfermedad."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 29,
    "number": 29,
    "question": "Cuál de las siguientes afirmaciones es FALSA. Las curvas de ROC expresan:",
    "answers": [
      "El rendimiento diagnóstico de una magnitud bioquímica",
      "La relación entre la sensibilidad y la especificidad diagnóstica de una prueba bioquímica",
      "La capacidad discriminante de una magnitud bioquímica",
      "Rangos de referencia de una magnitud bioquímica"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 30,
    "number": 30,
    "question": "La validación técnica no incluye:",
    "answers": [
      "La comprobación de la realización del control de calidad interno",
      "Comprobar las alarmas de los equipos",
      "Decidir la ampliación de pruebas, si procede",
      "Aceptación de los resultados de los controles de acuerdo con las reglas establecidas"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 31,
    "number": 31,
    "question": "En un sistema de gestión de la calidad, el documento que especifica la política de calidad, los objetivos de la organización, la gestión del equipamiento, fungibles, política medio-ambiental, etc que debe de hacerse en el laboratorio, se conoce como:",
    "answers": [
      "Plan de calidad",
      "Manual de calidad",
      "Guía de calidad",
      "Procedimientos de calidad"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 32,
    "number": 32,
    "question": "Según la norma ISO 9001, el principio fundamental que debe guiar la gestión de la calidad en una organización es:",
    "answers": [
      "El liderazgo de la Dirección.",
      "La participación del personal.",
      "El enfoque basado en procesos.",
      "El enfoque al cliente."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 33,
    "number": 33,
    "question": "¿Cuál de las siguientes afirmaciones sobre pruebas diagnósticas es cierta?",
    "answers": [
      "La sensibilidad es la probabilidad de que un individuo sano presente la prueba positiva.",
      "El valor predictivo negativo es la probabilidad de que un individuo enfermo tenga la prueba negativa.",
      "La especificidad es una probabilidad post-prueba.",
      "El valor predictivo positivo aumenta cuando la prevalencia de la enfermedad aumenta."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 34,
    "number": 34,
    "question": "La desviación estándar de una distribución es una medida de",
    "answers": [
      "Posición",
      "Tendencia central",
      "Dispersión",
      "Apuntamiento"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 35,
    "number": 35,
    "question": "En relación con la calibración de equipos, ¿cuál de las siguientes afirmaciones es correcta?",
    "answers": [
      "Se entiende por calibración la comparación de un sistema de medición frente a estándares conocidos.",
      "Tiene que haber un plan de calibración de equipos que defina la actividad a realizar y su periodicidad. _______________________________________________________________________________________",
      "Deberán calibrarse los equipos de medición y ensayo que lo precisan antes de su puesta en servicio.",
      "Todas las respuestas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 36,
    "number": 36,
    "question": "Una vez obtenidos los resultados del analizador, observamos que uno de los parámetros, a pesar de haber sido diluido automáticamente por el analizador, sigue estando fuera de rango, por lo cual procedemos a realizar una dilución manual de la muestra al 1/20 con suero fisiológico, ¿cuál de las siguientes proporciones serían las correctas?",
    "answers": [
      "10 microl de muestra + 200 microl de suero fisiológico.",
      "100 microL de muestra + 100 microL de suero fisiológico.",
      "10 microL de muestra + 190 microL de suero fisiológico.",
      "190 microL de muestra + 10 microL de suero fisiológico."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 37,
    "number": 37,
    "question": "Respecto al error sistemático, señale la RESPUESTA CORRECTA:",
    "answers": [
      "Afecta a la precisión.",
      "Se corrige con la calibración.",
      "Es impredecible.",
      "Muestra la concordancia de nuestro resultado con el valor verdadero"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 38,
    "number": 38,
    "question": "La precisión de un resultado analítico es:",
    "answers": [
      "Reproducibilidad",
      "Aproximación al valor verdadero",
      "Capacidad de un método de determinar únicamente el componente que se pretende medir.",
      "Resultado más pequeño que puede medirse"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 39,
    "number": 39,
    "question": "Si se realizan 20 determinaciones de glucosa de una única muestra de plasma, los resultados no serán todos exactamente iguales debido a:",
    "answers": [
      "Error aleatorio.",
      "Error sistemático.",
      "Inexactitud.",
      "Una variación sistemática."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 40,
    "number": 40,
    "question": "En relación con la calidad en el laboratorio clínico, todos los enunciados son ciertos EXCEPTO:",
    "answers": [
      "Se centra únicamente en la fase analítica",
      "Se encuentra integrada con la gestión clínica",
      "Implica a todos los profesionales",
      "Abarca todo el proceso"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 41,
    "number": 41,
    "question": "Según qué NORMA ISO se han acreditado o están en proceso de acreditación los laboratorios clínicos:",
    "answers": [
      "NORMA UNE-EN ISO 17025:1999",
      "NORMA UNE-EN ISQ 15189:2022",
      "NORMA UNE-EN ISO 9001:2000.",
      "Todas las anteriores son correctas."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 42,
    "number": 42,
    "question": "El transporte de muestras al laboratorio debe hacerse:",
    "answers": [
      "En un periodo de tiempo apropiado a la naturaleza de la petición.",
      "De una manera que asegure la seguridad para el personal que la transporta y para el público en general.",
      "Dentro de un rango de temperatura especificado (en el manual de toma de muestras) y con los conservadores adecuados.",
      "Todas las anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 43,
    "number": 43,
    "question": "La fase preanalítica es un subproceso del laboratorio que incluye, entre otros:",
    "answers": [
      "El transporte de las muestras hasta el laboratorio.",
      "La emisión del informe de laboratorio.",
      "La validación técnica de los resultados.",
      "Todas son falsas."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 44,
    "number": 44,
    "question": "Señale la respuesta correcta:",
    "answers": [
      "El EDTA constituye actualmente un anticoagulante de elección en hematología.",
      "Es aconsejable mantener a 4° C las muestras de sangre durante su transporte, para preservar los niveles de potasio.",
      "La hemólisis es la salida de componentes de los eritrocitos, al plasma o al suero, por lo que aumentan las concentraciones de sodio.",
      "Todas las respuestas son correctas. _______________________________________________________________________________________"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 45,
    "number": 45,
    "question": "Es motivo de rechazo.",
    "answers": [
      "Una muestra mal rotulada.",
      "Una muestra derramada.",
      "Un volante no cumplimentado.",
      "Todas las anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 46,
    "number": 46,
    "question": "Indique cuál de las siguientes no es una medida de tendencia central:",
    "answers": [
      "Coeficiente de variación.",
      "Moda.",
      "Media.",
      "Mediana"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 47,
    "number": 47,
    "question": "En una distribución de variables cuantitativas el valor que se repite con mayor frecuencia se denomina:",
    "answers": [
      "Media.",
      "Coeficiente de variación.",
      "Mediana.",
      "Moda."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 48,
    "number": 48,
    "question": "Obtenemos un resultado de glucosa en orina con una alarma de absorbancia; en el manual de la técnica nos indican que realicemos una dilución 1/20. ¿Cómo realizaríamos la dilución?",
    "answers": [
      "Con 19 volúmenes de orina más 1 volumen de agua destilada.",
      "Con volúmenes iguales de orina yagua destilada.",
      "Con 1 volumen de orina más 19 volúmenes de agua destilada.",
      "Con 1 volumen de orina y 20 volúmenes de agua destilada."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 49,
    "number": 49,
    "question": "El error que se debe a causas accidentales difíciles de determinar y que puede influir en cualquier resultado, se denomina:",
    "answers": [
      "Error aleatorio.",
      "Error sistemático.",
      "Error casual.",
      "Error total."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 50,
    "number": 50,
    "question": "Los gráficos de control que habitualmente se emplean en el laboratorio clínico para evaluar el control de calidad interno se conocen como:",
    "answers": [
      "Graficas de Levey-Jennings.",
      "Cartas de control.",
      "Graficas de Ishikawa.",
      "Diagramas de dispersión."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 51,
    "number": 51,
    "question": "Un error sistemático en el laboratorio viene determinado por:",
    "answers": [
      "La precisión y la exactitud.",
      "La inexactitud y la precisión.",
      "La exactitud e imprecisión.",
      "La inexactitud y la imprecisión."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 52,
    "number": 52,
    "question": "La norma vigente de acreditación específica de un laboratorio clínico es:",
    "answers": [
      "Norma UNE-EN ISO 15189:2007.",
      "Norma UNE-EN ISO 15189:2022.",
      "Norma UNE-EN ISO 9001:2008.",
      "Norma UNE-EN ISO 17025:2005."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 53,
    "number": 53,
    "question": "En los resultados de un control de calidad durante cinco días consecutivos, hemos obtenido los siguientes resultados: 2,10/2,00/2,05/2,07/2,00. ¿Cuál es su modalidad?",
    "answers": [
      "2,01.",
      "2,00.",
      "2,04.",
      "2,02."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 54,
    "number": 54,
    "question": "Una de las siguientes afirmaciones sobre los indicadores de calidad es falsa, ¿cuál?",
    "answers": [
      "Deben ser simples, pertinentes, reproducibles y fiables.",
      "Debe especificarse claramente la fórmula utilizada para su cálculo.",
      "Sólo se refieren a los procesos operativos.",
      "El número de indicadores a definir depende de los puntos fuertes y débiles del laboratorio."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 55,
    "number": 55,
    "question": "El PNT (procedimiento Normalizados de trabajo) de una técnica analítica debe contar con los siguientes apartados salvo uno, ¿cuál?",
    "answers": [
      "Capítulo de la Norma ISO 9001:2008 aplicada.",
      "Objeto.",
      "Descripción del procedimiento.",
      "Responsabilidades. _______________________________________________________________________________________"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 56,
    "number": 56,
    "question": "La especificidad de un test refleja:",
    "answers": [
      "Lo cerca que está del valor verdadero.",
      "La proporción de resultados positivos en personas que padecen el proceso.",
      "La proporción de resultados positivo en personas que no padecen el proceso.",
      "La proporción de resultados negativos en personas sin enfermedad."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 57,
    "number": 57,
    "question": "Cuál de los siguientes tipos de muestras, considera el más indicado para determinación de la glucosa en cualquier circunstancia:",
    "answers": [
      "Plasma con heparina de litio",
      "Suero en tubo con gel separador",
      "Plasma con EDTA",
      "Plasma con oxalato-fluoruro"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 58,
    "number": 58,
    "question": "En una técnica fotométrica, una mala asignación de los valores de los calibradores produce en la obtención de los resultados:",
    "answers": [
      "Un error aleatorio",
      "Un error sistemático",
      "Un error proporcional",
      "Un error constante"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 59,
    "number": 59,
    "question": "Se considera criterio de rechazo de una muestra:",
    "answers": [
      "Una muestra que no viene identificada correctamente",
      "Una muestra de suero hemolizada para la determinación de Lactato deshidrogenada (LDH)",
      "Una muestra para cultivo de orina recogida en un recipiente no estéril",
      "Todos los anteriores son criterios de rechazo"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 60,
    "number": 60,
    "question": "Para preparar una solución acuosa 1 Molar de hidróxido sódico (NaOH) sabiendo que el peso molecular del mismo es 40:",
    "answers": [
      "Tenemos que pesar 80 g de NaOH, ponerlo en un matraz y disolver con agua hasta 1000 ml de solución",
      "Tenemos que pesar 40 g de NaOH, ponerlo en un matraz y disolver con agua hasta 1000 ml de solución",
      "Tenemos que pesar 120 g de NaOH, ponerlo en un matraz y disolver con agua hasta 1500 ml de solución",
      "Tenemos que pesar 40 g de NaOH, ponerlo en un matraz y disolver con agua hasta 100 ml de solución"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 61,
    "number": 61,
    "question": "La unidad de densidad es:",
    "answers": [
      "Es la unidad de longitud dividida por la unidad de segundo",
      "Es la unidad de masa dividida por la unidad de tiempo",
      "Es la unidad de longitud dividida por la unidad de tiempo",
      "Es la unidad de masa dividida por la unidad de volumen"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 62,
    "number": 62,
    "question": "La diferencia principal entre suero y plasma es:",
    "answers": [
      "La presencia en plasma de fibrinógeno, que no está presente en suero",
      "La concentración de colesterol que es un 20% más elevado en plasma",
      "La presencia en plasma de una mayor concentración de triglicéridos",
      "No existen diferencias significativas"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 63,
    "number": 63,
    "question": "En la actualidad, si un laboratorio clínico desea acreditar su calidad y competencia, deberá cumplir los requisitos de la norma:",
    "answers": [
      "UNE-EN ISO 9001:2008",
      "UNE-EN ISO 9001:2009",
      "UNE-EN ISO 15189",
      "Cualquiera de ellas"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 64,
    "number": 64,
    "question": "El programa de aseguramiento de calidad en un laboratorio de diagnóstico clínico debe incluir una serie de pautas. Señale la respuesta correcta:",
    "answers": [
      "Han de describirse los procedimientos documentados de las técnicas que se llevan a cabo en el laboratorio.",
      "Cualquier trabajador que se incorpore por primera vez precisa un periodo de adaptación y formación.",
      "Seguir un plan de mantenimiento periódico y controles de calidad.",
      "Todas están incluidas. _______________________________________________________________________________________"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 65,
    "number": 65,
    "question": "La siguiente definición “medida de dispersión de un conjunto de datos con respecto al promedio”, corresponde a:",
    "answers": [
      "Mediana",
      "Varianza",
      "Sesgo",
      "Desviación estándar"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 66,
    "number": 66,
    "question": "Cuando hablamos de un volumen de una lambda, estamos haciendo referencia a:",
    "answers": [
      "Un decilitro",
      "Un milímetro",
      "Un microlitro",
      "Un hectolitro"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 67,
    "number": 67,
    "question": "¿Qué anticoagulante presenta el tubo de suero?:",
    "answers": [
      "Heparina sódica.",
      "Citrato sódico.",
      "EDTA.",
      "Ninguno."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 68,
    "number": 68,
    "question": "El valor de un control para un determinado parámetro tiene una media de 50 y una DE de 5. Tomando como límite de confianza el 95%, ¿cuál de los siguientes valores debería ser rechazado?:",
    "answers": [
      "47",
      "58",
      "62",
      "41"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 69,
    "number": 69,
    "question": "¿Cuál de los siguientes no es un objetivo directo de un sistema de gestión de la calidad según la norma ISO en un laboratorio?",
    "answers": [
      "Disminución del gasto.",
      "Mejora de la satisfacción de los clientes.",
      "Detección y corrección de errores.",
      "Determinar las funciones de cada uno de los miembros del laboratorio."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 70,
    "number": 70,
    "question": "El manual de calidad de un laboratorio según la norma ISO debe contener obligatoriamente los siguientes documentos, excepto:",
    "answers": [
      "Política de calidad.",
      "Responsabilidades de cada área del laboratorio.",
      "Identificación de los documentos del sistema de calidad.",
      "Los manuales de los distintos aparatos del laboratorio, proporcionados por las casas comerciales."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 71,
    "number": 71,
    "question": "No es causa de pérdida de precisión analítica una de las siguientes opciones:",
    "answers": [
      "Un pipeteo inadecuado de muestras y controles",
      "Una mala homogeneización de los controles",
      "Una mala reconstitución de los calibradores",
      "Variaciones de temperatura."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 72,
    "number": 72,
    "question": "Por mantenimiento preventivo de un equipo entendemos:",
    "answers": [
      "Las operaciones encaminadas a corregir fallos o averías.",
      "Las operaciones encaminadas a corregir deterioros.",
      "Las operaciones de mantenimiento periódico y programado.",
      "Todas ellas se encuadran dentro del mantenimiento preventivo."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 73,
    "number": 73,
    "question": "El coeficiente de variación de un conjunto de resultados analíticos expresa:",
    "answers": [
      "El error típico o error estándar de la media expresada en porcentaje.",
      "El error de la desviación expresada en porcentaje.",
      "La extrapolación de la desviación típica de una serie de resultados cuando la media de esta serie se lleva desde su concentración a una concentración de 100.",
      "El error en precisión de una serie de resultados analíticos para una desviación típica de 100."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 74,
    "number": 74,
    "question": "Los métodos analíticos deben ser:",
    "answers": [
      "Precisos e inexactos.",
      "Inexactos e imprecisos.",
      "Precisos y exactos.",
      "Imprecisos y exactos."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 75,
    "number": 75,
    "question": "¿Cuál de estas causas no interfiere en la analítica?",
    "answers": [
      "Suero lipémico",
      "Fármacos",
      "Hemólisis",
      "Color de la piel _______________________________________________________________________________________"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 76,
    "number": 76,
    "question": "Para realizar una dilución 1:10 de un espécimen de suero, se toma un volumen de espécimen de 0,1 ml ¿Qué volumen de diluyente añadiríamos?",
    "answers": [
      "9 microlitos",
      "10 microlitos",
      "900 microlitos",
      "1,0 microlitos"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 77,
    "number": 77,
    "question": "Si queremos obtener suero de una muestra de sangre, ¿qué anticoagulante usaremos?:",
    "answers": [
      "Heparina.",
      "EDTA.",
      "Citrato sódico.",
      "Ninguno."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 78,
    "number": 78,
    "question": "Es un gráfico de control:",
    "answers": [
      "Gráfico de CuSum.",
      "Líneas de Yensen.",
      "Gráficos de convergencia de Youns.",
      "Todas son ciertas."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 79,
    "number": 79,
    "question": "En cuanto al transporte de muestras entre laboratorios:",
    "answers": [
      "Es recomendable hacerlo en cajas herméticas o neveras transportadoras.",
      "El medio de transporte debe ser flexible para evitar dañar el agente en caso de caída.",
      "Se etiquetará e identificarán para poder ser utilizadas para otros fines.",
      "Se transportarán en las manos para tener un mayor control del agente."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 80,
    "number": 80,
    "question": "El grado en que una medición proporciona resultados similares cuando se lleva a cabo en más de una ocasión en las mismas condiciones es la:",
    "answers": [
      "Validez.",
      "Inmediatez.",
      "Precisión.",
      "Repetitividad."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 81,
    "number": 81,
    "question": "La certificación que da fe de que una empresa cumple los requisitos con una norma concreta es:",
    "answers": [
      "ISO 3500.",
      "ISO 9001.",
      "ISO 7500.",
      "ISO 2000"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 82,
    "number": 82,
    "question": "La fiabilidad es sinónimo de:",
    "answers": [
      "Reproducibilidad.",
      "Precisión.",
      "Estabilidad.",
      "Todas son correctas"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 83,
    "number": 83,
    "question": "Las calibraciones:",
    "answers": [
      "El conjunto de operaciones que establecen la relación entre los valores de una magnitud indicados por un equipo de medida y los valores de esa magnitud realizados por patrones.",
      "La relación entre el valor real de una muestra y el valor obtenido en la maquinaria utilizada.",
      "La puesta en marcha diaria necesaria en todo el aparataje del laboratorio.",
      "Todas son ciertas"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 84,
    "number": 84,
    "question": "La reproducibilidad de un método se define como:",
    "answers": [
      "Dispersión",
      "Precisión",
      "Exactitud",
      "Intervalo de confianza"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 85,
    "number": 85,
    "question": "La desviación estándar de una población es:",
    "answers": [
      "La varianza",
      "El cuadrado de la varianza",
      "La raíz cuadrada de la varianza",
      "La suma de las diferencias respecto de la media"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 86,
    "number": 86,
    "question": "Uno de los atributos de la calidad es la eficiencia. Señale de qué se trata:",
    "answers": [
      "Grado de consecución de los objetivos propuestos al mínimo coste posible.",
      "Mide lo apropiado de los servicios que se ofertan en relación a las necesidades.",
      "Grado de consecución de los objetivos propuestos sin tener en cuenta el coste empleado.",
      "Se refiere a la posibilidad real de disponer del personal o del servicio que se presta en el momento en el que se precise. _______________________________________________________________________________________"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 87,
    "number": 87,
    "question": "Para preparar una disolución 1 Molar con ácido sulfúrico (SO4H2) sabiendo que el peso molecular del mismo es aproximadamente 98:",
    "answers": [
      "Tenemos que pesar 49 gramos de SO4H2, ponerlo en un matraz y disolver con agua hasta conseguir 1000 ml de disolución.",
      "Tenemos que pesar 98 gramos de SO4H2, ponerlo en un matraz y disolver con agua hasta conseguir 1000 ml de disolución.",
      "Tenemos que pesar 196 gramos de SO4H2, ponerlo en un matraz y disolver con agua hasta conseguir 1000 ml de disolución.",
      "Tenemos que pesar 98 gramos de SO4H2, ponerlo en un matraz y disolver con agua hasta conseguir 500 ml de disolución."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 88,
    "number": 88,
    "question": "Se realiza una determinación de glucosa y el autoanalizador nos ha dado un resultado de 1,1 g/l. ¿Cuál será el resultado expresado en mg/dl?:",
    "answers": [
      "11,00mg/dl",
      "110mg/dl",
      "0,11mg/dl",
      "1,10mg/dl"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 89,
    "number": 89,
    "question": "¿Cuál de las siguientes definiciones se corresponde con el concepto \"precisión\" dentro de un resultado?:",
    "answers": [
      "Cercanía de una serie de mediciones alrededor del valor promedio.",
      "La variabilidad de una medida en torno a su valor verdadero.",
      "Conjunto de valores dentro de los cuales está situado el valor verdadero.",
      "Lo cerca que se encuentra el valor real del valor promedio."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 90,
    "number": 90,
    "question": "Ante la situación de un fallo de control interno de calidad, la medida a tomar más oportuna sería:",
    "answers": [
      "Repetir el control hasta que se sitúe en valores aceptables.",
      "Entregar todos los resultados de las series previas al control lo antes posible.",
      "Suspender la entrega de resultados hasta averiguar y corregir la causa de error.",
      "Llamar al servicio técnico."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 91,
    "number": 91,
    "question": "El anticoagulante que se utiliza preferentemente en los estudios bioquímicos procedentes de urgencias es:",
    "answers": [
      "Heparina de litio.",
      "EDTA.",
      "Citrato trisódico.",
      "Heparina sódica."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 92,
    "number": 92,
    "question": "¿Cuál es el ángulo apropiado de inserción de la aguja para la flebotomía?",
    "answers": [
      "5º.",
      "15º.",
      "30º.",
      "45º."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 93,
    "number": 93,
    "question": "Es criterio de exclusión de una muestra biológica:",
    "answers": [
      "Envase no adecuado.",
      "Envase no identificado.",
      "Transporte inadecuado.",
      "Todas correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 94,
    "number": 94,
    "question": "Las reglas de Westgard sirven para:",
    "answers": [
      "Detectar sólo el error aleatorio.",
      "Comparar la precisión de métodos.",
      "Detectar sólo el error sistemático.",
      "Detectar tanto el error aleatorio como el sistemático."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 95,
    "number": 95,
    "question": "Entre las causas de hemolisis de muestras de suero, están todas las siguientes, excepto:",
    "answers": [
      "La exposición a la luz.",
      "Extracción dificultosa.",
      "Permanencia prolongada de la muestra sin centrifugar.",
      "Choque térmico."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 96,
    "number": 96,
    "question": "Antes de la centrifugación de la sangre para la obtención de suero, se debe permitir la coagulación completa para:",
    "answers": [
      "Evitar contaminación.",
      "Evitar formación de cristales.",
      "Evitar liberación de bilirrubina. _______________________________________________________________________________________",
      "Evitar formación de fibrina."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 97,
    "number": 97,
    "question": "Todas las siguientes son características de los sistemas POCT (Point Of Care Testing), excepto una. Señálela:",
    "answers": [
      "Proporcionan resultados de manera rápida.",
      "Proporcionan resultados de mayor calidad analítica.",
      "Permiten el análisis en el lugar de la asistencia médica.",
      "Pueden ser manipulados por personas no expertas en procedimientos analíticos."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 98,
    "number": 98,
    "question": "La relación entre los resultados obtenidos y los recursos y costes empleados se denomina:",
    "answers": [
      "Equidad.",
      "Eficacia.",
      "Efectividad.",
      "Eficiencia."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 99,
    "number": 99,
    "question": "Uno de los conceptos básicos del control de calidad en el laboratorio es el error total. Este concepto se calcula con:",
    "answers": [
      "La media ponderada.",
      "Índice de desviación estándar.",
      "El coeficiente de variación y el error sistemático del método.",
      "La varianza."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 100,
    "number": 100,
    "question": "¿Cuál es el porcentaje de individuos normales que tienen el valor de una magnitud analítica por encima del valor de referencia superior?:",
    "answers": [
      "5%",
      "2,50%",
      "1,65%",
      "1%"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 101,
    "number": 101,
    "question": "El valor predictivo positivo de un resultado es: (TP=total Pacientes; VP=verdaderos positivos; FN=falsos negativos):",
    "answers": [
      "VP/(VP+FP).",
      "VP/(VP+FN).",
      "VP/(TP - FN).",
      "VP/(TP - FP))."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 102,
    "number": 102,
    "question": "¿Cuál de las siguientes normas acredita la competencia técnica en un Laboratorio clínico?:",
    "answers": [
      "ISO 15189.",
      "ISO 9001.",
      "ISO 14001.",
      "ISO 17025."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 103,
    "number": 103,
    "question": "La especificidad de una prueba para diagnosticar una enfermedad se calcula según el cociente:",
    "answers": [
      "VP/(VP+FP).",
      "(VP+VN)/(VP+FP).",
      "VP/(VP+FN).",
      "VN/(VN+FP)."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 104,
    "number": 104,
    "question": "La desviación estándar expresada en términos de porcentaje de la media se denomina:",
    "answers": [
      "Coeficiente de correlación.",
      "Coeficiente de variación.",
      "Error sistemático.",
      "Inexactitud."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 105,
    "number": 105,
    "question": "La ISO 15189:",
    "answers": [
      "La otorga cualquier entidad con capacidad acreditadora.",
      "Puede ser otorgada Únicamente por ENAC.",
      "Puede ser otorgada por empresas con auditores acreditados por ENAC.",
      "Puede ser otorgada por cualquier empresa acreditada para ello por ENAC."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 106,
    "number": 106,
    "question": "¿Cuál de los siguientes procesos no forma parte de la fase preanalítica del laboratorio?",
    "answers": [
      "Preparación del paciente",
      "Transporte de muestras",
      "Mantenimiento de analizadores",
      "Interferencias de la muestra"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 107,
    "number": 107,
    "question": "¿A qué hace referencia el término \"índice sérico\"?",
    "answers": [
      "Determinación cuantitativa de hemoglobina, bilirrubina y lípidos presentes en una muestra de suero.",
      "Un conjunto de pruebas que se pueden realizar en un analizador de bioquímica.",
      "Un registro de calibraciones específicas de lote. _______________________________________________________________________________________",
      "Un listado de conservantes que se pueden utilizar para mantener las muestras de suero durante más tiempo."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 108,
    "number": 108,
    "question": "La probabilidad de obtener un resultado positivo en un individuo enfermo es:",
    "answers": [
      "La sensibilidad",
      "La especificidad",
      "El valor predictivo positivo",
      "El cociente de verosimilitud positivo"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 109,
    "number": 109,
    "question": "Para realizar un cribado o “screening” de una enfermedad en una población, debemos elegir una prueba diagnóstica que sea:",
    "answers": [
      "Altamente específica.",
      "Poco específica.",
      "Altamente sensible.",
      "Que tenga pocos resultados falsos positivos"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 110,
    "number": 110,
    "question": "Los valores máximos y mínimos de lectura de un equipo los define:",
    "answers": [
      "La fiabilidad.",
      "El alcance.",
      "El rango de medida.",
      "La exactitud."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 111,
    "number": 111,
    "question": "¿Qué determinación no precisa una muestra con anticoagulante?",
    "answers": [
      "Tiempo de Protrombina.",
      "Determinación de la V.S.G.",
      "Glucosa basal.",
      "Hemoglobina."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 112,
    "number": 112,
    "question": "El ayuno provoca:",
    "answers": [
      "Aumento de la bilirrubina.",
      "Aumento de la glucosa.",
      "Disminución de los triglicéridos.",
      "Todas son correctas."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 113,
    "number": 113,
    "question": "¿Qué alteraciones provocaría la extracción sanguínea del mismo brazo de una vía heparinizada con perfusión de suero glucosado?",
    "answers": [
      "Disminución de los valores iónicos.",
      "Resultados de la cefalina alargados.",
      "Aumento del valor de la glucosa.",
      "Todas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 114,
    "number": 114,
    "question": "La presencia de hemólisis originará una disminución de…",
    "answers": [
      "LDH.",
      "GOT.",
      "GPT.",
      "Ninguna es cierta."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 115,
    "number": 115,
    "question": "¿Qué característica deben cumplir los envases para la toma de muestras?",
    "answers": [
      "Ser estériles",
      "Permitir recoger la muestra con la menor manipulación posible",
      "Disponer de cierre hermético",
      "Todas las anteriores"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 116,
    "number": 116,
    "question": "La recogida de sangre de una gasometría se realiza:",
    "answers": [
      "Con jeringa especial sin anticoagulante.",
      "Con jeringa con EDTA.",
      "Utilizando como anticoagulante heparina.",
      "Todas son falsas."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 117,
    "number": 117,
    "question": "¿Cómo se denomina la dimensión de la calidad asistencial que relaciona los resultados obtenidos y los costes que genera el servicio prestado?:",
    "answers": [
      "Utilidad",
      "Eficiencia",
      "Eficacia",
      "Efectividad"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 118,
    "number": 118,
    "question": "Con respecto a la calidad de las pruebas diagnósticas, la probabilidad de que una persona clasificada como negativa (sana) por la prueba esté realmente sana, es el llamado:",
    "answers": [
      "Valor predictivo positivo",
      "Valor predictivo negativo",
      "Valor predictivo neutro",
      "Grado de satisfacción"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 119,
    "number": 119,
    "question": "¿Para qué se utiliza el protocolo de Westgard o Multirregla de Shewart?:",
    "answers": [
      "Para valorar un proceso analítico fuera de control. _______________________________________________________________________________________",
      "Para realizar una intercomparativa de resultados entre dos analizadores.",
      "Para realizar estudio estadístico sobre la calidad en el laboratorio.",
      "para comparar la concentración exacta de un analito entre diferentes autoanalizadores."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 120,
    "number": 120,
    "question": "Con respecto al Coeficiente de Variación (C.V.), señale la RESPUESTA CORRECTA:",
    "answers": [
      "Es un índice de dispersión que permite comparar dos variables. Se suele expresar en forma de porcentaje.",
      "Su valor es igual a la raíz cuadrada positiva de la varianza.",
      "Es una medida de posición.",
      "Al igual que la desviación típica, no permite comparar variables distintas."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 121,
    "number": 121,
    "question": "De los siguientes índices estadísticos, ¿cuál representa una medida de dispersión?",
    "answers": [
      "Media aritmética.",
      "Desviación típica.",
      "Moda.",
      "Mediana"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 122,
    "number": 122,
    "question": "La calidad puede definirse desde tres puntos de vista fundamentales. Señale el INCORRECTO:",
    "answers": [
      "Instrucción",
      "Proceso",
      "Estructura",
      "Resultados"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 123,
    "number": 123,
    "question": "Generalmente, en muestras hemolizadas, ¿qué debemos hacer si se nos solicita la determinación de LDH?",
    "answers": [
      "Determinar solo sus isoenzimas.",
      "Añadir glutatión al suero.",
      "Pedir nueva muestra.",
      "Realizar la determinación a 37ºC."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 124,
    "number": 124,
    "question": "Definimos la sensibilidad diagnóstica como:",
    "answers": [
      "Capacidad de la prueba para detectar la enfermedad cuando está presente.",
      "Capacidad de la prueba para detectar la enfermedad cuando no está presente.",
      "Probabilidad de que un paciente tenga la enfermedad cuando se obtenga un resultado positivo.",
      "Probabilidad de que un sujeto con un resultado negativo en la prueba esté realmente sano."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 125,
    "number": 125,
    "question": "Respecto a los documentos de calidad, señale la RESPUESTA CORRECTA:",
    "answers": [
      "No es requisito que el sistema de gestión de calidad (SGC) esté documentado.",
      "El manual de calidad es el documento básico sobre el que se articula todo el SGC. En él se resumen todos los procedimientos y la interacción de los procesos que se realizan.",
      "En un laboratorio acreditado no es necesario disponer de procedimientos generales de gestión, ya que es competencia propia de la dirección.",
      "Todas las anteriores respuestas son correctas."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 126,
    "number": 126,
    "question": "¿Qué respuesta se ajusta más a la definición de un procedimiento normalizado de trabajo (PNT)?",
    "answers": [
      "El PNT es una herramienta de armonización clave para garantizar que se lleven a cabo todos los procesos y procedimientos.",
      "El PNT es una técnica de gestión de costes estandarizada para garantizar ahorros en los procesos y procedimientos.",
      "El PNT es un protocolo de normalización innovador que regula la independencia en los procesos y procedimientos.",
      "El PNT es una herramienta de normalización que establece una base estandarizada para todos los procesos y procedimientos."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 127,
    "number": 127,
    "question": "La aplicación de la norma ISO en los laboratorios es:",
    "answers": [
      "Voluntaria.",
      "Obligatoria.",
      "Depende de la legislación actual autonómica.",
      "Es obligatoria en los laboratorios clínicos con gran volumen analítico."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 128,
    "number": 128,
    "question": "¿Cuál es la diferencia entre suero y plasma? _______________________________________________________________________________________",
    "answers": [
      "El proceso de obtención de cada uno de ellos.",
      "La presencia de fibrinógeno.",
      "El color.",
      "El suero es venoso y el plasma, no."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 129,
    "number": 129,
    "question": "Los errores más frecuentes con muestras sanguíneas se cometen en la fase:",
    "answers": [
      "Analítica",
      "Preanalítica",
      "Postanalítico",
      "En toles sin diferencia"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 130,
    "number": 130,
    "question": "Para una rápida visualización de la validez de un resultado de un control de calidad, ¿qué herramienta podemos utilizar?",
    "answers": [
      "La gráfica Levey-Jennings",
      "El error aleatorio",
      "El coeficiente de variación",
      "La varianza"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 131,
    "number": 131,
    "question": "Si necesitamos diluir una muestra de suero de un paciente a 1/40 con suero fisiológico:",
    "answers": [
      "Aspiraremos 40 partes de suero fisiológico y le añadiremos 1 parte de suero (muestra) en tubo distinto.",
      "Aspiraremos 39 partes de suero fisiológico y le añadiremos 1 parte de suero (muestra) en tubo distinto.",
      "Aspiraremos 40 partes de suero (muestra) y le añadiremos 1 parte de suero fisiológico en tubo distinto.",
      "Aspiraremos 41 partes de suero fisiológico y le añadiremos 1 parte de suero (muestra) en tubo distinto."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 132,
    "number": 132,
    "question": "Si necesitamos realizar una prueba de cribado (screening) para determinar anticuerpos contra VIH, utilizaremos:",
    "answers": [
      "Una técnica con una sensibilidad del 98% y 80% de especificidad.",
      "Una técnica con una especificidad del 100% y 75% de sensibilidad.",
      "Es una técnica de alta resolución.",
      "Es una técnica de aglutinación en gel."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 133,
    "number": 133,
    "question": "Las gráficas de Levey-Jenning se utilizan en el laboratorio para conocer:",
    "answers": [
      "La exactitud y precisión diaria de los resultados analíticos obtenidos con un mismo control.",
      "La exactitud semanal de los resultados analíticos obtenidos de distintos controles.",
      "La precisión mensual de los resultados analíticos obtenidos de distintos controles.",
      "La precisión diaria de los resultados analíticos realizados con un control distinto."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 134,
    "number": 134,
    "question": "El grado de consecución de los objetivos propuestos sin tener en cuenta el coste empleado, se denomina:",
    "answers": [
      "Eficiencia.",
      "Adecuación.",
      "Equidad.",
      "Eficacia."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 135,
    "number": 135,
    "question": "Las empresas que transportan las muestras biológicas deben tener en cuenta tres variables principales que son:",
    "answers": [
      "Trazabilidad, tiempo y temperatura.",
      "Temperatura, disposición y vehículos adecuados.",
      "Fase preanalítica, analítica y postanalítica.",
      "Solo es necesaria la acreditación correcta de la empresa."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 136,
    "number": 136,
    "question": "¿Qué significan las siglas GLP en castellano dentro de la acreditación en el laboratorio?:",
    "answers": [
      "Buenas prácticas de laboratorio.",
      "Gen libre de productos químicos.",
      "Productos generados libremente.",
      "Labores propias genéticas"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 137,
    "number": 137,
    "question": "¿Qué es el procesamiento de la muestra?:",
    "answers": [
      "Es el período comprendido entre la recogida de la muestra y la llegada al laboratorio, incluyendo sus actividades.",
      "Las actividades llevadas a cabo desde la información dada al paciente para la recogida de la muestra y su entrega en el laboratorio. _______________________________________________________________________________________",
      "Las actividades llevadas a cabo en el período comprendido entre su obtención y su análisis real.",
      "Las respuestas B y C son correctas."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 138,
    "number": 138,
    "question": "Dentro del control de calidad, ¿qué es la exactitud?",
    "answers": [
      "La aproximación del valor a una medida de sí mismo, cuando se realizan varias determinaciones empleando el mismo método.",
      "La aproximación de una medida a su valor real.",
      "La reproductividad de un método.",
      "La variabilidad de una medida alrededor de su valor verdadero."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 139,
    "number": 139,
    "question": "En una conexión unidireccional entre el Analizador y el sistema informático del Laboratorio:",
    "answers": [
      "La información sólo puede pasar del sistema informático del laboratorio al analizador.",
      "El analizador transmite primero el número de identificación al sistema informático del laboratorio para que este comunique las pruebas que han sido solicitadas.",
      "La información sólo puede pasar del analizador al sistema informático del laboratorio.",
      "La comunicación de los resultados desde el analizador al sistema informático de laboratorio debe hacerse siempre de forma manual."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 140,
    "number": 140,
    "question": "El color amarillo-verdoso característico de los sueros ictéricos se debe a la presencia en la muestra de:",
    "answers": [
      "Triglicéridos.",
      "Ácido úrico.",
      "Hierro.",
      "Bilirrubina."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 141,
    "number": 141,
    "question": "Evaluar la probabilidad de que un individuo, en una población definida, se beneficie de la aplicación de una tecnología sanitaria bajo condiciones reales de aplicación, se denomina…",
    "answers": [
      "Eficacia.",
      "Eficiencia.",
      "Efectividad.",
      "Utilidad ."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 142,
    "number": 142,
    "question": "Un laboratorio ha recibido las siguientes valoraciones de error al participar en un programa de intercomparación para un mensurando dado, en periodos consecutivos: 4.0%, 0.0%, -4.0 %, 3.0% y - 3.0% ¿Qué sesgo muestra el laboratorio?",
    "answers": [
      "3,50.",
      "2,80.",
      "0.",
      "-2,80."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 143,
    "number": 143,
    "question": "Para el cálculo de la especificidad diagnóstica de una prueba, ¿cuál de las siguientes opciones es necesaria para poder calcularla?",
    "answers": [
      "Verdaderos positivos y falsos positivos.",
      "Verdaderos negativos y falsos positivos.",
      "Falsos negativos y verdaderos positivos.",
      "Falsos negativos y verdaderos negativos"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 144,
    "number": 144,
    "question": "En cuanto a la preanalítica del tubo con citrato como anticoagulante, es falso que",
    "answers": [
      "Se suele utilizar para estudios de coagulación.",
      "Se debe rellenar con la cantidad adecuada de sangre de modo que se mantenga la proporción anticoagulante/muestra: 1/9.",
      "En el orden de llenado correcto, se debe obtener después del tubo con EDTA tripotásico.",
      "Tras la extracción debe mezclarse inmediatamente la sangre con el citrato."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 145,
    "number": 145,
    "question": "El grado de consecución de los objetivos sin tener en cuenta el coste empleado, ¿qué define?",
    "answers": [
      "La Eficiencia",
      "La Eficacia",
      "La Adecuación",
      "La Equidad"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 146,
    "number": 146,
    "question": "¿Con qué indicador o parámetro estadístico se debería medir un error que se produce por factores incontrolables del procedimiento de medida?",
    "answers": [
      "Desviación estándar y coeficiente de variación",
      "Error aleatorio",
      "Error total",
      "Error sistemático _______________________________________________________________________________________"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 147,
    "number": 147,
    "question": "Según el código de colores de los tapones de tubos de vacío, utilizaremos para el estudio de VSG (velocidad de sedimentación globular) los de color:",
    "answers": [
      "Malva",
      "Verde",
      "Negro",
      "Azul"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 148,
    "number": 148,
    "question": "Respecto a los tubos de recogida de muestras sanguíneas, ¿cuál es la respuesta CORRECTA?",
    "answers": [
      "El tubo con el aditivo EDTA K3 se utiliza para obtener suero y realizar pruebas bioquímicas.",
      "El tubo sin aditivos se utiliza para obtener plasma y realizar pruebas de coagulación.",
      "El tubo con el aditivo de heparina se utiliza para obtener sangre total y realizar pruebas de hematimetría.",
      "El tubo con el aditivo citrato sódico se utiliza para obtener plasma y realizar pruebas de coagulación."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 149,
    "number": 149,
    "question": "En pacientes con infusión parenteral de suero glucosado u otros, y en relación a la toma de muestras:",
    "answers": [
      "Existen técnicas definidas para la extracción de muestras en estos casos, que deben seguirse cuidadosamente para evitar la contaminación",
      "No afecta a la toma de muestras",
      "No hay modo de extraer bien la muestra si el paciente tiene una vía",
      "Es mejor demorar la extracción hasta que se retire la vía"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 150,
    "number": 150,
    "question": "Si hablamos de calidad en el laboratorio clínico, qué dirías que es la especificidad:",
    "answers": [
      "La capacidad de una prueba de dar un resultado negativo en un sujeto sano",
      "Es el porcentaje de verdaderos negativos",
      "La capacidad de una prueba de dar un resultado positivo en un sujeto sano",
      "La A y la B"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 151,
    "number": 151,
    "question": "En el laboratorio clínico entendemos por mantenimiento preventivo:",
    "answers": [
      "El que se realiza cuando hay parada, deterioro o daños en el equipo",
      "Es el que se realiza cuando el equipo de resultados dudosos o se suponga un mal funcionamiento",
      "Es el que se realiza de forma programada para evitar fallos, deterioro o averías",
      "Ninguna es correcta"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 152,
    "number": 152,
    "question": "En una disolución llamamos soluto a la sustancia:",
    "answers": [
      "Que se halla en menor proporción",
      "Que se halla en mayor proporción",
      "Que es líquida",
      "Que es disolvente"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 153,
    "number": 153,
    "question": "La norma que acredita la calidad en el ámbito del laboratorio clínico es:",
    "answers": [
      "ISO 15189",
      "ISO 15187",
      "ISO 9001",
      "ISO 14101"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 154,
    "number": 154,
    "question": "¿Cuál de las siguientes afirmaciones es verdadera?",
    "answers": [
      "La sensibilidad de una prueba diagnóstica mide su capacidad para detectar sujetos sanos cuando dicha enfermedad está presente",
      "La especificidad de un test diagnóstico mide su capacidad para descartar la enfermedad que se estudia cuando dicha enfermedad está ausente",
      "Cuanto mayor sea la sensibilidad de una prueba diagnóstica menor será la proporción de falsos positivos",
      "Todas las anteriores son correctas"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 155,
    "number": 155,
    "question": "Los requisitos de reproducibilidad, volumen pequeño de reactivo, técnica rápida, sencilla, reactivos estables antes y después de su reconstitución, pertenecen a:",
    "answers": [
      "Fase pre-analítica",
      "Fase analítica",
      "Fase post-analítica",
      "Todas las anteriores son correctas"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 156,
    "number": 156,
    "question": "¿Con qué parámetro valoramos a la dispersión de la muestra?: _______________________________________________________________________________________",
    "answers": [
      "Media",
      "Mediana",
      "P valor",
      "Desviación estándar"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 157,
    "number": 157,
    "question": "El citrato sódico se utiliza como anticoagulante en:",
    "answers": [
      "Pruebas bioquímicas",
      "Recuentos celulares",
      "Pruebas de coagulación",
      "En ninguna de ellas"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 158,
    "number": 158,
    "question": "Señale cuál de las siguientes es una norma de acreditación específica para los laboratorios clínicos:",
    "answers": [
      "ISO 9001:2015.",
      "UNE-EN-ISO 15189.",
      "ISO 50001.",
      "ISO 14001."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 159,
    "number": 159,
    "question": "¿Cuál de las siguientes afirmaciones es incorrecta?:",
    "answers": [
      "La actividad AST puede aumentar hasta tres veces con el ejercicio intenso.",
      "Los niveles de AST no se afectan por la ingesta de alimentos.",
      "La hemólisis no influye sobre los niveles de AST.",
      "Los valores inesperadamente elevados en alguna aminotransferasa serán evaluados con nueva muestra"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 160,
    "number": 160,
    "question": "¿Que se obtiene centrifugando un tubo de sangre con citrato como anticoagulante?:",
    "answers": [
      "Sangre total.",
      "Plasma",
      "Suero.",
      "Botón de hematíes."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 161,
    "number": 161,
    "question": "Como se prepara 100 mL de disolución de sacarosa al 6% p/v partiendo de una disolución de sacarosa al 30% p/v:",
    "answers": [
      "18 mL de disolución de sacarosa al 30% p/v y hasta 100 mL de H2O",
      "No se puede hacer.",
      "20 gramos de sacarosa y 80 mL de H2O.",
      "20 mL de disolución de sacarosa al 30% y añadimos hasta 100 mL de H2O."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 162,
    "number": 162,
    "question": "Qué cantidades emplearíamos para preparar una disolución final de 200mL de lejía (NaClO), en agua (H2O) a una concentración del 5% v/v: Peso atómico: Na=23; Cl=35.5; O=16; H=1",
    "answers": [
      "10 mL de lejía y 200 mL de H2O.",
      "10 mL de lejía y hasta 200 mL de H2O.",
      "4,65 mL de lejía y hasta 200 mL de H2O.",
      "9,3 mL de lejía y hasta 200 mL de H2O. Comentario: el peso atómico lo daban para liar. La concentración volumen/volumen es volumen de soluto entre volumen de disolvente, todo ello multiplicado x 100 para expresarlo en porcentaje. Había que buscar aquella qiue daba 5%, es decir, (10/200)*100 = 5%."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 163,
    "number": 163,
    "question": "¿Cuál de las siguientes etapas tiene relación con el proceso preanalítico?:",
    "answers": [
      "Solicitud de análisis y obtención del espécimen.",
      "Identificación y transporte al laboratorio.",
      "Recepción y clasificación.",
      "Todas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 164,
    "number": 164,
    "question": "Con respecto a los tipos de muestras, señale la opción verdadera:",
    "answers": [
      "El tipo de muestra va a depender del tipo de parámetro que se va a analizar y el método que se vaya a utilizar.",
      "Hay ciertas muestras que presentan requisitos especiales de conservación y de envío al laboratorio.",
      "En el laboratorio debe existir un protocolo preanalítico de manejo de muestras.",
      "Todas son verdaderas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 165,
    "number": 165,
    "question": "La toma de muestra de sangre se obtiene por punción venosa, arterial o capilar, aunque de forma general se obtiene por punción venosa debido a",
    "answers": [
      "Causa un menor traumatismo para el paciente.",
      "Posibilidad de un volumen suficiente de sangre.",
      "Mayor facilidad de obtención.",
      "Todas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 166,
    "number": 166,
    "question": "Con respecto a las muestras sanguíneas _______________________________________________________________________________________",
    "answers": [
      "Un transporte rápido y una temperatura de almacenaje adecuada mejoran la fiabilidad de los resultados de laboratorio.",
      "La sangre capilar se utiliza en aquellos casos en que la analítica se va a realizar por micrométodos, muy útil sobre todo en niños.",
      "Para la punción venosa se suele elegir el miembro superior y en éste, la zona de flexura del codo, donde las venas son más accesibles y fijas. De fuera a dentro, encontramos: vena cefálica, vena mediana y vena basílica.",
      "Todas las respuestas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 167,
    "number": 167,
    "question": "Durante la extracción sanguínea, señale la respuesta falsa",
    "answers": [
      "El sitio de punción se limpia con un antiséptico.",
      "Se coloca una banda elástica alrededor de la parte superior del brazo con el fin de aplicar presión en la zona. Esto hace que la vena que está debajo se llene de sangre para facilitar la venopunción.",
      "Para la punción venosa se suele elegir el miembro superior y en este, la zona de flexura del codo, donde las venas son más accesibles y fijas.",
      "La banda elástica colocada alrededor del brazo para facilitar el llenado de la vena para la venopunción, no se retira del brazo hasta que una vez retirada la aguja el paciente deja de sangrar."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 168,
    "number": 168,
    "question": "En cuanto a los criterios de aceptación de muestras, señale la respuesta correcta",
    "answers": [
      "Las muestras se reciben en el contenedor adecuado para las determinaciones solicitadas.",
      "Las muestras cumplen el tiempo y las condiciones de temperatura establecidas durante el transporte.",
      "Las muestras se encuentran debidamente identificadas y etiquetadas.",
      "Todas las anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 169,
    "number": 169,
    "question": "En el manual de laboratorio deben estar recogido los siguientes aspectos acerca de la fase preanalítica",
    "answers": [
      "En qué tipo de contenedor se debe recibir la muestra.",
      "Rango de temperatura en que se debe transportar la muestra.",
      "Correcta preparación del paciente según la prueba solicitada.",
      "Todas las anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 170,
    "number": 170,
    "question": "En la extracción de muestras de sangre, el tubo con tapa verde nos indica que",
    "answers": [
      "El tubo contiene fluoruro oxalato como anticoagulante.",
      "El tubo contiene EDTA como anticoagulante.",
      "El tubo contiene heparina de litio como anticoagulante.",
      "El tubo contiene citrato sódico como anticoagulante."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 171,
    "number": 171,
    "question": "En cuanto a los criterios de rechazo de muestras, señale la afirmación correcta",
    "answers": [
      "Tubos o contenedores de muestra sin identificación.",
      "Muestra coagulada para determinaciones a realizar en sangre total.",
      "Jeringa de gases con burbujas de aire.",
      "Todas las anteriores son criterios de rechazo de muestras."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 172,
    "number": 172,
    "question": "Para las pruebas de coagulación se emplea sangre",
    "answers": [
      "Con citrato 1:4.",
      "Con citrato 1:9.",
      "Con CPD y citrato.",
      "Con Heparina."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 173,
    "number": 173,
    "question": "Ante la demora en la realización de los análisis, las muestras de sangre generalmente han de refrigerarse a una temperatura de",
    "answers": [
      "Entre 4-8 ºC.",
      "Entre 10-15 ºC",
      "Entre 15-20 ºC",
      "Entre 0-5 ºC"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 174,
    "number": 174,
    "question": "En el laboratorio debe existir un registro actualizado de todos los equipos de medición y ensayo. Este registro se compone de los siguientes datos: _______________________________________________________________________________________",
    "answers": [
      "Nombre del equipo, del fabricante y ubicación habitual.",
      "Fecha de recepción y puesta en servicio.",
      "Registro de mantenimientos preventivos y correctivos.",
      "Todas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 175,
    "number": 175,
    "question": "Los beneficios de acreditar un laboratorio son",
    "answers": [
      "Reducir los riesgos, pues la acreditación va a permitir determinar si se está realizando el trabajo correctamente.",
      "Compromiso de todo el personal del laboratorio con el cumplimiento de los requisitos de calidad.",
      "Evaluaciones periódicas del organismo de acreditación que proporcionan un punto de referencia para mantener la competencia.",
      "Todas las respuestas anteriores son verdaderas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 176,
    "number": 176,
    "question": "La calidad es responsabilidad de",
    "answers": [
      "Gerente del hospital.",
      "Jefe del laboratorio.",
      "Todo el personal.",
      "La ENAC."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 177,
    "number": 177,
    "question": "La norma ISO 15189",
    "answers": [
      "Contiene los requisitos que los laboratorios clínicos que analizan muestras humanas tienen que cumplir.",
      "Dentro de los requisitos está el control sobre los procesos clave: preanalíticos, analíticos y postanalíticos.",
      "Dentro de los requisitos está la evaluación y gestión de riesgos.",
      "Todas las respuestas anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 178,
    "number": 178,
    "question": "La definición \"aseguramiento de la calidad\" incluye las siguientes:",
    "answers": [
      "Acciones planificadas y sistemáticas necesarias para proporcionar la confianza de que un producto satisfaga los requisitos sobre calidad.",
      "Actividades llevadas a cabo por el laboratorio con la finalidad de mejorar su funcionamiento.",
      "Actividades que incluyen la promoción del uso rutinario del control de calidad interno.",
      "Todas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 179,
    "number": 179,
    "question": "Un parámetro que representa una medida cuantitativa para evaluar la calidad de aspectos importantes de la gestión o de otros procesos es",
    "answers": [
      "Un indicador.",
      "Un registro.",
      "Un procedimiento de trabajo.",
      "Una instrucción técnica."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 180,
    "number": 180,
    "question": "La aproximación al valor verdadero de una magnitud se conoce como",
    "answers": [
      "Precisión.",
      "Exactitud.",
      "Varianza.",
      "Límite de detección."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 181,
    "number": 181,
    "question": "El grado de cumplimiento de los objetivos planificados se denomina",
    "answers": [
      "Garantía de calidad.",
      "Eficacia.",
      "Efectividad.",
      "Eficiencia."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 182,
    "number": 182,
    "question": "El organismo delegado de evaluación de la conformidad (certificación) en España se llama",
    "answers": [
      "ISO.",
      "AENOR.",
      "OEC.",
      "ACNUR."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 183,
    "number": 183,
    "question": "El mantenimiento de los analizadores",
    "answers": [
      "Se realizará de acuerdo con las instrucciones escritas.",
      "No serán válidas las instrucciones suministradas por el fabricante.",
      "Mantenimiento y calibración pueden ser entendidas como dos actividades idénticas.",
      "Todas son correctas."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 184,
    "number": 184,
    "question": "La norma que estandariza los recipientes de un solo uso para la recogida de muestras de sangre venosa es:",
    "answers": [
      "UNE-EN ISO 6710. _______________________________________________________________________________________",
      "UNE-EN ISO 6170.",
      "UNE-EN ISO 6711.",
      "UNE-EN ISO 6715."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 185,
    "number": 185,
    "question": "El anticoagulante que contiene el tubo de extracción de sangre por vacío utilizado para la realización de pruebas de coagulación es:",
    "answers": [
      "EDTA.",
      "Citrato sódico.",
      "Heparina.",
      "Oxalato."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 186,
    "number": 186,
    "question": "Señala la respuesta incorrecta:",
    "answers": [
      "El plasma constituye el 55-60% del volumen sanguíneo.",
      "El suero sanguíneo contiene fibrinógeno.",
      "El plasma sanguíneo contiene los factores de la coagulación.",
      "El suero contiene lipoproteínas que transportan colesterol."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 187,
    "number": 187,
    "question": "¿Cuáles son los parámetros de calidad dentro de un laboratorio de análisis clínico?:",
    "answers": [
      "La eficacia de la resolución de incidencias.",
      "El grado de cumplimiento de plazos.",
      "La fiabilidad de los resultados emitidos.",
      "Todas las respuestas son ciertas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 188,
    "number": 188,
    "question": "Señale cuál de las siguientes es un error sistemático:",
    "answers": [
      "Desviación de todas las mediciones en +2 desviaciones estándar.",
      "Error de pipeteo en una muestra.",
      "Desviación de una medición en +2 desviaciones estándar.",
      "Fallo mecánico del analizador con consiguiente pérdida de la muestra."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 189,
    "number": 189,
    "question": "Cuando el suero tiene aspecto turbio, opalescente, debido a la concentración de lipoproteínas se dice que está:",
    "answers": [
      "Hemolizado.",
      "Lipémico.",
      "Ictérico.",
      "Si presenta ese aspecto es porque es plasma y no suero."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 190,
    "number": 190,
    "question": "¿Cuál de estos no es un error preanalítico?:",
    "answers": [
      "Una aguja obstruida en el analizador en el momento del pipeteo de la muestra.",
      "El no poner el código de identificación a la muestra.",
      "La congelación de una muestra de sangre cuando solo tenía que ser refrigerada.",
      "El envío de la muestra en un recipiente inadecuado (distinto anticoagulante o conservante…)."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 191,
    "number": 191,
    "question": "¿Cuál de estas normas es exclusiva de Laboratorio?:",
    "answers": [
      "ISO 9001.",
      "ISO 15189.",
      "ISO 17025.",
      "ISO 45001."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 192,
    "number": 192,
    "question": "La relación entre la calidad obtenida y los recursos y costes empleados se llama:",
    "answers": [
      "Garantía de calidad.",
      "Eficacia.",
      "Efectividad.",
      "Eficiencia."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 193,
    "number": 193,
    "question": "Para controlar los procesos de medida usando materiales de control y decidir la conformidad o disconformidad del proceso de medida, ¿qué gráfica tendremos en cuenta?",
    "answers": [
      "Gráfica de Westgard.",
      "Gráfica de Levey-Jenings.",
      "Gráfica Cusum.",
      "La B y la C son verdaderas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 194,
    "number": 194,
    "question": "En estadística, el intervalo comprendido entre aproximadamente dos desviaciones estándar alrededor de la media se conoce como:",
    "answers": [
      "Intervalo de probabilidad del 99%.",
      "Intervalo de probabilidad del 95%.",
      "Intervalo de confianza del 95%.",
      "Intervalo de confianza del 99%. _______________________________________________________________________________________"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 195,
    "number": 195,
    "question": "Los anticoagulantes empleados para la obtención de plasma basan su acción en la combinación con el calcio, excepto:",
    "answers": [
      "Fluoruro sódico.",
      "Oxalato potásico.",
      "EDTA.",
      "Heparina."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 196,
    "number": 196,
    "question": "Para preparar una dilución del suero 1/100 se pondrá:",
    "answers": [
      "1 μL de suero y 100 μL de agua destilada.",
      "10 μL de suero y 990 μL de agua destilada.",
      "1 mL de suero y 10 mL de solución salina.",
      "Ninguna es correcta."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 197,
    "number": 197,
    "question": "La implantación de un sistema de gestión de calidad en un laboratorio, implica a:",
    "answers": [
      "Al jefe de servicio.",
      "A un técnico de laboratorio en concreto.",
      "A todo el servicio de laboratorio.",
      "Es ajeno al servicio de laboratorio."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 198,
    "number": 198,
    "question": "Uno de los conceptos básicos del control de calidad en el laboratorio es el error total. Este concepto se calcula con:",
    "answers": [
      "La media ponderada.",
      "Índice de desviación estándar.",
      "El coeficiente de variación y el error sistemático del método.",
      "La varianza."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 199,
    "number": 199,
    "question": "Cuando la concentración de un analito es tan alta que queda fuera del intervalo lineal de la curva de calibración:",
    "answers": [
      "Se puede preconcentrar el analito antes de someterlo al experimento.",
      "Conviene diluirlo.",
      "No se le puede aplicar la técnica de la espectrofotometría.",
      "Habrá que reducir el fondo espectral para que la señal quede incluida en el espectro."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 200,
    "number": 200,
    "question": "El procesamiento de muestras es:",
    "answers": [
      "El periodo comprendido entre la recepción de la muestra y el envío de los resultados.",
      "El conjunto de pruebas realizadas en las muestras.",
      "El periodo comprendido entre la recepción de la muestra y el análisis de la misma.",
      "El conjunto de normas estandarizadas para la toma de muestra en urgencias."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 201,
    "number": 201,
    "question": "En una balanza se desea pesar 1 mM de NaCI (masa molecular 36,5), ¿Qué debería indicar la misma?",
    "answers": [
      "36.5 g.",
      "0.0365 mg.",
      "0.0365 g.",
      "365 mg. Comentario: moles (g)/peso molecular. 0,0365 / 36,5 = 0,001 moles. No dice el volumen disolución, pero si se asume que es 1 L. 0,001/1= 0,001M =1mM. No está del todo bien expresada: o bien en el enunciado debería poner mmol, o bien tendrían que dar el volumen de disolución para calcularlo en M. Se podría tratar de impugnar"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 202,
    "number": 202,
    "question": "Para diluir un suero añadimos 900 microlitros de solución salina y 0.1 ml de suero problema al primer tubo; se homogeniza, y se pasan 500 microlitros de este tubo a un segundo tubo; se añaden otros 500 microlitros de solución salina al primer tubo ¿Qué dilución final de suero hemos conseguido en el primer tubo?",
    "answers": [
      "1:20.",
      "1:10.",
      "1:5.",
      "1:200. Comentario: qué poco os gustan los numeritos jeje 900 microlitros=0,9 ml. Si mezclas 0,1 ml suero con 0,9 ml solución salina, estás haciendo una dilución 1/10. Si de esa dilución coges 500 microlitros y lo mezclas con 500 microlitros, estás haciendo una dilución 1/2. Total= 1/10 x 1/2= 1/20"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 203,
    "number": 203,
    "question": "No se considera como líquido corporal:",
    "answers": [
      "Sangre.",
      "Orina. _______________________________________________________________________________________",
      "Células.",
      "LCR."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 204,
    "number": 204,
    "question": "NO es un objetivo que se persiga al analizar las muestras:",
    "answers": [
      "Realizar un correcto diagnóstico al proceso patológico.",
      "Descartar posibles patologías que se creen instauradas por la presencia de sintomatología típica.",
      "Obtener una alta calidad en la toma de muestras.",
      "Facilitar herramientas al facultativo para poder prescribir correctamente los fármacos."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 205,
    "number": 205,
    "question": "Tenemos una disolución de HCL 0,1 Molar y queremos obtener 100 ml de disolución 0,1 Normal ¿Qué volumen de disolución 0,1 Molar debemos tomar?",
    "answers": [
      "1 litro.",
      "1 mililitro y enrasamos con agua hasta 100 ml.",
      "10 mililitros y enrasamos con agua hasta 100 ml.",
      "100 mililitros. Comentario: en este caso 1 mol de HCl tiene 1 equivalentes gramos (tiene 1 H+). 0,1N/1=0,1 Molar. Como tengo la misma concentración inicial que final, el volumen es el mismo, 100 ml"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 206,
    "number": 206,
    "question": "A la capacidad de un test para detectar la enfermedad, se la denomina:",
    "answers": [
      "Especificidad.",
      "Sensibilidad.",
      "Eficacia.",
      "Eficiencia. Comentario: regla SE. Sensibilidad=Enfermos"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 207,
    "number": 207,
    "question": "¿Qué es un PNT (Procedimiento normalizado de trabajo)?",
    "answers": [
      "Es una revista sanitaria.",
      "Es un documento escrito que describen la secuencia específica de operaciones y métodos que deben aplicarse en el laboratorio para una finalidad determinada.",
      "Son documentos complementarios al Manual de Calidad cuya finalidad fundamental es establecer cómo, quién, y cuándo debe realizarse una actividad allí prevista.",
      "B y C son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 208,
    "number": 208,
    "question": "Necesitaremos utilizar una disolución de ácido sulfúrico H₂SO₄ 0,05 Normal ¿cuál de las soluciones que se indican a continuación podría servirnos, por ser equivalente?",
    "answers": [
      "0,1 Molar.",
      "0,05 Molar.",
      "0,025 Molar.",
      "0,005 Molar. Comentario : 1 mol de H₂SO₄ tiene 2 equivalentes gramos (tiene 2 H+), la molaridad será la mitad al dividir 0,5 entre 2 (nº equivalentes gramos). La fórmula sería N= M x nº equivalentes gramo"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 209,
    "number": 209,
    "question": "Al representar un control gráficamente, cuando en el eje X se representa los días del mes y en el eje Y se representa el valor de la media y sus desviaciones estándar, ¿nos referimos al gráfico de?:",
    "answers": [
      "Gráfico de Levy-Jennings.",
      "Gráfico de CuSum.",
      "Gráfico de convergencia de Youden.",
      "Gráfico de control de atributos."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 210,
    "number": 210,
    "question": "¿Cuál de los siguientes anticoagulantes actúa inhibiendo la acción de la trombina?:",
    "answers": [
      "Las sales de EDTA.",
      "El citrato sódico.",
      "El ácido cítrico-citrato-dextrosa (ACD).",
      "La heparina."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 211,
    "number": 211,
    "question": "En el caso de un suero con hemólisis, ¿en qué parámetro analítico de los siguientes existe una importante interferencia debido a su liberación?",
    "answers": [
      "Lactato deshidrogenasa.",
      "Troponina l.",
      "Sodio.",
      "Calcio."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 212,
    "number": 212,
    "question": "Para establecer el nivel de precisión que los laboratorios deben alcanzar, se han desarrollado _______________________________________________________________________________________ diversos criterios y métodos a lo largo del tiempo. Señale cuál de los siguientes NO es uno de ellos:",
    "answers": [
      "Criterio de Tonks",
      "Método de Youden",
      "Método Six Sigma",
      "Criterio de Aspen"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 213,
    "number": 213,
    "question": "¿Qué parámetro NO se determina mediante dispositivos POCT (Point of Care Testing)?",
    "answers": [
      "Hematocrito.",
      "Glucosa.",
      "SO2.",
      "Vitamina B12."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 214,
    "number": 214,
    "question": "¿Qué variables se deben controlar durante el transporte y conservación de muestras biológicas?",
    "answers": [
      "Trazabilidad.",
      "Tiempo.",
      "Temperatura.",
      "Todas son ciertas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 215,
    "number": 215,
    "question": "Entre las causas más frecuentes de rechazo de muestras se encuentra:",
    "answers": [
      "Lipidemia.",
      "Hemólisis.",
      "Contenedor inapropiado.",
      "Todas son ciertas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 216,
    "number": 216,
    "question": "El grado en el que la medida obtenida se aproxima al valor real se denomina:",
    "answers": [
      "Precisión.",
      "Exactitud.",
      "Mediana.",
      "Especificidad."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 217,
    "number": 217,
    "question": "Respecto a los múltiplos y submúltiplos de las unidades básicas, el prefijo “Pico” con abreviatura “p” corresponde a la equivalencia: -3",
    "answers": [
      "10 . -6",
      "10 . -9",
      "10 .",
      "Ninguna de las anteriores es correcta."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 218,
    "number": 218,
    "question": "En relación con los criterios de obtención de muestras, todas las afirmaciones son ciertas, excepto:",
    "answers": [
      "Confirmar la identidad del paciente.",
      "No todas las muestras deben considerarse contaminantes.",
      "Verificar que el paciente ha seguido las instrucciones previas.",
      "Comprobar el cierre hermético de los contenedores."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 219,
    "number": 219,
    "question": "En la capacidad de una prueba analítica, para no dar positividad, cuando se aplica al estudio de las muestras que no contienen el analito, estamos hablando de:",
    "answers": [
      "Especificidad.",
      "Fiabilidad.",
      "Sensibilidad.",
      "Precisión."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 220,
    "number": 220,
    "question": "Los controles internos y externos se encuentran dentro de:",
    "answers": [
      "Fase preanalítica.",
      "Fase analítica.",
      "Fase postanalítica.",
      "Fase cero."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 226,
    "number": 226,
    "question": "¿Cuál es la principal diferencia entre el suero y el plasma?",
    "answers": [
      "El suero contiene fibrinógeno.",
      "El plasma no contiene fibrinógeno.",
      "El suero no contiene fibrinógeno.",
      "El plasma no contiene factores de la coagulación."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 227,
    "number": 227,
    "question": "Señala la correcta:",
    "answers": [
      "El personal técnico del laboratorio no tiene competencias en el mantenimiento de equipos, ya que corresponde esa tarea al coordinador o supervisor en su caso.",
      "El mantenimiento de los equipos es competencia exclusiva de los fabricantes de dichos equipos.",
      "La formación del personal en el mantenimiento de equipos es vital para su correcto funcionamiento de los mismos.",
      "B y c son correctas."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 228,
    "number": 228,
    "question": "De la siguiente relación: 5, 2, 0, 6, 3, 1, 1, 3, 1, 4. ¿Cuál es la Mediana y la Moda?",
    "answers": [
      "La moda es 5 y la mediana 2,5.",
      "La moda es 1 y la mediana 2,5.",
      "La moda es 2,5 y la mediana 2,6.",
      "La moda es 1 y la mediana 2,6. Comentario. La moda es valor que más se repite (1) y la mediana el valor que divide a la serie en partes iguales. Para calcularla primero se ponen en orden: 0, 1, 1, 1, 2, 3, 3, 4, 5, 6. Como es una serie de un nº par de números, la división estaría entre el 2 y el 3. Por ello sería (2+3)/2= 2,5. Así se dejarían 4,5 nº por debajo y 4,5 por arriba. Vimos un ejemplo de esto en el foro"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 229,
    "number": 229,
    "question": "El grado de ausencia de error aleatorio se conoce como:",
    "answers": [
      "Confiabilidad.",
      "Fiabilidad.",
      "Precisión.",
      "Validez externa."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 230,
    "number": 230,
    "question": "La probabilidad de que una prueba resulte positiva cuando existe una enfermedad, se conoce como:",
    "answers": [
      "Exactitud.",
      "Sensibilidad.",
      "Especificidad.",
      "Valor predictivo positivo."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 231,
    "number": 231,
    "question": "¿Qué norma internacional de calidad para un laboratorio de análisis y de calibración, tiene en _______________________________________________________________________________________ cuenta las fases de pre-analítica, analítica y post- analítica?",
    "answers": [
      "ISO 17025.",
      "ISO 15189.",
      "ISO 14001.",
      "ISO 9001."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 232,
    "number": 232,
    "question": "La mezcla homogénea de dos o más sustancias es conocida como:",
    "answers": [
      "Dilución",
      "Disolución",
      "Solubilidad",
      "Todas las respuestas anteriores son correctas"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 233,
    "number": 233,
    "question": "Hablamos de error de método cuando:",
    "answers": [
      "Depende del técnico que está realizando el análisis.",
      "Depende del propio equipo.",
      "Es inherente al método que se está utilizando.",
      "Se produce de manera casual/ no pueden evitarse ni medirse."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 234,
    "number": 234,
    "question": "¿Cómo hay que actuar para obtener el suero de una muestra?",
    "answers": [
      "Centrifugar inmediatamente el tubo de sangre sin aditivos.",
      "Centrifugar inmediatamente el tubo de sangre con coagulante.",
      "Esperar a que se forme el coágulo y centrifugar el tubo.",
      "Esperar una hora y no centrifugar el tubo."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 235,
    "number": 235,
    "question": "¿Cómo se denomina la capacidad de diferenciar dos señales muy parecidas del mismo analito?",
    "answers": [
      "Sensibilidad.",
      "Especificidad.",
      "Selectividad.",
      "Linealidad."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 236,
    "number": 236,
    "question": "¿De qué pasos consta la fase preanalítica?",
    "answers": [
      "Identificación y manipulación de muestras.",
      "Clasificación de muestras y alicuotado.",
      "Alicuotado y distribución de muestras.",
      "Identificación, manipulación, clasificación, alicuotado y distribución de muestras."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 237,
    "number": 237,
    "question": "La mayoría de los errores en el laboratorio se producen...",
    "answers": [
      "...en la fase analítica.",
      "...en el laboratorio de urgencias.",
      "...en la fase preanalítica.",
      "...en el banco de sangre."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 238,
    "number": 238,
    "question": "¿Cómo se denomina el promedio de un conjunto finito de datos?",
    "answers": [
      "Media.",
      "Mediana.",
      "Moda.",
      "Varianza."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 239,
    "number": 239,
    "question": "¿Qué son las auditorias en los laboratorios?",
    "answers": [
      "Son procesos independientes.",
      "Es una técnica de control de la calidad.",
      "Pueden ser internas o externas.",
      "Todas las respuestas anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 240,
    "number": 240,
    "question": "El citrato sódico se utiliza como anticoagulante en tubos de muestra sanguínea para…",
    "answers": [
      "…pruebas bioquímicas.",
      "...marcadores tumorales.",
      "...pruebas de coagulación.",
      "...serología infecciosa."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 241,
    "number": 241,
    "question": "Señale la respuesta correcta en cuanto a la dilución a 1/6:",
    "answers": [
      "20 μl de muestra y 100 μl de diluyente.",
      "10 μl de muestra y 100 μl de diluyente.",
      "20 μl de muestra y 120 μl de diluyente.",
      "10 μl de muestra y 110 μl de diluyente."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 242,
    "number": 242,
    "question": "¿Qué tubo debe utilizarse para la determinación de la hormona adrenocorticotrópica (ACTH)?",
    "answers": [
      "Suero.",
      "Plasma citratado.",
      "Plasma EDTA 3K y citrato.",
      "Plasma EDTA y aprotinina. Comentario: es una hormona lábil, que requiere su extracción en plasma y rápida congelación. La mayoría de las veces se extrae con EDTA, pero el tubo recomendado es tubo EDTA aprotinina (tapón rosA). _______________________________________________________________________________________ Recuerda que es el tubo recomendado para hormonas lábiles."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 249,
    "number": 249,
    "question": "Señale la respuesta correcta sobre la norma UNE EN ISO 17025",
    "answers": [
      "Es la forma de acreditación de los laboratorios de ensayo y calibración.",
      "Es la forma de acreditación de los laboratorios clínicos.",
      "Es la forma de acreditación de los análisis POCT.",
      "Es la forma de acreditación de los laboratorios de genética."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 250,
    "number": 250,
    "question": "Señale la respuesta incorrecta sobre el error aleatorio:",
    "answers": [
      "Se produce como consecuencia de la imprecisión del proceso de medida.",
      "Puede ser ocasionado por un error en el manejo de la pipeta.",
      "Disminuye al aumentar el número de análisis repetidos de la muestra.",
      "Está causado por una calibración incorrecta."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 251,
    "number": 251,
    "question": "De las siguientes definiciones señale la incorrecta:",
    "answers": [
      "Efecto matriz: Influencia de una propiedad de la muestra distinta de la magnitud en la medición.",
      "Error de medida: Resultado de una medición menos el valor verdadero del resultado",
      "Error sistemático: Error debido a factores estructurales subyacentes que no pueden ser controlados por el operador.",
      "Error cognitivo: Error producido por decisiones incorrectas debidas a insuficiente conocimiento."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 252,
    "number": 252,
    "question": "En relación a parámetros estadísticos ¿Cuál de las siguientes es una medida de tendencia central?",
    "answers": [
      "Varianza",
      "Desviación típica o estándar",
      "Moda",
      "Covarianza o Pearson _______________________________________________________________________________________"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 253,
    "number": 253,
    "question": "El objetivo de la formación de alícuotas es:",
    "answers": [
      "Clasificación de la muestra.",
      "Repartir la muestra para varios análisis",
      "Analizar la muestra inmediatamente",
      "Comprobar la adecuación de la muestra"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 254,
    "number": 254,
    "question": "Poner a punto y verificar los equipos de análisis y mantenimiento es un objetivo:",
    "answers": [
      "Del proceso analítico.",
      "De la patología.",
      "De gestión.",
      "Específico."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 255,
    "number": 255,
    "question": "Para diluir un espécimen de suero 1:10 quedando un volumen final de 1 mL:",
    "answers": [
      "Se toma un volumen del espécimen de 0,1 ml y se llega al volumen final añadiendo 1 mL de diluyente",
      "Se toma un volumen del espécimen de 0,1 ml y se añaden 0,9 mL del diluyente",
      "Se toman los mililitros necesarios en función de la osmolalidad del suero a diluir",
      "Ninguna es correcta"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 256,
    "number": 256,
    "question": "Indique cuál es una medida de tendencia central en una distribución de datos:",
    "answers": [
      "Coeficiente de variación",
      "Mediana",
      "Percentil 99",
      "Desviación estándar"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 257,
    "number": 257,
    "question": "Indique como produce el EDTA (etilendiaminotetraacetato) su efecto anticoagulante:",
    "answers": [
      "Diluyendo la sangre",
      "Quelando el calcio",
      "Evita la transformación de protrombina en trombina",
      "Pasando el factor X a factor Xa"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 258,
    "number": 258,
    "question": "Según la OMS las muestras biológicas transportadas desde el punto de extracción hasta el laboratorio se clasifican como ...",
    "answers": [
      "sustancias infecciosas de categoría A",
      "sustancias infecciosas de categoría B",
      "mercancía Biopeligrosa",
      "mercancía Peligrosa"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 259,
    "number": 259,
    "question": "Indique cuál de los siguientes supuestos no justifica el rechazo de una muestra:",
    "answers": [
      "Muestra de EDTA para hemograma coagulada",
      "Muestra sin identificar",
      "Muestra en tubo de citrato para coagulación lleno por la mitad",
      "Muestra en tubo seco (tapón rojo) para bioquímica coagulado"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 260,
    "number": 260,
    "question": "¿Qué es un laboratorio \"CORE\"?",
    "answers": [
      "Equipos portátiles en la cabecera del paciente",
      "Red de pequeños laboratorios especializados en áreas especificas",
      "Un gran laboratorio central automatizado que realiza la mayoría de las pruebas habituales",
      "Un laboratorio de urgencias operativo 24 horas al día"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 261,
    "number": 261,
    "question": "¿Cuál es la diferencia entre acreditación y certificación ISO?",
    "answers": [
      "La certificación informa sobre el sistema de gestión de calidad de una organización, mientras que la acreditación informa sobre la competencia técnica para ejecutar actividades concretas",
      "La acreditación informa sobre el sistema de gestión de calidad de una organización, mientras que la certificación informa sobre la competencia técnica para ejecutar actividades concretas",
      "Cuando una organización está certificada, también está acreditada",
      "La acreditación se concede con la auditoría interna y la certificación con la auditoría externa"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 262,
    "number": 262,
    "question": "¿En qué tipo de organizaciones se puede aplicar la Norma ISO 15189:2022?",
    "answers": [
      "En laboratorios",
      "En organizaciones sanitarias",
      "En laboratorios clínicos",
      "En todas las organizaciones"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 263,
    "number": 263,
    "question": "¿Qué es un control externo? _______________________________________________________________________________________",
    "answers": [
      "Es un control de valor conocido con el que comparamos los resultados con otros laboratorios con condiciones iguales a las nuestras",
      "En un control de valor desconocido con el que comparamos los resultados con otros laboratorios con condiciones iguales a las nuestras",
      "Es una mezcla de varias muestras, que procesamos repetidas veces para comprobar la precisión de una técnica",
      "En un control de valor conocido que medimos diariamente"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 264,
    "number": 264,
    "question": "¿Qué error de la fase post-analítica podría comprometer la seguridad del paciente?",
    "answers": [
      "Muestra que llega al laboratorio sin identificar",
      "Mala preparación del paciente previo a la toma de muestras",
      "Comunicación de resultados deficiente",
      "Trasvasar muestra de un paciente al contenedor de otro paciente diferente"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 265,
    "number": 265,
    "question": "Respecto al control de calidad interno, señale la respuesta CORRECTA:",
    "answers": [
      "El laboratorio debe disponer de un programa de control de calidad interno para evaluar de forma continuada sus actividades.",
      "Los resultados de las muestras se podrán validar, aunque los controles de calidad interno estén fuera de los límites aceptables.",
      "La estabilidad de los materiales del control de calidad interno permite su utilización posterior a la fecha de caducidad.",
      "Las pruebas de control de calidad interno no valoran la exactitud de los resultados."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 266,
    "number": 266,
    "question": "Respecto al control de calidad externo, señale la respuesta CORRECTA:",
    "answers": [
      "Al realizar los controles de calidad internos ya no son necesarios los externos.",
      "Una entidad ·o institución independiente distribuye material de control a los laboratorios participantes de forma simultánea.",
      "Se conocerán por anticipado los resultados a obtener de las muestras de control externo.",
      "No será necesario enviar los resultados obtenidos a la entidad o institución que los envía."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 267,
    "number": 267,
    "question": "El procedimiento por el cual un organismo nacional reconoce formalmente que una entidad o persona es competente para realizar tareas específicas, se llama:",
    "answers": [
      "Validación.",
      "Normalización.",
      "Certificación.",
      "Acreditación."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 268,
    "number": 268,
    "question": "Dentro del laboratorio de urgencias, ¿cuál de las siguientes magnitudes biológicas NO se considera urgente?",
    "answers": [
      "Troponina.",
      "Drogas de abuso.",
      "Hemograma.",
      "Porfirinas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 269,
    "number": 269,
    "question": "En cuanto al error aleatorio, señale la respuesta CORRECTA:",
    "answers": [
      "Es directamente proporcional a la precisión.",
      "Se produce por factores que son controlables. . .",
      "Representa el grado de discordancia entre medidas repetidas de un mismo analito.",
      "Se soluciona con calibración."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 270,
    "number": 270,
    "question": "Entre las competencias profesionales, personales y sociales de un Técnico Superior de Laboratorio de Diagnóstico Clínico (TSLDC) está:",
    "answers": [
      "Proporcionar a los pacientes un ambiente ordenado, limpio y seguro.",
      "Evaluar la coherencia y fiabilidad de los resultados obtenidos en los análisis utilizando aplicaciones informáticas.",
      "Tener a cargo el control de los archivos de las historias clínicas.",
      "Para la realización de las técnicas no se seguirán los protocolos normalizados de trabajo (PNT) ni se cumplirán las normas de calidad. _______________________________________________________________________________________"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 271,
    "number": 271,
    "question": "¿Cuál NO es una ventaja del autoanalizador?",
    "answers": [
      "Aumenta la precisión.",
      "Mayor rapidez.",
      "Reproductibilidad.",
      "Aumenta el error por factor humano."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 272,
    "number": 272,
    "question": "¿Qué valores críticos hay que informar después de comprobarlos?",
    "answers": [
      "Hemoglobina por debajo de 5 mg/dl.",
      "Hiperglucemias e hipoglucemias.",
      "Hiperpotasemias.",
      "Todas las respuestas anteriores son ciertas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 273,
    "number": 273,
    "question": "Un concentrado de hematíes se puede hemolizar por alguna de las siguientes causas:",
    "answers": [
      "Por una infusión simultánea con determinados medicamentos.",
      "Por adición de sustancias hipotónicas como el agua destilada.",
      "Por sobrecalentamiento a más de 50ºc.",
      "Por las tres causas anteriores."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 274,
    "number": 274,
    "question": "¿Cuál de los siguientes NO se considera un criterio de rechazo de una muestra de laboratorio?",
    "answers": [
      "Tubo y volante no coincidente.",
      "Envase no adecuado.",
      "Muestras no identificada.",
      "Todas son criterios de rechazo de muestras."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 275,
    "number": 275,
    "question": "Respecto al Control de Calidad Interno (CCI), ¿cuál de las siguientes afirmaciones es FALSA?",
    "answers": [
      "Se debe procesar a diario o siempre que midamos esa magnitud en muestras de pacientes.",
      "Es mejor usar materiales control independientes del proveedor de los reactivos.",
      "Es mejor utilizar los materiales control proporcionados por el proveedor de los reactivos porque están más ajustados.",
      "Es recomendable que el valor diana se obtenga por métodos de referencia o por la media de otros laboratorios que trabajen con nuestras mismas condiciones."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 276,
    "number": 276,
    "question": "En relación a los conceptos estadísticos relacionados con el control de calidad, elegir la respuesta correcta con respecto al error aleatorio:",
    "answers": [
      "Es un concepto similar al error sistemático.",
      "Se produce como consecuencia de la imprecisión del procedimiento.",
      "Viene determinados por factores controlables del procedimiento.",
      "Es la diferencia entre el resultado obtenido y el valor verdadero."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 277,
    "number": 277,
    "question": "Señale la respuesta correcta respecto a los valores críticos:",
    "answers": [
      "Cuando se realiza una comunicación vía telefónica no es obligatorio confirmar la recepción de esa información.",
      "No hace falta definir quién está autorizado a recibir la información.",
      "La elaboración de la lista, el procedimiento de comunicación no se tiene porque consensuar con los clínicos.",
      "Se deben tener sistemas que evalúen y monitoricen el procedimiento de comunicación de valores críticos."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 278,
    "number": 278,
    "question": "¿Qué valores críticos hay que informar después de comprobarlos?:",
    "answers": [
      "Hb. por debajo de 5 mg/dl.",
      "Hiperglucemias e hipoglucemias.",
      "Hiponatremias e Hiperpotasemias.",
      "Todas son ciertas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 279,
    "number": 279,
    "question": "El intervalo de linealidad o de determinación de un método es:",
    "answers": [
      "El intervalo de concentración más fiable de medida para la determinación analítica del analito.",
      "La concentración mínima de un analito que puede ser cuantificada en una matriz real.",
      "La dispersión de estos resultados alrededor de su media.",
      "La diferencia (en porcentaje) entre la concentración medida de un analito en una muestra fortificada (a la que se le ha agregado una cantidad conocida de estándar) y la concentración medida en la misma _______________________________________________________________________________________ muestra sin fortificar, dividido por la concentración de sustancia agregada. E) La concentración máxima de un analito que puede ser cuantificada en una matriz real."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 280,
    "number": 280,
    "question": "La capacidad de un método analítico para determinar exclusivamente el componente que se quiere medir se denomina:",
    "answers": [
      "Especificidad",
      "Sensibilidad",
      "Linealidad",
      "Límite de detección"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 281,
    "number": 281,
    "question": "A que se denomina Exactitud:",
    "answers": [
      "Capacidad de determinar un analito en forma eficaz.",
      "Igualdad de los resultados entre los diferentes laboratorios.",
      "Concordancia de nuestro resultado con el valor verdadero.",
      "Cantidad de variable analítica recuperada."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 282,
    "number": 282,
    "question": "Queremos diluir un suero a una dilución 1/5. Teniendo en cuenta que el volumen final de muestra es de 1 ml, ¿Qué cantidad de suero y diluyente son necesarios?",
    "answers": [
      "250 ml de suero y 750 de diluyente",
      "200 ml de suero y 800 de diluyente",
      "150 ml de suero y 850 de diluyente",
      "210 ml de suero y 790 de diluyente Comentario: sería 200/(800+200), que es lo mismo que 200/1000 que es lo mismo que 1/"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 283,
    "number": 283,
    "question": "Para un volumen final de 800 microlitros ¿Cómo se realiza una dilución 1/40?:",
    "answers": [
      "100 microlitros de muestra en 700 microlitros de diluyente.",
      "40 microlitros de muestra en 760 microlitros de diluyente.",
      "10 microlitros de muestra en 790 microlitros de diluyente.",
      "20 microlitros de muestra en 780 microlitros de diluyente. Comentario: sería 20/ (780+20) es decir 20/800 que es lo mismo que 1/40"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 284,
    "number": 284,
    "question": "Dependiendo de las determinaciones solicitadas, se introducirá la muestra en tubos con diferentes aditivos, y sabemos que:",
    "answers": [
      "El hemograma se hace siempre en tubo con EDTA K7.",
      "El tubo para el estudio de coagulación lleva citrato de sodio de aditivo.",
      "Todas las determinaciones del perfil bioquímico sólo se pueden hacer en suero.",
      "El aditivo del tubo de tapón de color azul siempre será heparina de sodio o de litio."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 285,
    "number": 285,
    "question": "Al conjunto de operaciones que se realiza de manera periódica y programada sobre un instrumento analítico, con el fin de prevenir fallos, deterioros, averías o mal funcionamiento de los equipos, se denomina:",
    "answers": [
      "Calibración.",
      "Utilización.",
      "Mantenimiento.",
      "Verificación."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 286,
    "number": 286,
    "question": "Señale el criterio de rechazo de solicitud de pruebas, al no garantizarse la identificación inequívoca del paciente y sus muestras:",
    "answers": [
      "Solicitud con datos del paciente ilegibles.",
      "Solicitud sin datos mínimos del paciente.",
      "Solicitud sin número de muestra.",
      "Todas las respuestas anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 287,
    "number": 287,
    "question": "La capacidad de un método analítico para determinar exclusivamente el componente que se quiere medir se denomina:",
    "answers": [
      "Especificidad.",
      "Sensibilidad.",
      "Límite de detección.",
      "Precisión."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 288,
    "number": 288,
    "question": "La desviación estándar de un nivel de control de calidad de sodio, en el que la media es 144 mEq/l y el rango 129-159 mEq/l es: _______________________________________________________________________________________",
    "answers": [
      "7.5",
      "15",
      "30",
      "5 Comentario: Finalmente dieron la D, pero no estoy de acuerdo. La media es 144 para calcular cuál es la desviación estándar se coge uno de los dos valores del extremo del intervalo y se resta, y luego se divide entre 2. Por ejemplo, 159-144= 15. 15/2= 7,5. Dieron la D al considerar 3 desviaciones estándar. 15/3= 5"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 289,
    "number": 289,
    "question": "El transporte de las muestras desde Atención Primaria al Laboratorio, debe cumplir unas normas. ¿Cuál de las siguientes afirmaciones es FALSA?",
    "answers": [
      "El contenedor con las muestras debe ir adecuadamente situado en el vehículo de transporte, para que no pueda moverse.",
      "Debe evitarse que las muestras estén sometidas a movimientos bruscos que las deterioren.",
      "Es necesario llevar en el vehículo soluciones desinfectantes, para limpiar un posible derrame de las muestras.",
      "Las muestras deben llegar al Laboratorio en el menor tiempo posible para garantizar un análisis de calidad, siendo el tope las 6 horas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 290,
    "number": 290,
    "question": "Para un volumen final de 800 microlitros, ¿cómo se realiza una dilución 1/40?",
    "answers": [
      "100 microlitros de muestra en 700 microlitros de diluyente.",
      "40 microlitros de muestra en 760 microlitros de diluyente.",
      "10 microlitros de muestra en 790 microlitros de diluyente",
      "20 microlitros de muestra en 780 microlitros de diluyente. Comentario. Sería 20/ (780+20) que son 20/800 que es lo mismo que 1/40. ¡Hay que hacer las cuentas en papel en el examen!"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 291,
    "number": 291,
    "question": "Varón de 39 años que acude a urgencias por fiebre alta sin otra sintomatología acompañante. Sin antecedentes personales de interés. Se solicita analítica al Laboratorio de Urgencias, y se obtienen los siguientes resultados: Glucosa: 85 mg/dL (70- 110), Urea: 26 mg/dL (10-50), Creatinina: 0.83 mg/dL (0.73-1.3), Potasio: 7 mEq/L (3.5-5), Sodio: 135 mEq/L (135-145). Hemograma con resultados dentro de la normalidad. El resultado de Potasio obtenido está considerado un Valor Crítico en su Laboratorio. ¿Cuál debería ser la primera actuación del TEL de Urgencias?",
    "answers": [
      "Se debe comunicar el resultado al profesional sanitario al cargo de este paciente, con la mayor inmediatez.",
      "Repetir siempre el resultado, independientemente del tiempo que se vaya a invertir en hacerlo.",
      "Comprobar la calidad de la muestra y comprobar que no hay hemólisis.",
      "Anular el resultado y solicitar nueva muestra."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 292,
    "number": 292,
    "question": "El protocolo de comunicación de Valores Críticos debe tener en cuenta:",
    "answers": [
      "El personal responsable de la comunicación, no siendo necesario especificar el receptor con tal de que llegue el mensaje.",
      "El personal responsable de la comunicación, el receptor de la información, la vía de notificación empleada, el registro y la evaluación periódica del sistema.",
      "El personal responsable de la comunicación y la vía de notificación, no siendo necesario registrar en el caso de fracasar la comunicación.",
      "No es necesario elaborar un protocolo para los resultados críticos, siempre que estos se comuniquen de manera adecuada."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 293,
    "number": 293,
    "question": "En la implantación de un sistema de comunicación de Valores Críticos en el Laboratorio, es FALSO que:",
    "answers": [
      "Sólo es necesario consensuar el protocolo con los clínicos de Atención Primaria, ya que los de Especializada pueden consultar con mayor precocidad la evolución del paciente.",
      "El sistema de elaboración e implantación de un procedimiento de valores críticos puede confeccionarse a través de la información obtenida de _______________________________________________________________________________________ encuestas, cuestionarios, reuniones y/o creación de comités responsables.",
      "Es el Laboratorio quién tiene la responsabilidad de coordinar el proceso.",
      "Se debe tener en cuenta las características de la institución a la que pertenece el laboratorio clínico."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 294,
    "number": 294,
    "question": "En relación con los controles de calidad internos, señale la afirmación correcta:",
    "answers": [
      "Los controles internos se utilizan para asegurar que los valores obtenidos en las muestras sean fiables.",
      "Estos controles se realizan en la Fase Analítica del proceso.",
      "Los controles internos se utilizan para evaluar de forma continua la calidad analítica.",
      "Todas las respuestas anteriores son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 295,
    "number": 295,
    "question": "A partir del suero de un paciente, se debe hacer una dilución al 1:25 obteniendo un volumen final de 500 μL. ¿Cuáles serían los volúmenes a utilizar?",
    "answers": [
      "25 μL de suero y 475 μL de diluyente.",
      "20 μL de suero y 480 μL de diluyente.",
      "30 μL de suero y 470 μL de diluyente.",
      "15 μL de suero y 485 μL de diluyente. Comentario: qué poco os gustan los números. 20/ (480+20) serían 20/500 que es lo mismo que 1/25"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 311,
    "number": 311,
    "question": "El documento escrito que describe de forma ordenada y detallada cómo se realiza una determinada actividad rutinaria de carácter técnico, facilitando una mayor uniformidad en la aplicación de los métodos de ensayo y una mayor repetitividad de los resultados, se denomina:",
    "answers": [
      "Registro de control de calidad.",
      "Procedimiento normalizado de trabajo.",
      "Manual de calidad.",
      "Formulario."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 312,
    "number": 312,
    "question": "¿Cómo se denomina el proceso por el que un organismo autorizado evalúa, verifica y reconoce formalmente que una entidad es competente para realizar unas tareas perfectamente especificadas?: _______________________________________________________________________________________",
    "answers": [
      "Acreditación.",
      "Auditoría.",
      "Verificación.",
      "Certificación."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 313,
    "number": 313,
    "question": "La fiabilidad de los análisis realizados en un laboratorio de Análisis Clínicos y Microbiología depende de:",
    "answers": [
      "La cantidad de muestras recibidas y procesadas.",
      "La realización en paralelo de diferentes técnicas diagnósticas, empleadas para una misma prueba.",
      "Realizar determinaciones repetidas de una misma prueba, en un periodo corto de tiempo.",
      "La selección apropiada de la muestra, recogida, transporte y conservación de manera correcta."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 314,
    "number": 314,
    "question": "¿Cuál de las siguientes afirmaciones no es correcta sobre el empleo de anticoagulantes?:",
    "answers": [
      "El ácido cítrico-(citrato)-dextrosa (ACD) se recomienda para la realización de estudios inmunofenotípicos leucocitarios y cultivos de médula ósea.",
      "El citrato sódico es un anticoagulante fisiológico, recomendable para la realización de la extensión sanguínea.",
      "La heparina es un anticoagulante fisiológico, recomendable para la realización de la extensión sanguínea",
      "El oxalato sódico es un anticoagulante recomendado para las pruebas de hemostasia. Explicación: la más falsa es la c, pero todas las demás opciones están cogidas con pinzas. La considero impugnable. Al final no la impugnaron en el examen"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 315,
    "number": 315,
    "question": "En la elaboración de los Protocolos Normalizados de Trabajo (PNT), se deben tener en cuenta varias premisas. Indicar cuál de las siguientes respuestas es incorrecta.",
    "answers": [
      "Preferiblemente los PNT deben ser redactados por la misma persona que desarrolla habitualmente la actividad que se describe.",
      "Las copias autorizadas no deben estar disponibles y próximas al área de trabajo, ni distribuirse al personal.",
      "Cada PNT debe ser revisado por personal diferente a su autor y aprobarlo por un supervisor.",
      "Debe utilizar un lenguaje claro y preciso."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 316,
    "number": 316,
    "question": "¿Qué nombre reciben los ejercicios interlaboratorios, en los cuales un laboratorio se somete a unas pruebas consistentes en el análisis de muestras de referencia, pata evaluar la calidad de los resultados obtenido por los laboratorios participantes?:",
    "answers": [
      "Gráficos de control.",
      "Correlación de resultados.",
      "Ensayos de aptitud.",
      "Análisis de blancos."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 317,
    "number": 317,
    "question": "Respecto a los gráficos de control de calidad CUSUM, señala la respuesta incorrecta:",
    "answers": [
      "En su utilización se distinguen dos etapas: preliminar y de control.",
      "Destaca mejor los errores sistemáticos que el gráfico de Levey-Jennings.",
      "Para poner de manifiesto situaciones de falta de control usa el “ delimitador V ”",
      "También se denominan gráficos de sumas acumuladas."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 318,
    "number": 318,
    "question": "¿Cuál de las siguientes funciones corresponde a la dirección de calidad de un laboratorio?",
    "answers": [
      "Establecer la política de la calidad.",
      "Asegurarse de la disponibilidad de los recursos adecuados para la realización de las actividades preanalíticas, analíticas y postanalíticas.",
      "Definir las responsabilidades, autoridades e interrelaciones de todo el personal.",
      "Asegurarse de que se establecen, implementan, y mantienen los procesos necesarios para el sistema de gestión de la calidad."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 319,
    "number": 319,
    "question": "Los resultados obtenidos al pesor un objeto de 5 gramos con 2 balanzas distintas se expresan en la tabla adjunta. Indique cuál de las siguientes afirmaciones es correcta: Balanza 1 Balanza 2 Medición 1 1g 8g _______________________________________________________________________________________ Medición 2 9g 7,7g Medición 3 7g 7,5g Medición 4 3g 8,1g",
    "answers": [
      "La balanza 1 es imprecisa y exacta.",
      "La balanza 2 es precisa pero inexacta.",
      "La balanza 1 es precisa e inexacta.",
      "La balanza 2 es imprecisa y exacta."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 321,
    "number": 321,
    "question": "Respecto al uso de heparina como anticoagulante es incorrecto:",
    "answers": [
      "Actúa como anticoagulante, acelerando la acción de la antitrombina III e inhibiendo -por tanto- el paso de protrombina a trombina en la formación del coágulo.",
      "Es quelante del Ca: No es apto para las determinaciones enzimáticas que requieran calcio u otro catión divalente como cofactor.",
      "Es el anticoagulante de elección en las muestras de plasma que se usan para la medición de parámetros bioquímicos.",
      "La heparina de litio no se debe utilizar para la determinación del litio en sangre."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 322,
    "number": 322,
    "question": "¿Cuál es la principal diferencia entre suero y plasma?",
    "answers": [
      "El suero no contiene fibrinógeno.",
      "El suero contiene fibrinógeno.",
      "El plasma no contiene fibrinógeno.",
      "El plasma no contiene factores de la coagulación."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 323,
    "number": 323,
    "question": "Para la obtención de una muestra, todas las afirmaciones son correctas, excepto:",
    "answers": [
      "Se debe confirmar la identidad del paciente.",
      "Se debe confirmar que el paciente ha seguido las instrucciones previas.",
      "Es necesario comprobar el cierre hermético de los recipientes contenedores una vez obtenidas las muestras.",
      "No todas las muestras deben considerarse potencialmente contaminantes."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 324,
    "number": 324,
    "question": "Para evitar contaminación en la muestra, el orden para llenar los tubos debe ser el siguiente:",
    "answers": [
      "Tubo rojo, tubo azul, tubo verde, tubo violeta, tubo gris.",
      "Tubo rojo, tubo verde, tubo azul, tubo violeta, tubo gris.",
      "Tubo rojo, tubo violeta, tubo gris, tubo verde, tubo azul.",
      "Tubo rojo, tubo azul, tubo gris, tubo violeta, tubo verde."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 325,
    "number": 325,
    "question": "El correcto funcionamiento del Sistema de Gestión de Calidad en un laboratorio es responsabilidad de:",
    "answers": [
      "Jefe del laboratorio.",
      "Supervisor del laboratorio.",
      "Todos los miembros del laboratorio.",
      "Director Gerente."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 326,
    "number": 326,
    "question": "Se define como indicador de calidad a las características que debe cumplir una estructura, un proceso o un resultado para que se pueda considerar de calidad. Indique cuál de las siguientes características debe reunir un indicador de calidad:",
    "answers": [
      "Exigente.",
      "Subjetivo.",
      "Específico.",
      "Genérico."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 327,
    "number": 327,
    "question": "Señala la respuesta correcta en relación con la sensibilidad:",
    "answers": [
      "Es la proporción de individuos enfermos con prueba positiva. _______________________________________________________________________________________",
      "Es la proporción de individuos sanos con prueba negativa.",
      "Cuando un signo, síntoma o prueba diagnóstica posee alta sensibilidad (mayor de 95%) la obtención de un resultado negativo o normal descarta con confianza el diagnóstico de enfermedad.",
      "A y C son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 328,
    "number": 328,
    "question": "La Norma ISO 15189 define los requisitos particulares de calidad y competencia que deben cumplir los laboratorios clínicos que analizan muestras biológicas de origen humano, entre ellos se encuentran:",
    "answers": [
      "Personal cualificado.",
      "Instalaciones, condiciones ambientales y equipos adecuados.",
      "Control de procesos clave: preanalíticos, analíticos y postanalíticos.",
      "Todas las respuestas son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 329,
    "number": 329,
    "question": "Un error aleatorio es aquél que:",
    "answers": [
      "Está producido por un fallo sistemático.",
      "Es predecible.",
      "Afecta al resultado obtenido en cualquier sentido tanto por exceso como por defecto.",
      "A y C son correctas."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 330,
    "number": 330,
    "question": "Entre las causas de hemólisis de una muestra no está:",
    "answers": [
      "Extracción dificultosa.",
      "Choque térmico (enfriamiento o calentamiento excesivo).",
      "Problemas metabólicos.",
      "Permanencia prolongada de la sangre total sin centrifugar."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 331,
    "number": 331,
    "question": "Entre los errores en la fase preanalítica no tenemos:",
    "answers": [
      "Centrifugación insuficiente o excesiva y alicuotado incorrecto.",
      "Toma de muestra cuando el paciente no ha seguido las instrucciones previas.",
      "El uso de reactivos reconstituidos o conservados de forma incorrecta.",
      "El registro de una petición que no coincide con las muestras."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 332,
    "number": 332,
    "question": "De las siguientes afirmaciones en a la Norma ISO 15189 ¿Cuál es la INCORRECTA?",
    "answers": [
      "Valora la competencia técnica del laboratorio y de los profesionales.",
      "Es una certificación.",
      "Es específica de los laboratorios clínicos.",
      "En España. la auditoría externa sólo la puede hacer ENAC."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 333,
    "number": 333,
    "question": "De las siguientes afirmaciones sobre los errores sistemáticos ¿Cuál es la INCORRECTA?",
    "answers": [
      "Se reproducen siempre al medir y en distintas direcciones.",
      "Los errores instrumentales son debidos a aparatos mal calibrados o mal reglados, o por las limitaciones del propio aparato.",
      "Los errores teóricos son debidos a la introducción de condiciones distintas a las idealmente supuestas para la realización del experimento.",
      "Los errores personales son debidos a las peculiaridades del observador."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 334,
    "number": 334,
    "question": "¿Cuál de las siguientes actividades se realizan en la fase preanalítica?",
    "answers": [
      "Preparación de los reactivos.",
      "Recepción de las muestras.",
      "Procesamiento de las muestras.",
      "Calibración del aparato."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 335,
    "number": 335,
    "question": "De las siguientes afirmaciones sobre diluciones, ¿Cuál es la INCORRECTA?",
    "answers": [
      "Soluto es la sustancia que se disuelve.",
      "Disolvente es la sustancia en la que se disuelve el soluto.",
      "Disolución es el conjunto formado por el disolvente y el soluto.",
      "Disolución diluida es aquella en que la cantidad de soluto es mayor que la de disolvente."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 336,
    "number": 336,
    "question": "¿A cuántos litros (L) equivale un femtolitro?",
    "answers": [
      "10ˉ¹² L. _______________________________________________________________________________________",
      "10ˉ¹⁵ L.",
      "10ˉ⁶ L.",
      "10ˉ¹⁸ L."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 337,
    "number": 337,
    "question": "De las siguientes respuestas ¿Cuál es la CORRECTA?",
    "answers": [
      "El plasma no contiene factores de la coagulación.",
      "El suero no contiene fibrinógeno.",
      "El suero contiene fibrinógeno.",
      "El plasma no contiene fibrinógeno"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 338,
    "number": 338,
    "question": "¿Qué parámetro relaciona el coeficiente de variación?",
    "answers": [
      "Variancia y media.",
      "Desviación estándar y mediana.",
      "Variancia y mediana.",
      "Desviación estándar y media."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 342,
    "number": 342,
    "question": "El valor predictivo negativo puede ser definido como:",
    "answers": [
      "La probabilidad de enfermedad en un paciente con una prueba negativa.",
      "La probabilidad de enfermedad en un paciente con prueba positiva.",
      "La probabilidad de no tener enfermedad con una prueba negativa.",
      "La probabilidad de no tener enfermedad en un paciente con una prueba positiva."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 343,
    "number": 343,
    "question": "Seleccione la definición correcta de “prevalencia de una enfermedad”:",
    "answers": [
      "El porcentaje de resultados positivos en una población.",
      "Los casos nuevos de la enfermedad en una población en un año.",
      "La frecuencia de la enfermedad en una población dada.",
      "La probabilidad de un resultado de prueba positivo para la enfermedad."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 344,
    "number": 344,
    "question": "Respecto a las curvas ROC:",
    "answers": [
      "Son índices de la especificidad diagnóstica de una prueba.",
      "Se obtienen representando sensibilidad frente a especificidad.",
      "Cuanto más próxima está una curva ROC de la esquina superior izquierda, más alta es la exactitud diagnóstica de la prueba.",
      "Dependen de la prevalencia de la enfermedad"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 345,
    "number": 345,
    "question": "Si un laboratorio clínico se quisiera certificar ¿qué Norma ISO implantaría?",
    "answers": [
      "ISO 9001:2015",
      "ISO 17025:2005",
      "ISO 15189:2022",
      "ISO 22870:2016"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 346,
    "number": 346,
    "question": "El procedimiento por el que un organismo rector reconoce formalmente que un organismo o una _______________________________________________________________________________________ persona es competente para llevar a cabo tareas específicas se denomina:",
    "answers": [
      "Acreditación.",
      "Certificación.",
      "Licencia.",
      "A y B son ciertas."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 347,
    "number": 347,
    "question": "La precisión de un método de medida:",
    "answers": [
      "Se refiere a la concordancia entre el valor medido de una serie de determinaciones y el valor verdadero.",
      "Está relacionado con el valor considerado “verdadero” de la medición.",
      "Se valora con parámetros como el coeficiente de variación (CV) y la desviación estándar (DS).",
      "Se relaciona con el error sistemático"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 348,
    "number": 348,
    "question": "Cuál de las siguientes afirmaciones sobre el control de calidad interno es FALSA:",
    "answers": [
      "Controla la calidad utilizando solamente los resultados obtenidos por el propio laboratorio.",
      "Permite detectar errores sistemáticos que producen inexactitud de los resultados, pero no aleatorios.",
      "Se utiliza para aceptar o rechazar cada serie analítica en la que se procesan los controles.",
      "Se realiza analizando materiales de control cuyas características son conocidas."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 349,
    "number": 349,
    "question": "Señale el tipo de error menos frecuente en los sistemas POCT:",
    "answers": [
      "Preanalítico.",
      "Analítico.",
      "Postanalítico.",
      "En ninguno de ellos se producen errores."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 350,
    "number": 350,
    "question": "Uno de los siguientes aspectos NO es un inconveniente de los sistemas POCT:",
    "answers": [
      "La inexactitud.",
      "Formación del personal.",
      "Escaso almacenamiento de los resultados de las pruebas en el lugar de asistencia al paciente en la historia clínica del paciente.",
      "La manipulación y el transporte de las muestras."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 351,
    "number": 351,
    "question": "Valorando la experiencia de los centros que han puesto en marcha programas para realizar POCT, el principal criterio para la implantación de este tipo de mediciones suele ser:",
    "answers": [
      "Tiempo de respuesta.",
      "Facilidad de manejo.",
      "Coste económico.",
      "Fiabilidad."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 352,
    "number": 352,
    "question": "¿Cuál es mayor inconveniente con respecto a las pruebas de laboratorio en el lugar de atención al paciente?",
    "answers": [
      "No suelen ser trazables con los del laboratorio principal debido a las diferencias bioquímicas entre las fuentes de obtención de las muestras.",
      "Coste.",
      "Se suele producir una contaminación significativa de la muestra con alcohol u otros desinfectantes.",
      "Todas son verdaderas."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 353,
    "number": 353,
    "question": "El grado en el que una intervención produce un resultado beneficioso en las condiciones reales de la práctica habitual, se conoce como:",
    "answers": [
      "Eficacia",
      "Efectividad",
      "Evidencia",
      "Eficiencia"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 354,
    "number": 354,
    "question": "Ante un resultado crítico:",
    "answers": [
      "El laboratorio debe informar solo si el paciente está ingresado",
      "El Laboratorio debe comunicarlo rápido y registrarlo en el SIL",
      "No es necesario registrarlo en la historia clínica del paciente",
      "El procedimiento es el mismo que el laboratorio siga con otros resultados"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 355,
    "number": 355,
    "question": "Si se realizan 10 determinaciones de Calcio en una única muestra de suero, los resultados no serán todos iguales debido a:",
    "answers": [
      "Inexactitud _______________________________________________________________________________________",
      "Error sistemático",
      "Interferencias",
      "Error aleatorio"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 356,
    "number": 356,
    "question": "De los siguientes aspectos, indique cuál es un indicador de la fase post-analítica:",
    "answers": [
      "Identificación incorrecta del paciente en las muestras.",
      "Tiempo de respuesta inadecuado.",
      "Petición analítica ininteligible.",
      "Error en la transcripción de resultados analíticos"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 357,
    "number": 357,
    "question": "¿Cuál de las siguientes medidas se considera como medida de posición?:",
    "answers": [
      "Coeficiente de variación.",
      "Cuartiles.",
      "Varianza.",
      "Media aritmética."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 358,
    "number": 358,
    "question": "Una de las siguientes afirmaciones es falsa:",
    "answers": [
      "Bajo ningún concepto se debe dejar de comunicar un valor crítico.",
      "Se deben definir los límites de cada valor crítico.",
      "La lista debe ser estructurada en categorías según el grado de riesgo crítico, y a cada categoría se le asignará un tiempo de comunicación.",
      "La lista debe incluir: nombre de la prueba, límites, unidades y tiempo para la notificación."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 359,
    "number": 359,
    "question": "¿Qué afirmación no es correcta con respecto a las recomendaciones de orden de llenado de tubos de extracción?:",
    "answers": [
      "Los tubos y frascos estériles para hemocultivo deben extraerse en primer lugar.",
      "Los tubos con EDTA (tapón morado) deben extraerse después de los tubos con heparina de litio (tapón verde).",
      "Los tubos con citrato sódico (tapón azul) para pruebas de coagulación deben extraerse antes de los tubos con EDTA para hematología.",
      "Los tubos con gel separador con activador de la coagulación para suero (tapón amarillo) deben extraerse después de los tubos con EDTA para hematología."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 360,
    "number": 360,
    "question": "L a sensibilidad de una prueba diagnóstica para una enfermedad se obtiene multiplicando por 100 el siguiente cociente:",
    "answers": [
      "Verdaderos negativos dividido entre la suma de sujetos sanos.",
      "Verdaderos negativos dividido entre la suma de sujetos con resultado negativo.",
      "Verdaderos positivos dividido entre la suma de sujetos enfermos.",
      "Verdaderos positivos dividido entre la suma de sujetos con resultado positivo."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 361,
    "number": 361,
    "question": "Las diferencias entre certificación y acreditación estriban en:",
    "answers": [
      "Una organización certificada ISO 9001 ha demostrado que su sistema de gestión de calidad cumple los requisitos establecidos en la norma ISO 9001 mientras que una organización acreditada ha demostrado su competencia para llevar a cabo las actividades de evaluación para las que esté acreditado.",
      "Una organización certificada ISO 9001 ha demostrado su competencia para llevar a cabo las actividades de evaluación para las que esté certificado, mientras que una organización acreditada ha demostrado que su sistema de gestión de calidad cumple los requisitos establecidos en la norma ISO 9001.",
      "Una organización certificada ISO 9001 tiene mayor fiabilidad en sus procesos que una acreditada ISO 9001.",
      "Ambos procedimientos son equivalentes"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 362,
    "number": 362,
    "question": "La implementación de un sistema de gestión de control de calidad basado en los Internacional Estándar (ISO) constituye una herramienta para evaluar y controlar los sistemas de POCT. Señale la respuesta CORRECTA.",
    "answers": [
      "La norma internacional ISO 22870 proporciona requerimientos específicos aplicables a los sistemas _______________________________________________________________________________________ de POCT, constituyendo un complemento a los requisitos propuestos en la ISO 15189.",
      "La norma internacional ISO 22880 proporciona requerimientos específicos aplicables a los sistemas de POCT, constituyendo un complemento a los requisitos propuestos en la ISO 15189.",
      "La norma internacional ISO 22890 proporciona requerimientos específicos aplicables a los sistemas de POCT, constituyendo un complemento a los requisitos propuestos en la ISO 15189.",
      "La norma internacional ISO 22850 proporciona requerimientos específicos aplicables a los sistemas de POCT, constituyendo un complemento a los requisitos propuestos en la ISO 15189."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 363,
    "number": 363,
    "question": "Señale la respuesta FALSA en cuanto al archivo muestras:",
    "answers": [
      "El tiempo y las condiciones del archivo temporal vendrán reflejadas para cada muestra y/o prueba en la cartera de servicios.",
      "En todos los laboratorios existirán archivos indefinidos de muestras/especímenes.",
      "El tiempo y las condiciones del archivo indefinido deberán ser los mismos para cada muestra y/o prueba.",
      "Se guardarán las muestras/especímenes de pacientes con interés clínico/epidemiológico y/o para la investigación"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 364,
    "number": 364,
    "question": "Se define “valor de referencia” como:",
    "answers": [
      "El conjunto de todos los posibles individuos de referencia.",
      "Aquel valor de la distribución de referencia que excluye, con una probabilidad determinada, una fracción de dicha distribución.",
      "Valor obtenido por la medición de una magnitud en el laboratorio en un individuo de referencia que forma parte de la muestra de referencia.",
      "El intervalo de la distribución de referencia que queda comprendido entre los límites de referencia, incluyéndolos a ambos."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 365,
    "number": 365,
    "question": "En la preparación de los sujetos para la determinación de los valores de referencia hay que tener en cuenta los siguientes factores:",
    "answers": [
      "Factores biológicos: metabólicos, hemodinámicas, inducción enzimática, daño celular.",
      "Factores metodológicos: obtención de muestra, transporte de muestra, manipulación de muestra.",
      "Preparación del individuo: dieta anterior, ayuno, régimen de drogas, momento de la toma de muestra en relación con los ritmos biológicos, actividad física, encamado o no, estrés.",
      "Todos ellos."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 366,
    "number": 366,
    "question": "La determinación de valores de referencia en un laboratorio clínico se hace necesario fundamentalmente:",
    "answers": [
      "Periódicamente.",
      "Al instaurar la medición de un nuevo constituyente.",
      "Al utilizar un método nuevo o diferente.",
      "Las respuestas B y C son correctas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 367,
    "number": 367,
    "question": "Generalmente se suele definir el intervalo de referencia como el intervalo de resultados que comprenden:",
    "answers": [
      "Un 55% de la probabilidad total.",
      "Un 25% de la probabilidad total.",
      "Un 95% de la probabilidad total.",
      "Un 75% de la probabilidad total."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 368,
    "number": 368,
    "question": "Las pruebas reflejas:",
    "answers": [
      "Son las incluidas en un mismo perfil.",
      "Son las que se generan rápidamente en urgencias ante valores críticos.",
      "Requieren siempre y en cada caso la acción de un facultativo para su realización.",
      "Son las generadas de manera automática utilizando las herramientas del sistema informático del laboratorio"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 369,
    "number": 369,
    "question": "En el proceso de revisión y validación, se denomina “delta check” a:",
    "answers": [
      "Los valores de referencia (valores normales) en función de la edad y el sexo. _______________________________________________________________________________________",
      "La diferencia critica entre dos resultados.",
      "Cambio de valor respecto a otro anterior en un periodo de tiempo.",
      "Los valores de pánico (valores muy altos o muy bajos)."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 370,
    "number": 370,
    "question": "El resultado aislado más pequeño que, con una determinada probabilidad, se puede distinguir de un blanco, se denomina:",
    "answers": [
      "Límite de detección.",
      "Precisión.",
      "Linealidad.",
      "Sensibilidad."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 371,
    "number": 371,
    "question": "La precisión de un resultado analítico es:",
    "answers": [
      "Reproducibilidad.",
      "Aproximación al valor verdadero.",
      "Capacidad de un método de determinar únicamente el componente que se pretende medir.",
      "Resultado más pequeño que puede medirse."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 372,
    "number": 372,
    "question": "Indica el número ONU que corresponde a «materia biológica, clase B»",
    "answers": [
      "Núm. ONU 2814",
      "Núm. ONU 3373",
      "Núm. ONU 7737",
      "Núm. ONU 1428"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 373,
    "number": 373,
    "question": "Indica la frase verdadera respecto al transporte de muestras biológicas:",
    "answers": [
      "El transporte de muestras biológicas en España lo regula la normativa ADR.",
      "la normativa ADR no es de obligado cumplimiento en nuestro país.",
      "La normativa exige que los contenedores secundarios sean rojos.",
      "Los contenedores terciarios tienen que ser obligatoriamente flexible"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 375,
    "number": 375,
    "question": "En el sistema básico de embalaje envasado/triple, señale la respuesta falsa.",
    "answers": [
      "El recipiente primario el cual contiene la sustancia infecciosa debe ser hermético e impermeable.",
      "El recipiente primario, si la sustancia está en forma líquida o semilíquida debe estar envuelto de un material absorbente en caso de rotura o fuga.",
      "El recipiente secundario debe estar debidamente etiquetado en cuanto a su contenido.",
      "El recipiente secundario debe ser hermético e impermeable a pruebas de derrames para proteger al recipiente primario"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 376,
    "number": 376,
    "question": "¿Con qué indicador o parámetro estadístico debería medirse un error constante y en un mismo sentido de una determinada magnitud biológica medida en el laboratorio?:",
    "answers": [
      "Desviación estándar y coeficiente de variación",
      "Error total",
      "Error sistemático",
      "Media aritmética"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 377,
    "number": 377,
    "question": "¿Qué se persigue con la eficiencia en el medio sanitario?:",
    "answers": [
      "Conseguir los mejores resultados con los menores costes posibles",
      "Atención sanitaria adecuada a las necesidades del paciente.",
      "El grado de atención sanitaria percibido por el paciente.",
      "Acceso eficaz de los recursos sanitarios al paciente."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 378,
    "number": 378,
    "question": "¿Qué es la eficacia?:",
    "answers": [
      "Relación existente entre los esfuerzos y los recursos utilizados. _______________________________________________________________________________________",
      "Grado de consecución de los objetivos propuestos sin tener en cuenta el coste empleado.",
      "Sistema que mide lo apropiado de los servicios que se ofertan en relación a las necesidades de la población que se atiende.",
      "Posibilidad real de disponer de personal o del servicio en el momento preciso"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 379,
    "number": 379,
    "question": "La probabilidad de que una persona con un resultado negativo en una prueba diagnóstica esté realmente sano se denomina:",
    "answers": [
      "Valor predictivo positivo",
      "Valor predictivo negativo",
      "Sensibilidad",
      "Prevalencia"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 380,
    "number": 380,
    "question": "Las relaciones entre el coste de una actividad y el efecto que produce sobre la salud se conoce como:",
    "answers": [
      "Productividad.",
      "Ineficiencia.",
      "Eficacia.",
      "Eficiencia."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 381,
    "number": 381,
    "question": "La eficiencia de un sistema:",
    "answers": [
      "Mide el grado de consecución de los objetivos propuestos sin tener en cuenta el coste empleado.",
      "Se refiere a la posibilidad real de disponer del personal que se precise en el momento que se precise.",
      "Mide el grado de consecución de los objetivos propuestos.",
      "Mide el grado de consecución de los objetivos propuestos al menor coste posible."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 382,
    "number": 382,
    "question": "En una prueba diagnóstica, a la proporción de individuos sanos que tiene una prueba negativa se denomina:",
    "answers": [
      "Sensibilidad",
      "Especificidad",
      "Valor predictivo positivo",
      "Valor predictivo negativo"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 383,
    "number": 383,
    "question": "El modelo de calidad total o modelo EFQM:",
    "answers": [
      "No se puede aplicar a los laboratorios clínicos.",
      "Se basa en conceptos fundamentales de excelencia.",
      "Es certificable.",
      "Es acreditable."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 384,
    "number": 384,
    "question": "¿Cómo es también conocida la auditoría de tercera parte?",
    "answers": [
      "Auditoría interna.",
      "Auditoría de certificación.",
      "Auditoría de seguridad del producto.",
      "Auditoría de seguridad del paciente."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 385,
    "number": 385,
    "question": "Formo parte de un equipo de trabajo en un laboratorio clínico, hay diversos problemas que debemos identificar y analizar. Para ello emplearemos diversas técnicas, pero sólo una de las siguientes será la idónea para ayudarnos a decidir que problemas resolver primero y a identificarlos según el principio de \"pocos vitales, muchos triviales\":",
    "answers": [
      "Diagrama de Grandal",
      "Diagrama de Pareto",
      "Diagrama de lshikawa",
      "Diagrama de las 6M"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 388,
    "number": 388,
    "question": "¿Cómo se llama el modelo europeo de excelencia de gestión de calidad?",
    "answers": [
      "Normas ISO",
      "EFQM",
      "AENOR",
      "UNE-ISO/IEC"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 390,
    "number": 390,
    "question": "El ciclo de mejora continua también conocido como ciclo de Deming, está formado por 4 etapas:",
    "answers": [
      "Planificación, Hacer, Verificar y Actuar.",
      "Preparación, Hacer, Verificar y Activar.",
      "Planificación, Hacer, Verificar y Activar.",
      "Planificación, Hacer, Validar y Actuar."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 391,
    "number": 391,
    "question": "El modelo EFQM de excelencia puede ser aplicado:",
    "answers": [
      "En organizaciones de servicios.",
      "A determinadas organizaciones, dependiendo de su tamaño, sector o antigüedad.",
      "A cualquier organización.",
      "Ninguna de las anteriores es correcta."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 392,
    "number": 392,
    "question": "Según Donabedian, ¿cuál NO es un concepto a tener en cuenta en la evaluación de la calidad de la atención sanitaria?",
    "answers": [
      "Estructura.",
      "Resultado.",
      "Procedimiento.",
      "Proceso."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 394,
    "number": 394,
    "question": "El ciclo de Deming consta de cuatro pasos que se han de seguir de forma cíclica. ¿Cuál es el orden correcto?",
    "answers": [
      "Planificación, Intervención, Verificación, Actuación",
      "Planificación, Actuación, Intervención, Verificación",
      "Planificación, Actuación, Verificación, Intervención",
      "Planificación, Verificación, Actuación, Intervención"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 395,
    "number": 395,
    "question": "Teniendo en cuenta los métodos de evaluación de la calidad: Criterios, indicadores y estándares, señale la opción falsa:",
    "answers": [
      "El indicador se define como una unidad de medida que compara lo que se ha hecho con lo que se debería haber hecho",
      "El estándar comporta el nivel óptimo de aplicación del criterio",
      "El indicador supone normas previamente establecidas como parámetros de buena calidad",
      "El criterio es el aspecto concreto del problema detectado que se va a medir para conocer su grado de cumplimiento"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 396,
    "number": 396,
    "question": "La estrategia para evaluar la calidad asistencial desarrollada por Donabedian se basa en:",
    "answers": [
      "Análisis de la estructura, del proceso y de los resultados.",
      "Gestión del riesgo y promoción de productos y servicios.",
      "Sistematización de indicadores y estándares para la evaluación de la calidad.",
      "Planificación, control y mejora de la calidad. _______________________________________________________________________________________"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 397,
    "number": 397,
    "question": "El principal motor de los programas instituciones de mejora de la calidad es:",
    "answers": [
      "El alto nivel científico-técnico de los profesionales.",
      "La implicación de los usuarios y el feedback sobre la percepción de la calidad.",
      "La motivación de los profesionales.",
      "El nivel de participación de los usuarios y profesionales."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 398,
    "number": 398,
    "question": "Dentro de las características que deben tener los indicadores de calidad de la asistencia sanitaria, se incluye:",
    "answers": [
      "Normalmente los indicadores son de tipo cualitativo.",
      "Se utilizan con poca frecuencia, como herramienta de medida de calidad.",
      "Generalmente son de tipo cuantitativo.",
      "El indicador siempre debe medirse aplicando una escala ordinal."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 399,
    "number": 399,
    "question": "Una de las metas de la OMS es reducir las desigualdades sociales en salud. El término que hace referencia a esta meta es:",
    "answers": [
      "Igualdad.",
      "Eficiencia.",
      "Equidad.",
      "Accesibilidad."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 400,
    "number": 400,
    "question": "Un hombre de 80 años llega al servicio de urgencias por dolor torácico, fiebre de 39,3ºC y desorientación. Se obtienen muestreos de sangre en los tubos siguientes anticoagulantes: EDTA, heparina de litio, citrato sódico y un tubo con hielo separador para suero. También se recoge una muestra de esputo. Ante una posible contaminación en el momento de la extracción sanguínea, ¿qué resultados se pueden encontrar fuera de los valores de referencia?",
    "answers": [
      "El resultado de potasio se encuentra elevado porque el tubo con EDTA se ha extraído antes de que el tubo con heparina litio.",
      "El resultado de sodio se encuentra disminuido y la glucosa aumentada porque el tubo con citrato sódico se ha extraído antes de que el tubo con EDTA.",
      "El resultado de sodio se encuentra aumentado porque se ha extraído sangre de una vía de suero glucosado.",
      "El resultado de potasio se encuentra disminuido porque el tubo con EDTA se ha extraído antes de que el tubo con heparina litio."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 401,
    "number": 401,
    "question": "Respecto al Manual de la Calidad, señale la respuesta incorrecta:",
    "answers": [
      "Debe incluir la política de la calidad o una referencia de la misma.",
      "Es inaccesible al personal del laboratorio excepto para el jefe del servicio y el jefe de calidad.",
      "Incluye una descripción de la estructura y relación de la documentación del sistema de gestión de la calidad.",
      "Figura la estructura y dirección del laboratorio."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 402,
    "number": 402,
    "question": "¿Cuál de estas afirmaciones es incorrecta en cuando a la obtención y recogida de muestras?:",
    "answers": [
      "No es necesario verificar que el paciente ha seguido el protocolo de recogida de muestras.",
      "Recoger las muestras con las máximas condiciones de asepsia y protocolos de actuación preestablecidos.",
      "Verificar la trazabilidad de la identificación con la identificación de la muestra.",
      "Confirmar la identidad del paciente."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 403,
    "number": 403,
    "question": "Señala la respuesta correcta respecto a los marcadores tumorales:",
    "answers": [
      "Especificidad es la capacidad de la prueba para detectar la enfermedad en sujetos enfermos",
      "Especificidad es la capacidad de la prueba para detectar la ausencia de la enfermedad en sujetos sanos.",
      "Especificidad plantea el problema de discriminar el origen tumoral benigno o maligno ante la verificación de un incremento en el marcador",
      "Todas son falsas. _______________________________________________________________________________________"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 404,
    "number": 404,
    "question": "Teniendo en cuenta los métodos de evaluación de la calidad: Equidad, eficiencia, eficacia y efectividad, señale la opción falsa:",
    "answers": [
      "La eficiencia es la relación entre el coste del producto y su beneficio en términos de salud",
      "La eficacia es la capacidad real de mejorar el grado de salud de los pacientes",
      "La equidad es que las personas pueden desarrollar su máximo potencial de salud independientemente de su posición social u otras circunstancias determinadas por factores sociales",
      "La eficiencia es la capacidad de conseguir los mejores resultados al menor coste posible"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 405,
    "number": 405,
    "question": "¿Cuál es el código de la ONU que corresponde a materia biológica clase B?",
    "answers": [
      "2814",
      "2900",
      "3373",
      "7737"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 406,
    "number": 406,
    "question": "Cómo se denomina un componente cuando es objeto de análisis",
    "answers": [
      "Espécimen",
      "Muestra",
      "Analito",
      "Fluido"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 407,
    "number": 407,
    "question": "¿Cuál de las siguientes afirmaciones es cierta en relación con el error sistemático?",
    "answers": [
      "Se mide con el coeficiente de variación.",
      "Se mide con la desviación estándar.",
      "No se puede predecir.",
      "Puede ser constante y proporcional."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 408,
    "number": 408,
    "question": "Respecto a la desviación estándar:",
    "answers": [
      "Es un estadístico que ayuda a la medida de la imprecisión de un método de medida.",
      "Es un estadístico que expresa el error sistemático de un procedimiento de medida.",
      "Está relacionada con una calibración incorrecta.",
      "No se utiliza para evaluar el error aleatorio."
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 409,
    "number": 409,
    "question": "Con carácter general, ¿cuál es el tiempo máximo permitido entre la extracción de sangre y su separación para la obtención de suero?",
    "answers": [
      "30 minutos",
      "120 minutos",
      "60 minutos",
      "45 minutos"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 410,
    "number": 410,
    "question": "¿De qué trata la norma ISO/IEC17025?",
    "answers": [
      "Un sistema de acreditación de calidad destinado a cualquier organización",
      "Un estándar que establece los requerimientos para la competencia de laboratorios de ensayo y calibración",
      "Un sistema de certificación de calidad de los laboratorios",
      "Todas ellas"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 411,
    "number": 411,
    "question": "En los programas de garantía externa de la calidad se evalúan los resultados del:",
    "answers": [
      "Control de calidad interno de gestión interna.",
      "Control de calidad interno de gestión externa.",
      "Control de calidad externo.",
      "Control de calidad de valor conocido."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 412,
    "number": 412,
    "question": "El objetivo del mantenimiento correctivo es:",
    "answers": [
      "Programar los fallos o averías de los equipos.",
      "Realizar una intervención correctiva al detectar un fallo o avería, deterioro o mal funcionamiento de los equipos.",
      "Aquel que se desarrolla bajo distinto protocolo en función de la cualificación del operario.",
      "Prevenir futuros fallos del equipo una vez ya se ha producido la primera avería."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 413,
    "number": 413,
    "question": "En cuanto al transporte de muestras, señale la incorrecta.",
    "answers": [
      "Se recomienda que los recipientes primarios se transporten en posición vertical, con el tapón en la parte superior.",
      "Resguardar las muestras de la luz, ya que muchas de las propiedades son fotosensibles. _______________________________________________________________________________________",
      "Se recomienda que las muestras estén en continua agitación para evitar su coagulación.",
      "Registrar incidencias durante el transporte."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 414,
    "number": 414,
    "question": "La hemólisis provoca alteración de algunos parámetros, señala la incorrecta:",
    "answers": [
      "Lactato deshidrogenasa (LDH).",
      "Potasio.",
      "Aspartato aminotransferasa (AST).",
      "Proteína C reactiva (PCR)."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 415,
    "number": 415,
    "question": "¿Cuál de las siguientes afirmaciones es verdadera?",
    "answers": [
      "La filtración es un método básico para separar sustancias sólidas en suspensión de un medio líquido.",
      "La diálisis se basa en la utilización de una membrana semipermeable que permite el paso de moléculas hasta un tamaño determinado y previene el paso de moléculas mayores.",
      "La electroforesis es la separación de las moléculas de una disolución a través de un material poroso.",
      "La centrifugación consiste en la migración de moléculas cargadas a través de un medio, por la acción de un campo eléctrico."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 416,
    "number": 416,
    "question": "Cuando existe concordancia entre el valor medido y el verdadero, hablamos de:",
    "answers": [
      "Precisión",
      "Fiabilidad",
      "Exactitud",
      "Desviación estándar"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 417,
    "number": 417,
    "question": "Está descrito en la literatura que hasta un 60-70 % de los errores de laboratorio se relacionan con la fase:",
    "answers": [
      "Analítica",
      "Preanalítica",
      "Postanalítica",
      "Validación de resultados"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 418,
    "number": 418,
    "question": "¿Qué es una disolución 1 molar (M)?",
    "answers": [
      "Aquella que contiene 1 mol de disolución en 1 litro de soluto",
      "Aquella que contiene 1 mol de soluto en 1 litro de disolvente",
      "Aquella que contiene 1 mol de soluto en 1 mol de disolvente",
      "Aquella que contiene 1 litro de soluto en 1 litro de disolvente"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 419,
    "number": 419,
    "question": "¿Al número de moles de soluto por kilo de disolvente, se le denomina?",
    "answers": [
      "Molalidad",
      "Molaridad",
      "Osmolaridad",
      "Normalidad"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 420,
    "number": 420,
    "question": "¿Cuál de los siguientes errores no se considera un error en la fase analítica de la muestra?",
    "answers": [
      "Un error en el pipeteo de la muestra",
      "Un error en el uso de un reactivo y/o calibradores no adecuados",
      "Un error de trascripción en el resultado",
      "Un error en el suministro de energía del equipo"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 421,
    "number": 421,
    "question": "La capacidad de una prueba de detectar una enfermedad, se denomina:",
    "answers": [
      "Sensibilidad",
      "Especificidad",
      "Exactitud",
      "Precisión"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 422,
    "number": 422,
    "question": "Para construir una curva de calibrado. Indica la pregunta incorrecta:",
    "answers": [
      "Se prepara un blanco con todos las componentes de la muestra, pero sin la molécula de interés.",
      "Se realizan varias disoluciones patrón.",
      "Se mide la señal del blanco y todas las disoluciones patrón, y se registra la señal.",
      "No hace falta registrar gráficamente las medidas frente a los datos de concentración de la recta patrón."
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "id": 423,
    "number": 423,
    "question": "El parámetro capaz de diferenciar pequeñas variaciones en la medida de un analito se le conoce como:",
    "answers": [
      "Sensibilidad.",
      "Selectividad.",
      "Especificidad.",
      "Robustez. _______________________________________________________________________________________"
    ],
    "correctAnswer": 0,
    "explanation": ""
  },
  {
    "id": 424,
    "number": 424,
    "question": "¿Cuál de los siguientes objetivos no está incluido en la fase postanalítica?",
    "answers": [
      "Aplicar protocolos para garantizar la calidad del diseño y proceso analítico.",
      "Hacer uso de programas informáticos para el tratamiento y la gestión de datos relacionados con los resultados.",
      "Desarrollar técnicas de liderazgo para facilitar la coordinación de equipos.",
      "Tener criterio suficiente para aceptar los riesgos y la posibilidad de error y así resolver distintas situaciones y/o problemas."
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "id": 425,
    "number": 425,
    "question": "Respecto al control de calidad externo, señale la respuesta correcta:",
    "answers": [
      "Al realizar los controles de calidad internos, ya no son necesarios los externos.",
      "Una entidad o institución independiente distribuye material a los laboratorios participantes de forma simultánea.",
      "Se conocerán por anticipado los resultados a obtener de las muestras de control externo.",
      "No era necesario enviar resultados obtenidos a la entidad o institución que los envía."
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "id": 426,
    "number": 426,
    "question": "En relación con la estandarización de los colores de los tubos para muestras sanguíneas:",
    "answers": [
      "Los tubos morados o de color malva contiene EDTA.",
      "Los tubos de color azul claro contienen citrato.",
      "Los tubos rojos no llevan anticoagulante.",
      "Todas son ciertas."
    ],
    "correctAnswer": 3,
    "explanation": ""
  }
];

export default questions;
