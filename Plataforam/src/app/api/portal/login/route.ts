/* CEPA · Login del portal apoderado.
 *
 * Por ahora los apoderados entran con su CORREO (que sí está en la base) y una
 * contraseña única temporal (PORTAL_PASSWORD, por defecto "12334"). El RUT
 * también sirve como identificador cuando se carguen. El próximo milestone es
 * Supabase Auth con contraseña individual por apoderado.
 */
import { NextResponse } from 'next/server';
import { findFamilyByIdentifier } from '@/lib/portal-server-data';
import { setPortalCookie } from '@/lib/portal-auth';

/** Contraseña única temporal para todos los apoderados (configurable por entorno). */
const PORTAL_PASSWORD = process.env.PORTAL_PASSWORD ?? '1234';

export async function POST(req: Request) {
  let rut = '';
  let pwd = '';
  try {
    const body = await req.json();
    rut = String(body.rut ?? '').trim();
    pwd = String(body.pwd ?? '');
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida.' }, { status: 400 });
  }

  if (!rut || !pwd) {
    return NextResponse.json({ ok: false, error: 'Ingresa tu correo y contraseña.' }, { status: 400 });
  }

  if (pwd !== PORTAL_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'Contraseña incorrecta.' }, { status: 401 });
  }

  const fam = await findFamilyByIdentifier(rut);
  if (!fam) {
    return NextResponse.json(
      { ok: false, error: 'No encontramos una familia con ese correo o RUT.' },
      { status: 404 },
    );
  }

  setPortalCookie(fam.id);
  return NextResponse.json({
    ok: true,
    user: {
      name: fam.apoderado,
      rut: fam.rut ?? '',
      email: fam.email ?? '',
      cursos: fam.cursos ? fam.cursos.split(' · ') : [],
      students: fam.students.map((s) => (s.curso ? `${s.name} (${s.curso})` : s.name)),
    },
  });
}
