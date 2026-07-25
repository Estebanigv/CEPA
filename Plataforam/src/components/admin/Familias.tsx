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
            <CuotaCard label="Beca Fallec." paid={fam.seguro2026} folio={fam.seguroFolio2026} />
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

          <div className="sec-label">Historial anual (CEPA / Beca)</div>
          {years.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '2px 14px', alignItems: 'center', padding: '2px 8px' }}>
              <span className="muted" style={{ fontSize: 11, fontWeight: 700 }}>Año</span>
              <span className="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>CEPA</span>
              <span className="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>Beca</span>
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
          <a className="btn btn--ghost btn--block" href={`/portal/mis-datos?fid=${fam.id}`} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
            <Icon name="eye" size={16} /> Ver como apoderado
          </a>
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

/** Rango pedagógico del primer curso de la familia: PG < PK < K < 1°–8° < I–IV Medio. */
const CURSO_BASE: Record<string, number> = { PG: 0, PK: 1, K: 2 };
function cursoRank(cursos: string): number {
  const first = (cursos || '').split('·')[0].trim().toUpperCase();
  if (!first) return 9999;
  const base = first.split('-')[0].trim();
  if (base in CURSO_BASE) return CURSO_BASE[base];
  const em = base.match(/^(\d+)EM$/);
  if (em) return 100 + Number(em[1]);
  const bas = base.match(/^(\d+)$/);
  if (bas) return 10 + Number(bas[1]);
  return 9999;
}

type SortKey = 'apoderado' | 'curso' | 'status' | 'aportado' | 'pend';

export function Familias({ data, onToast }: { data: AdminData; onToast: (msg: string) => void }) {
  const [status, setStatus] = useState<FamilyStatus | 'todos'>('todos');
  const [q, setQ] = useState('');
  const [curso, setCurso] = useState('todos');
  const [open, setOpen] = useState<Family | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'curso', dir: 'asc' });

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  /** Lista de cursos únicos (ordenados pedagógicamente) para el filtro. */
  const cursoOptions = (() => {
    const set = new Set<string>();
    data.families.forEach((f) => (f.cursos ?? '').split('·').forEach((c) => { const t = c.trim(); if (t) set.add(t); }));
    return Array.from(set).sort((a, b) => (cursoRank(a) - cursoRank(b)) || a.localeCompare(b, 'es', { numeric: true }));
  })();

  const rows = data.families.filter(
    (f) =>
      (status === 'todos' || f.status === status) &&
      (curso === 'todos' || (f.cursos ?? '').split('·').map((s) => s.trim()).includes(curso)) &&
      (q === '' || (f.name + f.rut + f.apoderado + (f.cursos ?? '')).toLowerCase().includes(q.toLowerCase())),
  );

  const dir = sort.dir === 'asc' ? 1 : -1;
  const sorted = [...rows].sort((a, b) => {
    if (sort.key === 'aportado') return (a.aportado - b.aportado) * dir;
    if (sort.key === 'pend') return (a.pend - b.pend) * dir;
    if (sort.key === 'curso') {
      const r = cursoRank(a.cursos) - cursoRank(b.cursos);
      return (r !== 0 ? r : (a.cursos ?? '').localeCompare(b.cursos ?? '', 'es', { numeric: true })) * dir;
    }
    const av = sort.key === 'status' ? a.status : a.apoderado;
    const bv = sort.key === 'status' ? b.status : b.apoderado;
    return av.localeCompare(bv, 'es', { numeric: true }) * dir;
  });

  const Arrow = ({ k }: { k: SortKey }) =>
    sort.key === k ? <span style={{ fontSize: 10, marginLeft: 3 }}>{sort.dir === 'asc' ? '▲' : '▼'}</span> : null;

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
        <div className="fselect">
          <Icon name="filter" size={15} />
          <select value={curso} onChange={(e) => setCurso(e.target.value)}>
            <option value="todos">Todos los cursos</option>
            {cursoOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
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
              <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('apoderado')}>Familia<Arrow k="apoderado" /></th>
              <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('curso')}>Curso(s)<Arrow k="curso" /></th>
              <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('status')}>Estado<Arrow k="status" /></th>
              <th className="t-r" style={{ cursor: 'pointer' }} onClick={() => toggleSort('aportado')}>Aportado<Arrow k="aportado" /></th>
              <th className="t-r" style={{ cursor: 'pointer' }} onClick={() => toggleSort('pend')}>Pendiente<Arrow k="pend" /></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((f) => (
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
          <span>{sorted.length} familias · ordenadas por {sort.key === 'apoderado' ? 'familia' : sort.key === 'curso' ? 'curso' : sort.key === 'status' ? 'estado' : sort.key}</span>
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
