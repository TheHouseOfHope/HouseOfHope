import { AdminMlPlaceholder } from '@/components/AdminMlPlaceholder';
import { BarChart3 } from 'lucide-react';

export default function ReportsAnalytics() {
  return (
    <AdminMlPlaceholder
      icon={BarChart3}
      title="Reports & Analytics"
      description="Donation trends, resident outcomes, safehouse comparisons, and reintegration metrics will be delivered here via the ML / analytics integration."
    />
  );
}
