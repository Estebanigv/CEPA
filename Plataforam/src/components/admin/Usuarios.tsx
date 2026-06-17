'use client';
/* CEPA Admin · Roles y usuarios (permisos y auditoría) */
import { Icon } from './Icon';
import { initials } from '@/lib/format';

export function Usuarios() {
  const users = [
    { name: 'Patricia Lagos M.', role: 'Admin / Tesorería', email: 'tesoreria@cepaciamaria.cl', perms: 'Acceso total', color: 'ic-blue' },
    { name: 'Comité Directiva', role: 'Directiva', email: 'directiva@cepaciamaria.cl', perms: 'Solo lectura · dashboard y reportes', color: 'ic-green' },
    { name: 'Rosa Méndez', role: 'Operador', email: 'oficina@cepaciamaria.cl', perms: 'Pagos manuales · recordatorios', color: 'ic-amber' },
  ];
  const audit = [
    { who: 'Patricia Lagos M.', action: 'Registró pago en efectivo · EFE-000142', date: 'Hoy · 13:12' },
    { who: 'Rosa Méndez', action: 'Envió recordatorio masivo (14 familias)', date: 'Ayer · 09:00' },
    { who: 'Patricia Lagos M.', action: 'Editó concepto "Cuota Zumba"', date: '06 jun · 18:40' },
  ];
  return (
    <div className="content fade-up">
      <div className="toolbar">
        <div>
          <h3 style={{ fontSize: 15 }}>Roles y permisos</h3>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
            Quién puede hacer qué en el panel.
          </div>
        </div>
        <div className="spacer"></div>
        <button className="btn btn--primary">
          <Icon name="plus" size={16} /> Invitar usuario
        </button>
      </div>
      <div className="tbl-wrap" style={{ marginBottom: 24 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Permisos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} style={{ cursor: 'default' }}>
                <td>
                  <span className="av-sm">{initials(u.name)}</span>
                  <span className="cell-strong">{u.name}</span>
                  <div className="t-id" style={{ marginLeft: 39 }}>
                    {u.email}
                  </div>
                </td>
                <td>
                  <span className="badge badge--neutral">
                    <Icon name="shieldUser" size={13} /> {u.role}
                  </span>
                </td>
                <td className="muted">{u.perms}</td>
                <td className="t-r">
                  <button className="btn btn--ghost btn--icon btn--sm">
                    <Icon name="edit" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="panel-h">
          <div>
            <h3>Log de auditoría</h3>
            <div className="ph-sub">Acciones administrativas recientes</div>
          </div>
        </div>
        <div className="mini-list" style={{ padding: '8px 14px 16px' }}>
          {audit.map((a, i) => (
            <div className="mini-item" key={i}>
              <div className="mini-av">{initials(a.who)}</div>
              <div className="mini-main">
                <div className="mini-name" style={{ fontWeight: 500 }}>
                  {a.action}
                </div>
                <div className="mini-sub">{a.who}</div>
              </div>
              <span className="muted" style={{ fontSize: 12 }}>
                {a.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
