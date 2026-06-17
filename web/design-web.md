# Design Brief — Web Pública CEPA (Versión Mejorada)

> **Estilo:** Fintech limpio — moderno, claro, app-like.
> **Para:** Claude Design / generación de UI
> **Proyecto:** Rediseño del sitio público del Centro de Padres y Apoderados (CEPA) — Colegio Compañía de María Apoquindo
> **Modo:** Réplica mejorada (misma estructura informativa, diseño y UX renovados)
> **Sitio original de referencia:** https://www.cepaciamaria.cl/
> **Documento hermano:** `design-plataforma.md` (panel de pagos + admin) — comparte el mismo design system.

---

## 1. Contexto y objetivo

El CEPA es el Centro de Padres y Apoderados de un colegio católico (Compañía de María, congregación de Santa Juana de Lestonnac). Su sitio actual concentra información institucional, noticias y actividades, y deriva los pagos a Web Pay/transferencia de forma dispersa.

**Objetivo del rediseño:**

1. Imagen moderna, limpia y confiable, con mucho aire — sensación de producto digital cuidado, no de sitio institucional cargado.
2. Ordenar la información del navbar en una arquitectura clara y navegable.
3. Convertir el pago de cuotas en una acción **central y visible** (CTA verde que conecta con la plataforma descrita en `design-plataforma.md`).
4. Transmitir confianza y transparencia ("Juntos Somos Comunidad") con un lenguaje visual fresco.

**Público:** padres, madres y apoderados (30–60 años), uso mayoritariamente mobile. Prioridad: claridad, legibilidad y facilidad para pagar.

---

## 2. Dirección visual: Fintech limpio

Estética de app de pagos moderna: blanco amplio, jerarquía clara, tarjetas limpias con bordes suaves, azul de confianza y verde de acción. Sin gradientes recargados, sin texturas, sin serif tradicional. Referencias de tono: dashboards de fintech y banca digital actual, interfaces tipo Stripe/Mercado Pago/Tenpo — limpias y directas.

### 2.1 Paleta de color (design tokens)

```css
:root {
  /* Marca — azul confianza */
  --color-primary:        #185FA5;   /* azul — navbar, links, títulos clave */
  --color-primary-700:    #0C447C;
  --color-primary-500:    #378ADD;   /* azul medio, acentos */
  --color-primary-100:    #E6F1FB;   /* fondos suaves, chips */

  /* Acción de pago — verde (botón "Pagar", confirmar) */
  --color-pay:            #1D9E75;   /* teal-verde confianza */
  --color-pay-600:        #0F6E56;

  /* Acento secundario opcional — teal claro para detalles */
  --color-accent:         #1D9E75;
  --color-accent-100:     #E1F5EE;

  /* Neutros (mucho blanco y grises suaves) */
  --color-ink:            #16202B;   /* texto principal */
  --color-muted:          #5B6472;   /* texto secundario */
  --color-line:           #E8EBF0;   /* bordes/divisores finos */
  --color-bg:             #FFFFFF;
  --color-bg-soft:        #F7F9FC;   /* secciones alternas / surfaces */

  /* Estados de pago (idénticos en la plataforma) */
  --color-success:        #1D9E75;   /* pagado */
  --color-warning:        #BA7517;   /* pendiente */
  --color-danger:         #E24B4A;   /* vencido */
  --color-info:           #378ADD;   /* procesando */
}
```

Uso del color: **blanco dominante**, el **azul** estructura y guía (navbar, links, títulos, chips), el **verde** se reserva **exclusivamente** para la acción de pagar (el usuario aprende que verde = pago). Color en dosis pequeñas y funcionales; nada de bloques saturados.

### 2.2 Tipografía

```css
--font-heading: "Inter", "Plus Jakarta Sans", system-ui, sans-serif;
--font-body:    "Inter", system-ui, sans-serif;
```

- **Todo sans, moderna y geométrica** (Inter o Plus Jakarta Sans). Nada de serif.
- Solo dos pesos: 400 regular y 600 semibold (evitar el "negrón").
- Títulos amplios pero limpios; tracking ligeramente ajustado en headings grandes.
- Escala fluida con `clamp()`:
  - H1: `clamp(2rem, 5vw, 3.25rem)`, weight 600, line-height 1.1
  - H2: `clamp(1.5rem, 3vw, 2.1rem)`, weight 600
  - Body: `clamp(1rem, 1.1vw, 1.075rem)`, weight 400, `line-height: 1.65`
- Cargar vía Google Fonts en `<head>` con `display=swap`.

### 2.3 Forma, espacio y profundidad

```css
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 20px;
--radius-xl: 28px;
--shadow-card: 0 2px 14px rgba(24,95,165,.06);   /* sombra muy sutil */
--shadow-hover: 0 8px 28px rgba(24,95,165,.10);
--space-section: clamp(4rem, 9vw, 7.5rem);        /* mucho aire */
--maxw: 1180px;
```

- Tarjetas con esquinas bien redondeadas (lg/xl) y bordes finos `--color-line`, sombra apenas perceptible.
- Layout aireado, mucho whitespace, ritmo vertical generoso.
- Grid de 12 columnas, contenido centrado a `--maxw`.
- Estética flat: sin gradientes, sin sombras duras, sin bordes gruesos.

---

## 3. Arquitectura de la información (navbar)

Navbar minimalista, limpio, sticky, fondo blanco con borde inferior fino al hacer scroll (no azul sólido pesado).

| Menú principal | Submenú / contenido |
|---|---|
| **Inicio** | Hero + accesos rápidos + noticias |
| **Quiénes somos** | El CEPA, directorio, misión/valores |
| **Cuotas y Becas** | Cuota CEPA · Beca de Fallecimiento · Becas Solidarias |
| **Actividades** | Actividades del CEPA · Deportes · Inversiones |
| **Servicios** | Economía Circular · Convenios · Transporte Escolar |
| **Noticias** | Listado de noticias y eventos |
| **🟢 Pagar cuota** | Botón verde redondeado, destacado |
| **Acceso apoderados** | Botón outline azul → login del panel |

- Logo a la izquierda, menú al centro, **dos botones a la derecha**: "Acceso apoderados" (outline) y "Pagar cuota" (verde sólido).
- Mobile: hamburguesa → panel deslizante limpio; botón "Pagar cuota" fijo abajo (thumb zone).

---

## 4. Secciones de la home (orden y contenido)

### 4.1 Hero
- Fondo blanco (o `--color-bg-soft` muy claro). Sin imagen pesada de fondo.
- Titular sans grande: **"Juntos Somos Comunidad"**.
- Bajada de 1–2 líneas sobre el rol del CEPA.
- **Dos CTAs:** primario verde "Pagar cuota 2026" → plataforma; secundario outline azul "Conoce el CEPA".
- **Tarjeta-resumen flotante** a la derecha (estética app): muestra "Cuota anual familia 2026 · $50.000 · hasta 3 cuotas precio contado vía Web Pay" con un mini botón "Pagar". Esto adelanta el look de la plataforma.
- Fila de micro-badges de confianza: "Pago seguro Webpay", "Comprobante por email", "Histórico en línea".

### 4.2 Banda de accesos rápidos (quick links)
Fila de tarjetas-ícono limpias (íconos lineales finos en azul) con las acciones más buscadas: *Pagar cuota*, *Becas Solidarias*, *Actividades*, *Transporte Escolar*, *Convenios*, *Noticias*. Hover: leve elevación + borde azul.

### 4.3 ¿Por qué pertenecer al Centro de Padres?
- Bloque de valor con 4–5 puntos (representación ante el Colegio, actividades de integración, acción social, atenciones a la comunidad).
- Layout 2 columnas: texto + ilustración lineal/flat o imagen con esquinas redondeadas.
- Cierre con CTA a "Cuota CEPA".

### 4.4 Tarjetas de áreas del CEPA
Grid de tarjetas limpias (las del sitio original, modernizadas):
`Cuota CEPA` · `Beca Fallecimiento` · `Becas Solidarias` · `Actividades` · `Inversiones` · `Economía Circular` · `Convenios` · `Transporte Escolar`.
- Cada card: ícono lineal azul en chip `--color-primary-100`, título semibold, 1 línea descriptiva, link "Ver más →".
- Hover: `translateY(-3px)` + `--shadow-hover`.

### 4.5 Destacado de transparencia ("Inversiones")
Bloque sobre `--color-bg-soft` con **mini stat-cards** (estética dashboard): familias beneficiadas, actividades realizadas, aporte social. Refuerza confianza antes del pago. *(Usar datos reales del CEPA; no inventar cifras — dejar placeholders.)*

### 4.6 Noticias y actividades
- Grid de 3 tarjetas de noticias (imagen redondeada, chip de fecha, título semibold, extracto, "Leer más →").
- Botón "Ver todas las noticias".

### 4.7 Banner CTA de pago
Banda ancha con fondo `--color-primary-100` (azul muy claro), titular "Ponte al día con tu cuota en 1 minuto" + botón verde "Pagar ahora". Reutilizable en otras páginas.

### 4.8 Footer
- Fondo `--color-bg-soft` o blanco con borde superior fino (no azul oscuro pesado). Limpio y ordenado.
- Columnas: navegación, contacto (`cepa@cepaciamaria.cl`, horario oficina), **datos de transferencia** (cuenta para pago directo), redes.
- Línea legal + "Colegio Compañía de María Apoquindo" + logo. Mención discreta a la congregación.

---

## 5. Componentes UI (design system compartido con la plataforma)

- **Botones:** `pago` (verde sólido, redondeado lg), `primario` (azul sólido), `secundario` (outline azul), `ghost` (texto azul). Padding generoso, focus ring accesible, hover sutil, `active: scale(.98)`.
- **Cards:** blanco, borde fino `--color-line`, radio lg/xl, sombra mínima, hover elevación.
- **Stat-cards** (mini KPI): fondo `--color-bg-soft`, label gris 13px arriba, número 24px semibold abajo. Coherentes con el dashboard de la plataforma.
- **Badges/estados:** pagado (verde), pendiente (ámbar), vencido (rojo), procesando (azul) — siempre ícono + texto + color.
- **Chips** (categorías, filtros) con fondo `--color-primary-100`.
- **Inputs:** 40–44px, borde `--color-line`, radio md, focus azul con ring; label arriba.
- **Tarjeta-resumen flotante** (la del hero) reutilizable como widget de pago.

---

## 6. Interacciones y motion

- Scroll reveals sutiles (fade + translateY 10px). Respetar `prefers-reduced-motion`.
- Hover de cards `translateY(-3px)` + cambio de sombra suave.
- Navbar: blanco transparente → blanco con borde inferior fino al hacer scroll.
- Transiciones 150–220ms, easing `cubic-bezier(.2,.7,.2,1)`.
- Micro-interacción discreta en el botón de pago al hover.

---

## 7. Responsive

- Mobile-first. Breakpoints `480 / 768 / 1024 / 1280`.
- Grids colapsan a 1 columna en mobile; tarjetas de áreas 2 col en tablet, 4 en desktop.
- La tarjeta-resumen del hero pasa arriba/abajo del titular en mobile.
- Botón "Pagar cuota" fijo y accesible con el pulgar en mobile.
- Tipografía fluida con `clamp()`; cuerpo nunca < 16px.

---

## 8. Accesibilidad (WCAG 2.1 AA)

- Contraste AA en todo texto (verde y azul sobre blanco verificados; usar `-700`/`-600` para texto sobre claro).
- Focus visible en todos los interactivos; navegación por teclado completa.
- Targets táctiles ≥ 44×44px.
- Estados nunca solo por color (siempre ícono + texto).
- `alt` descriptivo, jerarquía de headings, landmarks semánticos.
- Español de Chile, lenguaje claro.

---

## 9. SEO y técnico

- Meta title/description por página; OG tags.
- HTML semántico, `lazy loading`, fuentes `display=swap`.
- Datos estructurados `Organization` / `EducationalOrganization`.
- Core Web Vitals en verde (LCP < 2.5s) — el look limpio ayuda al rendimiento.

---

## 10. Conexión con la plataforma de pagos

- "Pagar cuota" y "Acceso apoderados" enrutan a la app de `design-plataforma.md`.
- Web y plataforma **comparten los mismos tokens** (paleta, tipografía Inter, radios, sombras, componentes), para una experiencia continua entre informarse y pagar.
- Estados de pago (pagado/pendiente/vencido/procesando) usan idéntica codificación de color en ambos productos.

---

## 11. Entregables esperados de Claude Design

1. Home completa (desktop + mobile).
2. Plantilla de página interior (ej. "Cuota CEPA" y "Becas Solidarias").
3. Listado y detalle de noticia.
4. Componentes del design system (botones, cards, stat-cards, navbar, footer, badges, inputs, tarjeta-resumen).
5. Tokens exportables (`:root` CSS variables) reutilizables por la plataforma.

> **Nota de contenido:** usar los textos e información reales del CEPA como base; no inventar cifras de inversiones, montos de becas ni datos bancarios — dejar placeholders claramente marcados donde el CEPA deba completar.
