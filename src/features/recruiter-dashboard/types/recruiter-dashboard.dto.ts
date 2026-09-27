export interface DashboardCompany {
  id: string;
  name: string;
  creditsAvailable: number;
}

export interface DashboardOverview {
  totalAssessments: number;
  publishedAssessments: number;
  totalInvitations: number;
  totalAttempts: number;
  inProgressAttempts: number;
  pendingEvaluations: number;
  evaluatedAttempts: number;
  averageScore: number;
  averagePercentage: number;
  passedAttempts: number;
  failedAttempts: number;
  passRate: number;
  candidateStartRate: number;
  submissionRate: number;
  evaluationRate: number;
}

export interface DashboardAssessmentBreakdown {
  draft: number;
  published: number;
  closed: number;
  archived: number;
}

export interface DashboardInvitationBreakdown {
  pending: number;
  accepted: number;
  expired: number;
  revoked: number;
}

export interface DashboardAttemptBreakdown {
  inProgress: number;
  submitted: number;
  evaluated: number;
  expired: number;
}

export interface DashboardPaymentSummary {
  successfulPayments: number;
  totalSpent: number;
  creditsPurchased: number;
}

export interface DashboardRecentSubmission {
  attemptId: string;
  status: string;
  submittedAt: string;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  assessment: {
    id: string;
    title: string;
  };
  candidate: {
    id: string;
    name: string;
    email: string;
  } | null;
  candidateEmail: string;
}

export interface DashboardAssessmentPerformance {
  assessment: {
    id: string;
    title: string;
  };
  evaluatedAttempts: number;
  averageScore: number;
  averagePercentage: number;
}

export interface RecruiterDashboard {
  company: DashboardCompany;
  overview: DashboardOverview;
  assessmentBreakdown: DashboardAssessmentBreakdown;
  invitationBreakdown: DashboardInvitationBreakdown;
  attemptBreakdown: DashboardAttemptBreakdown;
  paymentSummary: DashboardPaymentSummary;
  recentSubmissions: DashboardRecentSubmission[];
  assessmentPerformance: DashboardAssessmentPerformance[];
}
