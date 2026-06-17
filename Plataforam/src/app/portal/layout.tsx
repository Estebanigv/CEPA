import type { Metadata } from 'next';
import PlatformChatbot from '@/components/portal/PlatformChatbot';

export const metadata: Metadata = {
  title: 'CEPA · Portal Apoderados',
  description: 'Portal de pagos del Centro de Padres y Apoderados — Colegio Compañía de María Apoquindo',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PlatformChatbot />
    </>
  );
}
