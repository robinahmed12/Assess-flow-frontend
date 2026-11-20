export interface CandidateOverview {
  totalAssignments: number;
  pendingInvitations: number;
  acceptedInvitations: number;
  expiredInvitations: number;
  totalAttempts: number;
  inProgressAttempts: number;
  submittedAttempts: number;
  evaluatedAttempts: number;
  expiredAttempts: number;
  completedAttempts: number;
  visibleResults: number;
  passedAttempts: number;
  failedAttempts: number;
  averageScore: number;
  averagePercentage: number;
  startRate: number;
  completionRate: number;
  passRate: number;
}

export interface CandidateInvitationBreakdown {
  pending: number;
  accepted: number;
  expired: number;
  revoked: number;
}

export interface CandidateAttemptBreakdown {
  inProgress: number;
  submitted: number;
  evaluated: number;
  expired: number;
}

export interface CandidateUpcomingAssessment {
  id: string;
  title: string;
  duration: number;
  expiresAt?: string;
  invitationId?: string;
}

export interface CandidateRecentAttempt {
  id: string;
  status: "EVALUATED" | "SUBMITTED" | "IN_PROGRESS" | "EXPIRED" | string;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  assessment: {
    id: string;
    title: string;
    duration: number;
  };
  resultAvailable: boolean;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
}

export interface CandidatePerformancePoint {
  attemptId: string;
  assessment: {
    id: string;
    title: string;
  };
  score: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
}

export interface CandidateDashboardDto {
  overview: CandidateOverview;
  invitationBreakdown: CandidateInvitationBreakdown;
  attemptBreakdown: CandidateAttemptBreakdown;
  upcomingAssessments: CandidateUpcomingAssessment[];
  recentAttempts: CandidateRecentAttempt[];
  performanceTrend: CandidatePerformancePoint[];
}
