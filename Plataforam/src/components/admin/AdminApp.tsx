'use client';
/* CEPA · Panel de Administración — shell (sidebar + topbar + ruteo de vistas + toast) */
import { useRef, useState } from 'react';
import { Icon } from './Icon';
import { Dashboard } from './Dashboard';
import { Pagos } from './Pagos';
import { Familias } from './Familias';
import { Conceptos } from './Conceptos';
import { Cobranza } from './Cobranza';
import { Reportes } from './Reportes';
import { Usuarios } from './Usuarios';
import { AdminChatbot } from './AdminChatbot';
import { clearAdminSession } from '@/lib/admin-session';
import { useRouter } from 'next/navigation';
import type { AdminData, IconName, Transaction } from '@/lib/types';

type ViewId = 'dashboard' | 'pagos' | 'familias' | 'conceptos' | 'cobranza' | 'reportes' | 'usuarios';

type NavItem = { sec: string } | { id: ViewId; icon: IconName; label: string; count?: number };

const NAV: NavItem[] = [
  { sec: 'Gestión' },
  { id: 'dashboard', icon: 'grid', label: 'Dashboard' },
  { id: 'pagos', icon: 'wallet', label: 'Pagos / Contabilidad' },
  { id: 'familias', icon: 'users', label: 'Apoderados / Familias' },
  { id: 'conceptos', icon: 'tag', label: 'Conceptos de pago' },
  { sec: 'Operación' },
  { id: 'cobranza', icon: 'bell', label: 'Cobranza', count: 14 },
  { id: 'reportes', icon: 'chart', label: 'Reportes' },
  { id: 'usuarios', icon: 'shieldUser', label: 'Roles y usuarios' },
];

const META: Record<ViewId, { t: string; s: string }> = {
  dashboard: { t: 'Dashboard', s: 'Resumen de recaudación y cobranza' },
  pagos: { t: 'Pagos / Contabilidad', s: 'Tabla maestra de transacciones' },
  familias: { t: 'Apoderados / Familias', s: 'Estado consolidado por familia' },
  conceptos: { t: 'Conceptos de pago', s: 'Catálogo configurable' },
  cobranza: { t: 'Cobranza y recordatorios', s: 'Automatización y plantillas' },
  reportes: { t: 'Reportes', s: 'Exportables para tesorería' },
  usuarios: { t: 'Roles y usuarios', s: 'Permisos y auditoría' },
};

export function AdminApp({ data }: { data: AdminData }) {
  const router = useRouter();
  const [view, setView] = useState<ViewId>('dashboard');
  const [openTx, setOpenTx] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };
  const meta = META[view];

  const go = (v: ViewId) => {
    setOpenTx(null);
    setView(v);
  };

  let screen: React.ReactNode = null;
  if (view === 'dashboard')
    screen = (
      <Dashboard
        data={data}
        onOpenTx={(t) => {
          setView('pagos');
          setOpenTx(t && t.id ? t : null);
        }}
        onGoFamilias={() => go('familias')}
      />
    );
  else if (view === 'pagos') screen = <Pagos data={data} openTx={openTx} onOpenTx={setOpenTx} />;
  else if (view === 'familias') screen = <Familias data={data} onToast={showToast} />;
  else if (view === 'conceptos') screen = <Conceptos concepts={data.concepts} />;
  else if (view === 'cobranza') screen = <Cobranza onToast={showToast} />;
  else if (view === 'reportes') screen = <Reportes onToast={showToast} />;
  else if (view === 'usuarios') screen = <Usuarios />;

  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">
            <Icon name="shieldUser" size={20} />
            <small>CEPA</small>
          </div>
          <div className="sb-brand-txt">
            <b>CEPA Admin</b>
            <span>Compañía de María Apoquindo</span>
          </div>
        </div>
        <nav className="sb-nav">
          {NAV.map((n, i) =>
            'sec' in n ? (
              <div className="sb-section" key={i}>
                {n.sec}
              </div>
            ) : (
              <button
                key={n.id}
                className={'sb-link' + (view === n.id ? ' sb-link--on' : '')}
                onClick={() => go(n.id)}
              >
                <Icon name={n.icon} size={19} /> {n.label}
                {n.count ? <span className="sb-count">{n.count}</span> : null}
              </button>
            ),
          )}
        </nav>
        <div className="sb-user">
          <div className="sb-av">PL</div>
          <div className="sb-user-txt">
            <b>Patricia Lagos M.</b>
            <span>Tesorería</span>
          </div>
          <button
            className="x-btn"
            style={{ width: 32, height: 32, marginLeft: 'auto' }}
            title="Cerrar sesión"
            onClick={() => { clearAdminSession(); router.push('/admin/login'); }}
          >
            <Icon name="logout" size={16} />
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{meta.t}</h1>
            <div className="tb-sub">{meta.s}</div>
          </div>
          <div className="topbar-actions">
            <div className="period">
              Período{' '}
              <select>
                <option>Año 2026</option>
                <option>1er semestre</option>
                <option>Junio 2026</option>
              </select>
            </div>
            <div className="search">
              <Icon name="search" size={17} />
              <input className="input" placeholder="Buscar…" />
            </div>
            <button
              onClick={() => { clearAdminSession(); router.push('/admin/login'); }}
              title="Cerrar sesión"
              style={{
                marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: '1px solid var(--bd)', borderRadius: 10,
                padding: '6px 12px', fontSize: 12.5, color: 'var(--muted)',
                cursor: 'pointer', fontFamily: 'inherit', transition: '.13s',
              }}
            >
              <Icon name="logout" size={14} />
              Salir
            </button>
          </div>
        </header>
        {screen}
      </main>

      {toast && (
        <div className="toast">
          <Icon name="check" size={16} stroke={2.4} /> {toast}
        </div>
      )}
      <AdminChatbot />
    </div>
  );
}
