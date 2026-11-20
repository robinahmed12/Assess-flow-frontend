"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  FileTextIcon,
  LightningIcon,
  ListChecksIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparkleIcon,
  UserCheckIcon,
  UsersIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { buttonVariants } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/utils";
import { Reveal } from "./reveal";

type StudioTab = "candidate" | "recruiter" | "analytics";

export function LandingHero() {
  const [activeTab, setActiveTab] = useState<StudioTab>("candidate");
  const [testOutputStatus, setTestOutputStatus] = useState<"ready" | "running" | "passed">("ready");

  const handleRunTests = () => {
    setTestOutputStatus("running");
    setTimeout(() => {
      setTestOutputStatus("passed");
    }, 600);
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32"
    >
      {/* Background Gradients & Grid */}
      <div
        aria-hidden
        className="landing-grid-bg absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden
        className="landing-hero-glow absolute inset-x-0 -top-40 -z-10 h-[550px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ================= TOP ZONE: Headings & CTAs ================= */}
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6DCD0] bg-white/90 px-4 py-1.5 text-xs font-semibold text-[#262A56] shadow-sm backdrop-blur-md">
              <span className="flex size-2 rounded-full bg-[#B8621B] shadow-[0_0_8px_#B8621B]" />
              <SparkleIcon weight="fill" className="size-3.5 text-[#B8621B]" />
              <span>AssessFlow 2.0</span>
              <span className="text-[#E6DCD0]">•</span>
              <span className="text-[#5A5D70]">The Unified Technical Assessment Engine</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1
              id="hero-heading"
              className="mt-7 font-heading text-4xl font-black tracking-tight text-balance text-[#111322] sm:text-6xl sm:leading-[1.12]"
            >
              Assess technical talent with{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#B8621B] via-[#9B5115] to-[#262A56] bg-clip-text text-transparent">
                  surgical precision.
                </span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-[#B8621B]/40 via-[#B8621B] to-[#262A56]/40"
                />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5A5D70] sm:text-lg">
              Deliver seamless, continuous-autosave coding challenges and MCQs for candidates,
              while empowering engineering leaders with instant auto-scoring, problem libraries,
              and structured rubrics.
            </p>
          </Reveal>

          {/* Dual CTAs & Trust Signals */}
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                href={ROUTES.register}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-12 rounded-xl bg-[#B8621B] px-7 text-sm font-bold text-white shadow-xl shadow-[#B8621B]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9B5115] hover:shadow-2xl hover:shadow-[#B8621B]/35",
                )}
              >
                <span>Take a Test as Candidate</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={ROUTES.registerRecruiter}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                  "h-12 rounded-xl border-2 border-[#262A56] bg-[#262A56] px-7 text-sm font-bold text-[#FAF8F5] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a1d3d] hover:text-[#E3CCAE]",
                )}
              >
                <span>Build Assessment as Recruiter</span>
              </Link>
            </div>
          </Reveal>

          {/* Social Proof Avatars Strip */}
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[#5A5D70]">
              <div className="flex -space-x-2">
                {["RH", "SI", "TA", "MK", "AL"].map((initials, i) => (
                  <span
                    key={initials}
                    className={`flex size-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm ${
                      i % 2 === 0 ? "bg-[#262A56]" : "bg-[#B8621B]"
                    }`}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <span className="font-semibold text-[#111322]">
                1,200+ engineering teams
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-[#5A5D70]">
                <CheckCircleIcon className="size-4 text-[#B8621B]" weight="fill" />
                No credit card required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-[#5A5D70]">
                <CheckCircleIcon className="size-4 text-[#B8621B]" weight="fill" />
                Instant 1-click demo accounts
              </span>
            </div>
          </Reveal>
        </div>

        {/* ================= STAGE ZONE: Interactive Studio Mockup ================= */}
        <Reveal delay={360} className="relative mt-14 sm:mt-20">
          {/* Ambient Glows behind stage */}
          <div
            aria-hidden
            className="absolute -top-10 left-1/2 -z-10 h-72 w-3/4 -translate-x-1/2 rounded-full bg-[#B8621B]/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-10 left-1/3 -z-10 h-72 w-1/2 rounded-full bg-[#262A56]/20 blur-3xl"
          />

          {/* Floating Live Pill 1: Top Right */}
          <div className="animate-float absolute -top-5 right-2 z-20 hidden items-center gap-2 rounded-xl border border-[#E6DCD0] bg-white/95 px-3.5 py-2 shadow-xl backdrop-blur-md md:flex">
            <span className="animate-soft-pulse size-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-[#111322]">Continuous Autosave: Active</span>
            <span className="rounded bg-[#FAF8F5] px-1.5 py-0.5 text-[10px] font-mono text-[#5A5D70]">
              cloud-synced
            </span>
          </div>

          {/* Floating Live Pill 2: Bottom Left */}
          <div className="animate-float absolute -bottom-5 left-2 z-20 hidden items-center gap-2 rounded-xl border border-[#E6DCD0] bg-white/95 px-3.5 py-2 shadow-xl backdrop-blur-md [animation-delay:-2.5s] md:flex">
            <LightningIcon weight="fill" className="size-4 text-[#B8621B]" />
            <span className="text-xs font-bold text-[#111322]">MCQ Auto-Scored in 120ms</span>
          </div>

          {/* Main Studio Frame */}
          <div className="overflow-hidden rounded-2xl border-2 border-[#262A56]/20 bg-[#12142B] text-white shadow-2xl shadow-[#262A56]/30">
            {/* Studio Navigation & Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0A0B16] px-4 py-3">
              {/* macOS style dot indicators */}
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#E3CCAE]/30" />
                <span className="size-3 rounded-full bg-[#E3CCAE]/30" />
                <span className="size-3 rounded-full bg-[#E3CCAE]/30" />
                <span className="ml-2 hidden text-xs font-mono text-white/50 sm:inline">
                  assessflow-studio // v2.0
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("candidate")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all",
                    activeTab === "candidate"
                      ? "bg-[#B8621B] font-bold text-white shadow-sm"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  <CodeIcon className="size-3.5" />
                  <span>Candidate Live Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("recruiter")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all",
                    activeTab === "recruiter"
                      ? "bg-[#262A56] font-bold text-[#E3CCAE] shadow-sm ring-1 ring-[#E3CCAE]/30"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  <UsersIcon className="size-3.5" />
                  <span>Recruiter Scorecard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("analytics")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all",
                    activeTab === "analytics"
                      ? "bg-[#262A56] font-bold text-[#E3CCAE] shadow-sm ring-1 ring-[#E3CCAE]/30"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  <ListChecksIcon className="size-3.5" />
                  <span>Problem Library</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#E3CCAE]">
                <ClockIcon className="size-3.5 text-[#B8621B]" />
                <span>28:14 REMAINING</span>
              </div>
            </div>

            {/* Studio Content Panel: Based on Active Tab */}
            {activeTab === "candidate" && (
              <div className="grid gap-px bg-white/10 lg:grid-cols-[1.1fr_1fr]">
                {/* Left Pane: Question & Code Editor */}
                <div className="bg-[#12142B] p-5 sm:p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="rounded bg-[#B8621B]/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#E3CCAE] uppercase">
                        Problem 02 / 03 • Hard Algorithm
                      </span>
                      <h2 className="mt-2 text-base font-bold text-white sm:text-lg">
                        LRU Cache with O(1) Amortized Complexity
                      </h2>
                    </div>
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      Autosaved 2s ago
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-white/70">
                    Design a data structure that follows the constraints of a{" "}
                    <strong className="text-white">Least Recently Used (LRU) cache</strong>.
                    Implement the <code className="rounded bg-black/40 px-1 py-0.5 text-[#E3CCAE]">LRUCache</code> class
                    with <code className="rounded bg-black/40 px-1 py-0.5 text-[#E3CCAE]">get</code> and{" "}
                    <code className="rounded bg-black/40 px-1 py-0.5 text-[#E3CCAE]">put</code> operations in O(1) time.
                  </p>

                  {/* Code Editor Window */}
                  <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#0A0B16] font-mono text-xs leading-relaxed">
                    <div className="flex items-center justify-between border-b border-white/10 bg-[#161833] px-3.5 py-2 text-[11px] text-white/60">
                      <span>solution.ts</span>
                      <span>TypeScript v5.4</span>
                    </div>

                    <div className="p-4 space-y-1">
                      <div className="text-white/40">{"// Real-time evaluation against 15 hidden test vectors"}</div>
                      <div>
                        <span className="text-[#B8621B] font-bold">class</span>{" "}
                        <span className="text-[#E3CCAE]">LRUCache</span> &lcub;
                      </div>
                      <div className="pl-4">
                        <span className="text-[#B8621B]">private</span>{" "}
                        <span className="text-white/80">capacity: number;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#B8621B]">private</span>{" "}
                        <span className="text-white/80">cache: Map&lt;number, number&gt;;</span>
                      </div>
                      <div className="pl-4 mt-2">
                        <span className="text-emerald-400">get</span>
                        <span className="text-white/80">(key: number): number &lcub;</span>
                      </div>
                      <div className="pl-8 text-white/60">
                        <span className="text-[#B8621B]">if</span> (!this.cache.has(key)) return -1;
                      </div>
                      <div className="pl-8 text-[#E3CCAE]">
                        {"// refresh key order to preserve recency"}
                      </div>
                      <div className="pl-4 text-white/80">&rcub;</div>
                      <div>&rcub;</div>
                    </div>

                    {/* Runner Actions */}
                    <div className="flex items-center justify-between border-t border-white/10 bg-[#161833] px-4 py-2.5">
                      <button
                        type="button"
                        onClick={handleRunTests}
                        className="flex items-center gap-1.5 rounded-lg bg-[#B8621B] px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#9B5115]"
                      >
                        <PlayIcon weight="fill" className="size-3" />
                        <span>Run Test Suite</span>
                      </button>

                      <div className="flex items-center gap-2 text-[11px]">
                        {testOutputStatus === "ready" && (
                          <span className="text-white/50">Ready to execute tests</span>
                        )}
                        {testOutputStatus === "running" && (
                          <span className="text-[#E3CCAE] animate-pulse">Running 15 tests...</span>
                        )}
                        {testOutputStatus === "passed" && (
                          <span className="flex items-center gap-1 font-bold text-emerald-400">
                            <CheckCircleIcon weight="fill" className="size-3.5" />
                            15/15 Tests Passed (42ms)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Question Progress & Multi-Type Evaluation */}
                <div className="flex flex-col justify-between bg-[#181B38] p-5 sm:p-6">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Assessment Checklist (3 Questions)
                    </h3>
                    <p className="mt-1 text-xs text-white/60">
                      Answered responses are locked once submitted.
                    </p>

                    <div className="mt-4 space-y-3">
                      {/* Q1: MCQ */}
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="flex size-6 items-center justify-center rounded bg-[#262A56] text-[#E3CCAE]">
                              <ListChecksIcon className="size-3.5" />
                            </span>
                            <span className="text-xs font-bold text-white">
                              Q1: Next.js Server Components
                            </span>
                          </div>
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            Scored (10/10)
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] text-white/60">
                          Auto-graded instant verification on submit.
                        </p>
                      </div>

                      {/* Q2: Coding Problem (Active) */}
                      <div className="rounded-xl border-2 border-[#B8621B] bg-[#12142B] p-3.5 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="flex size-6 items-center justify-center rounded bg-[#B8621B] text-white">
                              <CodeIcon className="size-3.5" />
                            </span>
                            <span className="text-xs font-bold text-[#E3CCAE]">
                              Q2: LRU Cache Implementation
                            </span>
                          </div>
                          <span className="rounded bg-[#B8621B]/30 px-2 py-0.5 text-[10px] font-bold text-[#E3CCAE]">
                            In Progress
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] text-white/70">
                          Evaluating time complexity &amp; edge cases.
                        </p>
                      </div>

                      {/* Q3: Written System Design */}
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="flex size-6 items-center justify-center rounded bg-[#262A56] text-[#E3CCAE]">
                              <FileTextIcon className="size-3.5" />
                            </span>
                            <span className="text-xs font-bold text-white">
                              Q3: Distributed Event Architecture
                            </span>
                          </div>
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">
                            Draft saved
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] text-white/60">
                          Structured rubric scoring by hiring committee.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submission bar */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-[#0A0B16] p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Total Progress: 66% Completed</span>
                      <span className="font-bold text-[#E3CCAE]">2 of 3 questions</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-2/3 rounded-full bg-[#B8621B]" />
                    </div>
                    <button
                      type="button"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#B8621B] py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#9B5115]"
                    >
                      <span>Submit Attempt for Review</span>
                      <ArrowRightIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "recruiter" && (
              <div className="p-6 bg-[#181B38] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Candidate Submission Review — Senior Fullstack Role
                    </h3>
                    <p className="text-xs text-[#E3CCAE]">
                      Candidate: Sarah Jenkins • Submitted 14 mins ago • Time taken: 42 mins
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                      Recommended: Strong Hire (94/100)
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-[#0A0B16] p-4">
                    <p className="text-xs text-white/50">MCQ Objective Score</p>
                    <p className="mt-1 font-heading text-2xl font-bold text-emerald-400">100%</p>
                    <p className="mt-1 text-[11px] text-[#E3CCAE]">Instant system scoring</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0A0B16] p-4">
                    <p className="text-xs text-white/50">Coding Efficiency</p>
                    <p className="mt-1 font-heading text-2xl font-bold text-[#B8621B]">O(1) Time</p>
                    <p className="mt-1 text-[11px] text-[#E3CCAE]">15/15 test vectors passed</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0A0B16] p-4">
                    <p className="text-xs text-white/50">Rubric Review</p>
                    <p className="mt-1 font-heading text-2xl font-bold text-white">9.2 / 10</p>
                    <p className="mt-1 text-[11px] text-[#E3CCAE]">System design verified</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="p-6 bg-[#181B38] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Company Problem Library (CRUD Repository)
                    </h3>
                    <p className="text-xs text-[#E3CCAE]">
                      Standardize and reuse challenges across multiple job openings.
                    </p>
                  </div>
                  <span className="rounded-lg bg-[#B8621B] px-3 py-1.5 text-xs font-bold text-white">
                    + New Problem
                  </span>
                </div>

                <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0A0B16]">
                  <div className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="font-bold text-white">LRU Cache Implementation</p>
                      <p className="text-[11px] text-white/50">Type: Coding Challenge • Difficulty: Hard • 15 test cases</p>
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Published</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="font-bold text-white">React Concurrency &amp; Server Actions</p>
                      <p className="text-[11px] text-white/50">Type: Multiple Choice • Difficulty: Medium • Auto-scored</p>
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Published</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="font-bold text-white">Microfrontend Shared State Architecture</p>
                      <p className="text-[11px] text-white/50">Type: Written Answer • Difficulty: Senior • Rubric review</p>
                    </div>
                    <span className="rounded bg-[#B8621B]/30 px-2 py-0.5 text-[10px] font-bold text-[#E3CCAE]">Draft</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* ================= BOTTOM TICKER: Key Capabilities ================= */}
        <Reveal delay={420}>
          <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-[#E6DCD0] bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#262A56] text-[#E3CCAE]">
                <LightningIcon className="size-4.5" weight="bold" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#111322]">Instant Auto-Grading</p>
                <p className="text-[10px] text-[#5A5D70]">Zero-latency MCQ scoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#B8621B] text-white">
                <CodeIcon className="size-4.5" weight="bold" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#111322]">Coding IDE &amp; Tests</p>
                <p className="text-[10px] text-[#5A5D70]">Multi-language runtime</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#262A56] text-[#E3CCAE]">
                <ShieldCheckIcon className="size-4.5" weight="bold" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#111322]">Continuous Autosave</p>
                <p className="text-[10px] text-[#5A5D70]">Never lose a keystroke</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#B8621B] text-white">
                <UserCheckIcon className="size-4.5" weight="bold" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#111322]">3 Defined Roles</p>
                <p className="text-[10px] text-[#5A5D70]">Candidates, Recruiters &amp; Admins</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
