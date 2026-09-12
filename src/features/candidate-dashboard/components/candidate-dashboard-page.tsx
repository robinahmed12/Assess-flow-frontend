"use client";

import { useCandidateDashboard } from "../hooks/use-candidate-dashboard";

export function CandidateDashboardPage() {
  const { data, isLoading, error } = useCandidateDashboard();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Failed to load dashboard</div>;

  return (
    <main>
      <h1 className="text-2xl font-bold">Candidate Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card title="Assignments" value={data?.overview?.totalAssignments} />
        <Card title="Attempts" value={data?.overview?.totalAttempts} />
        <Card title="Passed" value={data?.overview?.passedAttempts} />
        <Card title="Average %" value={data?.overview?.averagePercentage} />
      </div>
    </main>
  );
}

function Card({title, value}:{title:string; value?:number}) {
  return (
    <div className="rounded-xl border p-4">
      <p>{title}</p>
      <strong>{value ?? 0}</strong>
    </div>
  );
}
