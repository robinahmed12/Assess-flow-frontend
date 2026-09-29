import type {
  AssessmentStatus,
  AttemptStatus,
  InvitationStatus,
} from "../types/candidate-assessments.dto";

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REVOKED: "Revoked",
  EXPIRED: "Expired",
};

export const INVITATION_STATUS_META: Record<
  InvitationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  ACCEPTED: { label: "Accepted", variant: "default" },
  REVOKED: { label: "Revoked", variant: "destructive" },
  EXPIRED: { label: "Expired", variant: "outline" },
};

export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
  EVALUATED: "Evaluated",
  EXPIRED: "Expired",
};

export const ATTEMPT_STATUS_META: Record<
  AttemptStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  IN_PROGRESS: { label: "In progress", variant: "secondary" },
  SUBMITTED: { label: "Submitted", variant: "default" },
  EVALUATED: { label: "Evaluated", variant: "default" },
  EXPIRED: { label: "Expired", variant: "outline" },
};

export const PUBLISHED_ASSESSMENT_STATUS: AssessmentStatus = "PUBLISHED";
