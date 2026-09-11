"use client";
import Link from "next/link";
import {
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  ListChecksIcon,
  NotePencilIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button, buttonVariants } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/utils";

const STATS = [
  { value: "3 Roles", label: "Candidates, Recruiters & Admins" },
  { value: "MCQ + Written + Coding", label: "Question Types Supported" },
  { value: "Auto + Manual", label: "Evaluation Modes" },
] as const;

const MOCK_QUESTIONS = [
  { icon: ListChecksIcon, label: "Multiple choice", status: "Auto-scored" },
  { icon: NotePencilIcon, label: "Written answer", status: "Pending review" },
  { icon: CodeIcon, label: "Coding problem", status: "Pending review" },
] as const;

/** Decorative, non-functional preview of a candidate's assessment attempt. */
function AssessmentPreviewCard() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-none bg-primary/5 sm:-inset-6"
      />
      <div className="border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            <p className="text-xs font-medium text-foreground">
              Frontend Engineer Assessment
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ClockIcon className="size-3.5" />
            <span>28:14 left</span>
          </div>
        </div>

        <div className="space-y-2 p-4">
          {MOCK_QUESTIONS.map((question) => (
            <div
              key={question.label}
              className="flex items-center justify-between border px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center bg-primary/10">
                  <question.icon className="size-3.5 text-primary" />
                </span>
                <span className="text-xs font-medium text-foreground">
                  {question.label}
                </span>
              </div>
              <span
                className={
                  question.status === "Auto-scored"
                    ? "flex items-center gap-1 text-[11px] font-medium text-primary"
                    : "text-[11px] text-muted-foreground"
                }
              >
                {question.status === "Auto-scored" ? (
                  <CheckCircleIcon className="size-3.5" weight="fill" />
                ) : null}
                {question.status}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
          <p className="text-[11px] text-muted-foreground">
            Autosaved 4 seconds ago
          </p>
          <span className="bg-foreground px-3 py-1.5 text-[11px] font-medium text-background">
            Submit attempt
          </span>
        </div>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        {/* Copy column */}
        <div>
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Online Assessment Platform
          </Badge>

          <h1
            id="hero-heading"
            className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl"
          >
            Hire smarter with{" "}
            <span className="text-primary">structured assessments.</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
            AssessFlow is the complete platform for creating assessments,
            inviting candidates, and evaluating results — all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ROUTES.register}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Get started as Candidate
            </Link>
            <Link
              href={ROUTES.registerRecruiter}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                }),
              )}
            >
              Post assessments as Recruiter
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={ROUTES.login}
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Sign in
            </Link>
          </p>

          <div className="mt-14 grid grid-cols-3 divide-x divide-border rounded-none border">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-2 py-5 text-center">
                <p className="font-heading text-lg font-semibold text-foreground sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative preview column */}
        <div className="hidden lg:block">
          <AssessmentPreviewCard />
        </div>
      </div>
    </section>
  );
}
