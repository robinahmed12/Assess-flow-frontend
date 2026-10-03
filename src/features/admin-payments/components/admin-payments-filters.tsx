"use client";

import { Building2, X } from "lucide-react";

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
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUSES,
} from "../constants/admin-payment.constants";

export interface AdminPaymentsFiltersProps {
  draft: {
    status: string;
    companyId: string;
  };
  onChange: (next: AdminPaymentsFiltersProps["draft"]) => void;
  onApply: () => void;
  onReset: () => void;
  isFiltered: boolean;
  hasPendingChanges: boolean;
  companyIdError?: string;
}

export function AdminPaymentsFilters({
  draft,
  onChange,
  onApply,
  onReset,
  isFiltered,
  hasPendingChanges,
  companyIdError,
}: AdminPaymentsFiltersProps) {
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="admin-payment-status">Status</Label>
          <Select
            value={draft.status || ALL_FILTER_VALUE}
            onValueChange={(value) =>
              onChange({
                ...draft,
                status: value === ALL_FILTER_VALUE ? "" : (value ?? ""),
              })
            }
          >
            <SelectTrigger id="admin-payment-status" aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All statuses</SelectItem>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {PAYMENT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-payment-company">Company ID</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-payment-company"
              value={draft.companyId}
              onChange={(event) => onChange({ ...draft, companyId: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Enter") onApply();
              }}
              placeholder="Company UUID"
              className="pl-8"
              aria-invalid={companyIdError ? true : undefined}
              aria-describedby={companyIdError ? "admin-payment-company-error" : undefined}
            />
          </div>

          {companyIdError && (
            <p id="admin-payment-company-error" className="text-xs text-destructive">
              {companyIdError}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          onClick={onApply}
          disabled={!hasPendingChanges || Boolean(companyIdError)}
        >
          Apply filters
        </Button>
        <span className="text-xs text-muted-foreground">
          Payments are sorted by date; use the order control to reverse.
        </span>
      </div>
    </div>
  );
}
