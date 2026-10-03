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

/**
 * Truncates a long page list so the control stays a fixed width regardless of
 * `totalPages`, e.g. `[1, '…', 4, 5, 6, '…', 20]`.
 */
export function buildPageWindow(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis-left" | "ellipsis-right"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (currentPage >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach((page) => pages.add(page));
  }

  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const window: Array<number | "ellipsis-left" | "ellipsis-right"> = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];

    if (previous !== undefined && page - previous > 1) {
      window.push(page === sorted[sorted.length - 1] ? "ellipsis-right" : "ellipsis-left");
    }

    window.push(page);
  });

  return window;
}
