"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCompany } from "../hooks/use-company";
import { useUpdateCompany } from "../hooks/use-update-company";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { cn } from "@/src/shared/utils";


export function CompanyPage() {
  const { data, isLoading } = useCompany();
  const update = useUpdateCompany();

  const [name, setName] = useState("");

  // keep the field in sync once the company loads (or changes underneath us)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data?.name !== undefined) setName(data.name);
  }, [data?.name]);

  const dirty = data !== undefined && name !== data.name;

  function onSave() {
    if (!dirty) return;
    update.mutate(
      { name },
      {
        onSuccess: () => toast.success("Company updated"),
        onError: () => toast.error("Could not update company"),
      }
    );
  }

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl leading-tight tracking-tight">
        Company
      </h1>

      {isLoading || !data ? (
        <PageSkeleton />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[180px_1fr]">
          {/* account ledger */}
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <dl className="divide-y divide-border border-t border-border lg:border-t-0">
              <MetaRow label="Credits">
                <span className="font-mono text-sm">{data.credits ?? 0}</span>
              </MetaRow>
              <MetaRow label="License">
                <DocMark available={Boolean(data.companyLicensePaperUrl)} />
              </MetaRow>
              <MetaRow label="Self document">
                <DocMark available={Boolean(data.selfDocumentUrl)} />
              </MetaRow>
            </dl>
          </aside>

          {/* editable settings */}
          <div className="space-y-6 border-b border-border pb-6">
            <div className="space-y-2">
              <label
                htmlFor="company-name"
                className="text-xs text-muted-foreground"
              >
                Company name
              </label>
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Button
              size="sm"
              disabled={!dirty || update.isPending}
              onClick={onSave}
            >
              {update.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- pieces ---------- */

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 lg:block lg:space-y-1 lg:py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function DocMark({ available }: { available: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          available ? "bg-primary" : "bg-muted-foreground/50"
        )}
      />
      {available ? "Available" : "Not uploaded"}
    </span>
  );
}

function PageSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[180px_1fr]">
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}