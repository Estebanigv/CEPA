'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setSession } from '@/lib/portal-session';

export default function LoginPage() {
  const router = useRouter();
  const [rut, setRut] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  function handleRut(v: string) {
    // Acepta RUT o correo (mientras se cargan los RUT). No forzamos formato.
    setRut(v);
    setErr('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rut || !pwd) { setErr('Ingresa tu RUT (o correo) y contraseña.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, pwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        try { setSession(data.user); } catch {}
        router.push('/portal/mis-datos');
        router.refresh();
      } else {
        setErr(data.error || 'No pudimos iniciar sesión.');
        setLoading(false);
      }
    } catch {
      setErr('No se pudo conectar. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-page { animation: fadeUp .5s cubic-bezier(.2,.7,.2,1) both; }
        .login-input {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid #e3e6ec; border-radius: 12px;
          font-size: 15px; font-family: inherit; color: #1c1f26;
          background: #fff; outline: none; box-sizing: border-box;
          transition: border-color .15s, box-shadow .15s;
        }
        .login-input:focus { border-color: #35527f; box-shadow: 0 0 0 3px rgba(27,42,74,.08); }
        .login-input::placeholder { color: #b0b8c8; }
        .login-btn {
          width: 100%; padding: 15px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #1E7A52, #166041);
          color: #fff; font-size: 15.5px; font-weight: 700;
          font-family: inherit; cursor: pointer; letter-spacing: .01em;
          transition: opacity .15s, transform .15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(30,122,82,.3);
        }
        .login-btn:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); }
        .login-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(165deg, #1B2A4A 0%, #22355c 45%, #1B2A4A 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', position: 'relative', overflow: 'hidden',
      }}>

        {/* Subtle dot pattern background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .3,
          backgroundImage: 'radial-gradient(circle, rgba(201,162,39,.2) 1.3px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
        }} />

        {/* Glow accents */}
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:400, height:400, borderRadius:'50%', background:'rgba(53,82,127,.35)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5%', left:'-5%', width:300, height:300, borderRadius:'50%', background:'rgba(201,162,39,.08)', filter:'blur(60px)', pointerEvents:'none' }} />

        <div className="login-page" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {/* Logo header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'rgba(255,255,255,.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.2)',
              display: 'grid', placeItems: 'center',
              margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,0,0,.2)',
            }}>
              <Image src="/logo.png" alt="CEPA" width={50} height={50} style={{ objectFit: 'contain' }} />
            </div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-.02em' }}>
              CEPA
            </h1>
            <p style={{ color: 'rgba(201,212,232,.8)', fontSize: 13.5, margin: 0 }}>
              Portal Apoderados · Colegio Compañía de María
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '36px 36px 32px',
            boxShadow: '0 24px 60px rgba(0,0,0,.25)',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', margin: '0 0 6px', letterSpacing: '-.02em' }}>
              Iniciar sesión
            </h2>
            <p style={{ fontSize: 13.5, color: '#5b6472', margin: '0 0 28px' }}>
              Accede con tu RUT o correo para ver tus datos y pagos.
            </p>

            <form onSubmit={submit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 7 }}>
                  RUT o correo
                </label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="12.345.678-9  ·  correo@ejemplo.cl"
                  value={rut}
                  onChange={e => handleRut(e.target.value)}
                  maxLength={60}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 7 }}>
                  Contraseña
                </label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="••••••••"
                  value={pwd}
                  onChange={e => { setPwd(e.target.value); setErr(''); }}
                  autoComplete="current-password"
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: 24 }}>
                <button type="button" style={{
                  background: 'none', border: 0, fontSize: 12.5,
                  color: '#35527f', cursor: 'pointer', padding: 0,
                  fontFamily: 'inherit', fontWeight: 500,
                }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {err && (
                <div style={{
                  background: '#fff0f0', border: '1px solid #fbd0cd',
                  borderRadius: 10, padding: '10px 14px',
                  fontSize: 13, color: '#b3261e', marginBottom: 16,
                  display: 'flex', gap: 8, alignItems: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {err}
                </div>
              )}

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin .8s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
                    <path d="M12 3a9 9 0 019 9"/>
                  </svg>
                ) : 'Ingresar'}
              </button>
            </form>

            {/* Security badge */}
            <div style={{
              marginTop: 20, padding: '11px 14px', borderRadius: 10,
              background: '#f4f6fb', border: '1px solid #e8edf5',
              display: 'flex', gap: 8, alignItems: 'center',
              fontSize: 12, color: '#5b6472',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E7A52" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>
              </svg>
              Pago seguro con <strong style={{ color: '#1B2A4A' }}>WebPay · Transbank</strong> — datos encriptados
            </div>
          </div>

          {/* Back to web */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/index.html" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'rgba(201,212,232,.7)', fontSize: 13,
              textDecoration: 'none', transition: 'color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,212,232,.7)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Volver al sitio web CEPA
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
