import type { Metadata } from 'next';
import './globals.css';
import { INSTITUTION } from '@/lib/institution';

export const metadata: Metadata = {
  title: 'CEPA · Panel de Administración',
  description: `${INSTITUTION.fullName} — ${INSTITUTION.colegio}. ${INSTITUTION.lema}.`,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  );
}
