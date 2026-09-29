export type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "EVALUATED" | "EXPIRED";

export interface CandidateAttemptDto {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  score: number | null;
}

export interface CandidateAssessmentSummaryDto {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  passingScore: number | null;
  status: AssessmentStatus;
}

export interface CandidateAssessmentDto {
  id: string;
  token: string;
  candidateEmail: string;
  status: InvitationStatus;
  expiresAt: string | null;
  assessmentId: string;
  candidateId: string;
  createdAt: string;
  updatedAt: string;
  assessment: CandidateAssessmentSummaryDto;
  attempt: CandidateAttemptDto | null;
}

export interface AttemptHistoryDto {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  assessment: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    passingScore: number | null;
  };
}

export interface AttemptProblemDto {
  id: string;
  order: number;
  title: string;
  description: string;
  type: "MCQ" | "WRITTEN" | "CODING";
  points: number;
  difficulty: string | null;
  tags: string[];
  options?: {
    id: string;
    text: string;
  }[];
}

export interface StartedAttemptDto {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  assessment: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    problems: AttemptProblemDto[];
  };
}
