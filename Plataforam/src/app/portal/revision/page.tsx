'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/portal-session';
import { fmtMoney } from '@/lib/portal-data';
import { PortalHeader } from '@/components/portal/PortalHeader';
import type { PortalUser, CartItem } from '@/lib/portal-types';

const METHODS = [
  { id: 'credit', label: 'WebPay · Tarjeta de crédito', sub: 'Hasta 3 cuotas precio contado', icon: 'credit' },
  { id: 'debit', label: 'WebPay · Tarjeta de débito', sub: 'Débito inmediato', icon: 'debit' },
];

const STEPS = ['Selección', 'Revisión', 'Pago', 'Comprobante'];

export default function RevisionPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState('credit');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/portal/login'); return; }
    setUser(s);
    try {
      const saved = sessionStorage.getItem('cepa_cart');
      const items = saved ? JSON.parse(saved) : [];
      if (items.length === 0) { router.replace('/portal/conceptos'); return; }
      setCart(items);
    } catch {
      router.replace('/portal/conceptos');
    }
  }, [router]);

  const total = cart.reduce((s, i) => s + i.amount * i.qty, 0);

  async function pay() {
    if (!confirmed) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    sessionStorage.setItem('cepa_cart', '[]');
    sessionStorage.setItem('cepa_last_tx', JSON.stringify({
      id: 'TBK-' + (Math.floor(Math.random() * 90000) + 10000),
      amount: total,
      method: method === 'credit' ? 'Web Pay · Crédito' : 'Web Pay · Débito',
      items: cart,
      date: new Date().toISOString(),
    }));
    router.push('/portal/pago/retorno?estado=exito');
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-soft)' }}>
      <PortalHeader user={user} active="conceptos" />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36, gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  background: i < 2 ? 'var(--color-primary)' : i === 2 ? 'var(--color-primary)' : 'var(--color-line)',
                  color: i <= 2 ? '#fff' : 'var(--color-muted)', fontSize: 13, fontWeight: 700,
                }}>
                  {i < 1 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
                </div>
                <div style={{ fontSize: 11.5, marginTop: 6, fontWeight: i === 1 ? 600 : 400, color: i <= 1 ? 'var(--color-primary)' : 'var(--color-muted)' }}>
                  {s}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < 1 ? 'var(--color-primary)' : 'var(--color-line)', margin: '0 8px', marginBottom: 22 }} />
              )}
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Revisión y pago</h1>

        {/* Datos de la familia */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Datos del apoderado
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--color-muted)' }}>Nombre</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--color-muted)' }}>RUT</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.rut}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--color-muted)' }}>Email</div>
              <input className="input" style={{ fontSize: 13, height: 36, marginTop: 4 }} defaultValue={user.email} />
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--color-muted)' }}>Cursos</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.cursos.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Detalle conceptos */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Detalle del pago
          </div>
          {cart.map(item => (
            <div key={item.conceptId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-line-soft)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{item.scope} × {item.qty}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{fmtMoney(item.amount * item.qty)}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, fontWeight: 700 }}>
            <span style={{ fontSize: 16 }}>Total a pagar</span>
            <span style={{ fontSize: 22, color: 'var(--color-pay)' }}>{fmtMoney(total)}</span>
          </div>
        </div>

        {/* Medio de pago */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Medio de pago
          </div>
          {METHODS.map(m => (
            <label key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', cursor: 'pointer',
              border: `2px solid ${method === m.id ? 'var(--color-primary)' : 'var(--color-line)'}`,
              borderRadius: 'var(--radius-md)', marginBottom: 10,
              background: method === m.id ? 'var(--color-primary-50)' : '#fff', transition: '.14s',
            }}>
              <input type="radio" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} style={{ accentColor: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{m.sub}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <img src="https://www.webpay.cl/assets/img/WebPay3D_200px.png" alt="WebPay" style={{ height: 22, opacity: .8 }} onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            </label>
          ))}
        </div>

        {/* Confirmación */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, cursor: 'pointer' }}>
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: 'var(--color-pay)' }} />
          <span style={{ fontSize: 13.5, color: 'var(--color-muted)', lineHeight: 1.5 }}>
            Confirmo que los conceptos y el monto son correctos y autorizo el cobro de{' '}
            <strong style={{ color: 'var(--color-ink)' }}>{fmtMoney(total)}</strong> mediante WebPay / Transbank.
          </span>
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => router.back()}
            className="btn btn--ghost"
            style={{ flex: '0 0 auto' }}
          >
            ← Volver
          </button>
          <button
            onClick={pay}
            disabled={!confirmed || loading}
            className="btn btn--pay btn--block"
            style={{ flex: 1, height: 52, fontSize: 16 }}
          >
            {loading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 3a9 9 0 019 9" />
                </svg>
                Procesando pago…
              </>
            ) : (
              <>
                🔒 Confirmar y pagar {fmtMoney(total)}
              </>
            )}
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-faint)', textAlign: 'center', marginTop: 16 }}>
          Pago 100% seguro · Encriptación SSL · Operado por Transbank S.A.
        </p>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
