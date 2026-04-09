import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

type Props = {
  title: string;
  description?: string;
  /** Matches the admin sidebar icon for this route. */
  icon: LucideIcon;
};

export function AdminMlPlaceholder({ title, description, icon: Icon }: Props) {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
        <Icon className="h-8 w-8 text-primary shrink-0" />
        {title}
      </h1>
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="font-display text-lg">Machine Learning Integration</CardTitle>
          </div>
          <CardDescription>
            {description ?? 'This area will be populated with model-driven insights and visualizations in a later phase.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Operational data entry and CRUD for donors, caseload, and visitations lives in the other admin sections.
            Charts and predictions tied to IS455 will appear here when wired up.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
