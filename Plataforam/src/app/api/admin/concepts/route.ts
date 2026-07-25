/* CEPA · Guardar/crear concepto de pago (admin, escribe en la base con service_role). */
import { NextResponse } from 'next/server';
import { isAdminAuthed } from '@/lib/server-auth';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28);
  return base || 'concepto';
}

export async function POST(req: Request) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'La base no está configurada.' }, { status: 503 });
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida.' }, { status: 400 });
  }

  const name = String(b.name ?? '').trim();
  if (!name) {
    return NextResponse.json({ ok: false, error: 'El nombre del concepto es obligatorio.' }, { status: 400 });
  }

  const id = b.id ? String(b.id) : `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
  const row = {
    id,
    name,
    category: String(b.cat ?? 'Cuotas institucionales'),
    icon: String(b.icon ?? 'tag'),
    amount: Math.max(0, Math.round(Number(b.amount) || 0)),
    scope: String(b.scope ?? 'Por familia'),
    validity: String(b.vig ?? 'Anual 2026'),
    cuotas: Math.min(12, Math.max(1, Math.round(Number(b.cuotas) || 1))),
    active: Boolean(b.active),
  };

  const sb = createAdminClient();
  const { error } = await sb.from('concepts').upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('[CEPA] Error guardando concepto:', error);
    return NextResponse.json({ ok: false, error: 'No se pudo guardar el concepto.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    concept: {
      id: row.id, name: row.name, cat: row.category, icon: row.icon,
      amount: row.amount, scope: row.scope, vig: row.validity, cuotas: row.cuotas, active: row.active,
    },
  });
}
