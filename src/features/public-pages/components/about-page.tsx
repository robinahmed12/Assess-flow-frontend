"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  HandshakeIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TargetIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { LandingHeader } from "@/src/features/landing/components/landing-header";
import { LandingFooter } from "@/src/features/landing/components/landing-footer";
import { buttonVariants } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import { cn } from "@/src/shared/utils";

const CORE_PILLARS = [
  {
    icon: TargetIcon,
    title: "Evidence Over Resumes",
    description:
      "Resumes predict pedigree, not performance. AssessFlow provides objective environments where candidates prove what they can actually solve.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Continuous Autosave & Integrity",
    description:
      "No candidate should ever fail an interview due to an accidental tab closure or Wi-Fi drop. Our platform autosaves state continuously in real-time.",
  },
  {
    icon: HandshakeIcon,
    title: "Fair & Bias-Free Grading",
    description:
      "Automate objective multiple choice questions instantly and standardize written & coding evaluations with structured rubric scoring.",
  },
  {
    icon: LockKeyIcon,
    title: "Enterprise Grade Security",
    description:
      "End-to-end encrypted single-use tokens, email OTP verification, time expirations, and strict role segregation across all tenants.",
  },
];

const LEADERSHIP_TEAM = [
  {
    name: "Alex Vance",
    role: "Founder & Chief Executive Officer",
    background: "Former Engineering VP at cloud scale-up; hiring system researcher.",
    initials: "AV",
  },
  {
    name: "Elena Rostova",
    role: "Head of Product & Assessment Integrity",
    background: "10+ years shaping technical interview algorithms and developer ergonomics.",
    initials: "ER",
  },
  {
    name: "Marcus Chen",
    role: "Principal Infrastructure Architect",
    background: "Pioneered distributed real-time sandbox executors and autosave engines.",
    initials: "MC",
  },
];

export function AboutPage() {
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
              <SparkleIcon weight="fill" className="size-3 text-[#B8621B]" />
              Our Mission &amp; Philosophy
            </Badge>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-[#111322] sm:text-6xl sm:leading-tight">
              We believe great engineering talent is{" "}
              <span className="bg-gradient-to-r from-[#B8621B] via-[#9B5115] to-[#262A56] bg-clip-text text-transparent">
                demonstrated, not claimed.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5A5D70] sm:text-lg">
              AssessFlow was built to replace arbitrary whiteboard trivia and unverified resume keywords with structured, realistic assessment environments. We empower teams to evaluate with surgical precision while giving candidates a frictionless, autosaved testing journey.
            </p>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="border-y border-[#E6DCD0] bg-white/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#111322] sm:text-4xl">
                What drives every line of code we write
              </h2>
              <p className="mt-3 text-sm text-[#5A5D70]">
                Built on four uncompromising principles of assessment integrity.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CORE_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-[#E6DCD0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8621B]/40 hover:shadow-xl hover:shadow-[#262A56]/5"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#262A56] text-[#E3CCAE] shadow-sm">
                    <pillar.icon className="size-5" weight="bold" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[#111322]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#5A5D70]">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership & Story */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <Badge
                  variant="outline"
                  className="border-[#E6DCD0] bg-white px-3.5 py-1 text-xs font-semibold text-[#262A56]"
                >
                  Origin &amp; Architecture
                </Badge>
                <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#111322] sm:text-4xl">
                  Built by engineers who were tired of broken interviews
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#5A5D70]">
                  Over the past decade, technical interviews became either adversarial leetcode marathons disconnected from day-to-day engineering, or disorganized take-home projects plagued by lost answers and ghosted candidate evaluations.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#5A5D70]">
                  AssessFlow unified the entire lifecycle into one high-throughput engine: company problem libraries, real-time code executions, instant objective auto-grading, and structured rubric workflows for engineering hiring committees.
                </p>

                <div className="mt-8 flex items-center gap-6">
                  <div>
                    <p className="font-heading text-3xl font-black text-[#B8621B]">50k+</p>
                    <p className="text-xs text-[#5A5D70]">Assessments completed</p>
                  </div>
                  <div className="h-10 w-px bg-[#E6DCD0]" />
                  <div>
                    <p className="font-heading text-3xl font-black text-[#262A56]">99.8%</p>
                    <p className="text-xs text-[#5A5D70]">Scoring precision rate</p>
                  </div>
                  <div className="h-10 w-px bg-[#E6DCD0]" />
                  <div>
                    <p className="font-heading text-3xl font-black text-[#B8621B]">100%</p>
                    <p className="text-xs text-[#5A5D70]">Autosave persistence</p>
                  </div>
                </div>
              </div>

              {/* Team Cards */}
              <div className="space-y-4">
                {LEADERSHIP_TEAM.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-4 rounded-xl border border-[#E6DCD0] bg-white p-5 shadow-sm transition-all hover:border-[#B8621B]/40"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#262A56] font-heading text-sm font-bold text-[#E3CCAE] shadow-sm">
                      {member.initials}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#111322]">{member.name}</h3>
                      <p className="text-xs font-semibold text-[#B8621B]">{member.role}</p>
                      <p className="mt-1 text-xs text-[#5A5D70]">{member.background}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-br from-[#181B38] via-[#262A56] to-[#0A0B16] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to modernize your technical evaluations?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#E3CCAE]/80">
              Set up your company problem bank today or explore candidate test attempts in our live demo.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                href={ROUTES.registerRecruiter}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-xl bg-[#B8621B] font-bold text-white shadow-lg transition-all hover:bg-[#9B5115]",
                )}
              >
                Register as Recruiter
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href={ROUTES.login}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-[#E3CCAE] hover:text-[#E3CCAE]",
                )}
              >
                Explore Live Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
