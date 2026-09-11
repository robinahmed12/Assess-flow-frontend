"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { ROUTES } from "@/src/config/routes";
import { cn } from "@/src/shared/utils";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";
import { Badge } from "@/src/shared/components/ui/badge";
import { Separator } from "@/src/shared/components/ui/separator";

import { recruiterRegisterSchema, otpSchema } from "../../schemas";
import type { VerifyRecruiterOtpRequestDto } from "../../types";
import { useRegisterRecruiter, useVerifyRecruiterOtp } from "../../hooks";

type RecruiterRegisterFormValues = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyLicensePaper: File | null;
  selfDocument: File | null;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4 text-muted-foreground">
      <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 5.5L10 11l6.5-5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4 text-primary">
      <path
        d="M6 3h5.5L15 6.5V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M11 3v3.5H14.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4 text-muted-foreground">
      <path d="M10 13V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6.5 7.5 10 4l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-3.5">
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Two dots showing which stage of registration the person is on. */
function StepTracker({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {[1, 2].map((s) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {s}
          </span>
          <span className={cn("text-[11px] font-medium", step >= s ? "text-foreground" : "text-muted-foreground")}>
            {s === 1 ? "Company & account" : "Verify email"}
          </span>
          {s === 1 ? <span className={cn("h-px flex-1", step >= 2 ? "bg-primary" : "bg-border")} /> : null}
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="rounded-full px-1.5">
        {index}
      </Badge>
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{title}</span>
    </div>
  );
}

type FileFieldProps = {
  id: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onBlur: () => void;
  error?: string;
};

/** Click-to-upload control for a single required PDF, with a preview once selected. */
function PdfFileField({ id, value, onChange, onBlur, error }: FileFieldProps) {
  if (value) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 border px-3 py-2.5",
          error ? "border-destructive/60 bg-destructive/5" : "border-primary/25 bg-primary/5",
        )}
      >
        <FileIcon />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">{value.name}</p>
          <p className="text-[11px] text-muted-foreground">{formatFileSize(value.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="flex size-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
          aria-label="Remove file"
        >
          <XIcon />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 border border-dashed px-3 py-2.5 transition-colors hover:border-primary/50 hover:bg-primary/5",
        error ? "border-destructive/60" : "border-border",
      )}
    >
      <UploadIcon />
      <span className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Click to upload</span> · PDF, up to 5MB
      </span>
      <input
        id={id}
        name={id}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}

export function RecruiterRegisterForm() {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const registerMutation = useRegisterRecruiter();
  const verifyOtpMutation = useVerifyRecruiterOtp();

  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
      companyLicensePaper: null,
      selfDocument: null,
    } as RecruiterRegisterFormValues,
    onSubmit: async ({ value }) => {
      setFormError(null);
      const result = recruiterRegisterSchema.safeParse(value);

      if (!result.success) {
        setFormError(result.error.issues[0]?.message ?? "Please fix the highlighted fields.");
        return;
      }

      await registerMutation.mutateAsync(result.data);
      setRegisteredEmail(result.data.email);
    },
  });

  const otpForm = useForm({
    defaultValues: {
      email: registeredEmail,
      otp: "",
    } satisfies VerifyRecruiterOtpRequestDto,
    onSubmit: async ({ value }) => {
      const payload = otpSchema.parse({ ...value, email: registeredEmail });
      await verifyOtpMutation.mutateAsync(payload);
      router.replace(ROUTES.recruiterDashboard);
    },
  });

  if (registeredEmail) {
    return (
      <div>
        <StepTracker step={2} />

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void otpForm.handleSubmit();
          }}
        >
          <div className="flex items-start gap-2.5 border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-foreground">
            <MailIcon />
            <p>
              We sent a 6-digit code to <span className="font-medium">{registeredEmail}</span>. Enter it below to
              activate your recruiter account.
            </p>
          </div>

          <otpForm.Field
            name="otp"
            validators={{
              onBlur: ({ value }) => {
                const result = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits").safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Verification code</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  maxLength={6}
                  className="h-11 text-center text-base tracking-[0.5em]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </otpForm.Field>

          {verifyOtpMutation.isError ? (
            <Alert variant="destructive">
              <AlertIcon />
              <AlertDescription>{getErrorMessage(verifyOtpMutation.error)}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" disabled={verifyOtpMutation.isPending} className="h-10 w-full">
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify account"}
          </Button>

          <Button type="button" variant="outline" className="h-10 w-full" onClick={() => setRegisteredEmail("")}>
            Use a different email
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <StepTracker step={1} />

      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void registerForm.handleSubmit();
        }}
      >
        <div className="space-y-3">
          <SectionLabel index="1" title="Your account" />

          <registerForm.Field
            name="name"
            validators={{
              onBlur: ({ value }) => {
                const result = recruiterRegisterSchema.shape.name.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Your name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Rivera"
                  className="h-10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </registerForm.Field>

          <registerForm.Field
            name="email"
            validators={{
              onBlur: ({ value }) => {
                const result = recruiterRegisterSchema.shape.email.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Work email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </registerForm.Field>

          <registerForm.Field
            name="password"
            validators={{
              onBlur: ({ value }) => {
                const result = recruiterRegisterSchema.shape.password.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="h-10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </registerForm.Field>
        </div>

        <Separator />

        <div className="space-y-3">
          <SectionLabel index="2" title="Company details" />

          <registerForm.Field
            name="companyName"
            validators={{
              onBlur: ({ value }) => {
                const result = recruiterRegisterSchema.shape.companyName.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Company name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="organization"
                  placeholder="Acme Inc."
                  className="h-10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </registerForm.Field>
        </div>

        <Separator />

        <div className="space-y-3">
          <SectionLabel index="3" title="Verification documents" />

          <registerForm.Field name="companyLicensePaper">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Company license / trade document</Label>
                <PdfFileField
                  id={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </registerForm.Field>

          <registerForm.Field name="selfDocument">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Your identity document</Label>
                <PdfFileField
                  id={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </registerForm.Field>
        </div>

        {formError ? (
          <Alert variant="destructive">
            <AlertIcon />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        {registerMutation.isError ? (
          <Alert variant="destructive">
            <AlertIcon />
            <AlertDescription>{getErrorMessage(registerMutation.error)}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" disabled={registerMutation.isPending} className="h-10 w-full">
          {registerMutation.isPending ? "Submitting..." : "Create recruiter account"}
        </Button>
      </form>
    </div>
  );
}
