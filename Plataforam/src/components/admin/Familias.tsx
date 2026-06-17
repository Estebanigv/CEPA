'use client';
/* CEPA Admin · Apoderados / Familias */
import { useState } from 'react';
import { Icon } from './Icon';
import { clp, initials } from '@/lib/format';
import type { AdminData, Family, FamilyStatus, IconName, Transaction } from '@/lib/types';

const FAM_STATUS: Record<FamilyStatus, { label: string; cls: string; icon: IconName }> = {
  paid: { label: 'Al día', cls: 'badge--paid', icon: 'check' },
  pending: { label: 'Con pendientes', cls: 'badge--pending', icon: 'clock' },
  overdue: { label: 'Con vencidos', cls: 'badge--overdue', icon: 'alert' },
};

function FamBadge({ s }: { s: FamilyStatus }) {
  const c = FAM_STATUS[s];
  return (
    <span className={'badge ' + c.cls}>
      <Icon name={c.icon} size={13} stroke={2.3} />
      {c.label}
    </span>
  );
}

function FamilyDrawer({
  fam,
  transactions,
  onClose,
  onRemind,
}: {
  fam: Family;
  transactions: Transaction[];
  onClose: () => void;
  onRemind: (f: Family) => void;
}) {
  const history = transactions.filter((t) => t.rut === fam.rut);
  return (
    <>
      <div className="scrim" onClick={onClose}></div>
      <div className="drawer" style={{ width: 520 }}>
        <div className="drawer-h">
          <div className="mini-av" style={{ width: 46, height: 46, fontSize: 14 }}>
            {initials(fam.apoderado)}
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>{fam.name}</h3>
            <div style={{ marginTop: 5 }}>
              <FamBadge s={fam.status} />
            </div>
          </div>
          <button className="x-btn" onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="drawer-b">
          <div className="grid-2" style={{ marginBottom: 4 }}>
            <div className="card card-pad" style={{ padding: 16, boxShadow: 'none' }}>
              <div className="stat-label">Total aportado</div>
              <div className="tnum" style={{ fontSize: 21, fontWeight: 700, color: 'var(--color-pay-600)', marginTop: 4 }}>
                {clp(fam.aportado)}
              </div>
            </div>
            <div className="card card-pad" style={{ padding: 16, boxShadow: 'none' }}>
              <div className="stat-label">Pendiente</div>
              <div
                className="tnum"
                style={{ fontSize: 21, fontWeight: 700, color: fam.pend ? 'var(--warn)' : 'var(--color-muted)', marginTop: 4 }}
              >
                {clp(fam.pend)}
              </div>
            </div>
          </div>

          <div className="sec-label">Contacto</div>
          <div className="kv">
            <span className="kv-k">Apoderado</span>
            <span className="kv-v">{fam.apoderado}</span>
          </div>
          <div className="kv">
            <span className="kv-k">RUT</span>
            <span className="kv-v mono">{fam.rut}</span>
          </div>
          <div className="kv">
            <span className="kv-k">Email</span>
            <span className="kv-v">{fam.email}</span>
          </div>

          <div className="sec-label">Estudiantes asociados</div>
          {fam.students.map((s, i) => (
            <div className="mini-item" key={i} style={{ padding: '9px 8px' }}>
              <div className="mini-av">
                <Icon name="user" size={15} />
              </div>
              <div className="mini-name">{s}</div>
            </div>
          ))}

          <div className="sec-label">Histórico de pagos</div>
          {history.length ? (
            history.map((t, i) => (
              <div className="mini-item" key={i} style={{ padding: '10px 8px' }}>
                <div className="mini-main">
                  <div className="mini-name" style={{ fontWeight: 500 }}>
                    {t.concepts}
                  </div>
                  <div className="mini-sub">
                    {t.date.split(' ')[0]} · {t.method}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tnum" style={{ fontWeight: 700, fontSize: 13 }}>
                    {clp(t.amount)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="muted" style={{ fontSize: 13, padding: '4px 8px' }}>
              Sin pagos registrados este año.
            </div>
          )}
        </div>
        <div className="drawer-f">
          <button className="btn btn--ghost btn--block" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn--primary btn--block" onClick={() => onRemind(fam)}>
            <Icon name="bell" size={16} /> Enviar recordatorio
          </button>
        </div>
      </div>
    </>
  );
}

const FAM_TABS: [FamilyStatus | 'todos', string][] = [
  ['todos', 'Todas'],
  ['paid', 'Al día'],
  ['pending', 'Con pendientes'],
  ['overdue', 'Con vencidos'],
];

export function Familias({ data, onToast }: { data: AdminData; onToast: (msg: string) => void }) {
  const [status, setStatus] = useState<FamilyStatus | 'todos'>('todos');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Family | null>(null);

  const rows = data.families.filter(
    (f) =>
      (status === 'todos' || f.status === status) &&
      (q === '' || (f.name + f.rut + f.apoderado).toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="content fade-up">
      <div className="toolbar">
        <div className="chips">
          {FAM_TABS.map(([k, l]) => (
            <button key={k} className={'chip' + (status === k ? ' chip--on' : '')} onClick={() => setStatus(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="spacer"></div>
        <div className="search">
          <Icon name="search" size={17} />
          <input
            className="input"
            placeholder="Buscar familia o RUT…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button className="btn btn--primary">
          <Icon name="download" size={16} /> Exportar
        </button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Familia</th>
              <th>Curso(s)</th>
              <th>Estado</th>
              <th className="t-r">Aportado</th>
              <th className="t-r">Pendiente</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} onClick={() => setOpen(f)}>
                <td>
                  <span className="av-sm">{initials(f.apoderado)}</span>
                  <span className="cell-strong">{f.apoderado}</span>
                  <div className="t-id" style={{ marginLeft: 39 }}>
                    {f.rut}
                  </div>
                </td>
                <td className="muted">{f.cursos}</td>
                <td>
                  <FamBadge s={f.status} />
                </td>
                <td className="t-amt" style={{ color: 'var(--color-pay-600)' }}>
                  {clp(f.aportado)}
                </td>
                <td className="t-amt" style={{ color: f.pend ? 'var(--warn)' : 'var(--color-faint)' }}>
                  {f.pend ? clp(f.pend) : '—'}
                </td>
                <td className="t-r">
                  <Icon name="chevR" size={16} style={{ color: 'var(--color-faint)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tbl-foot">
          <span>{rows.length} familias</span>
        </div>
      </div>
      {open && (
        <FamilyDrawer
          fam={open}
          transactions={data.transactions}
          onClose={() => setOpen(null)}
          onRemind={(f) => {
            setOpen(null);
            onToast('Recordatorio enviado a ' + f.apoderado);
          }}
        />
      )}
    </div>
  );
}
