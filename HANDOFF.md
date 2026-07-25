# CEPA — Estado del proyecto y pendientes (handoff)

> Documento para retomar el trabajo en otra conversación. Última actualización tras el push `755887e`.

## 1. Qué es y dónde vive

- **Plataforma (Next.js 14, App Router)**: subcarpeta **`Plataforam/`** (¡no la raíz!).
  - Panel **admin** (`/admin`) y **portal apoderado** (`/portal/*`).
  - **Sitio público** servido como estático desde **`Plataforam/public/`** (`index.html`, `becas-solidarias.html`, `contacto.html`, `cuota-cepa.html`, `faq.html`, `noticias.html`, `noticia.html`, `formulario-beca.html`). El home del Next app (`/`) redirige a `/index.html`.
  - Copia "fuente" del sitio público también en **`web/`** (se mantiene en sync; el que se deploya es `public/`).
- **Base de datos**: **Supabase** — proyecto `Cepaciamaria's Project`, id **`byhldrfcfjubalhnmeic`**, región Canadá.
- **Deploy**: **Vercel**, auto-deploy desde la rama **`master`** en GitHub `Estebanigv/CEPA`.

## 2. Cómo correr en local

```bash
cd "Plataforam"
npm run dev     # http://localhost:3000 (o el puerto libre)
```
- **Admin**: `/admin` → login **`cepa` / `222`**.
- **Portal apoderado**: `/portal/login` → **correo de un apoderado** (ej. `mabello2013@gmail.com`) + contraseña **`12334`**.
- El home público: `/` (redirige a `/index.html`).

## 3. Base de datos (Supabase)

- Cargadas **906 familias, 1.223 alumnos** desde el Excel del Centro de Padres.
- Migraciones en `Plataforam/supabase/migrations/` (`0001_init_schema.sql`, `0002_centro_padres_real.sql`).
- Modelo clave en `families`: apoderados padre/madre + correos, `cursos`, `historial` (jsonb con pago anual 2011–2026 de las 2 cuotas), flags `cepa_2026` / `seguro_2026` y folios.
- **Montos reales de las cuotas anuales**:
  - **CEPA** (Centro de Padres) = **$50.000** por familia.
  - **SEGURO** (columna del Excel) = en realidad la **Beca de Fallecimiento** = **$30.000** por alumno.
  - `SI` = pagado, `NO` = no pagado.
- Conceptos: todos con **`cuotas = 12`** (hasta 12 cuotas).
- **RUT**: el Excel NO trae RUT. Login del apoderado es por **correo** por ahora (pendiente cargar RUTs reales).

## 4. Variables de entorno

`Plataforam/.env.local` (local, **gitignored**). En **Vercel** hay que replicarlas en Settings → Environment Variables.

| Variable | Estado |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ configurada |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ configurada |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (local y Vercel) — **secreta** |
| `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` | ✅ chat IA (DeepSeek `deepseek-v4-flash`) |
| `PORTAL_PASSWORD` | ✅ `12334` (clave única temporal apoderados) — **agregar en Vercel** |
| `BECA_SMTP_HOST/PORT/USER/TO` | ✅ (mail.cepaciamaria.cl:465, cepa@cepaciamaria.cl) |
| `BECA_SMTP_PASS` | ⛔ **FALTA**: contraseña del buzón `cepa@cepaciamaria.cl` |

## 5. Lo que está HECHO

- **Home / sitio público**: fotos reales, hero + carrusel (pausa al hover), noticias con fotos, banda directiva, favicon real, contacto con iconos SVG (sin captcha), sin "Economía Circular" en el menú, textos "hasta 12 cuotas".
- **Becas Solidarias**: contenido real cargado + **formulario de postulación** (`/formulario-beca.html`, 26 campos con adjuntos) que POSTea a `/api/beca` (envía por SMTP a `cepa@` con copia al apoderado — falta la clave SMTP).
- **Chat IA (DeepSeek)**: 3 perfiles — **admin** (con datos reales), **apoderado** (portal), **público** (sitio, con CORS). Avatar y botón = **Cepito**. Ruta `/api/chat`.
- **Admin conectado a datos reales**:
  - **Pagos/Contabilidad**: registros derivados del pago 2026 de cada familia (CEPA + Beca, anuales, pagado/pendiente).
  - **Conceptos**: editar/crear/activar **persiste** en la base (`/api/admin/concepts`).
  - **Familias**: filtro + orden por curso; botón **"Ver como apoderado"** (`/portal/mis-datos?fid=<id>` en modo preview seguro sólo con sesión admin).
  - **Dashboard**: KPIs reales (429 pagaron CEPA = 47% al día; recaudación $29.940.000).
  - **Cobranza**: "Previsualizar" del email funcional.
- **Auth**: admin por cookie httpOnly (`/api/admin/login|logout`); portal por correo + `PORTAL_PASSWORD`.

## 6. PENDIENTES (próximos pasos)

1. **SMTP del formulario de beca** → falta la **contraseña del buzón `cepa@cepaciamaria.cl`** (fijar en cPanel → Cuentas de correo, o pedirla) y ponerla en `BECA_SMTP_PASS` (local y Vercel).
2. **WebPay (Transbank)** — conectar pagos. Ya existe un comercio en el sitio actual. Pasos: pedir **código de comercio + API key de producción** de WebPay Plus → instalar `transbank-sdk` → flujo init/commit → registrar el pago en Supabase → URL de retorno `/portal/pago/retorno` (ya existe la página). Probar primero en ambiente de integración.
3. **Sistema de importación** en el admin: botón para **subir Excel/CSV** y cargar familias/alumnos a la base (mapeo por columnas).
4. **Beca de Fallecimiento**: crear su **página propia** (info ya extraída: $30.000/año, cubre hasta 100%, requisitos) + su **formulario** (pendiente).
5. **RUTs de apoderados**: cuando lleguen, enlazarlos por correo y activar login por RUT.
6. **Noticia "Feria de Economía Circular"**: decidir si se quita (el ítem de menú ya se quitó).
7. **Vercel**: agregar `PORTAL_PASSWORD` y (cuando esté) `BECA_SMTP_PASS`. Verificar que el deploy quede verde.
8. Opcional: conectar las escrituras que faltan del admin (registrar pago manual real, cobranza real, usuarios).

## 7. Accesos / notas

- **cPanel/FTP** de cepaciamaria.cl (usuario `cep1012`): usado para bajar fotos por FTP. Guardar credenciales en un gestor, no en el repo.
- **Fotos históricas 2011–2026** (751 archivos, ~720MB) descargadas a **`fotos-cepa-archivo/`** (repo root, **gitignored** — uso local, no se deploya). Las fotos usadas en el sitio están optimizadas en `Plataforam/public/img/`.
- **Datos personales**: la carpeta `CENTRO DE PADRES 2026/` (Excel de familias) **no** se commitea.
- Skill útil en este repo para inspección visual: `web-inspector` (Playwright). No estuvo disponible por MCP en la última sesión.

## 8. Archivos clave

| Qué | Dónde |
|---|---|
| Capa de datos admin (Supabase o mock) | `Plataforam/src/lib/data.ts` |
| Cliente service_role (server-only) | `Plataforam/src/lib/supabase/admin.ts` |
| Chat IA (DeepSeek) | `Plataforam/src/lib/ai.ts` + `Plataforam/src/app/api/chat/route.ts` |
| Datos del portal por familia | `Plataforam/src/lib/portal-server-data.ts` |
| Auth admin (cookie) | `Plataforam/src/lib/server-auth.ts` |
| Formulario de beca (envío) | `Plataforam/src/app/api/beca/route.ts` |
| Guardar conceptos | `Plataforam/src/app/api/admin/concepts/route.ts` |
| Chatbot público (JS/CSS) | `Plataforam/public/assets/chatbot.js` + `chatbot.css` |
