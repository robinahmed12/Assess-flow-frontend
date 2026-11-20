"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import {
  ArrowRightIcon,
  CircleNotchIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { z } from "zod";

import { loginSchema } from "../../schemas";
import { type LoginRequestDto } from "../../types";
import { useLogin } from "../../hooks";
import { getRoleRedirect } from "../../utils/role.redirect";
import { ROUTES } from "@/src/config/routes";
import { isGoogleAuthConfigured } from "@/src/config/env";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";
import { GoogleLoginButton } from "./google-login-button";
import { Separator } from "@/src/shared/components/ui/separator";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unable to sign in. Please verify your credentials and try again.";
}

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies LoginRequestDto,
    onSubmit: async ({ value }) => {
      const payload = loginSchema.parse(value);
      const result = await loginMutation.mutateAsync(payload);
      router.replace(getRoleRedirect(result.user.role));
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      {/* Email Field */}
      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) => {
            const result = loginSchema.shape.email.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name} className="text-xs font-semibold text-[#111322]">
              Email Address
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-[#5A5D70]">
                <EnvelopeIcon className="size-4" />
              </span>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className="h-11 rounded-xl border-[#E6DCD0] bg-white pl-10 text-xs transition-colors focus-visible:border-[#B8621B] focus-visible:ring-[#B8621B]"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
            {field.state.meta.errors.length > 0 ? (
              <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                <WarningCircleIcon className="size-3.5" />
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {/* Password Field */}
      <form.Field
        name="password"
        validators={{
          onBlur: ({ value }) => {
            const result = z
              .string()
              .min(1, "Password is required")
              .safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name} className="text-xs font-semibold text-[#111322]">
                Password
              </Label>
              <Link
                href={ROUTES.forgotPassword}
                className="text-[11px] font-semibold text-[#B8621B] transition-colors hover:text-[#9B5115] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-[#5A5D70]">
                <LockKeyIcon className="size-4" />
              </span>
              <Input
                id={field.name}
                name={field.name}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="h-11 rounded-xl border-[#E6DCD0] bg-white pl-10 pr-10 text-xs transition-colors focus-visible:border-[#B8621B] focus-visible:ring-[#B8621B]"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#5A5D70] transition-colors hover:text-[#111322]"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
            {field.state.meta.errors.length > 0 ? (
              <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                <WarningCircleIcon className="size-3.5" />
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {/* Error Feedback */}
      {loginMutation.isError ? (
        <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/10 text-xs">
          <WarningCircleIcon className="size-4" />
          <AlertDescription>
            {getErrorMessage(loginMutation.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Submit Action */}
      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="h-11 w-full rounded-xl bg-[#B8621B] font-bold text-white shadow-md shadow-[#B8621B]/20 transition-all hover:bg-[#9B5115] hover:shadow-lg"
      >
        {loginMutation.isPending ? (
          <span className="flex items-center gap-2">
            <CircleNotchIcon className="size-4 animate-spin" />
            Authenticating...
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span>Sign in to Dashboard</span>
            <ArrowRightIcon className="size-4" weight="bold" />
          </span>
        )}
      </Button>

      {/* Optional Google SSO */}
      {isGoogleAuthConfigured && (
        <>
          <div className="my-4 flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-[11px] text-[#5A5D70]">OR CONTINUE WITH</span>
            <Separator className="flex-1" />
          </div>

          <GoogleLoginButton />
        </>
      )}
    </form>
  );
}
