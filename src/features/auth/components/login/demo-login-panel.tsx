"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Loader2,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/shared/components/ui/button";
import { DEMO_ACCOUNTS, type DemoAccount } from "../../constants/demo-accounts";
import { useLogin } from "../../hooks";
import { loginSchema } from "../../schemas";
import type { UserRole } from "../../types";
import { getRoleRedirect } from "../../utils/role.redirect";

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  CANDIDATE: UserRound,
  RECRUITER: Building2,
  ADMIN: ShieldCheck,
};

export function DemoLoginPanel() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const handleDemoLogin = async (account: DemoAccount) => {
    setPendingRole(account.role);

    try {
      // Parsed through the same schema as the manual form so demo logins cannot
      // drift from the validation real submissions go through.
      const payload = loginSchema.parse({
        email: account.email,
        password: account.password,
      });

      const result = await loginMutation.mutateAsync(payload);

      // The server owns the role, so redirect on what it actually returned. A
      // mismatch means the seeded account is not the role it is labelled as.
      if (result.user.role !== account.role) {
        toast.warning(
          `${account.email} is registered as ${result.user.role.toLowerCase()}, not ${account.label.toLowerCase()}.`,
        );
      }

      router.replace(getRoleRedirect(result.user.role));
    } catch {
      // `useLogin` already raises a toast for API and validation failures.
    } finally {
      setPendingRole(null);
    }
  };

  return (
    <section
      aria-labelledby="demo-login-heading"
      className="space-y-3 rounded-xl border border-dashed bg-muted/40 p-4"
    >
      <div className="space-y-1">
        <h2 id="demo-login-heading" className="text-sm font-semibold">
          Demo Login
        </h2>
        <p className="text-xs text-muted-foreground">
          One click to sign in with a pre-seeded account.
        </p>
      </div>

      <div className="grid gap-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = ROLE_ICONS[account.role];
          const isPending = pendingRole === account.role;

          return (
            <Button
              key={account.role}
              type="button"
              variant="outline"
              className="h-auto w-full justify-start gap-3 py-2.5 text-left"
              disabled={pendingRole !== null}
              onClick={() => void handleDemoLogin(account)}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>

              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{account.label}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {account.email}
                </span>
              </span>

              {isPending ? (
                <Loader2 className="ml-auto size-4 animate-spin" />
              ) : (
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  Sign in
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </section>
  );
}