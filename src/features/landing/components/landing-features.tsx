"use client" 
import {
  BuildingsIcon,
  ChartLineUpIcon,
  UsersIcon,
  type Icon,
} from "@phosphor-icons/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";

type Feature = {
  icon: Icon;
  label: string;
  title: string;
  description: string;
  points: readonly string[];
};

const FEATURES: readonly Feature[] = [
  {
    icon: UsersIcon,
    label: "For Candidates",
    title: "Take assessments with confidence",
    description:
      "Receive invitations by email, answer MCQ, written, and coding questions at your own pace, and submit when ready. Your progress is autosaved so you can resume anytime.",
    points: [
      "MCQ, written & coding question types",
      "Autosave — resume from where you left off",
      "Results shown after recruiter evaluation",
    ],
  },
  {
    icon: BuildingsIcon,
    label: "For Recruiters",
    title: "Build and manage assessments easily",
    description:
      "Create a company problem library, build assessments from your problems, invite active candidates by email, and track every submission from a single view.",
    points: [
      "Problem library with full CRUD",
      "Draft → Publish → Archive lifecycle",
      "Invite candidates with optional expiry",
    ],
  },
  {
    icon: ChartLineUpIcon,
    label: "Smart Evaluation",
    title: "Accurate scoring, every time",
    description:
      "MCQ answers are scored automatically on submission. Written and coding answers go through structured manual scoring. Finalize and notify candidates instantly.",
    points: [
      "Automatic MCQ scoring on submit",
      "Per-answer manual scoring for open answers",
      "Result email sent on finalization",
    ],
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Register & verify",
    description: "Create an account and confirm your email with a one-time code before you get started.",
  },
  {
    step: "02",
    title: "Build or receive an invite",
    description:
      "Recruiters build a problem library and publish assessments. Candidates accept invitations to active assessments.",
  },
  {
    step: "03",
    title: "Attempt & autosave",
    description: "Candidates answer at their own pace — every response is autosaved as they go.",
  },
  {
    step: "04",
    title: "Evaluate & review results",
    description: "MCQs are scored instantly; written and coding answers are scored manually, then finalized.",
  },
] as const;

export function LandingFeatures() {
  return (
    <section aria-labelledby="features-heading" className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 text-center">
          <h2
            id="features-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Everything you need to assess talent
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Purpose-built workflows for candidates, recruiters, and administrators.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.label}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-none bg-primary/10">
                    <feature.icon className="size-4 text-primary" />
                  </span>
                  <p className="text-xs font-semibold tracking-widest text-primary uppercase">{feature.label}</p>
                </div>
                <CardTitle className="mt-3">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" aria-label={`${feature.label} highlights`}>
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 shrink-0 font-semibold text-primary" aria-hidden="true">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20">
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              How it works
            </Badge>
            <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              From registration to results
            </h3>
          </div>

          <div className="grid gap-px overflow-hidden border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((item) => (
              <div key={item.step} className="bg-background p-5">
                <span className="font-heading text-2xl font-semibold text-primary/30">{item.step}</span>
                <h4 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
