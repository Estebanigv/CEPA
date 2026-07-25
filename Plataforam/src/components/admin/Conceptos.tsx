'use client';
/* CEPA Admin · Conceptos de pago (catálogo configurable) */
import { useState } from 'react';
import { Icon } from './Icon';
import { clp } from '@/lib/format';
import type { Concept } from '@/lib/types';

function ConceptModal({
  concept,
  onClose,
  onSaved,
}: {
  concept?: Concept;
  onClose: () => void;
  onSaved: (c: Concept) => void;
}) {
  const base: Concept = concept ?? {
    id: '', name: '', cat: 'Cuotas institucionales', icon: 'tag',
    amount: 0, scope: 'Por familia', vig: 'Anual 2026', cuotas: 1, active: true,
  };
  const [name, setName] = useState(base.name);
  const [cat, setCat] = useState(base.cat);
  const [amount, setAmount] = useState(base.amount ? clp(base.amount) : '');
  const [scope, setScope] = useState(base.scope);
  const [vig, setVig] = useState(base.vig);
  const [cuotas, setCuotas] = useState(base.cuotas);
  const [active, setActive] = useState(base.active);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    if (!name.trim()) { setErr('Ingresa el nombre del concepto.'); return; }
    setSaving(true); setErr('');
    const amountNum = parseInt(String(amount).replace(/[^0-9]/g, ''), 10) || 0;
    try {
      const res = await fetch('/api/admin/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: concept?.id || undefined, name, cat, amount: amountNum, scope, vig, cuotas, active, icon: base.icon }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { onSaved(data.concept); }
      else { setErr(data.error || 'No se pudo guardar.'); setSaving(false); }
    } catch {
      setErr('Error de conexión. Intenta de nuevo.'); setSaving(false);
    }
  }

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
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Cuota Centro de Padres" />
            </div>
            <div className="grid-2">
              <div>
                <label className="field-l">Categoría</label>
                <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
                  <option>Cuotas institucionales</option>
                  <option>Deportes</option>
                  <option>Eventos</option>
                </select>
              </div>
              <div>
                <label className="field-l">Monto (CLP)</label>
                <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$50.000" />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label className="field-l">Aplica a</label>
                <select className="select" value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option>Por familia</option>
                  <option>Por estudiante</option>
                  <option>Por persona</option>
                  <option>Por curso</option>
                </select>
              </div>
              <div>
                <label className="field-l">Vigencia</label>
                <select className="select" value={vig} onChange={(e) => setVig(e.target.value)}>
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
                <input
                  className="input" type="number" min={1} max={12} value={cuotas}
                  onChange={(e) => setCuotas(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
                />
              </div>
              <div>
                <label className="field-l">Estado</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42 }}>
                  <button type="button" className={'switch' + (active ? ' switch--on' : '')} onClick={() => setActive((v) => !v)}></button>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{active ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
            </div>
          </div>
          {err && (
            <div style={{ marginTop: 14, background: 'rgba(179,38,30,.08)', border: '1px solid rgba(179,38,30,.25)', borderRadius: 8, padding: '9px 13px', fontSize: 13, color: '#b3261e' }}>
              {err}
            </div>
          )}
        </div>
        <div className="modal-f">
          <button className="btn btn--ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button className="btn btn--primary" onClick={save} disabled={saving}>
            <Icon name="check" size={16} /> {saving ? 'Guardando…' : 'Guardar concepto'}
          </button>
        </div>
      </div>
    </div>
  );
}

async function saveConcept(c: Concept) {
  try {
    await fetch('/api/admin/concepts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: c.id, name: c.name, cat: c.cat, amount: c.amount, scope: c.scope, vig: c.vig, cuotas: c.cuotas, active: c.active, icon: c.icon }),
    });
  } catch {
    /* el estado local ya se actualizó de forma optimista */
  }
}

export function Conceptos({ concepts }: { concepts: Concept[] }) {
  const [items, setItems] = useState<Concept[]>(concepts);
  const [edit, setEdit] = useState<Concept | null>(null);
  const [creating, setCreating] = useState(false);

  const toggle = (c: Concept) => {
    const updated = { ...c, active: !c.active };
    setItems((its) => its.map((x) => (x.id === c.id ? updated : x)));
    saveConcept(updated); // persiste el cambio de estado
  };

  const onSaved = (saved: Concept) => {
    setItems((its) => (its.some((x) => x.id === saved.id) ? its.map((x) => (x.id === saved.id ? saved : x)) : [...its, saved]));
    setEdit(null);
    setCreating(false);
  };

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
                  <button className={'switch' + (c.active ? ' switch--on' : '')} onClick={() => toggle(c)}></button>
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
      {edit && <ConceptModal concept={edit} onClose={() => setEdit(null)} onSaved={onSaved} />}
      {creating && <ConceptModal onClose={() => setCreating(false)} onSaved={onSaved} />}
    </div>
  );
}
