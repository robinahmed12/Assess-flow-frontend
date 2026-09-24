import type { ProblemDto } from "../../recruiter-problems/types/problem.dto";

export type AssessmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED"
  | "ARCHIVED";

export type AttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "EVALUATED"
  | "EXPIRED";

export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REVOKED"
  | "EXPIRED";

export type ResultVisibility =
  | "IMMEDIATE"
  | "AFTER_REVIEW"
  | "HIDDEN";

export interface AssessmentDto {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  passingScore: number | null;
  status: AssessmentStatus;
  resultVisibility: ResultVisibility;
  problemCount: number;
}

export interface AssessmentListRawDto
  extends Omit<AssessmentDto, "problemCount"> {
  _count?: {
    problems: number;
  };
}

export interface AssessmentProblemDto {
  id: string;
  assessmentId: string;
  problemId: string;
  order: number;
  createdAt: string;
  problem: ProblemDto;
}

export interface AssessmentDetailDto {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  passingScore: number | null;
  status: AssessmentStatus;
  resultVisibility: ResultVisibility;
  problems: AssessmentProblemDto[];
}

export interface CreateAssessmentRequestDto {
  title: string;
  description?: string;
  durationMinutes: number;
  passingScore: number;
  problemIds: string[];
}

export interface UpdateAssessmentRequestDto {
  title?: string;
  description?: string | null;
  durationMinutes?: number;
  passingScore?: number;
  problemIds?: string[];
}

export interface InvitationCandidateDto {
  id: string;
  name: string | null;
  email: string;
}

export interface InvitationAttemptDto {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  score: number | null;
}

export interface AssessmentRefDto {
  id: string;
  title: string;
  duration: number;
}

export interface InvitationDto {
  id: string;
  token: string;
  candidateEmail: string;
  status: InvitationStatus;
  expiresAt: string | null;
  assessmentId: string;
  candidateId: string;
  candidate: InvitationCandidateDto;
  assessment: AssessmentRefDto;
  attempt: InvitationAttemptDto | null;
  invitationLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationRequestDto {
  candidateEmail: string;
  expiresAt?: string;
}

export interface SubmissionDto {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  totalScore: number | null;
  percentage: number | null;
  passed: boolean | null;
  candidate: InvitationCandidateDto;
  candidateEmail: string;
  answerCount: number;
  evaluatedAnswerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionsMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubmissionsResponseDto {
  meta: SubmissionsMetaDto;
  data: SubmissionDto[];
}

export interface SubmissionsQueryDto {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
}

export interface AssessmentReportDto {
  assessment: {
    id: string;
    title: string;
    status: AssessmentStatus;
    passingScore: number | null;
    resultVisibility: ResultVisibility;
  };
  metrics: {
    invited: number;
    started: number;
    submitted: number;
    evaluated: number;
    averageScore: number;
    averagePercentage: number;
    passRate: number;
  };
}