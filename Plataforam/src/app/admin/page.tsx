/* CEPA · Panel admin — Server Component.
 *
 * Corre en el servidor: verifica la cookie httpOnly y carga los datos reales
 * con la service_role (que NO existe en el navegador). Si no hay sesión,
 * redirige al login. Los datos entran ya resueltos como prop a <AdminApp>.
 */
import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/server-auth';
import { getAdminData } from '@/lib/data';
import { AdminApp } from '@/components/admin/AdminApp';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!isAdminAuthed()) redirect('/admin/login');
  const data = await getAdminData();
  return <AdminApp data={data} />;
}
