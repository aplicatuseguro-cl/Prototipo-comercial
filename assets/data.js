/* ==========================================================================
   Aplica tu Seguro — Prototipo de validación comercial
   DATOS 100% SIMULADOS. María, su familia, EMPRESA DEMO, las pólizas,
   coberturas, precios, prestadores y resultados son completamente ficticios.
   Este archivo concentra todo el contenido: puede editarse sin tocar la lógica.
   ========================================================================== */

const DEMO = {
  poliza: { desde: "1 ene 2026", hasta: "31 dic 2026" },

  empresa: {
    nombre: "EMPRESA DEMO",
    etiqueta: "Empresa ficticia",
    periodo: "Beneficios de salud · Período 2026",
    elegibles: 82,
    activadas: 51,
    activacion: 62,
    alcanzadas: 124,
    hogarPromedio: 2.4,
    umbralPrivacidad: 7
  },

  /* ---------------- Familia ---------------- */
  familia: [
    { id:"maria",  nombre:"María",  apellido:"González", rol:"Titular", edad:34, ini:"MG", av:"av-m",
      sistema:"Isapre", coberturas:["isapre","complementario","dental","accidentes"] },
    { id:"felipe", nombre:"Felipe", apellido:"Rojas",    rol:"Pareja",  edad:36, ini:"FR", av:"av-f",
      sistema:"Fonasa", coberturas:["complementario","dental","accidentes"] },
    { id:"sofia",  nombre:"Sofía",  apellido:"Rojas G.", rol:"Hija",    edad:9,  ini:"SR", av:"av-s",
      sistema:"Isapre", coberturas:["isapre","complementario","dental","accidentes"] },
    { id:"tomas",  nombre:"Tomás",  apellido:"Rojas G.", rol:"Hijo",    edad:5,  ini:"TR", av:"av-t",
      sistema:"Isapre", coberturas:["isapre","complementario","dental","accidentes"] }
  ],

  /* ---------------- Las cuatro coberturas del escenario ---------------- */
  coberturas: {
    isapre: {
      id:"isapre", nombre:"Isapre", corto:"Isapre", tipo:"Sistema de salud",
      origen:"Contratada por María", quien:"María, Sofía y Tomás", color:"#2C3E5D",
      resumen:"Primera capa de cobertura del escenario simulado. Bonifica una parte del valor de la atención antes de que opere el seguro complementario.",
      detalle:[
        ["Rol en el escenario","Bonifica primero"],
        ["Cubre a","María y sus dos hijos como cargas"],
        ["Condiciones","Definidas por el plan contratado"],
        ["Dato","Valores simulados para esta demostración"]
      ]
    },
    complementario: {
      id:"complementario", nombre:"Seguro complementario de salud", corto:"Complementario",
      tipo:"Seguro colectivo", origen:"Financiado por EMPRESA DEMO",
      quien:"María, Felipe, Sofía y Tomás", color:"#2F6FED",
      resumen:"Opera sobre el copago que queda después de la bonificación del sistema de salud, una vez cumplido el deducible anual.",
      detalle:[
        ["Deducible anual","$50.000 por beneficiario"],
        ["Rol en el escenario","Opera sobre el copago restante"],
        ["Cubre a","Todo el grupo familiar"],
        ["Vigencia simulada","1 ene 2026 – 31 dic 2026"]
      ]
    },
    dental: {
      id:"dental", nombre:"Seguro dental", corto:"Dental", tipo:"Seguro colectivo",
      origen:"Financiado por EMPRESA DEMO", quien:"María, Felipe, Sofía y Tomás", color:"#5E9BD6",
      resumen:"Cobertura dental con tope anual por beneficiario en el escenario simulado.",
      detalle:[
        ["Tope anual simulado","$250.000 por beneficiario"],
        ["Cubre a","Todo el grupo familiar"],
        ["Condiciones","Definidas por la póliza colectiva"],
        ["Vigencia simulada","1 ene 2026 – 31 dic 2026"]
      ]
    },
    accidentes: {
      id:"accidentes", nombre:"Seguro de accidentes", corto:"Accidentes", tipo:"Seguro colectivo",
      origen:"Financiado por EMPRESA DEMO", quien:"María, Felipe, Sofía y Tomás", color:"#93AFD6",
      resumen:"Cobertura para gastos médicos derivados de accidentes, con condiciones distintas a las del seguro complementario.",
      detalle:[
        ["Ámbito simulado","Gastos médicos por accidente"],
        ["Cubre a","Todo el grupo familiar"],
        ["Condiciones","Definidas por la póliza colectiva"],
        ["Vigencia simulada","1 ene 2026 – 31 dic 2026"]
      ]
    }
  },

  /* ---- Fuera del recorrido principal: no son pólizas adicionales de María ---- */
  otrosElementos: [
    { nombre:"Fonasa", quien:"Felipe", nota:"Es el sistema de salud al que está afiliado Felipe, no una quinta póliza de la familia. En este escenario cumple el mismo rol que la Isapre: bonifica antes de que opere el seguro complementario." },
    { nombre:"GES", quien:"Todo el grupo familiar", nota:"Garantías legales asociadas a un conjunto definido de problemas de salud. No es una póliza contratada ni se suma al conteo de coberturas." }
  ],

  /* ---------------- Uso de beneficios ---------------- */
  beneficios: [
    {
      id:"deducible", titulo:"Deducible anual", cobertura:"Seguro complementario de salud",
      tope:50000, usado:38000,
      nota:"El deducible es el monto que se debe acumular en copagos antes de que el seguro complementario comience a aportar.",
      cierre:"Completar el deducible no significa que las siguientes atenciones sean gratuitas: siguen existiendo copagos, topes, elegibilidad y condiciones de la póliza."
    },
    {
      id:"dental", titulo:"Tope dental", cobertura:"Seguro dental",
      tope:250000, usado:145000,
      nota:"Tope anual por beneficiario en el escenario simulado."
    },
    {
      id:"optica", titulo:"Beneficio óptica", cobertura:"Seguro complementario de salud",
      tope:80000, usado:0, alerta:true,
      nota:"Beneficio anual del escenario simulado. No se acumula al período siguiente.",
      alertaTexto:"En este escenario, la familia tiene $80.000 disponibles en óptica que vencen el 31 de diciembre."
    }
  ],

  /* ---------------- Asistente ---------------- */
  agente: {
    nombre:"Asistente de coberturas",
    intro:"¿Cómo te ayudo hoy? Pregúntame lo que necesites.",
    preguntas:[
      { id:"resonancia", hero:true,
        q:"Mi hija necesita una resonancia de rodilla. ¿Dónde me conviene hacerla y cuánto voy a pagar?",
        a:["Con los datos preparados para este ejemplo, estas serían <b>tres alternativas ilustrativas</b> considerando la cobertura de Sofía y el seguro complementario familiar.",
           "El monto destacado es <b>lo que pagarías de tu bolsillo</b> después de ambas coberturas."],
        comparador:true },
      { id:"deducible",
        q:"¿Cuánto me queda de deducible?",
        a:["En este escenario has acumulado <b>$38.000 de $50.000</b> de tu deducible anual en el seguro complementario.",
           "Te faltan <b>$12.000</b> en copagos. Completarlo no hace que las siguientes atenciones sean gratuitas: siguen aplicando copagos, topes y condiciones de la póliza."] },
      { id:"como",
        q:"¿Cómo se ordenan mis coberturas en una atención?",
        a:["En el escenario simulado de tu familia, la <b>Isapre</b> bonifica primero una parte del valor de la atención.",
           "El <b>seguro complementario</b> de EMPRESA DEMO opera después, sobre el copago que queda, una vez cumplido el deducible anual. El orden y las condiciones reales dependen de cada póliza."] },
      { id:"reembolsos",
        q:"¿Tengo reembolsos pendientes?",
        a:["En este escenario tienes <b>$42.500</b> pendientes de recuperar en una atención de febrero.",
           "La solicitud está incompleta: falta adjuntar la <b>orden médica</b>. Quedan <b>17 días</b> antes de que venza el plazo de presentación simulado."],
        cta:{ label:"Ir a Reembolsos", screen:"col-reembolsos" } },
      { id:"vencer",
        q:"¿Qué beneficios tengo por vencer?",
        a:["El <b>beneficio óptica</b> de tu seguro complementario: <b>$80.000</b> sin utilizar.",
           "En este escenario vence el <b>31 de diciembre</b> y no se acumula al período siguiente."],
        cta:{ label:"Ver mis beneficios", screen:"col-beneficios" } }
    ]
  },

  /* ---------------- Comparador ---------------- */
  comparador: {
    contexto:"Resonancia de rodilla · Sofía · Escenario simulado",
    intro:"Con los datos preparados para este ejemplo, estas serían tres alternativas ilustrativas considerando la cobertura de Sofía y el seguro complementario familiar.",
    opciones:[
      { id:"a", nombre:"Centro A", precio:180000, isapre:80000, comp:70000, pago:30000 },
      { id:"b", nombre:"Centro B", precio:145000, isapre:65000, comp:55000, pago:25000, best:true },
      { id:"c", nombre:"Centro C", precio:210000, isapre:100000, comp:75000, pago:35000 }
    ],
    destacado:"Menor gasto estimado: $25.000",
    aclaracion:"Comparación exclusivamente económica. No implica disponibilidad, calidad ni superioridad clínica de ningún prestador.",
    fuentes:[
      ["Precio referencial ficticio","Valor de lista construido para esta demostración. No proviene de una consulta a ningún prestador."],
      ["Aporte simulado de la Isapre de Sofía","Monto ilustrativo asignado al sistema de salud en este escenario. No proviene de una consulta a ninguna Isapre."],
      ["Aporte simulado del seguro complementario","Monto ilustrativo del seguro colectivo de EMPRESA DEMO. No proviene de una consulta a ninguna aseguradora."],
      ["Deducible pendiente ya considerado","El aporte del complementario que se muestra ya descuenta los $12.000 de deducible que quedan por cumplir."],
      ["Pago final estimado de María","Es la resta: precio referencial menos aporte de la Isapre menos aporte del complementario."]
    ],
    supuestos:"Supuestos ilustrativos: la atención es elegible en ambas coberturas, el escenario no considera topes alcanzados ni exclusiones, y todas las cifras fueron construidas para esta demostración. En un producto operativo, cada monto requiere confirmación del prestador y de cada aseguradora."
  },

  /* ---------------- Registro del gasto ---------------- */
  gasto: {
    titulo:"Registrar gasto",
    prestacion:"Resonancia de rodilla · Sofía",
    fecha:"20 sep 2026",
    okTitulo:"Completaste tu deducible anual",
    okTexto:"El deducible pasa de $38.000 a $50.000. Esto no significa que las siguientes atenciones sean gratuitas: siguen existiendo copagos, topes, elegibilidad y condiciones de la póliza.",
    yaRegistrado:"Este gasto ya fue registrado en la demostración. Usa «Reiniciar demo» para volver al estado inicial."
  },

  /* ---------------- Reembolsos ---------------- */
  reembolsos: {
    pendiente:{
      monto:42500, estado:"Documentación incompleta", plazo:17,
      prestacion:"Kinesiología · 4 sesiones", fecha:"27 feb 2026",
      docs:[
        { n:"Boleta de la atención", ok:true },
        { n:"Comprobante de bonificación", ok:true },
        { n:"Orden médica", ok:false },
        { n:"Datos bancarios del titular", ok:true }
      ],
      pasos:[
        "Solicitar una copia de la orden médica de la atención de febrero.",
        "Adjuntarla a la solicitud desde esta pantalla.",
        "Esperar la resolución del seguro complementario según los plazos de la póliza."
      ]
    },
    enProceso:{ monto:18300, prestacion:"Consulta de especialidad · Sofía", fecha:"3 sep 2026", estado:"En evaluación" },
    recuperado:{ monto:121900, cantidad:4, periodo:"En el período simulado" },
    nota:"En este escenario, la solicitud está incompleta por un documento faltante. Aplica tu Seguro propone detectar ese tipo de situaciones antes de que venza el plazo."
  },

  /* ---------------- Cierre familiar ---------------- */
  valorMaria:{
    headline:"Tus coberturas, finalmente trabajando juntas.",
    sabe:[
      ["Qué coberturas tiene","Las cuatro coberturas del grupo familiar, en un solo lugar."],
      ["Cuánto ha utilizado","Deducible, tope dental y beneficio óptica del período."],
      ["Cuánto podría pagar","Una estimación antes de decidir dónde atenderse."],
      ["Qué puede recuperar","Los reembolsos pendientes y qué falta para completarlos."],
      ["Qué está por vencer","Los beneficios que no se acumulan al período siguiente."],
      ["Qué hacer a continuación","El siguiente paso concreto en cada situación."]
    ],
    metrica:386400,
    metricaLabel:"Beneficios de salud gestionados · Simulación",
    metricaNota:"Acumulado ilustrativo de aportes aplicados a atenciones en este escenario. No representa ahorro ni resultados reales."
  },

  /* ---------------- Empresa ---------------- */
  adopcion:{
    curva:[ {s:"Sem 1",v:18},{s:"Sem 2",v:31},{s:"Sem 4",v:44},{s:"Sem 6",v:53},{s:"Sem 8",v:58},{s:"Sem 12",v:62} ],
    porCobertura:[
      { t:"Seguro complementario", pct:71, n:36 },
      { t:"Seguro dental", pct:45, n:23 },
      { t:"Beneficio óptica", pct:22, n:11 },
      { t:"Seguro de accidentes", pct:12, n:6 }
    ],
    porArea:[
      { t:"Área 1", pct:66, n:40 },
      { t:"Área 2", pct:61, n:23 },
      { t:"Área 3", pct:57, n:14 },
      { t:"Área 4", pct:0, n:5 }
    ]
  },

  valorEmpresa:{
    cifras:[
      { v:"$8,4 MM", k:"Beneficios de salud gestionados" },
      { v:"$2,1 MM", k:"Reembolsos potencialmente identificados en este escenario" },
      { v:"$1,18 MM", k:"Beneficios potencialmente aprovechables" }
    ],
    disclaimer:"Datos simulados para ilustrar el tipo de información agregada que podría entregar Aplica tu Seguro.",
    noSumar:"Las tres cifras representan conceptos diferentes y no deben sumarse entre sí.",
    hipotesis:[
      "Podría ayudar a aumentar la comprensión y utilización de los beneficios que la empresa ya financia.",
      "Podría entregar evidencia agregada para evaluar el beneficio.",
      "El alcance real de estos indicadores es parte de lo que un piloto permitiría validar."
    ]
  },

  privacidad:{
    principio:"La separación es un principio obligatorio de la arquitectura propuesta.",
    nunca:[
      "Diagnósticos",
      "Información clínica",
      "Documentos médicos",
      "Consultas individuales",
      "Búsquedas individuales",
      "Gastos individuales",
      "Pólizas personales",
      "Reembolsos individuales",
      "Información individual de cobertura"
    ],
    si:[
      "Activación",
      "Adopción",
      "Utilización agregada",
      "Indicadores agregados",
      "Valor económico agregado",
      "Información anonimizada o suprimida conforme al diseño definitivo"
    ],
    ejemplo:{
      titulo:"Una atención simulada de la familia de María, vista desde cada lado.",
      colaborador:[
        ["Persona","Sofía · 9 años"],
        ["Prestación","Resonancia de rodilla"],
        ["Prestador","Centro B"],
        ["Pago de María","$25.000"],
        ["Aporte del complementario","$55.000"]
      ],
      rrhh:[
        ["Persona","No disponible"],
        ["Prestación","No disponible"],
        ["Prestador","No disponible"],
        ["Pago de María","No disponible"],
        ["Aporte del complementario","Incluido en el total agregado del período"]
      ]
    },
    umbralEjemplo:"Ejemplo ilustrativo: los indicadores de grupos pequeños se ocultan para reducir el riesgo de identificación indirecta.",
    umbralCaveat:"El número definitivo y las demás medidas de protección requieren una evaluación específica de privacidad y riesgo de reidentificación. Este ejemplo no constituye una garantía de anonimización ni de cumplimiento legal."
  },

  piloto:{
    items:[
      "90 días",
      "Hasta 100 colaboradores",
      "Acceso familiar incluido",
      "Onboarding acompañado",
      "Medición de adopción",
      "Medición de utilización",
      "Dashboard corporativo agregado",
      "Criterios de éxito acordados con la empresa"
    ],
    cierre:"¿Tendría sentido validar Aplica tu Seguro con un grupo de sus colaboradores?"
  },

  estadoProducto:{
    hoy:{ titulo:"Hoy existe", items:[
      "El concepto de producto",
      "El diseño de la experiencia",
      "El prototipo comercial navegable",
      "La hipótesis de coordinación de coberturas",
      "Los principios propuestos de privacidad"
    ]},
    piloto:{ titulo:"El piloto permitiría validar", items:[
      "Onboarding",
      "Adopción",
      "Utilización",
      "Modelo operativo",
      "Fuentes de datos",
      "Valor percibido",
      "Disposición a pagar"
    ]},
    no:{ titulo:"Todavía no existen", items:[
      "Integraciones",
      "Procesamiento productivo de pólizas",
      "Datos reales de prestadores",
      "Automatización de reembolsos",
      "Clientes",
      "Pilotos ejecutados",
      "Resultados reales",
      "Certificaciones",
      "Acuerdos con terceros"
    ]}
  },

  /* ---------------- Notas del modo presentador ---------------- */
  guion:{
    "cover":{ t:"0:20", n:"Presentar el caso: vamos a seguir a María, una persona ficticia, por una situación concreta. Aclarar desde el inicio que todo lo que se verá son datos simulados.", o:"Si preguntan qué es: una propuesta de plataforma que coordina las coberturas que ya tienen, no un seguro nuevo." },
    "col-inicio":{ t:"0:45", n:"Cuatro coberturas activas del grupo familiar. Cambiar de integrante para mostrar que la cobertura no es igual para todos.", o:"«Esto ya lo sabe la gente» → proponer preguntarle al equipo cuánto le queda de deducible." },
    "col-coberturas":{ t:"0:45", n:"El detalle de cada cobertura y sus condiciones. Aquí también está el bloque de elementos que no son pólizas, para evitar confusiones.", o:"«¿Cómo saben qué tiene cada uno?» → hoy no existe integración: es parte de lo que el piloto permitiría validar." },
    "col-beneficios":{ t:"0:50", n:"El escenario muestra el deducible a medias y un beneficio de óptica sin usar. Preguntar qué pasa hoy en su empresa con este tipo de información.", o:"Recordar que las cifras son del escenario simulado, no una estadística." },
    "col-asistente":{ t:"1:40", n:"Momento central. Hacer la pregunta de la resonancia y dejar que la comparación cargue. Abrir la trazabilidad antes de que la pregunten.", o:"«¿De dónde salen esos precios?» → abrirlo primero: son cifras construidas para la demostración." },
    "col-reembolsos":{ t:"0:40", n:"En el escenario falta un documento y el plazo corre. La propuesta es detectar ese tipo de situaciones a tiempo.", o:"«Eso lo ve el corredor» → el corredor intermedia la póliza; esta propuesta apunta al uso cotidiano." },
    "col-anio":{ t:"0:30", n:"Cierre del lado familiar: lo que María ahora sabe. La cifra es una métrica secundaria y está rotulada como simulación.", o:"No presentarla como ahorro. Es un acumulado ilustrativo." },
    "cor-resumen":{ t:"0:45", n:"Primero las personas, después la capa económica. Las tres cifras son conceptos distintos y no se suman.", o:"«62% es bajo» → es un escenario, no un resultado. El umbral se define en conjunto." },
    "cor-adopcion":{ t:"opcional", n:"Pantalla secundaria. Útil si preguntan cómo se vería el seguimiento en el tiempo.", o:"Mostrar el grupo oculto por tamaño de muestra como ejemplo del principio de privacidad." },
    "cor-valor":{ t:"opcional", n:"Pantalla secundaria con el esquema de la propuesta. Útil si el interlocutor quiere el marco completo.", o:"Mantener el lenguaje en condicional: son hipótesis a validar." },
    "cor-privacidad":{ t:"0:45", n:"Usar el interruptor Colaborador / Recursos Humanos sobre el mismo registro simulado. No leer la lista: cambiarla en vivo.", o:"Si aparece legal o DPO: el umbral y las medidas definitivas requieren una evaluación específica antes de un piloto." },
    "cor-piloto":{ t:"0:40", n:"Sin precio y sin formulario. Terminar con la pregunta de cierre en pantalla y quedarse callado.", o:"Si hay interés real, la LOI es un paso posterior, no un componente del piloto." },
    "estado":{ t:"—", n:"Pantalla de transparencia. Abrirla si dudan de la madurez de la propuesta: decir con precisión qué no existe todavía aumenta la credibilidad.", o:"Sirve también para invitarlos a co-diseñar el piloto." }
  }
};
