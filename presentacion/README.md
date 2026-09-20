# Aplica tu Seguro · Presentación comercial

Ocho slides para reuniones de venta y para enviar por correo.
Mismo logo, paleta y tipografía que el prototipo comercial.

## Entregables

| Archivo | Uso |
|---|---|
| `Aplica-tu-Seguro-Presentacion-Comercial.pptx` | Editable en PowerPoint / Keynote / Google Slides |
| `Aplica-tu-Seguro-Presentacion-Comercial.pdf` | Para adjuntar al correo (2,2 MB, enlaces activos) |

## El relato

| # | Slide | Qué hace |
|---|---|---|
| 1 | Portada | Promesa de marca |
| 2 | El problema | María y sus cuatro coberturas: el dolor con cara |
| 3 | Por qué pasa | La fragmentación, explicada en cuatro tarjetas |
| 4 | La solución | Qué es Aplica tu Seguro + el caso de la resonancia |
| 5 | Qué gana la empresa | Valor por audiencia + privacidad |
| 6 | El prototipo | Enlace y código QR al prototipo navegable |
| 7 | El piloto | 90 días, cuatro pasos, sin precio |
| 8 | Cierre | La pregunta de cierre y los datos de contacto |

Cada slide lleva **notas del presentador** con la intención y la objeción probable.

## Antes de enviarla por correo

1. **Abre el acceso al prototipo.** El enlace de la slide 6 es privado: desde el menú
   *Share* del artifact hay que dar acceso, o el destinatario verá una pantalla de acceso denegado.
2. **Tipografía.** Las slides declaran **Inter**, la misma del prototipo. Si el computador no
   la tiene instalada, PowerPoint sustituye por Arial y el diseño se mantiene: está verificado,
   no se desborda ningún texto. Para que calce exacto, Inter es gratuita en Google Fonts.

## Cómo se genera

```bash
npm install            # pptxgenjs
node render-pptx.js    # → .pptx
node render-html.js    # → deck.html, .pdf y qa/*.png
```

`deck.js` es la única fuente de contenido y posiciones: ambos formatos salen de ahí, así que
un cambio de texto se hace una sola vez. Las coordenadas están en pulgadas sobre 13,333 × 7,5.

`node render-html.js --fallback` rinde la versión con la tipografía sustituida, para comprobar
que nada se desborda en un computador sin Inter.

## Imágenes

Los paisajes de `img/` son **ilustraciones originales generadas por código**
(`gen_paisajes.py` → SVG → PNG): Torres del Paine, desierto de Atacama, altiplano,
costa del Pacífico y fiordos patagónicos. No son fotografías y no tienen restricción
de licencia. Para reemplazarlas por fotos reales basta sobrescribir el PNG del mismo
nombre y volver a generar.

## Datos

Las cifras del ejemplo de la resonancia son **simuladas** y están marcadas como tales en la
slide. La presentación no declara clientes, pilotos, resultados ni acuerdos existentes.
