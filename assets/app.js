/* ==========================================================================
   Aplica tu Seguro — Prototipo de validación comercial
   Navegación, Golden Path, estado e interacciones. Sin backend. Sin red.
   ========================================================================== */

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => "$" + Math.round(n).toLocaleString("es-CL");

const ICON = {
  arrow:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  alert:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="1.8"><path d="M12 8.5v5M12 17h.01M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20.3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M20 6.5 9.5 17 4 11.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="1.8"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round"/></svg>',
  share:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="1.9"><path d="M20 6.5 9.5 17 4 11.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  spark:'<svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.5 14 9l6.5 2-6.5 2L12 21.5 10 13 3.5 11 10 9Z"/></svg>'
};

/* ---------------- Estado ---------------- */
const INITIAL = {
  member: "familia",
  deducibleUsado: DEMO.beneficios[0].usado,
  gastoConfirmado: false,
  gastoOpcion: null,
  chat: [],
  asked: [],
  privView: "colaborador",
  gpStep: 0,
  prev: "cover"
};
let state = structuredClone(INITIAL);
let current = "cover";

/* ---------------- Golden Path ---------------- */
const GP = [
  { id:"cover",           label:"Entrada" },
  { id:"col-inicio",      label:"María",                cta:"Entrar como María" },
  { id:"col-coberturas",  label:"Coberturas",           cta:"Ver sus coberturas" },
  { id:"col-beneficios",  label:"Beneficios",           cta:"Ver cuánto ha usado" },
  { id:"col-asistente",   label:"Resonancia de Sofía",  cta:"Ir al asistente" },
  { id:"col-asistente",   label:"Comparación económica",cta:"Hacer la pregunta", do:() => ask("resonancia") },
  { id:"col-asistente",   label:"Registrar gasto",      cta:"Registrar el gasto", do:() => openGasto("b") },
  { id:"col-reembolsos",  label:"Reembolso",            cta:"Ver el reembolso" },
  { id:"col-anio",        label:"Valor familiar",       cta:"Ver el cierre familiar" },
  { id:"cor-resumen",     label:"Empresa",              cta:"Pasar a la vista Empresa" },
  { id:"cor-privacidad",  label:"Privacidad",           cta:"Ver privacidad" },
  { id:"cor-piloto",      label:"Piloto",               cta:"Ver el piloto" }
];

function gpGoTo(i){
  if (i < 0 || i > GP.length - 1) return;
  const step = GP[i];
  state.gpStep = i;
  if (current !== step.id) go(step.id);
  if (step.do) step.do();
  renderGP();
}
const gpNext = () => gpGoTo(state.gpStep + 1);
const gpPrev = () => gpGoTo(state.gpStep - 1);

function renderGP(){
  const i = state.gpStep, last = i >= GP.length - 1;
  $("#gpbar").hidden = false;
  $("#gpStepLabel").textContent = GP[i].label;
  $("#gpStepCount").textContent = `· paso ${i + 1} de ${GP.length}`;
  $("#gpFill").style.width = ((i + 1) / GP.length * 100).toFixed(1) + "%";
  $("#gpPrev").disabled = i === 0;
  const next = $("#gpNext");
  next.disabled = last;
  next.innerHTML = last ? "Fin del recorrido" : `${GP[i+1].cta} ${ICON.arrow}`;
}

/* ---------------- Navegación ---------------- */
const NAV = {
  col: { links:[["col-inicio","Inicio"],["col-coberturas","Mis coberturas"],["col-beneficios","Mis beneficios"],["col-asistente","Asistente"],["col-reembolsos","Reembolsos"]],
         switch:["cor-resumen","Ver experiencia Empresa"] },
  cor: { links:[["cor-resumen","Resumen"],["cor-adopcion","Adopción"],["cor-valor","Valor generado"],["cor-privacidad","Privacidad"],["cor-piloto","Piloto"]],
         switch:["col-inicio","Volver a la vista del colaborador"] }
};
const worldOf = id => (id === "cover" || id === "estado") ? null : (id.startsWith("cor-") ? "cor" : "col");

function go(id){
  if (!$("#" + id)) return;
  if (id !== current) state.prev = current;
  current = id;
  if (GP[state.gpStep].id !== id){
    const idx = GP.findIndex(s => s.id === id);
    if (idx >= 0) state.gpStep = idx;
  }
  $$(".screen").forEach(s => s.classList.toggle("show", s.id === id));
  const w = worldOf(id), nav = $("#appnav");
  document.body.classList.toggle("world-corp", w === "cor");
  if (w){ nav.hidden = false; buildNav(w, id); } else { nav.hidden = true; }
  $("#foot").hidden = (id === "cover");
  window.scrollTo(0, 0);
  onEnter(id);
  renderGP();
  updatePresenter();
}
const goBack = () => go(state.prev || "cover");

function buildNav(w, id){
  const cfg = NAV[w], who = $("#navWho");
  if (w === "col"){
    const m = DEMO.familia[0];
    who.innerHTML = `<span class="av ${m.av}">${m.ini}</span>
      <span class="stack-6"><span class="nm">${m.nombre} ${m.apellido}</span><span class="sb">${DEMO.empresa.nombre}</span></span>`;
  } else {
    who.innerHTML = `<span class="av" style="background:var(--navy-900);border-radius:9px">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><path d="M3 21h18M5 21V6l7-3 7 3v15M9.5 10h1M13.5 10h1M9.5 14h1M13.5 14h1" stroke-linecap="round"/></svg></span>
      <span class="stack-6"><span class="nm">${DEMO.empresa.nombre}</span><span class="sb">Recursos Humanos · Vista corporativa</span></span>`;
  }
  $("#navLinks").innerHTML = cfg.links
    .map(([k,l]) => `<button class="navlink${k===id?" active":""}" onclick="go('${k}')">${l}</button>`).join("");
  const sw = $("#navSwitch");
  sw.innerHTML = `${cfg.switch[1]} ${ICON.arrow}`;
  sw.onclick = () => go(cfg.switch[0]);
}

function onEnter(id){
  if (id === "col-inicio")     { renderFamily(); renderGraph(); }
  if (id === "col-coberturas") renderCoberturas();
  if (id === "col-beneficios") { renderBeneficios(); requestAnimationFrame(()=>setTimeout(fillBars,60)); }
  if (id === "col-asistente")  renderChat();
  if (id === "col-reembolsos") renderReembolsos();
  if (id === "col-anio")       renderAnio();
  if (id === "cor-resumen")    renderResumen();
  if (id === "cor-adopcion")   { renderAdopcion(); requestAnimationFrame(()=>setTimeout(fillBars,60)); }
  if (id === "cor-privacidad") renderPrivacidad();
  if (id === "cor-piloto")     renderPiloto();
  if (id === "estado")         renderEstado();
}

/* ---------------- Familia y grafo ---------------- */
function renderFamily(){
  const opts = [{ id:"familia", nombre:"Toda la familia", rol:"4 personas", ini:"F", av:"av-m" }, ...DEMO.familia];
  $("#familyChips").innerHTML = opts.map(m => `
    <button class="fchip${state.member===m.id?" on":""}" onclick="setMember('${m.id}')">
      <span class="av ${m.av}">${m.ini}</span>
      <span class="stack-6" style="text-align:left">
        <span class="fchip-nm">${m.nombre}</span>
        <span class="fchip-sub">${m.rol}${m.edad?" · "+m.edad+" años":""}</span>
      </span></button>`).join("");
  const t = $("#covCountTxt");
  if (state.member === "familia"){
    t.textContent = "Tu familia tiene 4 coberturas de salud activas.";
  } else {
    const m = DEMO.familia.find(f => f.id === state.member);
    const n = m.coberturas.length;
    t.textContent = `${m.id === "maria" ? "Tú tienes" : m.nombre + " tiene"} ${n} de las 4 coberturas del grupo familiar.`;
  }
}
function setMember(id){ state.member = id; renderFamily(); renderGraph(); }

const GRAPH_NODES = [
  { id:"complementario", a:-90, sub:"Financiado por tu empresa" },
  { id:"dental",         a:  0, sub:"Financiado por tu empresa" },
  { id:"accidentes",     a: 90, sub:"Financiado por tu empresa" },
  { id:"isapre",         a:180, sub:"Contratada por ti" }
];

const activeSet = () => state.member === "familia"
  ? new Set(DEMO.familia.flatMap(f => f.coberturas))
  : new Set(DEMO.familia.find(f => f.id === state.member).coberturas);

function renderGraph(){
  const svg = $("#graph"), cx = 380, cy = 172, rx = 282, ry = 132, W = 172, H = 54;
  const act = activeSet(), sel = state.member !== "familia";
  const pos = {};
  GRAPH_NODES.forEach(n => {
    const r = n.a * Math.PI / 180;
    pos[n.id] = { x: cx + rx * Math.cos(r), y: cy + ry * Math.sin(r) };
  });

  const edges = GRAPH_NODES.map(n => {
    const p = pos[n.id], mx = (cx + p.x)/2, my = (cy + p.y)/2 + (p.y < cy ? 22 : -22);
    const on = act.has(n.id);
    return `<path class="edge ${on && sel ? "lit" : ""} ${sel && !on ? "dim" : ""}" d="M${cx} ${cy} Q${mx} ${my} ${p.x} ${p.y}"/>`;
  }).join("");

  const nodes = GRAPH_NODES.map(n => {
    const c = DEMO.coberturas[n.id], p = pos[n.id], on = act.has(n.id);
    return `<g class="node ${on && sel ? "lit" : ""} ${sel && !on ? "dim" : ""}" onclick="openCobertura('${n.id}')" role="button" tabindex="0">
      <rect class="node-bg" x="${p.x-W/2}" y="${p.y-H/2}" width="${W}" height="${H}" rx="14"/>
      <rect x="${p.x-W/2}" y="${p.y-H/2}" width="4.5" height="${H}" rx="2.2" fill="${c.color}"/>
      <text class="node-t" x="${p.x-W/2+18}" y="${p.y-4}">${c.corto}</text>
      <text class="node-s" x="${p.x-W/2+18}" y="${p.y+14}">${n.sub}</text>
    </g>`;
  }).join("");

  let hubTop = "Familia", hubSub = "4 personas";
  if (sel){ const m = DEMO.familia.find(f => f.id === state.member); hubTop = m.nombre; hubSub = m.rol; }

  svg.innerHTML = `
    <circle class="hub-ring" cx="${cx}" cy="${cy}" r="80"/>
    ${edges}
    <circle class="hub-bg" cx="${cx}" cy="${cy}" r="60"/>
    <text class="hub-t" x="${cx}" y="${cy-3}" text-anchor="middle" font-size="18">${hubTop}</text>
    <text x="${cx}" y="${cy+17}" text-anchor="middle" font-size="11.5" fill="rgba(255,255,255,.62)">${hubSub}</text>
    ${nodes}`;

  let note = $("#graphNote");
  if (!note){
    note = document.createElement("p");
    note.id = "graphNote";
    note.className = "small";
    note.style.cssText = "text-align:center;margin:14px 0 0;color:var(--ink-3)";
    svg.closest(".card").insertBefore(note, $(".graph-legend"));
  }
  note.innerHTML = state.member === "felipe"
    ? "Felipe no está en la Isapre de María: está afiliado a Fonasa, que en este escenario cumple el mismo rol de bonificar primero. <b>No es una quinta cobertura.</b>"
    : "";
}

/* ---------------- Detalle de cobertura ---------------- */
function openCobertura(id){
  const c = DEMO.coberturas[id];
  $("#panelEyebrow").textContent = c.tipo;
  $("#panelTitle").textContent = c.nombre;
  $("#panelBody").innerHTML = `
    <p class="lede" style="font-size:16px;margin:0 0 18px">${c.resumen}</p>
    <div class="card-quiet" style="margin-bottom:18px">
      <div class="eyebrow">Cubre a</div>
      <div style="margin-top:6px;font-weight:560">${c.quien}</div>
      <div class="small" style="margin-top:8px">${c.origen}</div>
    </div>
    <div class="eyebrow" style="margin-bottom:6px">Condiciones del escenario</div>
    ${c.detalle.map(([k,v]) => `<div class="brk"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
    <p class="xsmall" style="margin-top:20px">Condiciones simuladas para esta demostración. No corresponden a ninguna póliza real.</p>`;
  openPanel();
}

function renderCoberturas(){
  $("#coberturasList").innerHTML = ["isapre","complementario","dental","accidentes"].map(id => {
    const c = DEMO.coberturas[id];
    return `<button class="card" style="text-align:left;display:block;width:100%" onclick="openCobertura('${id}')">
      <div class="row-between" style="align-items:flex-start">
        <div class="row" style="gap:12px">
          <span style="width:4px;height:36px;border-radius:3px;background:${c.color};display:block"></span>
          <div class="stack-6"><div class="h3">${c.nombre}</div><div class="small">${c.tipo}</div></div>
        </div>
        <span class="tag tag-sim">Simulado</span>
      </div>
      <p class="small" style="margin:14px 0 0;color:var(--ink-2)">${c.resumen}</p>
      <div class="small" style="margin-top:12px;color:var(--ink-4)">Cubre a: ${c.quien}</div>
    </button>`;
  }).join("");

  $("#otrosElementos").innerHTML = DEMO.otrosElementos.map(o => `
    <div class="brk" style="align-items:flex-start;padding:12px 0">
      <span class="k" style="min-width:120px"><b style="color:var(--ink)">${o.nombre}</b><br>
        <span class="xsmall">${o.quien}</span></span>
      <span class="v" style="font-weight:420;color:var(--ink-2);text-align:left;flex:1;padding-left:18px">${o.nota}</span>
    </div>`).join("");
}

/* ---------------- Mis beneficios ---------------- */
function renderBeneficios(){
  $("#polizaNote").textContent = `Período simulado: ${DEMO.poliza.desde} – ${DEMO.poliza.hasta}`;
  const o = DEMO.beneficios[2];
  $("#alertOptica").innerHTML = `
    <div class="alertbox">
      <span class="ic">${ICON.alert}</span>
      <div>
        <div class="strong" style="margin-bottom:4px">${o.alertaTexto}</div>
        <div class="small" style="color:var(--ink-2)">${o.nota}</div>
      </div>
    </div>`;

  $("#benefitsList").innerHTML = DEMO.beneficios.map(b => {
    const usado = b.id === "deducible" ? state.deducibleUsado : b.usado;
    const pct   = Math.min(100, usado / b.tope * 100);
    const rest  = b.tope - usado;
    const done  = b.id === "deducible" && usado >= b.tope;
    const fill  = done ? "fill-green" : b.alerta ? "fill-empty" : "fill-navy";
    let msg;
    if (b.id === "deducible")
      msg = done
        ? `<span class="row" style="gap:8px;color:var(--green)">${ICON.check}<b>${DEMO.gasto.okTitulo}.</b></span>
           <div class="small" style="margin-top:6px">${b.cierre}</div>`
        : `Faltan <b>${money(rest)}</b> en copagos para completar el deducible.
           <div class="small" style="margin-top:6px">${b.cierre}</div>`;
    else if (b.alerta) msg = `Quedan <b>${money(rest)}</b> disponibles y sin utilizar en este escenario.`;
    else               msg = `Quedan <b>${money(rest)}</b> disponibles en el período simulado.`;

    return `<div class="benefit-card ${done?"is-done":b.alerta?"is-alert":""}">
      <div class="row-between" style="align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:12px">
        <div class="stack-6">
          <div class="row" style="gap:9px"><div class="h3">${b.titulo}</div>${done?'<span class="tag tag-ok">Completado</span>':b.alerta?'<span class="tag tag-warn">Por vencer</span>':""}</div>
          <div class="small">${b.cobertura}</div>
        </div>
        <div class="uf num" style="text-align:right">${money(usado)} <span style="color:var(--ink-4);font-weight:480">de ${money(b.tope)}</span></div>
      </div>
      <div class="bar bar-lg"><span class="${fill}" data-w="${pct}"></span></div>
      <div class="small" style="margin-top:14px;color:var(--ink-2)">${msg}</div>
      <div class="xsmall" style="margin-top:8px">${b.nota}</div>
    </div>`;
  }).join("");
}
function fillBars(){
  $$(".bar span[data-w]").forEach(el => el.style.width = el.dataset.w + "%");
  $$(".hbar .track i[data-w]").forEach(el => el.style.width = el.dataset.w + "%");
}

/* ---------------- Asistente ---------------- */
const aiBlock = html => `<div class="msg ai"><div class="ai-head"><span class="ai-dot">${ICON.spark}</span><span class="ai-name">${DEMO.agente.nombre}</span></div><div class="ai-body">${html}</div></div>`;

function renderChat(){
  const m = $("#msgs");
  m.innerHTML = state.chat.length
    ? state.chat.map(x => x.role === "me" ? `<div class="msg me">${x.text}</div>` : aiBlock(x.text)).join("")
    : aiBlock(`<p>¡Hola María! ${DEMO.agente.intro}</p>`);
  renderSuggest();
}
function renderSuggest(){
  $("#suggest").innerHTML = DEMO.agente.preguntas.map(p =>
    `<button class="qchip${p.hero?" hero":""}" ${state.asked.includes(p.id)?"disabled":""} onclick="ask('${p.id}')">${p.q}</button>`).join("");
}

function ask(id){
  const p = DEMO.agente.preguntas.find(x => x.id === id);
  if (!p || state.asked.includes(id)) return;
  state.asked.push(id);
  state.chat.push({ role:"me", text:p.q });
  renderChat();
  $("#suggest").innerHTML = "";
  const m = $("#msgs");
  m.insertAdjacentHTML("beforeend", `<div id="typing">${aiBlock('<span class="typing"><i></i><i></i><i></i></span>')}</div>`);
  m.lastElementChild.scrollIntoView({ behavior:"smooth", block:"end" });
  setTimeout(() => {
    $("#typing")?.remove();
    let html = p.a.map(t => `<p>${t}</p>`).join("");
    if (p.comparador) html += comparadorHTML();
    if (p.cta) html += `<div style="margin-top:14px"><button class="btn btn-ghost btn-s" onclick="go('${p.cta.screen}')">${p.cta.label} ${ICON.arrow}</button></div>`;
    state.chat.push({ role:"ai", text:html });
    renderChat();
    $("#msgs").lastElementChild.scrollIntoView({ behavior:"smooth", block:"start" });
  }, 850);
}

function comparadorHTML(){
  const C = DEMO.comparador, max = Math.max(...C.opciones.map(o => o.precio));
  const cards = C.opciones.map(o => {
    const w = p => (p / max * 100).toFixed(1) + "%";
    const reg = state.gastoConfirmado;
    return `<div class="opt ${o.best?"best":""} ${reg && state.gastoOpcion===o.id ? "sel":""}">
      ${o.best?'<span class="flag">Menor gasto estimado</span>':""}
      <div class="h3" style="font-size:16px">${o.nombre}</div>
      <div>
        <div class="xsmall" style="margin-bottom:5px">María paga</div>
        <div class="pay num">${money(o.pago)}</div>
      </div>
      <div class="stackbar">
        <i class="sb-isapre" style="width:${w(o.isapre)}"></i>
        <i class="sb-comp" style="width:${w(o.comp)}"></i>
        <i class="sb-pay" style="width:${w(o.pago)}"></i>
      </div>
      <div>
        <div class="brk"><span class="k">Precio referencial</span><span class="v num">${money(o.precio)}</span></div>
        <div class="brk"><span class="k"><i class="sb-isapre" style="background:#93AFD6"></i>Isapre</span><span class="v num">−${money(o.isapre)}</span></div>
        <div class="brk"><span class="k"><i style="background:#2C3E5D"></i>Complementario</span><span class="v num">−${money(o.comp)}</span></div>
      </div>
      ${reg
        ? `<div class="xsmall" style="text-align:center;padding:9px 0">${state.gastoOpcion===o.id ? "Gasto registrado" : "Gasto ya registrado"}</div>`
        : `<button class="btn btn-ghost btn-s btn-block" onclick="openGasto('${o.id}')">Registrar este gasto</button>`}
    </div>`;
  }).join("");

  return `<div style="margin-top:18px">
    <div class="row-between" style="margin-bottom:12px;flex-wrap:wrap;gap:10px">
      <div class="small"><b class="strong">${C.contexto}</b></div>
      <div class="row" style="gap:6px">
        <span class="tag tag-est">Estimación</span><span class="tag tag-sim">Datos demo</span>
      </div>
    </div>
    <div class="compare">${cards}</div>
    <div class="alertbox ok" style="margin-top:14px;background:var(--green-soft);border-color:#C9E9D6">
      <span class="ic">${ICON.check}</span>
      <div><b class="strong">${C.destacado}</b>
        <div class="small" style="color:var(--ink-2);margin-top:4px">${C.aclaracion}</div></div>
    </div>
    <div class="row-between" style="margin-top:14px;flex-wrap:wrap;gap:12px">
      <button class="link" onclick="openFuentes()">¿Cómo llegamos a esta estimación? ${ICON.arrow}</button>
      <span class="xsmall">Ninguna cifra proviene de una consulta a un prestador, Isapre o aseguradora.</span>
    </div>
  </div>`;
}

function openFuentes(){
  const C = DEMO.comparador, b = DEMO.beneficios[0];
  const falta = b.tope - state.deducibleUsado;
  const o = C.opciones.find(x => x.id === "b");
  $("#panelEyebrow").textContent = "Trazabilidad de la estimación";
  $("#panelTitle").textContent = "¿Cómo llegamos a esta estimación?";
  $("#panelBody").innerHTML = `
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:18px">
      <span class="tag tag-est">Estimación</span><span class="tag tag-sim">Datos demo</span>
      <span class="tag">Fuentes simuladas</span><span class="tag">Información referencial</span>
    </div>
    <div class="card-quiet" style="margin-bottom:18px">
      <div class="eyebrow">La aritmética, con Centro B</div>
      <div style="margin-top:12px">
        <div class="brk"><span class="k">Precio referencial</span><span class="v num">${money(o.precio)}</span></div>
        <div class="brk"><span class="k">Aporte de la Isapre de Sofía</span><span class="v num">−${money(o.isapre)}</span></div>
        <div class="brk"><span class="k">Aporte del seguro complementario</span><span class="v num">−${money(o.comp)}</span></div>
        <div class="brk" style="padding-top:12px"><span class="k strong" style="color:var(--ink)">María paga</span><span class="v num" style="font-size:17px">${money(o.pago)}</span></div>
      </div>
      <div class="hr" style="margin:16px 0"></div>
      <div class="small" style="color:var(--ink-2)">
        Ese pago se descompone así: <b>${money(falta)}</b> completan el deducible anual pendiente
        y <b>${money(o.pago - falta)}</b> son copago restante.
      </div>
    </div>
    <div class="eyebrow" style="margin-bottom:6px">De dónde sale cada número</div>
    ${C.fuentes.map(([t,d],i) => `<div class="srcitem"><span class="n">${i+1}</span>
      <div><div class="strong" style="font-size:14.5px">${t}</div><div class="small" style="margin-top:4px">${d}</div></div></div>`).join("")}
    <div class="alertbox" style="margin-top:18px">
      <span class="ic">${ICON.alert}</span>
      <div class="small" style="color:var(--ink-2)">${C.supuestos}</div>
    </div>`;
  openPanel();
}

/* ---------------- Registrar gasto (una sola vez) ---------------- */
function openGasto(optId){
  if (state.gastoConfirmado){
    $("#modalBody").innerHTML = `
      <div class="eyebrow">Registrar gasto</div>
      <h3 class="h2" style="margin:10px 0 12px">Ya está registrado</h3>
      <p class="lede" style="font-size:15.5px;margin:0">${DEMO.gasto.yaRegistrado}</p>
      <div class="row" style="gap:10px;margin-top:24px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="closeAll()">Cerrar</button>
        <button class="btn btn-primary" onclick="resetDemo()">Reiniciar demo</button>
      </div>`;
    return openModal();
  }
  const o = DEMO.comparador.opciones.find(x => x.id === optId) || DEMO.comparador.opciones[1];
  const b = DEMO.beneficios[0];
  const falta = b.tope - state.deducibleUsado;
  const aporta = Math.min(o.pago, falta), resto = o.pago - aporta;
  $("#modalBody").innerHTML = `
    <div class="eyebrow">${DEMO.gasto.titulo}</div>
    <h3 class="h2" style="margin:10px 0 6px">${o.nombre}</h3>
    <p class="small" style="margin:0 0 20px">${DEMO.gasto.prestacion} · ${DEMO.gasto.fecha}</p>
    <div style="margin-bottom:18px">
      <div class="brk"><span class="k">Precio atención</span><span class="v num">${money(o.precio)}</span></div>
      <div class="brk"><span class="k">Isapre</span><span class="v num">−${money(o.isapre)}</span></div>
      <div class="brk"><span class="k">Seguro complementario</span><span class="v num">−${money(o.comp)}</span></div>
      <div class="brk" style="padding-top:12px"><span class="k strong" style="color:var(--ink)">María paga</span><span class="v num" style="font-size:21px">${money(o.pago)}</span></div>
    </div>
    <div class="card-quiet" style="margin-bottom:20px">
      <p class="small" style="margin:0;color:var(--ink-2)">
        De los <b>${money(o.pago)}</b> que paga María, <b>${money(aporta)}</b> completan el deducible anual pendiente
        y <b>${money(resto)}</b> son copago restante.
        El deducible pasaría de <b>${money(state.deducibleUsado)}</b> a <b>${money(b.tope)}</b>.
      </p>
    </div>
    <div class="row" style="gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="confirmGasto('${o.id}')">Confirmar gasto</button>
      <button class="btn btn-ghost" onclick="closeAll()">Cancelar</button>
    </div>
    <p class="xsmall" style="margin:16px 0 0">Interacción simulada. No se envía información a ningún servidor.</p>`;
  openModal();
}

function confirmGasto(optId){
  const b = DEMO.beneficios[0];
  state.deducibleUsado = b.tope;
  state.gastoConfirmado = true;
  state.gastoOpcion = optId;
  $("#modalBody").innerHTML = `
    <div class="center">
      <div style="width:56px;height:56px;border-radius:99px;background:var(--green-soft);display:flex;align-items:center;justify-content:center;margin:0 auto 18px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.2"><path d="M20 6.5 9.5 17 4 11.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h3 class="h2">${DEMO.gasto.okTitulo}</h3>
      <p class="lede" style="font-size:15.5px;margin:12px 0 0">${DEMO.gasto.okTexto}</p>
      <div class="card-quiet" style="margin:22px 0 0;text-align:left">
        <div class="row-between" style="margin-bottom:10px">
          <span class="small">Deducible anual</span>
          <span class="strong num">${money(b.tope)} de ${money(b.tope)}</span>
        </div>
        <div class="bar bar-lg"><span class="fill-green" style="width:100%"></span></div>
      </div>
      <div class="row" style="gap:10px;justify-content:center;margin-top:24px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="closeAll();go('col-beneficios')">Ver mis beneficios</button>
        <button class="btn btn-primary" onclick="closeAll();gpGoTo(7)">Ver el reembolso ${ICON.arrow}</button>
      </div>
      <p class="xsmall" style="margin:16px 0 0">Resultado ilustrativo · Datos simulados</p>
    </div>`;
  if (current === "col-asistente") renderChat();
  toast("Gasto registrado · Deducible completado");
}

/* ---------------- Reembolsos ---------------- */
function renderReembolsos(){
  const R = DEMO.reembolsos, p = R.pendiente;
  $("#reembolsoNota").textContent = R.nota;
  $("#refundGrid").innerHTML = `
    <div class="card is-alert" style="border-color:#F0DCB8;background:linear-gradient(180deg,#FFFCF6,#fff 40%)">
      <div class="row-between" style="align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;gap:12px">
        <div class="stack-6">
          <div class="eyebrow">Pendiente por recuperar</div>
          <div class="display num" style="font-size:44px;line-height:1.05;margin-top:6px">${money(p.monto)}</div>
        </div>
        <div class="stack-6" style="text-align:right">
          <span class="tag tag-warn">${p.estado}</span>
          <span class="small">Quedan <b>${p.plazo} días</b> de plazo</span>
        </div>
      </div>
      <div class="brk"><span class="k">Prestación</span><span class="v">${p.prestacion}</span></div>
      <div class="brk"><span class="k">Fecha de atención</span><span class="v">${p.fecha}</span></div>
      <div class="eyebrow" style="margin:22px 0 10px">Documentación</div>
      <div class="plist" style="margin-top:0">
        ${p.docs.map(d => `<div class="pitem">
          <span class="ic">${d.ok
            ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.2"><path d="M20 6.5 9.5 17 4 11.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01" stroke-linecap="round"/></svg>'}</span>
          <span style="${d.ok?"":"font-weight:600"}">${d.n}</span>
          <span style="margin-left:auto" class="${d.ok?"xsmall":"tag tag-warn"}">${d.ok?"Adjunto":"Falta"}</span>
        </div>`).join("")}
      </div>
      <div style="margin-top:22px"><button class="btn btn-ghost" onclick="openReembolso()">Ver cómo se solicitaría ${ICON.arrow}</button></div>
    </div>
    <div class="stack-16">
      <div class="card-flat">
        <div class="eyebrow">En evaluación</div>
        <div class="uf num" style="margin-top:10px">${money(R.enProceso.monto)}<small>${R.enProceso.prestacion}</small></div>
        <div class="small" style="margin-top:10px">${R.enProceso.estado} · ${R.enProceso.fecha}</div>
      </div>
      <div class="card-flat">
        <div class="eyebrow">Ya recuperado en el escenario</div>
        <div class="uf num" style="margin-top:10px;color:var(--green)">${money(R.recuperado.monto)}<small>${R.recuperado.cantidad} reembolsos del período simulado</small></div>
      </div>
      <div class="card-quiet">
        <p class="small" style="margin:0;color:var(--ink-2)">
          Detectar y automatizar este flujo es parte de lo que un piloto permitiría validar. Hoy no existe procesamiento de reembolsos.
        </p>
      </div>
    </div>`;
}

function openReembolso(){
  const p = DEMO.reembolsos.pendiente;
  $("#panelEyebrow").textContent = "Reembolso pendiente · Escenario simulado";
  $("#panelTitle").textContent = `${money(p.monto)} por recuperar`;
  $("#panelBody").innerHTML = `
    <div class="alertbox" style="margin-bottom:20px">
      <span class="ic">${ICON.alert}</span>
      <div class="small" style="color:var(--ink-2)">Falta un documento: <b>orden médica</b>. Quedan <b>${p.plazo} días</b> de plazo en este escenario.</div>
    </div>
    <div class="eyebrow" style="margin-bottom:10px">Qué habría que hacer</div>
    ${p.pasos.map((s,i) => `<div class="srcitem"><span class="n">${i+1}</span><div class="small" style="color:var(--ink-2)">${s}</div></div>`).join("")}
    <p class="xsmall" style="margin-top:20px">Flujo ilustrativo. Aplica tu Seguro no tramita reembolsos: definir ese modelo operativo es parte de lo que un piloto permitiría validar.</p>`;
  openPanel();
}

/* ---------------- Valor familiar ---------------- */
function renderAnio(){
  const V = DEMO.valorMaria;
  $("#anioHeadline").textContent = V.headline;
  $("#anioSabe").innerHTML = V.sabe.map(([t,d]) => `
    <div class="card-quiet">
      <div class="row" style="gap:9px;align-items:flex-start">
        <span style="margin-top:1px">${ICON.check}</span>
        <div class="stack-6"><div class="strong" style="font-size:14.5px">${t}</div>
          <div class="small" style="color:var(--ink-3)">${d}</div></div>
      </div>
    </div>`).join("");
  $("#anioMetrica").innerHTML = `
    <div class="row-between" style="flex-wrap:wrap;gap:14px">
      <div>
        <div class="eyebrow">${V.metricaLabel}</div>
        <div class="display num" style="font-size:38px;margin-top:8px;color:var(--navy)">${money(V.metrica)}</div>
      </div>
      <div class="row" style="gap:6px"><span class="tag tag-sim">Datos simulados</span><span class="tag tag-est">Métrica secundaria</span></div>
    </div>
    <p class="small" style="margin:14px 0 0;color:var(--ink-2)">${V.metricaNota}</p>`;
}

/* ---------------- Empresa ---------------- */
function renderResumen(){
  const E = DEMO.empresa, V = DEMO.valorEmpresa;
  $("#empNombre").textContent = E.nombre;
  $("#empEtiqueta").textContent = E.etiqueta;
  $("#empPeriodo").textContent = E.periodo;
  $("#empKpis").innerHTML = [
    [E.elegibles, "Colaboradores elegibles"],
    [E.activadas, "Cuentas activadas"],
    [E.activacion + "%", "Activación"],
    [E.alcanzadas, "Personas alcanzadas incluyendo familias"]
  ].map(([v,k]) => `<div class="kpi"><div class="v num">${v}</div><div class="k">${k}</div></div>`).join("");
  $("#empCifras").innerHTML = V.cifras.map(d =>
    `<div class="kpi kpi-accent"><div class="v num">${d.v}</div><div class="k">${d.k}</div></div>`).join("");
  $("#empDisclaimer").innerHTML = `<b class="strong">${V.disclaimer}</b>`;
  $("#empNoSumar").textContent = V.noSumar;
  $("#empHipotesis").innerHTML = V.hipotesis.map(h => `
    <div class="row" style="gap:10px;align-items:flex-start">
      <span style="margin-top:2px">${ICON.check}</span>
      <span class="small" style="color:var(--ink-2)">${h}</span>
    </div>`).join("");
}

function renderAdopcion(){
  const A = DEMO.adopcion, E = DEMO.empresa;
  const W = 900, H = 260, pl = 46, pr = 18, pt = 18, pb = 36, maxY = 70;
  const iw = W - pl - pr, ih = H - pt - pb;
  const X = i => pl + (iw * i / (A.curva.length - 1));
  const Y = v => pt + ih - (v / maxY * ih);
  const pts = A.curva.map((d,i) => [X(i), Y(d.v)]);
  const line = pts.map((p,i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  $("#adopChart").innerHTML = `
    <defs><linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2C3E5D" stop-opacity=".14"/><stop offset="100%" stop-color="#2C3E5D" stop-opacity="0"/>
    </linearGradient></defs>
    ${[0,20,40,60].map(v => `<line class="grid-l" x1="${pl}" y1="${Y(v)}" x2="${W-pr}" y2="${Y(v)}"/>
      <text class="axis-t" x="${pl-10}" y="${Y(v)+4}" text-anchor="end">${v}%</text>`).join("")}
    <path class="area" d="${line} L${X(A.curva.length-1)} ${pt+ih} L${pl} ${pt+ih} Z"/>
    <path class="line" d="${line}"/>
    ${pts.map((p,i) => `<circle class="pt" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5"/>
      <text class="axis-t" x="${p[0].toFixed(1)}" y="${H-12}" text-anchor="middle">${A.curva[i].s}</text>`).join("")}
    <text class="lbl" x="${pts.at(-1)[0]}" y="${pts.at(-1)[1]-14}" text-anchor="end">${A.curva.at(-1).v}%</text>`;

  const bars = list => list.map(d => {
    const supp = d.n < E.umbralPrivacidad;
    return `<div class="hbar ${supp?"supp":""}">
      <span class="t">${d.t}${supp?"":` <span class="xsmall">(n=${d.n})</span>`}</span>
      <span class="track"><i data-w="${supp?0:d.pct}"></i></span>
      <span class="v">${supp?"—":d.pct+"%"}</span>
    </div>${supp?`<div class="xsmall" style="margin:-4px 0 6px">Oculto: grupo pequeño</div>`:""}`;
  }).join("");
  $("#usoCobertura").innerHTML = bars(A.porCobertura);
  $("#usoArea").innerHTML = bars(A.porArea);
  $("#umbralNota").textContent = DEMO.privacidad.umbralEjemplo;
}

/* ---------------- Privacidad ---------------- */
function renderPrivacidad(){
  const P = DEMO.privacidad;
  $("#privPrincipio").textContent = P.principio;
  $("#privNunca").innerHTML = P.nunca.map(t => `<div class="pitem"><span class="ic">${ICON.lock}</span><span>${t}</span></div>`).join("");
  $("#privSi").innerHTML = P.si.map(t => `<div class="pitem"><span class="ic">${ICON.share}</span><span>${t}</span></div>`).join("");
  $("#privEjemploTitulo").textContent = P.ejemplo.titulo;
  $("#umbralEjemplo").textContent = P.umbralEjemplo;
  $("#umbralCaveat").textContent = P.umbralCaveat;
  setPrivView(state.privView, true);
}

function setPrivView(v, silent){
  state.privView = v;
  $$("#privToggle button").forEach((b,i) => b.classList.toggle("on", (i===0) === (v==="colaborador")));
  const rows = DEMO.privacidad.ejemplo[v === "colaborador" ? "colaborador" : "rrhh"];
  $("#privEjemplo").innerHTML = rows.map(([k,val]) => `<div class="brk">
    <span class="k">${k}</span>
    <span class="v">${val === "No disponible" ? `<span class="masked">••••••••</span> <span class="xsmall">No disponible</span>` : val}</span>
  </div>`).join("") +
  `<p class="xsmall" style="margin-top:14px">${v==="colaborador"
    ? "Vista del colaborador y su grupo familiar. Solo ellos accederían a este nivel de detalle."
    : "Vista de Recursos Humanos. En el diseño propuesto, el registro individual no existe en la capa corporativa: solo alimenta totales agregados."}</p>`;
  if (!silent) toast(v === "colaborador" ? "Vista del colaborador" : "Vista de Recursos Humanos");
}

/* ---------------- Piloto ---------------- */
function renderPiloto(){
  $("#pilotoItems").innerHTML = DEMO.piloto.items.map(t => `
    <div class="row" style="align-items:flex-start;gap:12px">
      <span style="margin-top:2px">${ICON.check}</span>
      <div class="strong" style="font-size:15.5px">${t}</div>
    </div>`).join("");
  $("#pilotoCierre").textContent = DEMO.piloto.cierre;
}

/* ---------------- Estado del producto ---------------- */
function renderEstado(){
  const E = DEMO.estadoProducto;
  const col = (d, cls, tag) => `<div class="statecol ${cls}"><span class="tag ${tag}">${d.titulo}</span>
    <ul>${d.items.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
  $("#estadoCols").innerHTML =
    col(E.hoy, "now", "tag-ok") + col(E.piloto, "next", "tag-est") + col(E.no, "", "");
}

/* ---------------- Capas ---------------- */
const openPanel = () => { $("#panel").classList.add("show"); $("#overlay").classList.add("show"); };
const openModal = () => { $("#modal").classList.add("show"); $("#overlay").classList.add("show"); };
function closeAll(){ $("#panel").classList.remove("show"); $("#modal").classList.remove("show"); $("#overlay").classList.remove("show"); }

let toastT;
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------------- Modo presentador (oculto por defecto) ---------------- */
let presenterOn = false, t0 = null, tick = null;
function togglePresenter(){
  presenterOn = !presenterOn;
  $("#presenter").classList.toggle("show", presenterOn);
  $("#btnPresenter").classList.toggle("on", presenterOn);
  $("#timer").hidden = !presenterOn;
  if (presenterOn){ startTimer(); updatePresenter(); } else { clearInterval(tick); tick = null; }
}
function startTimer(){
  if (!t0) t0 = Date.now();
  clearInterval(tick);
  tick = setInterval(() => {
    const s = Math.floor((Date.now() - t0) / 1000);
    const txt = String(Math.floor(s/60)).padStart(2,"0") + ":" + String(s%60).padStart(2,"0");
    $("#timer").textContent = txt;
    const el = $("#presTime"); if (el) el.textContent = txt;
  }, 500);
}
function updatePresenter(){
  const g = DEMO.guion[current];
  if (!g){ $("#presNote").innerHTML = "—"; $("#presObj").innerHTML = ""; $("#presStep").textContent = ""; return; }
  $("#presNote").innerHTML = g.n;
  $("#presObj").innerHTML = g.o ? `<b>Objeción probable:</b> ${g.o}` : "";
  $("#presStep").textContent = `Paso ${state.gpStep+1}/${GP.length} · objetivo ${g.t}`;
}

/* ---------------- Reset ---------------- */
function resetDemo(){
  state = structuredClone(INITIAL);
  closeAll();
  t0 = null;
  if (presenterOn) startTimer(); else $("#timer").textContent = "00:00";
  go("cover");
  toast("Demo reiniciado");
}

/* ---------------- Teclado ---------------- */
document.addEventListener("keydown", e => {
  if (["INPUT","SELECT","TEXTAREA"].includes(e.target.tagName)) return;
  if (e.key === "Escape") return closeAll();
  if (e.key === "p" || e.key === "P") return togglePresenter();
  if (e.key === "r" || e.key === "R") return resetDemo();
  if (e.key === "ArrowRight") gpNext();
  if (e.key === "ArrowLeft")  gpPrev();
});

/* ---------------- Arranque ---------------- */
go("cover");
