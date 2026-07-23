/* CEPA · Logout del portal apoderado — limpia la cookie httpOnly. */
import { NextResponse } from 'next/server';
import { clearPortalCookie } from '@/lib/portal-auth';

export async function POST() {
  clearPortalCookie();
  return NextResponse.json({ ok: true });
}
