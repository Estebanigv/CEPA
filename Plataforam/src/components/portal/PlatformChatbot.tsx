'use client';

import { useState, useRef, useEffect } from 'react';

/* ---- Types ---- */
interface Topic {
  id: string;
  label: string;
  answer: string;
}

/* ---- Data ---- */
const TOPICS: Topic[] = [
  {
    id: 'como-pago',
    label: '¿Cómo pago?',
    answer: 'Ve a <strong>Pagar</strong> en el menú, selecciona los conceptos que deseas abonar, agrégalos al carrito y haz clic en "Ir a pagar".',
  },
  {
    id: 'metodos-pago',
    label: 'Métodos de pago',
    answer: 'Aceptamos <strong>WebPay Crédito</strong> (hasta 3 cuotas precio contado) y <strong>WebPay Débito</strong>. También puedes pagar por transferencia bancaria.',
  },
  {
    id: 'descargar-comprobante',
    label: 'Descargar comprobante',
    answer: 'Ve a <strong>Mis pagos</strong>, busca la transacción correspondiente y haz clic en <strong>PDF</strong>. El comprobante también llega automáticamente al email registrado.',
  },
  {
    id: 'ver-pendientes',
    label: 'Ver pagos pendientes',
    answer: 'Ve a <strong>Pendientes</strong> en el menú para ver las cuotas vencidas y las próximas a vencer.',
  },
  {
    id: 'pago-rechazado',
    label: 'Pago rechazado',
    answer: 'El banco rechazó el pago. Puedes intentar con: otra tarjeta, débito en lugar de crédito, o verifica que tengas fondos suficientes. Contacta a tu banco si el problema persiste.',
  },
  {
    id: 'postular-beca',
    label: 'Postular a beca',
    answer: 'Escríbenos a <strong>cepa@cepaciamaria.cl</strong>. Necesitas: cuota al día + documentos que acrediten tu situación socioeconómica.',
  },
  {
    id: 'inscribir-taller',
    label: 'Inscribir en taller',
    answer: 'Escríbenos a <strong>cepa@cepaciamaria.cl</strong> indicando el nombre del taller y el nombre del alumno o apoderado.',
  },
  {
    id: 'contactar-soporte',
    label: 'Contactar soporte',
    answer: '📧 cepa@cepaciamaria.cl | 📞 +56 22 211 6166 | Lunes a viernes en horario escolar.',
  },
];

/* ---- Styles (inline, using CSS variables from globals.css where applicable) ---- */
const S = {
  btn: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#185FA5',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(24,95,165,.45), 0 2px 8px rgba(0,0,0,.18)',
    transition: 'transform .2s ease, box-shadow .2s ease',
    outline: 'none',
  },
  panel: (open: boolean) => ({
    position: 'fixed' as const,
    bottom: '90px',
    right: '24px',
    zIndex: 9998,
    width: '340px',
    maxHeight: '520px',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 16px 56px rgba(27,42,74,.22), 0 4px 16px rgba(27,42,74,.12)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(.97)',
    pointerEvents: open ? ('all' as const) : ('none' as const),
    transition: 'opacity .25s ease, transform .25s ease',
  }),
  header: {
    background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
    color: '#fff',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  closeBtn: {
    background: 'rgba(255,255,255,.15)',
    border: 'none',
    color: '#fff',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  msgs: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    scrollBehavior: 'smooth' as const,
  },
  msgRow: (isUser: boolean) => ({
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '8px',
    alignItems: 'flex-end' as const,
    justifyContent: isUser ? ('flex-end' as const) : ('flex-start' as const),
  }),
  icon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#E6F1FB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  bubbleBot: {
    padding: '10px 14px',
    maxWidth: '85%',
    fontSize: '13.5px',
    lineHeight: 1.55,
    fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
    background: '#E6F1FB',
    color: '#16202B',
    borderRadius: '0 14px 14px 14px',
    wordBreak: 'break-word' as const,
  },
  chipsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    padding: '4px 16px 14px',
  },
  chip: {
    border: '1.5px solid #185FA5',
    color: '#185FA5',
    background: '#fff',
    borderRadius: '999px',
    padding: '6px 14px',
    fontSize: '12.5px',
    fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
    fontWeight: 500,
    cursor: 'pointer',
    lineHeight: 1.2,
    transition: 'background .15s, color .15s',
  } as React.CSSProperties,
};

/* ---- Helper: render **bold** text ---- */
function renderAnswer(html: string) {
  return (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/* ---- Component ---- */
export default function PlatformChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: 'bot' | 'user'; text: string; isHtml?: boolean }[]>([]);
  const [showChips, setShowChips] = useState<'menu' | 'back' | null>(null);
  const [initialized, setInitialized] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  /* Scroll to bottom whenever messages change */
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, showChips]);

  function openPanel() {
    setOpen(true);
    if (!initialized) {
      setMessages([
        {
          type: 'bot',
          text: '¡Hola! 👋 Soy el asistente de la <strong>Plataforma CEPA</strong>. ¿En qué puedo ayudarte?',
          isHtml: true,
        },
      ]);
      setShowChips('menu');
      setInitialized(true);
    }
  }

  function closePanel() {
    setOpen(false);
  }

  function handleTopicClick(topic: Topic) {
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: topic.label },
      { type: 'bot', text: topic.answer, isHtml: true },
    ]);
    setShowChips('back');
  }

  function handleBack() {
    setMessages((prev) => [
      ...prev,
      { type: 'bot', text: '¿En qué más puedo ayudarte?', isHtml: false },
    ]);
    setShowChips('menu');
  }

  return (
    <>
      {/* Floating button */}
      <button
        style={S.btn}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente CEPA'}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? closePanel() : openPanel())}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div
        style={S.panel(open)}
        role="dialog"
        aria-label="Asistente CEPA"
        aria-modal="true"
      >
        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.avatar}>🎓</div>
            <div style={S.headerInfo}>
              <strong style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>
                Asistente CEPA
              </strong>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Plataforma de pagos</span>
            </div>
          </div>
          <button style={S.closeBtn} aria-label="Cerrar chat" onClick={closePanel}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={S.msgs} ref={msgsRef} aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} style={S.msgRow(msg.type === 'user')}>
              {msg.type === 'bot' && <div style={S.icon}>🎓</div>}
              <div style={S.bubbleBot}>
                {msg.isHtml ? renderAnswer(msg.text) : msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chips */}
        {showChips === 'menu' && (
          <div style={S.chipsWrap}>
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                style={S.chip}
                onClick={() => handleTopicClick(topic)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#185FA5';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                  (e.currentTarget as HTMLButtonElement).style.color = '#185FA5';
                }}
              >
                {topic.label}
              </button>
            ))}
          </div>
        )}

        {showChips === 'back' && (
          <div style={S.chipsWrap}>
            <button
              style={S.chip}
              onClick={handleBack}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#185FA5';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                (e.currentTarget as HTMLButtonElement).style.color = '#185FA5';
              }}
            >
              ↩ Volver
            </button>
          </div>
        )}
      </div>
    </>
  );
}
