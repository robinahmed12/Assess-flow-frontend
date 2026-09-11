import Link from "next/link";

import { ROUTES } from "@/src/config/routes";
import { Separator } from "@/src/shared/components/ui/separator";

const FOOTER_LINKS = [
  { label: "Sign in", href: ROUTES.login },
  { label: "Register as Candidate", href: ROUTES.register },
  { label: "Register as Recruiter", href: ROUTES.registerRecruiter },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {/* Brand */}
          <div className="space-y-1">
            <Link
              href={ROUTES.home}
              className="font-heading text-sm font-semibold tracking-tight text-foreground"
            >
              AssessFlow
            </Link>
            <p className="text-xs text-muted-foreground">
              Online Assessment &amp; Recruitment Platform
            </p>
          </div>

          {/* Quick links */}
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-6" />

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AssessFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}