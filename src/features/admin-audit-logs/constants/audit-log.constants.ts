export const AUDIT_LOG_PAGE_SIZES = [10, 20, 50, 100] as const;

export const AUDIT_LOG_DEFAULT_LIMIT = 20;

export const ENTITY_TYPE_OPTIONS = [
  "Assessment",
  "Attempt",
  "Candidate",
  "Company",
  "Invitation",
  "Payment",
  "Problem",
  "User",
] as const;

const SUCCESS_HINTS = ["CREATED", "SUCCEEDED", "UPDATED", "GRANTED", "PUBLISHED"];
const FAILURE_HINTS = ["FAILED", "DELETED", "REJECTED", "CANCELLED", "BLOCKED"];

export type AuditActionTone = "success" | "failure" | "neutral";

export function getAuditActionTone(action: string): AuditActionTone {
  const normalized = action.toUpperCase();

  if (FAILURE_HINTS.some((hint) => normalized.includes(hint))) return "failure";
  if (SUCCESS_HINTS.some((hint) => normalized.includes(hint))) return "success";

  return "neutral";
}
