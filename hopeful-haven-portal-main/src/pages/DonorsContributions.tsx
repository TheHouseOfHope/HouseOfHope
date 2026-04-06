import { useState } from 'react';
import { mockSupporters, mockDonations } from '@/lib/mock-data';
import { Supporter, Donation } from '@/lib/types';
import { RiskBadge } from '@/components/RiskBadge';
import { PaginationControl, usePagination } from '@/components/PaginationControl';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DonorsContributions() {
  const [supporters] = useState<Supporter[]>(mockSupporters);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSupporter, setSelectedSupporter] = useState<Supporter | null>(null);
  const { toast } = useToast();

  const filtered = supporters.filter(s => {
    const matchesSearch = s.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.supporterType === typeFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const { currentPage, setCurrentPage, startIndex, endIndex, pageSize } = usePagination(filtered.length, 10);
  const paginated = filtered.slice(startIndex, endIndex);

  const supporterDonations = selectedSupporter ? mockDonations.filter(d => d.supporterId === selectedSupporter.id) : [];

  const comingSoon = () => toast({ title: 'Coming soon', description: 'This form will be available when connected to backend.' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground">Donors & Contributors</h1>
        <div className="flex gap-2">
          <Button onClick={comingSoon}><Plus className="h-4 w-4 mr-2" /> Add Supporter</Button>
          <Button variant="outline" onClick={comingSoon}><Plus className="h-4 w-4 mr-2" /> Record Donation</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search supporters..." className="pl-10" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="monetary">Monetary Donor</SelectItem>
            <SelectItem value="in-kind">In-Kind Donor</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
            <SelectItem value="skills">Skills Contributor</SelectItem>
            <SelectItem value="social-media">Social Media Advocate</SelectItem>
            <SelectItem value="partner">Partner Organization</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
        <Table className="table-striped">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>First Donation</TableHead>
              <TableHead>Churn Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(s => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelectedSupporter(s)}>
                <TableCell className="font-medium">{s.displayName}</TableCell>
                <TableCell><Badge variant="secondary" className="capitalize">{s.supporterType.replace('-', ' ')}</Badge></TableCell>
                <TableCell>
                  <Badge variant={s.status === 'active' ? 'default' : 'secondary'} className={s.status === 'active' ? 'bg-risk-low text-white' : ''}>{s.status}</Badge>
                </TableCell>
                <TableCell>{s.country}</TableCell>
                <TableCell>{s.acquisitionChannel}</TableCell>
                <TableCell>{s.firstDonationDate}</TableCell>
                <TableCell><RiskBadge level={s.churnRisk} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationControl totalItems={filtered.length} pageSize={pageSize} currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Supporter Detail Dialog */}
      <Dialog open={!!selectedSupporter} onOpenChange={() => setSelectedSupporter(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedSupporter?.displayName}</DialogTitle>
          </DialogHeader>
          {selectedSupporter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type:</span> <span className="capitalize ml-1">{selectedSupporter.supporterType.replace('-', ' ')}</span></div>
                <div><span className="text-muted-foreground">Country:</span> <span className="ml-1">{selectedSupporter.country}</span></div>
                <div><span className="text-muted-foreground">Channel:</span> <span className="ml-1">{selectedSupporter.acquisitionChannel}</span></div>
                <div><span className="text-muted-foreground">Churn Risk:</span> <span className="ml-1"><RiskBadge level={selectedSupporter.churnRisk} /></span></div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Donation History</h4>
                {supporterDonations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No donations recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {supporterDonations.map(d => (
                      <div key={d.id} className="flex justify-between items-center p-2 rounded bg-muted/50 text-sm">
                        <div>
                          <span>{d.date}</span> · <span className="capitalize">{d.type}</span>
                        </div>
                        <span className="font-medium">
                          {d.amount ? `${d.currency === 'USD' ? '$' : '₱'}${d.amount.toLocaleString()}` : d.itemDetails || d.skillDescription || d.campaignName || `${d.hours}h`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
