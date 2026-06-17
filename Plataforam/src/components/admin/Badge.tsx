/* CEPA Admin · badge de estado (ícono + texto + color) */
import { Icon } from './Icon';
import type { IconName, PaymentStatus } from '@/lib/types';

const STAT: Record<PaymentStatus, { label: string; cls: string; icon: IconName }> = {
  paid: { label: 'Pagado', cls: 'badge--paid', icon: 'check' },
  pending: { label: 'Pendiente', cls: 'badge--pending', icon: 'clock' },
  overdue: { label: 'Vencido', cls: 'badge--overdue', icon: 'alert' },
  processing: { label: 'Procesando', cls: 'badge--processing', icon: 'refresh' },
};

export function Badge({ status, label }: { status: PaymentStatus; label?: string }) {
  const s = STAT[status] || STAT.pending;
  return (
    <span className={'badge ' + s.cls}>
      <Icon name={s.icon} size={13} stroke={2.3} />
      {label || s.label}
    </span>
  );
}
