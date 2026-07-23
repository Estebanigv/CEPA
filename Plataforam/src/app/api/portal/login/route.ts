/* CEPA · Login del portal apoderado.
 *
 * Busca la familia por RUT (o correo, mientras no haya RUT cargado) y setea
 * una cookie httpOnly con su id. La contraseña aún no se valida contra nada
 * (no hay credenciales en la base del Centro de Padres): es el próximo
 * milestone (Supabase Auth). Por ahora basta identificar a la familia.
 */
import { NextResponse } from 'next/server';
import { findFamilyByIdentifier } from '@/lib/portal-server-data';
import { setPortalCookie } from '@/lib/portal-auth';

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
    return NextResponse.json({ ok: false, error: 'Ingresa tu RUT y contraseña.' }, { status: 400 });
  }

  const fam = await findFamilyByIdentifier(rut);
  if (!fam) {
    return NextResponse.json(
      { ok: false, error: 'No encontramos una familia con ese RUT o correo.' },
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
