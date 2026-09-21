/* Renderiza la especificación a HTML y de ahí a PDF + PNG con Chromium. */
const fs = require('fs'), path = require('path');
const { SLIDES, SW, SH } = require('./deck.js');

const FORCE_FALLBACK = process.argv.includes('--fallback');
const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const rgba = (hex, alphaPct=0) => {
  const n = parseInt(hex,16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${(100-(alphaPct||0))/100})`;
};

function runs(el){
  const list = Array.isArray(el.text) ? el.text : [{ text: el.text }];
  return list.map(r => {
    const st = [];
    if (r.bold) st.push('font-weight:700');
    if (r.color) st.push(`color:${rgba(r.color)}`);
    return `<span style="${st.join(';')}">${esc(r.text).replace(/\n/g,'<br>')}</span>`;
  }).join('');
}

function element(el){
  const pos = `left:${el.x}in;top:${el.y}in;width:${el.w}in;height:${el.h}in`;
  if (el.t === 'image')
    return `<img src="img/${el.src}" style="position:absolute;${pos};object-fit:cover">`;
  if (el.t === 'rect' || el.t === 'ellipse'){
    const st = [pos, `background:${rgba(el.fill||'FFFFFF', el.alpha)}`];
    st.push(el.t === 'ellipse' ? 'border-radius:50%' : `border-radius:${el.r||0}in`);
    if (el.line) st.push(`border:1px solid ${rgba(el.line, el.lineAlpha)}`, 'box-sizing:border-box');
    if (el.shadow) st.push('box-shadow:0 8px 26px rgba(11,20,32,.30)');
    if (el.shadowSoft) st.push('box-shadow:0 6px 20px rgba(11,20,32,.12)');
    return `<div style="position:absolute;${st.join(';')}"></div>`;
  }
  const st = [pos, 'position:absolute', 'display:flex', 'flex-direction:column',
    `justify-content:${el.valign === 'middle' ? 'center' : 'flex-start'}`,
    `font-size:${el.size}pt`, `line-height:${el.lh || 1.2}`,
    `color:${rgba(el.color || '3F4A5C')}`,
    `text-align:${el.align || 'left'}`];
  if (el.bold) st.push('font-weight:700');
  if (el.cs) st.push(`letter-spacing:${el.cs}pt`);
  const inner = `<div>${runs(el)}</div>`;
  const content = el.link
    ? `<a href="${el.link}" style="color:inherit;text-decoration:none">${inner}</a>` : inner;
  return `<div style="${st.join(';')}">${content}</div>`;
}

const fontFace = FORCE_FALLBACK ? '' : `
@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;
  src:url('../assets/fonts/inter-latin.woff2') format('woff2');
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;
  src:url('../assets/fonts/inter-latin-ext.woff2') format('woff2');
  unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;}`;

const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>
${fontFace}
@page{size:${SW}in ${SH}in;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff}
.slide{position:relative;width:${SW}in;height:${SH}in;overflow:hidden;background:#fff;
  font-family:${FORCE_FALLBACK?'':"'Inter',"}Arial,Helvetica,sans-serif;
  -webkit-font-smoothing:antialiased;page-break-after:always;break-after:page}
.slide:last-child{page-break-after:auto;break-after:auto}
img{display:block}
</style></head><body>
${SLIDES.map(s => `<section class="slide" style="background:${rgba(s.bg||'FFFFFF')}">${s.els.map(element).join('')}</section>`).join('\n')}
</body></html>`;

const out = FORCE_FALLBACK ? 'deck-fallback.html' : 'deck.html';
fs.writeFileSync(path.join(__dirname, out), html);
console.log('HTML:', out);

(async () => {
  const { chromium } = require('playwright-core');
  // Chromium preinstalado en el entorno; si no está, playwright usa el suyo.
  const bundled = (fs.globSync
    ? fs.globSync('/opt/pw-browsers/chromium-*/chrome-linux/chrome')
    : []).sort().pop();
  const b = await chromium.launch({
    ...(bundled ? { executablePath: bundled } : {}), args:['--no-sandbox'] });
  const p = await b.newPage({ viewport:{ width: Math.round(SW*96), height: Math.round(SH*96) } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(__dirname, out), { waitUntil:'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);

  if (!FORCE_FALLBACK) {
    await p.pdf({ path: path.join(__dirname, 'Aplica-tu-Seguro-Presentacion-Comercial-v2.pdf'),
      width: `${SW}in`, height: `${SH}in`, printBackground: true, preferCSSPageSize: true });
    console.log('PDF creado');
  }
  const dir = path.join(__dirname, FORCE_FALLBACK ? 'qa-fallback' : 'qa');
  fs.mkdirSync(dir, { recursive: true });
  const slides = await p.$$('.slide');
  for (let i = 0; i < slides.length; i++)
    await slides[i].screenshot({ path: path.join(dir, `s${i+1}.png`) });
  console.log('PNG de QA:', slides.length, '·', errs.length ? errs.join('|') : 'sin errores');
  await b.close();
})();
