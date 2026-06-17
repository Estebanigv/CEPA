/* CEPA · cliente Supabase con service_role (SOLO servidor).
 *
 * El panel admin lee la data desde el servidor (Server Components) usando la
 * service_role key, que bypassa RLS. Esa key NUNCA debe llegar al cliente:
 * por eso este archivo solo se importa desde código de servidor (src/lib/data.ts).
 *
 * RLS queda habilitado en todas las tablas (deny-by-default), así que la anon key
 * pública no expone nada hasta que definamos políticas por rol (auth de tesorería).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** ¿Hay credenciales de Supabase en el entorno? Si no, la app usa datos de ejemplo. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let cached: SupabaseClient | null = null;

/** Cliente admin (service_role). Cachea la instancia entre requests del servidor. */
export function createAdminClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.');
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
