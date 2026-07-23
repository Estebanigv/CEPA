/* CEPA · Sesión del portal apoderado (cookie httpOnly con el id de familia). */
import { cookies } from 'next/headers';

const PORTAL_COOKIE = 'cepa_portal_fid';

export function setPortalCookie(familyId: string) {
  cookies().set(PORTAL_COOKIE, familyId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  });
}

export function clearPortalCookie() {
  cookies().delete(PORTAL_COOKIE);
}

export function getPortalFamilyId(): string | null {
  return cookies().get(PORTAL_COOKIE)?.value ?? null;
}
