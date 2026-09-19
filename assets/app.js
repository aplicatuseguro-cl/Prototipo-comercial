/* ==========================================================================
   Aplica tu Seguro — Prototipo de validación comercial
   Lógica de navegación, estado e interacciones. Sin backend. Sin red.
   ========================================================================== */

/* ---------------- Utilidades ---------------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => "$" + Math.round(n).toLocaleString("es-CL");
const ufFmt = n => Number(n).toFixed(2).replace(/0+$/,"").replace(/\.$/,"").replace(".", ",") + " UF";
const clp   = uf => money(uf * DEMO.uf);
const esc   = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

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
  deducibleUsadoUF: DEMO.beneficios[0].usadoUF,
  gastoConfirmado: false,
  chat: [],
  asked: [],
  privView: "colaborador",
  pilotoEnviado: false,
  prev: "cover"
};
let state = structuredClone(INITIAL);
let current = "cover";

/* ---------------- Navegación ---------------- */
const NAV = {
  col: { world:"col", label:"Colaborador",
    links:[["col-inicio","Inicio"],["col-coberturas","Mis coberturas"],["col-beneficios","Mis beneficios"],["col-asistente","Asistente"],["col-reembolsos","Reembolsos"]],
    switch:["cor-resumen","Ver experiencia Empresa"] },
  cor: { world:"cor", label:"Empresa",
    links:[["cor-resumen","Resumen"],["cor-adopcion","Adopción"],["cor-valor","Valor generado"],["cor-privacidad","Privacidad"],["cor-piloto","Piloto"]],
    switch:["col-inicio","Volver a la vista del colaborador"] }
};
const ORDER = ["cover","col-inicio","col-beneficios","col-asistente","col-reembolsos","col-anio",
               "cor-resumen","cor-adopcion","cor-valor","cor-privacidad","cor-piloto"];

function worldOf(id){
  if (id === "cover" || id === "estado") return null;
  return id.startsWith("cor-") ? "cor" : "col";
}

function go(id){
  if (!$("#" + id)) return;
  if (id !== current) state.prev = current;
  current = id;
  $$(".screen").forEach(s => s.classList.toggle("show", s.id === id));
  const w = worldOf(id);
  document.body.classList.toggle("world-corp", w === "cor");
  const nav = $("#appnav");
  if (w){ nav.hidden = false; buildNav(w, id); } else { nav.hidden = true; }
  $("#foot").hidden = (id === "cover");
  window.scrollTo(0, 0);
  onEnter(id);
  updatePresenter();
}
function goBack(){ go(state.prev || "cover"); }

function buildNav(w, id){
  const cfg = NAV[w];
  const who = $("#navWho");
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
  if (id === "col-inicio")      { renderFamily(); renderGraph(); }
  if (id === "col-coberturas")  renderCoberturas();
  if (id === "col-beneficios")  { renderBeneficios(); requestAnimationFrame(()=>setTimeout(fillBars,60)); }
  if (id === "col-asistente")   renderChat();
  if (id === "col-reembolsos")  renderReembolsos();
  if (id === "col-anio")        renderAnio();
  if (id === "cor-resumen")     renderResumen();
  if (id === "cor-adopcion")    { renderAdopcion(); requestAnimationFrame(()=>setTimeout(fillBars,60)); }
  if (id === "cor-valor")       renderValorEmpresa();
  if (id === "cor-privacidad")  renderPrivacidad();
  if (id === "cor-piloto")      renderPiloto();
  if (id === "estado")          renderEstado();
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
  const n = state.member === "familia" ? 4 : DEMO.familia.find(f=>f.id===state.member).coberturas.filter(c=>!DEMO.coberturas[c].sistema).length;
  const quien = state.member === "familia" ? "Tu familia tiene" : (state.member==="maria"?"Tú tienes":DEMO.familia.find(f=>f.id===state.member).nombre+" tiene");
  $("#covCountTxt").textContent = `${quien} ${n} coberturas de salud activas.`;
  $("#ufNote").textContent = DEMO.ufLabel;
  const h = new Date().getHours();
  $("#saludoEyebrow").textContent = "Resumen familiar";
  $("#col-inicio .h1").textContent = `${h<13?"Buenos días":h<20?"Buenas tardes":"Buenas noches"}, María.`;
}

function setMember(id){ state.member = id; renderFamily(); renderGraph(); }

const GRAPH_NODES = [
  { id:"isapre",         a:198, sub:"Contratada por ti" },
  { id:"fonasa",         a:126, sub:"Afiliación de Felipe" },
  { id:"complementario", a:-90, sub:"Financiado por tu empresa" },
  { id:"dental",         a:-18, sub:"Financiado por tu empresa" },
  { id:"accidentes",     a: 54, sub:"Financiado por tu empresa" }
];

function activeSet(){
  if (state.member === "familia"){
    const s = new Set();
    DEMO.familia.forEach(f => f.coberturas.forEach(c => s.add(c)));
    return s;
  }
  return new Set(DEMO.familia.find(f => f.id === state.member).coberturas);
}

function renderGraph(){
  const svg = $("#graph"), cx = 380, cy = 232, rx = 278, ry = 166, W = 168, H = 58;
  const act = activeSet(), sel = state.member !== "familia";
  const pos = {};
  GRAPH_NODES.forEach(n => {
    const r = n.a * Math.PI / 180;
    pos[n.id] = { x: cx + rx * Math.cos(r), y: cy + ry * Math.sin(r) };
  });

  const edges = GRAPH_NODES.map(n => {
    const p = pos[n.id], mx = (cx + p.x)/2, my = (cy + p.y)/2 + (p.y < cy ? 26 : -26);
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

  const sysY = 442;
  const sys = ["ges","caec"].map((k,i) => {
    const on = act.has(k), x = i === 0 ? 300 : 404, w = k === "ges" ? 56 : 66;
    return `<g class="sysnode ${sel && !on ? "dim" : ""}" onclick="openCobertura('${k}')" role="button" tabindex="0" style="cursor:pointer">
      <line x1="${x+w/2}" y1="${sysY-14}" x2="${cx}" y2="${cy+66}" stroke="#E6E9EF" stroke-width="1.2" stroke-dasharray="3 4"/>
      <rect x="${x}" y="${sysY-14}" width="${w}" height="25" rx="7"/>
      <text x="${x+w/2}" y="${sysY+3}" text-anchor="middle">${DEMO.coberturas[k].corto}</text></g>`;
  }).join("");

  let hubTop = "Familia", hubSub = "4 personas";
  if (sel){ const m = DEMO.familia.find(f=>f.id===state.member); hubTop = m.nombre; hubSub = m.sistema; }

  svg.innerHTML = `
    <circle class="hub-ring" cx="${cx}" cy="${cy}" r="86"/>
    ${edges}${sys}
    <circle class="hub-bg" cx="${cx}" cy="${cy}" r="64"/>
    <text class="hub-t" x="${cx}" y="${cy-3}" text-anchor="middle" font-size="18">${hubTop}</text>
    <text x="${cx}" y="${cy+17}" text-anchor="middle" font-size="11.5" fill="rgba(255,255,255,.62)">${hubSub}</text>
    ${nodes}`;
}

/* ---------------- Detalle de cobertura ---------------- */
function openCobertura(id){
  const c = DEMO.coberturas[id];
  $("#panelEyebrow").textContent = c.tipo;
  $("#panelTitle").textContent = c.nombre;
  const rows = (c.detalle || []).map(([k,v]) =>
    `<div class="brk"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  $("#panelBody").innerHTML = `
    <p class="lede" style="font-size:16px;margin:0 0 18px">${c.resumen}</p>
    <div class="card-quiet" style="margin-bottom:18px">
      <div class="eyebrow">Cubre a</div>
      <div style="margin-top:6px;font-weight:560">${c.quien}</div>
      ${c.origen ? `<div class="small" style="margin-top:8px">${c.origen}</div>` : ""}
    </div>
    ${rows ? `<div class="eyebrow" style="margin-bottom:6px">Condiciones</div>${rows}` : ""}
    <p class="xsmall" style="margin-top:20px">Condiciones referenciales simuladas para esta demostración.</p>`;
  openPanel();
}

function renderCoberturas(){
  const ids = ["isapre","fonasa","complementario","dental","accidentes","ges","caec"];
  $("#coberturasList").innerHTML = ids.map(id => {
    const c = DEMO.coberturas[id];
    return `<button class="card" style="text-align:left;display:block;width:100%" onclick="openCobertura('${id}')">
      <div class="row-between" style="align-items:flex-start">
        <div class="row" style="gap:12px">
          <span style="width:4px;height:36px;border-radius:3px;background:${c.color||"#9AA3B2"};display:block"></span>
          <div class="stack-6"><div class="h3">${c.nombre}</div><div class="small">${c.tipo}</div></div>
        </div>
        <span class="tag tag-sim">Simulado</span>
      </div>
      <p class="small" style="margin:14px 0 0;color:var(--ink-2)">${c.resumen}</p>
      <div class="small" style="margin-top:12px;color:var(--ink-4)">Cubre a: ${c.quien}</div>
    </button>`;
  }).join("");
}

/* ---------------- Mis beneficios ---------------- */
function renderBeneficios(){
  $("#polizaNote").textContent = `Vigencia de la póliza: ${DEMO.poliza.desde} – ${DEMO.poliza.hasta}`;
  const b = DEMO.beneficios[2];
  $("#alertOptica").innerHTML = `
    <div class="alertbox">
      <span class="ic">${ICON.alert}</span>
      <div>
        <div class="strong" style="margin-bottom:4px">${b.alertaTexto}</div>
        <div class="small" style="color:var(--ink-2)">
          Equivale a <b>${clp(b.topeUF)}</b>. La vigencia cierra el ${DEMO.poliza.hasta}: quedan <b>${DEMO.poliza.diasRestantes} días</b> y el beneficio no se acumula al período siguiente.
        </div>
      </div>
    </div>`;

  $("#benefitsList").innerHTML = DEMO.beneficios.map(b => {
    const usado = b.id === "deducible" ? state.deducibleUsadoUF : b.usadoUF;
    const pct   = Math.min(100, usado / b.topeUF * 100);
    const rest  = b.topeUF - usado;
    const done  = b.id === "deducible" && usado >= b.topeUF;
    const fill  = done ? "fill-green" : b.alerta ? "fill-empty" : "fill-navy";
    let msg;
    if (b.id === "deducible")
      msg = done
        ? `<span class="row" style="gap:8px;color:var(--green)">${ICON.check}<b>${DEMO.gasto.okTitulo}.</b></span><div class="small" style="margin-top:6px">${DEMO.gasto.okTexto}</div>`
        : `Te faltan <b>${ufFmt(rest)} (${clp(rest)})</b> en copagos para completar tu deducible.`;
    else if (b.alerta)
      msg = `Tienes <b>${ufFmt(rest)} (${clp(rest)})</b> disponibles y sin utilizar.`;
    else
      msg = `Te quedan <b>${ufFmt(rest)} (${clp(rest)})</b> disponibles en este período.`;

    return `<div class="benefit-card ${done?"is-done":b.alerta?"is-alert":""}">
      <div class="row-between" style="align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:12px">
        <div class="stack-6">
          <div class="row" style="gap:9px"><div class="h3">${b.titulo}</div>${done?'<span class="tag tag-ok">Completado</span>':b.alerta?'<span class="tag tag-warn">Por vencer</span>':""}</div>
          <div class="small">${b.cobertura}</div>
        </div>
        <div style="text-align:right">
          <div class="uf num">${ufFmt(usado)} <span style="color:var(--ink-4);font-weight:480">de ${ufFmt(b.topeUF)}</span>
            <small class="num">${money(usado*DEMO.uf)} de ${clp(b.topeUF)}</small></div>
        </div>
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
function renderChat(){
  const m = $("#msgs");
  if (!state.chat.length){
    m.innerHTML = aiBlock(`<p>Hola María. ${DEMO.agente.intro}</p>`);
  } else {
    m.innerHTML = state.chat.map(x => x.role === "me"
      ? `<div class="msg me">${x.text}</div>`
      : aiBlock(x.text)).join("");
  }
  renderSuggest();
}
const aiBlock = html => `<div class="msg ai"><div class="ai-head"><span class="ai-dot">${ICON.spark}</span><span class="ai-name">${DEMO.agente.nombre}</span></div><div class="ai-body">${html}</div></div>`;

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
  }, 900);
}

function comparadorHTML(){
  const C = DEMO.comparador, max = Math.max(...C.opciones.map(o => o.precio));
  const cards = C.opciones.map(o => {
    const w = p => (p / max * 100).toFixed(1) + "%";
    return `<div class="opt ${o.best?"best":""}" onclick="openGasto('${o.id}')">
      ${o.best?'<span class="flag">Menor gasto estimado</span>':""}
      <div class="stack-6">
        <div class="h3" style="font-size:16px;line-height:1.25">${o.nombre}</div>
        <div class="xsmall">${o.dist} · ${o.agenda}</div>
      </div>
      <div>
        <div class="xsmall" style="margin-bottom:5px">Tú pagas</div>
        <div class="pay num">${money(o.pago)}</div>
      </div>
      <div class="stackbar" title="Composición del precio">
        <i class="sb-isapre" style="width:${w(o.isapre)}"></i>
        <i class="sb-comp" style="width:${w(o.comp)}"></i>
        <i class="sb-pay" style="width:${w(o.pago)}"></i>
      </div>
      <div>
        <div class="brk"><span class="k">Precio prestador</span><span class="v num">${money(o.precio)}</span></div>
        <div class="brk"><span class="k"><i class="sb-isapre" style="background:#93AFD6"></i>Isapre</span><span class="v num">−${money(o.isapre)}</span></div>
        <div class="brk"><span class="k"><i style="background:#2C3E5D"></i>Complementario</span><span class="v num">−${money(o.comp)}</span></div>
      </div>
      <div class="xsmall">${o.convenio}</div>
      <button class="btn btn-ghost btn-s btn-block" onclick="event.stopPropagation();openGasto('${o.id}')">Elegir y registrar</button>
    </div>`;
  }).join("");

  return `<div style="margin-top:18px">
    <div class="row-between" style="margin-bottom:12px;flex-wrap:wrap;gap:10px">
      <div class="small"><b class="strong">${C.contexto}</b></div>
      <div class="row" style="gap:6px"><span class="tag tag-est">Estimación</span><span class="tag tag-sim">Prestadores ficticios</span></div>
    </div>
    <div class="compare">${cards}</div>
    <div class="row-between" style="margin-top:16px;flex-wrap:wrap;gap:12px">
      <button class="link" onclick="openFuentes()">¿Cómo llegamos a esta estimación? ${ICON.arrow}</button>
      <span class="xsmall">Los montos son estimaciones referenciales. El valor final lo determina el prestador y tu aseguradora.</span>
    </div>
  </div>`;
}

function openFuentes(){
  const C = DEMO.comparador;
  $("#panelEyebrow").textContent = "Trazabilidad de la estimación";
  $("#panelTitle").textContent = "¿Cómo llegamos a esta estimación?";
  $("#panelBody").innerHTML = `
    <div class="row" style="gap:6px;margin-bottom:18px"><span class="tag tag-est">Estimación</span><span class="tag tag-sim">Datos demo</span><span class="tag">Fuentes</span></div>
    <p class="small" style="color:var(--ink-2);margin:0 0 6px">Cuatro elementos entran en el cálculo:</p>
    ${C.fuentes.map(([t,d],i) => `<div class="srcitem"><span class="n">${i+1}</span>
      <div><div class="strong" style="font-size:14.5px">${t}</div><div class="small" style="margin-top:4px">${d}</div></div></div>`).join("")}
    <div class="card-quiet" style="margin-top:18px">
      <div class="eyebrow">Supuesto aplicado</div>
      <p class="small" style="margin:8px 0 0;color:var(--ink-2)">${C.supuesto}</p>
    </div>
    <div class="alertbox" style="margin-top:18px">
      <span class="ic">${ICON.alert}</span>
      <div class="small" style="color:var(--ink-2)">
        <b>En este prototipo estos datos son simulados.</b> En un producto operativo, el precio del prestador requiere convenio o fuente verificable, y la bonificación exacta la confirma cada aseguradora.
      </div>
    </div>`;
  openPanel();
}

/* ---------------- Registrar / confirmar gasto ---------------- */
function openGasto(optId){
  const o = DEMO.comparador.opciones.find(x => x.id === optId) || DEMO.comparador.opciones[1];
  const G = DEMO.gasto, rest = DEMO.beneficios[0].topeUF - state.deducibleUsadoUF;
  const completa = o.pago >= rest * DEMO.uf;
  $("#modalBody").innerHTML = `
    <div class="eyebrow">${G.titulo}</div>
    <h3 class="h2" style="margin:10px 0 6px">${o.nombre}</h3>
    <p class="small" style="margin:0 0 20px">${G.prestacion} · ${G.fecha}</p>
    <div style="margin-bottom:18px">
      <div class="brk"><span class="k">Precio atención</span><span class="v num">${money(o.precio)}</span></div>
      <div class="brk"><span class="k">Isapre</span><span class="v num">−${money(o.isapre)}</span></div>
      <div class="brk"><span class="k">Seguro complementario</span><span class="v num">−${money(o.comp)}</span></div>
      <div class="brk" style="padding-top:12px"><span class="k strong" style="color:var(--ink)">María paga</span><span class="v num" style="font-size:21px">${money(o.pago)}</span></div>
    </div>
    ${completa ? `<div class="card-quiet" style="margin-bottom:20px"><p class="small" style="margin:0;color:var(--ink-2)">
      Este copago se acumula a tu deducible anual. Te faltan <b>${clp(rest)}</b>: <b>este gasto lo completa</b>.</p></div>` : ""}
    <div class="row" style="gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="confirmGasto('${o.id}')">Confirmar gasto</button>
      <button class="btn btn-ghost" onclick="closeAll()">Cancelar</button>
    </div>
    <p class="xsmall" style="margin:16px 0 0">Interacción simulada. No se envía información a ningún servidor.</p>`;
  openModal();
}

function confirmGasto(optId){
  const o = DEMO.comparador.opciones.find(x => x.id === optId);
  state.deducibleUsadoUF = DEMO.beneficios[0].topeUF;
  state.gastoConfirmado = true;
  const G = DEMO.gasto;
  $("#modalBody").innerHTML = `
    <div class="center">
      <div style="width:56px;height:56px;border-radius:99px;background:var(--green-soft);display:flex;align-items:center;justify-content:center;margin:0 auto 18px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.2"><path d="M20 6.5 9.5 17 4 11.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h3 class="h2">${G.okTitulo}</h3>
      <p class="lede" style="font-size:16px;margin:12px 0 0">${G.okTexto}</p>
      <div class="card-quiet" style="margin:22px 0 0;text-align:left">
        <div class="row-between" style="margin-bottom:10px">
          <span class="small">Deducible anual</span>
          <span class="strong num">${ufFmt(3)} de ${ufFmt(3)} <span class="muted" style="font-weight:440">· ${clp(3)}</span></span>
        </div>
        <div class="bar bar-lg"><span class="fill-green" style="width:100%"></span></div>
      </div>
      <div class="row" style="gap:10px;justify-content:center;margin-top:24px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="closeAll();go('col-beneficios')">Ver mis beneficios ${ICON.arrow}</button>
        <button class="btn btn-ghost" onclick="closeAll()">Cerrar</button>
      </div>
      <p class="xsmall" style="margin:16px 0 0">Resultado ilustrativo · Datos simulados</p>
    </div>`;
  toast("Gasto registrado · Deducible anual completado");
}

/* ---------------- Reembolsos ---------------- */
function renderReembolsos(){
  const R = DEMO.reembolsos, p = R.pendiente;
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
      <div class="brk"><span class="k">Prestador</span><span class="v">${p.prestador}</span></div>
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
      <div style="margin-top:22px"><button class="btn btn-primary" onclick="openReembolso()">Ver cómo solicitarlo ${ICON.arrow}</button></div>
    </div>
    <div class="stack-16">
      <div class="card-flat">
        <div class="eyebrow">En evaluación</div>
        <div class="uf num" style="margin-top:10px">${money(R.enProceso.monto)}<small>${R.enProceso.prestacion}</small></div>
        <div class="small" style="margin-top:10px">${R.enProceso.estado} · ${R.enProceso.fecha}</div>
      </div>
      <div class="card-flat">
        <div class="eyebrow">Ya recuperado</div>
        <div class="uf num" style="margin-top:10px;color:var(--green)">${money(R.recuperado.monto)}<small>${R.recuperado.cantidad} reembolsos gestionados</small></div>
        <div class="small" style="margin-top:10px">${R.recuperado.periodo}</div>
      </div>
      <div class="card-quiet">
        <p class="small" style="margin:0;color:var(--ink-2)">
          <b class="strong">Por qué importa:</b> la mayoría de los reembolsos no se pierden por falta de cobertura, sino por documentación incompleta y plazos vencidos.
        </p>
      </div>
    </div>`;
}

function openReembolso(){
  const p = DEMO.reembolsos.pendiente;
  $("#panelEyebrow").textContent = "Reembolso pendiente";
  $("#panelTitle").textContent = `${money(p.monto)} por recuperar`;
  $("#panelBody").innerHTML = `
    <div class="alertbox" style="margin-bottom:20px">
      <span class="ic">${ICON.alert}</span>
      <div class="small" style="color:var(--ink-2)">Falta un documento: <b>orden médica</b>. Quedan <b>${p.plazo} días</b> de plazo para presentar la solicitud.</div>
    </div>
    <div class="eyebrow" style="margin-bottom:10px">Qué tienes que hacer</div>
    ${p.pasos.map((s,i) => `<div class="srcitem"><span class="n">${i+1}</span><div class="small" style="color:var(--ink-2)">${s}</div></div>`).join("")}
    <div style="margin-top:22px" class="stack-10">
      <button class="btn btn-primary btn-block" onclick="toast('Recordatorio programado · Interacción simulada')">Recordármelo en 3 días</button>
      <button class="btn btn-ghost btn-block" onclick="toast('Solicitud de documento enviada · Interacción simulada')">Pedir la orden médica al prestador</button>
    </div>
    <p class="xsmall" style="margin-top:18px">Interacciones simuladas. Este prototipo no envía información a terceros.</p>`;
  openPanel();
}

/* ---------------- Valor para María ---------------- */
function renderAnio(){
  const V = DEMO.valorMaria;
  $("#valorPrincipal").textContent = money(V.principal);
  $("#valorPrincipalLabel").textContent = V.principalLabel;
  $("#valorDesglose").innerHTML = `
    <div class="eyebrow">Cómo se compone</div>
    <div style="margin-top:14px">
      ${V.desglose.map(([k,v]) => `<div class="brk"><span class="k">${k}</span><span class="v num">${money(v)}</span></div>`).join("")}
      <div class="brk" style="padding-top:12px"><span class="k strong" style="color:var(--ink)">Total utilizado</span><span class="v num" style="font-size:18px">${money(V.principal)}</span></div>
    </div>
    <div class="hr" style="margin:20px 0"></div>
    <div class="row-between" style="flex-wrap:wrap;gap:12px">
      <div><div class="eyebrow">Además</div>
        <div class="uf num" style="margin-top:8px;color:var(--green)">${money(V.secundario)}<small>${V.secundarioLabel}</small></div></div>
      <span class="tag tag-est">Estimación ilustrativa</span>
    </div>`;
  $("#valorMetricas").innerHTML = V.metricas.map(([v,k]) =>
    `<div class="kpi kpi-accent"><div class="v num">${v}</div><div class="k">${k}</div></div>`).join("");
}

/* ---------------- Empresa ---------------- */
function renderResumen(){
  const E = DEMO.empresa;
  $("#empNombre").textContent = E.nombre;
  $("#empEtiqueta").textContent = E.etiqueta;
  $("#empPeriodo").textContent = E.periodo;
  $("#empKpis").innerHTML = [
    [E.elegibles, "Colaboradores elegibles", "Dotación incluida en el beneficio"],
    [E.activadas, "Cuentas activadas", "Colaboradores que completaron el onboarding"],
    [E.activacion + "%", "Activación", "Hipótesis de piloto, no resultado real"],
    [E.alcanzadas, "Personas alcanzadas", "Incluye al grupo familiar del colaborador"]
  ].map(([v,k,n]) => `<div class="kpi"><div class="v num">${v}</div><div class="k">${k}</div><div class="n">${n}</div></div>`).join("");
}

function renderAdopcion(){
  const A = DEMO.adopcion, E = DEMO.empresa;
  // Gráfico de activación
  const W = 900, H = 260, pl = 46, pr = 18, pt = 18, pb = 36, maxY = 70;
  const iw = W - pl - pr, ih = H - pt - pb;
  const X = i => pl + (iw * i / (A.curva.length - 1));
  const Y = v => pt + ih - (v / maxY * ih);
  const pts = A.curva.map((d,i) => [X(i), Y(d.v)]);
  const line = pts.map((p,i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = `${line} L${X(A.curva.length-1)} ${pt+ih} L${pl} ${pt+ih} Z`;
  $("#adopChart").innerHTML = `
    <defs><linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2C3E5D" stop-opacity=".14"/><stop offset="100%" stop-color="#2C3E5D" stop-opacity="0"/>
    </linearGradient></defs>
    ${[0,20,40,60].map(v => `<line class="grid-l" x1="${pl}" y1="${Y(v)}" x2="${W-pr}" y2="${Y(v)}"/>
      <text class="axis-t" x="${pl-10}" y="${Y(v)+4}" text-anchor="end">${v}%</text>`).join("")}
    <path class="area" d="${area}"/><path class="line" d="${line}"/>
    ${pts.map((p,i) => `<circle class="pt" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5"/>
      <text class="axis-t" x="${p[0].toFixed(1)}" y="${H-12}" text-anchor="middle">${A.curva[i].s}</text>`).join("")}
    <text class="lbl" x="${pts.at(-1)[0]}" y="${pts.at(-1)[1]-14}" text-anchor="end">${A.curva.at(-1).v}%</text>`;

  const bars = (list, showN) => list.map(d => {
    const supp = d.n < E.umbralPrivacidad;
    return `<div class="hbar ${supp?"supp":""}">
      <span class="t">${d.t}${showN&&!supp?` <span class="xsmall">(n=${d.n})</span>`:""}</span>
      <span class="track"><i data-w="${supp?0:d.pct}"></i></span>
      <span class="v">${supp?"—":d.pct+"%"}</span>
    </div>${supp?`<div class="xsmall" style="margin:-4px 0 6px">Oculto: el grupo tiene menos de ${E.umbralPrivacidad} personas</div>`:""}`;
  }).join("");
  $("#usoCobertura").innerHTML = bars(A.porCobertura, true);
  $("#usoArea").innerHTML = bars(A.porArea, true);
  $("#umbralNota").textContent = DEMO.privacidad.umbral;
}

function renderValorEmpresa(){
  $("#valorEmpresaKpis").innerHTML = DEMO.valorEmpresa.map(d =>
    `<div class="kpi kpi-accent"><div class="v num">${d.v}</div><div class="k">${d.k}</div><div class="n">${d.n}</div></div>`).join("");
}

/* ---------------- Privacidad ---------------- */
function renderPrivacidad(){
  const P = DEMO.privacidad;
  $("#privNunca").innerHTML = P.nunca.map(t =>
    `<div class="pitem"><span class="ic">${ICON.lock}</span><span>${t}</span></div>`).join("");
  $("#privSi").innerHTML = P.si.map(t =>
    `<div class="pitem"><span class="ic">${ICON.share}</span><span>${t}</span></div>`).join("");
  $("#umbralNota2").textContent = P.umbral;
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
    ? "Vista del colaborador y su grupo familiar. Solo ellos acceden a este nivel de detalle."
    : "Vista de Recursos Humanos. El registro individual no existe en la capa corporativa: solo alimenta totales agregados."}</p>`;
  if (!silent) toast(v === "colaborador" ? "Vista del colaborador" : "Vista de Recursos Humanos");
}

/* ---------------- Piloto ---------------- */
function renderPiloto(){
  $("#pilotoItems").innerHTML = DEMO.piloto.items.map(([t,d]) => `
    <div class="row" style="align-items:flex-start;gap:12px">
      <span style="margin-top:3px">${ICON.check}</span>
      <div class="stack-6"><div class="strong" style="font-size:15.5px">${t}</div><div class="small">${d}</div></div>
    </div>`).join("");
  $("#pilotoNota").textContent = DEMO.piloto.nota;

  if (state.pilotoEnviado){ pilotoOk(); return; }
  $("#pilotoForm").innerHTML = `
    <div class="eyebrow">Solicitar piloto</div>
    <p class="small" style="margin:10px 0 20px">Cuéntanos lo mínimo para preparar una propuesta de piloto a la medida.</p>
    <form class="stack-16" onsubmit="event.preventDefault();enviarPiloto()">
      <div class="field"><label for="f1">Nombre y cargo</label><input id="f1" required placeholder="Ej. Gerente de Personas"></div>
      <div class="field"><label for="f2">Empresa</label><input id="f2" required placeholder="Nombre de la empresa"></div>
      <div class="grid-2" style="gap:14px">
        <div class="field"><label for="f3">N° de colaboradores</label>
          <select id="f3"><option>30 – 80</option><option>81 – 200</option><option>201 – 500</option><option>Más de 500</option></select></div>
        <div class="field"><label for="f4">Mes de renovación de la póliza</label>
          <select id="f4"><option>No lo sé</option><option>Enero</option><option>Febrero</option><option>Marzo</option><option>Abril</option><option>Mayo</option><option>Junio</option><option>Julio</option><option>Agosto</option><option>Septiembre</option><option>Octubre</option><option>Noviembre</option><option>Diciembre</option></select></div>
      </div>
      <div class="field"><label for="f5">Corredor o aseguradora actual</label><input id="f5" placeholder="Opcional"></div>
      <button class="btn btn-primary btn-block" type="submit">Solicitar piloto</button>
      <p class="xsmall" style="margin:0">No se incluye precio en esta etapa: las condiciones se definen junto con el alcance del piloto.</p>
    </form>`;
}

function enviarPiloto(){ state.pilotoEnviado = true; pilotoOk(); toast("Solicitud registrada · Interacción simulada"); }

function pilotoOk(){
  $("#pilotoForm").innerHTML = `
    <div class="center" style="padding:20px 0">
      <div style="width:52px;height:52px;border-radius:99px;background:var(--green-soft);display:flex;align-items:center;justify-content:center;margin:0 auto 18px">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.2"><path d="M20 6.5 9.5 17 4 11.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h3 class="h3">Solicitud registrada</h3>
      <p class="small" style="margin:12px auto 0;max-width:320px">
        Prepararemos una propuesta de piloto con alcance, indicadores de éxito y condiciones, para revisarla en conjunto.
      </p>
      <p class="xsmall" style="margin:18px 0 0">Interacción simulada · Este prototipo no envía datos</p>
      <button class="btn btn-ghost btn-s" style="margin-top:18px" onclick="state.pilotoEnviado=false;renderPiloto()">Volver al formulario</button>
    </div>`;
}

/* ---------------- Estado del producto ---------------- */
function renderEstado(){
  const E = DEMO.estadoProducto;
  $("#estadoCols").innerHTML = `
    <div class="statecol now"><span class="tag tag-ok">Demostrable hoy</span><h3 class="h3" style="margin-top:14px">Lo que ya existe</h3><ul>${E.ahora.map(x=>`<li>${x}</li>`).join("")}</ul></div>
    <div class="statecol next"><span class="tag tag-est">En construcción</span><h3 class="h3" style="margin-top:14px">Lo que viene con el piloto</h3><ul>${E.construccion.map(x=>`<li>${x}</li>`).join("")}</ul></div>
    <div class="statecol"><span class="tag">Aún no existe</span><h3 class="h3" style="margin-top:14px">Lo que todavía no tenemos</h3><ul>${E.no.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
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

/* ---------------- Modo presentador ---------------- */
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
  const i = ORDER.indexOf(current);
  const secs = t => { const m = /^(\d+):(\d+)$/.exec(t || ""); return m ? +m[1]*60 + +m[2] : 0; };
  const acum = i >= 0 ? ORDER.slice(0, i+1).reduce((a,k) => a + secs(DEMO.guion[k]?.t), 0) : 0;
  const mmss = s => Math.floor(s/60) + ":" + String(s%60).padStart(2,"0");
  $("#presStep").textContent = i >= 0
    ? `Paso ${i+1}/${ORDER.length} · objetivo ${g.t} · acumulado ${mmss(acum)}`
    : `Objetivo ${g.t}`;
}

/* ---------------- Reset ---------------- */
function resetDemo(){
  state = structuredClone(INITIAL);
  closeAll();
  t0 = null;
  if (presenterOn) startTimer(); else { $("#timer").textContent = "00:00"; }
  go("cover");
  toast("Demo reiniciado");
}

/* ---------------- Teclado ---------------- */
document.addEventListener("keydown", e => {
  if (["INPUT","SELECT","TEXTAREA"].includes(e.target.tagName)) return;
  if (e.key === "Escape") return closeAll();
  if (e.key === "p" || e.key === "P") return togglePresenter();
  if (e.key === "r" || e.key === "R") return resetDemo();
  const i = ORDER.indexOf(current);
  if (e.key === "ArrowRight" && i > -1 && i < ORDER.length - 1) go(ORDER[i+1]);
  if (e.key === "ArrowLeft"  && i > 0) go(ORDER[i-1]);
});

/* ---------------- Arranque ---------------- */
go("cover");
