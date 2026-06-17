'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { clearSession } from '@/lib/portal-session';
import type { PortalUser } from '@/lib/portal-types';

type Nav = 'conceptos' | 'pendientes' | 'mis-pagos' | 'perfil';

interface Props {
  user: PortalUser;
  active: Nav;
  cartCount?: number;
  onCartOpen?: () => void;
}

export function PortalHeader({ user, active, cartCount = 0, onCartOpen }: Props) {
  const router = useRouter();

  function logout() {
    clearSession();
    router.push('/portal/login');
  }

  const navItems: { id: Nav; label: string; path: string }[] = [
    { id: 'conceptos', label: 'Pagar', path: '/portal/conceptos' },
    { id: 'pendientes', label: 'Pendientes', path: '/portal/pendientes' },
    { id: 'mis-pagos', label: 'Mis pagos', path: '/portal/mis-pagos' },
  ];

  const firstName = user.name.split(' ')[0];
  const initials = user.name.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #e3e6ec',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 8px rgba(27,42,74,.06)',
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 64, gap: 0,
      }}>

        {/* Logo + Brand */}
        <a href="http://localhost:5000" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', marginRight: 32, flexShrink: 0,
        }}>
          <Image
            src="/logo.png"
            alt="CEPA Compañía de María"
            width={38}
            height={38}
            style={{ objectFit: 'contain', borderRadius: 8 }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1B2A4A', lineHeight: 1.1, letterSpacing: '-.01em' }}>
              CEPA
            </div>
            <div style={{ fontSize: 10, color: '#8a93a2', lineHeight: 1, letterSpacing: '.04em', textTransform: 'uppercase' }}>
              Cía. de María Apoquindo
            </div>
          </div>
        </a>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: '#e3e6ec', marginRight: 24, flexShrink: 0 }} />

        {/* Nav tabs */}
        <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
          {navItems.map(item => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                style={{
                  background: isActive ? '#f0f4fa' : 'transparent',
                  border: 0,
                  borderRadius: 10,
                  padding: '7px 16px',
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#1B2A4A' : '#5b6472',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background .13s, color .13s',
                  letterSpacing: '-.005em',
                  position: 'relative',
                }}
              >
                {item.label}
                {isActive && (
                  <span style={{
                    position: 'absolute', bottom: -1, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 20, height: 2.5,
                    background: '#1B2A4A', borderRadius: 99,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Cart */}
        {onCartOpen && (
          <button
            onClick={onCartOpen}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: cartCount > 0 ? '#1E7A52' : '#f7f8fb',
              border: cartCount > 0 ? 'none' : '1px solid #e3e6ec',
              borderRadius: 10, padding: '8px 14px',
              fontSize: 13.5, fontWeight: 600,
              color: cartCount > 0 ? '#fff' : '#5b6472',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background .13s, color .13s',
              marginLeft: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.56l1.65-9.84H6"/>
            </svg>
            {cartCount > 0 ? `${cartCount} ítem${cartCount > 1 ? 's' : ''}` : 'Carrito'}
          </button>
        )}

        {/* User area */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16,
          borderLeft: '1px solid #e3e6ec', paddingLeft: 16,
        }}>
          {/* Avatar with initials */}
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg,#35527f,#1B2A4A)',
            display: 'grid', placeItems: 'center', flexShrink: 0,
            color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '.02em',
          }}>
            {initials}
          </div>
          {/* Name */}
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>{firstName}</div>
            <div style={{ fontSize: 11, color: '#8a93a2' }}>Apoderado</div>
          </div>
          {/* Logout */}
          <button
            onClick={logout}
            title="Cerrar sesión"
            style={{
              background: 'none', border: '1px solid #e3e6ec',
              borderRadius: 9, padding: '7px 11px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12.5, color: '#5b6472', fontFamily: 'inherit',
              transition: 'border-color .13s, color .13s',
              marginLeft: 4,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
