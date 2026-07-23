-- =========================================================================
-- CEPA · Migración 0002 — adaptar el esquema a la base real del Centro de
-- Padres (Excel "BASE DE DATOS FAMILIAS" 2026).
--
-- Cambios:
--   1. families.rut pasa a OPCIONAL (aún no tenemos los RUT; se cargan luego).
--      Se conserva la unicidad para RUT no nulos vía índice parcial.
--   2. families gana los datos del Excel: dos apoderados (padre / madre) con
--      su correo, teléfono, y el nombre "ancla" de la familia.
--   3. families.historial (jsonb): historial de pago por año 2011-2026 de las
--      dos cuotas anuales — CEPA (centro de padres) y SEGURO escolar.
--      Forma: { "2026": {"cepa":true,"cepa_folio":"93","seguro":true,
--                         "seguro_folio":"79","firma":"50/50"}, ... }
--   4. Flags denormalizados cepa_2026 / seguro_2026 para conteos rápidos del
--      dashboard.
-- =========================================================================

-- ---- 1. RUT opcional ----
alter table public.families alter column rut drop not null;
alter table public.families drop constraint if exists families_rut_key;
create unique index if not exists families_rut_unique
  on public.families (rut) where rut is not null;

-- ---- 2. Datos de apoderados del Excel ----
alter table public.families add column if not exists anchor_name  text;  -- "Nombre de la familia" (col A)
alter table public.families add column if not exists padre_nombre text;
alter table public.families add column if not exists padre_email  text;
alter table public.families add column if not exists madre_nombre text;
alter table public.families add column if not exists madre_email  text;
alter table public.families add column if not exists telefono     text;

create index if not exists families_padre_email_idx on public.families (lower(padre_email));
create index if not exists families_madre_email_idx on public.families (lower(madre_email));

-- ---- 3. Historial anual (jsonb) + flags 2026 ----
alter table public.families add column if not exists historial     jsonb   not null default '{}'::jsonb;
alter table public.families add column if not exists cepa_2026     boolean not null default false;
alter table public.families add column if not exists seguro_2026   boolean not null default false;
alter table public.families add column if not exists cepa_folio_2026   text;
alter table public.families add column if not exists seguro_folio_2026 text;

create index if not exists families_cepa2026_idx   on public.families (cepa_2026);
create index if not exists families_seguro2026_idx on public.families (seguro_2026);
