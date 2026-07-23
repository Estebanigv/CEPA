/* CEPA · Login del panel admin — valida credenciales y setea cookie httpOnly. */
import { NextResponse } from 'next/server';
import { checkAdminCredentials, setAdminCookie } from '@/lib/server-auth';

export async function POST(req: Request) {
  let user = '';
  let pass = '';
  try {
    const body = await req.json();
    user = String(body.user ?? '');
    pass = String(body.pass ?? '');
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida.' }, { status: 400 });
  }

  if (!checkAdminCredentials(user, pass)) {
    return NextResponse.json({ ok: false, error: 'Credenciales incorrectas.' }, { status: 401 });
  }

  setAdminCookie();
  return NextResponse.json({ ok: true });
}
