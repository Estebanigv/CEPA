const KEY = 'cepa_admin_session';
const ADMIN_USER = 'cepa';
const ADMIN_PASS = '222';

export function adminLogin(user: string, pass: string): boolean {
  if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
    if (typeof window !== 'undefined') sessionStorage.setItem(KEY, '1');
    return true;
  }
  return false;
}

export function getAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(KEY) === '1';
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(KEY);
}
