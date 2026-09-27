import { AttemptWorkspace } from "@/src/features/candidate-attempt";

export default async function Page({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  return <AttemptWorkspace attemptId={attemptId} />;
}
