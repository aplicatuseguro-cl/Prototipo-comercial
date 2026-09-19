/* ==========================================================================
   Aplica tu Seguro — Prototipo de validación comercial
   DATOS 100% SIMULADOS. Ninguna cifra, persona, empresa o prestador es real.
   Este archivo concentra todo el contenido del demo: puede editarse sin tocar
   la lógica de la aplicación.
   ========================================================================== */

const UF = 39850; // Valor UF referencial simulado para el demo

const DEMO = {
  uf: UF,
  ufLabel: "1 UF = $39.850 · valor referencial simulado",
  poliza: { desde: "1 oct 2025", hasta: "30 sep 2026", diasRestantes: 11 },

  empresa: {
    nombre: "Andes Logística SpA",
    etiqueta: "Empresa ficticia",
    periodo: "Beneficios de salud · Período 2025–2026",
    elegibles: 82,
    activadas: 51,
    activacion: 62,
    alcanzadas: 124,
    hogarPromedio: 2.4,
    consultas: 312,
    umbralPrivacidad: 7
  },

  /* ---------------- Familia ---------------- */
  familia: [
    { id:"maria",  nombre:"María",  apellido:"González", rol:"Titular",  edad:34, ini:"MG", av:"av-m",
      sistema:"Isapre", sistemaDet:"Plan individual con cargas", coberturas:["isapre","complementario","dental","accidentes","ges","caec"] },
    { id:"felipe", nombre:"Felipe", apellido:"Rojas",    rol:"Pareja",   edad:36, ini:"FR", av:"av-f",
      sistema:"Fonasa", sistemaDet:"Tramo C", coberturas:["fonasa","complementario","dental","accidentes","ges"] },
    { id:"sofia",  nombre:"Sofía",  apellido:"Rojas G.", rol:"Hija",     edad:9,  ini:"SR", av:"av-s",
      sistema:"Isapre", sistemaDet:"Carga de María", coberturas:["isapre","complementario","dental","accidentes","ges","caec"] },
    { id:"tomas",  nombre:"Tomás",  apellido:"Rojas G.", rol:"Hijo",     edad:5,  ini:"TR", av:"av-t",
      sistema:"Isapre", sistemaDet:"Carga de María", coberturas:["isapre","complementario","dental","accidentes","ges","caec"] }
  ],

  /* ---------------- Coberturas ---------------- */
  coberturas: {
    isapre: {
      id:"isapre", nombre:"Isapre", corto:"Isapre", tipo:"Sistema de salud", origen:"Contratada por María",
      quien:"María, Sofía y Tomás", color:"#2C3E5D",
      resumen:"Plan individual con dos cargas. Primera capa de cobertura para atenciones ambulatorias y hospitalarias.",
      detalle:[
        ["Cobertura ambulatoria","70% del arancel del plan (referencial)"],
        ["Cobertura hospitalaria","90% en prestador preferente (referencial)"],
        ["Cargas incluidas","Sofía y Tomás"],
        ["Tope anual","Según arancel y topes del plan"]
      ]
    },
    fonasa: {
      id:"fonasa", nombre:"Fonasa", corto:"Fonasa", tipo:"Sistema de salud", origen:"Afiliación de Felipe",
      quien:"Felipe", color:"#4A6A96",
      resumen:"Tramo C. Cubre atenciones en modalidad institucional y de libre elección con copago según nivel del prestador.",
      detalle:[
        ["Tramo","C"],
        ["Modalidad","Institucional y libre elección"],
        ["Copago libre elección","Según nivel inscrito del prestador"],
        ["Se coordina con","Seguro complementario de la empresa"]
      ]
    },
    complementario: {
      id:"complementario", nombre:"Seguro complementario de salud", corto:"Complementario", tipo:"Seguro colectivo",
      origen:"Financiado por Andes Logística SpA", quien:"Toda la familia", color:"#2F6FED",
      resumen:"Opera como segunda capa sobre Isapre o Fonasa. Reembolsa parte del copago una vez cumplido el deducible anual.",
      detalle:[
        ["Deducible anual","3 UF por beneficiario"],
        ["Reembolso ambulatorio","80% del copago (referencial)"],
        ["Tope anual","200 UF por beneficiario"],
        ["Beneficio óptica","2,5 UF por período"],
        ["Vigencia de la póliza","1 oct 2025 – 30 sep 2026"]
      ]
    },
    dental: {
      id:"dental", nombre:"Seguro dental", corto:"Dental", tipo:"Seguro colectivo",
      origen:"Financiado por Andes Logística SpA", quien:"Toda la familia", color:"#5E9BD6",
      resumen:"Convenio dental con tope anual por beneficiario. No requiere cumplir deducible.",
      detalle:[
        ["Tope anual","12 UF por beneficiario"],
        ["Deducible","No aplica"],
        ["Prestaciones","Preventivas, restauradoras y urgencias"],
        ["Vigencia de la póliza","1 oct 2025 – 30 sep 2026"]
      ]
    },
    accidentes: {
      id:"accidentes", nombre:"Seguro de accidentes personales", corto:"Accidentes", tipo:"Seguro colectivo",
      origen:"Financiado por Andes Logística SpA", quien:"Toda la familia", color:"#93AFD6",
      resumen:"Cubre gastos médicos derivados de accidentes, con una cobertura distinta a la del seguro complementario.",
      detalle:[
        ["Cobertura por evento","Hasta 100 UF"],
        ["Ámbito","Accidentes dentro y fuera del trabajo"],
        ["Se activa","Antes que el complementario en caso de accidente"],
        ["Vigencia de la póliza","1 oct 2025 – 30 sep 2026"]
      ]
    },
    ges:  { id:"ges",  nombre:"GES",  corto:"GES",  tipo:"Garantía legal", sistema:true, quien:"Toda la familia",
      resumen:"Garantías explícitas en salud para un conjunto definido de problemas de salud priorizados." },
    caec: { id:"caec", nombre:"CAEC", corto:"CAEC", tipo:"Beneficio Isapre", sistema:true, quien:"María, Sofía y Tomás",
      resumen:"Cobertura adicional para enfermedades catastróficas dentro de la red cerrada de la Isapre." }
  },

  /* ---------------- Uso de beneficios ---------------- */
  beneficios: [
    {
      id:"deducible", titulo:"Deducible anual", cobertura:"Seguro complementario de salud",
      tipo:"deducible", topeUF:3, usadoUF:2.375,
      nota:"El deducible es el monto que debes acumular en copagos antes de que el seguro complementario comience a reembolsar.",
      cta:"Cuando lo completes, el complementario reembolsa el 80% de tus copagos elegibles hasta el tope anual."
    },
    {
      id:"dental", titulo:"Tope dental", cobertura:"Seguro dental",
      tipo:"tope", topeUF:12, usadoUF:7,
      nota:"Tope anual por beneficiario. Se reinicia con la vigencia de la póliza."
    },
    {
      id:"optica", titulo:"Beneficio óptica", cobertura:"Seguro complementario de salud",
      tipo:"tope", topeUF:2.5, usadoUF:0, alerta:true,
      nota:"Lentes ópticos y de contacto con receta vigente. No se acumula al período siguiente.",
      alertaTexto:"Tu familia tiene 2,5 UF disponibles en óptica que se pierden al cerrar la vigencia de la póliza."
    }
  ],

  /* ---------------- Asistente ---------------- */
  agente: {
    nombre:"Asistente de coberturas",
    intro:"Conozco las coberturas de tu familia y cómo se combinan. Pregúntame lo que necesites.",
    preguntas:[
      { id:"resonancia", hero:true,
        q:"Mi hija necesita una resonancia de rodilla. ¿Dónde me conviene hacerla y cuánto voy a pagar?",
        a:["Revisé la cobertura de <b>Sofía</b> en tu Isapre y el <b>seguro complementario familiar</b> que financia tu empresa.",
           "Encontré tres alternativas con orden médica vigente. El monto que aparece es <b>lo que pagarías de tu bolsillo</b> después de ambas coberturas."],
        comparador:true },
      { id:"deducible",
        q:"¿Cuánto me queda de deducible?",
        a:["Has acumulado <b>2,38 UF de 3 UF</b> de tu deducible anual en el seguro complementario. Eso equivale a $94.644 de $119.550.",
           "Te faltan <b>0,63 UF ($24.906)</b> en copagos. Una vez completado, el seguro comienza a reembolsar el 80% de tus copagos elegibles."] },
      { id:"cubre",
        q:"¿Mi seguro cubre una resonancia?",
        a:["Sí. Una resonancia ambulatoria con <b>orden médica vigente</b> es una prestación elegible en tu plan de Isapre y en el seguro complementario de tu empresa.",
           "La Isapre bonifica primero según el arancel de tu plan. El complementario opera sobre el copago que queda, una vez cumplido el deducible anual."] },
      { id:"reembolsos",
        q:"¿Tengo reembolsos pendientes?",
        a:["Sí. Tienes <b>$42.500</b> pendientes de recuperar en una atención de febrero.",
           "La solicitud está incompleta: falta adjuntar la <b>orden médica</b>. Quedan <b>17 días</b> antes de que venza el plazo de presentación."],
        cta:{ label:"Ir a Reembolsos", screen:"col-reembolsos" } },
      { id:"vencer",
        q:"¿Qué beneficios tengo por vencer?",
        a:["El <b>beneficio óptica</b> de tu seguro complementario: 2,5 UF ($99.625) sin utilizar.",
           "La vigencia de la póliza cierra el <b>30 de septiembre</b>. Quedan <b>11 días</b> y este beneficio no se acumula al período siguiente."],
        cta:{ label:"Ver mis beneficios", screen:"col-beneficios" } },
      { id:"felipe",
        q:"Si Felipe va a urgencias, ¿queda cubierto?",
        a:["Sí, aunque su ruta es distinta a la tuya: Felipe está en <b>Fonasa tramo C</b>, no en la Isapre.",
           "Si es por accidente, se activa primero el <b>seguro de accidentes</b> de la empresa. Si no lo es, Fonasa bonifica y luego opera el <b>seguro complementario</b>, que cubre a todo el grupo familiar."] }
    ]
  },

  /* ---------------- Comparador ---------------- */
  comparador: {
    contexto:"Resonancia magnética de rodilla · Sofía, 9 años · Orden médica vigente",
    opciones:[
      { id:"a", nombre:"Centro Diagnóstico Aurora", precio:180000, isapre:80000, comp:70000, pago:30000,
        dist:"4,2 km", agenda:"Mañana 09:40", convenio:"Convenio preferente Isapre" },
      { id:"b", nombre:"Clínica Los Robles", precio:145000, isapre:65000, comp:55000, pago:25000, best:true,
        dist:"7,8 km", agenda:"En 3 días", convenio:"Convenio preferente + red del complementario" },
      { id:"c", nombre:"Centro Imagenología Parque", precio:210000, isapre:100000, comp:75000, pago:35000,
        dist:"2,1 km", agenda:"Hoy 18:20", convenio:"Sin convenio preferente" }
    ],
    fuentes:[
      ["Plan de Isapre de Sofía","Carga del plan individual de María. Bonificación ambulatoria referencial del 70% sobre el arancel del plan."],
      ["Seguro complementario de salud","Póliza colectiva de Andes Logística SpA. Reembolso ambulatorio del 80% del copago, sujeto a deducible anual de 3 UF."],
      ["Condiciones de cobertura","Prestación elegible con orden médica vigente. No aplica preexistencia declarada. Vigencia de la póliza al 30 sep 2026."],
      ["Precio referencial del prestador","Valor de lista simulado para el demo. En un producto operativo este dato requiere convenio o fuente verificable."]
    ],
    supuesto:"Los copagos de esta atención se acumulan a tu deducible anual del seguro complementario."
  },

  /* ---------------- Gasto ---------------- */
  gasto: {
    titulo:"Confirmar gasto detectado",
    sub:"Detectamos una atención asociada a tu cobertura. Revisa y confirma.",
    prestador:"Clínica Los Robles",
    prestacion:"Resonancia magnética de rodilla · Sofía",
    fecha:"19 sep 2026",
    precio:145000, isapre:65000, comp:55000, pago:25000,
    okTitulo:"Completaste tu deducible anual",
    okTexto:"Desde ahora, el seguro complementario reembolsa el 80% de tus copagos elegibles hasta el tope anual de 200 UF."
  },

  /* ---------------- Reembolsos ---------------- */
  reembolsos: {
    pendiente:{
      monto:42500, estado:"Documentación incompleta", plazo:17,
      prestador:"Centro Médico Bellavista", prestacion:"Kinesiología · 4 sesiones", fecha:"27 feb 2026",
      docs:[
        { n:"Boleta del prestador", ok:true },
        { n:"Bono o comprobante de bonificación", ok:true },
        { n:"Orden médica", ok:false },
        { n:"Datos bancarios del titular", ok:true }
      ],
      pasos:[
        "Solicita a tu médico una copia de la orden médica de kinesiología de febrero.",
        "Adjúntala a la solicitud desde esta pantalla.",
        "El seguro complementario tiene 10 días hábiles para resolver una vez completa la documentación."
      ]
    },
    enProceso:{ monto:18300, prestacion:"Consulta traumatología · Sofía", fecha:"3 sep 2026", estado:"En evaluación" },
    recuperado:{ monto:121900, cantidad:4, periodo:"En el período de póliza actual" }
  },

  /* ---------------- Valor para María ---------------- */
  valorMaria:{
    principal:386400,
    principalLabel:"en beneficios de salud utilizados por tu familia",
    desglose:[["Seguro dental",278950],["Seguro complementario reembolsado",107450]],
    secundario:127500,
    secundarioLabel:"menor gasto de bolsillo estimado al coordinar coberturas",
    metricas:[
      ["7","atenciones con cobertura coordinada"],
      ["4","reembolsos gestionados"],
      ["2","beneficios detectados antes de vencer"]
    ]
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
      { t:"Operaciones", pct:66, n:40 },
      { t:"Administración", pct:61, n:23 },
      { t:"Comercial", pct:57, n:14 },
      { t:"Gerencia", pct:0, n:5 }
    ],
    consultas:[
      { t:"¿Qué cubre mi plan?", pct:24 },
      { t:"Estado de mi reembolso", pct:19 },
      { t:"¿Cuánto voy a pagar?", pct:17 },
      { t:"Topes disponibles", pct:12 },
      { t:"Otras consultas", pct:28 }
    ]
  },

  valorEmpresa:[
    { v:"$8,4 MM", k:"Beneficios de salud gestionados a través de la plataforma", n:"Suma de bonificaciones y reembolsos de coberturas ya contratadas" },
    { v:"$2,1 MM", k:"Reembolsos identificados y gestionados", n:"Montos que los colaboradores recuperaron de sus pólizas" },
    { v:"$1,18 MM", k:"Beneficios detectados antes de vencer", n:"Topes disponibles sin utilizar al cierre de la vigencia" }
  ],

  privacidad:{
    nunca:[
      "Diagnósticos y antecedentes clínicos",
      "Documentos médicos y órdenes",
      "Consultas al asistente",
      "Búsquedas de prestadores",
      "Gastos individuales",
      "Pólizas personales y su detalle",
      "Reembolsos individuales",
      "Información de cobertura por persona"
    ],
    si:[
      "Tasa de activación de cuentas",
      "Evolución de adopción en el tiempo",
      "Utilización agregada por tipo de cobertura",
      "Indicadores agregados de valor económico",
      "Consultas agrupadas por tema, sin texto original",
      "Reportes anonimizados del período"
    ],
    ejemplo:{
      colaborador:[
        ["Persona","Sofía Rojas G. · 9 años"],
        ["Prestación","Resonancia magnética de rodilla"],
        ["Prestador","Clínica Los Robles"],
        ["Copago","$25.000"],
        ["Reembolso","$55.000 · seguro complementario"]
      ],
      rrhh:[
        ["Persona","No disponible"],
        ["Prestación","No disponible"],
        ["Prestador","No disponible"],
        ["Copago","No disponible"],
        ["Reembolso","Incluido en el total agregado del período"]
      ]
    },
    umbral:"Ningún indicador se muestra cuando el grupo tiene menos de 7 personas. En esos casos el dato queda oculto, incluso para la gerencia."
  },

  piloto:{
    items:[
      ["90 días","Duración de la hipótesis inicial de piloto"],
      ["Hasta 100 colaboradores","Grupo acotado, definido junto a Recursos Humanos"],
      ["Acceso familiar incluido","El grupo familiar del colaborador entra al piloto"],
      ["Onboarding acompañado","Activación guiada y comunicación interna preparada"],
      ["Medición de adopción","Activación, uso y consultas resueltas"],
      ["Medición de valor generado","Beneficios utilizados y reembolsos gestionados"],
      ["Dashboard corporativo agregado","Reporte sin información individual"]
    ],
    nota:"El alcance, los indicadores de éxito y las condiciones se definen en conjunto antes de comenzar."
  },

  estadoProducto:{
    ahora:["Diseño de producto y experiencia completa","Modelo de coordinación entre coberturas","Reglas de privacidad y agregación de datos","Estructura del reporte corporativo","Guion de onboarding para colaboradores"],
    construccion:["Carga y normalización de pólizas","Motor de estimación de copagos","Flujo asistido de reembolsos","Panel corporativo con datos de piloto"],
    no:["Integraciones con Isapres, Fonasa o aseguradoras","Datos reales de precios de prestadores","Aplicación móvil","Clientes, pilotos o métricas reales","Certificaciones o acuerdos con terceros"]
  },

  /* ---------------- Modo presentador ---------------- */
  guion:{
    "cover":{ t:"0:20", n:"Abre con el problema, no con el producto. <b>“Sus colaboradores tienen más cobertura de la que creen y la usan menos de lo que podrían.”</b> Entra como María sin explicar la plataforma todavía.", o:"Si preguntan qué es: “una capa que coordina las coberturas que ya pagan, no un seguro nuevo”." },
    "col-inicio":{ t:"0:45", n:"Cambia de miembro familiar en vivo. Muestra que <b>Felipe está en Fonasa</b> y aun así queda cubierto por el seguro de la empresa. Pregunta: <b>“¿cuántos de sus colaboradores están en Fonasa?”</b>", o:"“Esto ya lo sabe la gente” → pide que le pregunten a su equipo cuál es su deducible." },
    "col-coberturas":{ t:"opcional", n:"Pantalla de manejo de objeción. Úsala solo si preguntan <b>“¿y cómo saben qué cobertura tiene cada uno?”</b>", o:"Hoy: carga declarada por el colaborador + condiciones de la póliza colectiva." },
    "col-beneficios":{ t:"0:45", n:"Aterriza el dolor económico: <b>$99.625 en óptica que se pierden en 11 días</b>. Pregunta: <b>“¿cuánto cree que se pierde así en su empresa cada año?”</b>", o:"Aquí nace el interés de RR.HH.: es plata ya pagada por la empresa." },
    "col-asistente":{ t:"1:30", n:"El momento central. Usa la pregunta destacada de la resonancia. Deja que la respuesta cargue sin hablar encima. Luego abre <b>“¿Cómo llegamos a esta estimación?”</b> antes de que te lo pregunten.", o:"“¿De dónde salen esos precios?” → ábrelo tú primero. Es una estimación, y lo decimos." },
    "col-reembolsos":{ t:"0:35", n:"Cierra el acto del colaborador: <b>$42.500 a punto de perderse por una orden médica</b>. No solo explicamos: ayudamos a ejecutar.", o:"“Eso lo ve el corredor” → el corredor intermedia la póliza; esto opera el día a día." },
    "col-anio":{ t:"0:25", n:"Transición. <b>“Esto es una persona. Ahora multiplíquelo por 82 y sus familias.”</b> Pasa a la experiencia Empresa.", o:"Recalca que la cifra es <b>utilizado</b>, no ahorrado. No sobrevendas." },
    "cor-resumen":{ t:"0:35", n:"Cambia el tono: ahora hablas su idioma. <b>62% de activación</b> es la hipótesis del piloto, no una promesa.", o:"“62% es bajo” → es el umbral que definiríamos juntos antes de partir." },
    "cor-adopcion":{ t:"0:30", n:"Muestra el dato oculto por tamaño de muestra (Gerencia, n&lt;7). <b>Es la mejor prueba de privacidad del demo</b> y aparece antes de que la mencionen.", o:"Este es el momento de mayor credibilidad técnica de toda la demo." },
    "cor-valor":{ t:"0:35", n:"“Su empresa ya invierte en salud. Nosotros hacemos que se note.” Recorre el diagrama de izquierda a derecha, una sola vez.", o:"Aclara: son datos simulados de un piloto hipotético, no resultados nuestros." },
    "cor-privacidad":{ t:"0:35", n:"Usa el interruptor <b>Colaborador / RR.HH.</b> sobre el mismo registro. No leas la lista: cámbiala en vivo.", o:"Si aparece legal o DPO, ofrece revisar el modelo de datos en la siguiente reunión." },
    "cor-piloto":{ t:"0:30", n:"No des precio. Cierra con: <b>“¿Tendría sentido probar algo así con un grupo de sus colaboradores?”</b> y quédate callado.", o:"Pide: N° de colaboradores, aseguradora actual y mes de renovación de la póliza." },
    "estado":{ t:"—", n:"Pantalla de transparencia. Ábrela si dudan de la madurez del producto: decir con precisión qué no existe todavía <b>aumenta</b> la credibilidad.", o:"Úsala también para invitarlos a co-diseñar el piloto." }
  }
};
