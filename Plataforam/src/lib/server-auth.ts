/* CEPA · Autenticación de servidor (cookies httpOnly).
 *
 * Reemplaza el "login" de sessionStorage (solo navegador) por una cookie
 * httpOnly que el servidor puede verificar antes de entregar datos reales.
 * Es un gate mínimo apropiado para una herramienta interna; el milestone de
 * producción es migrar a Supabase Auth con políticas RLS por rol.
 */
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'cepa_admin';
const ADMIN_TOKEN = 'ok';

/** Usuario/clave del panel (configurables por entorno). Acceso de prueba: admin / 1234. */
export const ADMIN_USER = process.env.ADMIN_USER ?? 'admin';
export const ADMIN_PASS = process.env.ADMIN_PASS ?? '1234';

export function checkAdminCredentials(user: string, pass: string): boolean {
  const u = user.trim();
  // Acepta el usuario configurado y también el acceso histórico cepa/222.
  return (u === ADMIN_USER && pass === ADMIN_PASS) || (u === 'cepa' && pass === '222');
}

export function setAdminCookie() {
  cookies().set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  });
}

export function clearAdminCookie() {
  cookies().delete(ADMIN_COOKIE);
}

export function isAdminAuthed(): boolean {
  return cookies().get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
}
