'use client';
/* CEPA Admin · Dashboard */
import type { CSSProperties } from 'react';
import { Icon } from './Icon';
import { Badge } from './Badge';
import { clp, clpK, initials } from '@/lib/format';
import type { AdminData, IconName, Transaction } from '@/lib/types';

function Stat({
  icon,
  ic,
  label,
  value,
  delta,
  deltaDir,
}: {
  icon: IconName;
  ic: string;
  label: string;
  value: string | number;
  delta?: string;
  deltaDir?: 'up' | 'down';
}) {
  return (
    <div className="stat">
      <div className={'stat-ic ' + ic}>
        <Icon name={icon} size={19} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-val tnum">{value}</div>
      {delta != null && (
        <div className={'stat-delta ' + (deltaDir === 'down' ? 'stat-delta--down' : 'stat-delta--up')}>
          <Icon
            name={deltaDir === 'down' ? 'chevD' : 'chevR'}
            size={13}
            style={{ transform: deltaDir === 'down' ? 'rotate(0)' : 'rotate(-90deg)' }}
          />
          {delta} vs. período anterior
        </div>
      )}
    </div>
  );
}

function BarChart({ monthly }: { monthly: AdminData['monthly'] }) {
  const max = Math.max(...monthly.map((d) => d.v));
  return (
    <div className="card">
      <div className="panel-h">
        <div>
          <h3>Recaudación por mes</h3>
          <div className="ph-sub">Año 2026 · CLP (referencial)</div>
        </div>
      </div>
      <div className="bars">
        {monthly.map((d, i) => (
          <div className="bar-col" key={d.m}>
            <div
              className={'bar' + (i === monthly.length - 1 ? ' bar--soft' : '')}
              style={{ height: (d.v / max) * 100 + '%' }}
            >
              <span className="bar-val">{clpK(d.v)}</span>
            </div>
            <span className="bar-label">{d.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Donut({ paid, pend, over }: { paid: number; pend: number; over: number }) {
  const grad = `conic-gradient(var(--color-pay) 0 ${paid}%, var(--warn) ${paid}% ${paid + pend}%, var(--danger) ${paid + pend}% 100%)`;
  return (
    <div className="card">
      <div className="panel-h">
        <div>
          <h3>Estado de aportes</h3>
          <div className="ph-sub">Distribución actual</div>
        </div>
      </div>
      <div className="donut-wrap">
        <div className="donut" style={{ background: grad }}>
          <div className="donut-center">
            <div>
              <b className="tnum">{paid}%</b>
              <span>al día</span>
            </div>
          </div>
        </div>
        <div className="legend">
          <div className="legend-row">
            <span className="legend-dot" style={{ background: 'var(--color-pay)' }}></span> Pagado <b>{paid}%</b>
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: 'var(--warn)' }}></span> Pendiente <b>{pend}%</b>
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: 'var(--danger)' }}></span> Vencido <b>{over}%</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function ByConcept({ byConcept }: { byConcept: AdminData['byConcept'] }) {
  const max = Math.max(...byConcept.map((d) => d.v));
  const total = byConcept.reduce((a, d) => a + d.v, 0);
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="panel-h">
        <div>
          <h3>Recaudación por concepto</h3>
          <div className="ph-sub">Total {clp(total)}</div>
        </div>
      </div>
      <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 15 }}>
        {byConcept.map((d) => (
          <div key={d.name}>
            <div className="row-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{d.name}</span>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 600 }}>
                {clp(d.v)}
              </span>
            </div>
            <div className="pbar">
              <i style={{ width: (d.v / max) * 100 + '%', background: d.color }}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UpcomingItem {
  name: string;
  concept: string;
  due: string;
  status: 'overdue' | 'pending';
}

export function Dashboard({
  data,
  onOpenTx,
  onGoFamilias,
}: {
  data: AdminData;
  onOpenTx: (t?: Transaction) => void;
  onGoFamilias: () => void;
}) {
  const { kpis } = data;

  /* Actividad reciente = familias que ya pagaron la cuota CEPA 2026. */
  const recent = data.families
    .filter((f) => f.cepa2026)
    .slice(0, 5)
    .map(
      (f): Transaction => ({
        id: f.cepaFolio2026 ? `Folio ${f.cepaFolio2026}` : '—',
        date: '2026',
        name: f.apoderado,
        rut: f.rut,
        curso: f.cursos,
        concepts: 'Cuota Centro de Padres 2026',
        amount: f.aportado,
        method: '—',
        status: 'paid',
      }),
    );

  /* Vencimientos = familias con cuota CEPA/Seguro 2026 pendiente. */
  const upcoming: UpcomingItem[] = data.families
    .filter((f) => f.status !== 'paid')
    .slice(0, 5)
    .map((f): UpcomingItem => {
      const falta = [!f.cepa2026 ? 'CEPA' : null, !f.seguro2026 ? 'Seguro' : null].filter(Boolean).join(' + ');
      return { name: f.apoderado, concept: `${falta || 'Cuota'} 2026 pendiente`, due: 'Sin pagar', status: 'pending' };
    });

  /* Distribución real de aportes (dona). */
  const donutPaid = kpis.alDia;
  const donutPend = Math.max(0, 100 - kpis.alDia);
  const overdueAv: CSSProperties = { background: 'var(--danger-100)', color: 'var(--danger)', borderColor: 'transparent' };

  return (
    <div className="content fade-up">
      <div className="stat-grid">
        <Stat icon="wallet" ic="ic-green" label="Total recaudado (nominal)" value={clp(kpis.recaudado)} />
        <Stat icon="receipt" ic="ic-blue" label="N° de pagos 2026" value={kpis.pagos} />
        <Stat icon="shieldUser" ic="ic-blue" label="Familias al día" value={kpis.alDia + '%'} />
        <Stat icon="alert" ic="ic-amber" label="Pendiente (nominal)" value={clp(kpis.pendiente + kpis.vencido)} />
        <Stat icon="chart" ic="ic-blue" label="Ticket promedio" value={clp(kpis.ticket)} />
      </div>

      <div className="chart-row">
        <BarChart monthly={data.monthly} />
        <Donut paid={donutPaid} pend={donutPend} over={0} />
      </div>

      <div className="chart-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="panel-h">
            <div>
              <h3>Últimos pagos</h3>
              <div className="ph-sub">Actividad reciente</div>
            </div>
            <button className="btn btn--sm btn--subtle" onClick={() => onOpenTx()}>
              Ver todos
            </button>
          </div>
          <div className="mini-list">
            {recent.map((t, i) => (
              <div className="mini-item" key={i} style={{ cursor: 'pointer' }} onClick={() => onOpenTx(t)}>
                <div className="mini-av">{initials(t.name)}</div>
                <div className="mini-main">
                  <div className="mini-name">{t.name}</div>
                  <div className="mini-sub">{t.concepts}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tnum" style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {clp(t.amount)}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <Badge status={t.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="panel-h">
            <div>
              <h3>Vencimientos próximos</h3>
              <div className="ph-sub">Requieren cobranza</div>
            </div>
            <button className="btn btn--sm btn--subtle" onClick={onGoFamilias}>
              Gestionar
            </button>
          </div>
          <div className="mini-list">
            {upcoming.map((u, i) => (
              <div className="mini-item" key={i}>
                <div className="mini-av" style={u.status === 'overdue' ? overdueAv : undefined}>
                  <Icon name={u.status === 'overdue' ? 'alert' : 'clock'} size={15} />
                </div>
                <div className="mini-main">
                  <div className="mini-name">{u.name}</div>
                  <div className="mini-sub">{u.concept}</div>
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    fontSize: 12,
                    fontWeight: 600,
                    color: u.status === 'overdue' ? 'var(--danger)' : 'var(--color-muted)',
                  }}
                >
                  {u.due}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ByConcept byConcept={data.byConcept} />
    </div>
  );
}
