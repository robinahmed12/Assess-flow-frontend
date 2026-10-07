"use client";

import { PlusIcon } from "@phosphor-icons/react";

import { Badge } from "@/src/shared/components/ui/badge";
import { Reveal } from "./reveal";

const FAQS = [
  {
    question: "How do candidates receive assessments?",
    answer:
      "Recruiters invite candidates by email with an optional expiry. Candidates register, verify their email with a one-time code, and the assessment appears in their dashboard.",
  },
  {
    question: "What question types are supported?",
    answer:
      "Three types: multiple choice (auto-scored), written answers, and coding problems. Written and coding answers go through structured manual scoring.",
  },
  {
    question: "What happens if I lose connection mid-attempt?",
    answer:
      "Every answer is autosaved as you type. You can close the tab and resume from exactly where you left off before the deadline.",
  },
  {
    question: "When do I see my results?",
    answer:
      "MCQ scores are calculated the moment you submit. Written and coding answers are reviewed by the recruiter, and you are emailed as soon as the result is finalized.",
  },
  {
    question: "Can recruiters reuse questions?",
    answer:
      "Yes. Recruiters keep a company problem library and assemble assessments from it, so strong questions are used again instead of rewritten.",
  },
  {
    question: "Is there a demo I can try?",
    answer:
      "The login page ships with one-click demo accounts for candidate, recruiter, and admin roles so you can explore each dashboard instantly.",
  },
] as const;

/** Expandable FAQ list built on native `<details>` elements. */
export function LandingFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t bg-muted/30"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="mb-10 text-center">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            FAQ
          </Badge>
          <h2
            id="faq-heading"
            className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Questions, answered
          </h2>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 80}>
              <details className="faq-details group border bg-card transition-colors hover:border-primary/30">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-foreground select-none">
                  {faq.question}
                  <PlusIcon
                    className="size-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                    aria-hidden
                  />
                </summary>
                <p className="border-t px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
