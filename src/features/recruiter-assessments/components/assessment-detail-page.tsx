"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, FileText, Mail, Pencil, Trophy } from "lucide-react";

import { useAssessmentDetail } from "../hooks/use-assessment-detail";
import { usePublishAssessment } from "../hooks/use-publish-assessment";
import { useArchiveAssessment } from "../hooks/use-archive-assessment";
import {
  ARCHIVED_STATUS,
  ASSESSMENT_STATUS_LABELS,
  DRAFT_STATUS,
} from "../constants/assessment.constants";

import { Button } from "@/src/shared/components/ui/button";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog";
import { cn } from "@/src/shared/utils";


export function AssessmentDetailPage({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const { data, isLoading, isError, error, refetch, totalPoints } =
    useAssessmentDetail(assessmentId);
  const publish = usePublishAssessment();
  const archive = useArchiveAssessment();
  const [archiveOpen, setArchiveOpen] = useState(false);

  function onPublish() {
    if (!data) return;
    publish.mutate(data.id, {
      onSuccess: () => toast.success("Assessment published"),
      onError: () => toast.error("Could not publish assessment"),
    });
  }

  function onArchive() {
    if (!data) return;
    archive.mutate(data.id, {
      onSuccess: () => {
        setArchiveOpen(false);
        toast.success("Assessment archived");
      },
      onError: () => toast.error("Could not archive assessment"),
    });
  }

  return (
    <main className="mx-auto max-w-4xl">
      <Link
        href="/recruiter/assessments"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All assessments
      </Link>

      {isError ? (
        <LoadError
          message={
            error instanceof Error
              ? error.message
              : "Could not load this assessment."
          }
          onRetry={() => void refetch()}
        />
      ) : isLoading || !data ? (
        <DetailSkeleton />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[180px_1fr]">
          {/* meta ledger */}
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <dl className="divide-y divide-border border-t border-border lg:border-t-0">
              <MetaRow label="Status">
                <StatusMark status={data.status} />
              </MetaRow>
              <MetaRow label="Duration">
                <span className="font-mono text-sm">{data.duration}m</span>
              </MetaRow>
              <MetaRow label="Passing score">
                <span className="font-mono text-sm">
                  {data.passingScore?.toString() ?? "—"}
                </span>
              </MetaRow>
              <MetaRow label="Problems">
                <span className="font-mono text-sm">
                  {data.problems.length}
                </span>
              </MetaRow>
              <MetaRow label="Total points">
                <span className="font-mono text-sm">{totalPoints}</span>
              </MetaRow>
            </dl>
          </aside>

          {/* main column */}
          <div className="space-y-10">
            <div className="space-y-4 border-b border-border pb-6">
              <h1 className="font-serif text-3xl leading-tight tracking-tight">
                {data.title}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {data.description || "No description set."}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
                {data.status === DRAFT_STATUS && (
                  <Button
                    size="sm"
                    disabled={publish.isPending}
                    onClick={onPublish}
                  >
                    {publish.isPending ? "Publishing…" : "Publish"}
                  </Button>
                )}

                <NavAction
                  href={`/recruiter/assessments/${data.id}/edit`}
                  icon={<Pencil className="h-3.5 w-3.5" />}
                  label="Edit"
                />
                <NavAction
                  href={`/recruiter/assessments/${data.id}/invitations`}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Invitations"
                />
                <NavAction
                  href={`/recruiter/assessments/${data.id}/submissions`}
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="Submissions"
                />
                <NavAction
                  href={`/recruiter/assessments/${data.id}/report`}
                  icon={<Trophy className="h-3.5 w-3.5" />}
                  label="Report"
                />

                {data.status !== ARCHIVED_STATUS && (
                  <button
                    type="button"
                    disabled={archive.isPending}
                    onClick={() => setArchiveOpen(true)}
                    className="ml-auto text-sm text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-lg tracking-tight">
                  Problems
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {data.problems.length} · {totalPoints}pts
                </span>
              </div>

              {data.problems.length === 0 ? (
                <p className="border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  No problems attached yet — edit this assessment to add some.
                </p>
              ) : (
                <ol className="divide-y divide-border border-t border-border">
                  {data.problems.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex items-baseline gap-3 py-3"
                    >
                      <span className="w-5 shrink-0 font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="shrink-0 truncate font-medium">
                        {item.problem?.title ?? "Untitled problem"}
                      </span>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {item.problem?.type ?? "—"}
                      </span>

                      <span
                        aria-hidden
                        className="mx-1 flex-1 border-b border-dotted border-border"
                      />

                      <span className="shrink-0 font-mono text-sm tabular-nums">
                        {item.problem?.points ?? 0}pts
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </div>
      )}

      <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              This assessment will be archived and hidden from candidate
              reports.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={archive.isPending}
              onClick={onArchive}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

function StatusMark({ status }: { status: string }) {
  const dot =
    status === ARCHIVED_STATUS
      ? "bg-muted-foreground/50"
      : status === DRAFT_STATUS
        ? "bg-muted-foreground"
        : "bg-primary";

  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {ASSESSMENT_STATUS_LABELS[status as keyof typeof ASSESSMENT_STATUS_LABELS]}
    </span>
  );
}

function NavAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {icon}
      {label}
    </Link>
  );
}

function LoadError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-8 border-l-2 border-destructive py-1 pl-4">
      <p className="font-medium text-destructive">Failed to load assessment</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[180px_1fr]">
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
        <div className="space-y-2 pt-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}