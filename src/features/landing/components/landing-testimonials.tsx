"use client";

import { StarIcon } from "@phosphor-icons/react";

import { Badge } from "@/src/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/src/shared/components/ui/card";
import { Reveal } from "./reveal";

const TESTIMONIALS = [
  {
    quote:
      "We replaced our take-home docs with AssessFlow assessments. Autosave alone stopped the “my answer vanished” emails.",
    name: "Rifat Hasan",
    role: "Engineering Manager, Fintech",
    initials: "RH",
  },
  {
    quote:
      "Problem library plus one-click invites means a new role goes live in minutes, and every submission lands in one view.",
    name: "Sadia Islam",
    role: "Talent Acquisition Lead",
    initials: "SI",
  },
  {
    quote:
      "MCQs score themselves, so review time goes where it belongs — the written and coding answers that actually need judgement.",
    name: "Tanvir Ahmed",
    role: "Recruiter, Dev Agency",
    initials: "TA",
  },
] as const;

/** Social-proof cards with a light hover lift. */
export function LandingTestimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="mb-10 text-center">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Testimonials
          </Badge>
          <h2
            id="testimonials-heading"
            className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Loved by teams that hire with structure
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Real workflows, fewer spreadsheets, faster decisions.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.name} delay={index * 120}>
              <Card className="h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:ring-primary/30">
                <CardHeader>
                  <div
                    className="flex gap-0.5 text-primary"
                    aria-label="5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <StarIcon
                        key={starIndex}
                        weight="fill"
                        className="size-3.5"
                      />
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-5">
                  <blockquote className="text-sm leading-relaxed text-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <footer className="mt-auto flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                    >
                      {item.initials}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </footer>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
