"use client";

import {
  BuildingsIcon,
  CheckCircleIcon,
  LightningIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/src/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { Reveal } from "./reveal";

const BENTO_FEATURES = [
  {
    icon: BuildingsIcon,
    tag: "Problem Management",
    title: "Company Problem Library with Full CRUD",
    description:
      "Curate your organization's own question bank. Reuse standardized problems across multiple hiring cycles without rewriting questions.",
    points: [
      "MCQ, open written text, and coding challenges",
      "Draft, Publish, and Archive lifecycle control",
      "Tagging and categorization by seniority",
    ],
    className: "sm:col-span-2 lg:col-span-2",
    accent: "navy",
  },
  {
    icon: LightningIcon,
    tag: "Dual Evaluation",
    title: "Hybrid Scoring Engine",
    description:
      "Multiple-choice questions are auto-scored instantaneously on submission, leaving your evaluators to focus strictly on open-ended answers.",
    points: [
      "Zero-latency auto-grading for MCQs",
      "Structured rubric scoring for written & coding tasks",
      "Instant email notifications on finalization",
    ],
    className: "sm:col-span-1 lg:col-span-1",
    accent: "amber",
  },
  {
    icon: UsersIcon,
    tag: "Candidate Experience",
    title: "Continuous Autosave & Zero-Friction Attempts",
    description:
      "Candidates can focus on demonstrating their skills without worrying about network hiccups or accidental tab closures.",
    points: [
      "Real-time answer persistence to prevent data loss",
      "Clean, distraction-free assessment environment",
      "Clear countdown timers and submission status",
    ],
    className: "sm:col-span-1 lg:col-span-1",
    accent: "amber",
  },
  {
    icon: ShieldCheckIcon,
    tag: "Security & Governance",
    title: "Role-Based Integrity & Audit Logs",
    description:
      "Multi-tenant role boundaries for Candidates, Recruiters, and Admins with email OTP verification and audit trails.",
    points: [
      "One-time password (OTP) email authentication",
      "Time-limited assessment invitation links",
      "Full administrative oversight and audit logs",
    ],
    className: "sm:col-span-2 lg:col-span-2",
    accent: "navy",
  },
] as const;

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Register & Verify",
    description:
      "Create an account and confirm your identity with a one-time verification code.",
  },
  {
    step: "02",
    title: "Build & Invite",
    description:
      "Assemble assessments from your problem library and dispatch secure invitation tokens.",
  },
  {
    step: "03",
    title: "Attempt with Autosave",
    description:
      "Candidates complete MCQs, written answers, and code with real-time continuous autosave.",
  },
  {
    step: "04",
    title: "Evaluate & Notify",
    description:
      "Auto-grade objective questions, review open questions, and release finalized scorecards.",
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="features" aria-labelledby="features-heading" className="border-t border-[#E6DCD0] bg-white/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="mb-14 text-center">
          <Badge
            variant="outline"
            className="border-[#E6DCD0] bg-[#FAF8F5] px-3.5 py-1 text-xs font-semibold text-[#B8621B]"
          >
            Platform Capabilities
          </Badge>
          <h2
            id="features-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#111322] sm:text-4xl"
          >
            Engineered for precision hiring
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#5A5D70] sm:text-base">
            Every layer of AssessFlow is designed to eliminate bias, accelerate
            evaluation timelines, and offer a world-class assessment journey.
          </p>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENTO_FEATURES.map((feature, index) => {
            const isAmber = feature.accent === "amber";
            return (
              <Reveal key={feature.title} delay={index * 100} className={feature.className}>
                <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E6DCD0] bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8621B]/50 hover:shadow-xl hover:shadow-[#262A56]/5">
                  {/* Accent border strip on card top */}
                  <div
                    aria-hidden
                    className={`h-1.5 w-full rounded-t-lg ${
                      isAmber ? "bg-[#B8621B]" : "bg-[#262A56]"
                    }`}
                  />
                  <CardHeader className="pt-5 pb-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex size-10 items-center justify-center rounded-xl ${
                          isAmber ? "bg-[#B8621B]/10 text-[#B8621B]" : "bg-[#262A56] text-[#E3CCAE]"
                        } shadow-sm transition-transform duration-300 group-hover:scale-110`}
                      >
                        <feature.icon className="size-5" weight="bold" />
                      </span>
                      <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#5A5D70] uppercase">
                        {feature.tag}
                      </span>
                    </div>

                    <CardTitle className="mt-4 text-lg font-bold text-[#111322] sm:text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed text-[#5A5D70]">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto pt-2 pb-5">
                    <ul className="space-y-2.5">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-xs font-medium text-[#111322]/80">
                          <CheckCircleIcon
                            className="mt-0.5 size-4 shrink-0 text-[#B8621B]"
                            weight="fill"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* How It Works Pipeline */}
        <div id="how-it-works" className="mt-28 scroll-mt-24">
          <Reveal className="mb-12 text-center">
            <Badge
              variant="outline"
              className="border-[#E6DCD0] bg-[#FAF8F5] px-3.5 py-1 text-xs font-semibold text-[#262A56]"
            >
              How It Works
            </Badge>
            <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-[#111322] sm:text-3xl">
              From registration to finalized scorecards
            </h3>
            <p className="mt-2 text-xs text-[#5A5D70] sm:text-sm">
              Four structured milestones ensuring an effortless hiring journey.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WORKFLOW_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  className="group relative rounded-xl border border-[#E6DCD0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8621B]/40 hover:shadow-md"
                >
                  {/* Step badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#262A56] font-heading text-sm font-bold text-[#E3CCAE] shadow-sm transition-colors group-hover:bg-[#B8621B] group-hover:text-white">
                      {step.step}
                    </span>
                    {idx < WORKFLOW_STEPS.length - 1 ? (
                      <span className="hidden font-mono text-xs text-[#B8621B] lg:inline">
                        ➔
                      </span>
                    ) : null}
                  </div>

                  <h4 className="mt-4 text-base font-bold text-[#111322]">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#5A5D70]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
