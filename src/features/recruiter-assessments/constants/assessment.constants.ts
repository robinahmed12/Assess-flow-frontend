import type {AssessmentStatus} from "../types/assessment.dto";
import type {AttemptStatus} from "../types/assessment.dto";

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

export const ASSESSMENT_STATUS_META: Record<
  AssessmentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "default" },
  CLOSED: { label: "Closed", variant: "outline" },
  ARCHIVED: { label: "Archived", variant: "destructive" },
};

export const CLOSED_STATUS: AssessmentStatus = "CLOSED";
export const ARCHIVED_STATUS: AssessmentStatus = "ARCHIVED";

export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
  EVALUATED: "Evaluated",
  EXPIRED: "Expired",
};

export const PUBLISHED_STATUS: AssessmentStatus = "PUBLISHED";
export const DRAFT_STATUS: AssessmentStatus = "DRAFT";
