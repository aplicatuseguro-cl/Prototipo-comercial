/* Aplica tu Seguro — presentación comercial v2.
   Una sola fuente para PPTX y PDF: coordenadas en pulgadas sobre 10 x 13.333 (vertical 3:4).

   Las fotografías ocupan la lámina completa bajo un velo navy casi opaco (`fondo()`):
   quedan como textura y el texto blanco manda. La única excepción es la portada, donde
   la foto va en una franja horizontal. Los recortes se preparan con `prep-fotos.py`. */

const NAVY='2C3E5D', DARK='16233A', BLUE='2F6FED', GREEN='16A34A', AMBER='B45309';
const INK='0F172A', INK2='3F4A5C', INK3='6B7686';
const LINE='E6E9EF', BG2='F7F8FA', WHITE='FFFFFF', ICE='C8D8F0', STEEL='8FA9D0';
/* Tintes claros de verde y ámbar, para los rótulos sobre fondo oscuro. */
const GREEN_L='4FD07E', AMBER_L='E8A25C';

/* Tracking del prototipo (assets/styles.css), en em: los titulares van cerrados
   y las versalitas abiertas. `tr()` lo pasa a los puntos que espera PowerPoint. */
const TR_DISPLAY=-0.034, TR_TITULO=-0.028, TR_SUBT=-0.024, TR_H3=-0.016;
const TR_MARCA=0.16, TR_ROTULO=0.1, TR_PILL=0.06;
const tr = (em,size) => +(em*size).toFixed(2);
const SW=10, SH=13.333, M=0.85, CW=SW-2*M;
const URL='https://claude.ai/artifact/NSb5DKAfVGnkGbQdXLfkYX';

const img   = (src,x,y,w,h)       => ({t:'image', src,x,y,w,h});
const rect  = (x,y,w,h,o={})      => ({t:'rect', x,y,w,h, r:0, ...o});
const rrect = (x,y,w,h,o={})      => ({t:'rect', x,y,w,h, r:o.r??0.14, ...o});
const ell   = (x,y,d,fill)        => ({t:'ellipse', x,y,w:d,h:d,fill});
const txt   = (text,x,y,w,h,o={}) => ({t:'text', text,x,y,w,h, size:13.5, color:INK2, ...o});

const eyebrow = (t,{x=M,y=0.92,color=INK3}={}) =>
  txt(t,x,y,CW,0.26,{size:10.5,bold:true,cs:tr(TR_ROTULO,10.5),color});
const title = (t,{x=M,y=1.36,w=CW,size=27,color=INK}={}) =>
  txt(t,x,y,w,2.0,{size,bold:true,color,lh:1.1,cs:tr(TR_TITULO,size)});
/* Versalita de sección: el `.eyebrow` del prototipo a otro cuerpo. */
const rotulo = (t,x,y,w,size,color) =>
  txt(t,x,y,w,0.26,{size,bold:true,cs:tr(TR_ROTULO,size),color});
const numDot = (x,y,n,{fill=NAVY,color=WHITE,d=0.34}={}) =>
  [ell(x,y,d,fill), txt(n,x,y,d,d,{size:11.5,bold:true,color,align:'center',valign:'middle'})];
const nota = (t,{y=12.48,color=INK3,size=10.5,x=M,w=CW}={}) => txt(t,x,y,w,0.5,{size,color,lh:1.24});
const regla = (y,{x=M,w=1.3,fill=BLUE}={}) => rect(x,y,w,0.05,{fill});

/* Fotografía con su velo encima. `veil` es el color del velo y `alpha` su
   transparencia: a mayor alpha, más se ve la fotografía. */
const franja = (src,y,h,{veil=WHITE,alpha=80}={}) =>
  [img(src,0,y,SW,h), rect(0,y,SW,h,{fill:veil,alpha})];

/* Tratamiento estándar de las fotografías: lámina completa bajo un velo navy
   casi opaco. La imagen queda como textura y el texto blanco manda. */
const fondo = src => franja(src,0,SH,{veil:DARK,alpha:17});

/* ------------------------------------------------------- 1 · PORTADA */
const s1 = { bg:DARK, els:[
  img('logo-blanco.png',M,1.02,0.44,0.466),
  txt('APLICA TU SEGURO',M+0.62,1.11,5,0.3,{size:11.5,bold:true,cs:tr(TR_MARCA,11.5),color:WHITE,valign:'middle'}),
  ...franja('santiago.jpg',2.35,4.80,{veil:DARK,alpha:64}),
  txt('Todas tus coberturas de salud.\nFinalmente trabajando juntas.',M,8.25,CW,2.2,
      {size:32,bold:true,color:WHITE,lh:1.06,cs:tr(TR_DISPLAY,32)}),
  regla(9.8),
  txt('Una forma de ayudar a los colaboradores y sus familias a entender y aprovechar mejor los beneficios de salud que la empresa ya financia.',
      M,10.25,7.9,1.3,{size:14.5,color:ICE,lh:1.42}),
  txt('Presentación comercial · Propuesta en validación',M,12.3,7,0.3,{size:11.5,color:STEEL,valign:'middle'}),
], notes:'Presentar a María como caso ficticio desde el primer minuto. Todo lo que se verá son datos simulados.' };

/* ------------------------------------------------------- 2 · EL PROBLEMA */
const p2 = [
  ['No sabe cómo se coordinan sus coberturas','Cada póliza tiene sus propias condiciones y su propio proceso.'],
  ['No sabe cuánto podría pagar antes de atenderse','El monto a pagar aparece recién al momento de la atención.'],
  ['Puede dejar vencer beneficios o reembolsos','Topes anuales sin usar y solicitudes incompletas que caducan.'],
];
const s2 = { bg:DARK, els:[
  ...fondo('atacama-fondo.jpg'),
  eyebrow('EL PROBLEMA · CASO FICTICIO',{color:STEEL}),
  title('María y su familia tienen cuatro\ncoberturas de salud activas.',{size:26,color:WHITE}),
  txt('Cada una tiene condiciones, topes y procesos diferentes.',M,5.15,CW,0.4,{size:15.5,color:WHITE,bold:true,cs:tr(TR_H3,15.5)}),
  ...p2.flatMap(([h,d],i)=>{ const y=6.2+i*1.62; return [
    ...numDot(M,y,String(i+1),{fill:BLUE}),
    txt(h,M+0.56,y-0.03,7.2,0.34,{size:14.5,bold:true,color:WHITE,cs:tr(TR_H3,14.5)}),
    txt(d,M+0.56,y+0.38,7.2,0.5,{size:12,color:ICE,lh:1.26}),
  ];}),
  nota('María, su familia y sus pólizas son un caso ficticio construido para esta presentación. No representan datos ni estadísticas de ningún grupo de personas.',{color:STEEL}),
], notes:'No presentar estos problemas como estadísticas nacionales: son el caso de María.' };

/* ------------------------------------------------------- 3 · FRAGMENTACIÓN */
const p3 = [
  ['Isapre o Fonasa','Condiciones y coberturas definidas por el sistema de salud de cada persona'],
  ['Seguro complementario','Deducible, topes y reembolsos definidos por la póliza colectiva'],
  ['Seguro dental','Tope anual y prestaciones definidos por la póliza'],
  ['Seguro de accidentes','Cobertura y condiciones definidas por la póliza'],
];
const s3 = { bg:WHITE, els:[
  eyebrow('FRAGMENTACIÓN'),
  title('Las coberturas de una misma familia\nsuelen administrarse por separado.',{size:26}),
  txt('Cada cobertura puede tener condiciones, topes, documentos y vigencias diferentes. El desafío aparece cuando una familia debe entenderlas y coordinarlas para una atención concreta.',
      M,2.9,CW,0.9,{size:14,lh:1.42}),
  ...p3.flatMap(([n,d],i)=>{ const y=4.2+i*1.5; return [
    rect(M,y,CW,0.02,{fill:LINE}),
    txt(n,M,y+0.32,2.85,0.6,{size:14.5,bold:true,color:NAVY,lh:1.16,cs:tr(TR_H3,14.5)}),
    txt(d,M+3.05,y+0.32,CW-3.05,0.7,{size:12,color:INK3,lh:1.3}),
  ];}),
  rect(M,10.2,CW,0.02,{fill:LINE}),
  rrect(M,10.7,CW,1.2,{fill:'F2F5FA',line:'DEE6F2'}),
  txt('Las condiciones y el orden en que opera cada cobertura dependen de cada póliza en particular.',
      M+0.34,11.0,CW-0.68,0.66,{size:13,color:INK2,lh:1.28}),
  nota('Ejemplo construido a partir del caso ficticio de María. No describe reglas aplicables a todas las pólizas.'),
], notes:'Evitar reglas universales: cada póliza define sus propias condiciones.' };

/* ------------------------------------------------------- 4 · LA SOLUCIÓN */
const VERBS=['ENTIENDE','COORDINA','COMPARA','ALERTA','GUÍA'];
let vx=M; const verbEls=[];
VERBS.forEach(v=>{ const w=0.108*v.length+0.5;
  verbEls.push(rrect(vx,4.72,w,0.42,{r:0.21,fill:WHITE,alpha:84,line:WHITE,lineAlpha:60}));
  verbEls.push(txt(v,vx,4.72,w,0.42,{size:10,bold:true,cs:tr(TR_PILL,10),color:WHITE,align:'center',valign:'middle'}));
  vx+=w+0.16; });
const CY=5.68, CHG=6.32;
const OPTS=[['Centro A','$30.000',false],['Centro B','$25.000',true],['Centro C','$35.000',false]];
const s4 = { bg:DARK, els:[
  ...fondo('patagonia-fondo.jpg'),
  eyebrow('LA SOLUCIÓN',{color:STEEL}),
  title('Aplica tu Seguro\nno es otro seguro.',{size:30,color:WHITE}),
  txt('Es una propuesta de plataforma que ayuda a entender y coordinar las coberturas que una persona y su familia ya poseen.',
      M,2.9,7.9,0.9,{size:14.5,color:ICE,lh:1.42}),
  txt('No vende ni intermedia seguros, y no reemplaza a una Isapre, Fonasa, aseguradora, corredor ni prestador médico.',
      M,3.85,7.9,0.7,{size:12,color:STEEL,lh:1.28}),
  ...verbEls,
  rrect(M,CY,CW,CHG,{r:0.16,fill:WHITE,shadow:true}),
  rotulo('EJEMPLO ILUSTRATIVO',M+0.5,CY+0.42,CW-1.0,10,AMBER),
  txt('La hija de María necesita\nuna resonancia de rodilla.',M+0.5,CY+0.82,CW-1.0,1.0,
      {size:21,bold:true,color:INK,lh:1.12,cs:tr(TR_SUBT,21)}),
  txt('Con los datos preparados para este ejemplo, Aplica tu Seguro mostraría tres alternativas y cuánto pagaría María de su bolsillo en cada una.',
      M+0.5,CY+2.02,CW-1.0,0.9,{size:12.5,color:INK2,lh:1.3}),
  ...OPTS.flatMap(([n,v,best],i)=>{ const y=CY+3.1+i*0.74; return [
    rrect(M+0.5,y,CW-1.0,0.62,{r:0.12,fill:best?'EAF7EF':BG2,line:best?'BFE5CD':LINE}),
    txt(n,M+0.78,y,2.2,0.62,{size:13,color:best?INK:INK2,bold:best,valign:'middle'}),
    txt(best?v+'  ·  menor gasto estimado':v,M+0.78,y,CW-1.56,0.62,
        {size:13,bold:true,color:best?GREEN:INK2,align:'right',valign:'middle'}),
  ];}),
  txt('Comparación exclusivamente económica · Precios y coberturas simulados',
      M+0.5,CY+5.5,CW-1.0,0.4,{size:10.5,color:INK3,lh:1.24}),
], notes:'El ejemplo es ilustrativo: no se consulta ningún plan real ni información de prestadores.' };

/* ------------------------------------------------------- 5 · VALOR ESPERADO */
const p5 = [
  ['Para el colaborador','Mayor claridad sobre sus coberturas, los gastos estimados y los próximos pasos.'],
  ['Para Recursos Humanos','Información agregada para evaluar adopción y utilización del beneficio.'],
  ['Para la empresa','Una oportunidad de aumentar el valor percibido de beneficios que ya financia.'],
];
const s5 = { bg:WHITE, els:[
  eyebrow('VALOR ESPERADO'),
  title('Qué esperamos que aporte,\ny qué queremos validar.',{size:27}),
  txt('Lo siguiente son resultados esperados e hipótesis de trabajo, no resultados medidos.',
      M,3.1,CW,0.4,{size:14,color:INK,bold:true}),
  ...p5.flatMap(([n,d],i)=>{ const y=4.0+i*1.85, h=1.55; return [
    rrect(M,y,CW,h,{fill:BG2,line:LINE}),
    txt(n,M+0.36,y+0.34,CW-0.72,0.34,{size:15,bold:true,color:NAVY,cs:tr(TR_H3,15)}),
    txt(d,M+0.36,y+0.82,CW-0.72,0.6,{size:12.5,color:INK2,lh:1.3}),
  ];}),
  rrect(M,9.95,CW,2.2,{r:0.16,fill:DARK}),
  rotulo('TRANSPARENCIA',M+0.5,10.3,CW-1.0,10,STEEL),
  txt([{text:'Aplica tu Seguro está en validación comercial. ',color:WHITE,bold:true},
       {text:'No existen integraciones, clientes, pilotos ejecutados, resultados reales ni acuerdos con terceros, y todos los datos de esta presentación son sintéticos.',color:ICE}],
      M+0.5,10.72,CW-1.0,1.1,{size:13.5,lh:1.32}),
], notes:'Mantener el lenguaje en condicional. Son hipótesis que el piloto permitiría validar.' };

/* ------------------------------------------------------- 6 · PRIVACIDAD */
const PN = ['Diagnósticos','Documentos médicos','Consultas individuales','Gastos individuales','Pólizas personales','Reembolsos individuales'];
const PS = ['Activación','Adopción','Utilización agregada','Indicadores económicos agregados','Información anonimizada o suprimida conforme al diseño definitivo'];
const REG = [['Persona','Sofía · 9 años'],['Prestación','Resonancia de rodilla'],['Pago estimado','$25.000']];
const REGX = [['Persona','No disponible'],['Prestación','No disponible'],['Pago estimado','Incluido en el total agregado']];
const BW=(CW-0.3)/2;
const s6 = { bg:DARK, els:[
  ...fondo('vina-fondo.jpg'),
  eyebrow('PRIVACIDAD',{color:STEEL}),
  title('El diseño propuesto separa la experiencia\nindividual del dashboard corporativo.',{size:24,color:WHITE}),
  // lo que no se comparte
  rrect(M,3.3,CW,2.8,{r:0.16,fill:WHITE,alpha:82,line:WHITE,lineAlpha:64}),
  rotulo('LA EMPRESA NO ACCEDE A',M+0.4,3.59,CW-0.8,10,AMBER_L),
  ...PN.flatMap((t,i)=>[ell(M+0.42,4.23+i*0.33,0.1,AMBER_L),
       txt(t,M+0.68,4.13+i*0.33,CW-1.08,0.3,{size:12,color:ICE})]),
  // lo que sí podría recibir
  rrect(M,6.45,CW,2.55,{r:0.16,fill:WHITE,alpha:82,line:WHITE,lineAlpha:64}),
  rotulo('LA EMPRESA PODRÍA RECIBIR',M+0.4,6.74,CW-0.8,10,GREEN_L),
  ...PS.flatMap((t,i)=>[ell(M+0.42,7.38+i*0.33,0.1,GREEN_L),
       txt(t,M+0.68,7.28+i*0.33,CW-1.08,0.3,{size:12,color:ICE})]),
  // el mismo registro, dos miradas
  txt('El mismo registro, dos miradas',M,9.45,5,0.3,{size:15,bold:true,color:WHITE,cs:tr(TR_H3,15)}),
  txt('Atención completamente simulada',M+4.0,9.49,CW-4.0,0.28,{size:11,color:STEEL,align:'right'}),
  rrect(M,10.0,BW,1.75,{r:0.16,fill:WHITE,alpha:82,line:WHITE,lineAlpha:64}),
  rotulo('COLABORADOR',M+0.32,10.26,BW-0.64,9.5,ICE),
  ...REG.flatMap(([k,v],i)=>[
    txt(k,M+0.32,10.7+i*0.3,1.4,0.24,{size:10,color:STEEL}),
    txt(v,M+1.66,10.7+i*0.3,BW-1.98,0.24,{size:10,color:WHITE,bold:true})]),
  rrect(M+BW+0.3,10.0,BW,1.75,{r:0.16,fill:WHITE,alpha:82,line:WHITE,lineAlpha:64}),
  rotulo('RECURSOS HUMANOS',M+BW+0.62,10.26,BW-0.64,9.5,ICE),
  ...REGX.flatMap(([k,v],i)=>[
    txt(k,M+BW+0.62,10.7+i*0.3,1.4,0.24,{size:10,color:STEEL}),
    txt(v,M+BW+1.96,10.7+i*0.3,BW-1.98,0.3,{size:10,color:STEEL,lh:1.14})]),
  nota('Los umbrales y las medidas definitivas de anonimización deben validarse antes de un piloto. El ejemplo no representa una garantía legal o técnica.',{y:12.2,color:STEEL}),
], notes:'Cambiar la vista en vivo si se presenta el prototipo. La separación es un principio obligatorio de la arquitectura propuesta.' };

/* ------------------------------------------------------- 7 · EL PROTOTIPO */
const s7 = { bg:WHITE, els:[
  eyebrow('EL PROTOTIPO'),
  title('Explora el prototipo comercial.',{size:27}),
  rrect(M-0.12,2.55,CW+0.24,5.43,{fill:BG2,line:LINE,shadowSoft:true}),
  img('proto-comparador.png',M,2.67,CW,5.19),
  txt('El prototipo permite recorrer la experiencia propuesta para María, su familia y Recursos Humanos. Utiliza datos 100% simulados y no está conectado a Isapres, aseguradoras ni prestadores.',
      M,8.45,CW,0.9,{size:13,lh:1.42}),
  img('qr.png',M,9.7,1.6,1.6),
  txt('Escanea o abre el enlace',M+1.9,9.85,CW-1.9,0.3,{size:12,bold:true,color:INK}),
  txt('claude.ai/artifact/\nNSb5DKAfVGnkGbQdXLfkYX',M+1.9,10.22,CW-1.9,0.7,
      {size:11,color:BLUE,lh:1.24,link:URL}),
  rrect(M,11.6,CW,0.82,{fill:'F2F5FA',line:'DEE6F2'}),
  txt('Prototipo alojado temporalmente en un entorno de demostración.',
      M+0.34,11.83,CW-0.68,0.4,{size:11,color:INK2,lh:1.24}),
  nota('Prototipo de validación comercial, no un producto en producción. Las personas, la empresa, las pólizas, los precios y los prestadores son ficticios.',{y:12.72}),
], notes:'Confirmar que el enlace esté compartido antes de enviar la presentación por correo.' };

/* ------------------------------------------------------- 8 · EL PILOTO */
const P8 = ['90 días','Hasta 100 colaboradores','Acceso familiar incluido','Onboarding acompañado',
            'Medición de adopción','Medición de utilización','Dashboard corporativo agregado',
            'Criterios de éxito acordados con la empresa'];
const s8 = { bg:DARK, els:[
  ...fondo('valdivia-fondo.jpg'),
  eyebrow('EL PILOTO',{color:STEEL}),
  title('Piloto corporativo\nde 90 días.',{size:28,color:WHITE}),
  ...P8.flatMap((t,i)=>{ const col=i%2, row=(i-col)/2;
    const x=M+col*4.25, y=3.9+row*1.25; return [
      ell(x+0.03,y+0.1,0.16,GREEN),
      txt(t,x+0.36,y,3.7,0.6,{size:12.5,color:WHITE,bold:true,lh:1.22}),
    ];}),
  rrect(M,9.0,CW,1.4,{r:0.16,fill:WHITE,alpha:88,line:WHITE,lineAlpha:70}),
  txt('Al cierre, la empresa revisa los indicadores agregados y los criterios de éxito acordados para decidir el siguiente paso.',
      M+0.4,9.35,CW-0.8,0.75,{size:12.5,color:ICE,lh:1.3}),
  nota('El piloto busca validar problema, solución, adopción, operación y disposición a pagar. Sin precio en esta etapa.',{color:STEEL}),
], notes:'La carta de intención no es parte del piloto: puede ser un paso comercial posterior.' };

/* ------------------------------------------------------- 9 · CIERRE */
/* Sin fotografía a propósito: los datos de contacto tienen que leerse sin competencia. */
const s9 = { bg:DARK, els:[
  img('logo-blanco.png',M,1.02,0.44,0.466),
  txt('APLICA TU SEGURO',M+0.62,1.11,5,0.3,{size:11.5,bold:true,cs:tr(TR_MARCA,11.5),color:WHITE,valign:'middle'}),
  txt('¿Tendría sentido validar\nAplica tu Seguro con un grupo\nde sus colaboradores?',M,3.5,CW,2.2,
      {size:30,bold:true,color:WHITE,lh:1.14,cs:tr(TR_DISPLAY,30)}),
  txt('Conversemos sobre el alcance y los criterios de un piloto de 90 días.',M,5.45,7.9,0.4,
      {size:15,color:ICE}),
  regla(6.5),
  rrect(M,7.1,CW,2.95,{r:0.16,fill:WHITE,alpha:88,line:WHITE,lineAlpha:70}),
  rotulo('CONTACTO',M+0.45,7.52,CW-0.9,10,STEEL),
  txt('Diego Córdova E.',M+0.45,7.9,CW-0.9,0.42,{size:20,bold:true,color:WHITE,cs:tr(TR_SUBT,20)}),
  txt('Fundador · Aplica tu Seguro',M+0.45,8.38,CW-0.9,0.3,{size:13,color:ICE}),
  rect(M+0.45,8.9,CW-0.9,0.012,{fill:WHITE,alpha:65}),
  txt('+569 8495 3941',M+0.45,9.12,4,0.32,{size:14.5,color:WHITE}),
  txt('hola@aplicatuseguro.cl',M+0.45,9.52,CW-0.9,0.32,{size:14.5,color:WHITE,link:'mailto:hola@aplicatuseguro.cl'}),
  nota('Aplica tu Seguro está en validación comercial. Todos los datos de esta presentación son sintéticos y no corresponden a resultados de clientes.',
       {y:12.35,color:STEEL,size:10.5}),
], notes:'Hacer la pregunta y quedarse callado.' };

module.exports = { SLIDES:[s1,s2,s3,s4,s5,s6,s7,s8,s9], SW, SH };
