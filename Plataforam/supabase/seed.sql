-- =========================================================================
-- CEPA · Datos de ejemplo (idénticos al prototipo del handoff)
-- Ejecutar DESPUÉS de 0001_init_schema.sql. Es idempotente: se puede re-correr.
-- =========================================================================

truncate
  public.students,
  public.transactions,
  public.families,
  public.concepts,
  public.app_users,
  public.audit_log,
  public.reminder_rules,
  public.reminder_log,
  public.email_template,
  public.dashboard_metrics,
  public.monthly_revenue,
  public.revenue_by_concept
  restart identity cascade;

-- ---- Conceptos ----
insert into public.concepts (id, name, category, icon, amount, scope, validity, cuotas, active, sort) values
  ('cepa',    'Cuota Centro de Padres',          'Cuotas institucionales', 'building', 50000, 'Por familia',    'Anual 2026',    3, true,  0),
  ('beca',    'Cuota Beca de Fallecimiento',     'Cuotas institucionales', 'heart',    12000, 'Por familia',    'Anual 2026',    1, true,  1),
  ('futm1',   'Fútbol Masculino — 1er Semestre', 'Deportes',               'ball',     45000, 'Por estudiante', '1er semestre',  1, true,  2),
  ('futm2',   'Fútbol Masculino — 2do Semestre', 'Deportes',               'ball',     45000, 'Por estudiante', '2do semestre',  1, true,  3),
  ('futf1',   'Fútbol Femenino — 1er Semestre',  'Deportes',               'ball',     45000, 'Por estudiante', '1er semestre',  1, true,  4),
  ('futf2',   'Fútbol Femenino — 2do Semestre',  'Deportes',               'ball',     45000, 'Por estudiante', '2do semestre',  1, false, 5),
  ('entrena', 'Cuota Entrenamiento',             'Deportes',               'run',      25000, 'Por estudiante', 'Mensual',       1, true,  6),
  ('zumba',   'Cuota Zumba',                     'Deportes',               'music',    20000, 'Por persona',    'Mensual',       1, true,  7),
  ('corrida', 'Corrida Familiar CEPA',           'Eventos',                'run',      15000, 'Por persona',    'Evento único',  1, true,  8);

-- ---- Familias ----
insert into public.families (name, apoderado, rut, email, cursos, status, aportado, pend, sort) values
  ('Familia Pérez González', 'María José Pérez González', '15.482.391-7', 'mj.perez@email.cl',    'III Medio B · 7° Básico A', 'pending',  66666, 62000, 0),
  ('Familia Salinas Vera',   'Rodrigo Salinas Vera',      '13.099.522-K', 'r.salinas@email.cl',   'I Medio A',                 'paid',     95000,     0, 1),
  ('Familia Núñez Castro',   'Felipe Núñez Castro',       '14.220.876-5', 'f.nunez@email.cl',     'IV Medio A',                'paid',     62000,     0, 2),
  ('Familia Maldonado P.',   'Verónica Maldonado P.',     '15.001.447-7', 'v.maldonado@email.cl', '7° Básico A · 5° Básico B', 'overdue',  20000, 95000, 3),
  ('Familia Tapia Ríos',     'Carolina Tapia Ríos',       '16.730.114-2', 'c.tapia@email.cl',     '8° Básico B',               'pending',  20000, 50000, 4),
  ('Familia Soto Lagos',     'Andrea Soto Lagos',         '17.882.034-9', 'a.soto@email.cl',      '6° Básico A',               'paid',    110000,     0, 5);

-- ---- Estudiantes (enlazados por RUT del apoderado) ----
insert into public.students (family_id, name, curso, sort)
select f.id, v.name, v.curso, v.sort
from (values
  ('15.482.391-7', 'Tomás Pérez',       'III Medio B', 0),
  ('15.482.391-7', 'Isidora Pérez',     '7° Básico A', 1),
  ('13.099.522-K', 'Matías Salinas',    'I Medio A',   0),
  ('14.220.876-5', 'Javiera Núñez',     'IV Medio A',  0),
  ('15.001.447-7', 'Benjamín Maldonado','7° B A',      0),
  ('15.001.447-7', 'Emilia Maldonado',  '5° B B',      1),
  ('16.730.114-2', 'Vicente Tapia',     '8° Básico B', 0),
  ('17.882.034-9', 'Florencia Soto',    '6° Básico A', 0)
) as v(rut, name, curso, sort)
join public.families f on f.rut = v.rut;

-- ---- Transacciones (family_id se resuelve por RUT; null si no es familia registrada) ----
insert into public.transactions (reference, paid_at, date_label, family_id, apoderado, rut, curso, concepts, amount, method, status)
select v.reference, v.paid_at::timestamptz, v.date_label, f.id, v.apoderado, v.rut, v.curso, v.concepts, v.amount, v.method, v.status
from (values
  ('TBK-009912', '2026-06-08 14:32', '2026-06-08 14:32', 'María José Pérez González', '15.482.391-7', 'III Medio B', 'Cuota Centro de Padres',          50000, 'Web Pay · Crédito', 'paid'),
  ('TBK-009908', '2026-06-08 11:05', '2026-06-08 11:05', 'Rodrigo Salinas Vera',      '13.099.522-K', 'I Medio A',   'Fútbol Masculino — 1er Sem',      45000, 'Web Pay · Débito',  'paid'),
  (null,         '2026-06-07 17:40', '2026-06-07 17:40', 'Carolina Tapia Ríos',       '16.730.114-2', '8° Básico B', 'Cuota Zumba',                     20000, 'Transferencia',     'processing'),
  ('TBK-009881', '2026-06-07 09:22', '2026-06-07 09:22', 'Felipe Núñez Castro',       '14.220.876-5', 'IV Medio A',  'Cuota Centro de Padres ×1, Beca', 62000, 'Web Pay · Crédito', 'paid'),
  ('EFE-000142', '2026-06-06 13:10', '2026-06-06 13:10', 'Andrea Soto Lagos',         '17.882.034-9', '6° Básico A', 'Corrida Familiar ×3',             45000, 'Efectivo',          'paid'),
  ('TBK-009870', '2026-06-06 10:48', '2026-06-06 10:48', 'Pablo Herrera Díaz',        '12.654.991-1', 'II Medio C',  'Fútbol Femenino — 1er Sem',       45000, 'Web Pay · Crédito', 'paid'),
  (null,         '2026-06-05 19:03', '2026-06-05 19:03', 'Verónica Maldonado P.',     '15.001.447-7', '7° Básico A', 'Cuota Entrenamiento',             25000, 'Web Pay · Crédito', 'overdue'),
  ('TBK-009844', '2026-06-05 12:15', '2026-06-05 12:15', 'Jorge Bravo Fuentes',       '11.443.882-0', 'V Medio —',   'Cuota Beca de Fallecimiento',     12000, 'Web Pay · Débito',  'paid'),
  (null,         '2026-06-04 16:55', '2026-06-04 16:55', 'Daniela Reyes Olmos',       '18.220.665-4', '5° Básico B', 'Cuota Centro de Padres',          50000, 'Web Pay · Crédito', 'pending'),
  ('TBK-009820', '2026-06-04 08:30', '2026-06-04 08:30', 'Cristián Vega Muñoz',       '13.778.210-6', 'III Medio A', 'Fútbol Masculino — 2do Sem',      45000, 'Web Pay · Crédito', 'paid')
) as v(reference, paid_at, date_label, apoderado, rut, curso, concepts, amount, method, status)
left join public.families f on f.rut = v.rut;

-- ---- Métricas del dashboard ----
insert into public.dashboard_metrics (id, recaudado, recaudado_delta, pagos, pagos_delta, al_dia, pendiente, vencido, ticket)
values (1, 19280000, 12.4, 248, 8.1, 78, 4360000, 1180000, 41600);

-- ---- Recaudación por mes ----
insert into public.monthly_revenue (month, value, sort) values
  ('Ene', 1850000, 0), ('Feb', 2400000, 1), ('Mar', 6200000, 2),
  ('Abr', 4100000, 3), ('May', 3050000, 4), ('Jun', 1680000, 5);

-- ---- Recaudación por concepto ----
insert into public.revenue_by_concept (name, value, color, sort) values
  ('Cuota Centro de Padres', 7350000, '#185FA5', 0),
  ('Fútbol (M/F)',           4860000, '#378ADD', 1),
  ('Entrenamiento',          1750000, '#1D9E75', 2),
  ('Zumba',                   980000, '#BA7517', 3),
  ('Corrida / Eventos',      1290000, '#8A93A2', 4);

-- ---- Usuarios del panel ----
insert into public.app_users (name, role, email, perms, color, sort) values
  ('Patricia Lagos M.', 'Admin / Tesorería', 'tesoreria@cepaciamaria.cl', 'Acceso total',                          'ic-blue',  0),
  ('Comité Directiva',  'Directiva',         'directiva@cepaciamaria.cl', 'Solo lectura · dashboard y reportes',   'ic-green', 1),
  ('Rosa Méndez',       'Operador',          'oficina@cepaciamaria.cl',   'Pagos manuales · recordatorios',        'ic-amber', 2);

-- ---- Log de auditoría ----
insert into public.audit_log (actor, action, when_label) values
  ('Patricia Lagos M.', 'Registró pago en efectivo · EFE-000142',     'Hoy · 13:12'),
  ('Rosa Méndez',       'Envió recordatorio masivo (14 familias)',     'Ayer · 09:00'),
  ('Patricia Lagos M.', 'Editó concepto "Cuota Zumba"',                '06 jun · 18:40');

-- ---- Reglas de recordatorio ----
insert into public.reminder_rules (key, label, enabled, sort) values
  ('before', '3 días antes del vencimiento', true, 0),
  ('due',    'El día del vencimiento',       true, 1),
  ('after',  '3 días después (recargo)',     true, 2);

-- ---- Log de recordatorios ----
insert into public.reminder_log (recipients_label, recipients_count, sent_label, kind, sort) values
  ('Familias morosas · Cuota CEPA',     14, '07 jun 2026 · 09:00', 'Masivo',     0),
  ('Familia Maldonado P.',               1, '06 jun 2026 · 16:20', 'Manual',     1),
  ('Vencimientos próximos (3 días)',    22, '05 jun 2026 · 09:00', 'Automático', 2);

-- ---- Plantilla de email ----
insert into public.email_template (id, subject, body) values (
  1,
  'Recordatorio de pago — Cuota CEPA 2026',
  $tpl$Estimada familia {familia}:

Te recordamos que tienes pendiente el pago de {concepto} por {monto}. Puedes pagarlo en línea con Web Pay (hasta 3 cuotas) desde la plataforma, por transferencia a la cuenta del CEPA, o directamente en la oficina.

Transferencias: Banco Santander · Cuenta Corriente 03-99008-7 · RUT 70.698.300-7 · cepa@cepaciamaria.cl

Gracias,
CEPA · Centro de Padres y Apoderados
Colegio Compañía de María Apoquindo
cepa@cepaciamaria.cl · +56 22 211 6166
"Juntos Somos Comunidad"$tpl$
);
