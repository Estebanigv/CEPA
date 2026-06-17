# Conectar CEPA a Supabase

La app **ya funciona sin Supabase** (usa datos de ejemplo idénticos al prototipo).
Cuando tengas tu cuenta de Supabase, sigue estos pasos para pasar a datos reales.
No hay que tocar ningún componente: toda la data entra por `getAdminData()`.

## 1. Crear el proyecto

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta (o inicia sesión).
2. **New project** → nombre `CEPA`, región **South America (São Paulo)** (la más cercana a Chile), define una contraseña de base de datos y crea.
3. Espera ~2 minutos a que el proyecto quede `ACTIVE`.

## 2. Cargar el esquema y los datos

En el panel de Supabase → **SQL Editor**:

1. Abre [`supabase/migrations/0001_init_schema.sql`](supabase/migrations/0001_init_schema.sql), copia todo, pégalo y ejecuta (**Run**).
2. Abre [`supabase/seed.sql`](supabase/seed.sql), copia todo, pégalo y ejecuta. (Se puede re-correr cuando quieras: hace `truncate` y vuelve a insertar.)

> Alternativa con CLI: `supabase db push` + `psql ... -f supabase/seed.sql`.

## 3. Configurar las variables de entorno

En Supabase → **Project Settings → API**, copia los valores y crea el archivo `.env.local`
en la raíz del proyecto (puedes partir de `.env.local.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

- `SUPABASE_SERVICE_ROLE_KEY` es **secreta** y solo se usa en el servidor. Nunca la expongas al cliente ni la subas a git (`.env.local` ya está en `.gitignore`).

## 4. Levantar la app

```bash
npm run dev
```

Abre http://localhost:3000 → el panel ahora lee de Supabase. Si las credenciales
faltan o la consulta falla, vuelve automáticamente a los datos de ejemplo (verás un
aviso en la consola del servidor).

---

## Cómo está conectado (resumen técnico)

| Capa | Archivo |
|---|---|
| Punto único de carga (Supabase **o** mock) | [`src/lib/data.ts`](src/lib/data.ts) → `getAdminData()` |
| Cliente service_role (solo servidor) | [`src/lib/supabase/admin.ts`](src/lib/supabase/admin.ts) |
| Esquema (DDL + RLS) | [`supabase/migrations/0001_init_schema.sql`](supabase/migrations/0001_init_schema.sql) |
| Datos de ejemplo | [`supabase/seed.sql`](supabase/seed.sql) |

**Seguridad:** RLS queda habilitado en todas las tablas con _deny-by-default_. El panel
lee desde el servidor con la `service_role` key (bypassa RLS); la `anon` key pública no
expone nada hasta definir políticas por rol.

## Pendiente para producción (próximos milestones)

1. **Auth de tesorería** — login con Supabase Auth + políticas RLS por rol; reemplaza el
   usuario fijo "Patricia Lagos M." del sidebar.
2. **Escrituras** — hoy las acciones (registrar pago manual, crear/editar concepto, enviar
   recordatorio) son de UI. Conectarlas a `insert`/`update` + Server Actions.
3. **Vistas Cobranza / Reportes / Usuarios** — sus tablas (`reminder_rules`, `app_users`,
   `audit_log`, etc.) ya están en el esquema y el seed, pero esos componentes aún muestran
   los datos de ejemplo embebidos. Falta enchufarlos a `getAdminData()`.
4. **Métricas reales** — `dashboard_metrics`, `monthly_revenue` y `revenue_by_concept` hoy
   son placeholder; calcularlas desde `transactions` con vistas/funciones SQL.
