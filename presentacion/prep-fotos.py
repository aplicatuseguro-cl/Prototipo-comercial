#!/usr/bin/env python3
"""Prepara las fotografías de la presentación.

De cada original en `img/fotos/` recorta la franja horizontal que usa el deck,
con el encuadre vertical definido aquí, y la deja atenuada para que acompañe
al texto sin competir con él.

    python3 prep-fotos.py

Las proporciones (`aspect`) deben coincidir con las franjas declaradas en
`deck.js`; los `centro` son el punto focal del recorte (0 = arriba / izquierda,
1 = abajo / derecha).
"""
import os
from PIL import Image, ImageEnhance

BASE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(BASE, 'img', 'fotos')
OUT  = os.path.join(BASE, 'img')

# Todos los originales traen un velo rojizo en el borde izquierdo: se recorta.
TRIM_IZQ = 0.022

FOTOS = [
    # origen           salida              proporción     centro v.  centro h.  saturación
    ('santiago.jpg',  'santiago.jpg',      10 / 4.80,     0.46,      0.50,      0.70),
    ('atacama.jpg',   'atacama.jpg',       10 / 3.00,     0.45,      0.50,      0.68),
    ('valdivia.jpg',  'valdivia.jpg',      10 / 3.20,     0.48,      0.50,      0.68),
    ('vina.jpg',      'vina.jpg',          10 / 4.60,     0.45,      0.50,      0.70),
    # fondo de lámina completa: se usa muy atenuado, como textura
    ('patagonia.jpg', 'patagonia-fondo.jpg', 10 / 13.333, 0.42,      0.62,      0.66),
]

def recorte(im, aspect, anchor_v, anchor_h):
    W, H = im.size
    izq = int(W * TRIM_IZQ)
    disp = W - izq
    alto = min(H, int(round(disp / aspect)))
    ancho = int(round(alto * aspect))
    x0 = izq + int(round(disp * anchor_h - ancho / 2))
    x0 = max(izq, min(W - ancho, x0))
    y0 = int(round(H * anchor_v - alto / 2))
    y0 = max(0, min(H - alto, y0))
    return im.crop((x0, y0, x0 + ancho, y0 + alto))

for origen, salida, aspect, anchor_v, anchor_h, sat in FOTOS:
    im = Image.open(os.path.join(SRC, origen)).convert('RGB')
    im = recorte(im, aspect, anchor_v, anchor_h)
    if aspect < 1:                      # el fondo vertical se amplía para no quedar blando
        im = im.resize((int(im.size[0] * 1.5), int(im.size[1] * 1.5)), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(0.96)
    destino = os.path.join(OUT, salida)
    im.save(destino, 'JPEG', quality=86, optimize=True, progressive=True)
    print(f'{salida:22} {im.size[0]}x{im.size[1]}  {os.path.getsize(destino)//1024} KB')
