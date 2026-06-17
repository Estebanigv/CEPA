/* CEPA · Gestión de sesión del portal apoderado (localStorage mock) */
import type { PortalUser } from './portal-types';
import { MOCK_USER } from './portal-data';

const KEY = 'cepa_portal_session';

export function getSession(): PortalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(user: PortalUser) {
  sessionStorage.setItem(KEY, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}

/** Valida RUT format y acepta cualquier contraseña no vacía (demo). */
export function authenticate(rut: string, password: string): PortalUser | null {
  if (!rut.trim() || !password.trim()) return null;
  // Demo: devuelve usuario mock para cualquier RUT con contraseña válida
  const user: PortalUser = { ...MOCK_USER, rut: rut.trim() };
  return user;
}
