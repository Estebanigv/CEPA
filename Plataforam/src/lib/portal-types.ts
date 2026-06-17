/* CEPA · Tipos del portal apoderado */

export interface PortalUser {
  name: string;
  rut: string;
  email: string;
  cursos: string[];
  students: string[];
}

export interface CartItem {
  conceptId: string;
  name: string;
  amount: number;
  qty: number;
  scope: string;
}

export interface PendingItem {
  id: string;
  name: string;
  amount: number;
  due: string;
  status: 'pending' | 'overdue';
  conceptId: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  concepts: string;
  amount: number;
  method: string;
  status: 'paid' | 'processing';
}
