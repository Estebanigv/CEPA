-- =========================================================================
-- CEPA · Esquema inicial
-- Ejecutar en el SQL Editor de Supabase (o vía CLI) ANTES de seed.sql.
-- =========================================================================

create extension if not exists "pgcrypto";

-- ---- Conceptos de pago (catálogo configurable) ----
create table if not exists public.concepts (
  id          text primary key,            -- slug: 'cepa', 'futm1', ...
  name        text    not null,
  category    text    not null,            -- "Cuotas institucionales" | "Deportes" | "Eventos"
  icon        text    not null,            -- nombre de ícono (building, ball, run, ...)
  amount      integer not null default 0,  -- CLP
  scope       text    not null,            -- "Por familia" | "Por estudiante" | ...
  validity    text    not null,            -- vigencia: "Anual 2026" | "1er semestre" | ...
  cuotas      integer not null default 1,
  active      boolean not null default true,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---- Familias / apoderados ----
create table if not exists public.families (
  id          uuid primary key default gen_random_uuid(),
  name        text    not null,
  apoderado   text    not null,
  rut         text    not null unique,
  email       text,
  cursos      text,
  status      text    not null default 'pending',  -- paid | pending | overdue
  aportado    integer not null default 0,
  pend        integer not null default 0,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---- Estudiantes asociados a una familia ----
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families(id) on delete cascade,
  name        text not null,
  curso       text,
  sort        integer not null default 0
);
create index if not exists students_family_id_idx on public.students(family_id);

-- ---- Transacciones / pagos ----
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  reference   text,                                  -- TBK-xxxx / EFE-xxxx / '—'
  paid_at     timestamptz,                           -- para ordenar cronológicamente
  date_label  text    not null,                      -- texto mostrado: "2026-06-08 14:32"
  family_id   uuid references public.families(id) on delete set null,
  apoderado   text    not null,
  rut         text,
  curso       text,
  concepts    text,
  amount      integer not null default 0,
  method      text,
  status      text    not null default 'pending',    -- paid | pending | overdue | processing
  created_at  timestamptz not null default now()
);
create index if not exists transactions_paid_at_idx on public.transactions(paid_at desc);
create index if not exists transactions_status_idx  on public.transactions(status);

-- ---- Usuarios del panel (roles y permisos) ----
create table if not exists public.app_users (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  email       text,
  perms       text,
  color       text,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---- Log de auditoría ----
create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor       text not null,
  action      text not null,
  when_label  text,
  created_at  timestamptz not null default now()
);

-- ---- Reglas de recordatorio (cobranza automática) ----
create table if not exists public.reminder_rules (
  key         text primary key,            -- before | due | after
  label       text not null,
  enabled     boolean not null default true,
  sort        integer not null default 0
);

-- ---- Log de recordatorios enviados ----
create table if not exists public.reminder_log (
  id               uuid primary key default gen_random_uuid(),
  recipients_label text not null,
  recipients_count integer not null default 1,
  sent_label       text,
  kind             text,                    -- Masivo | Manual | Automático
  sort             integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ---- Plantilla de email (fila única) ----
create table if not exists public.email_template (
  id          integer primary key default 1,
  subject     text not null,
  body        text not null,
  constraint email_template_single check (id = 1)
);

-- ---- Métricas del dashboard (fila única; placeholder hasta tener datos reales) ----
create table if not exists public.dashboard_metrics (
  id              integer primary key default 1,
  recaudado       integer not null default 0,
  recaudado_delta numeric not null default 0,
  pagos           integer not null default 0,
  pagos_delta     numeric not null default 0,
  al_dia          integer not null default 0,
  pendiente       integer not null default 0,
  vencido         integer not null default 0,
  ticket          integer not null default 0,
  constraint dashboard_metrics_single check (id = 1)
);

-- ---- Recaudación por mes (gráfico de barras) ----
create table if not exists public.monthly_revenue (
  id          uuid primary key default gen_random_uuid(),
  month       text not null,
  value       integer not null default 0,
  sort        integer not null default 0
);

-- ---- Recaudación por concepto (gráfico de progreso) ----
create table if not exists public.revenue_by_concept (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  value       integer not null default 0,
  color       text not null,
  sort        integer not null default 0
);

-- =========================================================================
-- RLS: habilitado en todas las tablas, deny-by-default.
-- El panel lee desde el servidor con la service_role key (bypassa RLS).
-- La anon key pública NO puede leer nada hasta definir políticas por rol
-- (siguiente milestone: auth de tesorería).
-- =========================================================================
alter table public.concepts           enable row level security;
alter table public.families           enable row level security;
alter table public.students           enable row level security;
alter table public.transactions       enable row level security;
alter table public.app_users          enable row level security;
alter table public.audit_log          enable row level security;
alter table public.reminder_rules     enable row level security;
alter table public.reminder_log       enable row level security;
alter table public.email_template     enable row level security;
alter table public.dashboard_metrics  enable row level security;
alter table public.monthly_revenue    enable row level security;
alter table public.revenue_by_concept enable row level security;
