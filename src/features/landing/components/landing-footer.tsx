"use client";

import Link from "next/link";
import { ChartLineUpIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { Separator } from "@/src/shared/components/ui/separator";

const FOOTER_GROUPS = [
  {
    title: "Candidates",
    links: [
      { label: "Create Candidate Account", href: ROUTES.register },
      { label: "Candidate Sign in", href: ROUTES.login },
      { label: "Available Assessments", href: ROUTES.candidateAssessments },
      { label: "Attempt History", href: ROUTES.candidateAttempts },
    ],
  },
  {
    title: "Recruiters",
    links: [
      { label: "Register Company", href: ROUTES.registerRecruiter },
      { label: "Recruiter Dashboard", href: ROUTES.recruiterDashboard },
      { label: "Problem Library", href: ROUTES.recruiterProblems },
      { label: "Manage Assessments", href: ROUTES.recruiterAssessments },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Sign in to Account", href: ROUTES.login },
      { label: "Password Recovery", href: ROUTES.forgotPassword },
      { label: "Platform Overview", href: ROUTES.home },
      { label: "Demo Access", href: ROUTES.login },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-[#E6DCD0]/60 bg-[#12142B] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand & Status */}
          <div className="space-y-4">
            <Link href={ROUTES.home} className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#262A56] ring-1 ring-[#B8621B]/40">
                <ChartLineUpIcon className="size-4.5 text-[#E3CCAE]" weight="bold" />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Assess<span className="text-[#B8621B]">Flow</span>
              </span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-[#E3CCAE]/70">
              The complete platform for creating assessments, inviting candidates, and evaluating results with continuous autosave and hybrid scoring.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-[#E3CCAE]">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Grouped Navigation */}
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={`${group.title} navigation`}>
              <p className="text-xs font-bold tracking-wider text-[#E3CCAE] uppercase">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/70 transition-colors hover:text-[#B8621B]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} AssessFlow Inc. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-white/60">
            <span>Powered by AssessFlow Engine</span>
            <span>•</span>
            <span className="text-[#E3CCAE]">Online Assessment &amp; Recruitment Platform</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
