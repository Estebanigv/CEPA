'use client';
/* CEPA Admin · Pagos / Contabilidad */
import { useState } from 'react';
import { Icon } from './Icon';
import { Badge } from './Badge';
import { clp, initials } from '@/lib/format';
import { INSTITUTION } from '@/lib/institution';
import type { AdminData, IconName, PaymentStatus, Transaction } from '@/lib/types';

function methodIcon(m: string): IconName {
  if (m.startsWith('Web Pay')) return 'card';
  if (m === 'Transferencia') return 'transfer';
  if (m === 'Efectivo') return 'cash';
  return 'card';
}

function TxDrawer({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const steps = [
    { t: 'Transacción creada', time: tx.date.replace(' ', ' · '), done: true },
    {
      t: tx.status === 'paid' ? 'Pago aprobado por el banco' : tx.status === 'processing' ? 'Procesando pago' : 'Pago pendiente',
      time: tx.status === 'paid' ? tx.date.replace(' ', ' · ') : '—',
      done: tx.status === 'paid',
    },
    { t: 'Comprobante enviado', time: tx.status === 'paid' ? 'Email a apoderado' : '—', done: tx.status === 'paid' },
  ];
  return (
    <>
      <div className="scrim" onClick={onClose}></div>
      <div className="drawer">
        <div className="drawer-h">
          <div className="mini-av" style={{ width: 46, height: 46, fontSize: 14 }}>
            {initials(tx.name)}
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>{tx.name}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
              {tx.rut} · {tx.curso}
            </div>
          </div>
          <button className="x-btn" onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="drawer-b">
          <div className="row-between" style={{ marginBottom: 16 }}>
            <Badge status={tx.status} />
            <span className="tnum" style={{ fontSize: 24, fontWeight: 700 }}>
              {clp(tx.amount)}
            </span>
          </div>
          <div className="kv">
            <span className="kv-k">ID Transbank</span>
            <span className="kv-v mono">{tx.id}</span>
          </div>
          <div className="kv">
            <span className="kv-k">Concepto(s)</span>
            <span className="kv-v">{tx.concepts}</span>
          </div>
          <div className="kv">
            <span className="kv-k">Medio de pago</span>
            <span className="kv-v" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <Icon name={methodIcon(tx.method)} size={15} /> {tx.method}
            </span>
          </div>
          <div className="kv">
            <span className="kv-k">Fecha</span>
            <span className="kv-v">{tx.date}</span>
          </div>

          <div className="sec-label">Trazabilidad</div>
          <div className="timeline">
            {steps.map((s, i) => (
              <div className="tl-item" key={i}>
                <div className={'tl-dot' + (s.done ? '' : ' tl-dot--muted')}>
                  {s.done && <Icon name="check" size={9} stroke={3} />}
                </div>
                <div className="tl-title">{s.t}</div>
                <div className="tl-time">{s.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="drawer-f">
          <button className="btn btn--ghost btn--block">
            <Icon name="download" size={16} /> Comprobante PDF
          </button>
          <button className="btn btn--subtle btn--block">
            <Icon name="mail" size={16} /> Reenviar email
          </button>
        </div>
      </div>
    </>
  );
}

function ConciliarModal({ concepts, onClose }: { concepts: AdminData['concepts']; onClose: () => void }) {
  const [type, setType] = useState<'transfer' | 'cash'>('transfer');
  return (
    <div className="modal-wrap">
      <div className="scrim" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-h">
          <h3 style={{ fontSize: 18 }}>Registrar pago manual</h3>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
            Concilia pagos por transferencia o ingresa efectivo recibido en oficina.
          </p>
        </div>
        <div className="modal-b">
          <div className="chips" style={{ marginBottom: 18 }}>
            <button className={'chip' + (type === 'transfer' ? ' chip--on' : '')} onClick={() => setType('transfer')}>
              <Icon name="transfer" size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />
              Transferencia
            </button>
            <button className={'chip' + (type === 'cash' ? ' chip--on' : '')} onClick={() => setType('cash')}>
              <Icon name="cash" size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />
              Efectivo
            </button>
          </div>
          {type === 'transfer' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                background: 'var(--color-primary-50)',
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 13px',
                marginBottom: 16,
                fontSize: 12.5,
                color: 'var(--color-muted)',
              }}
            >
              <Icon name="building" size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>
                Cuenta CEPA · {INSTITUTION.bank.name} · {INSTITUTION.bank.accountType}{' '}
                {INSTITUTION.bank.accountNumber} · RUT {INSTITUTION.rut}
              </span>
            </div>
          )}
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label className="field-l">Apoderado / RUT</label>
              <input className="input" placeholder="Buscar familia o RUT…" />
            </div>
            <div className="grid-2">
              <div>
                <label className="field-l">Concepto</label>
                <select className="select">
                  {concepts.filter((c) => c.active).map((c) => (
                    <option key={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-l">Monto</label>
                <input className="input" placeholder="$" defaultValue="$50.000" />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label className="field-l">Fecha de pago</label>
                <input className="input" type="date" defaultValue="2026-06-09" />
              </div>
              <div>
                <label className="field-l">{type === 'transfer' ? 'N° comprobante / banco' : 'Recibido por'}</label>
                <input className="input" placeholder={type === 'transfer' ? 'Ej. BCI 884213' : 'Ej. Tesorería'} />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-f">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn--pay" onClick={onClose}>
            <Icon name="check" size={16} /> Registrar pago
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_TABS: [PaymentStatus | 'todos', string][] = [
  ['todos', 'Todos'],
  ['paid', 'Pagados'],
  ['pending', 'Pendientes'],
  ['overdue', 'Vencidos'],
  ['processing', 'Procesando'],
];

export function Pagos({
  data,
  openTx,
  onOpenTx,
}: {
  data: AdminData;
  openTx: Transaction | null;
  onOpenTx: (t: Transaction | null) => void;
}) {
  const [status, setStatus] = useState<PaymentStatus | 'todos'>('todos');
  const [method, setMethod] = useState('todos');
  const [q, setQ] = useState('');
  const [concil, setConcil] = useState(false);

  const rows = data.transactions.filter(
    (t) =>
      (status === 'todos' || t.status === status) &&
      (method === 'todos' || t.method === method) &&
      (q === '' || (t.name + t.rut + t.concepts).toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="content fade-up">
      <div className="toolbar">
        <div className="chips">
          {STATUS_TABS.map(([k, l]) => (
            <button key={k} className={'chip' + (status === k ? ' chip--on' : '')} onClick={() => setStatus(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="spacer"></div>
        <div className="fselect">
          <Icon name="filter" size={15} />
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="todos">Todos los medios</option>
            {data.methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="search">
          <Icon name="search" size={17} />
          <input
            className="input"
            placeholder="Buscar apoderado o RUT…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button className="btn btn--ghost" onClick={() => setConcil(true)}>
          <Icon name="plus" size={16} /> Pago manual
        </button>
        <button className="btn btn--primary">
          <Icon name="download" size={16} /> Exportar Excel
        </button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Apoderado</th>
              <th>Curso</th>
              <th>Concepto(s)</th>
              <th>Medio</th>
              <th>Estado</th>
              <th className="t-r">Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={i} onClick={() => onOpenTx(t)}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {t.date.split(' ')[0]}
                  <div className="t-id mono">{t.id}</div>
                </td>
                <td>
                  <span className="av-sm">{initials(t.name)}</span>
                  <span className="cell-strong">{t.name}</span>
                  <div className="t-id" style={{ marginLeft: 39 }}>
                    {t.rut}
                  </div>
                </td>
                <td className="muted">{t.curso}</td>
                <td>{t.concepts}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <Icon name={methodIcon(t.method)} size={15} style={{ color: 'var(--color-muted)' }} />
                    {t.method.replace('Web Pay · ', '')}
                  </span>
                </td>
                <td>
                  <Badge status={t.status} />
                </td>
                <td className="t-amt">{clp(t.amount)}</td>
                <td className="t-r">
                  <Icon name="chevR" size={16} style={{ color: 'var(--color-faint)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tbl-foot">
          <span>Mostrando {rows.length} de 248 transacciones</span>
          <div className="pager">
            <button>
              <Icon name="chevL" size={15} />
            </button>
            <button className="on">1</button>
            <button>2</button>
            <button>3</button>
            <button>…</button>
            <button>25</button>
            <button>
              <Icon name="chevR" size={15} />
            </button>
          </div>
        </div>
      </div>

      {openTx && <TxDrawer tx={openTx} onClose={() => onOpenTx(null)} />}
      {concil && <ConciliarModal concepts={data.concepts} onClose={() => setConcil(false)} />}
    </div>
  );
}
