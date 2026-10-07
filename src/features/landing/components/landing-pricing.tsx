"use client";

import Link from "next/link";
import { CheckIcon, SparkleIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { Badge } from "@/src/shared/components/ui/badge";
import { buttonVariants } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/src/shared/components/ui/card";
import { cn } from "cn";
import { Reveal } from "./reveal";

const PLANS = [
  {
    name: "Candidate",
    price: "Free",
    priceNote: "always",
    description: "Take assessments, autosave answers, and track your results.",
    features: [
      "Unlimited assessment attempts",
      "Autosave & resume anytime",
      "MCQ, written and coding questions",
      "Results as soon as recruiters finalize",
    ],
    cta: { label: "Get started", href: ROUTES.register },
    highlighted: false,
  },
  {
    name: "Recruiter",
    price: "Credit-based",
    priceNote: "pay as you go",
    description:
      "Build a problem library, publish assessments, and invite candidates.",
    features: [
      "Company problem library with CRUD",
      "Draft → Publish → Archive lifecycle",
      "Email invitations with optional expiry",
      "Automatic MCQ scoring & manual review",
      "Full submission & report views",
    ],
    cta: { label: "Register your company", href: ROUTES.registerRecruiter },
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "tailored",
    description:
      "For universities and agencies running assessments at scale.",
    features: [
      "Everything in Recruiter",
      "Volume assessment runs",
      "Dedicated onboarding & support",
      "Custom evaluation workflows",
    ],
    cta: { label: "Talk to our team", href: "mailto:sales@assessflow.io" },
    highlighted: false,
  },
] as const;

/** Three pricing tiers; the middle one is visually highlighted. */
export function LandingPricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="mb-12 text-center">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Pricing
          </Badge>
          <h2
            id="pricing-heading"
            className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Simple plans for every side of hiring
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Free for candidates, pay-as-you-go for recruiters, tailored for
            enterprises.
          </p>
        </Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 120} className="h-full">
              <Card
                className={cn(
                  "relative h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg",
                  plan.highlighted
                    ? "border-primary/40 shadow-md ring-primary/30"
                    : "hover:ring-primary/20",
                )}
              >
                {plan.highlighted ? (
                  <Badge className="absolute top-4 right-4 gap-1 px-2 py-0.5">
                    <SparkleIcon weight="fill" className="size-3" />
                    Popular
                  </Badge>
                ) : null}

                <CardHeader>
                  <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                    {plan.name}
                  </p>
                  <p className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground">
                    {plan.price}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {plan.priceNote}
                  </p>
                  <CardDescription className="mt-3">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6">
                  <ul className="space-y-2.5" aria-label={`${plan.name} includes`}>
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <CheckIcon
                          className="mt-0.5 size-3.5 shrink-0 text-primary"
                          weight="bold"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.cta.href}
                    className={cn(
                      "mt-auto w-full justify-center",
                      buttonVariants({
                        variant: plan.highlighted ? "default" : "outline",
                      }),
                    )}
                  >
                    {plan.cta.label}
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Not sure which fits?{" "}
            <Link
              href={ROUTES.login}
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Sign in
            </Link>{" "}
            and explore the demo accounts on the login page.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
