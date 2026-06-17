'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-session';
import { AdminApp } from '@/components/admin/AdminApp';
import { getAdminData } from '@/lib/data';
import type { AdminData } from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    if (!getAdminSession()) {
      router.replace('/admin/login');
      return;
    }
    getAdminData().then(setData);
  }, [router]);

  if (!data) return (
    <div style={{
      minHeight:'100vh', display:'grid', placeItems:'center',
      background:'#f4f6fb', fontFamily:'inherit',
    }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, color:'#8a93a2' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c5d0e4" strokeWidth="2" style={{ animation:'spin .8s linear infinite' }}>
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/>
          <path d="M12 3a9 9 0 019 9"/>
        </svg>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <span style={{ fontSize:13 }}>Cargando panel…</span>
      </div>
    </div>
  );

  return <AdminApp data={data} />;
}
