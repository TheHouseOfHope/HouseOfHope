import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockResidents } from '@/lib/mock-data';
import { Resident, CaseStatus, RiskLevel } from '@/lib/types';
import { RiskBadge } from '@/components/RiskBadge';
import { StatusPill } from '@/components/StatusPill';
import { PaginationControl, usePagination } from '@/components/PaginationControl';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CaseloadInventory() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [safehouseFilter, setSafehouseFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = residents.filter(r => {
    const matchesSearch = r.internalCode.toLowerCase().includes(search.toLowerCase()) ||
      r.caseControlNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.assignedSocialWorker.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.caseStatus === statusFilter;
    const matchesRisk = riskFilter === 'all' || r.riskLevel === riskFilter;
    const matchesSafehouse = safehouseFilter === 'all' || r.safehouse === safehouseFilter;
    return matchesSearch && matchesStatus && matchesRisk && matchesSafehouse;
  });

  const { currentPage, setCurrentPage, startIndex, endIndex, pageSize } = usePagination(filtered.length, 10);
  const paginated = filtered.slice(startIndex, endIndex);
  const safehouses = [...new Set(residents.map(r => r.safehouse))];

  const handleDelete = () => {
    if (deleteTarget) {
      setResidents(prev => prev.filter(r => r.id !== deleteTarget));
      toast({ title: 'Record deleted', description: 'The resident record has been removed.' });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground">Caseload Inventory</h1>
        <Button onClick={() => toast({ title: 'Coming soon', description: 'Add resident form will be available when connected to backend.' })}>
          <Plus className="h-4 w-4 mr-2" /> Add Resident
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by code, case number, or social worker..." className="pl-10" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="transferred">Transferred</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={v => { setRiskFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Risk" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={safehouseFilter} onValueChange={v => { setSafehouseFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Safehouse" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Safehouses</SelectItem>
            {safehouses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
        <Table className="table-striped">
          <TableHeader>
            <TableRow>
              <TableHead>Case #</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Safehouse</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Social Worker</TableHead>
              <TableHead>Reintegration</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(r => (
              <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate(`/admin/resident/${r.id}`)}>
                <TableCell className="font-medium text-sm">{r.caseControlNumber}</TableCell>
                <TableCell className="text-sm">{r.internalCode}</TableCell>
                <TableCell className="text-sm">{r.safehouse}</TableCell>
                <TableCell><StatusPill status={r.caseStatus} /></TableCell>
                <TableCell className="text-sm">{r.caseCategory}</TableCell>
                <TableCell><RiskBadge level={r.riskLevel} /></TableCell>
                <TableCell className="text-sm">{r.assignedSocialWorker}</TableCell>
                <TableCell className="text-sm">{r.reintegrationStatus}</TableCell>
                <TableCell>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/resident/${r.id}`)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationControl totalItems={filtered.length} pageSize={pageSize} currentPage={currentPage} onPageChange={setCurrentPage} />
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Resident Record?" description="This will permanently remove this resident record. This action cannot be undone." />
    </div>
  );
}
