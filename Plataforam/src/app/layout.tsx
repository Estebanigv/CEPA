import type { Metadata } from 'next';
import './globals.css';
import { INSTITUTION } from '@/lib/institution';

export const metadata: Metadata = {
  title: 'CEPA · Panel de Administración',
  description: `${INSTITUTION.fullName} — ${INSTITUTION.colegio}. ${INSTITUTION.lema}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  );
}
