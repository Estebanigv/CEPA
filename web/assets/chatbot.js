/* ============================================================
   CEPA — Chatbot Widget
   Fully self-contained IIFE · no global variables
   ============================================================ */
(function () {
  'use strict';

  /* ---- Config ----
     URL del backend Next.js (donde vive /api/chat).
     '' = mismo origen (si el sitio y la plataforma comparten dominio).
     Si están en dominios distintos, pon aquí la URL de Vercel, ej:
     var CEPA_API_BASE = 'https://cepa-plataforma.vercel.app'; */
  var CEPA_API_BASE = '';
  var PORTAL_URL = (CEPA_API_BASE || '') + '/portal/login';
  var CEPITO_IMG = '<img src="/img/cepito-face.png" alt="Cepito" style="width:100%;height:100%;object-fit:cover;" />';

  /* ---- Data ---- */
  var TOPICS = [
    {
      id: 'cuota',
      label: 'Cuotas y pagos',
      items: [
        {
          q: '¿Cuál es el valor de la cuota?',
          a: 'La cuota anual 2026 es de <strong>$50.000 por familia</strong>. Puede pagarse en hasta 12 cuotas precio contado vía Web Pay o por transferencia bancaria.',
          keywords: ['valor','cuanto','precio','monto','50000','cuota']
        },
        {
          q: '¿Dónde pago?',
          a: 'Puedes pagar en línea desde nuestra plataforma (botón verde en el sitio). También por transferencia a <strong>Banco Santander · Cta. Cte. 03-99008-7 · RUT 70.698.300-7</strong>. Email: cepa@cepaciamaria.cl',
          keywords: ['donde','pago','pagar','transferencia','webpay','como']
        },
        {
          q: '¿Cómo envío el comprobante?',
          a: 'Si pagas por transferencia, envía el comprobante a <strong>cepa@cepaciamaria.cl</strong> indicando tu nombre, RUT y curso del alumno. Por Web Pay el comprobante llega automáticamente a tu email.',
          keywords: ['comprobante','envio','enviar','recibo']
        },
        {
          q: '¿Qué beneficios tiene pagar?',
          a: 'Pagar la cuota te permite: postular a Becas y Acción Social · participar en talleres deportivos · acceso preferente a eventos · participar en iniciativas solidarias de la comunidad.',
          keywords: ['beneficio','sirve','para que']
        }
      ]
    },
    {
      id: 'becas',
      label: 'Becas',
      items: [
        {
          q: '¿Qué becas existen?',
          a: 'Tenemos 3 becas: <strong>Transporte Escolar</strong> (traslado al colegio), <strong>Almuerzo</strong> (tickets de casino) y <strong>Aporte Solidario</strong> (Gift Card de $100.000 al mes).',
          keywords: ['becas','cuales','tipos','que becas']
        },
        {
          q: '¿Cómo postulo?',
          a: 'Para postular: 1) Debes tener la cuota al día 2) Completa el formulario de postulación 3) Acredita tu situación con documentos 4) Puede haber entrevista con la Comisión. Escríbenos a cepa@cepaciamaria.cl',
          keywords: ['postulo','postular','como','inscribir','solicitar']
        },
        {
          q: '¿Cuánto duran las becas?',
          a: 'Las becas tienen duración inicial de <strong>4 meses</strong>, tras los cuales pueden renovarse según disponibilidad de recursos y situación familiar.',
          keywords: ['duran','duracion','tiempo','cuanto tiempo','renovar']
        },
        {
          q: '¿Debo estar al día en la cuota?',
          a: 'Sí, es requisito fundamental tener al día la <strong>cuota anual del Centro de Padres</strong> para postular a cualquier beca.',
          keywords: ['dia','al dia','requisito','condicion','cuota']
        }
      ]
    },
    {
      id: 'deportes',
      label: 'Deportes',
      items: [
        {
          q: '¿Cuáles son los talleres?',
          a: 'Los talleres son:<br>• <strong>Básquetbol</strong> — Mar/Jue 20:00–21:00, Cancha Techada<br>• <strong>Fútbol Masculino</strong> — Mar/Jue 20:00–21:00, Pasto Sintético<br>• <strong>Fútbol Femenino</strong> — Lun (Pasto) / Mié (Cancha Techada) 20:00–21:00<br>• <strong>Zumba</strong> — Mar/Jue 20:00–21:00, Gimnasio',
          keywords: ['talleres','cuales','actividades','deportes','ofrecen']
        },
        {
          q: '¿Dónde se realizan?',
          a: 'En el Colegio Compañía de María Apoquindo, <strong>Manquehue Sur 116, Las Condes</strong>: Cancha de Pasto Sintético, Cancha Techada y Gimnasio.',
          keywords: ['donde','lugar','colegio','instalaciones']
        },
        {
          q: '¿Cómo me inscribo?',
          a: 'Escríbenos a <strong>cepa@cepaciamaria.cl</strong> indicando el taller y el nombre del apoderado. También puedes inscribirte desde la plataforma de pagos.',
          keywords: ['inscribo','inscribir','inscripcion','registro','unirme']
        },
        {
          q: '¿Tienen costo los talleres?',
          a: 'Algunos talleres tienen una cuota de participación. El valor exacto se informa al momento de la inscripción. Escríbenos a cepa@cepaciamaria.cl para saber el valor actual.',
          keywords: ['costo','valor','precio','gratis','cuanto cuesta']
        }
      ]
    },
    {
      id: 'convenios',
      label: 'Convenios',
      items: [
        {
          q: '¿Qué convenios están vigentes?',
          a: 'Convenios 2026:<br>• Clínica Dental Del Inca<br>• Scolari (uniformes)<br>• The Amazing House<br>• Escuela de Fútbol UC Vitacura<br>• Proyecto PVC (ventanas)<br>• Escuela de Flamenco Jordas &amp; Flores<br>• Sigma Abogados<br>• Distrito F (gym)<br>• Glowzilla (fiestas)<br>• Clínica Dental NUA',
          keywords: ['convenios','vigentes','cuales','empresas','descuentos','beneficios']
        },
        {
          q: '¿Cómo accedo al descuento?',
          a: 'Presenta tu carnet de apoderado o menciona que eres del <strong>CEPA Compañía de María Apoquindo</strong> al contratar el servicio. Para más detalles: cepa@cepaciamaria.cl',
          keywords: ['accedo','como','descuento','usar','acceso']
        }
      ]
    },
    {
      id: 'eventos',
      label: 'Eventos',
      items: [
        {
          q: '¿Cuándo es la Fiesta en Familia?',
          a: 'La <strong>Fiesta y Fonda en Familia</strong> es el evento emblemático del CEPA. La fecha se anuncia a través del sitio y redes sociales. ¡Síguenos en <strong>@cepacma</strong> para no perderte nada!',
          keywords: ['fiesta','fonda','familia','cuando','fecha']
        },
        {
          q: '¿Cuándo es el Tallarines con Bingo?',
          a: 'Los <strong>Tallarines con Bingo</strong> se realizan anualmente. La fecha se comunica con anticipación. Síguenos en Instagram <strong>@cepacma</strong>.',
          keywords: ['tallarines','bingo','cuando','fecha']
        },
        {
          q: '¿Qué otros eventos hay?',
          a: 'Eventos principales del año:<br>• Fiesta y Fonda en Familia<br>• Tallarines con Bingo<br>• Corrida Familiar CEPA<br>• Actividades de Pastoral Familiar<br>• Campañas solidarias Cristo en la Calle',
          keywords: ['eventos','actividades','que hay','calendario']
        }
      ]
    },
    {
      id: 'contacto',
      label: 'Contacto',
      items: [
        {
          q: '¿Cómo contacto al CEPA?',
          a: '📧 cepa@cepaciamaria.cl<br>📞 +56 22 211 6166<br>📍 Manquehue Sur 116, Las Condes<br>📱 @cepacma en Instagram',
          keywords: ['contacto','contactar','comunicarme','escribir','telefono','email']
        },
        {
          q: 'Formulario de contacto',
          a: 'Puedes usar nuestro <a href="/contacto.html">formulario de contacto</a> para enviarnos tu consulta directamente desde el sitio.',
          keywords: ['formulario','form','contacto']
        }
      ]
    }
  ];

  /* ---- Helpers ---- */
  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = (s == null ? '' : String(s));
    return d.innerHTML;
  }
  function aiToHtml(s) {
    return escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .trim();
  }

  function findAnswer(text) {
    var norm = normalize(text);
    var best = null;
    var bestScore = 0;
    for (var t = 0; t < TOPICS.length; t++) {
      var topic = TOPICS[t];
      for (var i = 0; i < topic.items.length; i++) {
        var item = topic.items[i];
        var score = 0;
        for (var k = 0; k < item.keywords.length; k++) {
          if (norm.indexOf(normalize(item.keywords[k])) !== -1) {
            score += item.keywords[k].length; // longer keyword = more specific
          }
        }
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }
    }
    return bestScore > 0 ? best : null;
  }

  /* ---- DOM builder ---- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k === 'innerHTML') node.innerHTML = attrs[k];
        else if (k === 'for') node.setAttribute('for', attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (children) {
      children.forEach(function (c) {
        if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  /* ---- Widget build ---- */
  function buildWidget() {
    /* Button */
    var badge = el('span', { className: 'cepa-chat-badge' }, ['1']);
    var btn = el('button', {
      className: 'cepa-chat-btn',
      'aria-label': 'Abrir asistente CEPA',
      'aria-haspopup': 'dialog'
    });
    btn.innerHTML = '<img src="/img/cepito-face.png" alt="Abrir chat con Cepito" />';
    btn.appendChild(badge);

    /* Panel */
    var panel = el('div', {
      className: 'cepa-chat-panel',
      role: 'dialog',
      'aria-label': 'Asistente CEPA',
      'aria-modal': 'true'
    });

    /* Header */
    var closeBtn = el('button', { className: 'cepa-chat-close', 'aria-label': 'Cerrar chat' });
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    var header = el('div', { className: 'cepa-chat-header' });
    header.innerHTML = '<div class="cepa-chat-header-left"><div class="cepa-chat-avatar">' + CEPITO_IMG + '</div><div class="cepa-chat-header-info"><strong>Asistente CEPA</strong><span>En línea ahora</span></div></div>';
    header.appendChild(closeBtn);
    panel.appendChild(header);

    /* Msgs area */
    var msgs = el('div', { className: 'cepa-chat-msgs', 'aria-live': 'polite' });
    panel.appendChild(msgs);

    /* Chips container */
    var chipsEl = el('div', { className: 'cepa-chips' });
    panel.appendChild(chipsEl);

    /* Input */
    var inputRow = el('div', { className: 'cepa-chat-input' });
    var inputEl = el('input', { type: 'text', placeholder: 'Escribe tu consulta…', 'aria-label': 'Mensaje' });
    var sendBtn = el('button', { type: 'button', 'aria-label': 'Enviar' });
    sendBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
    inputRow.appendChild(inputEl);
    inputRow.appendChild(sendBtn);
    panel.appendChild(inputRow);

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    /* ---- State ---- */
    var isOpen = false;
    var aiHistory = []; // conversación para el asistente IA (scope 'publico')

    /* ---- Utilities ---- */
    function scrollBottom() {
      msgs.scrollTop = msgs.scrollHeight;
    }

    function appendMsg(type, html) {
      var row = el('div', { className: 'cepa-msg cepa-msg-' + type });
      if (type === 'bot') {
        var icon = el('div', { className: 'cepa-msg-icon', innerHTML: CEPITO_IMG });
        row.appendChild(icon);
      }
      var bubble = el('div', { className: 'cepa-bubble', innerHTML: html });
      row.appendChild(bubble);
      msgs.appendChild(row);
      scrollBottom();
      return row;
    }

    function showTyping() {
      var row = el('div', { className: 'cepa-msg cepa-msg-bot cepa-typing' });
      var icon = el('div', { className: 'cepa-msg-icon', innerHTML: CEPITO_IMG });
      var dots = el('div', { className: 'cepa-typing-dots' });
      dots.innerHTML = '<span></span><span></span><span></span>';
      row.appendChild(icon);
      row.appendChild(dots);
      msgs.appendChild(row);
      scrollBottom();
      return row;
    }

    function setChips(items) {
      chipsEl.innerHTML = '';
      items.forEach(function (item) {
        var chip = el('button', { className: 'cepa-chip', type: 'button' }, [item.label]);
        chip.addEventListener('click', function (e) { e.stopPropagation(); item.action(); });
        chipsEl.appendChild(chip);
      });
    }

    function showAnswer(item) {
      var typingRow = showTyping();
      setTimeout(function () {
        msgs.removeChild(typingRow);
        appendMsg('bot', item.a);
        showPostAnswerChips();
      }, 600);
    }

    function showPostAnswerChips() {
      setChips([
        { label: '↩ Volver al menú', action: showMainMenu },
        { label: 'Pagar cuota', action: function () {
          window.open(PORTAL_URL, '_blank');
        }}
      ]);
    }

    function showTopicChips(topic) {
      appendMsg('user', topic.label);
      var chips = topic.items.map(function (item) {
        return {
          label: item.q,
          action: function () {
            appendMsg('user', item.q);
            showAnswer(item);
          }
        };
      });
      chips.push({ label: '↩ Volver al menú', action: showMainMenu });
      setChips(chips);
    }

    function showMainMenu() {
      var chips = TOPICS.map(function (topic) {
        return {
          label: topic.label,
          action: function () { showTopicChips(topic); }
        };
      });
      setChips(chips);
    }

    function showGreeting() {
      appendMsg('bot', '¡Hola! 👋 Soy el asistente del <strong>CEPA Compañía de María Apoquindo</strong>. ¿En qué puedo ayudarte hoy?');
      showMainMenu();
    }

    function handleFreeText(text) {
      if (!text.trim()) return;
      appendMsg('user', escapeHtml(text));
      inputEl.value = '';
      var found = findAnswer(text);
      if (found) {
        showAnswer(found);
      } else {
        askAI(text);
      }
    }

    /* Asistente IA (DeepSeek) para consultas de texto libre sin match. */
    function askAI(text) {
      aiHistory.push({ role: 'user', content: text });
      var typingRow = showTyping();
      fetch((CEPA_API_BASE || '') + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'publico', messages: aiHistory.slice(-10) })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (typingRow.parentNode) msgs.removeChild(typingRow);
          if (data && data.ok && data.reply) {
            aiHistory.push({ role: 'assistant', content: data.reply });
            appendMsg('bot', aiToHtml(data.reply));
          } else {
            appendMsg('bot', 'No encontré una respuesta exacta. Escríbenos a <a href="mailto:cepa@cepaciamaria.cl">cepa@cepaciamaria.cl</a> o usa el <a href="/contacto.html">formulario de contacto</a>.');
          }
          setChips([{ label: '↩ Volver al menú', action: showMainMenu }]);
        })
        .catch(function () {
          if (typingRow.parentNode) msgs.removeChild(typingRow);
          appendMsg('bot', 'No me pude conectar en este momento. Escríbenos a <a href="mailto:cepa@cepaciamaria.cl">cepa@cepaciamaria.cl</a>.');
          setChips([{ label: '↩ Volver al menú', action: showMainMenu }]);
        });
    }

    /* ---- Events ---- */
    function openPanel() {
      isOpen = true;
      panel.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      badge.classList.add('hidden');
      if (msgs.childElementCount === 0) showGreeting();
      inputEl.focus();
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }

    btn.addEventListener('click', function () {
      isOpen ? closePanel() : openPanel();
    });
    closeBtn.addEventListener('click', closePanel);

    sendBtn.addEventListener('click', function () { handleFreeText(inputEl.value); });
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleFreeText(inputEl.value);
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closePanel();
    });

    /* Click outside to close */
    document.addEventListener('click', function (e) {
      if (isOpen && !panel.contains(e.target) && !btn.contains(e.target)) closePanel();
    });
  }

  /* ---- Init ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

}());
