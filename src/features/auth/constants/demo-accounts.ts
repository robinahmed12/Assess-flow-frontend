import { USER_ROLES, type UserRole } from "../types/auth.enums";

export interface DemoAccount {
  role: UserRole;
  label: string;
  email: string;
  password: string;
}

/**
 * Seeded accounts for the one-click demo login on `/login`.
 *
 * Each entry must map to a distinct account, because `/auth/login` identifies a
 * user by email alone and takes the role from the server response — two entries
 * sharing an email cannot surface as two different roles.
 */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    role: USER_ROLES.CANDIDATE,
    label: "Candidate",
    email: "robinchs@yopmail.com",
    password: "Password12",
  },
  {
    role: USER_ROLES.RECRUITER,
    label: "Recruiter",
    email: "robinchs12@yopmail.com",
    password: "Password12",
  },
  {
    role: USER_ROLES.ADMIN,
    label: "Admin",
    email: "admin@assessflow.com",
    password: "Admin@123456",
  },
];

/**
 * Demo credentials are compiled into the client bundle, so the panel is shown in
 * development by default and hidden from production builds unless it is opted
 * into with `NEXT_PUBLIC_DEMO_LOGIN=true`.
 */
export function isDemoLoginEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_DEMO_LOGIN;

  if (flag === "true") return true;
  if (flag === "false") return false;

  return process.env.NODE_ENV !== "production";
}