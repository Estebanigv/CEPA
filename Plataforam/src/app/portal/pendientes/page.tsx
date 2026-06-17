'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/portal-session';
import { PENDING, CONCEPTS, fmtMoney } from '@/lib/portal-data';
import { PortalHeader } from '@/components/portal/PortalHeader';
import type { PortalUser, CartItem } from '@/lib/portal-types';

export default function PendientesPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/portal/login'); return; }
    setUser(s);
  }, [router]);

  function payNow(ids: string[]) {
    const newItems: CartItem[] = ids.map(id => {
      const p = PENDING.find(x => x.id === id)!;
      const c = CONCEPTS.find(x => x.id === p.conceptId)!;
      return { conceptId: p.conceptId, name: p.name, amount: p.amount, qty: 1, scope: c?.scope || 'Por familia' };
    });
    try {
      const saved = sessionStorage.getItem('cepa_cart');
      const existing: CartItem[] = saved ? JSON.parse(saved) : [];
      const merged = [...existing];
      for (const item of newItems) {
        if (!merged.find(e => e.conceptId === item.conceptId)) {
          merged.push(item);
        }
      }
      sessionStorage.setItem('cepa_cart', JSON.stringify(merged));
    } catch {
      sessionStorage.setItem('cepa_cart', JSON.stringify(newItems));
    }
    router.push('/portal/revision');
  }

  const totalPendiente = PENDING.reduce((s, p) => s + p.amount, 0);
  const hasOverdue = PENDING.some(p => p.status === 'overdue');

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-soft)' }}>
      <PortalHeader user={user} active="pendientes" />

      <main style={{ maxWidth: 740, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Pagos pendientes</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Cuotas y actividades con pago pendiente de tu familia.
          </p>
        </div>

        {hasOverdue && (
          <div style={{
            background: 'var(--danger-100)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)',
            padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--danger)' }}>Tienes pagos vencidos</div>
              <div style={{ fontSize: 13, color: 'var(--danger)', marginTop: 2 }}>
                Regulariza tus pagos para evitar inconvenientes.
              </div>
            </div>
          </div>
        )}

        {/* Total banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%)',
          borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: '#fff',
        }}>
          <div>
            <div style={{ fontSize: 13, opacity: .8 }}>Total pendiente</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{fmtMoney(totalPendiente)}</div>
          </div>
          <button
            onClick={() => payNow(PENDING.map(p => p.id))}
            className="btn"
            style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700, height: 46, paddingLeft: 20, paddingRight: 20 }}
          >
            Pagar todo ahora
          </button>
        </div>

        {/* Lista de pendientes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PENDING.map(p => {
            const dueDate = new Date(p.due);
            const today = new Date('2026-06-17');
            const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
            return (
              <div key={p.id} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</span>
                      <span className={`badge badge--${p.status}`}>
                        {p.status === 'overdue' ? (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Vencido</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Pendiente</>
                        )}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      Vence el {dueDate.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
                      {' · '}
                      <span style={{ color: p.status === 'overdue' ? 'var(--danger)' : daysLeft <= 7 ? 'var(--warn)' : 'var(--color-muted)', fontWeight: 600 }}>
                        {p.status === 'overdue' ? `Venció hace ${Math.abs(daysLeft)} días` : daysLeft <= 7 ? `${daysLeft} días restantes` : `${daysLeft} días restantes`}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{fmtMoney(p.amount)}</div>
                    <button
                      onClick={() => payNow([p.id])}
                      className="btn btn--pay btn--sm"
                    >
                      Pagar ahora
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {PENDING.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--color-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-pay)' }}>¡Todo al día!</h2>
            <p style={{ fontSize: 14, marginTop: 8 }}>No tienes pagos pendientes.</p>
          </div>
        )}
      </main>
    </div>
  );
}
