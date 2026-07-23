/* CEPA · Datos del portal desde el servidor (service_role, bypassa RLS).
 *
 * Identidad del apoderado = RUT (cuando se carguen) con correo como respaldo,
 * ya que la base actual del Centro de Padres sólo trae correos.
 */
import 'server-only';
import { createAdminClient, isSupabaseConfigured } from './supabase/admin';
import type { YearStatus } from './types';

export interface PortalFamily {
  id: string;
  name: string;
  apoderado: string;
  rut: string | null;
  email: string | null;
  padreNombre: string | null;
  padreEmail: string | null;
  madreNombre: string | null;
  madreEmail: string | null;
  telefono: string | null;
  cursos: string | null;
  cepa2026: boolean;
  seguro2026: boolean;
  cepaFolio2026: string | null;
  seguroFolio2026: string | null;
  historial: Record<string, YearStatus>;
  students: { name: string; curso: string | null }[];
}

const FAMILY_COLS =
  'id,name,apoderado,rut,email,padre_nombre,padre_email,madre_nombre,madre_email,telefono,cursos,cepa_2026,seguro_2026,cepa_folio_2026,seguro_folio_2026,historial';

/** Normaliza un RUT a sólo dígitos + dv en minúscula (sin puntos ni guión). */
export function normalizeRut(raw: string): string {
  return raw.replace(/[^0-9kK]/g, '').toLowerCase();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapFamily(f: any, students: any[]): PortalFamily {
  return {
    id: f.id,
    name: f.name,
    apoderado: f.apoderado,
    rut: f.rut ?? null,
    email: f.email ?? null,
    padreNombre: f.padre_nombre ?? null,
    padreEmail: f.padre_email ?? null,
    madreNombre: f.madre_nombre ?? null,
    madreEmail: f.madre_email ?? null,
    telefono: f.telefono ?? null,
    cursos: f.cursos ?? null,
    cepa2026: !!f.cepa_2026,
    seguro2026: !!f.seguro_2026,
    cepaFolio2026: f.cepa_folio_2026 ?? null,
    seguroFolio2026: f.seguro_folio_2026 ?? null,
    historial: (f.historial ?? {}) as Record<string, YearStatus>,
    students: (students ?? []).map((s) => ({ name: s.name, curso: s.curso ?? null })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function withStudents(sb: ReturnType<typeof createAdminClient>, fam: any): Promise<PortalFamily> {
  const { data: students } = await sb
    .from('students')
    .select('name,curso,sort')
    .eq('family_id', fam.id)
    .order('sort');
  return mapFamily(fam, students ?? []);
}

/** Busca la familia por identificador: RUT (normalizado) o correo. */
export async function findFamilyByIdentifier(identifier: string): Promise<PortalFamily | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createAdminClient();
  const id = identifier.trim();

  if (id.includes('@')) {
    const email = id.toLowerCase();
    const { data } = await sb
      .from('families')
      .select(FAMILY_COLS)
      .or(`email.ilike.${email},padre_email.ilike.${email},madre_email.ilike.${email}`)
      .limit(1);
    if (data && data.length) return withStudents(sb, data[0]);
    return null;
  }

  const rut = normalizeRut(id);
  if (!rut) return null;
  const { data } = await sb.from('families').select(FAMILY_COLS).eq('rut', rut).limit(1);
  if (data && data.length) return withStudents(sb, data[0]);
  return null;
}

/** Carga la familia por id (para las páginas del portal ya autenticado). */
export async function getFamilyById(id: string): Promise<PortalFamily | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createAdminClient();
  const { data } = await sb.from('families').select(FAMILY_COLS).eq('id', id).limit(1);
  if (data && data.length) return withStudents(sb, data[0]);
  return null;
}
