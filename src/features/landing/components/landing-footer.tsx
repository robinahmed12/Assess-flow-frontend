"use client"

import Link from "next/link";
import { ChartLineUpIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { Separator } from "@/src/shared/components/ui/separator";

const FOOTER_GROUPS = [
  {
    title: "Candidates",
    links: [
      { label: "Register as candidate", href: ROUTES.register },
      { label: "Sign in", href: ROUTES.login },
    ],
  },
  {
    title: "Recruiters",
    links: [
      { label: "Register your company", href: ROUTES.registerRecruiter },
      { label: "Sign in", href: ROUTES.login },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Forgot password", href: ROUTES.forgotPassword },
      { label: "Sign in", href: ROUTES.login },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-3">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-none bg-primary">
                <ChartLineUpIcon className="size-3.5 text-primary-foreground" weight="bold" />
              </span>
              <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
                AssessFlow
              </span>
            </Link>
            <p className="max-w-xs text-xs text-muted-foreground">
              The complete platform for creating assessments, inviting candidates, and evaluating
              results — all in one place.
            </p>
          </div>

          {/* Grouped nav */}
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={`${group.title} links`}>
              <p className="text-xs font-semibold text-foreground">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AssessFlow. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Online Assessment &amp; Recruitment Platform</p>
        </div>
      </div>
    </footer>
  );
}
