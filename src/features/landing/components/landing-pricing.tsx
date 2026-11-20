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
import { cn } from "@/src/shared/utils";
import { Reveal } from "./reveal";

const PLANS = [
  {
    name: "Candidate",
    price: "Free",
    period: "forever",
    description: "Take assessments, autosave your responses, and inspect verified outcomes.",
    features: [
      "Unlimited assessment attempts",
      "Continuous autosave on all questions",
      "MCQ, written and coding problem support",
      "Verified scorecards upon evaluation",
    ],
    cta: { label: "Get started free", href: ROUTES.register },
    featured: false,
  },
  {
    name: "Recruiter Pro",
    price: "Pay-as-you-go",
    period: "flexible credits",
    description:
      "Build a company problem library, publish assessments, and evaluate candidates seamlessly.",
    features: [
      "Full CRUD company problem library",
      "Draft → Publish → Archive assessment lifecycle",
      "Direct email invitations with expiry controls",
      "Instant MCQ auto-scoring engine",
      "Granular candidate evaluation dashboards",
    ],
    cta: { label: "Register your company", href: ROUTES.registerRecruiter },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "volume tier",
    description:
      "Designed for scaling universities, recruiting agencies, and enterprise talent teams.",
    features: [
      "All capabilities in Recruiter Pro",
      "High-volume simultaneous assessment runs",
      "Dedicated account onboarding & SLA support",
      "Custom rubric evaluation integrations",
    ],
    cta: { label: "Talk with our team", href: "mailto:sales@assessflow.io" },
    featured: false,
  },
] as const;

export function LandingPricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="border-t border-[#E6DCD0] bg-white/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-14 text-center">
          <Badge
            variant="outline"
            className="border-[#E6DCD0] bg-[#FAF8F5] px-3.5 py-1 text-xs font-semibold text-[#B8621B]"
          >
            Pricing &amp; Access
          </Badge>
          <h2
            id="pricing-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#111322] sm:text-4xl"
          >
            Transparent plans for every hiring stage
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5A5D70]">
            Free for candidates, credit-based for hiring teams, tailored for enterprise scale.
          </p>
        </Reveal>

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          {PLANS.map((plan, index) => {
            const isFeatured = plan.featured;
            return (
              <Reveal key={plan.name} delay={index * 120} className="h-full">
                <Card
                  className={cn(
                    "relative flex h-full flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5",
                    isFeatured
                      ? "border-2 border-[#B8621B] bg-[#181B38] text-white shadow-2xl shadow-[#262A56]/25"
                      : "border border-[#E6DCD0] bg-white text-[#111322] shadow-sm hover:border-[#B8621B]/40 hover:shadow-lg",
                  )}
                >
                  {isFeatured ? (
                    <Badge className="absolute -top-3.5 right-6 flex items-center gap-1.5 rounded-full bg-[#B8621B] px-3 py-1 text-[11px] font-bold text-white shadow-md">
                      <SparkleIcon weight="fill" className="size-3 text-[#E3CCAE]" />
                      Most Popular
                    </Badge>
                  ) : null}

                  <CardHeader className="p-0 pb-6">
                    <p
                      className={cn(
                        "text-xs font-bold tracking-widest uppercase",
                        isFeatured ? "text-[#E3CCAE]" : "text-[#B8621B]",
                      )}
                    >
                      {plan.name}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                        {plan.price}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isFeatured ? "text-white/60" : "text-[#5A5D70]",
                        )}
                      >
                        / {plan.period}
                      </span>
                    </div>
                    <CardDescription
                      className={cn(
                        "mt-3 text-xs leading-relaxed",
                        isFeatured ? "text-white/70" : "text-[#5A5D70]",
                      )}
                    >
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col justify-between p-0">
                    <div className="border-t border-[#E6DCD0]/40 pt-5">
                      <p
                        className={cn(
                          "mb-3 text-[11px] font-bold tracking-wider uppercase",
                          isFeatured ? "text-white/80" : "text-[#5A5D70]",
                        )}
                      >
                        What&apos;s included:
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className={cn(
                              "flex items-start gap-2.5 text-xs font-medium",
                              isFeatured ? "text-white/90" : "text-[#111322]/80",
                            )}
                          >
                            <CheckIcon
                              className={cn(
                                "mt-0.5 size-4 shrink-0 font-bold",
                                isFeatured ? "text-[#E3CCAE]" : "text-[#B8621B]",
                              )}
                              weight="bold"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Link
                        href={plan.cta.href}
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "w-full justify-center rounded-xl font-bold transition-all duration-200",
                          isFeatured
                            ? "bg-[#B8621B] text-white shadow-md hover:bg-[#9B5115] hover:shadow-lg"
                            : "border-2 border-[#262A56] bg-transparent text-[#262A56] hover:bg-[#262A56] hover:text-[#FAF8F5]",
                        )}
                      >
                        {plan.cta.label}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <p className="mt-12 text-center text-xs text-[#5A5D70]">
            Want to test drive the platform first?{" "}
            <Link
              href={ROUTES.login}
              className="font-bold text-[#B8621B] underline underline-offset-4 transition-colors hover:text-[#9B5115]"
            >
              Sign in with 1-click demo accounts
            </Link>{" "}
            for Candidate, Recruiter, and Admin roles.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
