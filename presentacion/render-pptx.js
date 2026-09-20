/* Renderiza la misma especificación a PowerPoint. */
const pptxgen = require('pptxgenjs');
const path = require('path');
const { SLIDES, SW, SH } = require('./deck.js');
const F = 'Inter';   // tipografía de marca; PowerPoint sustituye si no está instalada
const IMG = f => path.join(__dirname, 'img', f);

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Aplica tu Seguro';
pres.company = 'Aplica tu Seguro';
pres.title = 'Aplica tu Seguro — Presentación comercial';
pres.subject = 'Presentación comercial B2B2E · datos simulados';

for (const spec of SLIDES) {
  const s = pres.addSlide();
  if (spec.bg) s.background = { color: spec.bg };

  for (const el of spec.els) {
    if (el.t === 'image') {
      s.addImage({ path: IMG(el.src), x: el.x, y: el.y, w: el.w, h: el.h,
        sizing: { type: 'cover', w: el.w, h: el.h } });

    } else if (el.t === 'rect' || el.t === 'ellipse') {
      const o = { x: el.x, y: el.y, w: el.w, h: el.h,
        fill: { color: el.fill || 'FFFFFF', ...(el.alpha ? { transparency: el.alpha } : {}) },
        line: el.line
          ? { color: el.line, width: 1, ...(el.lineAlpha ? { transparency: el.lineAlpha } : {}) }
          : { width: 0 } };
      if (el.shadow)     o.shadow = { type:'outer', color:'0B1420', blur:22, offset:6, angle:90, opacity:0.30 };
      if (el.shadowSoft) o.shadow = { type:'outer', color:'0B1420', blur:18, offset:5, angle:90, opacity:0.12 };
      if (el.t === 'ellipse') s.addShape(pres.ShapeType.ellipse, o);
      else if (el.r) s.addShape(pres.ShapeType.roundRect, { ...o, rectRadius: el.r });
      else s.addShape(pres.ShapeType.rect, o);

    } else {
      const base = { isTextBox: true, x: el.x, y: el.y, w: el.w, h: el.h,
        fontFace: F, fontSize: el.size, color: el.color || '3F4A5C',
        bold: !!el.bold, align: el.align || 'left', valign: el.valign || 'top',
        margin: 0, lineSpacingMultiple: el.lh || 1.2 };
      if (el.cs) base.charSpacing = el.cs;
      if (el.link) base.hyperlink = { url: el.link };
      const content = Array.isArray(el.text)
        ? el.text.map((r, i, a) => ({ text: r.text,
            options: { bold: !!r.bold, color: r.color || el.color || '3F4A5C',
                       ...(i < a.length - 1 ? {} : {}) } }))
        : el.text;
      s.addText(content, base);
    }
  }
  if (spec.notes) s.addNotes(spec.notes);
}

pres.writeFile({ fileName: path.join(__dirname, 'Aplica-tu-Seguro-Presentacion-Comercial.pptx') })
  .then(f => console.log('PPTX:', f));
