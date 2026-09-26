import { AssessmentSubmissionsPage } from "@/src/features/recruiter-assessments";

export default async function Page({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;

  return <AssessmentSubmissionsPage assessmentId={assessmentId} />;
}
