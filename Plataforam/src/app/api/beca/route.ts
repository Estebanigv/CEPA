/* CEPA · Recepción del formulario de postulación a Beca.
 *
 * Envía la postulación por correo a cepa@cepaciamaria.cl (Centro de Padres)
 * con copia al apoderado solicitante, vía SMTP del cPanel (nodemailer).
 * Config por entorno: BECA_SMTP_HOST / PORT / USER / PASS (+ BECA_TO opcional).
 */
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const CEPA_EMAIL = process.env.BECA_TO ?? 'cepa@cepaciamaria.cl';

/** Campos del formulario en orden, con su etiqueta para el correo. */
const FIELDS: [string, string][] = [
  ['tipo_beca', 'Tipo de beca'],
  ['nombre_solicitante', 'Nombre del solicitante'],
  ['rut_solicitante', 'RUT del solicitante'],
  ['email', 'Correo electrónico'],
  ['direccion', 'Dirección'],
  ['comuna', 'Comuna'],
  ['apellidos_familia', 'Familia (apellidos)'],
  ['ano_ingreso', 'Año de ingreso al colegio'],
  ['num_hijos', 'N° de hijos en el colegio'],
  ['cursos', 'Cursos actuales'],
  ['estudiantes', 'Estudiantes para el beneficio'],
  ['descripcion', 'Situación por la que solicita'],
  ['transporte_detalle', 'Transporte que necesita'],
  ['almuerzo_dias', 'Días de almuerzo'],
  ['aportantes', 'Quiénes aportan al ingreso familiar'],
  ['profesion_padre', 'Profesión del padre'],
  ['ingreso_padre', 'Ingreso bruto mensual (padre)'],
  ['estado_laboral_padre', 'Estado laboral (padre)'],
  ['profesion_madre', 'Profesión de la madre'],
  ['ingreso_madre', 'Ingreso bruto mensual (madre)'],
  ['estado_laboral_madre', 'Estado laboral (madre)'],
  ['situacion_vivienda', 'Situación de vivienda'],
  ['monto_arriendo', 'Monto arriendo/dividendo'],
];

function esc(s: unknown): string {
  return String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida.' }, { status: 400 });
  }

  const get = (k: string) => String(form.get(k) ?? '').trim();
  const nombre = get('nombre_solicitante');
  const email = get('email');
  const certifico = form.get('certifico');

  if (!nombre || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Completa tu nombre y un correo válido.' }, { status: 400 });
  }
  if (!certifico) {
    return NextResponse.json({ ok: false, error: 'Debes aceptar la declaración de veracidad.' }, { status: 400 });
  }

  // Cuerpo del correo (tabla de campos completados)
  const rows = FIELDS.filter(([k]) => get(k))
    .map(([k, label]) => `<tr><td style="padding:6px 10px;color:#5b6472;font-weight:600;vertical-align:top">${esc(label)}</td><td style="padding:6px 10px">${esc(get(k))}</td></tr>`)
    .join('');
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1c1f26;max-width:640px">
      <h2 style="color:#1B2A4A">Nueva postulación a Beca — CEPA</h2>
      <p>Se recibió una nueva postulación a beca a través del sitio web.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #e3e6ec">${rows}</table>
      <p style="font-size:12px;color:#94a3b8;margin-top:16px">Enviado desde el formulario de becas de cepaciamaria.cl</p>
    </div>`;

  // Adjuntos (finiquitos)
  const attachments: { filename: string; content: Buffer }[] = [];
  for (const key of ['finiquito_padre', 'finiquito_madre']) {
    const f = form.get(key);
    if (f instanceof File && f.size > 0 && f.size < 8 * 1024 * 1024) {
      attachments.push({ filename: f.name || `${key}.pdf`, content: Buffer.from(await f.arrayBuffer()) });
    }
  }

  const host = process.env.BECA_SMTP_HOST;
  const user = process.env.BECA_SMTP_USER;
  const pass = process.env.BECA_SMTP_PASS;
  if (!host || !user || !pass) {
    return NextResponse.json(
      { ok: false, error: 'El envío de correo aún no está configurado. Escríbenos a cepa@cepaciamaria.cl.' },
      { status: 503 },
    );
  }

  const port = Number(process.env.BECA_SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465, auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Becas CEPA" <${user}>`,
      to: CEPA_EMAIL,
      cc: email, // copia al apoderado solicitante
      replyTo: email,
      subject: `Nueva postulación a beca — ${nombre}`,
      html,
      attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[CEPA] Error enviando beca:', err);
    return NextResponse.json({ ok: false, error: 'No se pudo enviar la postulación. Intenta de nuevo.' }, { status: 502 });
  }
}
