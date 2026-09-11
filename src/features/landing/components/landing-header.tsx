"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  CaretDownIcon,
  ChartLineUpIcon,
  FileTextIcon,
  GaugeIcon,
  ListChecksIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  SignOutIcon,
  UsersIcon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { useMe } from "@/src/features/auth/hooks";
import { AUTH_QUERY_KEYS, USER_ROLES, type AuthUser, type UserRole } from "@/src/features/auth/types";
import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import { Button } from "@/src/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
    { label: "Assessments", href: ROUTES.candidateAssessments, icon: ListChecksIcon },
    { label: "My Attempts", href: ROUTES.candidateAttempts, icon: FileTextIcon },
  ],
  [USER_ROLES.RECRUITER]: [
    { label: "Dashboard", href: ROUTES.recruiterDashboard, icon: GaugeIcon },
    { label: "Problems", href: ROUTES.recruiterProblems, icon: FileTextIcon },
    { label: "Assessments", href: ROUTES.recruiterAssessments, icon: ListChecksIcon },
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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts.at(-1)![0]}`.toUpperCase();
}

/** Hover-to-open user menu shown in the header once a session is present. */
function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const links = ROLE_LINKS[user.role] ?? [];

  function handleSignOut() {
    // No logout endpoint is defined yet (see SRS backend blockers), so this
    // only clears the local session cache and sends the user back to login.
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
    window.location.assign(ROUTES.login);
  }

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-2 rounded-none border border-transparent px-1.5 py-1 transition-colors hover:border-border hover:bg-accent"
            />
          }
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-xs font-medium text-foreground sm:inline">
            {user.name.split(" ")[0]}
          </span>
          <CaretDownIcon className="size-3 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-2">
            <span className="text-xs font-medium text-foreground">{user.name}</span>
            <span className="truncate text-[11px] text-muted-foreground">{user.email}</span>
            <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {ROLE_LABEL[user.role]}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {links.map((link) => (
            <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
              <link.icon className="size-4" />
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
    </div>
  );
}

function HeaderAuthSlot() {
  const meQuery = useMe();

  if (meQuery.isLoading) {
    return <div className="size-8 animate-pulse rounded-full bg-muted" aria-hidden="true" />;
  }

  if (meQuery.data) {
    return <UserMenu user={meQuery.data} />;
  }

  return (
    <>
      <Button variant="ghost" size="sm" render={<Link href={ROUTES.login} />}>
        Sign in
      </Button>
      <Button size="sm" render={<Link href={ROUTES.register} />}>
        Get started
      </Button>
    </>
  );
}

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-none bg-primary">
            <ChartLineUpIcon className="size-3.5 text-primary-foreground" weight="bold" />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
            AssessFlow
          </span>
        </Link>

        {/* Nav actions */}
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <HeaderAuthSlot />
        </nav>
      </div>
    </header>
  );
}
