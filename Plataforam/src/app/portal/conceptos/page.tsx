'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/portal-session';
import { CONCEPTS, PENDING, fmtMoney } from '@/lib/portal-data';
import { PortalHeader } from '@/components/portal/PortalHeader';
import type { PortalUser, CartItem } from '@/lib/portal-types';
import type { Concept } from '@/lib/types';

const CATS = ['Todos', 'Cuotas institucionales', 'Deportes', 'Eventos'];

const CAT_COLOR: Record<string, { bg: string; color: string; bar: string; border: string }> = {
  'Cuotas institucionales': { bg: '#e8edf5', color: '#1B2A4A', bar: '#35527f', border: '#c5d0e4' },
  'Deportes':               { bg: '#e3f1ea', color: '#1E7A52', bar: '#1E7A52', border: '#b8dfc9' },
  'Eventos':                { bg: '#fdf3dc', color: '#8a6010', bar: '#C9A227', border: '#e8d08a' },
};

const PAID_IDS = ['futm1', 'zumba'];

/* Simulación cuota anual CEPA 2026 — 3 cuotas */
const CUOTAS_CEPA = [
  { n: 1, label: '1ª cuota', mes: 'Mar', amount: 16667, status: 'paid'    as const, date: '2026-03-15', txId: 'TBK-008990' },
  { n: 2, label: '2ª cuota', mes: 'Jun', amount: 16667, status: 'pending' as const, date: '2026-06-30', txId: null },
  { n: 3, label: '3ª cuota', mes: 'Sep', amount: 16666, status: 'upcoming' as const, date: '2026-09-30', txId: null },
];

const SCHOOL_MONTHS = ['Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const PAID_MONTHS   = ['Mar'];        // cuota 1 pagada en marzo
const DUE_MONTHS    = ['Jun'];        // cuota 2 vence en junio
const NEXT_MONTHS   = ['Sep'];        // cuota 3 en septiembre

export default function ConceptosPage() {
  const router = useRouter();
  const [user, setUser]       = useState<PortalUser | null>(null);
  const [cat, setCat]         = useState('Todos');
  const [cart, setCart]       = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/portal/login'); return; }
    setUser(s);
    try {
      const saved = sessionStorage.getItem('cepa_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, [router]);

  function saveCart(items: CartItem[]) {
    setCart(items);
    sessionStorage.setItem('cepa_cart', JSON.stringify(items));
  }
  function addToCart(c: Concept) {
    const ex = cart.find(i => i.conceptId === c.id);
    if (ex) saveCart(cart.map(i => i.conceptId === c.id ? { ...i, qty: i.qty + 1 } : i));
    else     saveCart([...cart, { conceptId: c.id, name: c.name, amount: c.amount, qty: 1, scope: c.scope }]);
  }
  function removeFromCart(id: string) { saveCart(cart.filter(i => i.conceptId !== id)); }
  function changeQty(id: string, d: number) {
    saveCart(cart.map(i => i.conceptId === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  }

  const filtered   = CONCEPTS.filter(c => c.active && (cat === 'Todos' || c.cat === cat));
  const total      = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const cartCount  = cart.reduce((s, i) => s + i.qty, 0);
  const paidCuotas = CUOTAS_CEPA.filter(c => c.status === 'paid').length;
  const paidAmount = CUOTAS_CEPA.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const totalCepa  = CUOTAS_CEPA.reduce((s, c) => s + c.amount, 0);
  const nextDue    = CUOTAS_CEPA.find(c => c.status === 'pending');

  if (!user) return null;
  const firstName = user.name.split(' ')[0];

  function goCheckout() { setCartOpen(false); router.push('/portal/revision'); }

  return (
    <>
      <style>{`
        @keyframes slideIn  { from{transform:translateX(100%);opacity:0;}to{transform:none;opacity:1;} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;} }
        .pg-wrap { animation:fadeUp .4s cubic-bezier(.2,.7,.2,1) both; }

        /* Cards */
        .cc { background:#fff; border-radius:16px;
              overflow:hidden; transition:border-color .18s,box-shadow .18s,transform .18s;
              display:flex; flex-direction:column; }
        .cc:hover { box-shadow:0 8px 28px rgba(27,42,74,.1); transform:translateY(-2px); }
        .cc.paid  { opacity:.62; }

        /* Buttons */
        .filter-btn { padding:7px 16px; border-radius:999px; font-size:13px; font-weight:600;
          cursor:pointer; font-family:inherit; border:1.5px solid #e3e6ec;
          background:#fff; color:#5b6472; transition:all .14s; white-space:nowrap; }
        .filter-btn.on { background:#1B2A4A; color:#fff; border-color:#1B2A4A; }
        .filter-btn:not(.on):hover { border-color:#c5d0e4; color:#1B2A4A; }

        .add-btn { display:inline-flex; align-items:center; gap:6px;
          padding:9px 16px; border-radius:10px; border:none;
          background:#1B2A4A; color:#fff; font-size:13px; font-weight:700;
          cursor:pointer; font-family:inherit; transition:background .13s,transform .1s; white-space:nowrap; }
        .add-btn:hover { background:#243a63; transform:translateY(-1px); }

        .qty-btn { width:30px; height:30px; border-radius:8px; border:1.5px solid #e3e6ec;
          background:#f7f8fb; cursor:pointer; font-size:16px;
          display:grid; place-items:center; transition:background .12s; font-family:inherit; }
        .qty-btn:hover { background:#e8edf5; }

        .pay-btn { width:100%; padding:15px; border:none; border-radius:12px;
          background:linear-gradient(135deg,#1E7A52,#166041); color:#fff;
          font-size:15px; font-weight:700; cursor:pointer; font-family:inherit;
          display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 4px 16px rgba(30,122,82,.3); transition:opacity .14s,transform .1s; }
        .pay-btn:hover { opacity:.93; transform:translateY(-1px); }

        /* Month pills */
        .m-pill {
          width:44px; height:44px; border-radius:12px; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:1px; font-size:10px; font-weight:700;
          letter-spacing:.02em; text-transform:uppercase; transition:all .15s; cursor:default;
          border:1.5px solid transparent;
        }
        .m-pill.paid    { background:#e3f1ea; color:#1E7A52; border-color:#b8dfc9; }
        .m-pill.due     { background:#fff3cd; color:#8a6010; border-color:#f0d98c; }
        .m-pill.next    { background:#e8edf5; color:#35527f; border-color:#c5d0e4; }
        .m-pill.future  { background:#f4f6fb; color:#b0b8c8; border-color:transparent; }

        /* Cuota row */
        .cuota-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #f0f2f6; }
        .cuota-row:last-child { border-bottom:none; }

        /* Cart */
        .cart-item { padding:14px 0; border-bottom:1px solid #f0f2f6; }
        .cart-item:last-child { border-bottom:none; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f2f4f8' }}>
        <PortalHeader user={user} active="conceptos" cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        <main className="pg-wrap" style={{ maxWidth:1160, margin:'0 auto', padding:'28px 24px 64px' }}>

          {/* ── Identity banner ── */}
          <div style={{
            background:'linear-gradient(135deg,#1B2A4A 0%,#243a63 55%,#35527f 100%)',
            borderRadius:22, padding:'26px 32px', marginBottom:22,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:16, position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', inset:0, opacity:.15, pointerEvents:'none',
              backgroundImage:'radial-gradient(circle,rgba(201,162,39,.35) 1.2px,transparent 1.4px)',
              backgroundSize:'22px 22px' }} />
            <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%',
              background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />

            <div style={{ position:'relative', zIndex:1 }}>
              {/* Badge */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:7,
                background:'rgba(201,162,39,.18)', border:'1px solid rgba(201,162,39,.35)',
                borderRadius:999, padding:'4px 12px', marginBottom:10,
              }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#f0d98c', flexShrink:0 }} />
                <span style={{ color:'#f0d98c', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>
                  Portal Apoderados · Colegio Compañía de María Apoquindo
                </span>
              </div>
              <h1 style={{ color:'#fff', fontSize:21, fontWeight:700, margin:'0 0 5px', letterSpacing:'-.02em' }}>
                Bienvenida, {firstName}
              </h1>
              <p style={{ color:'rgba(201,212,232,.75)', fontSize:13.5, margin:0 }}>
                Año escolar 2026 · {user.students.join(' · ')}
              </p>
            </div>

            <div style={{ display:'flex', gap:10, position:'relative', zIndex:1, flexWrap:'wrap' }}>
              <div style={{
                background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.18)',
                borderRadius:14, padding:'12px 18px', backdropFilter:'blur(4px)',
                minWidth:130,
              }}>
                <div style={{ color:'rgba(201,212,232,.7)', fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>
                  Pagado 2026
                </div>
                <div style={{ color:'#fff', fontSize:20, fontWeight:800, letterSpacing:'-.02em' }}>
                  {fmtMoney(paidAmount)}
                </div>
              </div>
              <div style={{
                background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.18)',
                borderRadius:14, padding:'12px 18px', backdropFilter:'blur(4px)',
                minWidth:130,
              }}>
                <div style={{ color:'rgba(201,212,232,.7)', fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>
                  Pendiente
                </div>
                <div style={{ color:'#f0d98c', fontSize:20, fontWeight:800, letterSpacing:'-.02em' }}>
                  {fmtMoney(PENDING.reduce((s,p)=>s+p.amount,0))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Cuota tracker + Pending summary ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>

            {/* Tracker card */}
            <div style={{
              background:'#fff', borderRadius:18, border:'1.5px solid #e8edf5',
              padding:'22px 24px', boxShadow:'0 2px 12px rgba(27,42,74,.05)',
            }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'#8a93a2', marginBottom:3 }}>
                    Cuota CEPA
                  </div>
                  <div style={{ fontSize:17, fontWeight:800, color:'#1B2A4A', letterSpacing:'-.01em' }}>
                    {fmtMoney(totalCepa)} · Año escolar 2026
                  </div>
                </div>
                <div style={{
                  background:'#e3f1ea', borderRadius:10, padding:'6px 12px',
                  fontSize:12, fontWeight:700, color:'#1E7A52',
                }}>
                  {paidCuotas}/{CUOTAS_CEPA.length} pagadas
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11.5, color:'#8a93a2' }}>{fmtMoney(paidAmount)} pagado</span>
                  <span style={{ fontSize:11.5, color:'#8a93a2' }}>{fmtMoney(totalCepa - paidAmount)} restante</span>
                </div>
                <div style={{ height:10, background:'#f0f2f6', borderRadius:99, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:99,
                    width:`${(paidAmount / totalCepa) * 100}%`,
                    background:'linear-gradient(90deg,#1E7A52,#26a869)',
                    transition:'width .8s cubic-bezier(.2,.7,.2,1)',
                  }} />
                </div>
              </div>

              {/* Month pills Mar → Dic */}
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:18 }}>
                {SCHOOL_MONTHS.map(m => {
                  const cls = PAID_MONTHS.includes(m) ? 'paid'
                    : DUE_MONTHS.includes(m) ? 'due'
                    : NEXT_MONTHS.includes(m) ? 'next'
                    : 'future';
                  const icon = cls === 'paid' ? '✓' : cls === 'due' ? '!' : cls === 'next' ? '○' : '·';
                  return (
                    <div key={m} className={`m-pill ${cls}`} title={
                      cls === 'paid' ? 'Pagado' : cls === 'due' ? 'Vence próximo' : cls === 'next' ? 'Próxima cuota' : ''
                    }>
                      <span style={{ fontSize:9 }}>{icon}</span>
                      <span>{m}</span>
                    </div>
                  );
                })}
              </div>

              {/* Cuota rows */}
              <div>
                {CUOTAS_CEPA.map(c => (
                  <div key={c.n} className="cuota-row">
                    <div style={{
                      width:34, height:34, borderRadius:10, flexShrink:0,
                      display:'grid', placeItems:'center',
                      background: c.status === 'paid' ? '#e3f1ea' : c.status === 'pending' ? '#fff3cd' : '#f0f2f6',
                    }}>
                      {c.status === 'paid'
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1E7A52" strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : c.status === 'pending'
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0b8c8" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
                      }
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:600, color:'#1B2A4A' }}>{c.label}</div>
                      <div style={{ fontSize:11.5, color:'#8a93a2' }}>
                        {c.status === 'paid'
                          ? `Pagado el ${new Date(c.date).toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'})}`
                          : `Vence ${new Date(c.date).toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'})}`
                        }
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:14, fontWeight:800, color: c.status === 'paid' ? '#1E7A52' : '#1B2A4A' }}>
                        {fmtMoney(c.amount)}
                      </div>
                      <div style={{
                        fontSize:10.5, fontWeight:700, letterSpacing:'.04em',
                        color: c.status === 'paid' ? '#1E7A52' : c.status === 'pending' ? '#C9A227' : '#b0b8c8',
                        textTransform:'uppercase',
                      }}>
                        {c.status === 'paid' ? 'Pagado' : c.status === 'pending' ? 'Pendiente' : 'Próxima'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {nextDue && (
                <button
                  onClick={() => addToCart({ id:'cepa', name:'Cuota Centro de Padres — 2ª cuota', amount:nextDue.amount, cat:'Cuotas institucionales', scope:'Por familia', vig:'Anual 2026', icon:'building', active:true } as Concept)}
                  style={{
                    marginTop:16, width:'100%', padding:'12px', border:'none', borderRadius:12,
                    background:'linear-gradient(135deg,#1B2A4A,#35527f)',
                    color:'#fff', fontSize:13.5, fontWeight:700, cursor:'pointer',
                    fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    boxShadow:'0 4px 14px rgba(27,42,74,.22)', transition:'opacity .14s,transform .1s',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                  Pagar {nextDue.label} · {fmtMoney(nextDue.amount)}
                </button>
              )}
            </div>

            {/* Pending summary */}
            <div style={{
              background:'#fff', borderRadius:18, border:'1.5px solid #e8edf5',
              padding:'22px 24px', boxShadow:'0 2px 12px rgba(27,42,74,.05)',
              display:'flex', flexDirection:'column',
            }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'#8a93a2', marginBottom:4 }}>
                Pagos pendientes
              </div>
              <div style={{ fontSize:17, fontWeight:800, color:'#1B2A4A', letterSpacing:'-.01em', marginBottom:16 }}>
                {PENDING.length} concepto{PENDING.length !== 1 ? 's' : ''} por pagar
              </div>

              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {PENDING.map(p => (
                  <div key={p.id} style={{
                    display:'flex', alignItems:'center', gap:12,
                    padding:'12px 14px', borderRadius:12,
                    background: p.status === 'overdue' ? '#fff5f5' : '#fafbfc',
                    border: `1.5px solid ${p.status === 'overdue' ? '#fbd0cd' : '#f0f2f6'}`,
                  }}>
                    <div style={{
                      width:8, height:8, borderRadius:'50%', flexShrink:0,
                      background: p.status === 'overdue' ? '#b3261e' : '#C9A227',
                    }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#1B2A4A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize:11, color: p.status === 'overdue' ? '#b3261e' : '#8a93a2', marginTop:2 }}>
                        {p.status === 'overdue' ? 'Vencido · ' : 'Vence '}
                        {new Date(p.due).toLocaleDateString('es-CL',{day:'2-digit',month:'short'})}
                      </div>
                    </div>
                    <div style={{ fontSize:14, fontWeight:800, color: p.status === 'overdue' ? '#b3261e' : '#1B2A4A', flexShrink:0 }}>
                      {fmtMoney(p.amount)}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/portal/pendientes')}
                style={{
                  marginTop:16, width:'100%', padding:'12px', border:'1.5px solid #e8edf5',
                  borderRadius:12, background:'#f4f6fb', color:'#1B2A4A',
                  fontSize:13.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'background .13s',
                }}
              >
                Ver todos los pendientes
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          {/* ── Conceptos ── */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:16 }}>
            <div>
              <h2 style={{ fontSize:16, fontWeight:700, color:'#1B2A4A', margin:'0 0 2px' }}>Todos los conceptos</h2>
              <p style={{ fontSize:13, color:'#8a93a2', margin:0 }}>Agrégalos al carrito y paga en una sola transacción</p>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {CATS.map(c => {
                const n = c === 'Todos'
                  ? CONCEPTS.filter(x=>x.active).length
                  : CONCEPTS.filter(x=>x.active&&x.cat===c).length;
                return (
                  <button key={c} className={`filter-btn${cat===c?' on':''}`} onClick={()=>setCat(c)}>
                    {c}
                    <span style={{
                      marginLeft:5, fontSize:11, fontWeight:700,
                      background:cat===c?'rgba(255,255,255,.18)':'#e8edf5',
                      color:cat===c?'#fff':'#8a93a2',
                      borderRadius:99, padding:'1px 6px', display:'inline-block',
                    }}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:12 }}>
            {filtered.map(c => {
              const isPaid  = PAID_IDS.includes(c.id);
              const inCart  = cart.find(i => i.conceptId === c.id);
              const cs      = CAT_COLOR[c.cat] ?? { bg:'#f4f6fb', color:'#5b6472', bar:'#8a93a2', border:'#e3e6ec' };
              return (
                <div key={c.id} className={`cc${isPaid?' paid':''}`} style={{ border:`1.5px solid ${cs.border}` }}>
                  <div style={{ padding:'16px 18px 18px', flex:1, display:'flex', flexDirection:'column' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:12 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 9px', borderRadius:999, background:cs.bg, color:cs.color, fontSize:11, fontWeight:600, marginBottom:7 }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background:cs.bar }} />
                          {c.cat}
                        </span>
                        <div style={{ fontSize:14, fontWeight:700, color:'#1B2A4A', lineHeight:1.3 }}>{c.name}</div>
                      </div>
                      {isPaid && (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#e3f1ea', color:'#1E7A52', borderRadius:999, padding:'3px 9px', fontSize:11, fontWeight:700, flexShrink:0 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          Pagado
                        </span>
                      )}
                    </div>
                    <div style={{ height:1, background:'#f0f2f6', margin:'0 0 12px' }} />
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginTop:'auto' }}>
                      <div>
                        <div style={{ fontSize:21, fontWeight:800, color:isPaid?'#8a93a2':'#1B2A4A', letterSpacing:'-.02em', lineHeight:1 }}>
                          {fmtMoney(c.amount)}
                        </div>
                        <div style={{ fontSize:11.5, color:'#8a93a2', marginTop:3 }}>{c.scope} · {c.vig}</div>
                      </div>
                      {!isPaid && (
                        inCart ? (
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <button className="qty-btn" onClick={()=>changeQty(c.id,-1)}>−</button>
                            <span style={{ fontWeight:700, minWidth:22, textAlign:'center', fontSize:14 }}>{inCart.qty}</span>
                            <button className="qty-btn" onClick={()=>changeQty(c.id,1)}>+</button>
                            <button onClick={()=>removeFromCart(c.id)} style={{ background:'none',border:0,cursor:'pointer',color:'#b3261e',padding:'4px',display:'grid',placeItems:'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        ) : (
                          <button className="add-btn" onClick={()=>addToCart(c)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Agregar
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ── Cart drawer ── */}
      {cartOpen && (
        <>
          <div onClick={()=>setCartOpen(false)} style={{ position:'fixed',inset:0,background:'rgba(10,17,32,.4)',zIndex:200,backdropFilter:'blur(2px)' }} />
          <div style={{ position:'fixed',top:0,right:0,bottom:0,width:400,maxWidth:'100vw',background:'#fff',zIndex:201,display:'flex',flexDirection:'column',boxShadow:'-8px 0 48px rgba(10,17,32,.18)',animation:'slideIn .28s cubic-bezier(.2,.7,.2,1)' }}>
            <div style={{ padding:'18px 22px',borderBottom:'1px solid #f0f2f6',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fafbfc' }}>
              <div>
                <h3 style={{ fontSize:17,fontWeight:700,color:'#1B2A4A',margin:'0 0 2px' }}>Mi carrito</h3>
                <p style={{ fontSize:12.5,color:'#8a93a2',margin:0 }}>{cartCount>0?`${cartCount} concepto${cartCount!==1?'s':''} seleccionado${cartCount!==1?'s':''}`:''}</p>
              </div>
              <button onClick={()=>setCartOpen(false)} style={{ background:'#f0f2f6',border:'none',borderRadius:10,width:34,height:34,cursor:'pointer',display:'grid',placeItems:'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b6472" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ flex:1,overflowY:'auto',padding:'8px 22px' }}>
              {cart.length===0 ? (
                <div style={{ textAlign:'center',paddingTop:80,color:'#8a93a2' }}>
                  <div style={{ width:64,height:64,borderRadius:16,background:'#f0f2f6',display:'grid',placeItems:'center',margin:'0 auto 16px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5d0e4" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.56l1.65-9.84H6"/></svg>
                  </div>
                  <p style={{ fontSize:14.5,fontWeight:600,color:'#1B2A4A',margin:'0 0 6px' }}>Carrito vacío</p>
                  <p style={{ fontSize:13,margin:0 }}>Agrega conceptos para continuar.</p>
                </div>
              ) : cart.map(item => (
                <div key={item.conceptId} className="cart-item">
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:10 }}>
                    <div style={{ fontSize:13.5,fontWeight:600,color:'#1B2A4A',flex:1,lineHeight:1.35 }}>{item.name}</div>
                    <button onClick={()=>removeFromCart(item.conceptId)} style={{ background:'none',border:0,cursor:'pointer',color:'#c5d0e4',padding:2,display:'grid',placeItems:'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                      <button className="qty-btn" onClick={()=>changeQty(item.conceptId,-1)} style={{ width:28,height:28 }}>−</button>
                      <span style={{ fontWeight:700,fontSize:14,minWidth:20,textAlign:'center' }}>{item.qty}</span>
                      <button className="qty-btn" onClick={()=>changeQty(item.conceptId,1)} style={{ width:28,height:28 }}>+</button>
                    </div>
                    <div style={{ fontWeight:800,fontSize:16,color:'#1B2A4A' }}>{fmtMoney(item.amount*item.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div style={{ padding:'18px 22px',borderTop:'1px solid #f0f2f6',background:'#fafbfc' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5 }}>
                  <span style={{ fontSize:13.5,color:'#8a93a2',fontWeight:500 }}>Total ({cartCount} ítem{cartCount!==1?'s':''})</span>
                  <span style={{ fontWeight:800,fontSize:22,color:'#1B2A4A',letterSpacing:'-.02em' }}>{fmtMoney(total)}</span>
                </div>
                <p style={{ fontSize:11.5,color:'#8a93a2',margin:'0 0 14px' }}>Hasta 3 cuotas precio contado con tarjeta de crédito</p>
                <button className="pay-btn" onClick={goCheckout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                  Ir a pagar · {fmtMoney(total)}
                </button>
                <p style={{ fontSize:11.5,color:'#8a93a2',margin:'10px 0 0',textAlign:'center' }}>Pago seguro vía WebPay · Transbank</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

