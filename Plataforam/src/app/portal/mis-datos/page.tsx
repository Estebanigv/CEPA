/* CEPA · Portal apoderado — "Mis datos" (Server Component).
 *
 * Muestra la ficha real de la familia autenticada: estado de las cuotas 2026,
 * estudiantes, contacto e historial anual. Los datos se cargan en el servidor
 * con la service_role a partir del id de familia guardado en la cookie.
 */
import { redirect } from 'next/navigation';
import { getPortalFamilyId } from '@/lib/portal-auth';
import { getFamilyById } from '@/lib/portal-server-data';
import { LogoutButton } from '@/components/portal/LogoutButton';

export const dynamic = 'force-dynamic';

function CuotaCard({ label, paid, folio }: { label: string; paid: boolean; folio: string | null }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 12.5, color: 'var(--color-muted)', marginBottom: 8 }}>{label} · Año 2026</div>
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14,
          color: paid ? '#1E7A52' : '#B0740C',
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: paid ? '#1E7A52' : '#E0A72E' }} />
        {paid ? 'Pagado' : 'Pendiente'}
      </span>
      {paid && folio ? (
        <div style={{ fontSize: 11.5, color: 'var(--color-muted)', marginTop: 8 }}>Comprobante N° {folio}</div>
      ) : null}
    </div>
  );
}

export default async function MisDatosPage() {
  const fid = getPortalFamilyId();
  if (!fid) redirect('/portal/login');
  const fam = await getFamilyById(fid);
  if (!fam) redirect('/portal/login');

  const years = Object.keys(fam.historial).sort((a, b) => Number(b) - Number(a));
  const pendientes = [
    !fam.cepa2026 ? 'Cuota Centro de Padres (CEPA) 2026' : null,
    !fam.seguro2026 ? 'Seguro Escolar 2026' : null,
  ].filter(Boolean) as string[];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-soft)' }}>
      {/* Header simple */}
      <header
        style={{
          background: 'linear-gradient(135deg,#1B2A4A,#22355c)', color: '#fff',
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 12.5, opacity: .8 }}>Portal Apoderados · CEPA</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{fam.apoderado}</div>
          <div style={{ fontSize: 12.5, opacity: .8 }}>Familia {fam.name}{fam.cursos ? ` · ${fam.cursos}` : ''}</div>
        </div>
        <LogoutButton
          style={{
            background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.25)',
            color: '#fff', borderRadius: 10, padding: '8px 14px', fontSize: 13, cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        />
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Mis datos</h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 24 }}>
          Estado de tus cuotas del Centro de Padres y datos de tu familia.
        </p>

        {/* Estado cuotas 2026 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14, marginBottom: 20 }}>
          <CuotaCard label="Cuota CEPA" paid={fam.cepa2026} folio={fam.cepaFolio2026} />
          <CuotaCard label="Seguro Escolar" paid={fam.seguro2026} folio={fam.seguroFolio2026} />
        </div>

        {/* Pendientes */}
        {pendientes.length > 0 && (
          <div className="card" style={{ padding: '18px 20px', marginBottom: 20, borderLeft: '3px solid #E0A72E' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Pendiente de pago 2026</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: 'var(--color-ink)' }}>
              {pendientes.map((p) => (<li key={p} style={{ marginBottom: 4 }}>{p}</li>))}
            </ul>
          </div>
        )}

        {/* Estudiantes */}
        <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Mis estudiantes</div>
          {fam.students.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i ? '1px solid var(--color-line-soft)' : undefined }}>
              <span style={{ fontWeight: 500 }}>{s.name}</span>
              <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>{s.curso ?? '—'}</span>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Contacto</div>
          {(fam.padreNombre || fam.padreEmail) && (
            <div style={{ padding: '6px 0', fontSize: 13.5 }}>
              <span style={{ color: 'var(--color-muted)' }}>Padre: </span>{fam.padreNombre || '—'}
              {fam.padreEmail ? <span style={{ color: 'var(--color-muted)' }}> · {fam.padreEmail}</span> : null}
            </div>
          )}
          {(fam.madreNombre || fam.madreEmail) && (
            <div style={{ padding: '6px 0', fontSize: 13.5 }}>
              <span style={{ color: 'var(--color-muted)' }}>Madre: </span>{fam.madreNombre || '—'}
              {fam.madreEmail ? <span style={{ color: 'var(--color-muted)' }}> · {fam.madreEmail}</span> : null}
            </div>
          )}
          <div style={{ padding: '6px 0', fontSize: 13.5 }}>
            <span style={{ color: 'var(--color-muted)' }}>Teléfono: </span>{fam.telefono || '—'}
          </div>
        </div>

        {/* Historial anual */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Historial anual (CEPA / Seguro)</div>
          {years.length ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ color: 'var(--color-muted)', fontSize: 12 }}>
                  <th style={{ textAlign: 'left', padding: '4px 0' }}>Año</th>
                  <th style={{ textAlign: 'center', padding: '4px 0' }}>CEPA</th>
                  <th style={{ textAlign: 'center', padding: '4px 0' }}>Seguro</th>
                </tr>
              </thead>
              <tbody>
                {years.map((y) => {
                  const h = fam.historial[y];
                  return (
                    <tr key={y} style={{ borderTop: '1px solid var(--color-line-soft)' }}>
                      <td style={{ padding: '7px 0' }}>{y}</td>
                      <td style={{ textAlign: 'center', color: h.cepa ? '#1E7A52' : '#c5ccd8' }}>{h.cepa ? '✓' : '—'}</td>
                      <td style={{ textAlign: 'center', color: h.seguro ? '#1E7A52' : '#c5ccd8' }}>{h.seguro ? '✓' : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Sin historial registrado.</div>
          )}
        </div>
      </main>
    </div>
  );
}
