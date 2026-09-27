import { CandidateResultPage } from "@/src/features/candidate-result";

export default async function Page({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  return <CandidateResultPage attemptId={attemptId} />;
}
