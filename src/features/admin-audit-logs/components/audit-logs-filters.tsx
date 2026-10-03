"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { ENTITY_TYPE_OPTIONS } from "../constants/audit-log.constants";
import type {
  AuditLogFilterDto,
  AuditLogSortOrder,
} from "../types/audit-log.dto";

const ALL_ENTITY_TYPES = "__all__";

export interface AuditLogsFiltersProps {
  filters: AuditLogFilterDto;
  onChange: (next: AuditLogFilterDto) => void;
  onReset: () => void;
  isFetching: boolean;
}

export function AuditLogsFilters({
  filters,
  onChange,
  onReset,
  isFetching,
}: AuditLogsFiltersProps) {
  const isFiltered = Boolean(
    filters.action ||
      filters.entityType ||
      filters.entityId ||
      filters.actorId ||
      filters.from ||
      filters.to,
  );

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Filters</h2>

        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="audit-filter-action">Action</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="audit-filter-action"
              value={filters.action ?? ""}
              onChange={(event) => onChange({ ...filters, action: event.target.value })}
              placeholder="e.g. PAYMENT"
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="audit-filter-entity-type">Entity type</Label>
          <Select
            value={filters.entityType ?? ALL_ENTITY_TYPES}
            onValueChange={(value) =>
              onChange({
                ...filters,
                entityType: value === ALL_ENTITY_TYPES ? "" : value,
              })
            }
          >
            <SelectTrigger id="audit-filter-entity-type" aria-label="Filter by entity type">
              <SelectValue placeholder="All entity types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ENTITY_TYPES}>All entity types</SelectItem>
              {ENTITY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="audit-filter-entity-id">Entity ID</Label>
          <Input
            id="audit-filter-entity-id"
            value={filters.entityId ?? ""}
            onChange={(event) => onChange({ ...filters, entityId: event.target.value })}
            placeholder="Exact entity id"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="audit-filter-actor-id">Actor ID</Label>
          <Input
            id="audit-filter-actor-id"
            value={filters.actorId ?? ""}
            onChange={(event) => onChange({ ...filters, actorId: event.target.value })}
            placeholder="Exact user uuid"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="audit-filter-from">From</Label>
          <Input
            id="audit-filter-from"
            type="date"
            value={filters.from ?? ""}
            max={filters.to}
            onChange={(event) => onChange({ ...filters, from: event.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="audit-filter-to">To</Label>
          <Input
            id="audit-filter-to"
            type="date"
            value={filters.to ?? ""}
            min={filters.from}
            onChange={(event) => onChange({ ...filters, to: event.target.value })}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Action and entity type match partially; IDs match exactly. Dates are interpreted as
        whole UTC days.
        {isFetching ? " Refreshing…" : null}
      </p>
    </div>
  );
}

export { ALL_ENTITY_TYPES };
export type { AuditLogSortOrder };
