"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArticleIcon,
  CaretDownIcon,
  ChartLineUpIcon,
  CpuIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  GaugeIcon,
  HouseIcon,
  InfoIcon,
  ListChecksIcon,
  ListIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SparkleIcon,
  UsersIcon,
  type Icon,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/shared/components/ui/sheet";
import { cn } from "@/src/shared/utils";

type NavLink = {
  label: string;
  href: string;
  icon: Icon;
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

/** Strictly Public Navigation Routes */
const PUBLIC_NAV: NavLink[] = [
  { label: "Home", href: ROUTES.home, icon: HouseIcon },
  { label: "About", href: ROUTES.about, icon: InfoIcon },
  { label: "Services", href: ROUTES.services, icon: CpuIcon },
  { label: "Pricing", href: ROUTES.pricing, icon: ReceiptIcon },
  { label: "Blog", href: ROUTES.blog, icon: ArticleIcon },
  { label: "Contact", href: ROUTES.contact, icon: EnvelopeSimpleIcon },
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
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs font-semibold text-[#262A56] transition-colors hover:bg-[#F3ECE2] hover:text-[#B8621B]"
        render={<Link href={ROUTES.login} />}
      >
        Sign in
      </Button>
      <Button
        size="sm"
        className="hidden sm:inline-flex bg-[#B8621B] text-xs font-bold text-white shadow-sm transition-all hover:bg-[#9B5115] hover:shadow-md hover:shadow-[#B8621B]/20"
        render={<Link href={ROUTES.register} />}
      >
        <SparkleIcon weight="fill" className="size-3.5 text-[#E3CCAE]" />
        Get started
      </Button>
    </div>
  );
}

export function LandingHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meQuery = useMe();
  const handleSignOut = useLogout();
  const user = meQuery.data;

  return (
    <header className="sticky top-0 z-50 border-b border-[#E6DCD0]/80 bg-[#FAF8F5]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href={ROUTES.home} className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#262A56] shadow-sm ring-1 ring-[#B8621B]/40 transition-transform duration-200 group-hover:scale-105">
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

        {/* Navigation bar container */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Public Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main desktop navigation">
            <ul className="flex items-center gap-1">
              {PUBLIC_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-[#B8621B]/15 text-[#B8621B] ring-1 ring-[#B8621B]/30"
                          : "text-[#5A5D70] hover:bg-[#F3ECE2] hover:text-[#B8621B]",
                      )}
                    >
                      <item.icon
                        className={cn("size-3.5", isActive ? "text-[#B8621B]" : "text-[#5A5D70]")}
                        weight={isActive ? "bold" : "regular"}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden h-4 w-px bg-[#E6DCD0] lg:block" />

          {/* Auth slot */}
          <HeaderAuthSlot />

          {/* Mobile Hamburger Menu Drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-[#262A56] hover:bg-[#F3ECE2] hover:text-[#B8621B] lg:hidden"
                  aria-label="Toggle navigation menu"
                />
              }
            >
              <ListIcon className="size-5" weight="bold" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[85vw] max-w-sm flex-col justify-between border-l border-[#E6DCD0] bg-[#FAF8F5] p-0 text-[#111322]"
            >
              <div className="flex flex-col overflow-y-auto">
                <SheetHeader className="border-b border-[#E6DCD0]/80 p-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#262A56] shadow-sm ring-1 ring-[#B8621B]/40">
                      <ChartLineUpIcon
                        className="size-4.5 text-[#E3CCAE]"
                        weight="bold"
                      />
                    </span>
                    <SheetTitle className="font-heading text-base font-bold tracking-tight text-[#111322]">
                      Assess<span className="text-[#B8621B]">Flow</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="px-4 pt-4 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D9F]">
                    Public Navigation
                  </span>
                </div>

                <nav className="flex flex-col gap-1 px-3" aria-label="Mobile navigation">
                  {PUBLIC_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                          isActive
                            ? "bg-[#B8621B]/15 text-[#B8621B] ring-1 ring-[#B8621B]/30"
                            : "text-[#5A5D70] hover:bg-[#F3ECE2] hover:text-[#B8621B]",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={cn(
                              "size-4.5",
                              isActive ? "text-[#B8621B]" : "text-[#5A5D70]",
                            )}
                            weight={isActive ? "bold" : "regular"}
                          />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <span className="size-1.5 rounded-full bg-[#B8621B]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {user && (
                  <div className="mt-4 border-t border-[#E6DCD0]/80 px-3 pt-3">
                    <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A8D9F]">
                      My Workspace ({ROLE_LABEL[user.role]})
                    </div>
                    <div className="flex flex-col gap-1">
                      {(ROLE_LINKS[user.role] ?? []).map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#262A56] hover:bg-[#F3ECE2] hover:text-[#B8621B]"
                        >
                          <link.icon className="size-4 text-[#B8621B]" />
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Drawer Auth Footer */}
              <div className="border-t border-[#E6DCD0] bg-[#F5EFE6]/70 p-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" className="ring-1 ring-[#B8621B]/30">
                        <AvatarFallback className="bg-[#262A56] text-[11px] font-semibold text-[#E3CCAE]">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-xs font-semibold text-[#111322]">
                          {user.name}
                        </span>
                        <span className="truncate text-[11px] text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#262A56] px-2 py-0.5 text-[10px] font-medium text-[#E3CCAE]">
                        {ROLE_LABEL[user.role]}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="w-full justify-center border-destructive/20 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <SignOutIcon className="size-3.5" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-xs font-semibold text-[#262A56] hover:bg-[#EBE2D5]"
                      render={
                        <Link
                          href={ROUTES.login}
                          onClick={() => setMobileOpen(false)}
                        />
                      }
                    >
                      Sign in
                    </Button>
                    <Button
                      size="sm"
                      className="w-full justify-center bg-[#B8621B] text-xs font-bold text-white shadow-sm hover:bg-[#9B5115]"
                      render={
                        <Link
                          href={ROUTES.register}
                          onClick={() => setMobileOpen(false)}
                        />
                      }
                    >
                      <SparkleIcon
                        weight="fill"
                        className="size-3.5 text-[#E3CCAE]"
                      />
                      Get started (Candidate)
                    </Button>
                    <Link
                      href={ROUTES.registerRecruiter}
                      onClick={() => setMobileOpen(false)}
                      className="mt-1 text-center text-[11px] font-medium text-[#8A8D9F] hover:text-[#B8621B] hover:underline"
                    >
                      Looking to hire? Register as Recruiter →
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
