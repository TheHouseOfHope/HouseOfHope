import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockResidents, mockSessions, mockVisitations, mockPlans } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { StatusPill } from '@/components/StatusPill';
import { PaginationControl, usePagination } from '@/components/PaginationControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Plus, Calendar, User, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ResidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const resident = mockResidents.find(r => r.id === id);

  const sessions = mockSessions.filter(s => s.residentId === id);
  const visitations = mockVisitations.filter(v => v.residentId === id);
  const plans = mockPlans.filter(p => p.residentId === id);

  const sessionPagination = usePagination(sessions.length, 5);
  const visitPagination = usePagination(visitations.length, 5);

  if (!resident) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-display font-bold">Resident Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/caseload')}>Back to Caseload</Button>
      </div>
    );
  }

  const planStatusColors: Record<string, string> = {
    'pending': 'bg-risk-medium text-foreground',
    'in-progress': 'bg-accent text-accent-foreground',
    'completed': 'bg-risk-low text-white',
    'on-hold': 'bg-status-closed text-white',
  };

  const comingSoon = () => toast({ title: 'Coming soon', description: 'This form will be available when connected to backend.' });

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/admin/caseload')} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Caseload
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-bold text-foreground">{resident.internalCode}</h1>
              <p className="text-muted-foreground">{resident.safehouse} · Admitted {resident.admissionDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={resident.caseStatus} />
              <RiskBadge level={resident.riskLevel} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-1">Reintegration Readiness Score</p>
            <div className="flex items-center gap-3">
              <Progress value={resident.reintegrationReadinessScore} className="flex-1 h-3" />
              <span className="text-sm font-semibold text-primary">{resident.reintegrationReadinessScore}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Powered by prediction model</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="counseling">Counseling Sessions</TabsTrigger>
          <TabsTrigger value="visitations">Visitations</TabsTrigger>
          <TabsTrigger value="interventions">Intervention Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Demographics */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Demographics</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div><span className="text-muted-foreground">Date of Birth:</span> <span className="font-medium ml-1">{resident.dateOfBirth}</span></div>
                <div><span className="text-muted-foreground">Religion:</span> <span className="font-medium ml-1">{resident.religion}</span></div>
                <div><span className="text-muted-foreground">Birth Status:</span> <span className="font-medium ml-1">{resident.birthStatus}</span></div>
                <div><span className="text-muted-foreground">Place of Birth:</span> <span className="font-medium ml-1">{resident.placeOfBirth}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Case Categories */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Case Categories</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resident.caseSubcategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="capitalize">{cat.replace('-', ' ')}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Family Info */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Family Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">4Ps Beneficiary:</span> <span className="font-medium ml-1">{resident.is4PsBeneficiary ? 'Yes' : 'No'}</span></div>
                <div><span className="text-muted-foreground">Solo Parent:</span> <span className="font-medium ml-1">{resident.isSoloParent ? 'Yes' : 'No'}</span></div>
                <div><span className="text-muted-foreground">Indigenous Group:</span> <span className="font-medium ml-1">{resident.indigenousGroup || 'N/A'}</span></div>
                <div><span className="text-muted-foreground">Informal Settler:</span> <span className="font-medium ml-1">{resident.isInformalSettler ? 'Yes' : 'No'}</span></div>
                <div><span className="text-muted-foreground">Parent w/ Disability:</span> <span className="font-medium ml-1">{resident.parentWithDisability ? 'Yes' : 'No'}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Admission Details */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Admission Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Admission Date:</span> <span className="font-medium ml-1">{resident.admissionDate}</span></div>
                <div><span className="text-muted-foreground">Referral Source:</span> <span className="font-medium ml-1">{resident.referralSource}</span></div>
                <div><span className="text-muted-foreground">Referring Agency:</span> <span className="font-medium ml-1">{resident.referringAgency}</span></div>
                <div><span className="text-muted-foreground">Social Worker:</span> <span className="font-medium ml-1">{resident.assignedSocialWorker}</span></div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-muted-foreground">Initial Assessment:</span>
                <p className="text-sm mt-1">{resident.initialAssessment}</p>
              </div>
            </CardContent>
          </Card>

          {/* Reintegration */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Reintegration Tracking</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Type:</span> <span className="font-medium ml-1">{resident.reintegrationType}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="font-medium ml-1">{resident.reintegrationStatus}</span></div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={comingSoon}>Edit Resident Details</Button>
        </TabsContent>

        <TabsContent value="counseling" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-semibold">Counseling Sessions</h3>
            <Button size="sm" onClick={comingSoon}><Plus className="h-4 w-4 mr-1" /> Add Session</Button>
          </div>
          {sessions.slice(sessionPagination.startIndex, sessionPagination.endIndex).map(s => (
            <Card key={s.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {s.sessionDate}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><User className="h-3.5 w-3.5" /> {s.socialWorker}</div>
                  <Badge variant="secondary" className="capitalize">{s.sessionType}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {s.durationMinutes} min</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div><span className="text-muted-foreground">State at Start:</span> <span className="font-medium ml-1">{s.emotionalStateStart}</span></div>
                  <div><span className="text-muted-foreground">State at End:</span> <span className="font-medium ml-1">{s.emotionalStateEnd}</span></div>
                </div>
                <p className="text-sm mb-2">{s.narrative}</p>
                <p className="text-sm text-muted-foreground"><strong>Interventions:</strong> {s.interventions}</p>
                <p className="text-sm text-muted-foreground"><strong>Follow-up:</strong> {s.followUpActions}</p>
                <div className="flex gap-2 mt-3">
                  {s.progressNoted && <Badge className="bg-risk-low text-white">Progress Noted</Badge>}
                  {s.concernsFlagged && <Badge className="bg-risk-high text-white">Concerns Flagged</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
          <PaginationControl totalItems={sessions.length} pageSize={sessionPagination.pageSize} currentPage={sessionPagination.currentPage} onPageChange={sessionPagination.setCurrentPage} />
        </TabsContent>

        <TabsContent value="visitations" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-semibold">Visitations & Conferences</h3>
            <Button size="sm" onClick={comingSoon}><Plus className="h-4 w-4 mr-1" /> Add Visit</Button>
          </div>
          {visitations.slice(visitPagination.startIndex, visitPagination.endIndex).map(v => (
            <Card key={v.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {v.visitDate}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><User className="h-3.5 w-3.5" /> {v.socialWorker}</div>
                  <Badge variant="secondary">{v.visitType}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {v.location}</div>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  <p><span className="text-muted-foreground">Family Present:</span> {v.familyMembersPresent}</p>
                  <p><span className="text-muted-foreground">Purpose:</span> {v.purpose}</p>
                  <p><span className="text-muted-foreground">Observations:</span> {v.observations}</p>
                  <p><span className="text-muted-foreground">Cooperation:</span> {v.familyCooperationLevel}</p>
                  <p><span className="text-muted-foreground">Outcome:</span> {v.visitOutcome}</p>
                </div>
                <div className="flex gap-2">
                  {v.safetyConcernsNoted && <Badge className="bg-risk-high text-white">Safety Concerns</Badge>}
                  {v.followUpNeeded && <Badge className="bg-accent text-accent-foreground">Follow-up Needed</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
          <PaginationControl totalItems={visitations.length} pageSize={visitPagination.pageSize} currentPage={visitPagination.currentPage} onPageChange={visitPagination.setCurrentPage} />
        </TabsContent>

        <TabsContent value="interventions" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-semibold">Intervention Plans</h3>
            <Button size="sm" onClick={comingSoon}><Plus className="h-4 w-4 mr-1" /> Add Plan</Button>
          </div>
          {plans.map(p => (
            <Card key={p.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{p.planCategory}</h4>
                  <Badge className={planStatusColors[p.status] || 'bg-muted'}>{p.status}</Badge>
                </div>
                <p className="text-sm mb-2">{p.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <p><strong>Services:</strong> {p.servicesProvided}</p>
                  <p><strong>Target:</strong> {p.targetDate}</p>
                  <p><strong>Conference:</strong> {p.caseConferenceDate}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
