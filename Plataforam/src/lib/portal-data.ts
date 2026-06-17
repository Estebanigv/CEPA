/* CEPA · Datos de ejemplo para el portal del apoderado */
import type { PortalUser, PendingItem, HistoryItem } from './portal-types';
import { CONCEPTS } from './data';

export { CONCEPTS };

export const MOCK_USER: PortalUser = {
  name: 'Patricia Lagos Morales',
  rut: '15.482.391-7',
  email: 'patricia.lagos@gmail.com',
  cursos: ['III Medio B', 'I Básico A'],
  students: ['Sofía Lagos González', 'Martín Lagos González'],
};

export const PENDING: PendingItem[] = [
  {
    id: 'pend-1',
    name: 'Cuota Centro de Padres — 2da cuota',
    amount: 16667,
    due: '2026-06-30',
    status: 'pending',
    conceptId: 'cepa',
  },
  {
    id: 'pend-2',
    name: 'Fútbol Masculino — 2do Semestre',
    amount: 45000,
    due: '2026-07-15',
    status: 'pending',
    conceptId: 'futm2',
  },
  {
    id: 'pend-3',
    name: 'Cuota Beca de Fallecimiento',
    amount: 12000,
    due: '2026-05-31',
    status: 'overdue',
    conceptId: 'beca',
  },
];

export const HISTORY: HistoryItem[] = [
  {
    id: 'TBK-009912',
    date: '2026-06-08 14:32',
    concepts: 'Cuota Centro de Padres — 1ra cuota',
    amount: 16667,
    method: 'Web Pay · Crédito',
    status: 'paid',
  },
  {
    id: 'TBK-009744',
    date: '2026-05-12 10:18',
    concepts: 'Cuota Zumba · Corrida Familiar CEPA',
    amount: 35000,
    method: 'Web Pay · Débito',
    status: 'paid',
  },
  {
    id: 'TBK-009401',
    date: '2026-04-03 16:45',
    concepts: 'Fútbol Masculino — 1er Semestre',
    amount: 45000,
    method: 'Web Pay · Crédito',
    status: 'paid',
  },
  {
    id: 'TBK-008990',
    date: '2026-03-15 09:22',
    concepts: 'Cuota Centro de Padres — 1ra cuota',
    amount: 16667,
    method: 'Transferencia',
    status: 'paid',
  },
];

export function fmtMoney(n: number) {
  return '$' + n.toLocaleString('es-CL');
}

export function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtRut(raw: string) {
  const clean = raw.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}
