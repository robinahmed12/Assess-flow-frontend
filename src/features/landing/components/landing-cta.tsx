"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { buttonVariants } from "@/src/shared/components/ui/button";
import { cn } from "cn";
import { Reveal } from "./reveal";

/** Closing call-to-action band with a gradient backdrop. */
export function LandingCta() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden">
      <div className="animate-gradient-pan absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/70" />
      <div
        aria-hidden
        className="animate-float absolute -top-16 -right-16 size-64 rounded-full bg-accent/25 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float absolute -bottom-20 -left-16 size-72 rounded-full bg-primary-foreground/10 blur-3xl [animation-delay:-3s]"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <Reveal>
          <h2
            id="cta-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-4xl"
          >
            Ready to run assessments that actually predict performance?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
            Create a candidate account in a minute, or register your company
            and publish your first assessment today.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.register}
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-background text-foreground hover:bg-background/90",
              )}
            >
              Get started as Candidate
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={ROUTES.registerRecruiter}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
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
