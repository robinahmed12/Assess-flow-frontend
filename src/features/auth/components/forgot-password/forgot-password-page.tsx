import Link from "next/link";
import { ROUTES } from "@/src/config/routes";
import { ForgotPasswordForm } from "./forgot-password-form";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
      <circle cx="10" cy="10" r="9" className="fill-primary-foreground/15" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HIGHLIGHTS = [
  "We'll email a 6-digit code to confirm it's you",
  "The code expires shortly after it's sent, for your security",
  "Set a new password and sign in right away",
];

export function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Brand / highlights panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-0 size-96 rounded-full bg-black/10 blur-3xl"
        />

        <div className="relative z-10 space-y-1">
          <Link
            href="/"
            className="font-heading text-sm font-semibold tracking-tight"
          >
            AssessFlow
          </Link>
          <p className="text-xs text-primary-foreground/70">Account recovery</p>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="font-heading text-3xl leading-tight font-medium text-balance">
            Let&apos;s get you
            <br />
            back in.
          </h1>

          <ul className="space-y-3.5">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm/relaxed text-primary-foreground/90"
              >
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/60">
          Remembered your password?{" "}
          <Link className="underline underline-offset-2" href={ROUTES.login}>
            Sign in →
          </Link>
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1 lg:hidden">
            <span className="font-heading text-sm font-semibold tracking-tight text-primary">
              AssessFlow
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading text-xl font-medium tracking-tight">
              Reset your password
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your email and we&apos;ll send you a code to reset your
              password.
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="text-center text-xs text-muted-foreground lg:hidden">
            Remembered your password?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={ROUTES.login}
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
