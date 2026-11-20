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
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#111322]">
          <SparkleIcon weight="fill" className="size-3.5 text-[#B8621B]" />
          Instant Demo Personas
        </span>
        <span className="text-[10px] font-medium text-[#8A8D9F]">
          Pre-seeded test credentials
        </span>
      </div>

      <div className="grid gap-2 sm:gap-2.5">
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
              className={`group relative flex w-full items-start sm:items-center gap-2.5 sm:gap-3 rounded-xl border border-[#E6DCD0] bg-white p-3 sm:p-3.5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${meta.bgAccent} disabled:pointer-events-none disabled:opacity-60`}
            >
              {/* Role Icon */}
              <div
                className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-[#E6DCD0] transition-transform duration-200 group-hover:scale-105"
              >
                <Icon className={`size-4.5 sm:size-5 ${meta.accentColor}`} weight="bold" />
              </div>

              {/* Account Details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                  <span className="text-xs font-bold text-[#111322]">
                    {account.label}
                  </span>
                  <span className="rounded-md bg-[#FAF8F5] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#5A5D70] ring-1 ring-[#E6DCD0]/60">
                    {meta.badge}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#5A5D70] sm:line-clamp-1">
                  {meta.description}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-[#8A8D9F]">
                  <span className="truncate">{account.email}</span>
                </div>
              </div>

              {/* Action button / Spinner */}
              <div className="shrink-0 self-center pl-0.5">
                {isPending ? (
                  <CircleNotchIcon className="size-4 animate-spin text-[#B8621B]" />
                ) : (
                  <span className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#262A56] ring-1 ring-[#E6DCD0]/60 transition-colors group-hover:bg-[#B8621B] group-hover:ring-[#B8621B] group-hover:text-white">
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
