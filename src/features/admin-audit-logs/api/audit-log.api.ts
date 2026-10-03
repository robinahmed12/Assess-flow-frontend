import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "@/src/features/auth/api";
import type {
  AuditLogDto,
  AuditLogFilterDto,
  AuditLogPageDto,
} from "../types/audit-log.dto";

const AUDIT_LOGS_ENDPOINT = "/admin/audit-logs";

interface RawAuditLogPage {
  data?: AuditLogDto[] | null;
  meta?: Partial<AuditLogPageDto["meta"]> | null;
}

/**
 * The backend validates `from`/`to` with `z.string().datetime()`, so a bare
 * `YYYY-MM-DD` value from a date input must be widened to a full ISO instant.
 * The range is pinned to UTC so the filter is deterministic regardless of the
 * viewer's timezone.
 */
function toIsoBoundary(dateOnly: string, boundary: "start" | "end"): string | null {
  const trimmed = dateOnly.trim();

  if (!trimmed) return null;

  const suffix = boundary === "start" ? "T00:00:00.000Z" : "T23:59:59.999Z";
  const parsed = new Date(`${trimmed}${suffix}`);

  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function toAuditLogPage(
  raw: RawAuditLogPage | null | undefined,
  params: AuditLogFilterDto,
): AuditLogPageDto {
  const items = Array.isArray(raw?.data) ? raw.data : [];
  const meta = raw?.meta ?? {};
  const total = meta.total ?? items.length;

  return {
    items,
    meta: {
      page: meta.page ?? params.page ?? 1,
      limit: meta.limit ?? params.limit ?? items.length,
      total,
      totalPages: meta.totalPages ?? (items.length > 0 ? 1 : 0),
    },
  };
}

export const auditLogApi = {
  list: (params: AuditLogFilterDto = {}): Promise<AuditLogPageDto> => {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const action = params.action?.trim();
    if (action) query.set("action", action);

    const entityType = params.entityType?.trim();
    if (entityType) query.set("entityType", entityType);

    const entityId = params.entityId?.trim();
    if (entityId) query.set("entityId", entityId);

    const actorId = params.actorId?.trim();
    if (actorId) query.set("actorId", actorId);

    const from = params.from ? toIsoBoundary(params.from, "start") : null;
    if (from) query.set("from", from);

    const to = params.to ? toIsoBoundary(params.to, "end") : null;
    if (to) query.set("to", to);

    const search = query.toString();

    return unwrap(
      apiClient<RawAuditLogPage>(
        `${AUDIT_LOGS_ENDPOINT}${search ? `?${search}` : ""}`,
      ),
    ).then((raw) => toAuditLogPage(raw, params));
  },
};
