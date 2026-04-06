import { CaseStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusColors: Record<CaseStatus, string> = {
  active: 'bg-status-active text-white',
  closed: 'bg-status-closed text-white',
  transferred: 'bg-status-transferred text-white',
};

export function StatusPill({ status }: { status: CaseStatus }) {
  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize', statusColors[status])}>
      {status}
    </span>
  );
}
