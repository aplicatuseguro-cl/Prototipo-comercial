# -*- coding: utf-8 -*-
"""Ilustraciones de paisajes chilenos en la paleta de Aplica tu Seguro.
Formas originales y estilizadas; ninguna fotografía ni obra de terceros."""
import os

W, H = 2400, 1350
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "img")
X0, X1 = -60, W + 60   # las capas sobrepasan el borde: nada de cantos rectos

def jag(pts, base):
    """Cresta angulosa cerrada hacia abajo."""
    d = "M " + " L ".join(f"{x:.0f} {y:.0f}" for x, y in pts)
    return d + f" L {pts[-1][0]:.0f} {base} L {pts[0][0]:.0f} {base} Z"

def soft(pts, base):
    """Cresta suave (béziers cuadráticas) cerrada hacia abajo."""
    d = f"M {pts[0][0]:.0f} {pts[0][1]:.0f}"
    for i in range(1, len(pts)):
        (x0, y0), (x1, y1) = pts[i-1], pts[i]
        d += f" Q {(x0+x1)/2:.0f} {y0:.0f} {x1:.0f} {y1:.0f}"
    return d + f" L {pts[-1][0]:.0f} {base} L {pts[0][0]:.0f} {base} Z"

def defs_common(sky_stops, glow=("50%", "62%", "#7E9CC9", 0.22)):
    gx, gy, gc, go = glow
    stops = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in sky_stops)
    return (f'<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">{stops}</linearGradient>'
            f'<radialGradient id="glow" cx="{gx}" cy="{gy}" r="58%">'
            f'<stop offset="0" stop-color="{gc}" stop-opacity="{go}"/>'
            f'<stop offset="1" stop-color="{gc}" stop-opacity="0"/></radialGradient>'
            f'<linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="#C6D7F2" stop-opacity="0"/>'
            f'<stop offset="0.45" stop-color="#C6D7F2" stop-opacity="0.30"/>'
            f'<stop offset="1" stop-color="#C6D7F2" stop-opacity="0"/></linearGradient>')

def mist(y, h=260):
    return f'<rect x="0" y="{y-h/2:.0f}" width="{W}" height="{h}" fill="url(#mist)"/>'

def water(top, deep, sheen, lines=7):
    b = [f'<rect x="0" y="{top}" width="{W}" height="{H-top}" fill="{deep}"/>',
         f'<rect x="0" y="{top}" width="{W}" height="200" fill="{sheen}" opacity="0.40"/>']
    for i in range(lines):
        y = top + 40 + i * ((H - top - 40) / lines)
        x = -200 + 170 * (i % 3)
        w = W * (0.55 + 0.12 * (i % 4))
        b.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="2" rx="1" '
                 f'fill="#9DB6DC" opacity="{max(0.03, 0.15 - i*0.018):.3f}"/>')
    return "".join(b)

def wrap(defs, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
            f'viewBox="0 0 {W} {H}"><defs>{defs}</defs>'
            f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
            f'<rect width="{W}" height="{H}" fill="url(#glow)"/>{body}</svg>')

# ------------------------------------------------- 1 · Torres del Paine (oscuro)
def torres():
    d = defs_common([("0","#0C1727"),("0.46","#1A2B46"),("1","#2C4266")], ("62%","64%","#7E9CC9",0.20))
    b = []
    b.append(f'<path d="{jag([(X0,800),(260,700),(470,760),(700,668),(930,742),(1180,660),(1450,736),(1720,664),(1990,744),(X1,700)],1000)}" fill="#3A557E" opacity="0.45"/>')
    b.append(mist(770, 300))
    b.append(f'<path d="{jag([(X0,900),(300,790),(520,846),(760,700),(900,780),(1060,742),(1240,800),(1500,720),(1760,806),(2060,740),(X1,800)],1000)}" fill="#2B4166" opacity="0.75"/>')
    b.append(mist(860, 240))
    # macizo con las tres torres
    torres_pts = [(X0,905),(240,858),(520,800),(700,700),(840,780),(960,690),(1046,742),
                  (1096,436),(1146,742),(1196,362),(1248,742),(1296,418),(1352,742),
                  (1520,650),(1700,742),(1930,690),(2160,748),(X1,712)]
    b.append(f'<path d="{jag(torres_pts,1000)}" fill="#1F3255"/>')
    for cx, cy in [(1096,436),(1196,362),(1296,418)]:
        b.append(f'<path d="M {cx} {cy} L {cx+22} {cy+62} L {cx+6} {cy+74} L {cx-12} {cy+60} Z" fill="#D9E5F8" opacity="0.42"/>')
    b.append(mist(900, 200))
    b.append(water(905, "#151F33", "#2C4266"))
    return wrap(d, "".join(b))

# ---------------------------------------------- 2 · Desierto de Atacama (medio)
def atacama():
    d = defs_common([("0","#18293F"),("0.5","#2E4569"),("1","#4E6A94")], ("30%","58%","#93AFD6",0.24))
    b = []
    b.append(f'<path d="{jag([(X0,700),(260,626),(430,672),(640,596),(880,664),(1120,600),(1380,668),(1640,608),(1900,660),(2160,616),(X1,668)],1400)}" fill="#3C577F" opacity="0.40"/>')
    b.append(mist(680, 300))
    b.append(f'<path d="{soft([(X0,842),(360,776),(720,838),(1080,772),(1460,840),(1840,782),(X1,846)],1400)}" fill="#334D75" opacity="0.72"/>')
    b.append(mist(830, 260))
    b.append(f'<path d="{soft([(X0,990),(420,918),(860,986),(1300,906),(1740,982),(2120,930),(X1,984)],1400)}" fill="#294066"/>')
    b.append(f'<path d="M 420 918 Q 640 962 1300 906" fill="none" stroke="#A9C0E2" stroke-width="3" opacity="0.20"/>')
    b.append(f'<path d="{soft([(X0,1170),(520,1092),(1020,1166),(1520,1076),(2020,1160),(X1,1112)],1400)}" fill="#1F3253"/>')
    b.append(f'<path d="M -60 1170 Q 520 1104 1020 1166" fill="none" stroke="#A9C0E2" stroke-width="3" opacity="0.14"/>')
    return wrap(d, "".join(b))

# ------------------------------------------- 3 · Costa del Pacífico (oscuro)
def costa():
    d = defs_common([("0","#0D192C"),("0.5","#1C2E4B"),("1","#334C72")], ("68%","56%","#7E9CC9",0.20))
    b = []
    # acantilado lejano
    b.append(f'<path d="{jag([(X0,690),(300,636),(620,676),(900,650),(1150,684),(X1,700)],900)}" fill="#2A4066" opacity="0.42"/>')
    b.append(mist(700, 260))
    b.append(water(740, "#16253C", "#33507C", 6))
    # farallones: formaciones de roca emergiendo del mar
    def stack(cx, base, h, w, tilt=0.0, fill="#101B2E"):
        hw = w/2
        return (f'<path d="M {cx-hw:.0f} {base:.0f} '
                f'L {cx-hw*0.78+tilt*0.4:.0f} {base-h*0.55:.0f} '
                f'L {cx-hw*0.52+tilt*0.7:.0f} {base-h*0.84:.0f} '
                f'L {cx-hw*0.10+tilt:.0f} {base-h:.0f} '
                f'L {cx+hw*0.34+tilt*0.9:.0f} {base-h*0.90:.0f} '
                f'L {cx+hw*0.66+tilt*0.5:.0f} {base-h*0.58:.0f} '
                f'L {cx+hw:.0f} {base:.0f} Z" fill="{fill}"/>')
    b.append(stack(1980, 880, 250, 300, -18, "#1A2B45"))
    b.append(stack(1640, 900, 330, 250, 14, "#152337"))
    b.append(stack(560, 918, 286, 330, 22, "#16243A"))
    b.append(stack(935, 946, 420, 300, -26, "#0F1A2D"))
    b.append(stack(1265, 934, 250, 210, 10, "#121E33"))
    # espuma en la base de los farallones
    for cx, w in [(560,330),(935,300),(1265,210),(1640,250),(1980,300)]:
        b.append(f'<ellipse cx="{cx}" cy="{946 if cx==935 else 926}" rx="{w*0.75:.0f}" ry="14" fill="#9DB6DC" opacity="0.13"/>')
    # rompiente en primer plano
    b.append(f'<path d="{soft([(X0,1128),(500,1104),(1080,1124),(1700,1100),(X1,1120)],1400)}" fill="#101B2E" opacity="0.85"/>')
    b.append(f'<path d="M -60 1128 Q 500 1096 1080 1124" fill="none" stroke="#9DB6DC" stroke-width="3" opacity="0.16"/>')
    return wrap(d, "".join(b))

# ------------------------------------------------ 4 · Altiplano / volcán (oscuro)
def altiplano():
    d = defs_common([("0","#0F1B2F"),("0.5","#1F3350"),("1","#375078")], ("50%","56%","#7E9CC9",0.22))
    b = []
    b.append(f'<path d="{jag([(X0,786),(380,724),(760,772),(1140,718),(1520,768),(1900,716),(X1,770)],1400)}" fill="#3A547C" opacity="0.38"/>')
    b.append(mist(770, 280))
    b.append(f'<path d="{jag([(X0,880),(1180,346),(X1,880)],1400)}" fill="#22375B"/>')
    nieve = ("M 1180 346 L 1624 520 L 1556 494 L 1494 530 L 1424 498 L 1356 534 "
             "L 1286 500 L 1218 538 L 1148 504 L 1078 540 L 1008 506 L 938 536 "
             "L 866 502 L 776 520 Z")
    b.append(f'<path d="{nieve}" fill="#DEE9FA" opacity="0.42"/>')
    b.append(f'<path d="{jag([(1660,880),(2040,614),(X1,880)],1400)}" fill="#1E3150" opacity="0.92"/>')
    b.append(mist(866, 200))
    b.append(water(906, "#131F34", "#22375B", 6))
    b.append(f'<path d="{jag([(880,906),(1180,1046),(1480,906)],906)}" fill="#22375B" opacity="0.20"/>')
    return wrap(d, "".join(b))

# --------------------------------------- 5 · Fiordos / Patagonia norte (claro)
def fiordos():
    d = defs_common([("0","#E2EAF8"),("0.55","#C2D2EC"),("1","#A6BCDE")], ("50%","62%","#FFFFFF",0.42))
    b = []
    for pts, color, op in [
        ([(X0,628),(180,572),(390,606),(560,520),(760,596),(1010,548),(1180,600),
          (1420,512),(1600,584),(1840,540),(2080,598),(X1,556)], "#93ACD2", 0.46),
        ([(X0,742),(240,676),(470,724),(700,630),(880,700),(1090,656),(1330,714),
          (1540,622),(1790,702),(2060,650),(X1,712)], "#7694C1", 0.62),
        ([(X0,872),(300,794),(560,850),(820,760),(1080,838),(1290,782),(1560,856),
          (1830,764),(2110,844),(X1,796)], "#5878A5", 0.80),
        ([(X0,1012),(340,920),(640,996),(940,886),(1220,976),(1500,902),(1780,990),
          (2080,918),(X1,984)], "#3D5C88", 1.0)]:
        b.append(f'<path d="{jag(pts,1200)}" fill="{color}" opacity="{op}"/>')
        b.append(mist(pts[1][1] + 70, 230))
    b.append(water(1062, "#2E4770", "#4E6A94", 5))
    return wrap(d, "".join(b))

for name, fn in [("torres", torres), ("atacama", atacama), ("costa", costa),
                 ("altiplano", altiplano), ("fiordos", fiordos)]:
    open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8").write(fn())
print("5 paisajes regenerados")
