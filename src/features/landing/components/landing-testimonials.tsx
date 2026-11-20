"use client";

import { CheckCircleIcon, StarIcon } from "@phosphor-icons/react";

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
      "We replaced informal take-home docs with AssessFlow. The continuous autosave alone completely eliminated panic emails about lost answers.",
    name: "Rifat Hasan",
    role: "Engineering Director",
    company: "Fintech Platform",
    initials: "RH",
  },
  {
    quote:
      "Having our problem library right alongside candidate attempt management saved our recruiting team over 15 hours per hire.",
    name: "Sadia Islam",
    role: "Talent Acquisition Lead",
    company: "Global Scale-up",
    initials: "SI",
  },
  {
    quote:
      "Instant scoring on MCQs combined with a dedicated rubric review for coding challenges gave us the exact precision we needed.",
    name: "Tanvir Ahmed",
    role: "Head of Engineering",
    company: "Dev Studio",
    initials: "TA",
  },
] as const;

export function LandingTestimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-[#E6DCD0] bg-[#FAF8F5] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-14 text-center">
          <Badge
            variant="outline"
            className="border-[#E6DCD0] bg-white px-3.5 py-1 text-xs font-semibold text-[#B8621B]"
          >
            Social Proof
          </Badge>
          <h2
            id="testimonials-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#111322] sm:text-4xl"
          >
            Loved by structured hiring teams
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5A5D70]">
            Read how engineering leads and recruiting directors transformed their hiring funnel.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.name} delay={index * 120} className="h-full">
              <Card className="flex h-full flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B8621B]/40 hover:shadow-xl hover:shadow-[#262A56]/5">
                <CardHeader className="p-0 pb-4">
                  {/* Star Rating */}
                  <div
                    className="flex gap-1 text-[#B8621B]"
                    aria-label="5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <StarIcon
                        key={starIndex}
                        weight="fill"
                        className="size-4"
                      />
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between p-0">
                  <blockquote className="text-sm leading-relaxed text-[#111322]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <footer className="mt-6 flex items-center gap-3 border-t border-[#E6DCD0]/60 pt-4">
                    <span
                      aria-hidden
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#262A56] font-heading text-xs font-bold text-[#E3CCAE] shadow-sm"
                    >
                      {item.initials}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-bold text-[#111322]">
                          {item.name}
                        </p>
                        <CheckCircleIcon
                          className="size-3.5 shrink-0 text-[#B8621B]"
                          weight="fill"
                          aria-label="Verified user"
                        />
                      </div>
                      <p className="truncate text-[11px] text-[#5A5D70]">
                        {item.role} • {item.company}
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
