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
}

export function AdminChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<'menu' | 'answered'>('menu');
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        from: 'bot',
        html: '👋 Hola, soy el asistente del <strong>Panel CEPA</strong>. ¿En qué te puedo ayudar hoy?',
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
      { from: 'user', html: topic.label },
      { from: 'bot', html: topic.answer },
    ]);
    setPhase('answered');
  }

  function goBack() {
    setMessages(prev => [
      ...prev,
      { from: 'bot', html: '¿En qué más te puedo ayudar?' },
    ]);
    setPhase('menu');
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
          width: 50, height: 50, borderRadius: '50%',
          background: 'linear-gradient(135deg,#185FA5,#0C447C)',
          color: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(24,95,165,.45)',
          transition: 'transform .2s',
          transform: open ? 'rotate(90deg)' : 'rotate(0)',
        }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div style={{
        position: 'fixed', bottom: 82, right: 24, zIndex: 9998,
        width: 320, maxHeight: 480,
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
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Asistente Admin</div>
            <div style={{ fontSize: 11, opacity: .75 }}>Ayuda del panel CEPA</div>
          </div>
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                dangerouslySetInnerHTML={{ __html: m.html }}
                style={{
                  maxWidth: '86%', padding: '9px 13px', borderRadius: m.from === 'bot' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  background: m.from === 'bot' ? 'var(--color-primary-50, #F2F8FD)' : 'var(--color-primary, #185FA5)',
                  color: m.from === 'bot' ? 'var(--color-ink, #16202B)' : '#fff',
                  fontSize: 13, lineHeight: 1.5, fontFamily: 'var(--sans)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Chips */}
        <div style={{ padding: '6px 14px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {chips.map(chip => (
            <button
              key={chip.id}
              onClick={chip.action}
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
      </div>
    </>
  );
}
