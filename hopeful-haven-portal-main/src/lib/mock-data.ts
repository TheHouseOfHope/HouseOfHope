import { Resident, CounselingSession, Visitation, InterventionPlan, Supporter, Donation, SocialMediaPost, User } from './types';

export const mockUsers: User[] = [
  { id: '1', username: 'admin', displayName: 'Admin User', role: 'admin' },
  { id: '2', username: 'donor', displayName: 'Maria Santos', role: 'donor' },
];

export const mockResidents: Resident[] = [
  {
    id: '1', caseControlNumber: 'HOH-2024-001', internalCode: 'SH1-R001',
    safehouse: 'Bahay Pag-asa', caseStatus: 'active', caseCategory: 'Trafficking',
    caseSubcategories: ['trafficked', 'sexual-abuse'], riskLevel: 'high',
    assignedSocialWorker: 'SW Garcia', reintegrationStatus: 'In Progress',
    reintegrationType: 'Family Reintegration', admissionDate: '2024-01-15',
    dateOfBirth: '2010-05-20', religion: 'Catholic', birthStatus: 'Legitimate',
    placeOfBirth: 'Cebu City', referralSource: 'DSWD', referringAgency: 'DSWD Region VII',
    initialAssessment: 'High risk case requiring immediate intervention and trauma-informed care.',
    is4PsBeneficiary: true, isSoloParent: false, indigenousGroup: '',
    isInformalSettler: true, parentWithDisability: false, reintegrationReadinessScore: 65,
  },
  {
    id: '2', caseControlNumber: 'HOH-2024-002', internalCode: 'SH1-R002',
    safehouse: 'Bahay Pag-asa', caseStatus: 'active', caseCategory: 'Abuse',
    caseSubcategories: ['physical-abuse', 'at-risk'], riskLevel: 'medium',
    assignedSocialWorker: 'SW Reyes', reintegrationStatus: 'Assessment',
    reintegrationType: 'Independent Living', admissionDate: '2024-03-10',
    dateOfBirth: '2009-11-02', religion: 'Catholic', birthStatus: 'Illegitimate',
    placeOfBirth: 'Manila', referralSource: 'PNP-WCPD', referringAgency: 'PNP Manila',
    initialAssessment: 'Moderate risk. Needs educational support and counseling.',
    is4PsBeneficiary: false, isSoloParent: false, indigenousGroup: 'Lumad',
    isInformalSettler: false, parentWithDisability: true, reintegrationReadinessScore: 42,
  },
  {
    id: '3', caseControlNumber: 'HOH-2024-003', internalCode: 'SH2-R001',
    safehouse: 'Bahay Kalinga', caseStatus: 'active', caseCategory: 'OSAEC',
    caseSubcategories: ['OSAEC', 'trafficked'], riskLevel: 'critical',
    assignedSocialWorker: 'SW Garcia', reintegrationStatus: 'Not Ready',
    reintegrationType: 'TBD', admissionDate: '2024-06-01',
    dateOfBirth: '2011-08-15', religion: 'Protestant', birthStatus: 'Legitimate',
    placeOfBirth: 'Davao City', referralSource: 'IJM', referringAgency: 'International Justice Mission',
    initialAssessment: 'Critical risk. Ongoing legal case. Requires high security placement.',
    is4PsBeneficiary: true, isSoloParent: false, indigenousGroup: '',
    isInformalSettler: true, parentWithDisability: false, reintegrationReadinessScore: 20,
  },
  {
    id: '4', caseControlNumber: 'HOH-2023-015', internalCode: 'SH1-R003',
    safehouse: 'Bahay Pag-asa', caseStatus: 'closed', caseCategory: 'At Risk Youth',
    caseSubcategories: ['at-risk', 'orphaned'], riskLevel: 'low',
    assignedSocialWorker: 'SW Mendoza', reintegrationStatus: 'Completed',
    reintegrationType: 'Family Reintegration', admissionDate: '2023-04-20',
    dateOfBirth: '2008-02-14', religion: 'Catholic', birthStatus: 'Legitimate',
    placeOfBirth: 'Quezon City', referralSource: 'Barangay', referringAgency: 'Barangay QC',
    initialAssessment: 'Low risk. Successfully completed reintegration program.',
    is4PsBeneficiary: true, isSoloParent: false, indigenousGroup: '',
    isInformalSettler: false, parentWithDisability: false, reintegrationReadinessScore: 95,
  },
  {
    id: '5', caseControlNumber: 'HOH-2024-004', internalCode: 'SH2-R002',
    safehouse: 'Bahay Kalinga', caseStatus: 'transferred', caseCategory: 'Child Labor',
    caseSubcategories: ['child-labor', 'at-risk'], riskLevel: 'medium',
    assignedSocialWorker: 'SW Reyes', reintegrationStatus: 'Transferred',
    reintegrationType: 'Institutional Transfer', admissionDate: '2024-02-28',
    dateOfBirth: '2010-12-03', religion: 'Islam', birthStatus: 'Legitimate',
    placeOfBirth: 'Zamboanga', referralSource: 'NGO Referral', referringAgency: 'Save the Children',
    initialAssessment: 'Medium risk. Transferred to specialized facility for continued care.',
    is4PsBeneficiary: false, isSoloParent: false, indigenousGroup: 'Badjao',
    isInformalSettler: true, parentWithDisability: false, reintegrationReadinessScore: 55,
  },
];

export const mockSessions: CounselingSession[] = [
  {
    id: '1', residentId: '1', sessionDate: '2024-09-15', socialWorker: 'SW Garcia',
    sessionType: 'individual', durationMinutes: 60, emotionalStateStart: 'Anxious',
    emotionalStateEnd: 'Calm', narrative: 'Discussed coping strategies for anxiety triggers. Resident showed improvement in articulating feelings.',
    interventions: 'CBT techniques, breathing exercises', followUpActions: 'Schedule follow-up in 1 week',
    progressNoted: true, concernsFlagged: false,
  },
  {
    id: '2', residentId: '1', sessionDate: '2024-09-08', socialWorker: 'SW Garcia',
    sessionType: 'group', durationMinutes: 90, emotionalStateStart: 'Withdrawn',
    emotionalStateEnd: 'Engaged', narrative: 'Group art therapy session. Resident participated actively in the second half.',
    interventions: 'Art therapy, group discussion', followUpActions: 'Include in next group session',
    progressNoted: true, concernsFlagged: false,
  },
  {
    id: '3', residentId: '1', sessionDate: '2024-08-25', socialWorker: 'SW Garcia',
    sessionType: 'individual', durationMinutes: 45, emotionalStateStart: 'Distressed',
    emotionalStateEnd: 'Stabilized', narrative: 'Crisis session after nightmare episode. Applied grounding techniques.',
    interventions: 'Crisis intervention, grounding techniques', followUpActions: 'Monitor sleep patterns, consult psychiatrist',
    progressNoted: false, concernsFlagged: true,
  },
];

export const mockVisitations: Visitation[] = [
  {
    id: '1', residentId: '1', visitDate: '2024-09-10', socialWorker: 'SW Garcia',
    visitType: 'Home Visit', location: 'Cebu City', familyMembersPresent: 'Mother, Aunt',
    purpose: 'Family assessment for reintegration planning', observations: 'Home environment is clean and stable. Mother is cooperative.',
    familyCooperationLevel: 'High', safetyConcernsNoted: false, followUpNeeded: true,
    visitOutcome: 'Positive - family is prepared for reintegration process',
  },
  {
    id: '2', residentId: '1', visitDate: '2024-08-20', socialWorker: 'SW Garcia',
    visitType: 'Case Conference', location: 'HOH Office', familyMembersPresent: 'Mother',
    purpose: 'Multi-disciplinary team review of case progress', observations: 'Team agrees resident is making good progress.',
    familyCooperationLevel: 'High', safetyConcernsNoted: false, followUpNeeded: false,
    visitOutcome: 'Continue current intervention plan',
  },
];

export const mockPlans: InterventionPlan[] = [
  {
    id: '1', residentId: '1', planCategory: 'Education', description: 'Enroll in ALS program for grade-level catch-up',
    servicesProvided: 'Tutorial sessions, school supplies', targetDate: '2025-03-01', status: 'in-progress', caseConferenceDate: '2024-08-20',
  },
  {
    id: '2', residentId: '1', planCategory: 'Mental Health', description: 'Weekly individual counseling for trauma recovery',
    servicesProvided: 'CBT sessions, psychiatric evaluation', targetDate: '2025-06-01', status: 'in-progress', caseConferenceDate: '2024-08-20',
  },
  {
    id: '3', residentId: '1', planCategory: 'Life Skills', description: 'Basic cooking and personal hygiene training',
    servicesProvided: 'Life skills workshops', targetDate: '2024-12-01', status: 'completed', caseConferenceDate: '2024-06-15',
  },
];

export const mockSupporters: Supporter[] = [
  { id: '1', displayName: 'Maria Santos', supporterType: 'monetary', status: 'active', country: 'Philippines', acquisitionChannel: 'Website', firstDonationDate: '2023-01-15', churnRisk: 'low' },
  { id: '2', displayName: 'John Smith Foundation', supporterType: 'partner', status: 'active', country: 'United States', acquisitionChannel: 'Referral', firstDonationDate: '2022-06-01', churnRisk: 'low' },
  { id: '3', displayName: 'Sarah Lee', supporterType: 'volunteer', status: 'active', country: 'Australia', acquisitionChannel: 'Social Media', firstDonationDate: '2024-02-10', churnRisk: 'medium' },
  { id: '4', displayName: 'GoodWill Corp', supporterType: 'in-kind', status: 'active', country: 'Japan', acquisitionChannel: 'Corporate', firstDonationDate: '2023-09-20', churnRisk: 'low' },
  { id: '5', displayName: 'Ana Cruz', supporterType: 'social-media', status: 'inactive', country: 'Philippines', acquisitionChannel: 'Instagram', firstDonationDate: '2023-07-05', churnRisk: 'high' },
  { id: '6', displayName: 'Dr. Kim Park', supporterType: 'skills', status: 'active', country: 'South Korea', acquisitionChannel: 'Conference', firstDonationDate: '2024-01-20', churnRisk: 'medium' },
];

export const mockDonations: Donation[] = [
  { id: '1', supporterId: '1', donorName: 'Maria Santos', date: '2024-09-01', type: 'monetary', amount: 25000, currency: 'PHP' },
  { id: '2', supporterId: '1', donorName: 'Maria Santos', date: '2024-06-15', type: 'monetary', amount: 15000, currency: 'PHP' },
  { id: '3', supporterId: '1', donorName: 'Maria Santos', date: '2024-03-01', type: 'monetary', amount: 20000, currency: 'PHP' },
  { id: '4', supporterId: '2', donorName: 'John Smith Foundation', date: '2024-08-15', type: 'monetary', amount: 5000, currency: 'USD' },
  { id: '5', supporterId: '3', donorName: 'Sarah Lee', date: '2024-09-05', type: 'time', hours: 40 },
  { id: '6', supporterId: '4', donorName: 'GoodWill Corp', date: '2024-07-20', type: 'in-kind', itemDetails: '200 school supply kits' },
  { id: '7', supporterId: '5', donorName: 'Ana Cruz', date: '2024-05-10', type: 'social-media', campaignName: '#HopeForGirls Campaign' },
  { id: '8', supporterId: '6', donorName: 'Dr. Kim Park', date: '2024-04-01', type: 'skills', skillDescription: 'Psychiatric consultations - 20 hours' },
  { id: '9', supporterId: '1', donorName: 'Maria Santos', date: '2023-12-01', type: 'monetary', amount: 30000, currency: 'PHP' },
  { id: '10', supporterId: '2', donorName: 'John Smith Foundation', date: '2024-01-10', type: 'monetary', amount: 3000, currency: 'USD' },
];

export const mockSocialPosts: SocialMediaPost[] = [
  { id: '1', platform: 'Facebook', postType: 'Story', mediaType: 'Video', date: '2024-09-10', impressions: 15000, reach: 12000, engagementRate: 4.5, donationReferrals: 12, estimatedDonationValue: 45000, contentTopic: 'Impact Stories', sentimentTone: 'Inspirational' },
  { id: '2', platform: 'Instagram', postType: 'Reel', mediaType: 'Video', date: '2024-09-08', impressions: 25000, reach: 20000, engagementRate: 6.2, donationReferrals: 25, estimatedDonationValue: 75000, contentTopic: 'Education', sentimentTone: 'Hopeful' },
  { id: '3', platform: 'Twitter', postType: 'Thread', mediaType: 'Text', date: '2024-09-05', impressions: 8000, reach: 5000, engagementRate: 2.1, donationReferrals: 3, estimatedDonationValue: 10000, contentTopic: 'Awareness', sentimentTone: 'Informative' },
  { id: '4', platform: 'Facebook', postType: 'Photo Post', mediaType: 'Image', date: '2024-09-01', impressions: 12000, reach: 9000, engagementRate: 3.8, donationReferrals: 8, estimatedDonationValue: 30000, contentTopic: 'Events', sentimentTone: 'Celebratory' },
  { id: '5', platform: 'Instagram', postType: 'Story', mediaType: 'Image', date: '2024-08-28', impressions: 18000, reach: 15000, engagementRate: 5.1, donationReferrals: 15, estimatedDonationValue: 55000, contentTopic: 'Impact Stories', sentimentTone: 'Inspirational' },
  { id: '6', platform: 'TikTok', postType: 'Short Video', mediaType: 'Video', date: '2024-08-25', impressions: 50000, reach: 35000, engagementRate: 8.5, donationReferrals: 40, estimatedDonationValue: 120000, contentTopic: 'Education', sentimentTone: 'Hopeful' },
  { id: '7', platform: 'Facebook', postType: 'Live', mediaType: 'Video', date: '2024-08-20', impressions: 10000, reach: 7000, engagementRate: 7.2, donationReferrals: 20, estimatedDonationValue: 60000, contentTopic: 'Fundraising', sentimentTone: 'Urgent' },
  { id: '8', platform: 'Instagram', postType: 'Carousel', mediaType: 'Image', date: '2024-08-15', impressions: 14000, reach: 11000, engagementRate: 4.0, donationReferrals: 10, estimatedDonationValue: 35000, contentTopic: 'Health', sentimentTone: 'Informative' },
];

export const impactStats = {
  totalResidentsServed: 247,
  totalDonationsReceived: 8450000,
  reintegrationSuccessRate: 78,
  educationEnrollmentRate: 92,
  healthImprovementRate: 85,
  monthlyTrends: [
    { month: 'Jan', residents: 180, donations: 520000, education: 82, health: 75 },
    { month: 'Feb', residents: 190, donations: 610000, education: 84, health: 77 },
    { month: 'Mar', residents: 195, donations: 580000, education: 85, health: 78 },
    { month: 'Apr', residents: 200, donations: 720000, education: 87, health: 80 },
    { month: 'May', residents: 210, donations: 690000, education: 88, health: 81 },
    { month: 'Jun', residents: 218, donations: 810000, education: 89, health: 82 },
    { month: 'Jul', residents: 225, donations: 750000, education: 90, health: 83 },
    { month: 'Aug', residents: 235, donations: 880000, education: 91, health: 84 },
    { month: 'Sep', residents: 247, donations: 890000, education: 92, health: 85 },
  ],
};
