import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { mockResidents, mockDonations, impactStats } from '@/lib/mock-data';
import { Users, DollarSign, AlertTriangle, CalendarClock, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const activeResidents = mockResidents.filter(r => r.caseStatus === 'active');
  const highRiskResidents = mockResidents.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical');
  const recentDonations = mockDonations.slice(0, 5);

  const upcomingConferences = [
    { id: '1', residentCode: 'SH1-R001', date: '2024-10-01', type: 'Quarterly Review' },
    { id: '2', residentCode: 'SH2-R001', date: '2024-10-05', type: 'Risk Assessment' },
    { id: '3', residentCode: 'SH1-R002', date: '2024-10-10', type: 'Reintegration Planning' },
  ];

  const recentActivity = [
    { id: '1', action: 'Counseling session completed', target: 'SH1-R001', time: '2 hours ago' },
    { id: '2', action: 'New donation received', target: '₱25,000', time: '5 hours ago' },
    { id: '3', action: 'Home visit scheduled', target: 'SH2-R001', time: '1 day ago' },
    { id: '4', action: 'Intervention plan updated', target: 'SH1-R002', time: '1 day ago' },
    { id: '5', action: 'Risk level changed to critical', target: 'SH2-R001', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Residents" value={activeResidents.length} icon={<Users className="h-6 w-6" />} description="Across all safehouses" />
        <StatCard title="High/Critical Risk" value={highRiskResidents.length} icon={<AlertTriangle className="h-6 w-6" />} description="Requiring attention" />
        <StatCard title="Total Donations (Sep)" value="₱890K" icon={<DollarSign className="h-6 w-6" />} description="This month" />
        <StatCard title="Reintegration Rate" value={`${impactStats.reintegrationSuccessRate}%`} icon={<TrendingUp className="h-6 w-6" />} description="Overall success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - charts and lists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Education & Health Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Education & Health Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={impactStats.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} domain={[70, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="education" stroke="hsl(200 65% 55%)" strokeWidth={2} name="Education %" />
                  <Line type="monotone" dataKey="health" stroke="hsl(174 55% 38%)" strokeWidth={2} name="Health %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* High Risk Residents */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-risk-high" /> Flagged Residents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highRiskResidents.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{r.internalCode}</p>
                      <p className="text-xs text-muted-foreground">{r.safehouse} · {r.assignedSocialWorker}</p>
                    </div>
                    <RiskBadge level={r.riskLevel} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDonations.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{d.donorName}</p>
                      <p className="text-xs text-muted-foreground">{d.date} · {d.type}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {d.amount ? `${d.currency === 'USD' ? '$' : '₱'}${d.amount.toLocaleString()}` : d.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - activity & conferences */}
        <div className="space-y-6">
          {/* Upcoming Conferences */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-accent" /> Upcoming Conferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingConferences.map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">{c.residentCode}</p>
                    <p className="text-xs text-muted-foreground">{c.date} · {c.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(a => (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.target} · {a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
