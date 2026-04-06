import { RiskLevel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const riskColors: Record<RiskLevel, string> = {
  low: 'bg-risk-low text-white',
  medium: 'bg-risk-medium text-foreground',
  high: 'bg-risk-high text-white',
  critical: 'bg-risk-critical text-white',
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge className={cn('capitalize font-medium', riskColors[level])}>
      {level}
    </Badge>
  );
}
