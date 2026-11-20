"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  CodeIcon,
  ShieldCheckIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { RegisterForm } from "./register-form";

const CANDIDATE_BENEFITS = [
  {
    title: "Real Technical Challenges",
    description: "Take assessments designed with real MCQ, written, and coding scenarios.",
  },
  {
    title: "Continuous Autosave",
    description: "Never lose a keystroke. If connection drops, resume right where you left off.",
  },
  {
    title: "Transparent Feedback",
    description: "Instant scores on MCQs and verified recruiter rubric reviews.",
  },
  {
    title: "100% Free for Candidates",
    description: "Unlimited assessment attempts with zero hidden costs or fees.",
  },
];

export function RegisterPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      {/* ================= LEFT SHOWCASE PANEL: Candidate Value & Live Mock ================= */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#12142B] via-[#262A56] to-[#0A0B16] p-12 text-white lg:flex">
        {/* Ambient Glowing Orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[#B8621B]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-0 size-96 rounded-full bg-[#E3CCAE]/10 blur-3xl"
        />

        {/* Top Bar: Brand & Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href={ROUTES.home} className="group flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#262A56] shadow-sm ring-1 ring-[#B8621B]/40 transition-transform group-hover:scale-105">
              <ChartLineUpIcon className="size-5 text-[#E3CCAE]" weight="bold" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              Assess<span className="text-[#B8621B]">Flow</span>
            </span>
          </Link>

          <Link
            href={ROUTES.home}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-[#E3CCAE] backdrop-blur-sm transition-colors hover:border-[#B8621B]/50 hover:bg-white/10"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to homepage</span>
          </Link>
        </div>

        {/* Center Content: Headline & Benefits */}
        <div className="relative z-10 my-auto space-y-8 py-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#E3CCAE]">
              <SparkleIcon weight="fill" className="size-3 text-[#B8621B]" />
              Candidate Assessment Portal
            </div>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-balance text-white sm:text-5xl sm:leading-tight">
              Show what you can build,{" "}
              <span className="bg-gradient-to-r from-[#B8621B] via-[#E3CCAE] to-white bg-clip-text text-transparent">
                not just what&apos;s on paper.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#E3CCAE]/80">
              Join thousands of engineers taking fair, structured assessments.
              Verify your email via one-time passcode and start solving tests right away.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {CANDIDATE_BENEFITS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-[#0A0B16]/80 p-4 shadow-sm backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 shrink-0 text-[#B8621B]" weight="fill" />
                  <p className="text-xs font-bold text-white">{item.title}</p>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#E3CCAE]/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Live Preview Snippet Card */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <CodeIcon className="size-4 text-[#B8621B]" />
                Interactive Evaluation Environment
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Continuous Autosave
              </span>
            </div>
            <p className="mt-2 text-xs text-white/70">
              MCQ questions are scored immediately upon submission; coding solutions are evaluated against hidden test suites.
            </p>
          </div>
        </div>

        {/* Bottom Switcher: Looking for recruiter */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <ShieldCheckIcon className="size-4 text-[#B8621B]" weight="bold" />
            Verified Email OTP Security
          </span>
          <Link
            href={ROUTES.registerRecruiter}
            className="font-semibold text-[#E3CCAE] hover:text-white hover:underline"
          >
            Hiring engineers? Register company ➔
          </Link>
        </div>
      </section>

      {/* ================= RIGHT FORM PANEL: Candidate Form ================= */}
      <section className="flex flex-col justify-center bg-[#FAF8F5] px-4 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Header Link */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#262A56]">
                <ChartLineUpIcon className="size-4 text-[#E3CCAE]" weight="bold" />
              </span>
              <span className="font-heading text-base font-bold text-[#111322]">
                Assess<span className="text-[#B8621B]">Flow</span>
              </span>
            </Link>
            <Link
              href={ROUTES.login}
              className="text-xs font-semibold text-[#B8621B] hover:underline"
            >
              Sign in
            </Link>
          </div>

          {/* Registration Card */}
          <div className="rounded-2xl border border-[#E6DCD0] bg-white p-7 shadow-xl shadow-[#262A56]/5 sm:p-9">
            <div className="space-y-1.5">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[#111322]">
                Create Candidate Account
              </h2>
              <p className="text-xs leading-relaxed text-[#5A5D70]">
                Register with your email, then verify with the OTP code we send you.
              </p>
            </div>

            <div className="mt-6">
              <RegisterForm />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 space-y-2 text-center text-xs text-[#5A5D70]">
            <p>
              Already have an account?{" "}
              <Link
                className="font-bold text-[#B8621B] hover:underline"
                href={ROUTES.login}
              >
                Sign in to your dashboard
              </Link>
            </p>
            <p>
              Hiring instead?{" "}
              <Link
                className="font-bold text-[#262A56] hover:underline"
                href={ROUTES.registerRecruiter}
              >
                Register your company
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
