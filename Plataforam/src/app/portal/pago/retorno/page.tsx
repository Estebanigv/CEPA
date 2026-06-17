'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSession } from '@/lib/portal-session';
import { fmtMoney } from '@/lib/portal-data';
import type { PortalUser } from '@/lib/portal-types';

interface TxData {
  id: string;
  amount: number;
  method: string;
  date: string;
}

function RetornoContent() {
  const params = useSearchParams();
  const router = useRouter();
  const estado = params.get('estado') || 'exito';
  const [user, setUser] = useState<PortalUser | null>(null);
  const [tx, setTx] = useState<TxData | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/portal/login'); return; }
    setUser(s);
    try {
      const raw = sessionStorage.getItem('cepa_last_tx');
      if (raw) setTx(JSON.parse(raw));
    } catch {}
  }, [router]);

  if (!user) return null;

  const isOk = estado === 'exito';
  const isReject = estado === 'rechazo';

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg-soft)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', padding: '48px 40px', textAlign: 'center' }}>
        {/* Ícono */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: isOk ? 'var(--color-pay-100)' : isReject ? 'var(--danger-100)' : 'var(--warn-100)',
          display: 'grid', placeItems: 'center', margin: '0 auto 24px',
        }}>
          {isOk && (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-pay)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          {isReject && (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )}
          {!isOk && !isReject && (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          {isOk ? '¡Pago exitoso!' : isReject ? 'Pago rechazado' : 'Pago anulado'}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-muted)', marginBottom: 28, lineHeight: 1.55 }}>
          {isOk
            ? 'Tu pago fue procesado correctamente. Se enviará un comprobante a tu correo.'
            : isReject
            ? 'Tu pago fue rechazado por el banco. Intenta con otra tarjeta o medio de pago.'
            : 'La transacción fue anulada o expiró. Puedes intentarlo nuevamente.'}
        </p>

        {isOk && tx && (
          <div style={{
            background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)',
            padding: '16px 20px', marginBottom: 28, textAlign: 'left',
          }}>
            {[
              { l: 'N° transacción', v: tx.id },
              { l: 'Monto', v: fmtMoney(tx.amount) },
              { l: 'Medio', v: tx.method },
              { l: 'Fecha', v: new Date(tx.date).toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
              { l: 'Estado', v: 'Pagado' },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13.5 }}>
                <span style={{ color: 'var(--color-muted)' }}>{row.l}</span>
                <span style={{ fontWeight: 600 }}>{row.v}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isOk && (
            <button className="btn btn--primary btn--block" style={{ height: 46 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar comprobante (PDF)
            </button>
          )}
          <button
            onClick={() => router.push('/portal/mis-pagos')}
            className="btn btn--ghost btn--block"
            style={{ height: 46 }}
          >
            Ver mis pagos
          </button>
          <button
            onClick={() => router.push('/portal/conceptos')}
            className="btn btn--ghost btn--block"
            style={{ height: 46 }}
          >
            {isOk ? 'Volver al catálogo' : 'Intentar nuevamente'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RetornoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Cargando…</div>}>
      <RetornoContent />
    </Suspense>
  );
}
