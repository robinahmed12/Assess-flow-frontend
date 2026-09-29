import { PUBLISHED_ASSESSMENT_STATUS } from "../constants/assessment.constants";
import type { CandidateAssessmentDto } from "../types/candidate-assessments.dto";

export type AssignmentAction = "start" | "resume" | "result" | "view" | null;

/**
 * Decides which CTA an assignment card should show.
 *
 * Rules (S-12):
 * - no attempt + assessment published  -> start
 * - attempt in progress                  -> resume
 * - attempt submitted/evaluated          -> open result
 * - invitation expired/revoked           -> no action
 */
export function getAssignmentAction(
  assignment: CandidateAssessmentDto,
): AssignmentAction {
  const { status: invitationStatus, assessment, attempt } = assignment;

  if (invitationStatus === "REVOKED" || invitationStatus === "EXPIRED") {
    return null;
  }

  if (!attempt) {
    return assessment.status === PUBLISHED_ASSESSMENT_STATUS ? "start" : null;
  }

  if (attempt.status === "IN_PROGRESS") {
    return "resume";
  }

  if (attempt.status === "SUBMITTED" || attempt.status === "EVALUATED") {
    return "result";
  }

  return null;
}

export function getAssignmentActionLabel(action: AssignmentAction): string {
  switch (action) {
    case "start":
      return "Start assessment";
    case "resume":
      return "Resume assessment";
    case "result":
      return "View result";
    case "view":
      return "View assessment";
    default:
      return "";
  }
}
