'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/portal-session';
import { HISTORY, fmtMoney, fmtDate } from '@/lib/portal-data';
import { PortalHeader } from '@/components/portal/PortalHeader';
import type { PortalUser } from '@/lib/portal-types';

export default function MisPagosPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/portal/login'); return; }
    setUser(s);
  }, [router]);

  const filtered = HISTORY.filter(h =>
    h.concepts.toLowerCase().includes(search.toLowerCase()) ||
    h.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-soft)' }}>
      <PortalHeader user={user} active="mis-pagos" />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Mis pagos</h1>
            <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Historial de transacciones de tu familia.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-faint)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="input"
              style={{ paddingLeft: 38, width: 240 }}
              placeholder="Buscar concepto o N°…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Resumen rápido */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total pagado 2026', value: fmtMoney(HISTORY.reduce((s, h) => s + h.amount, 0)), color: 'var(--color-pay)' },
            { label: 'Transacciones', value: String(HISTORY.length), color: 'var(--color-primary)' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-soft)' }}>
                {['Fecha', 'Concepto(s)', 'Monto', 'Medio', 'Estado', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--color-muted)' }}>
                    No se encontraron pagos.
                  </td>
                </tr>
              ) : filtered.map((h, i) => (
                <tr key={h.id} style={{ borderTop: i > 0 ? '1px solid var(--color-line-soft)' : undefined }}>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 500 }}>{fmtDate(h.date)}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-muted)' }}>{h.id}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{h.concepts}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtMoney(h.amount)}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{h.method}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge--${h.status}`}>
                      {h.status === 'paid' ? (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Pagado</>
                      ) : (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Procesando</>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button className="btn btn--ghost btn--sm" style={{ fontSize: 12 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
