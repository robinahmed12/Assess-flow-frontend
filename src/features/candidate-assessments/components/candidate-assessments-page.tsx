"use client";

import { useCandidateAssessments } from "../hooks/use-candidate-assessments";
import { AssessmentCard } from "./assessment-card";

export function CandidateAssessmentsPage() {
  const { data, isLoading, isError } = useCandidateAssessments();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <div className="h-7 w-40 animate-pulse rounded-none bg-muted" />
        <div className="h-32 animate-pulse rounded-none bg-muted" />
        <div className="h-32 animate-pulse rounded-none bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-none border border-destructive/40 bg-destructive/5 p-6 text-xs text-destructive">
        Failed to load your assessments. Please try again.
      </div>
    );
  }

  const items = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        My Assessments
      </h1>

      {items.length === 0 ? (
        <div className="rounded-none border border-dashed p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No assessments assigned
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            When a recruiter invites you to an assessment, it will appear here.
          </p>
        </div>
      ) : (
        items.map((item) => <AssessmentCard key={item.id} data={item} />)
      )}
    </div>
  );
}
