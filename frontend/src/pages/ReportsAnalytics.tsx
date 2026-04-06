import { useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { impactStats, mockDonations } from '@/lib/mock-data';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';

const COLORS = ['hsl(174, 55%, 38%)', 'hsl(200, 65%, 55%)', 'hsl(12, 70%, 65%)', 'hsl(35, 40%, 60%)', 'hsl(142, 60%, 45%)'];

const donationByType = [
  { name: 'Monetary', value: 65 },
  { name: 'In-Kind', value: 15 },
  { name: 'Time', value: 10 },
  { name: 'Skills', value: 5 },
  { name: 'Social Media', value: 5 },
];

const safehouseComparison = [
  { name: 'Bahay Pag-asa', residents: 3, reintegration: 85, education: 90 },
  { name: 'Bahay Kalinga', residents: 2, reintegration: 70, education: 88 },
  { name: 'Bahay Pangarap', residents: 0, reintegration: 92, education: 95 },
];

const reintegrationByType = [
  { name: 'Family', rate: 82 },
  { name: 'Independent', rate: 68 },
  { name: 'Institutional', rate: 55 },
  { name: 'Foster Care', rate: 75 },
];

const incidentData = [
  { type: 'Behavioral', low: 12, medium: 5, high: 2 },
  { type: 'Health', low: 8, medium: 3, high: 1 },
  { type: 'Safety', low: 2, medium: 1, high: 3 },
  { type: 'Educational', low: 15, medium: 4, high: 0 },
];

export default function ReportsAnalytics() {
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-09-30');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">Reports & Analytics</h1>

      {/* Date Range */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div>
          <Label className="text-xs">From</Label>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto" />
        </div>
        <div>
          <Label className="text-xs">To</Label>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Residents Served" value={impactStats.totalResidentsServed} icon={<Users className="h-6 w-6" />} />
        <StatCard title="Total Donations" value={`₱${(impactStats.totalDonationsReceived / 1000000).toFixed(1)}M`} icon={<DollarSign className="h-6 w-6" />} />
        <StatCard title="Reintegration Success" value={`${impactStats.reintegrationSuccessRate}%`} icon={<TrendingUp className="h-6 w-6" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Donation Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={impactStats.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={v => `₱${v / 1000}K`} />
                <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="donations" stroke="hsl(174, 55%, 38%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donation by Type */}
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Donations by Type</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={donationByType} cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name} ${value}%`} dataKey="value">
                  {donationByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Education & Health */}
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Education & Health Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={impactStats.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="education" stroke="hsl(200, 65%, 55%)" strokeWidth={2} name="Education %" />
                <Line type="monotone" dataKey="health" stroke="hsl(174, 55%, 38%)" strokeWidth={2} name="Health %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Safehouse Comparison */}
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Safehouse Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={safehouseComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="reintegration" fill="hsl(174, 55%, 38%)" name="Reintegration %" />
                <Bar dataKey="education" fill="hsl(200, 65%, 55%)" name="Education %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reintegration by Type */}
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Reintegration Success by Type</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={reintegrationByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                <XAxis type="number" domain={[0, 100]} fontSize={12} />
                <YAxis type="category" dataKey="name" fontSize={12} width={100} />
                <Tooltip />
                <Bar dataKey="rate" fill="hsl(174, 55%, 38%)" name="Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incidents */}
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Incidents by Type & Severity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={incidentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                <XAxis dataKey="type" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="low" fill="hsl(142, 60%, 45%)" name="Low" stackId="a" />
                <Bar dataKey="medium" fill="hsl(45, 90%, 50%)" name="Medium" stackId="a" />
                <Bar dataKey="high" fill="hsl(0, 72%, 55%)" name="High" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
