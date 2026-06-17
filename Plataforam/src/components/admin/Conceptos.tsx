'use client';
/* CEPA Admin · Conceptos de pago (catálogo configurable) */
import { useState } from 'react';
import { Icon } from './Icon';
import { clp } from '@/lib/format';
import type { Concept } from '@/lib/types';

function ConceptModal({ concept, onClose }: { concept?: Concept; onClose: () => void }) {
  const c = concept ?? {
    name: '',
    cat: 'Cuotas institucionales',
    amount: 0,
    scope: 'Por familia',
    vig: 'Anual 2026',
    cuotas: 1,
    active: true,
  };
  return (
    <div className="modal-wrap">
      <div className="scrim" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-h">
          <h3 style={{ fontSize: 18 }}>{concept ? 'Editar concepto' : 'Nuevo concepto'}</h3>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
            Define qué aparece en el carro del apoderado.
          </p>
        </div>
        <div className="modal-b">
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label className="field-l">Nombre del concepto</label>
              <input className="input" defaultValue={c.name} placeholder="Ej. Cuota Centro de Padres" />
            </div>
            <div className="grid-2">
              <div>
                <label className="field-l">Categoría</label>
                <select className="select" defaultValue={c.cat}>
                  <option>Cuotas institucionales</option>
                  <option>Deportes</option>
                  <option>Eventos</option>
                </select>
              </div>
              <div>
                <label className="field-l">Monto (CLP)</label>
                <input className="input" defaultValue={c.amount ? clp(c.amount) : ''} placeholder="$50.000" />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label className="field-l">Aplica a</label>
                <select className="select" defaultValue={c.scope}>
                  <option>Por familia</option>
                  <option>Por estudiante</option>
                  <option>Por persona</option>
                  <option>Por curso</option>
                </select>
              </div>
              <div>
                <label className="field-l">Vigencia</label>
                <select className="select" defaultValue={c.vig}>
                  <option>Anual 2026</option>
                  <option>1er semestre</option>
                  <option>2do semestre</option>
                  <option>Mensual</option>
                  <option>Evento único</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label className="field-l">N° de cuotas (precio contado)</label>
                <input className="input" defaultValue={c.cuotas} type="number" min="1" max="12" />
              </div>
              <div>
                <label className="field-l">Estado</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42 }}>
                  <span className={'switch' + (c.active ? ' switch--on' : '')}></span>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.active ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="placeholder-note" style={{ marginTop: 16 }}>
            · montos de ejemplo — placeholder, los confirma el CEPA ·
          </div>
        </div>
        <div className="modal-f">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn--primary" onClick={onClose}>
            <Icon name="check" size={16} /> Guardar concepto
          </button>
        </div>
      </div>
    </div>
  );
}

export function Conceptos({ concepts }: { concepts: Concept[] }) {
  const [items, setItems] = useState<Concept[]>(concepts);
  const [edit, setEdit] = useState<Concept | null>(null);
  const [creating, setCreating] = useState(false);
  const toggle = (id: string) =>
    setItems((its) => its.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  return (
    <div className="content fade-up">
      <div className="toolbar">
        <div>
          <h3 style={{ fontSize: 15 }}>
            {items.length} conceptos · {items.filter((c) => c.active).length} activos
          </h3>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
            Lo que el apoderado ve en el catálogo.
          </div>
        </div>
        <div className="spacer"></div>
        <button className="btn btn--primary" onClick={() => setCreating(true)}>
          <Icon name="plus" size={16} /> Nuevo concepto
        </button>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Categoría</th>
              <th>Aplica a</th>
              <th>Vigencia</th>
              <th className="t-r">Monto</th>
              <th>Cuotas</th>
              <th>Activo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} style={{ cursor: 'default', opacity: c.active ? 1 : 0.55 }}>
                <td>
                  <span className="av-sm" style={{ background: 'var(--color-bg-soft)', color: 'var(--color-muted)' }}>
                    <Icon name={c.icon} size={15} />
                  </span>
                  <span className="cell-strong">{c.name}</span>
                </td>
                <td className="muted">{c.cat}</td>
                <td className="muted">{c.scope}</td>
                <td className="muted">{c.vig}</td>
                <td className="t-amt">{clp(c.amount)}</td>
                <td className="muted">{c.cuotas > 1 ? 'Hasta ' + c.cuotas : '1'}</td>
                <td>
                  <button className={'switch' + (c.active ? ' switch--on' : '')} onClick={() => toggle(c.id)}></button>
                </td>
                <td className="t-r">
                  <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setEdit(c)}>
                    <Icon name="edit" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && <ConceptModal concept={edit} onClose={() => setEdit(null)} />}
      {creating && <ConceptModal onClose={() => setCreating(false)} />}
    </div>
  );
}
