import { AssessmentAttemptReviewPage } from "@/src/features/recruiter-assessments";

export default async function Page({
  params,
}: {
  params: Promise<{ assessmentId: string; attemptId: string }>;
}) {
  const { assessmentId, attemptId } = await params;

  return (
    <AssessmentAttemptReviewPage
      assessmentId={assessmentId}
      attemptId={attemptId}
    />
  );
}