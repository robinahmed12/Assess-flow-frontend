# AssessFlow — Online Assessment & Recruitment Platform

![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=flat-square&logo=tailwindcss)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-Commercial-yellow?style=flat-square)

A full-stack, role-based **online assessment and recruitment platform** that lets companies
create assessments, invite and evaluate candidates, and manage credit-based billing.

> **Live Preview:** [https://assess-flow-frontend.vercel.app/](https://assess-flow-frontend.vercel.app/)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication & Sessions](#authentication--sessions)
- [Workflows](#workflows)
- [Assessment System](#assessment-system)
- [Evaluation System](#evaluation-system)
- [Payment System](#payment-system)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance & UX](#performance--ux)
- [Security](#security)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Project Overview

AssessFlow connects three audiences in one recruitment loop:

- **Recruiters** build a problem library, publish assessments, invite candidates, and evaluate
  submissions.
- **Candidates** receive invitations, take assessments (MCQ, written, coding), and view results.
- **Admins** monitor users, audit activity, and payments.

This repository contains the **frontend application** (Next.js App Router). It is a modern,
type-safe SPA-style client that talks to a separate REST API service (Node.js/Express/Prisma).

### Highlights

- Role-based routing with server-side + client-side guards.
- JWT session stored in an HTTP cookie; auto-cleared on logout.
- Global route-change progress loader + per-route loading states.
- TanStack Query for caching, retries (disabled by default), and stale-time control.
- Autosave queue for in-progress assessment attempts.
- Fully responsive, animated landing page with reduced-motion support.
- End-to-end tests with Playwright (Chromium).

---

## Features

### Authentication

- Email/password registration & login.
- Google OAuth (optional — enabled only when configured).
- OTP verification for new registrations.
- Password recovery flow.
- Role-based access control (`CANDIDATE`, `RECRUITER`, `ADMIN`).

### Candidate

- Personal dashboard with assigned assessments.
- Start, resume, and submit assessment attempts.
- MCQ, written, and coding question types.
- Autosave answers with an offline queue.
- View final results per attempt.

### Recruiter

- Company profile management.
- Problem library (create, archive, reuse).
- Assessment builder (create, publish, update, archive).
- Invite candidates by email.
- Review and manually evaluate submissions.
- Finalize evaluations and publish results.
- Per-assessment reports.
- Credit-based billing & payment history.

### Admin

- Platform-wide analytics dashboard.
- User management and status control.
- Audit log monitoring.
- Payment monitoring.

---

## User Roles

| Role        | Register | Take assessments | Manage problems | Manage assessments | Evaluate | Billing | Admin tools |
| ----------- | :------: | :--------------: | :-------------: | :----------------: | :------: | :-----: | :---------: |
| CANDIDATE   |    ✅    |        ✅        |       ❌        |         ❌         |    ❌    |   ❌    |     ❌      |
| RECRUITER   |    ✅    |        ❌        |       ✅        |         ✅         |    ✅    |   ✅    |     ❌      |
| ADMIN       |    ❌    |        ❌        |       ❌        |         ❌         |    ❌    |   ❌    |     ✅      |

---

## Technology Stack

### Frontend (this repo)

- **Framework:** Next.js 16 (App Router, Turbopack) · React 19
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4 · tw-animate-css · CSS variables
- **UI:** Base UI · shadcn/ui conventions · Phosphor Icons · Lucide Icons
- **Data fetching:** TanStack Query v5 (cache/stale-time management) · ofetch
- **Forms:** TanStack Form · Zod validation
- **Utilities:** class-variance-authority · `cn` · date-fns · js-cookie · next-themes · sonner · cmdk · nuqs

### Backend (consumed via REST API)

- Node.js · Express.js
- Prisma ORM · PostgreSQL · Redis
- JWT authentication
- Stripe + bKash payment processing

### Tooling

- ESLint 9 (`eslint-config-next`)
- Playwright (end-to-end tests, Chromium)
- Deployed on Vercel

---

## Project Structure

```
src/
├── app/                      # Next.js App Router — routing only, thin pages
│   ├── (public)/             # marketing/landing pages
│   ├── (auth)/               # login, register, forgot-password + loading states
│   ├── (candidate)/          # candidate-scoped shell (dashboard, assessments, results)
│   ├── (recruiter)/          # recruiter-scoped shell (problems, assessments, billing)
│   ├── (admin)/              # admin-scoped shell (users, payments, audit logs)
│   ├── api/                  # BFF routes (auth proxy: me, login, register, OTP)
│   ├── payments/             # payment callback pages (bkash, success, cancel)
│   └── loading.tsx           # shared global route loader
├── features/                 # business modules (feature folders)
│   ├── landing/              # marketing page (hero, features, pricing, FAQ, CTA…)
│   ├── auth/                 # auth api, session utils, guards, use-logout
│   ├── candidate-*/          # candidate dashboard, assessments, attempt, result
│   ├── recruiter-*/          # problems, assessments, dashboard, billing
│   ├── company/              # recruiter company profile
│   └── admin-*/              # dashboard, users, payments, audit logs
├── shared/                   # reusable primitives (no business logic)
│   ├── components/           # ui/, dashboard layout, providers, global-loader
│   ├── lib/                  # api client, query client, auth, constants
│   └── utils/                # generic helpers (cn, formatters)
└── config/                   # routes, navigation, env, app metadata
```

Each feature module follows a consistent pattern:

```
feature/
├── api/          # typed API calls (feature repository)
├── hooks/        # TanStack Query hooks + UI state hooks
├── components/   # presentational components
├── schemas/      # Zod validation schemas
├── types/        # DTO types
├── constants/    # feature constants
└── utils/        # feature-specific helpers
```

---

## Architecture

A feature-modular, layered frontend following a strict dependency direction:

```
presentation → application → infrastructure → domain
```

Rules enforced in this codebase:

- **`app/` does routing only** — pages stay thin and delegate to features.
- **`features/` hold business modules** — self-contained and independently testable.
- **`shared/` holds reusable primitives** — UI kit, API/query clients, session helpers.
- **No direct API calls from components** — data access goes through feature hooks/APIs.
- **Pages never glue API state manually** — TanStack Query drives all server state.

Routes are declared centrally in `src/config/routes.ts`, with role-based redirects and guards in
`src/features/auth/utils`.

---

## Authentication & Sessions

- On successful login/registration the backend returns a **JWT (access token)** that the frontend
  stores in a **cookie** (`accessToken`, 7-day expiry, `SameSite=Lax`).
- Every API request attaches `Authorization: Bearer <token>` automatically at the `ofetch`
  instance level (`src/shared/lib/api/api-client.ts`).
- Routes are protected by **role guards** (`auth.guard.ts`, `role.guard.ts`) plus a
  `useLogout` hook that clears the session cookie and redirects to `/login`.
- Google OAuth is available **only when** `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set, so the widget
  never crashes on misconfigured demos.

> Note: The backend does not invalidate JWTs on logout — the token expires naturally
> (7-day lifetime) once the cookie is cleared.

---

## Workflows

### Candidate

```
Registration → OTP verification → Login → Dashboard
    → Assessment list → Start attempt → Attempt workspace
    → (autosave while in progress) → Submit → Evaluation → Result
```

### Recruiter

```
Recruiter registration → Company setup → Create problems → Create assessment
    → Publish → Invite candidates → Review submissions
    → Evaluate answers → Finalize → Generate report → Billing
```

### Admin

```
Admin login → Dashboard → User management → Audit logs → Payments
```

---

## Assessment System

Supported question types:

| Type    | Answer kind       | Scoring        |
| ------- | ----------------- | -------------- |
| MCQ     | Multiple options  | Automatic      |
| WRITTEN | Text response     | Manual         |
| CODING  | Code/text answer  | Manual         |

### Assessment lifecycle

```
DRAFT → PUBLISHED → CLOSED → ARCHIVED
```

### Attempt lifecycle

```
IN_PROGRESS → SUBMITTED → EVALUATED → EXPIRED
```

Autosave is handled client-side by `autosave-queue.ts`, so partial progress survives
navigation and network blips.

---

## Evaluation System

- **Automatic:** MCQ questions are scored instantly.
- **Manual:** Recruiters review written and coding answers, assign scores, then finalize.

```
Candidate submits → Recruiter reviews → Score assignment → Finalize → Result published
```

---

## Payment System

Supported providers: **Stripe** and **bKash** (credit/package based).

```
Select package → Checkout → Payment provider → Verification → Credit update
```

---

## Getting Started

### Prerequisites

- **Node.js 20+** (Next.js 16 / React 19 requirement)
- A reachable instance of the **AssessFlow API** (or the hosted backend URL)

### Install & run

```bash
# 1. Clone
git clone https://github.com/robinahmed12/Assess-flow-frontend.git
cd Assess-flow-frontend

# 2. Set up environment (create .env.local — see env vars below)

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` in the project root:

| Variable                      | Required | Description                                  |
| ----------------------------- | :------: | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`         |    ✅    | Base URL of the backend REST API             |
| `NEXT_PUBLIC_APP_NAME`        |          | App display name (default `AssessFlow`)      |
| `NEXT_PUBLIC_APP_ENV`         |          | `development` / `staging` / `production`     |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`|          | Google OAuth client ID (enables Google login)|

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=AssessFlow
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

> All backend variables (`DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, Stripe/bKash keys) belong to
> the API service, not this repository.

---

## Available Scripts

| Command                     | Description                                   |
| --------------------------- | --------------------------------------------- |
| `npm run dev`               | Start the Next.js dev server (Turbopack)      |
| `npm run build`             | Create an optimized production build          |
| `npm run start`             | Serve the production build                    |
| `npm run lint`              | Run ESLint                                    |
| `npm run test:e2e`          | Run Playwright end-to-end tests               |
| `npm run test:e2e:headed`   | Run E2E tests in headed (visible) mode        |
| `npm run test:e2e:report`   | Open the last Playwright HTML report          |

To typecheck the project:

```bash
npx tsc --noEmit
```

---

## Testing

End-to-end coverage uses **Playwright** (`tests/e2e/`) against the dev server:

- Billing & payments flows (Stripe/bKash happy paths, mocked providers).
- Payment history / detail pages.

```bash
npm run test:e2e
```

The default project is **Desktop Chromium** with screenshots/videos captured on failure and
traces on first retry. CI runs with 2 retries and parallel workers.

---

## Deployment

The app is deployed to **Vercel**.

Production URL: **https://assess-flow-frontend.vercel.app/**

Deployment notes:

- Configure the same `NEXT_PUBLIC_*` variables above in the Vercel project settings.
- The backend API must be publicly reachable from the browser.
- `next start` serves the build locally (Linux/CI) via `npm run build`.

---

## Performance & UX

- **TanStack Query caching** at the query layer (`staleTime: 60s`) minimizes network chatter.
- **Global route progress bar** (custom, App-Router-compatible) + `loading.tsx` per route group.
- **Static shell defaults** for marketing/onboarding routes; dynamic data islands for dashboards.
- **Animated landing experience** (scroll reveals, count-up stats, marquee, gradient/glow effects)
  built with pure CSS/Tailwind — fully respects `prefers-reduced-motion`.
- **Centralized API layer** (`ofetch`) with typed responses and uniform error handling.

---

## Security

- JWT authentication with cookie-based session storage.
- Role-based authorization enforced at route level (guards) and by the API.
- Server-side input validation (`Zod`) in BFF/auth routes and forms.
- Google widget only rendered when configured — no crash paths on misconfiguration.
- Secure payment handoff (Stripe/bKash) via the backend; no card data touches the client.
- No secrets committed — API keys live in environment variables only.

---

## Future Improvements

- AI-powered candidate ranking & resume analysis.
- Coding judge/compiler engine for live code evaluation.
- Advanced analytics & recruitment pipelines.
- Email notification system (invitations, results, reminders).
- Recruiter collaboration & team workspaces.

---

## License

**Private Commercial Project** — all rights reserved.