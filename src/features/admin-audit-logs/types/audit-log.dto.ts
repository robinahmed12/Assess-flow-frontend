export type AuditLogSortOrder = "asc" | "desc";

export interface AuditLogActorDto {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

export interface AuditLogDto {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: unknown;
  actorId?: string | null;
  createdAt: string;
  actor?: AuditLogActorDto | null;
}

export interface AuditLogMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditLogPageDto {
  items: AuditLogDto[];
  meta: AuditLogMetaDto;
}

export interface AuditLogFilterDto {
  page?: number;
  limit?: number;
  actorId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  /** `YYYY-MM-DD` from a date input; converted to an ISO instant before sending. */
  from?: string;
  /** `YYYY-MM-DD` from a date input; converted to an ISO instant before sending. */
  to?: string;
  sortOrder?: AuditLogSortOrder;
}

export interface AuditLogQueryState extends AuditLogFilterDto {
  page: number;
  limit: number;
}
