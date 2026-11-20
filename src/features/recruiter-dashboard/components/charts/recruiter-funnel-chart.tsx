"use client";

import { useMemo } from "react";
import { CheckCircleIcon, FunnelIcon, UsersIcon } from "@phosphor-icons/react";

interface RecruiterFunnelChartProps {
  totalInvitations: number;
  totalAttempts: number;
  submittedAttempts: number;
  passedAttempts: number;
}

export function RecruiterFunnelChart({
  totalInvitations,
  totalAttempts,
  submittedAttempts,
  passedAttempts,
}: RecruiterFunnelChartProps) {
  const steps = useMemo(() => {
    const safeInvites = Math.max(totalInvitations, 1);

    return [
      {
        label: "Invitations Sent",
        count: totalInvitations,
        percentage: 100,
        color: "bg-[#262A56]", // Royal Navy
        text: "text-[#262A56]",
        ring: "ring-[#262A56]/20",
        description: "Candidate test dispatch",
      },
      {
        label: "Tests Started",
        count: totalAttempts,
        percentage: Math.min(100, Math.round((totalAttempts / safeInvites) * 100)),
        color: "bg-[#5A5D70]", // Slate Navy
        text: "text-[#5A5D70]",
        ring: "ring-[#5A5D70]/20",
        description: "Session initiated by candidate",
      },
      {
        label: "Tests Completed",
        count: submittedAttempts,
        percentage: Math.min(
          100,
          Math.round((submittedAttempts / Math.max(totalAttempts, 1)) * 100),
        ),
        color: "bg-[#C88A4B]", // Sand Amber
        text: "text-[#C88A4B]",
        ring: "ring-[#C88A4B]/20",
        description: "Submitted for evaluation",
      },
      {
        label: "Candidates Passed",
        count: passedAttempts,
        percentage: Math.min(
          100,
          Math.round((passedAttempts / Math.max(submittedAttempts, 1)) * 100),
        ),
        color: "bg-[#B8621B]", // Warm Amber
        text: "text-[#B8621B]",
        ring: "ring-[#B8621B]/20",
        description: "Met or exceeded passing score",
      },
    ];
  }, [totalInvitations, totalAttempts, submittedAttempts, passedAttempts]);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6DCD0]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#262A56] text-[#E3CCAE] shadow-xs">
              <FunnelIcon className="size-4" weight="bold" />
            </span>
            <h3 className="font-heading text-sm font-bold text-[#111322] sm:text-base">
              Candidate Hiring Conversion Funnel
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#5A5D70]">
            Drop-off and qualification velocity across testing stages
          </p>
        </div>

        <span className="rounded-full bg-[#FAF8F5] border border-[#E6DCD0] px-2.5 py-1 text-[11px] font-bold text-[#B8621B]">
          {passedAttempts} Qualified Candidates
        </span>
      </div>

      {/* Funnel Horizontal Steps */}
      <div className="my-auto space-y-4 py-4">
        {steps.map((step, index) => {
          return (
            <div key={step.label} className="group space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#FAF8F5] text-[10px] font-bold text-[#5A5D70] ring-1 ring-[#E6DCD0]">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-[#111322]">{step.label}</span>
                  <span className="hidden sm:inline text-[11px] text-[#8A8D9F]">
                    &bull; {step.description}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="font-extrabold text-[#111322]">{step.count}</span>
                  <span
                    className={`rounded-md bg-[#FAF8F5] px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-[#E6DCD0]/60 ${step.text}`}
                  >
                    {step.percentage}% conversion
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#FAF8F5] ring-1 ring-[#E6DCD0]/60">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${step.color}`}
                  style={{
                    width: `${Math.max(step.percentage, step.count > 0 ? 4 : 0)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E6DCD0]/60 pt-3 text-[11px] text-[#5A5D70]">
        <span className="flex items-center gap-1 font-medium text-emerald-700">
          <CheckCircleIcon className="size-3.5" weight="bold" />
          Overall Qualified Rate:{" "}
          <span className="font-mono font-bold">
            {totalInvitations > 0
              ? `${Math.round((passedAttempts / totalInvitations) * 100)}%`
              : "0%"}
          </span>
        </span>
        <span className="flex items-center gap-1 text-[#8A8D9F]">
          <UsersIcon className="size-3.5" />
          {totalInvitations - totalAttempts} invitations pending response
        </span>
      </div>
    </div>
  );
}
