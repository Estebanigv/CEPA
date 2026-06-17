/* CEPA · Tipos compartidos del panel admin */

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'processing';
export type FamilyStatus = 'paid' | 'pending' | 'overdue';

export type IconName =
  | 'grid' | 'wallet' | 'users' | 'tag' | 'bell' | 'chart' | 'shieldUser'
  | 'check' | 'checkSm' | 'x' | 'clock' | 'alert' | 'refresh' | 'search'
  | 'download' | 'plus' | 'edit' | 'trash' | 'chevR' | 'chevL' | 'chevD'
  | 'mail' | 'card' | 'cash' | 'transfer' | 'receipt' | 'user' | 'building'
  | 'ball' | 'run' | 'music' | 'heart' | 'filter' | 'calendar' | 'logout'
  | 'send' | 'file' | 'dots' | 'eye';

export interface Concept {
  id: string;
  name: string;
  cat: string;
  icon: IconName;
  amount: number;
  scope: string;
  vig: string;
  cuotas: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  name: string;
  rut: string;
  curso: string;
  concepts: string;
  amount: number;
  method: string;
  status: PaymentStatus;
}

export interface Family {
  id: string;
  name: string;
  apoderado: string;
  rut: string;
  email: string;
  cursos: string;
  students: string[];
  status: FamilyStatus;
  aportado: number;
  pend: number;
}

export interface Kpis {
  recaudado: number;
  recaudadoDelta: number;
  pagos: number;
  pagosDelta: number;
  alDia: number;
  pendiente: number;
  vencido: number;
  ticket: number;
}

export interface MonthPoint {
  m: string;
  v: number;
}

export interface ConceptShare {
  name: string;
  v: number;
  color: string;
}

/** Todo lo que el shell del admin necesita en una sola carga. */
export interface AdminData {
  kpis: Kpis;
  monthly: MonthPoint[];
  byConcept: ConceptShare[];
  transactions: Transaction[];
  methods: string[];
  families: Family[];
  concepts: Concept[];
}
