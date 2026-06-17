# Design Brief — Plataforma de Pagos + Panel Admin CEPA

> **Estilo:** Fintech limpio — moderno, claro, app-like.
> **Para:** Claude Design / generación de UI
> **Proyecto:** Plataforma digital de pagos del Centro de Padres y Apoderados (CEPA) — Colegio Compañía de María Apoquindo
> **Pasarela de pago:** Web Pay / Transbank (tarjetas crédito y débito, cuotas precio contado)
> **Documento hermano:** `design-web.md` — **comparte el mismo design system** (tokens, tipografía Inter, componentes).

---

## 1. Objetivo

Plataforma digital de pagos **moderna, simple y segura** para que las familias realicen sus aportes y pagos de actividades de forma rápida, ordenada y con **trazabilidad**. Dos audiencias:

- **Apoderado (frontend):** elige conceptos, paga, ve su histórico y pendientes, descarga comprobantes.
- **Administración CEPA (panel):** gestiona conceptos, ve la contabilidad de pagos, hace seguimiento de cobranza y reportes.

**Propósitos:** facilitar el pago, transparentar el estado de los aportes, mejorar el control administrativo, automatizar cobranza y seguimiento, y entregar trazabilidad y confianza.

**Principio rector:** *pagar la cuota debe tomar menos de un minuto y nunca generar dudas.* Interfaz tipo app de pagos: limpia, espaciosa, con foco en una acción por pantalla.

---

## 2. Dirección visual: Fintech limpio (heredada de la web)

Mismo lenguaje que `design-web.md`: blanco amplio, tarjetas redondeadas con bordes finos, sombras casi imperceptibles, **azul confianza** para estructura y **verde** exclusivo para pagar. Todo en **Inter** (sans), dos pesos (400/600). Sensación de dashboard fintech ordenado.

### 2.1 Tokens (idénticos a la web)

```css
:root {
  --color-primary:    #185FA5;   --color-primary-700: #0C447C;
  --color-primary-500:#378ADD;   --color-primary-100: #E6F1FB;
  --color-pay:        #1D9E75;   --color-pay-600:     #0F6E56;
  --color-ink:        #16202B;   --color-muted:       #5B6472;
  --color-line:       #E8EBF0;   --color-bg:          #FFFFFF;
  --color-bg-soft:    #F7F9FC;
  --radius-md:14px; --radius-lg:20px; --radius-xl:28px;
  --shadow-card:0 2px 14px rgba(24,95,165,.06);
}
```

### 2.2 Codificación de estados de pago (consistente en toda la app)
```
Pagado     → verde   #1D9E75
Pendiente  → ámbar   #BA7517
Vencido    → rojo    #E24B4A
Procesando → azul    #378ADD
```
Siempre **ícono + texto + color** (nunca color solo, por accesibilidad). Badges con fondo claro de la misma familia y texto del tono oscuro.

---

## 3. Conceptos de pago (catálogo)

Configurables desde el admin:

| Concepto | Tipo | Notas |
|---|---|---|
| Cuota Centro de Padres | Anual / hasta 3 cuotas | $50.000 familia (2026), "precio contado" vía Web Pay |
| Cuota Beca de Fallecimiento | Anual | Protección a la familia |
| Cuota Fútbol Masculino – 1er Semestre | Actividad | Por estudiante |
| Cuota Fútbol Masculino – 2do Semestre | Actividad | Por estudiante |
| Cuota Fútbol Femenino – 1er Semestre | Actividad | Por estudiante |
| Cuota Fútbol Femenino – 2do Semestre | Actividad | Por estudiante |
| Cuota Entrenamiento | Actividad | |
| Cuota Zumba | Actividad | |
| Cuota Corrida Familiar | Evento | |

> Montos reales y reglas (descuentos, cuotas) los define el CEPA — datos configurables, no hardcodear cifras inventadas.

---

## 4. Flujo del apoderado (frontend)

### 4.1 Identificación / acceso
- Pantalla de login limpia, centrada, tarjeta blanca sobre `--color-bg-soft`, logo arriba.
- Acceso por **RUT + clave** (rutificador asocia a la familia). Link "¿Olvidaste tu clave?".
- Registro y recuperación mínimos; nada de pedir datos innecesarios.

### 4.2 Catálogo de conceptos / "Carro de compra"
- Conceptos en **tarjetas limpias** agrupadas por categoría (Cuotas institucionales · Deportes · Eventos), con chips de filtro azules arriba.
- Cada tarjeta: ícono lineal en chip azul, nombre semibold, descripción breve, monto destacado, selector cantidad / por estudiante, botón **"Agregar"**.
- Conceptos ya pagados: badge verde "Pagado" y card atenuada.
- Permite seleccionar **uno o más conceptos en una misma transacción**.
- **Carro lateral** persistente (estética app, esquinas xl): lista de ítems con subtotal por ítem, **subtotal y total**, botón verde "Ir a pagar".
- Mobile: barra inferior fija con total + "Pagar".

### 4.3 Revisión / Rutificador / Confirmación previa
- **Pantalla de revisión previa al pago** (paso explícito antes de cobrar), tipo checkout fintech:
  - Datos de la familia/apoderado (nombre, RUT, email editable).
  - **Resumen detallado** de conceptos con montos, en tarjeta.
  - Total a pagar destacado.
  - Selección de medio: Web Pay (crédito/débito) y opción de cuotas precio contado si aplica.
  - Casilla de confirmación + botón verde **"Confirmar y pagar"** → redirección a Web Pay/Transbank.
- Stepper visible arriba (Selección → Revisión → Pago → Comprobante).

### 4.4 Retorno de pago + comprobante
- Pantallas de retorno claras para **éxito**, **rechazo** y **anulado/timeout**, cada una con ícono grande, mensaje humano y acción siguiente.
- Éxito: check verde, número de transacción, resumen, fecha, monto, medio, estado.
- **Envío automático de comprobante por email** + botón "Descargar comprobante (PDF)" y "Volver a mis pagos".

### 4.5 Histórico de pagos
- Lista por familia con **fecha, concepto(s), monto, medio de pago, estado** (badge).
- Filtros por año, concepto y estado; buscador.
- **Descarga de comprobante** por pago.
- Desktop: tabla limpia con filas espaciadas; mobile: tarjetas apiladas.

### 4.6 Pagos pendientes
- Sección de **cuotas/actividades no pagadas** de la familia, en tarjetas.
- Cada pendiente: concepto, monto, **fecha de vencimiento**, badge (pendiente/vencido).
- **Alertas de vencimiento** visibles y **recordatorios automáticos** (email/aviso en plataforma).
- CTA "Pagar ahora" que precarga el carro con esos ítems.

---

## 5. Panel de administración (contabilidad y gestión)

Foco principal del cliente: **contabilidad de los pagos de los apoderados** y control de cobranza. Estética dashboard fintech: sidebar limpio, contenido aireado, stat-cards y gráficos sobrios.

### 5.1 Dashboard (home admin)
- **KPI / stat-cards:** total recaudado (período), N° de pagos, % familias al día, monto pendiente/vencido, ticket promedio.
- Gráficos: recaudación por mes (barras), por concepto, distribución pagado vs pendiente (dona).
- Listas "últimos pagos" y "vencimientos próximos".
- Filtro global por período y concepto.

### 5.2 Pagos / Contabilidad
- **Tabla maestra de transacciones:** fecha, apoderado, RUT, familia/curso, concepto(s), monto, medio, estado, ID Transbank.
- Filtros potentes: rango de fechas, concepto, estado, curso, medio.
- Búsqueda por apoderado/RUT.
- **Exportar a Excel/CSV** (clave para la contabilidad) y comprobante PDF por transacción.
- Conciliación: identificar pagos por **transferencia** (fuera de Web Pay) e ingresar pagos en **efectivo** hechos en oficina.
- Detalle de transacción con timeline (creado → pagado → comprobante enviado).

### 5.3 Apoderados / Familias
- Listado de familias con estado consolidado (al día / con pendientes / vencido).
- Ficha de familia: contacto, estudiantes asociados, histórico, pendientes, total aportado.
- Acción: enviar recordatorio manual.

### 5.4 Conceptos de pago (configuración)
- CRUD de conceptos: nombre, categoría, monto, vigencia (semestre/año), reglas de cuotas, activar/desactivar, a quién aplica (todos / por curso / por estudiante).
- Define qué aparece en el carro del apoderado.

### 5.5 Cobranza y recordatorios
- Reglas de **recordatorios automáticos** por vencimiento (X días antes, al vencer, X días después).
- Plantillas de email editables; envío masivo segmentado (ej. morosos de Cuota CEPA).
- Registro de comunicaciones enviadas (trazabilidad).

### 5.6 Reportes
- Recaudación por período/concepto/curso; morosidad. Exportables (Excel/PDF) para tesorería.

### 5.7 Roles y permisos
- **Admin/Tesorería** (todo), **Directiva** (lectura: dashboard y reportes), **Operador** (pagos manuales + recordatorios). Log de auditoría.

---

## 6. Mapa de pantallas

```
APODERADO
  /login                → RUT + clave
  /conceptos            → catálogo + carro
  /revision             → rutificador / confirmación previa (stepper)
  /pago/retorno         → éxito | rechazo | anulado
  /mis-pagos            → histórico + descarga comprobante
  /pendientes           → cuotas no pagadas + alertas
  /perfil               → datos familia/contacto

ADMIN
  /admin                → dashboard KPIs
  /admin/pagos          → tabla transacciones + export + conciliación
  /admin/familias       → listado + ficha
  /admin/conceptos      → CRUD catálogo
  /admin/cobranza       → recordatorios + plantillas
  /admin/reportes       → recaudación / morosidad / export
  /admin/usuarios       → roles y permisos
```

---

## 7. Componentes clave a diseñar

- **Card de concepto** (monto, selector, "Agregar"/"Pagado").
- **Carro/resumen** lateral (desktop) + barra inferior fija (mobile).
- **Stepper de checkout** (4 pasos).
- **Badge de estado** (pagado/pendiente/vencido/procesando) — coherente con la web.
- **Tabla de transacciones** limpia con filtros, orden, paginación y export.
- **Stat-card** y **gráficos** (barras/dona) para el dashboard.
- **Pantallas de retorno Transbank** (éxito/rechazo/anulado) con ícono + acción.
- **Comprobante PDF** (plantilla con logo, datos del CEPA, detalle, folio).
- **Sidebar admin** limpio con íconos lineales.
- **Modal de recordatorio** y **plantilla de email**.
- **Empty states** amables (sin pagos, sin pendientes, carro vacío) con ilustración flat.

---

## 8. UX, confianza y seguridad (percibida)

- Mostrar indicadores de pago seguro (Webpay/Transbank, candado, "pago encriptado").
- Nunca pedir ni almacenar datos de tarjeta — el ingreso ocurre en el entorno de Transbank.
- Confirmaciones claras antes de cobrar; sin pasos ambiguos.
- Feedback inmediato (loaders, estado "procesando pago").
- Errores humanos y accionables ("Tu pago fue rechazado por el banco. Intenta con otra tarjeta o medio").
- Comprobante siempre disponible (email + descarga).

---

## 9. Responsive y accesibilidad

- Mobile-first (la mayoría paga desde el teléfono).
- Carro y "Pagar" accesibles con el pulgar; checkout en una columna en mobile.
- Tablas → tarjetas apiladas en mobile.
- WCAG 2.1 AA: contraste, focus visible, teclado, targets ≥44px, estados no dependientes solo del color.
- Español de Chile; montos en CLP con formato local (`$50.000`).

---

## 10. Estados y datos de ejemplo (para mockups)

Usar datos ficticios verosímiles (familia "Pérez González", RUT de ejemplo, montos como $50.000) y marcarlos como **placeholders**. No usar RUT, montos de becas ni datos bancarios reales hasta que el CEPA los confirme.

---

## 11. Entregables esperados de Claude Design

1. **Frontend apoderado:** login, catálogo+carro, revisión/confirmación, retorno de pago (3 estados), histórico, pendientes.
2. **Panel admin:** dashboard, tabla de pagos/contabilidad, ficha de familia, CRUD de conceptos, cobranza, reportes.
3. **Componentes** del design system de la plataforma (reutilizando tokens de la web).
4. **Plantilla de comprobante PDF**.
5. Versiones **desktop y mobile** de las pantallas críticas (catálogo, checkout, pendientes, dashboard).

> Tras aprobar estos diseños se continúa con la **etapa funcional** (integración Web Pay/Transbank, base de datos de familias/conceptos/transacciones, envío de comprobantes y recordatorios).
