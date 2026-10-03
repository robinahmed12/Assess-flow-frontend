import type { AuditLogActorDto } from "../types/audit-log.dto";

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function formatAuditDate(value: string | undefined | null): string {
  if (!value) return "—";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "—";

  return `${dateTimeFormatter.format(parsed)} UTC`;
}

export function formatActor(actor: AuditLogActorDto | null | undefined): string {
  if (!actor) return "System";

  return actor.name || actor.email || "Unknown actor";
}

export function toEntityLabel(entityType: string | undefined | null): string {
  if (!entityType) return "—";

  const trimmed = entityType.trim();

  if (!trimmed) return "—";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function hasMetadata(metadata: unknown): boolean {
  if (metadata === null || metadata === undefined) return false;

  if (Array.isArray(metadata)) return metadata.length > 0;
  if (typeof metadata === "object") return Object.keys(metadata).length > 0;

  return String(metadata).trim().length > 0;
}

export function formatMetadata(metadata: unknown): string {
  if (metadata === null || metadata === undefined) return "";

  try {
    return JSON.stringify(metadata, null, 2) ?? String(metadata);
  } catch {
    return String(metadata);
  }
}
