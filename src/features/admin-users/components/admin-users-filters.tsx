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
import {
  ALL_FILTER_VALUE,
  ROLE_LABELS,
  SORT_BY_LABELS,
  STATUS_LABELS,
  USER_ROLES,
  USER_SORT_FIELDS,
  USER_STATUSES,
} from "../constants/admin-user.constants";
import type { UserSortBy } from "../types/admin-user.dto";

export interface AdminUsersFiltersProps {
  draft: {
    q: string;
    role: string;
    status: string;
    sortBy: UserSortBy;
  };
  onChange: (next: AdminUsersFiltersProps["draft"]) => void;
  onApply: () => void;
  onReset: () => void;
  isFiltered: boolean;
  hasPendingChanges: boolean;
}

export function AdminUsersFilters({
  draft,
  onChange,
  onApply,
  onReset,
  isFiltered,
  hasPendingChanges,
}: AdminUsersFiltersProps) {
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="admin-user-search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-user-search"
              value={draft.q}
              onChange={(event) => onChange({ ...draft, q: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Enter") onApply();
              }}
              placeholder="Name or email"
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-user-role">Role</Label>
          <Select
            value={draft.role || ALL_FILTER_VALUE}
            onValueChange={(value) =>
              onChange({ ...draft, role: value === ALL_FILTER_VALUE ? "" : (value ?? "") })
            }
          >
            <SelectTrigger id="admin-user-role" aria-label="Filter by role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All roles</SelectItem>
              {USER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-user-status">Status</Label>
          <Select
            value={draft.status || ALL_FILTER_VALUE}
            onValueChange={(value) =>
              onChange({ ...draft, status: value === ALL_FILTER_VALUE ? "" : (value ?? "") })
            }
          >
            <SelectTrigger id="admin-user-status" aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All statuses</SelectItem>
              {USER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-user-sort">Sort by</Label>
          <Select
            value={draft.sortBy}
            onValueChange={(value) => onChange({ ...draft, sortBy: (value as UserSortBy) ?? "createdAt" })}
          >
            <SelectTrigger id="admin-user-sort" aria-label="Sort users by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {USER_SORT_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {SORT_BY_LABELS[field]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={onApply} disabled={!hasPendingChanges}>
          Apply filters
        </Button>
        <span className="text-xs text-muted-foreground">
          Search matches name or email.
        </span>
      </div>
    </div>
  );
}
