import { useAuth } from '@/contexts/AuthContext';
import { mockDonations, impactStats } from '@/lib/mock-data';
import { StatCard } from '@/components/StatCard';
import { PublicNavbar } from '@/components/PublicNavbar';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, Users, GraduationCap } from 'lucide-react';

export default function DonorPortal() {
  const { user } = useAuth();
  // Get donor's donations (supporter id '1' maps to donor user)
  const myDonations = mockDonations.filter(d => d.supporterId === '1');
  const totalGiven = myDonations.filter(d => d.type === 'monetary').reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 gradient-warm py-8">
        <div className="container mx-auto px-4 space-y-8">
          {/* Welcome */}
          <div className="bg-card rounded-xl border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {user?.displayName}!</h1>
                <p className="text-muted-foreground text-sm">Thank you for your generous support of House of Hope.</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Your donations are making a real difference in the lives of girls who are survivors of abuse and trafficking.
              Every contribution helps provide safe shelter, education, counseling, and hope for a brighter future.
              We are deeply grateful for your partnership in this mission.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Given" value={`₱${totalGiven.toLocaleString()}`} icon={<DollarSign className="h-6 w-6" />} />
            <StatCard title="Donations Made" value={myDonations.length} icon={<Heart className="h-6 w-6" />} />
            <StatCard title="Girls Supported" value="12" icon={<Users className="h-6 w-6" />} description="Through your donations" />
            <StatCard title="Education Funded" value="8" icon={<GraduationCap className="h-6 w-6" />} description="Scholarships supported" />
          </div>

          {/* Donation History */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Your Giving History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myDonations.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{d.date}</p>
                      <p className="text-xs text-muted-foreground capitalize">{d.type} donation</p>
                    </div>
                    <span className="font-semibold text-primary">
                      {d.amount ? `${d.currency === 'USD' ? '$' : '₱'}${d.amount.toLocaleString()}` : d.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Here's what your donations have helped fund (anonymized data):</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-display font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Girls supported in safe shelter</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-display font-bold text-primary">92%</p>
                  <p className="text-xs text-muted-foreground">Education enrollment achieved</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-display font-bold text-primary">85%</p>
                  <p className="text-xs text-muted-foreground">Health improvement rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supported Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Supported Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Bahay Pag-asa Safehouse</Badge>
                <Badge variant="secondary">Education & Tutoring</Badge>
                <Badge variant="secondary">Mental Health Services</Badge>
                <Badge variant="secondary">Life Skills Training</Badge>
                <Badge variant="secondary">Reintegration Program</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <CookieConsentBanner />
    </div>
  );
}
