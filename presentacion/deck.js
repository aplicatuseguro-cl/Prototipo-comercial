/* Aplica tu Seguro — presentación comercial v2.
   Una sola fuente para PPTX y PDF: coordenadas en pulgadas sobre 13.333 x 7.5. */

const NAVY='2C3E5D', DARK='16233A', BLUE='2F6FED', GREEN='16A34A', AMBER='B45309';
const INK='0F172A', INK2='3F4A5C', INK3='6B7686';
const LINE='E6E9EF', BG2='F7F8FA', WHITE='FFFFFF', ICE='C8D8F0', STEEL='8FA9D0';
const SW=13.333, SH=7.5, M=0.85, CW=SW-2*M;
const URL='https://claude.ai/artifact/NSb5DKAfVGnkGbQdXLfkYX';

const img   = (src,x,y,w,h)       => ({t:'image', src,x,y,w,h});
const rect  = (x,y,w,h,o={})      => ({t:'rect', x,y,w,h, r:0, ...o});
const rrect = (x,y,w,h,o={})      => ({t:'rect', x,y,w,h, r:o.r??0.14, ...o});
const ell   = (x,y,d,fill)        => ({t:'ellipse', x,y,w:d,h:d,fill});
const txt   = (text,x,y,w,h,o={}) => ({t:'text', text,x,y,w,h, size:13.5, color:INK2, ...o});

const eyebrow = (t,{x=M,y=0.78,color=INK3}={}) =>
  txt(t,x,y,7,0.26,{size:10.5,bold:true,cs:2.4,color});
const title = (t,{x=M,y=1.18,w=CW,size=29,color=INK}={}) =>
  txt(t,x,y,w,1.7,{size,bold:true,color,lh:1.08});
const numDot = (x,y,n,{fill=NAVY,color=WHITE,d=0.34}={}) =>
  [ell(x,y,d,fill), txt(n,x,y,d,d,{size:11.5,bold:true,color,align:'center',valign:'middle'})];
const nota = (t,{y=6.94,color=INK3,size=10.5,x=M,w=CW}={}) => txt(t,x,y,w,0.34,{size,color,lh:1.22});

/* ------------------------------------------------------- 1 · PORTADA */
const s1 = { els:[
  img('torres.png',0,0,SW,SH),
  rect(0,0,SW,SH,{fill:DARK, alpha:38}),
  img('logo-blanco.png',M,0.66,0.44,0.466),
  txt('APLICA TU SEGURO',M+0.62,0.75,4,0.3,{size:11.5,bold:true,cs:3,color:WHITE,valign:'middle'}),
  txt('Todas tus coberturas de salud.\nFinalmente trabajando juntas.',M,2.5,10.4,2.0,
      {size:40,bold:true,color:WHITE,lh:1.08}),
  txt('Una forma de ayudar a los colaboradores y sus familias a entender y aprovechar mejor los beneficios de salud que la empresa ya financia.',
      M,4.7,8.9,0.9,{size:16,color:ICE,lh:1.34}),
  txt('Presentación comercial · Propuesta en validación',M,6.42,7,0.3,{size:11.5,color:STEEL,valign:'middle'}),
], notes:'Presentar a María como caso ficticio desde el primer minuto. Todo lo que se verá son datos simulados.' };

/* ------------------------------------------------------- 2 · EL PROBLEMA */
const p2 = [
  ['No sabe cómo se coordinan sus coberturas','Cada póliza tiene sus propias condiciones y su propio proceso.'],
  ['No sabe cuánto podría pagar antes de atenderse','El monto a pagar aparece recién al momento de la atención.'],
  ['Puede dejar vencer beneficios o reembolsos','Topes anuales sin usar y solicitudes incompletas que caducan.'],
];
const s2 = { bg:WHITE, els:[
  img('atacama.png',8.35,0,SW-8.35,SH),
  eyebrow('EL PROBLEMA · CASO FICTICIO'),
  title('María y su familia tienen cuatro coberturas de salud activas.',{w:7.2,size:27}),
  txt('Cada una tiene condiciones, topes y procesos diferentes.',M,3.06,6.9,0.4,{size:15,color:INK,bold:true}),
  ...p2.flatMap(([h,d],i)=>{ const y=3.82+i*0.92; return [
    ...numDot(M,y,String(i+1)),
    txt(h,M+0.52,y-0.04,6.5,0.32,{size:14,bold:true,color:INK}),
    txt(d,M+0.52,y+0.3,6.5,0.44,{size:11.5,color:INK3,lh:1.24}),
  ];}),
  nota('María, su familia y sus pólizas son un caso ficticio construido para esta presentación. No representan datos ni estadísticas de ningún grupo de personas.',{w:7.1}),
], notes:'No presentar estos problemas como estadísticas nacionales: son el caso de María.' };

/* ------------------------------------------------------- 3 · FRAGMENTACIÓN */
const p3 = [
  ['Isapre o Fonasa','Condiciones y coberturas definidas por el sistema de salud de cada persona'],
  ['Seguro complementario','Deducible, topes y reembolsos definidos por la póliza colectiva'],
  ['Seguro dental','Tope anual y prestaciones definidos por la póliza'],
  ['Seguro de accidentes','Cobertura y condiciones definidas por la póliza'],
];
const CW3=2.70, G3=0.28;
const s3 = { bg:WHITE, els:[
  eyebrow('FRAGMENTACIÓN'),
  title('Las coberturas de una misma familia\nsuelen administrarse por separado.',{w:10.6,size:29}),
  txt('Cada cobertura puede tener condiciones, topes, documentos y vigencias diferentes. El desafío aparece cuando una familia debe entenderlas y coordinarlas para una atención concreta.',
      M,2.72,10.4,0.8,{size:14,lh:1.32}),
  ...p3.flatMap(([n,d],i)=>{ const x=M+i*(CW3+G3), y=3.7, h=1.9; return [
    rrect(x,y,CW3,h,{fill:BG2,line:LINE}),
    txt(n,x+0.26,y+0.3,CW3-0.52,0.56,{size:14,bold:true,color:INK,lh:1.16}),
    txt(d,x+0.26,y+0.94,CW3-0.52,0.78,{size:11,color:INK3,lh:1.26}),
  ];}),
  rrect(M,5.94,CW,0.86,{fill:'F2F5FA',line:'DEE6F2'}),
  txt('Las condiciones y el orden en que opera cada cobertura dependen de cada póliza en particular.',
      M+0.34,6.18,CW-0.68,0.4,{size:13.5,color:INK2}),
  nota('Ejemplo construido a partir del caso ficticio de María. No describe reglas aplicables a todas las pólizas.'),
], notes:'Evitar reglas universales: cada póliza define sus propias condiciones.' };

/* ------------------------------------------------------- 4 · LA SOLUCIÓN */
const VERBS=['ENTIENDE','COORDINA','COMPARA','ALERTA','GUÍA'];
let vx=M; const verbEls=[];
VERBS.forEach(v=>{ const w=0.108*v.length+0.5;
  verbEls.push(rrect(vx,5.28,w,0.42,{r:0.21,fill:WHITE,alpha:84,line:WHITE,lineAlpha:60}));
  verbEls.push(txt(v,vx,5.28,w,0.42,{size:10,bold:true,cs:1.4,color:WHITE,align:'center',valign:'middle'}));
  vx+=w+0.16; });
const CX=7.75, CY=1.2, CWD=4.72, CHG=5.1;
const OPTS=[['Centro A','$30.000',false],['Centro B','$25.000',true],['Centro C','$35.000',false]];
const s4 = { els:[
  img('altiplano.png',0,0,SW,SH),
  rect(0,0,SW,SH,{fill:DARK,alpha:20}),
  eyebrow('LA SOLUCIÓN',{color:STEEL}),
  title('Aplica tu Seguro\nno es otro seguro.',{w:6.5,size:31,color:WHITE}),
  txt('Es una propuesta de plataforma que ayuda a entender y coordinar las coberturas que una persona y su familia ya poseen.',
      M,3.5,6.1,0.9,{size:14.5,color:ICE,lh:1.34}),
  txt('No vende ni intermedia seguros, y no reemplaza a una Isapre, Fonasa, aseguradora, corredor ni prestador médico.',
      M,4.52,6.1,0.6,{size:11.5,color:STEEL,lh:1.28}),
  ...verbEls,
  rrect(CX,CY,CWD,CHG,{r:0.16,fill:WHITE,shadow:true}),
  txt('EJEMPLO ILUSTRATIVO',CX+0.42,CY+0.4,CWD-0.84,0.26,{size:10,bold:true,cs:2.2,color:AMBER}),
  txt('La hija de María necesita una resonancia de rodilla.',CX+0.42,CY+0.76,CWD-0.84,0.76,
      {size:17,bold:true,color:INK,lh:1.14}),
  txt('Con los datos preparados para este ejemplo, Aplica tu Seguro mostraría tres alternativas y cuánto pagaría María de su bolsillo en cada una.',
      CX+0.42,CY+1.62,CWD-0.84,0.86,{size:11.5,color:INK2,lh:1.3}),
  ...OPTS.flatMap(([n,v,best],i)=>{ const y=CY+2.6+i*0.56; return [
    rrect(CX+0.42,y,CWD-0.84,0.46,{r:0.1,fill:best?'EAF7EF':BG2,line:best?'BFE5CD':LINE}),
    txt(n,CX+0.64,y,1.8,0.46,{size:12,color:best?INK:INK2,bold:best,valign:'middle'}),
    txt(best?v+'  ·  menor gasto estimado':v,CX+0.64,y,CWD-1.3,0.46,
        {size:12,bold:true,color:best?GREEN:INK2,align:'right',valign:'middle'}),
  ];}),
  txt('Comparación exclusivamente económica · Precios y coberturas simulados',
      CX+0.42,CY+4.42,CWD-0.84,0.5,{size:10.5,color:INK3,lh:1.24}),
], notes:'El ejemplo es ilustrativo: no se consulta ningún plan real ni información de prestadores.' };

/* ------------------------------------------------------- 5 · VALOR ESPERADO */
const p5 = [
  ['Para el colaborador','Mayor claridad sobre sus coberturas, los gastos estimados y los próximos pasos.'],
  ['Para Recursos Humanos','Información agregada para evaluar adopción y utilización del beneficio.'],
  ['Para la empresa','Una oportunidad de aumentar el valor percibido de beneficios que ya financia.'],
];
const CW5=3.69, G5=0.28;
const s5 = { bg:WHITE, els:[
  eyebrow('VALOR ESPERADO'),
  title('Qué esperamos que aporte,\ny qué queremos validar.',{w:10.6,size:29}),
  txt('Lo siguiente son resultados esperados e hipótesis de trabajo, no resultados medidos.',
      M,2.72,10.4,0.4,{size:14,color:INK,bold:true}),
  ...p5.flatMap(([n,d],i)=>{ const x=M+i*(CW5+G5), y=3.3, h=1.62; return [
    rrect(x,y,CW5,h,{fill:BG2,line:LINE}),
    txt(n,x+0.3,y+0.3,CW5-0.6,0.3,{size:14.5,bold:true,color:NAVY}),
    txt(d,x+0.3,y+0.7,CW5-0.6,0.82,{size:11.5,color:INK2,lh:1.3}),
  ];}),
  rrect(M,5.28,CW,1.5,{r:0.16,fill:DARK}),
  txt('TRANSPARENCIA',M+0.42,5.5,CW-0.84,0.26,{size:10,bold:true,cs:2.2,color:STEEL}),
  txt([{text:'Aplica tu Seguro está en validación comercial. ',color:WHITE,bold:true},
       {text:'No existen integraciones, clientes, pilotos ejecutados, resultados reales ni acuerdos con terceros, y todos los datos de esta presentación son sintéticos.',color:ICE}],
      M+0.42,5.86,CW-0.84,0.76,{size:13.5,lh:1.3}),
], notes:'Mantener el lenguaje en condicional. Son hipótesis que el piloto permitiría validar.' };

/* ------------------------------------------------------- 6 · PRIVACIDAD */
const PN = ['Diagnósticos','Documentos médicos','Consultas individuales','Gastos individuales','Pólizas personales','Reembolsos individuales'];
const PS = ['Activación','Adopción','Utilización agregada','Indicadores económicos agregados','Información anonimizada o suprimida conforme al diseño definitivo'];
const REG = [['Persona','Sofía · 9 años'],['Prestación','Resonancia de rodilla'],['Pago estimado','$25.000']];
const REGX = [['Persona','No disponible'],['Prestación','No disponible'],['Pago estimado','Incluido en el total agregado']];
const s6 = { bg:WHITE, els:[
  eyebrow('PRIVACIDAD'),
  title('El diseño propuesto separa la experiencia individual\ndel dashboard corporativo.',{w:11.4,size:26}),
  // listas
  rrect(M,2.74,5.62,2.42,{fill:BG2,line:LINE}),
  txt('LA EMPRESA NO ACCEDE A',M+0.3,2.98,5.0,0.26,{size:10,bold:true,cs:2,color:AMBER}),
  ...PN.flatMap((t,i)=>[ell(M+0.32,3.43+i*0.29,0.09,AMBER),
       txt(t,M+0.54,3.34+i*0.29,4.8,0.28,{size:11.5,color:INK2})]),
  rrect(M+5.9,2.74,5.61,2.42,{fill:BG2,line:LINE}),
  txt('LA EMPRESA PODRÍA RECIBIR',M+6.2,2.98,5.0,0.26,{size:10,bold:true,cs:2,color:GREEN}),
  ...PS.flatMap((t,i)=>[ell(M+6.22,3.43+i*0.29,0.09,GREEN),
       txt(t,M+6.44,3.34+i*0.29,4.8,0.34,{size:11.5,color:INK2,lh:1.14})]),
  // el mismo registro, dos miradas
  txt('El mismo registro, dos miradas',M,5.36,5,0.3,{size:14.5,bold:true,color:INK}),
  txt('Atención completamente simulada',M+3.1,5.38,4,0.28,{size:11,color:INK3}),
  rrect(M,5.76,5.62,1.02,{fill:WHITE,line:LINE}),
  txt('COLABORADOR',M+0.26,5.9,2.4,0.24,{size:9.5,bold:true,cs:1.6,color:NAVY}),
  ...REG.flatMap(([k,v],i)=>[
    txt(k,M+0.26,6.18+i*0.2,1.6,0.2,{size:10,color:INK3}),
    txt(v,M+1.9,6.18+i*0.2,3.5,0.2,{size:10,color:INK,bold:true})]),
  rrect(M+5.9,5.76,5.61,1.02,{fill:WHITE,line:LINE}),
  txt('RECURSOS HUMANOS',M+6.16,5.9,2.6,0.24,{size:9.5,bold:true,cs:1.6,color:NAVY}),
  ...REGX.flatMap(([k,v],i)=>[
    txt(k,M+6.16,6.18+i*0.2,1.6,0.2,{size:10,color:INK3}),
    txt(v,M+7.8,6.18+i*0.2,3.5,0.2,{size:10,color:INK3})]),
  nota('Los umbrales y las medidas definitivas de anonimización deben validarse antes de un piloto. El ejemplo no representa una garantía legal o técnica.',{y:6.96}),
], notes:'Cambiar la vista en vivo si se presenta el prototipo. La separación es un principio obligatorio de la arquitectura propuesta.' };

/* ------------------------------------------------------- 7 · EL PROTOTIPO */
const RX=8.86, RW=3.62;
const s7 = { bg:WHITE, els:[
  eyebrow('EL PROTOTIPO'),
  title('Explora el prototipo comercial.',{w:10.6,size:29}),
  rrect(M-0.1,2.34,7.62,4.32,{fill:BG2,line:LINE,shadowSoft:true}),
  img('proto-comparador.png',M,2.44,7.42,4.12),
  txt('El prototipo permite recorrer la experiencia propuesta para María, su familia y Recursos Humanos. Utiliza datos 100% simulados y no está conectado a Isapres, aseguradoras ni prestadores.',
      RX,2.44,RW,1.5,{size:12.5,lh:1.34}),
  img('qr.png',RX,4.12,1.5,1.5),
  txt('Escanea o abre el enlace',RX+1.7,4.2,RW-1.7,0.3,{size:11,bold:true,color:INK}),
  txt('claude.ai/artifact/\nNSb5DKAfVGnkGbQdXLfkYX',RX+1.68,4.54,RW-1.64,0.7,
      {size:10,color:BLUE,lh:1.22,link:URL}),
  rrect(RX,5.82,RW,0.84,{fill:'F2F5FA',line:'DEE6F2'}),
  txt('Prototipo alojado temporalmente en un entorno de demostración.',
      RX+0.26,6.02,RW-0.52,0.5,{size:10.5,color:INK2,lh:1.24}),
  nota('Prototipo de validación comercial, no un producto en producción. Las personas, la empresa, las pólizas, los precios y los prestadores son ficticios.'),
], notes:'Confirmar que el enlace esté compartido antes de enviar la presentación por correo.' };

/* ------------------------------------------------------- 8 · EL PILOTO */
const P8 = ['90 días','Hasta 100 colaboradores','Acceso familiar incluido','Onboarding acompañado',
            'Medición de adopción','Medición de utilización','Dashboard corporativo agregado',
            'Criterios de éxito acordados con la empresa'];
const s8 = { bg:WHITE, els:[
  img('fiordos.png',8.35,0,SW-8.35,SH),
  eyebrow('EL PILOTO'),
  title('Piloto corporativo\nde 90 días.',{w:7.1,size:29}),
  ...P8.flatMap((t,i)=>{ const col=i%2, row=(i-col)/2;
    const x=M+col*3.55, y=3.06+row*0.56; return [
      ell(x+0.03,y+0.08,0.15,GREEN),
      txt(t,x+0.34,y,3.2,0.3,{size:12.5,color:INK,bold:true,lh:1.2}),
    ];}),
  rrect(M,5.42,7.1,1.14,{fill:BG2,line:LINE}),
  txt('Al cierre, la empresa revisa los indicadores agregados y los criterios de éxito acordados para decidir el siguiente paso.',
      M+0.3,5.62,6.5,0.78,{size:12.5,color:INK2,lh:1.3}),
  nota('El piloto busca validar problema, solución, adopción, operación y disposición a pagar. Sin precio en esta etapa.',{w:7.1}),
], notes:'La carta de intención no es parte del piloto: puede ser un paso comercial posterior.' };

/* ------------------------------------------------------- 9 · CIERRE */
const s9 = { els:[
  img('costa.png',0,0,SW,SH),
  rect(0,0,SW,SH,{fill:DARK,alpha:28}),
  img('logo-blanco.png',M,0.66,0.44,0.466),
  txt('APLICA TU SEGURO',M+0.62,0.75,4,0.3,{size:11.5,bold:true,cs:3,color:WHITE,valign:'middle'}),
  txt('¿Tendría sentido validar Aplica tu Seguro\ncon un grupo de sus colaboradores?',M,2.36,10.8,1.8,
      {size:32,bold:true,color:WHITE,lh:1.14}),
  txt('Conversemos sobre el alcance y los criterios de un piloto de 90 días.',M,4.32,8.5,0.4,
      {size:15,color:ICE}),
  rrect(M,4.96,5.5,1.62,{r:0.16,fill:WHITE,alpha:88,line:WHITE,lineAlpha:70}),
  txt('Diego Córdova E.',M+0.36,5.18,4.8,0.3,{size:15,bold:true,color:WHITE}),
  txt('Fundador · Aplica tu Seguro',M+0.36,5.5,4.8,0.28,{size:11.5,color:ICE}),
  txt('+569 8495 3941',M+0.36,5.86,2.6,0.28,{size:12,color:WHITE}),
  txt('hola@aplicatuseguro.cl',M+0.36,6.16,4.8,0.28,{size:12,color:WHITE,link:'mailto:hola@aplicatuseguro.cl'}),
  nota('Aplica tu Seguro está en validación comercial. Todos los datos de esta presentación son sintéticos y no corresponden a resultados de clientes.',
       {y:6.94,color:STEEL,size:10.5}),
], notes:'Hacer la pregunta y quedarse callado.' };

module.exports = { SLIDES:[s1,s2,s3,s4,s5,s6,s7,s8,s9], SW, SH };
