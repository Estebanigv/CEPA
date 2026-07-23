'use client';
/* CEPA Admin · Apoderados / Familias */
import { useState } from 'react';
import { Icon } from './Icon';
import { clp, initials } from '@/lib/format';
import type { AdminData, Family, FamilyStatus, IconName } from '@/lib/types';

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

function Dot({ ok }: { ok: boolean }) {
  return (
    <span style={{ display: 'inline-flex', justifyContent: 'center' }}>
      <Icon
        name={ok ? 'checkSm' : 'x'}
        size={14}
        stroke={2.6}
        style={{ color: ok ? 'var(--ok, #1D9E75)' : 'var(--color-faint, #c5d0e4)' }}
      />
    </span>
  );
}

function FragmentRow({ year, cepa, seguro }: { year: string; cepa: boolean; seguro: boolean }) {
  return (
    <>
      <span style={{ fontSize: 13, padding: '4px 0' }}>{year}</span>
      <Dot ok={cepa} />
      <Dot ok={seguro} />
    </>
  );
}

function CuotaCard({ label, paid, folio }: { label: string; paid?: boolean; folio?: string | null }) {
  return (
    <div className="card card-pad" style={{ padding: 16, boxShadow: 'none' }}>
      <div className="stat-label">{label} 2026</div>
      <div style={{ marginTop: 6 }}>
        <span className={'badge ' + (paid ? 'badge--paid' : 'badge--pending')}>
          <Icon name={paid ? 'check' : 'clock'} size={13} stroke={2.3} />
          {paid ? 'Pagado' : 'Pendiente'}
        </span>
      </div>
      {paid && folio ? (
        <div className="muted" style={{ fontSize: 11.5, marginTop: 7 }}>Folio {folio}</div>
      ) : null}
    </div>
  );
}

function FamilyDrawer({
  fam,
  onClose,
  onRemind,
}: {
  fam: Family;
  onClose: () => void;
  onRemind: (f: Family) => void;
}) {
  const years = Object.keys(fam.historial ?? {}).sort((a, b) => Number(b) - Number(a));
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
            <CuotaCard label="CEPA" paid={fam.cepa2026} folio={fam.cepaFolio2026} />
            <CuotaCard label="Seguro" paid={fam.seguro2026} folio={fam.seguroFolio2026} />
          </div>

          <div className="sec-label">Apoderados</div>
          {fam.padreNombre || fam.padreEmail ? (
            <div className="kv">
              <span className="kv-k">Padre</span>
              <span className="kv-v">
                {fam.padreNombre || '—'}
                {fam.padreEmail ? <div className="muted" style={{ fontSize: 12 }}>{fam.padreEmail}</div> : null}
              </span>
            </div>
          ) : null}
          {fam.madreNombre || fam.madreEmail ? (
            <div className="kv">
              <span className="kv-k">Madre</span>
              <span className="kv-v">
                {fam.madreNombre || '—'}
                {fam.madreEmail ? <div className="muted" style={{ fontSize: 12 }}>{fam.madreEmail}</div> : null}
              </span>
            </div>
          ) : null}
          <div className="kv">
            <span className="kv-k">Teléfono</span>
            <span className="kv-v">{fam.telefono || '—'}</span>
          </div>
          <div className="kv">
            <span className="kv-k">RUT</span>
            <span className="kv-v mono">{fam.rut}</span>
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

          <div className="sec-label">Historial anual (CEPA / Seguro)</div>
          {years.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '2px 14px', alignItems: 'center', padding: '2px 8px' }}>
              <span className="muted" style={{ fontSize: 11, fontWeight: 700 }}>Año</span>
              <span className="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>CEPA</span>
              <span className="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>Seguro</span>
              {years.map((y) => {
                const h = fam.historial![y];
                return (
                  <FragmentRow key={y} year={y} cepa={h.cepa} seguro={h.seguro} />
                );
              })}
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 13, padding: '4px 8px' }}>
              Sin historial registrado.
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
