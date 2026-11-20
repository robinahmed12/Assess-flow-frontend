"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  KeyIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StarIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { DemoLoginPanel } from "./demo-login-panel";
import { LoginForm } from "./login-form";
import { cn } from "@/src/shared/utils";

type AuthMode = "demo" | "password";

export function LoginPage() {
  const showDemo = true;
  const [authMode, setAuthMode] = useState<AuthMode>("demo");

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      {/* ================= LEFT SHOWCASE PANEL: Brand, Terminal & Trust ================= */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#12142B] via-[#262A56] to-[#0A0B16] p-12 text-white lg:flex">
        {/* Ambient Glowing Orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[#B8621B]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-0 size-96 rounded-full bg-[#E3CCAE]/10 blur-3xl"
        />

        {/* Top Bar: Brand & Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href={ROUTES.home} className="group flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#262A56] shadow-sm ring-1 ring-[#B8621B]/40 transition-transform group-hover:scale-105">
              <ChartLineUpIcon className="size-5 text-[#E3CCAE]" weight="bold" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              Assess<span className="text-[#B8621B]">Flow</span>
            </span>
          </Link>

          <Link
            href={ROUTES.home}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-[#E3CCAE] backdrop-blur-sm transition-colors hover:border-[#B8621B]/50 hover:bg-white/10"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to homepage</span>
          </Link>
        </div>

        {/* Center: Hero Heading & Live Security Protocol Box */}
        <div className="relative z-10 my-auto space-y-8 py-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#E3CCAE]">
              <SparkleIcon weight="fill" className="size-3 text-[#B8621B]" />
              Enterprise Authentication Portal
            </div>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-balance text-white sm:text-5xl sm:leading-tight">
              Unified access to the future of{" "}
              <span className="bg-gradient-to-r from-[#B8621B] via-[#E3CCAE] to-white bg-clip-text text-transparent">
                technical assessment.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#E3CCAE]/80">
              One secure gateway for candidates solving tests, recruiters curating problem banks,
              and administrators supervising platform operations.
            </p>
          </div>

          {/* Live System Protocol Card */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0B16]/80 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#E3CCAE] uppercase">
                SYSTEM INTEGRITY &amp; PROTOCOL
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <span className="animate-soft-pulse size-1.5 rounded-full bg-emerald-400" />
                Operational
              </span>
            </div>

            <div className="mt-4 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-white/70">
                <span>Encryption Protocol:</span>
                <span className="font-semibold text-white">TLS 1.3 / AES-256</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Data Persistence:</span>
                <span className="font-semibold text-[#E3CCAE]">Real-Time Autosave</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Role Redirection:</span>
                <span className="font-semibold text-[#B8621B]">Dynamic Role-Based</span>
              </div>
            </div>
          </div>

          {/* Social Proof Testimonial */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex gap-1 text-[#B8621B]">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} weight="fill" className="size-3.5" />
              ))}
            </div>
            <p className="mt-2 text-xs italic leading-relaxed text-white/90">
              &ldquo;The single sign-in flow combined with immediate role redirection made onboarding our entire engineering team effortless.&rdquo;
            </p>
            <p className="mt-2 text-[11px] font-bold text-[#E3CCAE]">
              Tanvir Ahmed • Head of Engineering
            </p>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheckIcon className="size-4 text-[#B8621B]" weight="bold" />
            SOC-2 Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <LockKeyIcon className="size-4 text-[#B8621B]" weight="bold" />
            End-to-End Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircleIcon className="size-4 text-[#B8621B]" weight="bold" />
            Zero Data Loss
          </span>
        </div>
      </section>

      {/* ================= RIGHT FORM PANEL: Fast-Track / Password ================= */}
      <section className="flex flex-col justify-center bg-[#FAF8F5] px-3.5 py-8 sm:px-10 sm:py-12 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Header Brand link */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#262A56]">
                <ChartLineUpIcon className="size-4 text-[#E3CCAE]" weight="bold" />
              </span>
              <span className="font-heading text-base font-bold text-[#111322]">
                Assess<span className="text-[#B8621B]">Flow</span>
              </span>
            </Link>
            <Link
              href={ROUTES.home}
              className="text-xs font-semibold text-[#B8621B] hover:underline"
            >
              Back to home
            </Link>
          </div>

          {/* Auth Card */}
          <div className="rounded-2xl border border-[#E6DCD0] bg-white p-4.5 sm:p-8 shadow-xl shadow-[#262A56]/5">
            <div className="space-y-1.5">
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#111322]">
                Sign in to your account
              </h2>
              <p className="text-xs leading-relaxed text-[#5A5D70]">
                Choose an instant demo persona to explore or enter your credentials.
              </p>
            </div>

            {/* Segmented Auth Mode Switcher */}
            {showDemo && (
              <div className="mt-5 flex rounded-xl border border-[#E6DCD0] bg-[#FAF8F5] p-1 text-[11px] sm:text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode("demo")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-lg py-1.5 sm:py-2 transition-all",
                    authMode === "demo"
                      ? "bg-[#262A56] font-bold text-white shadow-xs"
                      : "text-[#5A5D70] hover:text-[#111322]",
                  )}
                >
                  <SparkleIcon weight="fill" className="size-3 sm:size-3.5 text-[#B8621B]" />
                  <span>1-Click Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("password")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-lg py-1.5 sm:py-2 transition-all",
                    authMode === "password"
                      ? "bg-[#B8621B] font-bold text-white shadow-xs"
                      : "text-[#5A5D70] hover:text-[#111322]",
                  )}
                >
                  <KeyIcon weight="bold" className="size-3 sm:size-3.5" />
                  <span>Manual Password</span>
                </button>
              </div>
            )}

            {/* Main Content: Demo or Password */}
            <div className="mt-5 sm:mt-6">
              {authMode === "demo" && showDemo ? (
                <DemoLoginPanel />
              ) : (
                <LoginForm />
              )}
            </div>

            {/* Bottom Alternative Link */}
            {showDemo && (
              <div className="mt-6 pt-5 border-t border-[#E6DCD0]/60 text-center">
                {authMode === "demo" ? (
                  <button
                    type="button"
                    onClick={() => setAuthMode("password")}
                    className="text-xs font-semibold text-[#B8621B] hover:text-[#9B5115] hover:underline"
                  >
                    Want to sign in with email &amp; password instead?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthMode("demo")}
                    className="flex items-center justify-center gap-1.5 mx-auto text-xs font-semibold text-[#262A56] hover:text-[#B8621B]"
                  >
                    <SparkleIcon weight="fill" className="size-3.5 text-[#B8621B]" />
                    <span>Switch back to 1-Click Demo Login</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Registration Navigation */}
          <div className="mt-8 space-y-2 text-center text-xs text-[#5A5D70]">
            <p>
              New Candidate?{" "}
              <Link
                className="font-bold text-[#B8621B] hover:underline"
                href={ROUTES.register}
              >
                Create candidate account
              </Link>
            </p>
            <p>
              Recruiting for a company?{" "}
              <Link
                className="font-bold text-[#262A56] hover:underline"
                href={ROUTES.registerRecruiter}
              >
                Register your company
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
