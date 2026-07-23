'use client';
import { useRouter } from 'next/navigation';

export function LogoutButton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const router = useRouter();
  async function logout() {
    try { await fetch('/api/portal/logout', { method: 'POST' }); } catch {}
    try { sessionStorage.removeItem('cepa_portal_session'); } catch {}
    router.push('/portal/login');
    router.refresh();
  }
  return (
    <button className={className} style={style} onClick={logout}>
      Cerrar sesión
    </button>
  );
}
