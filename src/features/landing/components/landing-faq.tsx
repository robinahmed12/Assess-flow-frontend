"use client";

import { PlusIcon } from "@phosphor-icons/react";

import { Badge } from "@/src/shared/components/ui/badge";
import { Reveal } from "./reveal";

const FAQS = [
  {
    question: "How do candidates access an assessment?",
    answer:
      "Recruiters dispatch invitations directly to candidate email addresses. Candidates register or sign in, verify their email with a fast one-time code, and their assigned assessment appears ready on their personal dashboard.",
  },
  {
    question: "What question types can recruiters include in an assessment?",
    answer:
      "AssessFlow supports three distinct question formats: Multiple Choice (with zero-latency auto-grading), Written open-ended answers, and Coding problems evaluated against comprehensive test suites and rubric scoring.",
  },
  {
    question: "What happens if a candidate's internet disconnects mid-test?",
    answer:
      "Every keystroke and answer selection is continuously autosaved to the server in real-time. If connection drops or a tab is closed, candidates can simply reopen their attempt and pick up exactly where they left off before the time limit expires.",
  },
  {
    question: "How and when are candidate scores delivered?",
    answer:
      "Multiple-choice questions are scored automatically the moment an attempt is submitted. For assessments with written or coding questions, recruiters complete rubric reviews in their dashboard, after which an automated email scorecard is released to the candidate.",
  },
  {
    question: "Can recruiters reuse questions across different job openings?",
    answer:
      "Yes. The built-in Problem Library allows you to build a centralized company question repository with full CRUD control, categorizing questions by difficulty and tech stack to compose new assessments in seconds.",
  },
  {
    question: "Is there an instant demo available?",
    answer:
      "Yes! The sign-in page features pre-configured one-click demo credentials for Candidate, Recruiter, and Administrator personas, allowing you to experience every workflow instantly without creating mock data.",
  },
] as const;

export function LandingFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t border-[#E6DCD0] bg-[#FAF8F5] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="mb-14 text-center">
          <Badge
            variant="outline"
            className="border-[#E6DCD0] bg-white px-3.5 py-1 text-xs font-semibold text-[#B8621B]"
          >
            Frequently Asked Questions
          </Badge>
          <h2
            id="faq-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#111322] sm:text-4xl"
          >
            Everything you need to know
          </h2>
          <p className="mt-3 text-sm text-[#5A5D70]">
            Have questions about workflows, scoring, or candidate security?
          </p>
        </Reveal>

        <div className="space-y-3.5">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 60}>
              <details className="faq-details group rounded-xl border border-[#E6DCD0] bg-white transition-all hover:border-[#B8621B]/40 hover:shadow-md">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-sm font-bold text-[#111322] select-none">
                  <span>{faq.question}</span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] text-[#B8621B] transition-colors group-hover:bg-[#B8621B]/10">
                    <PlusIcon
                      className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
                      aria-hidden
                    />
                  </span>
                </summary>
                <div className="border-t border-[#E6DCD0]/60 bg-[#FAF8F5]/60 px-6 py-4">
                  <p className="text-xs leading-relaxed text-[#5A5D70]">
                    {faq.answer}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
