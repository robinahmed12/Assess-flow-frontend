"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  BuildingsIcon,
  CircleNotchIcon,
  ShieldCheckIcon,
  SparkleIcon,
  UserIcon,
  type Icon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import { DEMO_ACCOUNTS, type DemoAccount } from "../../constants/demo-accounts";
import { useLogin } from "../../hooks";
import { loginSchema } from "../../schemas";
import { USER_ROLES, type UserRole } from "../../types";
import { getRoleRedirect } from "../../utils/role.redirect";

const ROLE_META: Record<
  UserRole,
  {
    icon: Icon;
    description: string;
    badge: string;
    accentColor: string;
    bgAccent: string;
  }
> = {
  [USER_ROLES.CANDIDATE]: {
    icon: UserIcon,
    description: "Take assessments, solve coding problems & view auto-scored results",
    badge: "Candidate Sandbox",
    accentColor: "text-[#B8621B]",
    bgAccent: "bg-[#B8621B]/10 hover:border-[#B8621B]/50",
  },
  [USER_ROLES.RECRUITER]: {
    icon: BuildingsIcon,
    description: "Manage problem library, dispatch email invitations & evaluate submissions",
    badge: "Recruiter Portal",
    accentColor: "text-[#262A56]",
    bgAccent: "bg-[#262A56]/5 hover:border-[#262A56]/50",
  },
  [USER_ROLES.ADMIN]: {
    icon: ShieldCheckIcon,
    description: "Inspect audit logs, manage registered users & verify payments",
    badge: "Admin Console",
    accentColor: "text-[#B8621B]",
    bgAccent: "bg-[#B8621B]/10 hover:border-[#B8621B]/50",
  },
};

export function DemoLoginPanel() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const handleDemoLogin = async (account: DemoAccount) => {
    setPendingRole(account.role);

    try {
      const payload = loginSchema.parse({
        email: account.email,
        password: account.password,
      });

      const result = await loginMutation.mutateAsync(payload);

      if (result.user.role !== account.role) {
        toast.warning(
          `${account.email} is registered as ${result.user.role.toLowerCase()}, not ${account.label.toLowerCase()}.`,
        );
      }

      router.replace(getRoleRedirect(result.user.role));
    } catch {
      // `useLogin` already triggers error toasts
    } finally {
      setPendingRole(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#111322]">
          <SparkleIcon weight="fill" className="size-3.5 text-[#B8621B]" />
          Instant Demo Personas
        </span>
        <span className="text-[10px] font-medium text-[#5A5D70]">
          Pre-seeded test accounts
        </span>
      </div>

      <div className="grid gap-2.5">
        {DEMO_ACCOUNTS.map((account) => {
          const meta = ROLE_META[account.role];
          const Icon = meta.icon;
          const isPending = pendingRole === account.role;
          const isAnyPending = pendingRole !== null;

          return (
            <button
              key={account.role}
              type="button"
              disabled={isAnyPending}
              onClick={() => void handleDemoLogin(account)}
              className={`group relative flex w-full items-center gap-3.5 rounded-xl border border-[#E6DCD0] bg-white p-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${meta.bgAccent} disabled:pointer-events-none disabled:opacity-60`}
            >
              {/* Role Icon */}
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E6DCD0] transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className={`size-5 ${meta.accentColor}`} weight="bold" />
              </div>

              {/* Account Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#111322]">
                    {account.label}
                  </span>
                  <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[9px] font-bold text-[#5A5D70] uppercase">
                    {meta.badge}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-[#5A5D70]">
                  {meta.description}
                </p>
              </div>

              {/* Action button / Spinner */}
              <div className="shrink-0 pl-1">
                {isPending ? (
                  <CircleNotchIcon className="size-4 animate-spin text-[#B8621B]" />
                ) : (
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#262A56] transition-colors group-hover:bg-[#B8621B] group-hover:text-white">
                    <ArrowRightIcon className="size-3.5" weight="bold" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
