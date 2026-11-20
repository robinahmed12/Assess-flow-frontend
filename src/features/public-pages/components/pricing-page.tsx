"use client";

import Link from "next/link";
import {
  CheckIcon,
  PlusIcon,
  ReceiptIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { LandingHeader } from "@/src/features/landing/components/landing-header";
import { LandingFooter } from "@/src/features/landing/components/landing-footer";
import { buttonVariants } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/src/shared/components/ui/card";
import { cn } from "@/src/shared/utils";

const CREDIT_TIERS = [
  {
    credits: 20,
    price: "$49",
    perTest: "$2.45",
    label: "Starter Pack",
    popular: false,
    description: "Ideal for growing startups hiring for 1 to 2 specialized engineering roles.",
  },
  {
    credits: 50,
    price: "$99",
    perTest: "$1.98",
    label: "Growth Pack",
    popular: true,
    description: "Best for scaling engineering departments with continuous hiring needs.",
  },
  {
    credits: 150,
    price: "$249",
    perTest: "$1.66",
    label: "Scale Pack",
    popular: false,
    description: "High-volume recruitment runs for agencies, universities, and scale-ups.",
  },
];

const PRICING_FAQS = [
  {
    q: "How does credit-based billing work?",
    a: "1 Credit is consumed when a candidate submits an assessment attempt. You only pay for candidate evaluations you actually execute—no monthly recurring subscriptions or idle seat licenses.",
  },
  {
    q: "Do purchased credits ever expire?",
    a: "No. Your credits remain in your organization's wallet indefinitely until used across active candidate invites.",
  },
  {
    q: "Is it completely free for candidates?",
    a: "Yes! Candidates never pay any fee to register, attempt assessments, or inspect their verified scorecards.",
  },
  {
    q: "Can I try the recruiter portal before purchasing credits?",
    a: "Absolutely. The login portal offers a 1-click recruiter demo persona to build problems and inspect grading workflows immediately.",
  },
];

export function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div
            aria-hidden
            className="landing-grid-bg absolute inset-0 -z-10 opacity-60"
          />
          <div
            aria-hidden
            className="landing-hero-glow absolute inset-x-0 -top-32 -z-10 h-96"
          />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <Badge
              variant="outline"
              className="border-[#E6DCD0] bg-white/90 px-3.5 py-1 text-xs font-semibold text-[#B8621B] shadow-sm backdrop-blur-sm"
            >
              <ReceiptIcon weight="bold" className="size-3.5 text-[#B8621B]" />
              Transparent Credit-Based Billing
            </Badge>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-[#111322] sm:text-6xl sm:leading-tight">
              Pay only for the candidates{" "}
              <span className="bg-gradient-to-r from-[#B8621B] via-[#9B5115] to-[#262A56] bg-clip-text text-transparent">
                you actually evaluate.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5A5D70] sm:text-lg">
              No bloated annual contracts. 1 credit = 1 candidate assessment attempt. Free forever for candidates, pay-as-you-go for hiring teams.
            </p>
          </div>
        </section>

        {/* Credit Packs */}
        <section className="border-t border-[#E6DCD0] bg-white/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#111322]">
                Recruiter Credit Packages
              </h2>
              <p className="mt-2 text-sm text-[#5A5D70]">
                Choose the bundle that matches your hiring velocity.
              </p>
            </div>

            <div className="grid items-stretch gap-8 lg:grid-cols-3">
              {CREDIT_TIERS.map((tier) => (
                <Card
                  key={tier.credits}
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5",
                    tier.popular
                      ? "border-2 border-[#B8621B] bg-[#181B38] text-white shadow-2xl shadow-[#262A56]/25"
                      : "border border-[#E6DCD0] bg-white text-[#111322] shadow-sm hover:border-[#B8621B]/40 hover:shadow-lg",
                  )}
                >
                  {tier.popular ? (
                    <Badge className="absolute -top-3.5 right-6 flex items-center gap-1.5 rounded-full bg-[#B8621B] px-3 py-1 text-[11px] font-bold text-white shadow-md">
                      <SparkleIcon weight="fill" className="size-3 text-[#E3CCAE]" />
                      Most Popular Pack
                    </Badge>
                  ) : null}

                  <CardHeader className="p-0 pb-6">
                    <p
                      className={cn(
                        "text-xs font-bold tracking-widest uppercase",
                        tier.popular ? "text-[#E3CCAE]" : "text-[#B8621B]",
                      )}
                    >
                      {tier.label}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-heading text-4xl font-black tracking-tight">
                        {tier.price}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          tier.popular ? "text-white/60" : "text-[#5A5D70]",
                        )}
                      >
                        for {tier.credits} assessment credits
                      </span>
                    </div>

                    <p
                      className={cn(
                        "mt-1 text-xs font-semibold",
                        tier.popular ? "text-[#E3CCAE]" : "text-[#B8621B]",
                      )}
                    >
                      {tier.perTest} per completed evaluation
                    </p>

                    <CardDescription
                      className={cn(
                        "mt-3 text-xs leading-relaxed",
                        tier.popular ? "text-white/70" : "text-[#5A5D70]",
                      )}
                    >
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col justify-between p-0">
                    <div className="border-t border-[#E6DCD0]/40 pt-5">
                      <ul className="space-y-3">
                        {[
                          "Company problem library with CRUD",
                          "Draft → Publish → Archive lifecycle",
                          "Instant auto-scoring for MCQs",
                          "Rubric review for written & coding tasks",
                          "Credits never expire",
                        ].map((feature) => (
                          <li
                            key={feature}
                            className={cn(
                              "flex items-start gap-2.5 text-xs font-medium",
                              tier.popular ? "text-white/90" : "text-[#111322]/80",
                            )}
                          >
                            <CheckIcon
                              className={cn(
                                "mt-0.5 size-4 shrink-0 font-bold",
                                tier.popular ? "text-[#E3CCAE]" : "text-[#B8621B]",
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
                        href={ROUTES.registerRecruiter}
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "w-full justify-center rounded-xl font-bold transition-all",
                          tier.popular
                            ? "bg-[#B8621B] text-white shadow-md hover:bg-[#9B5115] hover:shadow-lg"
                            : "border-2 border-[#262A56] bg-transparent text-[#262A56] hover:bg-[#262A56] hover:text-[#FAF8F5]",
                        )}
                      >
                        Purchase {tier.credits} Credits
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enterprise Callout */}
            <div className="mt-12 rounded-2xl border border-[#E6DCD0] bg-white p-8 shadow-sm text-center sm:p-10">
              <h3 className="font-heading text-2xl font-bold text-[#111322]">
                Need high-volume assessment runs or dedicated onboarding?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs text-[#5A5D70] sm:text-sm">
                We support universities, recruiting agencies, and enterprise talent teams with volume invoicing and custom evaluation SLAs.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href={ROUTES.contact}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-xl bg-[#262A56] font-bold text-[#E3CCAE] hover:bg-[#1a1d3d]",
                  )}
                >
                  Talk with Enterprise Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing FAQs */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#111322]">
                Billing &amp; Credit FAQs
              </h2>
              <p className="mt-2 text-xs text-[#5A5D70]">
                Common questions regarding credits, candidate access, and invoicing.
              </p>
            </div>

            <div className="space-y-3.5">
              {PRICING_FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="faq-details group rounded-xl border border-[#E6DCD0] bg-white transition-all hover:border-[#B8621B]/40 hover:shadow-md"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-sm font-bold text-[#111322] select-none">
                    <span>{faq.q}</span>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] text-[#B8621B]">
                      <PlusIcon className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-45" />
                    </span>
                  </summary>
                  <div className="border-t border-[#E6DCD0]/60 bg-[#FAF8F5]/60 px-6 py-4">
                    <p className="text-xs leading-relaxed text-[#5A5D70]">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
