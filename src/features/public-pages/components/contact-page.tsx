"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  HeadsetIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import { ROUTES } from "@/src/config/routes";
import { LandingHeader } from "@/src/features/landing/components/landing-header";
import { LandingFooter } from "@/src/features/landing/components/landing-footer";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Badge } from "@/src/shared/components/ui/badge";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Inquiry received! Our team will contact you within 24 hours.");
    }, 600);
  };

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
              <EnvelopeSimpleIcon weight="bold" className="size-3.5 text-[#B8621B]" />
              Enterprise Inquiries &amp; Support
            </Badge>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-[#111322] sm:text-6xl sm:leading-tight">
              Let&apos;s talk about your{" "}
              <span className="bg-gradient-to-r from-[#B8621B] via-[#9B5115] to-[#262A56] bg-clip-text text-transparent">
                technical evaluation goals.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5A5D70] sm:text-lg">
              Whether you need volume assessments for enterprise recruiting, custom rubric workflows, or dedicated onboarding, we&apos;re here to help.
            </p>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="border-t border-[#E6DCD0] bg-white/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              {/* Left Column: Direct Info & Channels */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-[#111322] sm:text-3xl">
                    Get in touch with us
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#5A5D70] sm:text-sm">
                    Our technical solutions team responds to all inquiries within one business day.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 rounded-xl border border-[#E6DCD0] bg-white p-4 shadow-sm">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#262A56] text-[#E3CCAE]">
                      <EnvelopeSimpleIcon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#111322]">Sales &amp; Enterprise Demo</p>
                      <p className="text-xs text-[#B8621B] font-medium">sales@assessflow.io</p>
                      <p className="mt-1 text-[11px] text-[#5A5D70]">Custom contracts, SLAs &amp; volume tiers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-xl border border-[#E6DCD0] bg-white p-4 shadow-sm">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#262A56] text-[#E3CCAE]">
                      <HeadsetIcon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#111322]">Candidate &amp; Recruiter Support</p>
                      <p className="text-xs text-[#B8621B] font-medium">support@assessflow.io</p>
                      <p className="mt-1 text-[11px] text-[#5A5D70]">Assessment troubleshooting &amp; account queries</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-xl border border-[#E6DCD0] bg-white p-4 shadow-sm">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#262A56] text-[#E3CCAE]">
                      <MapPinIcon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#111322]">Global Engineering Headquarters</p>
                      <p className="text-xs text-[#5A5D70]">100 Tech Square, San Francisco, CA 94105</p>
                      <p className="mt-1 text-[11px] text-[#5A5D70]">Operating hours: Mon - Fri (24/5 global coverage)</p>
                    </div>
                  </div>
                </div>

                {/* Instant Demo reminder */}
                <div className="rounded-xl border border-[#B8621B]/30 bg-[#B8621B]/5 p-5">
                  <p className="text-xs font-bold text-[#111322]">
                    Prefer to test the software right now?
                  </p>
                  <p className="mt-1 text-xs text-[#5A5D70]">
                    You don&apos;t have to wait for a demo. Explore the Candidate, Recruiter, and Admin portals instantly using our 1-click test personas.
                  </p>
                  <Link
                    href={ROUTES.login}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#B8621B] hover:underline"
                  >
                    <span>Launch 1-Click Interactive Demo</span>
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Demo Request Form */}
              <div className="rounded-2xl border border-[#E6DCD0] bg-white p-7 shadow-xl sm:p-9">
                <h3 className="font-heading text-xl font-bold text-[#111322]">
                  Request an Enterprise Demo
                </h3>
                <p className="mt-1 text-xs text-[#5A5D70]">
                  Fill out the form below to connect directly with our assessment specialists.
                </p>

                {submitted ? (
                  <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                    <CheckCircleIcon className="mx-auto size-10 text-emerald-500" weight="fill" />
                    <h4 className="mt-3 text-base font-bold text-[#111322]">
                      Thank you for reaching out!
                    </h4>
                    <p className="mt-1 text-xs text-[#5A5D70]">
                      We have received your demo request and will be in touch shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-5 rounded-lg border border-[#262A56] px-4 py-2 text-xs font-semibold text-[#262A56] hover:bg-[#FAF8F5]"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-name" className="text-xs font-semibold text-[#111322]">
                          Your Name
                        </Label>
                        <Input
                          id="contact-name"
                          required
                          placeholder="Jordan Rivera"
                          className="h-11 rounded-xl border-[#E6DCD0]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="contact-email" className="text-xs font-semibold text-[#111322]">
                          Work Email
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="jordan@company.com"
                          className="h-11 rounded-xl border-[#E6DCD0]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-company" className="text-xs font-semibold text-[#111322]">
                          Company Name
                        </Label>
                        <Input
                          id="contact-company"
                          required
                          placeholder="Acme Technologies"
                          className="h-11 rounded-xl border-[#E6DCD0]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="contact-size" className="text-xs font-semibold text-[#111322]">
                          Engineering Team Size
                        </Label>
                        <Input
                          id="contact-size"
                          placeholder="e.g. 25-100 engineers"
                          className="h-11 rounded-xl border-[#E6DCD0]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message" className="text-xs font-semibold text-[#111322]">
                        How can we help you?
                      </Label>
                      <Textarea
                        id="contact-message"
                        required
                        placeholder="Tell us about your assessment goals, question types, or hiring timelines..."
                        className="min-h-[110px] rounded-xl border-[#E6DCD0]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 w-full rounded-xl bg-[#B8621B] font-bold text-white shadow-md transition-all hover:bg-[#9B5115]"
                    >
                      {isSubmitting ? "Submitting Inquiry..." : "Submit Demo Request"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
