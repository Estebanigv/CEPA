'use client';
/* CEPA Admin · Cobranza y recordatorios */
import { useState } from 'react';
import { Icon } from './Icon';
import { DEFAULT_REMINDER_EMAIL } from '@/lib/institution';

type RuleKey = 'before' | 'due' | 'after';

/** Reemplaza las variables de la plantilla con valores de ejemplo. */
function fillVars(text: string): string {
  return text
    .replace(/\{familia\}/g, 'Pérez González')
    .replace(/\{monto\}/g, '$50.000')
    .replace(/\{concepto\}/g, 'Cuota Centro de Padres 2026');
}

export function Cobranza({ onToast }: { onToast: (msg: string) => void }) {
  const [rules, setRules] = useState<Record<RuleKey, boolean>>({ before: true, due: true, after: true });
  const [subject, setSubject] = useState(DEFAULT_REMINDER_EMAIL.subject);
  const [body, setBody] = useState(DEFAULT_REMINDER_EMAIL.body);
  const [preview, setPreview] = useState(false);
  const log = [
    { to: 'Familias morosas · Cuota CEPA', n: 14, date: '07 jun 2026 · 09:00', type: 'Masivo' },
    { to: 'Familia Maldonado P.', n: 1, date: '06 jun 2026 · 16:20', type: 'Manual' },
    { to: 'Vencimientos próximos (3 días)', n: 22, date: '05 jun 2026 · 09:00', type: 'Automático' },
  ];
  const ruleRows: [RuleKey, string][] = [
    ['before', '3 días antes del vencimiento'],
    ['due', 'El día del vencimiento'],
    ['after', '3 días después (recargo)'],
  ];
  return (
    <div className="content fade-up">
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="panel-h">
            <div>
              <h3>Recordatorios automáticos</h3>
              <div className="ph-sub">Reglas por vencimiento</div>
            </div>
          </div>
          <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ruleRows.map(([k, l]) => (
              <div className="row-between" key={k} style={{ padding: '12px 0', borderBottom: '1px solid var(--color-line-soft)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{l}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                    Email + aviso en plataforma
                  </div>
                </div>
                <button
                  className={'switch' + (rules[k] ? ' switch--on' : '')}
                  onClick={() => setRules((r) => ({ ...r, [k]: !r[k] }))}
                ></button>
              </div>
            ))}
            <div className="placeholder-note" style={{ marginTop: 12 }}>
              · reglas de ejemplo — placeholder ·
            </div>
          </div>
        </div>

        <div className="card">
          <div className="panel-h">
            <div>
              <h3>Plantilla de email</h3>
              <div className="ph-sub">Editable · variables {'{familia} {monto} {concepto}'}</div>
            </div>
          </div>
          <div className="card-pad" style={{ paddingTop: 16 }}>
            <label className="field-l">Asunto</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ marginBottom: 14 }} />
            <label className="field-l">Mensaje</label>
            <textarea
              className="input"
              style={{ height: 170, resize: 'vertical', paddingTop: 11 }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <div className="row-between" style={{ marginTop: 16 }}>
              <button className="btn btn--ghost" onClick={() => setPreview(true)}>
                <Icon name="eye" size={16} /> Previsualizar
              </button>
              <button className="btn btn--primary" onClick={() => onToast('Plantilla guardada')}>
                Guardar plantilla
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card section-gap">
        <div className="panel-h">
          <div>
            <h3>Envío masivo segmentado</h3>
            <div className="ph-sub">Selecciona un segmento y envía el recordatorio</div>
          </div>
          <button className="btn btn--pay" onClick={() => onToast('Recordatorio enviado a 14 familias morosas')}>
            <Icon name="send" size={16} /> Enviar a morosos Cuota CEPA (14)
          </button>
        </div>
        <div className="mini-list" style={{ padding: '8px 14px 16px' }}>
          {log.map((l, i) => (
            <div className="mini-item" key={i}>
              <div className="mini-av" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary)', borderColor: 'transparent' }}>
                <Icon name="mail" size={15} />
              </div>
              <div className="mini-main">
                <div className="mini-name">{l.to}</div>
                <div className="mini-sub">
                  {l.date} · {l.n} destinatario{l.n > 1 ? 's' : ''}
                </div>
              </div>
              <span className="badge badge--neutral">{l.type}</span>
            </div>
          ))}
        </div>
      </div>

      {preview && (
        <div className="modal-wrap">
          <div className="scrim" onClick={() => setPreview(false)}></div>
          <div className="modal">
            <div className="modal-h">
              <h3 style={{ fontSize: 18 }}>Vista previa del correo</h3>
              <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
                Ejemplo con variables reemplazadas (familia, monto, concepto).
              </p>
            </div>
            <div className="modal-b">
              <div style={{ border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-bg-soft)', padding: '12px 16px', borderBottom: '1px solid var(--color-line)' }}>
                  <div className="muted" style={{ fontSize: 12 }}>Asunto</div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, marginTop: 2 }}>{fillVars(subject)}</div>
                </div>
                <div style={{ padding: '16px', fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap', color: 'var(--color-ink)' }}>
                  {fillVars(body)}
                </div>
              </div>
            </div>
            <div className="modal-f">
              <button className="btn btn--primary" onClick={() => setPreview(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
