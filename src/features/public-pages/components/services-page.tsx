"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CodeIcon,
  CpuIcon,
  LightningIcon,
  ListChecksIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { LandingHeader } from "@/src/features/landing/components/landing-header";
import { LandingFooter } from "@/src/features/landing/components/landing-footer";
import { buttonVariants } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import { cn } from "@/src/shared/utils";

const SERVICES_DETAILED = [
  {
    icon: ListChecksIcon,
    tag: "Creation & Curation",
    title: "Problem Library & Assessment Builder",
    description:
      "Build a centralized, reusable company problem bank with full CRUD control. Assemble bespoke assessments in minutes without writing questions from scratch.",
    bullets: [
      "Multiple Choice Questions (single & multi-select)",
      "Open-ended written system design and conceptual questions",
      "Algorithmic and practical coding challenges with custom test suites",
      "Draft, Publish, and Archive versioned lifecycles",
    ],
  },
  {
    icon: CodeIcon,
    tag: "Candidate Testing",
    title: "Distraction-Free Coding & Test Environment",
    description:
      "A developer-centric testing workspace with continuous autosave, customizable time limits, and real-time execution feedback.",
    bullets: [
      "In-browser code editor with syntax highlighting",
      "Real-time keystroke autosaving to cloud storage",
      "Live test runner providing instant test vector verification",
      "Seamless resumption if connection drops or tab is refreshed",
    ],
  },
  {
    icon: LightningIcon,
    tag: "Evaluation Engine",
    title: "Hybrid Automated & Rubric Grading",
    description:
      "Zero-latency automated grading for objective questions coupled with structured rubric workflows for engineering hiring committees.",
    bullets: [
      "Instant 100% automated scoring on MCQ submissions",
      "Granular per-question rubric criteria for open answers",
      "Algorithmic runtime and space complexity verification",
      "Automated scorecard release with email notifications",
    ],
  },
  {
    icon: ShieldCheckIcon,
    tag: "Security & Governance",
    title: "Proctoring Integrity & Multi-Tenant Control",
    description:
      "Ensure fairness and security across every evaluation cycle with single-token invitations and comprehensive audit logging.",
    bullets: [
      "Single-use secure assessment token links with optional expiry",
      "One-time passcode (OTP) email verification for candidates",
      "Complete administrative audit logs for compliance oversight",
      "Credit-based billing with zero recurring lock-in",
    ],
  },
];

export function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div
            aria-hidden
            className="landing-grid-bg absolute inset-0 -z-10 opacity-60"
          />
          <div
            aria-hidden
            className="landing-hero-glow absolute inset-x-0 -top-32 -z-10 h-96"
          />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <Badge
              variant="outline"
              className="border-[#E6DCD0] bg-white/90 px-3.5 py-1 text-xs font-semibold text-[#B8621B] shadow-sm backdrop-blur-sm"
            >
              <CpuIcon weight="bold" className="size-3.5 text-[#B8621B]" />
              Platform Services &amp; Capabilities
            </Badge>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-[#111322] sm:text-6xl sm:leading-tight">
              End-to-end technical evaluation{" "}
              <span className="bg-gradient-to-r from-[#B8621B] via-[#9B5115] to-[#262A56] bg-clip-text text-transparent">
                built for high performance.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5A5D70] sm:text-lg">
              From problem bank curation and candidate execution to hybrid grading and report distribution, AssessFlow powers every stage of technical hiring.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="border-t border-[#E6DCD0] bg-white/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {SERVICES_DETAILED.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-[#E6DCD0] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8621B]/40 hover:shadow-xl hover:shadow-[#262A56]/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-[#262A56] text-[#E3CCAE] shadow-sm">
                      <service.icon className="size-6" weight="bold" />
                    </span>
                    <span className="rounded-full bg-[#FAF8F5] px-3 py-1 text-[11px] font-bold tracking-wider text-[#5A5D70] uppercase">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#111322]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#5A5D70] sm:text-sm">
                    {service.description}
                  </p>

                  <div className="mt-6 border-t border-[#E6DCD0]/60 pt-5">
                    <p className="text-[11px] font-bold tracking-wider text-[#B8621B] uppercase">
                      Included Capabilities:
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 text-xs text-[#111322]/85">
                          <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-[#B8621B]" weight="fill" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#181B38] via-[#262A56] to-[#0A0B16] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to deploy structured assessments?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#E3CCAE]/80">
              Start building your problem library or test drive candidate attempt environments today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                href={ROUTES.registerRecruiter}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-xl bg-[#B8621B] font-bold text-white shadow-lg transition-all hover:bg-[#9B5115]",
                )}
              >
                Get Started as Recruiter
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href={ROUTES.contact}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-[#E3CCAE] hover:text-[#E3CCAE]",
                )}
              >
                Request Enterprise Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
