"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CaretDownIcon,
  ChartLineUpIcon,
  FileTextIcon,
  GaugeIcon,
  ListChecksIcon,
  QuestionIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SparkleIcon,
  UsersIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { useLogout, useMe } from "@/src/features/auth/hooks";
import {
  USER_ROLES,
  type AuthUser,
  type UserRole,
} from "@/src/features/auth/types";
import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import { Button } from "@/src/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu";

type NavLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ROLE_LINKS: Record<UserRole, NavLink[]> = {
  [USER_ROLES.CANDIDATE]: [
    { label: "Dashboard", href: ROUTES.candidateDashboard, icon: GaugeIcon },
    {
      label: "Assessments",
      href: ROUTES.candidateAssessments,
      icon: ListChecksIcon,
    },
    {
      label: "My Attempts",
      href: ROUTES.candidateAttempts,
      icon: FileTextIcon,
    },
  ],
  [USER_ROLES.RECRUITER]: [
    { label: "Dashboard", href: ROUTES.recruiterDashboard, icon: GaugeIcon },
    { label: "Problems", href: ROUTES.recruiterProblems, icon: FileTextIcon },
    {
      label: "Assessments",
      href: ROUTES.recruiterAssessments,
      icon: ListChecksIcon,
    },
    { label: "Company", href: ROUTES.recruiterCompany, icon: ShieldCheckIcon },
    { label: "Billing", href: ROUTES.recruiterBilling, icon: ReceiptIcon },
  ],
  [USER_ROLES.ADMIN]: [
    { label: "Dashboard", href: ROUTES.adminDashboard, icon: GaugeIcon },
    { label: "Users", href: ROUTES.adminUsers, icon: UsersIcon },
    { label: "Audit Logs", href: ROUTES.adminAuditLogs, icon: ShieldCheckIcon },
    { label: "Payments", href: ROUTES.adminPayments, icon: ReceiptIcon },
  ],
};

const ROLE_LABEL: Record<UserRole, string> = {
  [USER_ROLES.CANDIDATE]: "Candidate",
  [USER_ROLES.RECRUITER]: "Recruiter",
  [USER_ROLES.ADMIN]: "Admin",
};

const PUBLIC_NAV: NavLink[] = [
  { label: "Features", href: "#features", icon: ChartLineUpIcon },
  { label: "How it works", href: "#how-it-works", icon: ListChecksIcon },
  { label: "Pricing", href: "#pricing", icon: ReceiptIcon },
  { label: "FAQ", href: "#faq", icon: QuestionIcon },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts.at(-1)![0]}`.toUpperCase();
}

/** Click-to-open user menu shown in the header once a session is present. */
function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const handleSignOut = useLogout();
  const links = ROLE_LINKS[user.role] ?? [];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-2 rounded-full border border-border/80 bg-card px-2 py-1 transition-colors hover:border-[#B8621B]/50 hover:bg-[#F5EFE6]"
          />
        }
      >
        <Avatar size="sm" className="ring-1 ring-[#B8621B]/30">
          <AvatarFallback className="bg-[#262A56] text-[11px] font-semibold text-[#E3CCAE]">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-xs font-medium text-[#111322] sm:inline">
          {user.name.split(" ")[0]}
        </span>
        <CaretDownIcon className="size-3 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56 border-border shadow-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="text-xs font-semibold text-[#111322]">
              {user.name}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {user.email}
            </span>
            <span className="mt-1 w-fit rounded-full bg-[#262A56] px-2 py-0.5 text-[10px] font-medium text-[#E3CCAE]">
              {ROLE_LABEL[user.role]}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {links.map((link) => (
          <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
            <link.icon className="size-4 text-[#B8621B]" />
            {link.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <SignOutIcon className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeaderAuthSlot() {
  const meQuery = useMe();

  if (meQuery.isLoading) {
    return (
      <div
        className="size-8 animate-pulse rounded-full bg-muted"
        aria-hidden="true"
      />
    );
  }

  if (meQuery.data) {
    return <UserMenu user={meQuery.data} />;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs font-medium text-[#262A56] transition-colors hover:bg-[#F3ECE2] hover:text-[#B8621B]"
        render={<Link href={ROUTES.login} />}
      >
        Sign in
      </Button>
      <Button
        size="sm"
        className="bg-[#B8621B] text-xs font-medium text-white shadow-sm transition-all hover:bg-[#9B5115] hover:shadow-md hover:shadow-[#B8621B]/20"
        render={<Link href={ROUTES.register} />}
      >
        <SparkleIcon weight="fill" className="size-3.5 text-[#E3CCAE]" />
        Get started
      </Button>
    </div>
  );
}

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E6DCD0]/80 bg-[#FAF8F5]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href={ROUTES.home} className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#262A56] shadow-sm transition-transform duration-200 group-hover:scale-105">
            <ChartLineUpIcon
              className="size-4.5 text-[#E3CCAE]"
              weight="bold"
            />
          </span>
          <div className="flex flex-col">
            <span className="font-heading text-base font-bold tracking-tight text-[#111322]">
              Assess<span className="text-[#B8621B]">Flow</span>
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          <ul className="hidden items-center gap-1.5 md:flex">
            {PUBLIC_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-[#5A5D70] transition-colors hover:bg-[#F3ECE2] hover:text-[#B8621B]"
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-4 w-px bg-border hidden md:block" />

          <HeaderAuthSlot />
        </nav>
      </div>
    </header>
  );
}
