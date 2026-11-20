"use client";

import Link from "next/link";
import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { buttonVariants } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/utils";
import { Reveal } from "./reveal";

export function LandingCta() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-gradient-to-br from-[#181B38] via-[#262A56] to-[#0A0B16] py-24 text-white sm:py-32">
      {/* Decorative ambient glowing orbs */}
      <div
        aria-hidden
        className="animate-float absolute -top-20 -right-20 size-80 rounded-full bg-[#B8621B]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float absolute -bottom-24 -left-20 size-80 rounded-full bg-[#E3CCAE]/15 blur-3xl [animation-delay:-3s]"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#E3CCAE] backdrop-blur-sm">
            <SparkleIcon weight="fill" className="size-3.5 text-[#B8621B]" />
            Accelerate your technical hiring funnel today
          </div>

          <h2
            id="cta-heading"
            className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-balance text-white sm:text-5xl"
          >
            Ready to assess candidate skills with precision?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#E3CCAE]/80 sm:text-base">
            Join hundreds of teams running automated, cheat-resistant, and continuous-autosave assessments.
            Start free as a candidate or set up your company problem bank now.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={ROUTES.register}
              className={cn(
                buttonVariants({ size: "lg" }),
                "group rounded-xl bg-[#B8621B] px-8 text-sm font-bold text-white shadow-xl shadow-[#B8621B]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9B5115] hover:shadow-2xl hover:shadow-[#B8621B]/40",
              )}
            >
              <span>Get started as Candidate</span>
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={ROUTES.registerRecruiter}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl border border-white/20 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E3CCAE] hover:bg-white/10 hover:text-[#E3CCAE]",
              )}
            >
              Post assessments as Recruiter
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
