/* CEPA Admin · set de iconos SVG (idéntico al prototipo) */
import type { CSSProperties, ReactNode, SVGProps } from 'react';
import type { IconName } from '@/lib/types';

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, stroke = 1.9, style }: IconProps) {
  const p: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style,
  };
  const g: Record<IconName, ReactNode> = {
    grid: <g><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></g>,
    wallet: <g><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" /><path d="M21 12v3h-4a1.5 1.5 0 0 1 0-3h4Z" /></g>,
    users: <g><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.4M21 20a6 6 0 0 0-4-5.6" /></g>,
    tag: <g><path d="M3 7v5.2a2 2 0 0 0 .6 1.4l7 7a2 2 0 0 0 2.8 0l5.4-5.4a2 2 0 0 0 0-2.8l-7-7A2 2 0 0 0 10.4 3H5a2 2 0 0 0-2 2Z" /><circle cx="7.5" cy="7.5" r="1.3" /></g>,
    bell: <g><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></g>,
    chart: <g><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="7" rx="1" /><rect x="12" y="7" width="3" height="11" rx="1" /><rect x="17" y="13" width="3" height="5" rx="1" /></g>,
    shieldUser: <g><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><circle cx="12" cy="9.5" r="2" /><path d="M8.5 15a3.6 3.6 0 0 1 7 0" /></g>,
    check: <polyline points="20 6 9 17 4 12" />,
    checkSm: <polyline points="20 6 9 17 4 12" />,
    x: <g><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></g>,
    clock: <g><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></g>,
    alert: <g><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12" y2="17" /></g>,
    refresh: <g><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></g>,
    search: <g><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></g>,
    download: <g><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></g>,
    plus: <g><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></g>,
    edit: <g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></g>,
    trash: <g><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></g>,
    chevR: <polyline points="9 18 15 12 9 6" />,
    chevL: <polyline points="15 18 9 12 15 6" />,
    chevD: <polyline points="6 9 12 15 18 9" />,
    mail: <g><rect x="2" y="4" width="20" height="16" rx="2.5" /><path d="m3 6 9 7 9-7" /></g>,
    card: <g><rect x="2" y="5" width="20" height="14" rx="2.5" /><line x1="2" y1="10" x2="22" y2="10" /></g>,
    cash: <g><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v6M18 9v6" /></g>,
    transfer: <g><path d="M4 9h13l-3-3M20 15H7l3 3" /></g>,
    receipt: <path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2ZM9 8h6M9 12h6" />,
    user: <g><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></g>,
    building: <g><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h6" /></g>,
    ball: <g><circle cx="12" cy="12" r="9" /><path d="M12 7l4.7 3.4-1.8 5.5H9.1L7.3 10.4 12 7Z" /></g>,
    run: <g><circle cx="13" cy="4" r="2" /><path d="M7 21l3-6 4 2 2 4M10 15l-1-5 4-2 3 3 3 1" /></g>,
    music: <g><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></g>,
    heart: <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z" />,
    filter: <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />,
    calendar: <g><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></g>,
    logout: <g><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></g>,
    send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
    file: <g><path d="M14 3v5h5" /><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5Z" /></g>,
    dots: <g><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></g>,
    eye: <g><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></g>,
  };
  return <svg {...p}>{g[name] || null}</svg>;
}
