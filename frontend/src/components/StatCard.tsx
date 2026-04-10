import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  /** Explains the metric and how it is computed (shown on hover/focus). */
  metricHint?: string;
  className?: string;
}

export function StatCard({ title, value, icon, description, metricHint, className }: StatCardProps) {
  const card = (
    <Card className={cn('stat-card', metricHint && 'cursor-help', className)}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground font-body">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1 font-display">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {icon && <div className="text-primary opacity-70">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );

  if (!metricHint) {
    return card;
  }

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          tabIndex={0}
        >
          {card}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-left text-xs leading-snug">
        {metricHint}
      </TooltipContent>
    </Tooltip>
  );
}
