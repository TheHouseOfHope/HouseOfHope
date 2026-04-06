import { useState } from 'react';
import { mockSocialPosts } from '@/lib/mock-data';
import { StatCard } from '@/components/StatCard';
import { PaginationControl, usePagination } from '@/components/PaginationControl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, DollarSign, MousePointerClick, Lightbulb } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SocialMediaAnalytics() {
  const [platformFilter, setPlatformFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');

  const filtered = mockSocialPosts.filter(p => {
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    return matchesPlatform;
  });

  const { currentPage, setCurrentPage, startIndex, endIndex, pageSize } = usePagination(filtered.length, 5);
  const paginated = filtered.slice(startIndex, endIndex);

  const totalImpressions = filtered.reduce((s, p) => s + p.impressions, 0);
  const totalReach = filtered.reduce((s, p) => s + p.reach, 0);
  const totalReferrals = filtered.reduce((s, p) => s + p.donationReferrals, 0);
  const totalDonationValue = filtered.reduce((s, p) => s + p.estimatedDonationValue, 0);
  const platforms = [...new Set(mockSocialPosts.map(p => p.platform))];

  // Engagement by platform
  const engagementByPlatform = platforms.map(platform => {
    const posts = mockSocialPosts.filter(p => p.platform === platform);
    const avgEngagement = posts.reduce((s, p) => s + p.engagementRate, 0) / posts.length;
    return { platform, engagement: +avgEngagement.toFixed(1) };
  });

  // Referrals by post type
  const postTypes = [...new Set(mockSocialPosts.map(p => p.postType))];
  const referralsByType = postTypes.map(type => {
    const posts = mockSocialPosts.filter(p => p.postType === type);
    return { type, referrals: posts.reduce((s, p) => s + p.donationReferrals, 0) };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">Social Media Analytics</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div>
          <Label className="text-xs">From</Label>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto" />
        </div>
        <div>
          <Label className="text-xs">To</Label>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto" />
        </div>
        <div>
          <Label className="text-xs">Platform</Label>
          <Select value={platformFilter} onValueChange={v => { setPlatformFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Impressions" value={totalImpressions.toLocaleString()} icon={<Eye className="h-6 w-6" />} />
        <StatCard title="Total Reach" value={totalReach.toLocaleString()} icon={<Users className="h-6 w-6" />} />
        <StatCard title="Donation Referrals" value={totalReferrals} icon={<MousePointerClick className="h-6 w-6" />} />
        <StatCard title="Est. Donation Value" value={`₱${(totalDonationValue / 1000).toFixed(0)}K`} icon={<DollarSign className="h-6 w-6" />} />
      </div>

      {/* Recommendation Card */}
      <Card className="border-primary/30 bg-secondary/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-primary mt-0.5" />
            <div>
              <h3 className="font-display font-semibold text-foreground">AI Recommendations</h3>
              <p className="text-sm text-muted-foreground mt-1">Based on historical performance data:</p>
              <div className="grid sm:grid-cols-3 gap-4 mt-3 text-sm">
                <div><span className="text-muted-foreground">Best Time to Post:</span><br /><span className="font-semibold">Tuesday & Thursday, 6-8 PM</span></div>
                <div><span className="text-muted-foreground">Best Platform:</span><br /><span className="font-semibold">TikTok (8.5% avg engagement)</span></div>
                <div><span className="text-muted-foreground">Best Content Type:</span><br /><span className="font-semibold">Short Video / Reels</span></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">Powered by prediction model API</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Engagement by Platform</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementByPlatform}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                <XAxis dataKey="platform" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="engagement" fill="hsl(174, 55%, 38%)" name="Avg Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Donation Referrals by Post Type</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={referralsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 15% 90%)" />
                <XAxis dataKey="type" fontSize={11} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="referrals" fill="hsl(200, 65%, 55%)" name="Referrals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
        <Table className="table-striped">
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Post Type</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Reach</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Referrals</TableHead>
              <TableHead>Est. Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(p => (
              <TableRow key={p.id}>
                <TableCell><Badge variant="secondary">{p.platform}</Badge></TableCell>
                <TableCell className="text-sm">{p.postType}</TableCell>
                <TableCell className="text-sm">{p.mediaType}</TableCell>
                <TableCell className="text-sm">{p.date}</TableCell>
                <TableCell className="text-sm">{p.impressions.toLocaleString()}</TableCell>
                <TableCell className="text-sm">{p.reach.toLocaleString()}</TableCell>
                <TableCell className="text-sm font-medium">{p.engagementRate}%</TableCell>
                <TableCell className="text-sm">{p.donationReferrals}</TableCell>
                <TableCell className="text-sm font-medium">₱{p.estimatedDonationValue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControl totalItems={filtered.length} pageSize={pageSize} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
