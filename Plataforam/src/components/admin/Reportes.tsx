'use client';
/* CEPA Admin · Reportes (exportables para tesorería) */
import { Icon } from './Icon';
import type { IconName } from '@/lib/types';

interface Report {
  icon: IconName;
  ic: string;
  t: string;
  d: string;
}

export function Reportes({ onToast }: { onToast: (msg: string) => void }) {
  const reports: Report[] = [
    { icon: 'wallet', ic: 'ic-green', t: 'Recaudación por período', d: 'Total recaudado por mes, concepto y curso.' },
    { icon: 'alert', ic: 'ic-red', t: 'Reporte de morosidad', d: 'Familias con cuotas pendientes y vencidas.' },
    { icon: 'tag', ic: 'ic-blue', t: 'Recaudación por concepto', d: 'Desglose por cada ítem del catálogo.' },
    { icon: 'users', ic: 'ic-blue', t: 'Aportes por curso', d: 'Comparativa de aportes entre cursos.' },
  ];
  return (
    <div className="content fade-up">
      <div className="toolbar">
        <div className="period">
          Período{' '}
          <select>
            <option>Año 2026</option>
            <option>1er semestre 2026</option>
            <option>Mayo 2026</option>
          </select>
        </div>
        <div className="spacer"></div>
      </div>
      <div className="grid-2">
        {reports.map((r, i) => (
          <div className="card card-pad" key={i}>
            <div className="row-between" style={{ alignItems: 'flex-start' }}>
              <div className={'stat-ic ' + r.ic} style={{ marginBottom: 0 }}>
                <Icon name={r.icon} size={19} />
              </div>
            </div>
            <h3 style={{ fontSize: 16, marginTop: 16 }}>{r.t}</h3>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.5 }}>
              {r.d}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => onToast('Exportando ' + r.t + ' (Excel)…')}>
                <Icon name="download" size={15} /> Excel
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => onToast('Exportando ' + r.t + ' (PDF)…')}>
                <Icon name="file" size={15} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
