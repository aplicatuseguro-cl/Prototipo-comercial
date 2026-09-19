# Aplica tu Seguro · Prototipo de validación comercial

Prototipo navegable para reuniones comerciales B2B2E en Chile.
**Datos 100% simulados.** No es un MVP productivo ni un sistema en producción.

---

## Cómo usarlo

Abre `index.html` en cualquier navegador. No requiere servidor, build ni conexión a internet
(la tipografía está autoalojada en `assets/fonts/`).

### Atajos de teclado

| Tecla | Acción |
|---|---|
| `→` / `←` | Avanzar / retroceder en el recorrido de la demo |
| `P` | Modo presentador (notas de guion, objeción probable, cronómetro) |
| `R` | Reiniciar el demo al estado inicial |
| `Esc` | Cerrar paneles y modales |

> El modo presentador se ve en pantalla. Úsalo para ensayar; desactívalo antes de compartir pantalla.

---

## Recorrido de la demo · 7:05 objetivo

| # | Pantalla | Objetivo | Hipótesis comercial |
|---|---|---|---|
| 1 | Portada | 0:20 | — |
| 2 | Inicio · Coverage Graph | 0:45 | H1 · ¿La fragmentación de coberturas es un dolor reconocido? |
| 3 | Mis beneficios | 0:45 | H2 · ¿La pérdida de beneficios pagados tiene costo atribuible? |
| 4 | Asistente · comparador · gasto | 1:30 | H2 · ¿El ahorro de bolsillo genera interés? |
| 5 | Reembolsos | 0:35 | H2 · ¿Existe dolor por beneficios no recuperados? |
| 6 | Mi año | 0:25 | Transición a la experiencia Empresa |
| 7 | Empresa · Resumen | 0:35 | H3 · ¿RR.HH. necesita demostrar utilización? |
| 8 | Empresa · Adopción | 0:30 | H3 · + prueba de privacidad (umbral n<7) |
| 9 | Empresa · Valor generado | 0:35 | H3 · ¿Valora el ROI del gasto que ya hace? |
| 10 | Empresa · Privacidad | 0:35 | H4 · ¿La privacidad es objeción bloqueante? |
| 11 | Empresa · Piloto | 0:30 | H5 · ¿Existe intención real de probar? |

Pantallas fuera del recorrido, disponibles para manejo de objeciones:
**Mis coberturas** ("¿cómo saben qué tiene cada uno?") y **Qué es real hoy** (madurez del producto).

**Pregunta de cierre:** *"¿Tendría sentido probar algo así con un grupo de sus colaboradores?"*

---

## Editar el contenido

Todo el contenido vive en **`assets/data.js`**: familia, coberturas, topes en UF, respuestas del
asistente, prestadores del comparador, métricas de empresa, textos de privacidad, alcance del
piloto y notas del modo presentador. Se puede editar sin tocar la lógica.

Al cambiar montos, mantén la coherencia aritmética:

- Deducible: `usadoUF + restante = topeUF`, y el copago del prestador elegido debe cubrir el restante.
- Empresa: `activadas / elegibles = activación`; `alcanzadas ≈ activadas × 2,4`.
- Cualquier grupo con `n < 7` se oculta automáticamente en el dashboard corporativo.

Valor UF referencial del demo: **$39.850** (`DEMO.uf`).

---

## Estructura

```
index.html              13 pantallas
assets/styles.css       sistema visual
assets/app.js           navegación, estado e interacciones
assets/data.js          contenido y datos simulados  ← editar aquí
assets/logo.svg         logo
assets/fonts/           Inter autoalojada (funciona sin internet)
```

---

## Transparencia

- María González, su familia, Andes Logística SpA y los prestadores son **ficticios**.
- Todas las cifras son **ilustrativas** y no representan clientes, pilotos ni resultados.
- No hay integraciones, backend, autenticación ni envío de datos: ningún formulario sale del navegador.
- El sello *Demo comercial · Datos simulados* está presente en todas las pantallas.
