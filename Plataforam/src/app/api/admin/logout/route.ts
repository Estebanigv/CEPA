/* CEPA · Logout del panel admin — limpia la cookie httpOnly. */
import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/server-auth';

export async function POST() {
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}
