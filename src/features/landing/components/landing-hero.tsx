import Link from "next/link";

import { ROUTES } from "@/src/config/routes";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";

export function LandingHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28"
    >
      {/* Label badge */}
      <div className="mb-6 flex justify-center">
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Online Assessment Platform
        </Badge>
      </div>

      {/* Headline */}
      <h1
        id="hero-heading"
        className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
      >
        Hire smarter with{" "}
        <span className="text-primary">structured assessments.</span>
      </h1>

      {/* Sub-headline */}
      <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground sm:text-base">
        AssessFlow is the complete platform for creating assessments, inviting
        candidates, and evaluating results — all in one place.
      </p>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" render={<Link href={ROUTES.register} />}>
          Get started as Candidate
        </Button>
        <Button
          variant="outline"
          size="lg"
          render={<Link href={ROUTES.registerRecruiter} />}
        >
          Post assessments as Recruiter
        </Button>
      </div>

      {/* Sign-in nudge */}
      <p className="mt-6 text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Sign in
        </Link>
      </p>

      {/* Social proof strip */}
      <div className="mt-16 grid grid-cols-3 divide-x divide-border rounded-none border">
        {STATS.map((stat) => (
          <div key={stat.label} className="py-5 text-center">
            <p className="font-heading text-xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STATS = [
  { value: "3 Roles", label: "Candidates, Recruiters & Admins" },
  { value: "MCQ + Written + Coding", label: "Question Types Supported" },
  { value: "Auto + Manual", label: "Evaluation Modes" },
] as const;