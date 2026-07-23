/* CEPA Admin · capa de datos.
 *
 * `getAdminData()` es el punto único de carga del panel:
 *   - Si hay credenciales de Supabase en el entorno  -> lee de la base real.
 *   - Si no (o si la consulta falla)                 -> usa los datos de ejemplo
 *                                                       (idénticos al prototipo del handoff).
 *
 * La UI siempre consume `AdminData` tipado, así que conectar Supabase no cambia
 * ningún componente.
 */

import type {
  AdminData,
  Concept,
  ConceptShare,
  Family,
  Kpis,
  MonthPoint,
  Transaction,
} from './types';
import { createAdminClient, isSupabaseConfigured } from './supabase/admin';

/* =========================================================================
   Datos de ejemplo (placeholder — idénticos al prototipo)
   ========================================================================= */

/* ---- Conceptos (catálogo configurable) ---- */
export const CONCEPTS: Concept[] = [
  { id: 'cepa', name: 'Cuota Centro de Padres', cat: 'Cuotas institucionales', icon: 'building', amount: 50000, scope: 'Por familia', vig: 'Anual 2026', cuotas: 3, active: true },
  { id: 'beca', name: 'Cuota Beca de Fallecimiento', cat: 'Cuotas institucionales', icon: 'heart', amount: 12000, scope: 'Por familia', vig: 'Anual 2026', cuotas: 1, active: true },
  { id: 'futm1', name: 'Fútbol Masculino — 1er Semestre', cat: 'Deportes', icon: 'ball', amount: 45000, scope: 'Por estudiante', vig: '1er semestre', cuotas: 1, active: true },
  { id: 'futm2', name: 'Fútbol Masculino — 2do Semestre', cat: 'Deportes', icon: 'ball', amount: 45000, scope: 'Por estudiante', vig: '2do semestre', cuotas: 1, active: true },
  { id: 'futf1', name: 'Fútbol Femenino — 1er Semestre', cat: 'Deportes', icon: 'ball', amount: 45000, scope: 'Por estudiante', vig: '1er semestre', cuotas: 1, active: true },
  { id: 'futf2', name: 'Fútbol Femenino — 2do Semestre', cat: 'Deportes', icon: 'ball', amount: 45000, scope: 'Por estudiante', vig: '2do semestre', cuotas: 1, active: false },
  { id: 'entrena', name: 'Cuota Entrenamiento', cat: 'Deportes', icon: 'run', amount: 25000, scope: 'Por estudiante', vig: 'Mensual', cuotas: 1, active: true },
  { id: 'zumba', name: 'Cuota Zumba', cat: 'Deportes', icon: 'music', amount: 20000, scope: 'Por persona', vig: 'Mensual', cuotas: 1, active: true },
  { id: 'corrida', name: 'Corrida Familiar CEPA', cat: 'Eventos', icon: 'run', amount: 15000, scope: 'Por persona', vig: 'Evento único', cuotas: 1, active: true },
];

/* ---- Recaudación por mes (placeholder) ---- */
export const MONTHLY: MonthPoint[] = [
  { m: 'Ene', v: 1850000 }, { m: 'Feb', v: 2400000 }, { m: 'Mar', v: 6200000 }, { m: 'Abr', v: 4100000 },
  { m: 'May', v: 3050000 }, { m: 'Jun', v: 1680000 },
];

/* ---- Recaudación por concepto ---- */
export const BY_CONCEPT: ConceptShare[] = [
  { name: 'Cuota Centro de Padres', v: 7350000, color: '#185FA5' },
  { name: 'Fútbol (M/F)', v: 4860000, color: '#378ADD' },
  { name: 'Entrenamiento', v: 1750000, color: '#1D9E75' },
  { name: 'Zumba', v: 980000, color: '#BA7517' },
  { name: 'Corrida / Eventos', v: 1290000, color: '#8A93A2' },
];

/* ---- Transacciones (tabla maestra) ---- */
export const METHODS: string[] = ['Web Pay · Crédito', 'Web Pay · Débito', 'Transferencia', 'Efectivo'];

export const TX: Transaction[] = [
  { id: 'TBK-009912', date: '2026-06-08 14:32', name: 'María José Pérez González', rut: '15.482.391-7', curso: 'III Medio B', concepts: 'Cuota Centro de Padres', amount: 50000, method: 'Web Pay · Crédito', status: 'paid' },
  { id: 'TBK-009908', date: '2026-06-08 11:05', name: 'Rodrigo Salinas Vera', rut: '13.099.522-K', curso: 'I Medio A', concepts: 'Fútbol Masculino — 1er Sem', amount: 45000, method: 'Web Pay · Débito', status: 'paid' },
  { id: '—', date: '2026-06-07 17:40', name: 'Carolina Tapia Ríos', rut: '16.730.114-2', curso: '8° Básico B', concepts: 'Cuota Zumba', amount: 20000, method: 'Transferencia', status: 'processing' },
  { id: 'TBK-009881', date: '2026-06-07 09:22', name: 'Felipe Núñez Castro', rut: '14.220.876-5', curso: 'IV Medio A', concepts: 'Cuota Centro de Padres ×1, Beca', amount: 62000, method: 'Web Pay · Crédito', status: 'paid' },
  { id: 'EFE-000142', date: '2026-06-06 13:10', name: 'Andrea Soto Lagos', rut: '17.882.034-9', curso: '6° Básico A', concepts: 'Corrida Familiar ×3', amount: 45000, method: 'Efectivo', status: 'paid' },
  { id: 'TBK-009870', date: '2026-06-06 10:48', name: 'Pablo Herrera Díaz', rut: '12.654.991-1', curso: 'II Medio C', concepts: 'Fútbol Femenino — 1er Sem', amount: 45000, method: 'Web Pay · Crédito', status: 'paid' },
  { id: '—', date: '2026-06-05 19:03', name: 'Verónica Maldonado P.', rut: '15.001.447-7', curso: '7° Básico A', concepts: 'Cuota Entrenamiento', amount: 25000, method: 'Web Pay · Crédito', status: 'overdue' },
  { id: 'TBK-009844', date: '2026-06-05 12:15', name: 'Jorge Bravo Fuentes', rut: '11.443.882-0', curso: 'V Medio —', concepts: 'Cuota Beca de Fallecimiento', amount: 12000, method: 'Web Pay · Débito', status: 'paid' },
  { id: '—', date: '2026-06-04 16:55', name: 'Daniela Reyes Olmos', rut: '18.220.665-4', curso: '5° Básico B', concepts: 'Cuota Centro de Padres', amount: 50000, method: 'Web Pay · Crédito', status: 'pending' },
  { id: 'TBK-009820', date: '2026-06-04 08:30', name: 'Cristián Vega Muñoz', rut: '13.778.210-6', curso: 'III Medio A', concepts: 'Fútbol Masculino — 2do Sem', amount: 45000, method: 'Web Pay · Crédito', status: 'paid' },
];

/* ---- Familias ---- */
export const FAMILIES: Family[] = [
  { id: '1', name: 'Familia Pérez González', apoderado: 'María José Pérez González', rut: '15.482.391-7', email: 'mj.perez@email.cl', cursos: 'III Medio B · 7° Básico A', students: ['Tomás Pérez (III Medio B)', 'Isidora Pérez (7° Básico A)'], status: 'pending', aportado: 66666, pend: 62000 },
  { id: '2', name: 'Familia Salinas Vera', apoderado: 'Rodrigo Salinas Vera', rut: '13.099.522-K', email: 'r.salinas@email.cl', cursos: 'I Medio A', students: ['Matías Salinas (I Medio A)'], status: 'paid', aportado: 95000, pend: 0 },
  { id: '3', name: 'Familia Núñez Castro', apoderado: 'Felipe Núñez Castro', rut: '14.220.876-5', email: 'f.nunez@email.cl', cursos: 'IV Medio A', students: ['Javiera Núñez (IV Medio A)'], status: 'paid', aportado: 62000, pend: 0 },
  { id: '4', name: 'Familia Maldonado P.', apoderado: 'Verónica Maldonado P.', rut: '15.001.447-7', email: 'v.maldonado@email.cl', cursos: '7° Básico A · 5° Básico B', students: ['Benjamín Maldonado (7° B A)', 'Emilia Maldonado (5° B B)'], status: 'overdue', aportado: 20000, pend: 95000 },
  { id: '5', name: 'Familia Tapia Ríos', apoderado: 'Carolina Tapia Ríos', rut: '16.730.114-2', email: 'c.tapia@email.cl', cursos: '8° Básico B', students: ['Vicente Tapia (8° Básico B)'], status: 'pending', aportado: 20000, pend: 50000 },
  { id: '6', name: 'Familia Soto Lagos', apoderado: 'Andrea Soto Lagos', rut: '17.882.034-9', email: 'a.soto@email.cl', cursos: '6° Básico A', students: ['Florencia Soto (6° Básico A)'], status: 'paid', aportado: 110000, pend: 0 },
];

export const KPIS: Kpis = {
  recaudado: 19280000, recaudadoDelta: 12.4,
  pagos: 248, pagosDelta: 8.1,
  alDia: 78,
  pendiente: 4360000, vencido: 1180000,
  ticket: 41600,
};

const MOCK: AdminData = {
  kpis: KPIS,
  monthly: MONTHLY,
  byConcept: BY_CONCEPT,
  transactions: TX,
  methods: METHODS,
  families: FAMILIES,
  concepts: CONCEPTS,
};

/* =========================================================================
   Lectura desde Supabase (cuando hay credenciales)
   ========================================================================= */

/** Forma cruda de una fila de `families` en Supabase (post-migración 0002). */
type FamilyRow = {
  id: string;
  name: string;
  apoderado: string;
  rut: string | null;
  email: string | null;
  cursos: string | null;
  status: Family['status'];
  aportado: number;
  pend: number;
  padre_nombre: string | null;
  padre_email: string | null;
  madre_nombre: string | null;
  madre_email: string | null;
  telefono: string | null;
  cepa_2026: boolean;
  seguro_2026: boolean;
  cepa_folio_2026: string | null;
  seguro_folio_2026: string | null;
  historial: Record<string, unknown> | null;
};

/* Monto nominal de referencia por cuota (el Excel no registra montos reales). */
const CEPA_AMOUNT = 50000;
const SEGURO_AMOUNT = 8000;

/** KPIs de cobertura calculados desde las familias reales. */
function computeKpis(rows: FamilyRow[]): Kpis {
  const total = rows.length || 1;
  const cepaOk = rows.filter((f) => f.cepa_2026).length;
  const segOk = rows.filter((f) => f.seguro_2026).length;
  const pend = rows.filter((f) => f.status !== 'paid').length;
  const recaudado = cepaOk * CEPA_AMOUNT + segOk * SEGURO_AMOUNT;
  return {
    recaudado,
    recaudadoDelta: 0,
    pagos: cepaOk + segOk,
    pagosDelta: 0,
    alDia: Math.round((cepaOk / total) * 100),
    pendiente: pend * CEPA_AMOUNT,
    vencido: 0,
    ticket: cepaOk ? Math.round(recaudado / (cepaOk + segOk || 1)) : 0,
  };
}

/** Recaudación (nominal) por concepto — CEPA vs Seguro, según cobertura 2026. */
function computeByConcept(rows: FamilyRow[]): ConceptShare[] {
  const cepaOk = rows.filter((f) => f.cepa_2026).length;
  const segOk = rows.filter((f) => f.seguro_2026).length;
  return [
    { name: 'Cuota Centro de Padres', v: cepaOk * CEPA_AMOUNT, color: '#185FA5' },
    { name: 'Seguro Escolar', v: segOk * SEGURO_AMOUNT, color: '#1D9E75' },
  ];
}

async function fetchFromSupabase(): Promise<AdminData> {
  const sb = createAdminClient();

  const [concepts, families, students, transactions, metrics, monthly, byConcept] = await Promise.all([
    sb.from('concepts').select('*').order('sort'),
    sb.from('families').select('*').order('sort'),
    sb.from('students').select('*').order('sort'),
    sb.from('transactions').select('*').order('paid_at', { ascending: false }),
    sb.from('dashboard_metrics').select('*').eq('id', 1).maybeSingle(),
    sb.from('monthly_revenue').select('*').order('sort'),
    sb.from('revenue_by_concept').select('*').order('sort'),
  ]);

  for (const r of [concepts, families, students, transactions, metrics, monthly, byConcept]) {
    if (r.error) throw r.error;
  }

  const studentRows = (students.data ?? []) as Array<{ family_id: string; name: string; curso: string | null }>;
  const familyRows = (families.data ?? []) as FamilyRow[];

  /* KPIs y gráficos calculados desde la data real de familias (el Excel no trae
     montos ni transacciones individuales; medimos cobertura de las cuotas 2026). */
  const realKpis = computeKpis(familyRows);
  const realByConcept = computeByConcept(familyRows);
  const hasMonthly = (monthly.data ?? []).length > 0;

  return {
    kpis: metrics.data ? mapKpis(metrics.data) : realKpis,
    monthly: hasMonthly ? (monthly.data ?? []).map((m): MonthPoint => ({ m: m.month, v: m.value })) : MONTHLY,
    byConcept: (byConcept.data ?? []).length > 0
      ? (byConcept.data ?? []).map((c): ConceptShare => ({ name: c.name, v: c.value, color: c.color }))
      : realByConcept,
    transactions: (transactions.data ?? []).map(
      (t): Transaction => ({
        id: t.reference ?? '—',
        date: t.date_label,
        name: t.apoderado,
        rut: t.rut,
        curso: t.curso,
        concepts: t.concepts,
        amount: t.amount,
        method: t.method,
        status: t.status,
      }),
    ),
    methods: METHODS,
    families: familyRows.map(
      (f): Family => ({
        id: f.id,
        name: f.name,
        apoderado: f.apoderado,
        rut: f.rut ?? '—',
        email: f.email ?? '',
        cursos: f.cursos ?? '',
        students: studentRows
          .filter((s) => s.family_id === f.id)
          .map((s) => (s.curso ? `${s.name} (${s.curso})` : s.name)),
        status: f.status,
        aportado: f.aportado,
        pend: f.pend,
        padreNombre: f.padre_nombre,
        padreEmail: f.padre_email,
        madreNombre: f.madre_nombre,
        madreEmail: f.madre_email,
        telefono: f.telefono,
        cepa2026: f.cepa_2026,
        seguro2026: f.seguro_2026,
        cepaFolio2026: f.cepa_folio_2026,
        seguroFolio2026: f.seguro_folio_2026,
        historial: (f.historial ?? {}) as Family['historial'],
      }),
    ),
    concepts: (concepts.data ?? []).map(
      (c): Concept => ({
        id: c.id,
        name: c.name,
        cat: c.category,
        icon: c.icon,
        amount: c.amount,
        scope: c.scope,
        vig: c.validity,
        cuotas: c.cuotas,
        active: c.active,
      }),
    ),
  };
}

function mapKpis(m: Record<string, number> | null): Kpis {
  if (!m) return KPIS;
  return {
    recaudado: m.recaudado,
    recaudadoDelta: m.recaudado_delta,
    pagos: m.pagos,
    pagosDelta: m.pagos_delta,
    alDia: m.al_dia,
    pendiente: m.pendiente,
    vencido: m.vencido,
    ticket: m.ticket,
  };
}

/**
 * Punto único de carga de datos del panel.
 * Usa Supabase si está configurado; si no (o si falla), cae a datos de ejemplo.
 */
export async function getAdminData(): Promise<AdminData> {
  if (isSupabaseConfigured()) {
    try {
      return await fetchFromSupabase();
    } catch (err) {
      console.warn('[CEPA] No se pudo leer de Supabase, usando datos de ejemplo:', err);
    }
  }
  return MOCK;
}
