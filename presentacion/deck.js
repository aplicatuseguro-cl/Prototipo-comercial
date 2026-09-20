/* Aplica tu Seguro — especificación de la presentación.
   Una sola fuente para PPTX y PDF: coordenadas en pulgadas sobre 13.333 x 7.5. */

const NAVY='2C3E5D', DARK='16233A', BLUE='2F6FED', GREEN='16A34A';
const INK='0F172A', INK2='3F4A5C', INK3='6B7686';
const LINE='E6E9EF', BG2='F7F8FA', WHITE='FFFFFF', ICE='C8D8F0', STEEL='8FA9D0';
const SW=13.333, SH=7.5, M=0.85, CW=SW-2*M;

const img   = (src,x,y,w,h)       => ({t:'image', src,x,y,w,h});
const rect  = (x,y,w,h,o={})      => ({t:'rect', x,y,w,h, r:0, ...o});
const rrect = (x,y,w,h,o={})      => ({t:'rect', x,y,w,h, r:o.r??0.14, ...o});
const ell   = (x,y,d,fill)        => ({t:'ellipse', x,y,w:d,h:d,fill});
const txt   = (text,x,y,w,h,o={}) => ({t:'text', text,x,y,w,h, size:13.5, color:INK2, ...o});

const eyebrow = (t,{x=M,y=0.8,color=INK3}={}) =>
  txt(t,x,y,6,0.26,{size:10.5,bold:true,cs:2.4,color});
const title = (t,{x=M,y=1.2,w=CW,size=31,color=INK}={}) =>
  txt(t,x,y,w,1.8,{size,bold:true,color,lh:1.06});
const numDot = (x,y,n,{fill=NAVY,color=WHITE,d=0.34}={}) =>
  [ell(x,y,d,fill), txt(n,x,y,d,d,{size:11.5,bold:true,color,align:'center',valign:'middle'})];

/* ------------------------------------------------------------------ 1 */
const s1 = { els:[
  img('torres.png',0,0,SW,SH),
  rect(0,0,SW,SH,{fill:DARK, alpha:38}),
  img('logo-blanco.png',M,0.66,0.44,0.466),
  txt('APLICA TU SEGURO',M+0.62,0.75,4,0.3,{size:11.5,bold:true,cs:3,color:WHITE,valign:'middle'}),
  txt('Todas tus coberturas de salud.\nFinalmente trabajando juntas.',M,2.62,10.4,2.0,
      {size:40,bold:true,color:WHITE,lh:1.08}),
  txt('Beneficios de salud que tu empresa ya financia, finalmente aprovechados.',M,4.78,8.4,0.5,
      {size:16.5,color:ICE}),
  txt('Presentación comercial · 2026',M,6.5,6,0.3,{size:11,color:STEEL,valign:'middle'}),
], notes:'Abrir con el problema, no con el producto: sus colaboradores tienen más cobertura de la que creen y la usan menos de lo que podrían.' };

/* ------------------------------------------------------------------ 2 */
const p2 = [
  ['No sabe cuál cobertura se aplica primero','Cada atención tiene un orden distinto entre Isapre, complementario y accidentes.'],
  ['No sabe cuánto va a pagar antes de atenderse','Descubre el copago en la caja, cuando ya no puede elegir.'],
  ['Pierde beneficios que su empresa ya pagó','Topes anuales que vencen sin usarse y reembolsos que caducan por un documento.'],
];
const s2 = { bg:WHITE, els:[
  img('atacama.png',8.35,0,SW-8.35,SH),
  eyebrow('EL PROBLEMA'),
  title('María tiene cuatro coberturas.\nY no sabe cómo usarlas.',{w:7.3,size:30}),
  txt('Tiene 34 años y dos hijos. Isapre para ella y los niños, Fonasa para su pareja, y el seguro complementario, dental y de accidentes que financia su empresa. Cuatro pólizas vigentes, cuatro reglas distintas.',
      M,2.72,6.9,1.05,{lh:1.3}),
  ...p2.flatMap(([h,d],i)=>{ const y=4.12+i*0.9; return [
    ...numDot(M,y,String(i+1)),
    txt(h,M+0.52,y-0.04,6.4,0.3,{size:14,bold:true,color:INK}),
    txt(d,M+0.52,y+0.28,6.4,0.44,{size:11.5,color:INK3,lh:1.24}),
  ];}),
], notes:'Preguntar: ¿cuántos de sus colaboradores sabrían decir hoy cuánto les queda de deducible?' };

/* ------------------------------------------------------------------ 3 */
const p3 = [
  ['Fonasa o Isapre','Bonifica primero, según arancel y tramo'],
  ['Complementario','Opera después, con deducible y tope anual'],
  ['Dental','Tope propio, sin deducible'],
  ['Accidentes','Se activa antes que el complementario'],
];
const CW3=2.70, G3=0.28;
const s3 = { bg:WHITE, els:[
  eyebrow('POR QUÉ PASA'),
  title('Ninguna de sus coberturas sabe\nque las otras existen.',{w:10.6}),
  txt('El sistema chileno no falla por falta de cobertura. Falla porque las coberturas están fragmentadas y nadie tiene el incentivo de explicarlas en conjunto.',
      M,2.56,10.2,0.6,{size:14}),
  ...p3.flatMap(([n,d],i)=>{ const x=M+i*(CW3+G3), y=3.36, h=1.94; return [
    rrect(x,y,CW3,h,{fill:BG2,line:LINE}),
    ...numDot(x+0.24,y+0.26,String(i+1)),
    txt(n,x+0.24,y+0.78,CW3-0.48,0.34,{size:14.5,bold:true,color:INK}),
    txt(d,x+0.24,y+1.16,CW3-0.48,0.66,{size:11,color:INK3,lh:1.24}),
  ];}),
  rrect(M,5.74,CW,0.92,{fill:'F2F5FA',line:'DEE6F2'}),
  txt([{text:'Cuatro reglas, cuatro topes y cuatro vencimientos distintos. ',bold:true,color:INK},
       {text:'El resultado es dinero ya pagado que se pierde.',color:INK2}],
      M+0.34,5.96,CW-0.68,0.5,{size:14}),
], notes:'Aquí nace el interés de Recursos Humanos: es plata que la empresa ya desembolsó.' };

/* ------------------------------------------------------------------ 4 */
const VERBS=['ENTIENDE','COORDINA','COMPARA','ALERTA','GUÍA'];
let vx=M; const verbEls=[];
VERBS.forEach(v=>{ const w=0.108*v.length+0.5;
  verbEls.push(rrect(vx,5.12,w,0.42,{r:0.21,fill:WHITE,alpha:84,line:WHITE,lineAlpha:60}));
  verbEls.push(txt(v,vx,5.12,w,0.42,{size:10,bold:true,cs:1.4,color:WHITE,align:'center',valign:'middle'}));
  vx+=w+0.16; });
const CX=7.75, CY=1.28, CWD=4.72, CHG=4.94;
const OPTS=[['Centro A','$30.000',false],['Centro B','$25.000',true],['Centro C','$35.000',false]];
const s4 = { els:[
  img('altiplano.png',0,0,SW,SH),
  rect(0,0,SW,SH,{fill:DARK,alpha:20}),
  eyebrow('LA SOLUCIÓN',{color:STEEL}),
  title('No es otro seguro.\nEs la capa que coordina\nlos que ya tienes.',{w:6.5,color:WHITE}),
  txt('Aplica tu Seguro lee todas las coberturas de la familia en conjunto y responde lo que importa en el momento de decidir.',
      M,4.16,6.0,0.8,{size:14,color:ICE,lh:1.3}),
  ...verbEls,
  rrect(CX,CY,CWD,CHG,{r:0.16,fill:WHITE,shadow:true}),
  txt('UN MOMENTO CUALQUIERA',CX+0.42,CY+0.44,CWD-0.84,0.26,{size:10,bold:true,cs:2.2,color:INK3}),
  txt('La hija de María necesita una resonancia de rodilla.',CX+0.42,CY+0.8,CWD-0.84,0.76,
      {size:17,bold:true,color:INK,lh:1.14}),
  txt('Aplica tu Seguro cruza el plan de Isapre de la niña con el seguro complementario de la empresa y compara tres centros.',
      CX+0.42,CY+1.66,CWD-0.84,0.8,{size:12,color:INK2,lh:1.3}),
  ...OPTS.flatMap(([n,v,best],i)=>{ const y=CY+2.56+i*0.56; return [
    rrect(CX+0.42,y,CWD-0.84,0.46,{r:0.1,fill:best?'EAF7EF':BG2,line:best?'BFE5CD':LINE}),
    txt(n,CX+0.64,y,1.8,0.46,{size:12,color:best?INK:INK2,bold:best,valign:'middle'}),
    txt(best?v+'  ·  menor gasto':v,CX+0.64,y,CWD-1.3,0.46,
        {size:12,bold:true,color:best?GREEN:INK2,align:'right',valign:'middle'}),
  ];}),
  txt('Ejemplo ilustrativo · datos simulados · montos estimados',CX+0.42,CY+4.36,CWD-0.84,0.3,
      {size:9.5,color:INK3}),
], notes:'Dejar que la comparación hable sola. Es una estimación, y lo decimos en pantalla.' };

/* ------------------------------------------------------------------ 5 */
const p5 = [
  ['Para el colaborador','Menos gasto de bolsillo, menos trámites perdidos y respuestas claras cuando más importan.'],
  ['Para Recursos Humanos','Evidencia de utilización para defender la renovación de la póliza, y menos consultas operativas en el buzón de Personas.'],
  ['Para la empresa','Un beneficio que ya está pagado y que por fin se percibe como tal.'],
];
const CW5=3.69, G5=0.28;
const s5 = { bg:WHITE, els:[
  eyebrow('QUÉ GANA LA EMPRESA'),
  title('Tu empresa ya invierte en salud.\nNosotros hacemos que se note.',{w:10.6}),
  ...p5.flatMap(([n,d],i)=>{ const x=M+i*(CW5+G5), y=2.98, h=1.74; return [
    rrect(x,y,CW5,h,{fill:BG2,line:LINE}),
    txt(n,x+0.3,y+0.3,CW5-0.6,0.3,{size:14.5,bold:true,color:NAVY}),
    txt(d,x+0.3,y+0.72,CW5-0.6,0.9,{size:11.5,color:INK2,lh:1.28}),
  ];}),
  rrect(M,5.14,CW,1.56,{r:0.16,fill:DARK}),
  txt('LA SALUD DEL COLABORADOR SIGUE SIENDO PRIVADA',M+0.42,5.38,CW-0.84,0.26,
      {size:10,bold:true,cs:2.2,color:STEEL}),
  txt([{text:'La empresa nunca ve diagnósticos, documentos, consultas ni gastos individuales. ',color:WHITE,bold:true},
       {text:'Recibe solo indicadores agregados, y ningún dato se muestra cuando el grupo tiene menos de siete personas.',color:ICE}],
      M+0.42,5.74,CW-0.84,0.76,{size:13.5,lh:1.28}),
], notes:'La privacidad no es una cláusula del contrato: es cómo está construido el producto.' };

/* ------------------------------------------------------------------ 6 */
const RX=8.86, RW=3.62;
const s6 = { bg:WHITE, els:[
  eyebrow('EL PROTOTIPO'),
  title('Puedes verlo funcionando hoy.',{w:10.6}),
  rrect(M-0.1,2.42,7.62,4.4,{fill:BG2,line:LINE,shadowSoft:true}),
  img('proto-comparador.png',M,2.52,7.42,4.2),
  txt('Un prototipo navegable con el recorrido completo: las coberturas de la familia, los beneficios por vencer, el comparador y el reporte que ve Recursos Humanos.',
      RX,2.52,RW,1.4,{size:13,lh:1.32}),
  img('qr.png',RX,4.06,1.55,1.55),
  txt('Escanea o abre el enlace',RX+1.75,4.14,RW-1.75,0.3,{size:11,bold:true,color:INK}),
  txt('claude.ai/artifact/\nNSb5DKAfVGnkGbQdXLfkYX',RX+1.72,4.5,RW-1.68,0.7,
      {size:10,color:BLUE,lh:1.22,link:'https://claude.ai/artifact/NSb5DKAfVGnkGbQdXLfkYX'}),
  rrect(RX,5.86,RW,0.96,{fill:'F2F5FA',line:'DEE6F2'}),
  txt('Prototipo de validación comercial. Todos los datos, personas, empresas y prestadores que aparecen son simulados.',
      RX+0.28,6.06,RW-0.56,0.66,{size:10.5,color:INK2,lh:1.26}),
], notes:'Si lo envías por correo, revisa antes que el enlace esté compartido con el destinatario.' };

/* ------------------------------------------------------------------ 7 */
const p7 = [
  ['Acuerdo de intención','Un documento breve con alcance, indicadores de éxito y condiciones.'],
  ['Onboarding acompañado','Activación guiada del grupo y comunicación interna preparada.'],
  ['Medición de adopción y uso','Activación, utilización por cobertura y consultas resueltas.'],
  ['Decisión informada','Al día 90, datos reales de su empresa para decidir si continúa.'],
];
const s7 = { bg:WHITE, els:[
  img('fiordos.png',8.35,0,SW-8.35,SH),
  eyebrow('EL PILOTO'),
  title('Validemos esto juntos:\n90 días, un grupo acotado.',{w:7.1}),
  ...p7.flatMap(([h,d],i)=>{ const y=3.3+i*0.9; return [
    ...numDot(M,y,String(i+1)),
    txt(h,M+0.52,y-0.04,6.4,0.3,{size:14,bold:true,color:INK}),
    txt(d,M+0.52,y+0.28,6.4,0.44,{size:11.5,color:INK3,lh:1.24}),
  ];}),
  txt('Hasta 100 colaboradores · acceso familiar incluido · reporte corporativo agregado',
      M,6.96,7.1,0.3,{size:10.5,color:INK3}),
], notes:'No dar precio. El alcance y las condiciones se definen en conjunto antes de partir.' };

/* ------------------------------------------------------------------ 8 */
const s8 = { els:[
  img('costa.png',0,0,SW,SH),
  rect(0,0,SW,SH,{fill:DARK,alpha:28}),
  img('logo-blanco.png',M,0.66,0.44,0.466),
  txt('APLICA TU SEGURO',M+0.62,0.75,4,0.3,{size:11.5,bold:true,cs:3,color:WHITE,valign:'middle'}),
  txt('¿Tendría sentido probar esto\ncon un grupo de sus colaboradores?',M,2.6,10.6,1.9,
      {size:34,bold:true,color:WHITE,lh:1.12}),
  rrect(M,5.0,5.5,1.62,{r:0.16,fill:WHITE,alpha:88,line:WHITE,lineAlpha:70}),
  txt('Diego Córdova E.',M+0.36,5.22,4.8,0.3,{size:15,bold:true,color:WHITE}),
  txt('Fundador · Aplica tu Seguro',M+0.36,5.54,4.8,0.28,{size:11.5,color:ICE}),
  txt('+569 8495 3941',M+0.36,5.9,2.6,0.28,{size:12,color:WHITE}),
  txt('hola@aplicatuseguro.cl',M+0.36,6.2,4.8,0.28,{size:12,color:WHITE,link:'mailto:hola@aplicatuseguro.cl'}),
  txt('Presentación comercial · Los datos, personas y empresas mostrados son simulados',
      M,6.96,10,0.3,{size:9.5,color:STEEL,valign:'middle'}),
], notes:'Hacer la pregunta y quedarse callado. Pedir: número de colaboradores, aseguradora actual y mes de renovación de la póliza.' };

module.exports = { SLIDES:[s1,s2,s3,s4,s5,s6,s7,s8], SW, SH,
  COLORS:{NAVY,DARK,BLUE,GREEN,INK,INK2,INK3,LINE,BG2,WHITE,ICE,STEEL} };
