'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, getAdminSession } from '@/lib/admin-session';

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminSession()) router.replace('/admin');
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !pass) { setErr('Ingresa usuario y contraseña.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (adminLogin(user, pass)) {
      router.push('/admin');
    } else {
      setErr('Credenciales incorrectas.');
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;} }
        .al-wrap { animation:fadeIn .4s cubic-bezier(.2,.7,.2,1) both; }
        .al-input {
          width:100%; padding:11px 14px; border:1.5px solid #2d3a50; border-radius:9px;
          font-size:14px; font-family:inherit; color:#e8edf5; background:#1a2438;
          outline:none; box-sizing:border-box; transition:border-color .15s,box-shadow .15s;
        }
        .al-input::placeholder { color:#4a5568; }
        .al-input:focus { border-color:#4a7ab5; box-shadow:0 0 0 3px rgba(74,122,181,.15); }
        .al-btn {
          width:100%; padding:13px; border:none; border-radius:9px;
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          color:#fff; font-size:14.5px; font-weight:700; font-family:inherit;
          cursor:pointer; transition:opacity .15s,transform .1s;
          display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 4px 14px rgba(37,99,235,.35);
        }
        .al-btn:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
        .al-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}
        .al-label {
          display:block; font-size:11px; font-weight:600; color:#6b7a99;
          margin-bottom:6px; text-transform:uppercase; letter-spacing:.07em;
        }
      `}</style>

      <div style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:24,
        background:'#0d1624',
        backgroundImage:'radial-gradient(ellipse at 30% 20%, rgba(37,99,235,.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(27,42,74,.4) 0%, transparent 60%)',
      }}>
        <div className="al-wrap" style={{ width:'100%', maxWidth:380 }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{
              width:56, height:56, borderRadius:14,
              background:'linear-gradient(135deg,#1B2A4A,#243a63)',
              border:'1px solid rgba(74,122,181,.3)',
              display:'grid', placeItems:'center', margin:'0 auto 14px',
              boxShadow:'0 8px 24px rgba(0,0,0,.4)',
            }}>
              <Image src="/logo.png" alt="CEPA" width={38} height={38} style={{ objectFit:'contain', opacity:.9 }} />
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(37,99,235,.12)', border:'1px solid rgba(37,99,235,.25)',
              borderRadius:999, padding:'3px 12px', marginBottom:10,
            }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#3b82f6' }} />
              <span style={{ color:'#93b4e8', fontSize:11, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase' }}>
                Sistema Administrativo
              </span>
            </div>
            <h1 style={{ color:'#e8edf5', fontSize:20, fontWeight:700, margin:'0 0 4px', letterSpacing:'-.02em' }}>
              CEPA · Panel de Administración
            </h1>
            <p style={{ color:'#4a5568', fontSize:12.5, margin:0 }}>
              Acceso restringido al personal autorizado
            </p>
          </div>

          {/* Card */}
          <div style={{
            background:'#131f30', borderRadius:16, padding:'28px 28px 24px',
            boxShadow:'0 20px 60px rgba(0,0,0,.5)', border:'1px solid #1e2d42',
          }}>
            <form onSubmit={submit}>
              <div style={{ marginBottom:14 }}>
                <label className="al-label">Usuario</label>
                <input
                  className="al-input"
                  type="text"
                  placeholder="cepa"
                  value={user}
                  autoComplete="username"
                  autoFocus
                  onChange={e => { setUser(e.target.value); setErr(''); }}
                />
              </div>
              <div style={{ marginBottom:20 }}>
                <label className="al-label">Contraseña</label>
                <input
                  className="al-input"
                  type="password"
                  placeholder="••••••"
                  value={pass}
                  autoComplete="current-password"
                  onChange={e => { setPass(e.target.value); setErr(''); }}
                />
              </div>

              {err && (
                <div style={{
                  background:'rgba(179,38,30,.12)', border:'1px solid rgba(179,38,30,.3)', borderRadius:8,
                  padding:'9px 13px', fontSize:13, color:'#f08080',
                  marginBottom:16, display:'flex', gap:7, alignItems:'center',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {err}
                </div>
              )}

              <button className="al-btn" type="submit" disabled={loading}>
                {loading
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin .8s linear infinite' }}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/><path d="M12 3a9 9 0 019 9"/></svg>
                  : <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      Ingresar al panel
                    </>
                }
              </button>
            </form>
          </div>

          <div style={{ textAlign:'center', marginTop:18 }}>
            <a href="/index.html" style={{
              display:'inline-flex', alignItems:'center', gap:6,
              color:'#3a4a63', fontSize:12, textDecoration:'none', transition:'color .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6b7a99')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3a4a63')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Volver al sitio web
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
