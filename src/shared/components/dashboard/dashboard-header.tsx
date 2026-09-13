"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CaretDownIcon, ListIcon, SignOutIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { useMe } from "@/src/features/auth/hooks";
import { AUTH_QUERY_KEYS } from "@/src/features/auth/types";
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
  SheetTrigger,
} from "@/src/shared/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";
import {
  findActiveNavItem,
  ROLE_LABELS,
  type DashboardRole,
} from "./dashboard-nav";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts.at(-1)![0]}`.toUpperCase();
}

function UserMenu({ role }: { role: DashboardRole }) {
  const [open, setOpen] = useState(false);
  const meQuery = useMe();
  const queryClient = useQueryClient();

  function handleSignOut() {
    // No logout endpoint is defined yet, so this only clears the local
    // session cache and sends the user back to login.
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
    window.location.assign(ROUTES.login);
  }

  if (meQuery.isLoading) {
    return (
      <div
        className="size-8 animate-pulse rounded-full bg-muted"
        aria-hidden="true"
      />
    );
  }

  const user = meQuery.data;
  const displayName = user?.name ?? ROLE_LABELS[role];

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
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-xs font-medium text-foreground sm:inline">
            {displayName.split(" ")[0]}
          </span>
          <CaretDownIcon className="size-3 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-2">
              <span className="text-xs font-medium text-foreground">
                {displayName}
              </span>
              {user?.email ? (
                <span className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </span>
              ) : null}
              <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {ROLE_LABELS[role]}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>

          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <SignOutIcon className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DashboardHeader({ role }: { role: DashboardRole }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeItem = findActiveNavItem(role, pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile nav trigger */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="md:hidden" />
            }
          >
            <ListIcon className="size-4" />
            <span className="sr-only">Open navigation</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <DashboardSidebar
              role={role}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          {activeItem ? (
            <activeItem.icon className="hidden size-4 text-muted-foreground sm:block" />
          ) : null}
          <h2 className="font-heading text-sm font-semibold text-foreground sm:text-base">
            {activeItem?.title ?? "Dashboard"}
          </h2>
        </div>
      </div>

      <nav className="flex items-center gap-2" aria-label="User menu">
        <UserMenu role={role} />
      </nav>
    </header>
  );
}
