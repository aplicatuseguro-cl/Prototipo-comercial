# Aplica tu Seguro · Presentación comercial

Nueve láminas en **formato vertical (10 × 13,333 pulgadas, proporción 3:4)** para
reuniones de venta y para enviar por correo. Mismo logo, paleta y tipografía que el
prototipo comercial.

## Entregables

| Archivo | Uso |
|---|---|
| `Aplica-tu-Seguro-Presentacion-Comercial-v2.pptx` | Editable en PowerPoint / Keynote / Google Slides |
| `Aplica-tu-Seguro-Presentacion-Comercial-v2.pdf` | Para adjuntar al correo (1,9 MB, enlaces y QR activos) |

La versión 1 fue retirada: contenía afirmaciones de resultado que no corresponden
a una propuesta en validación.

## El relato

| # | Lámina | Qué hace |
|---|---|---|
| 1 | Portada | Promesa de marca · propuesta en validación |
| 2 | El problema | María y sus cuatro coberturas, como caso ficticio |
| 3 | Fragmentación | Las coberturas de una familia se administran por separado |
| 4 | La solución | Qué es Aplica tu Seguro + el ejemplo ilustrativo de la resonancia |
| 5 | Valor esperado | Hipótesis por audiencia + bloque de transparencia |
| 6 | Privacidad | Qué no accede la empresa, qué podría recibir, y el mismo registro visto desde cada lado |
| 7 | El prototipo | Enlace y código QR al prototipo navegable |
| 8 | El piloto | 90 días, ocho componentes, sin precio y sin carta de intención |
| 9 | Cierre | La pregunta de cierre, la invitación y los datos de contacto |

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
python3 prep-fotos.py  # img/fotos/ → las franjas fotográficas de img/
node render-pptx.js    # → .pptx
node render-html.js    # → deck.html, .pdf y qa/*.png
```

`deck.js` es la única fuente de contenido y posiciones: ambos formatos salen de ahí, así que
un cambio de texto se hace una sola vez. Las coordenadas están en pulgadas sobre 10 × 13,333
(vertical). El alto de la lámina es la dimensión larga: al mover un bloque hay que revisar que
el pie de página siga cayendo alrededor de `y = 12,5`.

`node render-html.js --fallback` rinde la versión con la tipografía sustituida, para comprobar
que nada se desborda en un computador sin Inter.

## Imágenes

Las fotografías originales viven en `img/fotos/` y `prep-fotos.py` genera desde ahí los
archivos que usa el deck: recorta cada una al encuadre que le corresponde, con el punto
focal declarado en el script, y le baja saturación y contraste.

El tratamiento es uno solo, el helper `fondo()` de `deck.js`: **la fotografía ocupa la
lámina completa bajo un velo navy casi opaco**. La imagen queda como textura y el texto
blanco manda. La única excepción es la portada, donde la foto va en una franja horizontal
sobre fondo navy.

| Archivo | Lámina | Uso |
|---|---|---|
| `santiago.jpg` | 1 · Portada | Franja horizontal (excepción) |
| `atacama-fondo.jpg` | 2 · El problema | Fondo de lámina completa |
| `patagonia-fondo.jpg` | 4 · La solución | Fondo de lámina completa |
| `valdivia-fondo.jpg` | 8 · El piloto | Fondo de lámina completa |

Las láminas 3, 5, 6 y 7 no llevan fotografía: su contenido ya es denso y el aire les sienta
mejor. La 9 tampoco, y es deliberado: los datos de contacto tienen que leerse sin competencia.
Por eso `img/fotos/vina.jpg` se conserva como original pero hoy no se usa en ninguna lámina.

Si una fotografía se ve demasiado presente, subir el `alpha` de `fondo()` la aclara y bajarlo
la oscurece; el valor actual es 17 para las cuatro. Para cambiar una foto: dejar la nueva en
`img/fotos/` con el mismo nombre, ajustar su punto focal en `prep-fotos.py`, y volver a generar.

## Datos

Las cifras del ejemplo de la resonancia son **simuladas**, están marcadas como tales en la
lámina y coinciden con el prototipo: Centro A $30.000, Centro B $25.000 y Centro C $35.000.
La presentación no declara clientes, pilotos, resultados ni acuerdos existentes, y los
beneficios están redactados como hipótesis a validar, no como resultados medidos.
