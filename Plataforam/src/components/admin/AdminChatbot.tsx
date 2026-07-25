'use client';

import { useState, useRef, useEffect } from 'react';

interface Topic {
  id: string;
  label: string;
  answer: string;
}

const TOPICS: Topic[] = [
  {
    id: 'registrar-pago',
    label: '¿Cómo registro un pago manual?',
    answer: 'Ve a <strong>Pagos / Contabilidad</strong> → botón <strong>"+ Registrar pago"</strong>. Completa el formulario con familia, concepto, monto y medio de pago. El sistema generará el comprobante y notificará al apoderado.',
  },
  {
    id: 'buscar-familia',
    label: 'Buscar una familia',
    answer: 'En <strong>Apoderados / Familias</strong> usa el buscador por nombre o RUT. Desde la ficha familiar puedes ver su historial completo, conceptos pendientes y enviar recordatorios.',
  },
  {
    id: 'crear-concepto',
    label: 'Crear o editar conceptos',
    answer: 'Ve a <strong>Conceptos de pago</strong>. Haz clic en <strong>"+ Nuevo concepto"</strong> o en el ícono de edición de uno existente. Puedes configurar nombre, categoría, monto, alcance (por familia / por estudiante) y vigencia.',
  },
  {
    id: 'exportar-reporte',
    label: 'Exportar reportes',
    answer: 'En la sección <strong>Reportes</strong> selecciona el rango de fechas y el tipo de reporte (recaudación, morosidad, por concepto). Haz clic en <strong>"Exportar Excel"</strong> o <strong>"Exportar PDF"</strong>.',
  },
  {
    id: 'enviar-recordatorio',
    label: 'Enviar recordatorio de cobro',
    answer: 'Ve a <strong>Cobranza</strong> → selecciona las familias con pagos pendientes → haz clic en <strong>"Enviar recordatorio"</strong>. Puedes personalizar el mensaje en "Plantillas de recordatorio".',
  },
  {
    id: 'kpis-dashboard',
    label: 'Entender los KPIs del dashboard',
    answer: '<strong>Total recaudado:</strong> suma de pagos confirmados del período. <strong>% familias al día:</strong> familias sin deuda / total familias. <strong>Monto pendiente:</strong> deuda no vencida. <strong>Monto vencido:</strong> deuda con fecha de vencimiento pasada.',
  },
  {
    id: 'gestionar-usuarios',
    label: 'Gestionar usuarios y roles',
    answer: 'Ve a <strong>Roles y usuarios</strong>. Puedes agregar colaboradores con roles: <em>Tesorero</em> (acceso total), <em>Secretario</em> (lectura + recordatorios) o <em>Consulta</em> (solo lectura).',
  },
  {
    id: 'conciliacion',
    label: 'Conciliar pagos por transferencia',
    answer: 'En <strong>Pagos / Contabilidad</strong> filtra por medio "Transferencia" y estado "Pendiente de conciliación". Selecciona el pago y haz clic en <strong>"Marcar como recibido"</strong> adjuntando el comprobante.',
  },
  {
    id: 'contacto-soporte',
    label: 'Contactar soporte técnico',
    answer: '📧 Para soporte de la plataforma escríbenos a <strong>soporte@cepaciamaria.cl</strong>. Para consultas del CEPA: cepa@cepaciamaria.cl | 📞 +56 22 211 6166.',
  },
];

interface Message {
  from: 'bot' | 'user';
  html: string;
  isHtml?: boolean; // true = respuesta predefinida (HTML de confianza); false = texto (IA/usuario)
}

/** Limpia marcadores markdown básicos para mostrar el texto de la IA como texto plano. */
function toText(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/(?<!\*)\*(?!\*)(.*?)\*/g, '$1');
}
function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '');
}

export function AdminChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<'menu' | 'answered'>('menu');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        from: 'bot',
        html: '👋 Hola, soy el asistente del <strong>Panel CEPA</strong>. Escríbeme tu pregunta o elige un tema.',
        isHtml: true,
      }]);
      setPhase('menu');
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  function handleTopic(topic: Topic) {
    setMessages(prev => [
      ...prev,
      { from: 'user', html: topic.label, isHtml: false },
      { from: 'bot', html: topic.answer, isHtml: true },
    ]);
    setPhase('answered');
  }

  function goBack() {
    setMessages(prev => [
      ...prev,
      { from: 'bot', html: '¿En qué más te puedo ayudar?', isHtml: true },
    ]);
    setPhase('menu');
  }

  async function sendMessage() {
    const q = input.trim();
    if (!q || sending) return;
    const next: Message[] = [...messages, { from: 'user', html: q, isHtml: false }];
    setMessages(next);
    setInput('');
    setSending(true);
    setPhase('answered');
    const apiMessages = next
      .filter(m => m.from === 'user' || m.isHtml === false)
      .map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: stripHtml(m.html) }));
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'admin', messages: apiMessages }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.ok ? toText(data.reply) : (data.error || 'No pude responder ahora.');
      setMessages(prev => [...prev, { from: 'bot', html: reply, isHtml: false }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', html: 'No me pude conectar. Intenta de nuevo.', isHtml: false }]);
    } finally {
      setSending(false);
    }
  }

  const chips = phase === 'menu'
    ? TOPICS.map(t => ({ id: t.id, label: t.label, action: () => handleTopic(t) }))
    : [{ id: 'back', label: '↩ Volver al menú', action: goBack }];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Asistente del panel"
        title="Asistente del panel"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 66, height: 66, borderRadius: '50%',
          background: 'linear-gradient(135deg,#185FA5,#0C447C)',
          color: '#fff', border: '3px solid #fff', cursor: 'pointer', padding: 0, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 22px rgba(24,95,165,.5)',
          transition: 'transform .2s',
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/img/cepito-face.png" alt="Asistente Cepito" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </button>

      {/* Chat panel */}
      <div onClick={e => e.stopPropagation()} style={{
        position: 'fixed', bottom: 98, right: 24, zIndex: 9998,
        width: 380, maxHeight: 600,
        background: '#fff', borderRadius: 18,
        boxShadow: '0 16px 48px rgba(22,32,43,.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(.97)',
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .22s ease, transform .22s ease',
        border: '1px solid var(--color-line)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#185FA5,#0C447C)',
          color: '#fff', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,.18)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/cepito-face.png" alt="Cepito" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Asistente Admin</div>
            <div style={{ fontSize: 11, opacity: .75 }}>Ayuda del panel CEPA</div>
          </div>
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m, i) => {
            const bubbleStyle = {
              maxWidth: '86%', padding: '9px 13px', borderRadius: m.from === 'bot' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
              background: m.from === 'bot' ? 'var(--color-primary-50, #F2F8FD)' : 'var(--color-primary, #185FA5)',
              color: m.from === 'bot' ? 'var(--color-ink, #16202B)' : '#fff',
              fontSize: 13, lineHeight: 1.5, fontFamily: 'var(--sans)', whiteSpace: 'pre-wrap' as const,
            };
            return (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.isHtml
                  ? <div dangerouslySetInnerHTML={{ __html: m.html }} style={bubbleStyle} />
                  : <div style={bubbleStyle}>{m.html}</div>}
              </div>
            );
          })}
          {sending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '9px 13px', borderRadius: '4px 14px 14px 14px', background: 'var(--color-primary-50, #F2F8FD)', color: 'var(--color-muted, #8a93a2)', fontSize: 13 }}>
                escribiendo…
              </div>
            </div>
          )}
        </div>

        {/* Chips */}
        <div style={{ padding: '6px 14px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {chips.map(chip => (
            <button
              key={chip.id}
              type="button"
              onClick={e => { e.stopPropagation(); chip.action(); }}
              style={{
                background: '#fff', border: '1.5px solid var(--color-primary, #185FA5)',
                color: 'var(--color-primary, #185FA5)', borderRadius: 999,
                padding: '5px 12px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--sans)',
                transition: 'background .14s, color .14s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#185FA5'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#185FA5'; }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input de texto libre (IA) */}
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
          style={{ display: 'flex', gap: 6, padding: '10px 12px', borderTop: '1px solid var(--color-line, #e8edf5)', flexShrink: 0 }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            disabled={sending}
            style={{
              flex: 1, border: '1.5px solid var(--color-line, #e3e6ec)', borderRadius: 999,
              padding: '8px 14px', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label="Enviar"
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0, border: 'none',
              background: 'linear-gradient(135deg,#185FA5,#0C447C)', color: '#fff',
              cursor: sending || !input.trim() ? 'default' : 'pointer', opacity: sending || !input.trim() ? .5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
