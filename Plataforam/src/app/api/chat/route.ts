/* CEPA · Asistente IA — proxy seguro a DeepSeek.
 *
 * El chatbot (admin o portal) envía el historial y aquí se antepone un prompt
 * de sistema con el contexto de CEPA. Para el admin se inyectan estadísticas
 * reales de la base. La API key vive solo en el servidor.
 */
import { NextResponse } from 'next/server';
import { deepseekChat, isAiConfigured, type ChatMessage } from '@/lib/ai';
import { isAdminAuthed } from '@/lib/server-auth';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const SYS_ADMIN = `Eres el asistente del panel de administración de CEPA, el Centro de Padres y Apoderados del Colegio Compañía de María Apoquindo (Santiago de Chile).
Ayudas al equipo de tesorería a usar el panel y a resolver dudas sobre las familias y las dos cuotas anuales: la cuota CEPA ($50.000) y la Beca de Fallecimiento ($30.000, columna "SEGURO" del registro histórico). También sobre pagos, cobranza y reportes.
Responde en español de Chile, de forma clara, breve y cordial. Usa los datos reales que se te entreguen. Si no tienes un dato, dilo con honestidad y sugiere dónde encontrarlo en el panel (Dashboard, Pagos/Contabilidad, Apoderados/Familias, Conceptos, Cobranza, Reportes). No inventes cifras.`;

const SYS_PORTAL = `Eres el asistente para apoderados de la plataforma de pagos del CEPA (Centro de Padres y Apoderados), Colegio Compañía de María Apoquindo.
Ayudas con dudas sobre pagos, las cuotas anuales (cuota CEPA $50.000 y Beca de Fallecimiento $30.000), medios de pago (WebPay crédito/débito, transferencia), comprobantes, becas y talleres.
Responde en español de Chile, amable y breve. No inventes ni reveles datos personales de familias; si te piden datos específicos de una familia, indica que los revisen en la sección "Mis datos" tras iniciar sesión. Para trámites, sugiere escribir a cepa@cepaciamaria.cl.`;

const SYS_PUBLICO = `Eres el asistente público del sitio web del CEPA (Centro de Padres y Apoderados), Colegio Compañía de María Apoquindo, Manquehue Sur 116, Las Condes, Santiago de Chile.
Atiendes a visitantes en general (apoderados y público). Respondes en español de Chile, cordial y breve. No pidas ni manejes datos personales sensibles.

Datos oficiales que puedes usar:
- Cuotas anuales 2026 por familia: cuota CEPA (Centro de Padres) $50.000 y Beca de Fallecimiento $30.000. Se pagan en línea (hasta 12 cuotas precio contado con WebPay) o por transferencia: Banco Santander, Cta. Cte. 03-99008-7, RUT 70.698.300-7. Comprobantes de transferencia a cepa@cepaciamaria.cl (con nombre, RUT y curso del alumno).
- Becas: Transporte Escolar, Almuerzo (tickets de casino) y Aporte Solidario (Gift Card $100.000/mes). Requisito: tener la cuota al día. Duración inicial 4 meses, renovable.
- Talleres deportivos: Básquetbol, Fútbol Masculino, Fútbol Femenino y Zumba (Mar/Jue 20:00–21:00 según disciplina), en el colegio.
- Eventos: Fiesta y Fonda en Familia, Tallarines con Bingo, Corrida Familiar CEPA, campañas solidarias.
- Convenios 2026 con descuentos (dental, uniformes, gimnasios, etc.). Presentar carnet de apoderado.
- Contacto: cepa@cepaciamaria.cl · +56 22 211 6166 · Instagram @cepacma.
Si no sabes algo con certeza, sugiere escribir a cepa@cepaciamaria.cl. No inventes fechas ni cifras.`;

async function adminStats(): Promise<string> {
  if (!isSupabaseConfigured()) return '';
  try {
    const sb = createAdminClient();
    const [fam, cepa, seg] = await Promise.all([
      sb.from('families').select('*', { count: 'exact', head: true }),
      sb.from('families').select('*', { count: 'exact', head: true }).eq('cepa_2026', true),
      sb.from('families').select('*', { count: 'exact', head: true }).eq('seguro_2026', true),
    ]);
    const total = fam.count ?? 0;
    const c = cepa.count ?? 0;
    const s = seg.count ?? 0;
    if (!total) return '';
    const pct = Math.round((c / total) * 100);
    return `\n\nDatos reales actuales de la base (año 2026): ${total} familias registradas; ${c} pagaron la cuota CEPA (${pct}% al día) y ${total - c} la tienen pendiente; ${s} pagaron la Beca de Fallecimiento.`;
  } catch {
    return '';
  }
}

function sanitize(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
    .slice(-10);
}

// El scope 'publico' se llama desde el sitio web estático (otro origen) → CORS abierto.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

type Scope = 'admin' | 'portal' | 'publico';

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return json({ ok: false, error: 'El asistente aún no está configurado.' }, 503);
  }

  let body: { scope?: string; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  const scope: Scope =
    body.scope === 'admin' ? 'admin' : body.scope === 'publico' ? 'publico' : 'portal';

  // El asistente admin (datos internos) exige sesión de administrador.
  if (scope === 'admin' && !isAdminAuthed()) {
    return json({ ok: false, error: 'No autorizado.' }, 401);
  }

  const history = sanitize(body.messages);
  if (!history.length) {
    return json({ ok: false, error: 'Sin mensaje.' }, 400);
  }

  const system =
    scope === 'admin' ? SYS_ADMIN + (await adminStats())
    : scope === 'publico' ? SYS_PUBLICO
    : SYS_PORTAL;
  const messages: ChatMessage[] = [{ role: 'system', content: system }, ...history];

  try {
    const reply = await deepseekChat(messages);
    return json({ ok: true, reply: reply || 'No tengo una respuesta en este momento.' });
  } catch (err) {
    console.error('[CEPA] Error asistente IA:', err);
    return json({ ok: false, error: 'No pude responder ahora. Intenta de nuevo.' }, 502);
  }
}
