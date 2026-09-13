# Frontend Software Requirements Specification (SRS)

**Project:** Online Assessment / Recruitment Platform  
**Frontend target:** Next.js 16.0.3 + TypeScript + Tailwind CSS + shadcn/ui  
**Rendering architecture:** Static Shell + Dynamic Islands  
**Code organization:** Feature-Modular Layered Architecture  
**Server-state:** TanStack Query  
**Forms:** TanStack Form + Zod  
**HTTP client:** ofetch  
**Primary backend source:** Uploaded Express/Prisma backend source and uploaded Prisma schemas  
**SRS status:** Implementation baseline with explicit backend blockers/TBCs  

---

## 0. Document Purpose and Source-of-Truth Rules

This SRS defines the complete frontend requirements for the supplied backend. It is intended to be used directly by frontend engineers, QA/SDET engineers, designers, and reviewers.

The backend source code and Prisma schemas are the source of truth for:

- API endpoints and HTTP methods
- request fields
- enum values
- user roles
- permissions enforced by middleware
- service-level ownership rules
- status transitions
- data relationships
- validation constraints
- result visibility behavior
- assessment attempt behavior
- payment package values
- dashboard calculations where the implementation matches the supplied schema

The frontend must **not invent** unsupported API actions, roles, permissions, statuses, fields, or business rules. When the backend is internally inconsistent, this SRS identifies the issue as a backend blocker/TBC instead of hiding it behind frontend logic.

### 0.1 Confirmed Prisma Enums

```text
UserRole          = ADMIN | RECRUITER | CANDIDATE
UserStatus        = ACTIVE | SUSPENDED
ProblemType       = MCQ | WRITTEN | CODING
ProblemStatus     = ACTIVE | ARCHIVED
AssessmentStatus  = DRAFT | PUBLISHED | CLOSED | ARCHIVED
InvitationStatus  = PENDING | ACCEPTED | REVOKED | EXPIRED
AttemptStatus     = IN_PROGRESS | SUBMITTED | EVALUATED | EXPIRED
ResultVisibility  = IMMEDIATE | AFTER_REVIEW | HIDDEN
PaymentStatus     = PENDING | SUCCEEDED | FAILED | REFUNDED
```

### 0.2 Confirmed Important Database Defaults

- User role: `CANDIDATE`
- User status: `ACTIVE`
- Company credits: `0`
- Problem status: `ACTIVE`
- Assessment status: `DRAFT`
- Assessment result visibility: `AFTER_REVIEW`
- Invitation status: `PENDING`
- Attempt status: `IN_PROGRESS`
- Attempt score: `0`
- Payment status: `PENDING`

---

# 1. Project Overview

The application is a role-based online assessment platform serving candidates, recruiters, and administrators.

## 1.1 Candidate Capabilities

Candidates can:

- register with email/password
- verify registration with email OTP
- log in with email/password
- log in with Google
- recover and reset passwords
- view assigned assessments
- verify invitation links
- start or resume an invited assessment
- answer MCQ, written, and coding questions
- autosave answers
- submit attempts
- view own attempt history
- view assessment results according to result visibility rules
- view candidate dashboard metrics

## 1.2 Recruiter Capabilities

Recruiters can:

- register with company details and two PDF documents
- verify recruiter registration with OTP
- view/update their company
- create/manage/archive problems
- create/manage/publish/archive assessments
- invite existing active candidates to published assessments
- inspect submissions
- manually score written/coding answers
- finalize evaluations
- view candidate results for company-owned assessments
- view assessment reports
- view recruiter dashboard metrics
- purchase company credits through Stripe or bKash
- view company payment records

## 1.3 Admin Capabilities

Confirmed backend-supported admin operations:

- view admin statistics
- list/search/filter/sort users
- suspend/activate other users
- inspect audit logs
- inspect platform payments

Evaluation routes declare admin access, but their service implementation is recruiter-company scoped. Admin evaluation access is therefore a backend blocker, not a frontend feature to assume.

---

# 2. Frontend Technology and Architecture

## 2.1 Required Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16.0.3, App Router |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui |
| Public rendering | Static generation / static prerendered shell |
| Dynamic browser data | Client islands |
| API/server state | TanStack Query |
| Forms | TanStack Form |
| Validation | Zod |
| HTTP | ofetch |
| Tables | TanStack Table, recommended |
| URL query state | nuqs, recommended |
| Dates | date-fns, recommended |
| Toasts | Sonner, recommended |
| Icons | lucide-react, recommended |
| Charts | Recharts, recommended |
| Unit tests | Vitest |
| UI tests | React Testing Library |
| API mocking | MSW |
| E2E | Playwright |
| Error monitoring | Sentry or equivalent, recommended |

## 2.2 Why No General Global State Store Initially

Do not introduce Redux, Zustand, MobX, or another global state store by default.

Use:

- TanStack Query for remote/server state
- TanStack Form for form state
- URL search params for shareable list/filter state
- React local state for small UI interactions
- small scoped context only for true cross-tree UI state

A global client store may be added later only for a demonstrated requirement that cannot be represented cleanly by those mechanisms.

---

# 3. Static Shell + Dynamic Islands Architecture

## 3.1 Core Rule

The application should be **static-first**.

A route should render as much non-user-specific structure as possible without requiring backend data. Interactive or user-specific portions are then hydrated as isolated client islands.

### Static shell responsibilities

- route page frame
- headers/footers
- navigation structure
- static headings and copy
- card/table skeleton layout
- route-level metadata
- static empty placeholders while islands initialize
- reusable server-renderable shadcn composition where no browser state is required

### Dynamic island responsibilities

- authentication forms
- Google sign-in control
- OTP flows
- recruiter document upload
- authenticated dashboard data
- query-backed lists and details
- tables and filters
- create/edit forms
- mutation actions
- dialogs and confirmation flows
- invitation verification based on token
- assessment attempt timer
- autosave
- evaluation forms
- payment checkout interactions
- live status transitions

## 3.2 Public Page Rendering

Public routes should use statically generated/static-prerendered shells whenever they do not require request-specific information.

Examples:

- `/`
- `/login`
- `/register`
- `/register/verify`
- `/register/recruiter`
- `/register/recruiter/verify`
- `/forgot-password`
- `/forgot-password/verify`
- `/reset-password`
- `/invitations/accept`

The invitation page shell can remain static; its invitation-verification island reads the token from the browser URL and calls the backend.

## 3.3 Protected Page Rendering

Protected pages should keep route chrome and structural markup static-friendly while user-specific content is loaded by authenticated islands.

Recommended request flow:

1. User navigates to a protected route.
2. Static shell is returned quickly.
3. Auth bootstrap island resolves current session.
4. Role guard validates expected role.
5. Feature island executes TanStack Query requests.
6. Skeletons transition to real content.

Frontend route protection improves UX only. Backend authorization remains authoritative.

## 3.4 Hydration Boundaries

Keep `use client` as low in the tree as practical.

Do not mark an entire route layout as a client component just because one table or form is interactive.

Preferred pattern:

```text
Server/static page shell
  -> static page header
  -> static description
  -> <DynamicFeatureIsland />
```

The dynamic feature island owns Query hooks, Form hooks, browser APIs, and event handlers.

## 3.5 Assessment Attempt Exception

The assessment attempt page is the most client-heavy area because it requires:

- wall-clock timer
- browser visibility events
- autosave
- local unsaved buffers
- mutation sequencing
- question navigation
- submission confirmation

The route shell can still remain static, but the assessment workspace itself should be a dedicated client island.

---

# 4. Layered Frontend Architecture

The recommended structure is **feature-modular layered architecture**. Each business module is isolated but follows the same internal layers.

## 4.1 Layer Definitions

### Route Layer — `app/`

Responsibilities:

- Next.js routes
- layouts
- metadata
- route shells
- loading/error/not-found boundaries
- composition of feature islands

Must not contain backend business logic.

### Presentation Layer — `presentation/`

Responsibilities:

- React UI components
- page islands
- form components
- tables
- dialogs
- view models/formatters that are UI-specific

May call application hooks/use cases.

Must not call raw backend URLs directly.

### Application Layer — `application/`

Responsibilities:

- TanStack Query query definitions
- mutations
- query-key factories
- orchestration hooks
- frontend use cases
- cache invalidation rules
- mapping backend errors into UI/application errors

Depends on domain contracts and infrastructure ports.

### Domain Layer — `domain/`

Responsibilities:

- frontend domain types
- enum mirrors
- Zod schemas for backend request contracts
- pure business validation
- policies such as `canEditAssessment` and `canCandidateViewResult`
- no React
- no fetch
- no browser APIs

### Infrastructure Layer — `infrastructure/`

Responsibilities:

- endpoint implementations
- ofetch calls
- DTO definitions when separated from domain models
- API envelope parsing
- transport adapters

Must not import UI.

### Shared Layer — `shared/`

Responsibilities:

- generic UI components
- API base client
- session utilities
- date helpers
- common error primitives
- generic table/pagination components
- constants that are truly cross-domain

Shared must not depend on a business feature.

## 4.2 Dependency Direction

Allowed direction:

```text
app
  -> presentation
      -> application
          -> domain
          -> infrastructure
              -> shared/api

shared <- may be used by all layers
```

Disallowed examples:

- infrastructure importing presentation
- domain importing React
- domain importing TanStack Query
- shared importing recruiter-specific code
- route files implementing raw API fetch logic

## 4.3 Proposed Folder Architecture

```text
src/
├─ app/
│  ├─ (public)/
│  │  ├─ page.tsx
│  │  ├─ login/page.tsx
│  │  ├─ register/page.tsx
│  │  ├─ register/verify/page.tsx
│  │  ├─ register/recruiter/page.tsx
│  │  ├─ register/recruiter/verify/page.tsx
│  │  ├─ forgot-password/page.tsx
│  │  ├─ forgot-password/verify/page.tsx
│  │  ├─ reset-password/page.tsx
│  │  └─ invitations/accept/page.tsx
│  ├─ (candidate)/candidate/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/page.tsx
│  │  ├─ assessments/page.tsx
│  │  └─ attempts/
│  │     ├─ page.tsx
│  │     └─ [attemptId]/page.tsx
│  ├─ (recruiter)/recruiter/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/page.tsx
│  │  ├─ problems/...
│  │  ├─ assessments/...
│  │  ├─ evaluations/[attemptId]/page.tsx
│  │  ├─ company/page.tsx
│  │  └─ billing/...
│  ├─ (admin)/admin/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/page.tsx
│  │  ├─ users/page.tsx
│  │  ├─ audit-logs/page.tsx
│  │  └─ payments/page.tsx
│  ├─ assessment-results/[attemptId]/page.tsx
│  ├─ api/                 # optional Next BFF/session endpoints
│  ├─ layout.tsx
│  ├─ loading.tsx
│  ├─ error.tsx
│  └─ not-found.tsx
│
├─ features/
│  ├─ auth/
│  │  ├─ presentation/
│  │  ├─ application/
│  │  ├─ domain/
│  │  └─ infrastructure/
│  ├─ recruiter-registration/
│  ├─ company/
│  ├─ problem/
│  ├─ assessment/
│  ├─ invitation/
│  ├─ candidate-assessment/
│  ├─ attempt/
│  ├─ evaluation/
│  ├─ report/
│  ├─ payment/
│  ├─ dashboard/
│  └─ admin/
│
├─ shared/
│  ├─ api/
│  │  ├─ client.ts
│  │  ├─ envelope.ts
│  │  └─ errors.ts
│  ├─ auth/
│  ├─ config/
│  ├─ constants/
│  ├─ lib/
│  ├─ providers/
│  ├─ types/
│  ├─ ui/
│  └─ utils/
│
└─ middleware.ts           # optional coarse auth/session redirect layer
```

## 4.4 Example Feature Internal Structure

```text
features/assessment/
├─ presentation/
│  ├─ islands/
│  ├─ components/
│  └─ forms/
├─ application/
│  ├─ queries.ts
│  ├─ mutations.ts
│  ├─ query-keys.ts
│  └─ use-assessment-form.ts
├─ domain/
│  ├─ assessment.types.ts
│  ├─ assessment.schema.ts
│  ├─ assessment.enums.ts
│  └─ assessment.policy.ts
└─ infrastructure/
   ├─ assessment.api.ts
   └─ assessment.dto.ts
```

---

# 5. Backend Data Model Analysis

## 5.1 User

Confirmed fields:

- `id: string UUID`
- `name: string`
- `email: string unique`
- `passwordHash: string | null`
- `googleId: string | null unique`
- `role: UserRole`
- `status: UserStatus`
- `createdAt`
- `updatedAt`

Relations:

- optional owned Company
- audit logs
- assessments
- problems
- invitations

Password hashes and Google IDs must never be expected in frontend API DTOs unless a backend bug exposes them.

## 5.2 Company

Fields:

- `id`
- `name`
- `slug unique`
- `credits default 0`
- `ownerId unique`
- `companyLicensePaperUrl?`
- `companyLicensePaperPublicId?`
- `selfDocumentUrl?`
- `selfDocumentPublicId?`
- timestamps

Relations:

- owner
- problems
- assessments
- payments

Frontend should display public URLs only when deliberately needed. Cloud provider public IDs should normally be treated as infrastructure metadata, not UI content.

## 5.3 Problem

Fields:

- `id`
- `title`
- `description`
- `type: MCQ | WRITTEN | CODING`
- `points: integer`
- `difficulty?`
- `tags: string[]`
- `status: ACTIVE | ARCHIVED`
- `companyId`
- timestamps

Relations:

- options
- assessments via AssessmentProblem
- answers

## 5.4 ProblemOption

Fields:

- `id`
- `text`
- `isCorrect default false`
- `problemId`
- `createdAt`

`isCorrect` is recruiter/evaluation-sensitive and must never be shown in candidate attempt UI.

## 5.5 Assessment

Fields:

- `id`
- `title`
- `description?`
- `duration: integer minutes`
- `passingScore: integer | null`
- `status: AssessmentStatus`, default `DRAFT`
- `resultVisibility: ResultVisibility`, default `AFTER_REVIEW`
- `companyId`
- optional `userId`
- timestamps

Relations:

- ordered assessment problems
- invitations
- attempts

Note: the API create/update request uses `durationMinutes`, while the database field is `duration`.

## 5.6 AssessmentProblem

Fields:

- `id`
- `assessmentId`
- `problemId`
- `order`
- `createdAt`

Constraints:

- one problem cannot appear twice in the same assessment
- order must be unique within the assessment

The order of `problemIds` sent by the frontend is meaningful.

## 5.7 Invitation

Fields:

- `id`
- `token unique`
- `candidateEmail`
- `status`, default `PENDING`
- `expiresAt?`
- `assessmentId`
- `candidateId`
- timestamps

Constraint:

- one invitation per `(assessmentId, candidateId)`

Relations:

- assessment
- candidate
- optional one-to-one attempt

## 5.8 Attempt

Fields:

- `id`
- `status`, default `IN_PROGRESS`
- `startedAt`
- `expiresAt`
- `submittedAt?`
- `score: float?`, default 0
- `percentage?`
- `passed?`
- `assessmentId`
- `invitationId unique`
- timestamps

Relations:

- one invitation
- assessment
- answers

One invitation can have at most one attempt.

## 5.9 Answer

Fields:

- `id`
- `answerText?`
- `selectedOptionId?`
- `score?`
- `evaluatedAt?`
- `attemptId`
- `problemId`
- timestamps

Constraint:

- one Answer per `(attemptId, problemId)`

No persistent feedback field exists.

## 5.10 Payment

Fields:

- `id`
- `amount: Float`
- `creditsPurchased: Int`
- `status: PaymentStatus`
- `stripeSessionId? unique`
- `stripePaymentIntentId? unique`
- `bkashPaymentId?`
- `bkashTransactionId?`
- `invoiceNumber?`
- `invoiceEmailSentAt?`
- `companyId`
- timestamps

Important limitation:

- no provider field
- no currency field

The same table stores Stripe and bKash payments.

## 5.11 AuditLog

Fields:

- `id`
- `action`
- `entityType`
- `entityId`
- `metadata: Json?`
- `actorId?`
- `createdAt`

---

# 6. Backend Modules and API Inventory

Base API prefix: `/api/v1`

Successful standard response envelope:

```text
success: true
message: string
data?: T
```

Global standard error envelope:

```text
success: false
message: string
errors?: unknown
stack?: string   # development only
```

## 6.1 Health

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API health |

## 6.2 Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Start candidate/general registration |
| POST | `/auth/verify-registration-otp` | Public | Complete registration |
| POST | `/auth/login` | Public | Password login |
| POST | `/auth/google` | Public | Google login |
| GET | `/auth/me` | Authenticated | Current user |
| POST | `/auth/forgot-password` | Public | Request reset OTP |
| POST | `/auth/verify-forgot-password-otp` | Public | Verify reset OTP |
| POST | `/auth/reset-password` | Public | Reset password |

## 6.3 Recruiter Registration

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/recruiters/register` | Public | Recruiter registration request |
| POST | `/recruiters/verify-otp` | Public | Complete recruiter registration |

## 6.4 Company

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| GET | `/companies/me` | RECRUITER | Current company |
| PATCH | `/companies/me` | RECRUITER | Update company name |

## 6.5 Problems

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/problems` | RECRUITER | Create problem |
| GET | `/problems` | RECRUITER | List active problems |
| GET | `/problems/:id` | RECRUITER | Problem detail |
| PATCH | `/problems/:id` | RECRUITER | Update problem |
| DELETE | `/problems/:id` | RECRUITER | Archive problem |

## 6.6 Assessments

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/assessments` | RECRUITER | Create assessment |
| GET | `/assessments` | RECRUITER | List non-archived assessments |
| GET | `/assessments/:id` | RECRUITER | Assessment detail |
| PATCH | `/assessments/:id` | RECRUITER | Update draft assessment |
| POST | `/assessments/:id/publish` | RECRUITER | Publish draft |
| DELETE | `/assessments/:id` | RECRUITER | Archive assessment |

## 6.7 Invitations

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/invitations/verify/:token` | Public | Verify invitation |
| POST | `/invitations/:id/invitations` | RECRUITER | Invite candidate; `id` is assessment ID |
| GET | `/invitations/:id/invitations` | RECRUITER | List assessment invitations |

## 6.8 Candidate

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| GET | `/candidate/assessments` | CANDIDATE | Candidate assignments |
| POST | `/candidate/assessments/:id/start` | CANDIDATE | Start/resume assessment |

## 6.9 Attempts

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| GET | `/attempts/me` | CANDIDATE | Attempt history |
| GET | `/attempts/:id` | CANDIDATE | Attempt detail |
| PUT | `/attempts/:id/answers/:problemId` | CANDIDATE | Upsert answer |
| POST | `/attempts/:id/submit` | CANDIDATE | Submit attempt |

## 6.10 Evaluation

| Method | Endpoint | Route Roles | Purpose |
|---|---|---|---|
| GET | `/evaluation/assessments/:id/submissions` | RECRUITER, ADMIN | Submission list |
| GET | `/evaluation/attempts/:id/evaluation` | RECRUITER, ADMIN | Evaluation detail |
| PATCH | `/evaluation/attempts/:id/answers/:answerId/evaluate` | RECRUITER, ADMIN | Manual scoring |
| POST | `/evaluation/attempts/:id/finalize-evaluation` | RECRUITER, ADMIN | Finalize |
| GET | `/evaluation/attempts/:id/result` | RECRUITER, CANDIDATE, ADMIN | Result |
| GET | `/evaluation/assessments/:id/report` | RECRUITER, ADMIN | Report |

Service-level admin support is currently inconsistent. See backend blockers.

## 6.11 Stripe Payments

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/stripe-payments/webhook` | Stripe webhook | Process provider events |
| POST | `/stripe-payments/checkout` | RECRUITER | Create Checkout Session |
| GET | `/stripe-payments` | RECRUITER | Company payments |
| GET | `/stripe-payments/:id` | RECRUITER | Company payment detail |

## 6.12 bKash Payments

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/bkash-payments/bkash/callback` | Public/provider | Callback |
| POST | `/bkash-payments/bkash/execute` | Public | Execute payment |
| POST | `/bkash-payments/bkash/query` | Public | Query payment |
| POST | `/bkash-payments/checkout` | RECRUITER | Create payment |
| GET | `/bkash-payments` | RECRUITER | Company payments |
| GET | `/bkash-payments/:id` | RECRUITER | Company payment detail |
| GET | `/bkash/callback` | Public/provider | Duplicate callback mount |

## 6.13 Admin

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| GET | `/admin/users` | ADMIN | User list |
| PATCH | `/admin/users/:id/status` | ADMIN | User status |
| GET | `/admin/dashboard-stats` | ADMIN | Compatible admin statistics |
| GET | `/admin/audit-logs` | ADMIN | Audit logs |
| GET | `/admin/payments` | ADMIN | Platform payments |

## 6.14 Dashboards

| Method | Endpoint | Role | Current status |
|---|---|---|---|
| GET | `/dashboard/candidate` | CANDIDATE | Schema-compatible |
| GET | `/dashboard/recruiter` | RECRUITER | Blocked by Payment schema mismatch |
| GET | `/dashboard/admin` | ADMIN | Blocked by Payment schema mismatch |

The richer recruiter/admin dashboard service references Payment fields absent from the supplied Prisma model, including `creditsGranted`, and admin dashboard also references `recruiterId`, `providerReference`, and `completedAt`. Frontend must not depend on these endpoints until backend/schema alignment is fixed.

---

# 7. User Roles and Permissions

## 7.1 Candidate

Allowed:

- public candidate registration
- login / Google login / password reset
- candidate dashboard
- candidate assignment list
- start own invitation
- resume own active attempt
- read own attempts
- save own answers
- submit own active attempt
- view own result when visibility permits

Not allowed:

- problem management
- assessment authoring
- invitations
- recruiter evaluation
- company management
- recruiter billing
- admin screens

## 7.2 Recruiter

Allowed:

- recruiter onboarding
- own company read/update
- own company problem management
- own company assessment management
- own published assessment invitations
- own company submissions/evaluations/reports
- owned result access
- own company credit checkout/payment history
- recruiter dashboard after backend mismatch is fixed

## 7.3 Admin

Confirmed:

- admin stats
- user management
- audit log inspection
- platform payments

Declared but currently inconsistent:

- evaluation and reports
- result access

## 7.4 Permission Matrix

| Capability | Candidate | Recruiter | Admin |
|---|:---:|:---:|:---:|
| Login | Yes | Yes | Yes |
| Candidate registration | Yes | No | No |
| Recruiter onboarding | No | Yes | No |
| Candidate dashboard | Yes | No | No |
| Recruiter dashboard | No | Backend-fix required | No |
| Admin dashboard stats | No | No | Yes |
| Problem CRUD/archive | No | Yes | No |
| Assessment CRUD/publish/archive | No | Yes | No |
| Invite candidate | No | Yes | No |
| Take assessment | Yes | No | No |
| Evaluate manual answer | No | Yes | TBC/backend mismatch |
| Assessment report | No | Yes | TBC/backend mismatch |
| View own result | Yes | No | No |
| View company-owned result | No | Yes | TBC/backend mismatch |
| Company settings | No | Yes | No |
| Buy credits | No | Yes | No |
| User administration | No | No | Yes |
| Audit logs | No | No | Yes |
| Platform payments | No | No | Yes |

---

# 8. Main Business Workflows

## 8.1 Candidate Registration

1. User enters name, email, password, confirmation.
2. Frontend validates locally.
3. Frontend sends `POST /auth/register` without `role`.
4. Backend stores pending registration in Redis for 5 minutes and emails a six-digit OTP.
5. Frontend opens registration verification screen.
6. Candidate enters OTP.
7. Frontend sends `POST /auth/verify-registration-otp`.
8. Backend creates ACTIVE user and returns access token.
9. Frontend establishes session.
10. Redirect to candidate dashboard.

Security requirement: although backend validation accepts optional `role`, normal public frontend registration must never expose or send a role selector.

## 8.2 Google Candidate Login

1. Google identity client returns a credential.
2. Frontend sends credential to `POST /auth/google`.
3. Backend verifies it against configured Google client ID.
4. Existing local email may be linked to Google.
5. New Google users are created as ACTIVE CANDIDATE users.
6. Backend returns access token and user.
7. Frontend routes by returned role.

## 8.3 Recruiter Registration

1. Recruiter enters name/email/password/company name.
2. Recruiter uploads exactly one company license PDF and one self-document PDF.
3. Frontend validates MIME/type and maximum size.
4. Submit multipart form data to `/recruiters/register`.
5. Backend uploads documents and stores pending registration in Redis.
6. Backend emails six-digit OTP; TTL = 5 minutes.
7. Recruiter verifies OTP.
8. Backend creates ACTIVE RECRUITER and Company.
9. Company starts with `credits = 0`.
10. Frontend establishes session and routes to recruiter area.

## 8.4 Problem Authoring

1. Recruiter creates MCQ, WRITTEN, or CODING problem.
2. MCQ requires at least two options and exactly one correct option.
3. WRITTEN/CODING must not send options.
4. Created problem is ACTIVE by default.
5. Recruiter may update.
6. Archive changes status to ARCHIVED; it is not hard-deleted.

## 8.5 Assessment Authoring

1. Recruiter selects one to 100 active company problems.
2. Order in `problemIds` becomes assessment order.
3. Frontend calculates total possible points.
4. Passing score must be between 0 and total points.
5. Frontend sends duration as `durationMinutes`.
6. Backend stores duration in `Assessment.duration` on create.
7. Result visibility is not accepted by current create/update API and therefore uses database default `AFTER_REVIEW`.
8. Assessment starts as DRAFT.
9. Only DRAFT can be edited or published.
10. Publish changes status to PUBLISHED.
11. Any non-archived assessment can currently be archived.

## 8.6 Invitation

1. Recruiter opens PUBLISHED assessment.
2. Recruiter submits candidate email and optional expiration.
3. Candidate must already exist.
4. User must be ACTIVE CANDIDATE.
5. Duplicate `(assessment, candidate)` is rejected.
6. Default expiration is seven days.
7. Backend creates random token and email link:
   `/invitations/accept?token=<token>`.
8. Public frontend verifies token.
9. Candidate logs in if necessary.
10. Candidate starts assessment; no separate accept endpoint exists.

## 8.7 Attempt Start and Resume

1. Candidate calls start using assessment ID.
2. Candidate must have matching invitation.
3. REVOKED invitation fails.
4. Expired invitation is marked EXPIRED and fails.
5. If an IN_PROGRESS attempt exists, backend returns that same attempt.
6. Otherwise one attempt is created and invitation becomes ACCEPTED.
7. Attempt deadline is the earlier of:
   - start + assessment duration
   - invitation expiration

## 8.8 Attempt Answering and Submission

1. Attempt detail provides ordered problems without `isCorrect` flags.
2. MCQ sends `selectedOptionId`.
3. WRITTEN/CODING sends non-empty `answerText`.
4. Answer endpoint performs upsert by `(attemptId, problemId)`.
5. Frontend autosaves.
6. On submit, backend auto-scores every MCQ, including unanswered MCQs as 0 via created/updated answer behavior for MCQs.
7. If assessment has manual questions, attempt becomes SUBMITTED with partial MCQ score and `percentage/passed = null`.
8. If assessment is MCQ-only, submit calculates percentage/pass status but status still becomes SUBMITTED rather than EVALUATED.
9. Manual evaluation finalization later changes status to EVALUATED.

## 8.9 Manual Evaluation

1. Recruiter opens submission.
2. MCQ score is automatic and cannot be overridden.
3. WRITTEN/CODING answer may receive score `0..problem.points`.
4. Optional `feedback` is accepted in the evaluation request.
5. Backend does not persist feedback on Answer; it records feedback only in AuditLog metadata and returns it in immediate mutation response.
6. Finalization recomputes MCQ scores.
7. Every manual problem must have an Answer record and score.
8. Backend computes total, percentage, pass/fail.
9. Attempt status becomes EVALUATED.
10. Candidate result email is sent.

## 8.10 Result Visibility

Assessment default: `AFTER_REVIEW`.

### IMMEDIATE

Candidate result may be available after submission, but current assessment API cannot configure this value.

### AFTER_REVIEW

Candidate result is available only after status EVALUATED.

### HIDDEN

Candidate result endpoint returns 403.

Recruiter owner can view result regardless of candidate visibility rule.

## 8.11 Stripe Credit Purchase

Packages are server controlled:

| Code | Credits | Amount | Currency |
|---|---:|---:|---|
| STARTER | 10 | 10.00 | USD |
| GROWTH | 50 | 40.00 | USD |
| SCALE | 150 | 100.00 | USD |

Flow:

1. Recruiter sends `packageCode` only.
2. Backend creates PENDING Payment.
3. Backend creates Stripe Checkout Session.
4. Frontend redirects to returned URL.
5. Stripe webhook handles completion.
6. Payment becomes SUCCEEDED.
7. Company credits increment by `creditsPurchased`.
8. Invoice email is sent.

## 8.12 bKash Credit Purchase

Packages:

| Code | Credits | Amount | Currency |
|---|---:|---:|---|
| STARTER | 10 | 500 | BDT |
| GROWTH | 50 | 2,000 | BDT |
| SCALE | 150 | 5,000 | BDT |

Flow:

1. Recruiter sends `packageCode` only.
2. Backend creates PENDING Payment.
3. Backend creates tokenized bKash payment.
4. bKash `paymentID` is currently stored in `Payment.stripeSessionId`.
5. Frontend redirects to returned `bkashURL`.
6. Callback/execute path confirms payment.
7. Payment becomes SUCCEEDED.
8. Company credits increment.
9. Invoice email is sent.

Provider/currency modeling is a backend blocker because Payment has no provider/currency fields.

---

# 9. Frontend Route Structure

## 9.1 Public Routes

- `/`
- `/login`
- `/register`
- `/register/verify`
- `/register/recruiter`
- `/register/recruiter/verify`
- `/forgot-password`
- `/forgot-password/verify`
- `/reset-password`
- `/invitations/accept`

## 9.2 Shared Authenticated Result Route

- `/assessment-results/[attemptId]`

This exact path is required because backend result emails generate it.

## 9.3 Candidate Routes

- `/candidate/dashboard`
- `/candidate/assessments`
- `/candidate/attempts`
- `/candidate/attempts/[attemptId]`

## 9.4 Recruiter Routes

- `/recruiter/dashboard`
- `/recruiter/problems`
- `/recruiter/problems/new`
- `/recruiter/problems/[problemId]`
- `/recruiter/problems/[problemId]/edit`
- `/recruiter/assessments`
- `/recruiter/assessments/new`
- `/recruiter/assessments/[assessmentId]`
- `/recruiter/assessments/[assessmentId]/edit`
- `/recruiter/assessments/[assessmentId]/invitations`
- `/recruiter/assessments/[assessmentId]/submissions`
- `/recruiter/evaluations/[attemptId]`
- `/recruiter/assessments/[assessmentId]/report`
- `/recruiter/company`
- `/recruiter/billing`
- `/recruiter/billing/payments/[paymentId]`

Stripe backend defaults reference:

- `/payments/success?session_id=...`
- `/payments/cancel`

If those are used in deployed environment, frontend routes should be added exactly as configured. Configuration is TBC.

## 9.5 Admin Routes

- `/admin/dashboard`
- `/admin/users`
- `/admin/audit-logs`
- `/admin/payments`

Do not add admin evaluation routes until service authorization is corrected.

---

# 10. Screen-by-Screen Requirements

Every screen definition below includes route, purpose, data, API calls, major components, actions, validation, permission, and acceptance criteria.

## S-01 — Landing Page

**Route:** `/`  
**Rendering:** Static shell / SSG  
**Permission:** Public

### Purpose

Provide the public entry point to login, candidate registration, and recruiter registration.

### Required Data

None from supplied backend.

### API Calls

None.

### Components

- public header
- product introduction section
- candidate CTA
- recruiter CTA
- login CTA
- footer

### Actions

- go to login
- go to candidate registration
- go to recruiter registration

### Validation

None.

### Acceptance Criteria

- no backend call is required for initial render
- page remains functional if API is unavailable
- unsupported platform features are not advertised as confirmed functionality
- keyboard and mobile navigation work
- semantic headings are present

---

## S-02 — Login

**Route:** `/login`  
**Rendering:** Static shell + auth form island  
**Permission:** Public

### Required Data

No initial backend data.

### API Calls

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`
- optional session verification using `GET /api/v1/auth/me`

### Components

- email input
- password input
- password visibility control
- submit button
- Google sign-in control
- forgot-password link
- registration links
- form-level error region

### Actions

- login by password
- login by Google
- navigate to recovery

### Validation

- valid email
- password required
- Google credential non-empty before backend call

### Permission/Redirect

After successful login:

- CANDIDATE -> `/candidate/dashboard`
- RECRUITER -> `/recruiter/dashboard`
- ADMIN -> `/admin/dashboard`

### Acceptance Criteria

- loading state prevents duplicate login
- generic invalid-credential message is shown for 401
- suspended user 403 is clearly represented
- passwordless Google account error directs user toward Google login
- raw access token never appears in URL or visible UI
- returned backend role controls destination

---

## S-03 — Candidate Registration

**Route:** `/register`  
**Rendering:** Static shell + form island  
**Permission:** Public

### API

`POST /api/v1/auth/register`

### Required Form Fields

- name
- email
- password
- confirmPassword — frontend only

### Backend Payload

- name
- email
- password

Do not send `role`.

### Validation

- name: 2–100 chars
- email: valid format
- password: 8–100 chars
- confirmPassword must match

### Components

- name input
- email input
- password input
- confirm password input
- password requirement hint
- submit button
- login link

### Acceptance Criteria

- role selector does not exist
- `role` is absent from request
- duplicate email 409 is shown
- success preserves email for OTP flow
- success response expiry is shown when useful
- form is disabled during submission

---

## S-04 — Candidate Registration OTP

**Route:** `/register/verify`  
**Rendering:** Static shell + OTP island  
**Permission:** Public

### API

`POST /api/v1/auth/verify-registration-otp`

### Required Data

- email from registration flow
- OTP

### Validation

- valid email
- exactly six numeric digits

### Components

- email context
- six-digit OTP input
- expiry hint
- verify button
- restart registration action

### Actions

- verify
- return to registration if flow context is missing/expired

### Acceptance Criteria

- invalid OTP displays backend message
- expired OTP clearly asks user to restart registration
- success establishes session and routes to candidate dashboard
- no fake resend button is shown because no resend endpoint exists

---

## S-05 — Recruiter Registration

**Route:** `/register/recruiter`  
**Rendering:** Static shell + multipart form island  
**Permission:** Public

### API

`POST /api/v1/recruiters/register`

### Content Type

`multipart/form-data`

### Fields

- name
- email
- password
- confirmPassword — frontend only
- companyName
- companyLicensePaper
- selfDocument

### File Rules

For each required document:

- PDF only
- exactly one file
- maximum 5 MB

Exact multipart field names:

- `companyLicensePaper`
- `selfDocument`

### Components

- recruiter information group
- company information group
- password inputs
- PDF upload dropzone/control
- selected file metadata
- remove/replace controls
- upload/submission state

### Acceptance Criteria

- incorrect file MIME is rejected before upload
- file >5 MB is rejected before upload
- both files are required
- exact multipart names are used
- duplicate email response is shown
- success routes to recruiter OTP

---

## S-06 — Recruiter OTP

**Route:** `/register/recruiter/verify`  
**Rendering:** Static shell + OTP island

### API

`POST /api/v1/recruiters/verify-otp`

### Validation

- valid email
- six numeric digits

### Success Data

- user
- company
- accessToken

Company response includes confirmed onboarding fields:

- id
- name
- slug
- credits
- companyLicensePaperUrl
- selfDocumentUrl

### Acceptance Criteria

- invalid/expired OTP is represented
- success creates recruiter session
- company can seed company/recruiter state cache
- route to recruiter area

---

## S-07 — Forgot Password

**Route:** `/forgot-password`

### API

`POST /api/v1/auth/forgot-password`

### Field

- email

### Important Security Behavior

Backend intentionally returns a normal-looking result even when no user exists.

### Acceptance Criteria

- UI must never reveal whether email exists
- response always transitions to verification instructions
- success copy does not say “account found”

---

## S-08 — Forgot Password OTP

**Route:** `/forgot-password/verify`

### API

`POST /api/v1/auth/verify-forgot-password-otp`

### Fields

- email
- OTP

### Success Data

- resetToken
- expiresInMinutes = 10 in current service

### Acceptance Criteria

- resetToken is temporary flow state
- resetToken is not included in a shareable URL
- successful verification transitions to reset-password screen

---

## S-09 — Reset Password

**Route:** `/reset-password`

### API

`POST /api/v1/auth/reset-password`

### UI Fields

- newPassword
- confirmPassword

### Backend Payload

- resetToken
- newPassword

### Validation

- 8–100 chars
- confirmation matches

### Acceptance Criteria

- missing flow token blocks submission and provides restart action
- expired token displays clear message
- success clears recovery state and routes to login

---

## S-10 — Invitation Verification / Acceptance

**Route:** `/invitations/accept?token=...`  
**Rendering:** Static shell + token verification island  
**Permission:** Verification public; start requires CANDIDATE

### API Calls

- `GET /api/v1/invitations/verify/:token`
- `POST /api/v1/candidate/assessments/:assessmentId/start`

### Verification Data

Invitation includes:

- id
- token
- candidateEmail
- status
- expiresAt
- candidate
  - id
  - name
  - email
  - status
- assessment
  - id
  - title
  - duration
  - status
- timestamps

### Components

- invitation status card
- assessment title
- duration
- candidate email/name
- expiration
- login CTA if not authenticated
- start/resume CTA when valid

### Actions

- verify token
- login if required
- start assessment

### Acceptance Criteria

- missing/short token shows invalid-link UI before unnecessary API call
- invalid token 404 -> invalid invitation state
- expired token 410 -> expired invitation state
- non-published assessment -> unavailable state
- suspended candidate -> inactive-account state
- start success routes to returned attempt ID
- no separate “accept” API is invented

---

## S-11 — Candidate Dashboard

**Route:** `/candidate/dashboard`  
**Rendering:** Static role shell + dashboard island  
**Role:** CANDIDATE

### API

`GET /api/v1/dashboard/candidate`

### Required Data

`overview`:

- totalAssignments
- pendingInvitations
- acceptedInvitations
- expiredInvitations
- totalAttempts
- inProgressAttempts
- submittedAttempts
- evaluatedAttempts
- expiredAttempts
- completedAttempts
- visibleResults
- passedAttempts
- failedAttempts
- averageScore
- averagePercentage
- startRate
- completionRate
- passRate

`invitationBreakdown`:

- pending
- accepted
- expired
- revoked

`attemptBreakdown`:

- inProgress
- submitted
- evaluated
- expired

`upcomingAssessments`:

- invitationId
- invitedAt
- expiresAt
- assessment id/title/description/duration

`recentAttempts`:

- id
- status
- dates
- assessment
- resultAvailable
- score/percentage/passed only when available

`performanceTrend`:

- attemptId
- assessment
- score
- percentage
- passed
- submittedAt

### Components

- KPI cards
- upcoming assessment list
- attempt status chart
- result performance chart
- recent attempts list
- resume CTA

### Acceptance Criteria

- no hidden result data is inferred client-side
- `resultAvailable` controls result CTAs
- null result metrics render as “Not available”, not zero unless metric itself is returned as zero
- new-user empty state is useful

---

## S-12 — Candidate Assessments

**Route:** `/candidate/assessments`  
**Role:** CANDIDATE

### API

`GET /api/v1/candidate/assessments`

### Required Data

Invitation:

- id
- token
- candidateEmail
- status
- expiresAt
- assessment
  - id
  - title
  - description
  - duration
  - passingScore
  - status
- attempt when present
  - id
  - status
  - startedAt
  - expiresAt
  - submittedAt
  - score

### Components

- assignment card/list
- invitation badge
- assessment status
- deadline
- duration
- attempt state
- start/resume/result action

### Actions

- start
- resume
- open result when allowed

### Acceptance Criteria

- revoked invitations are absent because backend excludes them
- expired pending invitations are updated by backend before list return
- IN_PROGRESS shows Resume
- existing completed/non-active attempt does not show Start
- PUBLISHED is required by frontend start CTA even though service should also enforce lifecycle more explicitly

---

## S-13 — Candidate Attempt History

**Route:** `/candidate/attempts`  
**Role:** CANDIDATE

### API

`GET /api/v1/attempts/me`

### Data Per Attempt

- id
- status
- startedAt
- expiresAt
- submittedAt
- score
- percentage
- passed
- assessment id/title/description/duration/passingScore

### Components

- attempt history table/cards
- status badge
- assessment title
- dates
- score summary when meaningful
- resume/result actions

### Acceptance Criteria

- active attempt can resume
- candidate does not rely solely on `score` to determine result visibility
- result page is authoritative for visibility
- mobile view avoids unreadable wide tables

---

## S-14 — Assessment Attempt Workspace

**Route:** `/candidate/attempts/[attemptId]`  
**Role:** CANDIDATE owner

### APIs

- `GET /api/v1/attempts/:id`
- `PUT /api/v1/attempts/:id/answers/:problemId`
- `POST /api/v1/attempts/:id/submit`

### Attempt Detail Data

- id
- status
- startedAt
- expiresAt
- submittedAt
- score/percentage/passed depending on status
- assessment
  - id
  - title
  - description
  - duration
  - passingScore
  - ordered problems
- answers

Question data:

- id
- order
- title
- description
- type
- points
- difficulty
- tags
- options with id/text only

### Components

- assessment workspace island
- sticky timer
- assessment title/header
- question navigator
- progress summary
- question renderer
- MCQ radio group
- written textarea
- coding answer textarea/editor-like control without assuming compiler execution
- autosave status
- connection state
- final submit button
- submit confirmation dialog

### Validation

MCQ save:

- selectedOptionId required

WRITTEN/CODING save:

- non-empty trimmed answerText

### Actions

- select MCQ
- edit text answer
- navigate questions
- save automatically
- retry failed save
- submit assessment

### Acceptance Criteria

- `isCorrect` never appears in candidate DTO/model or UI
- timer uses `expiresAt` as authority
- page reload restores saved server answers
- latest local answer cannot be overwritten by a stale earlier autosave response
- per-question save state is visible
- pending text is not lost when switching questions
- submitted/evaluated/expired workspace is read-only
- final submit is idempotence-protected at UI level
- successful submit updates relevant caches
- no code execution feature is shown for CODING because no execution endpoint exists

---

## S-15 — Assessment Result

**Route:** `/assessment-results/[attemptId]`  
**Roles:** candidate owner; recruiter owner; ADMIN route-declared but service-blocked

### API

`GET /api/v1/evaluation/attempts/:id/result`

### Data

- attemptId
- assessment
  - id
  - title
  - resultVisibility
- candidate
- candidateEmail
- status
- submittedAt
- totalScore
- maxScore
- percentage
- passed
- isFinal
- answers
  - id
  - problemId
  - problemType
  - score
  - evaluatedAt

### Components

- assessment/result header
- final/provisional badge
- score/max score
- percentage
- pass/fail
- per-question scoring summary
- visibility-state message

### Candidate Visibility Handling

- HIDDEN -> 403 hidden state
- AFTER_REVIEW + not EVALUATED -> 403 awaiting review
- IMMEDIATE + IN_PROGRESS -> 403 unavailable

### Acceptance Criteria

- candidate cannot view another candidate result
- recruiter cannot view result outside own company
- candidate does not receive correct-option flags
- `isFinal=false` is visually distinguished
- null score/percentage/pass values are not rendered as successful final values

---

## S-16 — Recruiter Dashboard

**Route:** `/recruiter/dashboard`  
**Role:** RECRUITER

### Intended API

`GET /api/v1/dashboard/recruiter`

### Current Backend Status

**BLOCKED until schema/service mismatch is fixed.** The service aggregates `Payment.creditsGranted`, but the supplied Payment model contains `creditsPurchased`.

### Intended Data After Fix

Company:

- id
- name
- creditsAvailable

Overview:

- totalAssessments
- publishedAssessments
- totalInvitations
- totalAttempts
- inProgressAttempts
- pendingEvaluations
- evaluatedAttempts
- averageScore
- averagePercentage
- passedAttempts
- failedAttempts
- passRate
- candidateStartRate
- submissionRate
- evaluationRate

Additional:

- assessmentBreakdown
- invitationBreakdown
- attemptBreakdown
- paymentSummary
- recentSubmissions
- assessmentPerformance

### Temporary Frontend Strategy

Until fixed, recruiter dashboard may use a limited composition of compatible endpoints only if product explicitly accepts extra requests. Do not silently redefine backend dashboard metrics.

### Acceptance Criteria

- production route must not depend on a known broken endpoint
- credits display comes from Company or corrected dashboard response
- payment totals must not merge USD and BDT as one meaningful currency total

---

## S-17 — Problem List

**Route:** `/recruiter/problems`  
**Role:** RECRUITER

### API

`GET /api/v1/problems`

### Data

Full active problems with options.

### Components

- page header
- create button
- type filter UI if implemented client-side
- search UI if implemented client-side
- table/cards
- type badge
- difficulty
- points
- tags
- actions menu

### Actions

- create
- view
- edit
- archive

### Acceptance Criteria

- only active problems returned by backend are displayed
- no server pagination is assumed
- archive uses confirmation
- archive invalidates list
- correct answer may be visible to recruiter

---

## S-18 — Create Problem

**Route:** `/recruiter/problems/new`  
**Role:** RECRUITER

### API

`POST /api/v1/problems`

### Fields

- title
- description
- type
- points
- difficulty optional
- tags
- options for MCQ

### Validation

- title 3–200
- description minimum 5
- type one of MCQ/WRITTEN/CODING
- points positive integer
- difficulty optional max 50
- max 10 tags
- each tag 1–50
- MCQ at least 2 options
- option text 1–1000
- exactly one correct option
- WRITTEN/CODING must not send options

### Components

- problem metadata form
- type selector
- tag input
- MCQ option editor
- correct-option radio selector
- save/cancel

### Acceptance Criteria

- changing type dynamically changes option UI
- only MCQ payload contains options
- exactly one correct option enforced
- create success seeds/invalidate list and redirects appropriately

---

## S-19 — Problem Detail

**Route:** `/recruiter/problems/[problemId]`

### API

`GET /api/v1/problems/:id`

### Components

- metadata
- description
- type/points/difficulty/tags
- MCQ options and correct answer
- edit button
- archive button

### Acceptance Criteria

- 404 shows feature-specific not-found state
- company ownership is left to backend authority
- archived item behavior follows backend response rather than guessing

---

## S-20 — Edit Problem

**Route:** `/recruiter/problems/[problemId]/edit`

### APIs

- `GET /api/v1/problems/:id`
- `PATCH /api/v1/problems/:id`

### Validation

Same effective business rules as create after merging existing values.

### Important Type Change Rule

When an MCQ becomes WRITTEN/CODING, backend removes old options even if options are omitted.

### Acceptance Criteria

- existing data populates form
- MCQ -> manual type removes options from outgoing payload or sends no options
- manual -> MCQ requires valid MCQ options
- cache for list and detail is updated/invalidated

---

## S-21 — Assessment List

**Route:** `/recruiter/assessments`  
**Role:** RECRUITER

### API

`GET /api/v1/assessments`

### Data

Non-archived assessment records plus `_count.problems`.

### Components

- create CTA
- status badge
- title
- duration
- passing score
- problem count
- created/updated date if used
- actions

### Actions

- view
- edit if DRAFT
- publish if DRAFT
- archive
- invitations if PUBLISHED
- submissions/report where useful

### Acceptance Criteria

- ARCHIVED assessments are absent
- edit/publish only shown for DRAFT
- no Close action is shown because no close endpoint exists
- archive confirmation is required

---

## S-22 — Create Assessment

**Route:** `/recruiter/assessments/new`

### APIs

- `GET /api/v1/problems`
- `POST /api/v1/assessments`

### Fields

- title
- description optional
- durationMinutes
- passingScore
- ordered problemIds

### Validation

- title 3–200
- description max 2,000
- duration 1–1,440 integer minutes
- passing score integer >=0
- 1–100 problems
- all selected problems must be active and company-owned
- passing score <= total selected points

### Components

- assessment form
- problem search/filter
- available problem list
- selected problem list
- reorder controls
- point total
- passing score validation

### Result Visibility

Do not render an editable result visibility field. Database default is confirmed as `AFTER_REVIEW`, but current create/update validation does not accept the field.

### Acceptance Criteria

- selected order maps exactly to request `problemIds`
- duplicate selected problems are prevented in UI
- point total updates immediately
- backend remains authoritative for company ownership
- created assessment is represented as DRAFT

---

## S-23 — Assessment Detail

**Route:** `/recruiter/assessments/[assessmentId]`

### API

`GET /api/v1/assessments/:id`

### Data

Assessment plus ordered problems and full problem options.

### Components

- title/description
- status
- duration
- passing score
- result visibility read-only
- ordered problem cards
- total points
- edit/publish/archive actions
- invitation/submission/report navigation

### Acceptance Criteria

- DRAFT shows edit/publish
- non-DRAFT does not show edit
- result visibility shown read-only if returned
- ARCHIVED detail returns not found under service rules

---

## S-24 — Edit Assessment

**Route:** `/recruiter/assessments/[assessmentId]/edit`

### APIs

- `GET /api/v1/assessments/:id`
- `GET /api/v1/problems`
- `PATCH /api/v1/assessments/:id`

### Permission/Rule

Only DRAFT.

### Validation

Same as create for fields being changed.

### Critical Backend Blocker

Update service writes `durationMinutes` into Prisma update data, but Prisma model field is `duration`. This is inconsistent with create, candidate, invitation, and evaluation code.

### Acceptance Criteria

- non-DRAFT cannot present functional edit form
- duration editing must be disabled or feature-gated until backend fix is released
- problem order and passing score behave consistently with create

---

## S-25 — Assessment Invitations

**Route:** `/recruiter/assessments/[assessmentId]/invitations`

### APIs

- `GET /api/v1/invitations/:assessmentId/invitations`
- `POST /api/v1/invitations/:assessmentId/invitations`

### Create Fields

- candidateEmail
- expiresAt optional ISO datetime

### Rules

- assessment must be PUBLISHED
- candidate must exist
- candidate role must be CANDIDATE
- candidate status must be ACTIVE
- expiration must be future
- default expiration is 7 days
- duplicate invitation is forbidden

### List Data

Invitation plus:

- candidate id/name/email
- attempt id/status/startedAt/expiresAt/submittedAt/score when present

### Components

- invite form
- email field
- date/time picker
- invite button
- invitation list/table
- status badge
- attempt status

### Acceptance Criteria

- nonexistent candidate 404 explains existing candidate account is required
- duplicate 409 is clear
- success invalidates invitation list
- no revoke/resend/extend action is shown

---

## S-26 — Assessment Submissions

**Route:** `/recruiter/assessments/[assessmentId]/submissions`

### API

`GET /api/v1/evaluation/assessments/:id/submissions`

### Query Parameters

- page default 1
- limit default 20, max 100
- status optional AttemptStatus
- q optional candidate name/email search

### Response

`meta`:

- page
- limit
- total
- totalPages

`data` item:

- id
- status
- startedAt
- expiresAt
- submittedAt
- totalScore
- percentage
- passed
- candidate
- candidateEmail
- answerCount
- evaluatedAnswerCount
- createdAt
- updatedAt

### Components

- search
- attempt-status filter
- pagination
- submission table
- evaluation progress
- open-evaluation action

### Acceptance Criteria

- filters are synchronized to URL
- changing filter/search resets page
- search is debounced
- pagination uses server metadata
- no client-side full-dataset assumption

---

## S-27 — Attempt Evaluation

**Route:** `/recruiter/evaluations/[attemptId]`

### APIs

- `GET /api/v1/evaluation/attempts/:id/evaluation`
- `PATCH /api/v1/evaluation/attempts/:id/answers/:answerId/evaluate`
- `POST /api/v1/evaluation/attempts/:id/finalize-evaluation`

### Required Data

Attempt:

- id/status/dates/score/percentage/passed
- candidate
- candidateEmail
- assessment id/title/duration/passingScore/resultVisibility
- ordered questions

Each question:

- assessmentProblemId
- order
- full problem
- answer or null
- maxScore
- requiresManualEvaluation

### Components

- candidate summary
- assessment summary
- evaluation progress
- question cards
- MCQ correct/selected indication for recruiter
- read-only MCQ score
- manual answer content
- score input
- optional feedback field clearly labeled as non-persistent/internal unless backend changes
- save evaluation button
- finalize button

### Validation

- score numeric/coercible
- minimum 0
- maximum problem points
- feedback max 5,000

### Rules

- IN_PROGRESS cannot be evaluated
- EXPIRED cannot be evaluated
- EVALUATED cannot change
- MCQ cannot be manually changed

### Acceptance Criteria

- MCQ scoring is read-only
- manual score is constrained to maxScore
- answer mutation updates evaluation cache
- finalization only considered successful after backend response
- EVALUATED screen becomes read-only
- feedback is not promised as persistent candidate feedback
- missing manual Answer edge case is handled as backend 409 and surfaced clearly

---

## S-28 — Assessment Report

**Route:** `/recruiter/assessments/[assessmentId]/report`

### API

`GET /api/v1/evaluation/assessments/:id/report`

### Data

Assessment:

- id
- title
- status
- passingScore
- resultVisibility

Metrics:

- invited
- started
- submitted
- evaluated
- averageScore
- averagePercentage
- passRate

### Components

- KPI cards
- assessment funnel
- average score
- average percentage
- pass rate
- result visibility badge

### Acceptance Criteria

- backend metrics are displayed rather than recomputed differently
- empty evaluated dataset displays backend zero values cleanly
- result visibility is read-only

---

## S-29 — Company Settings

**Route:** `/recruiter/company`

### APIs

- `GET /api/v1/companies/me`
- `PATCH /api/v1/companies/me`

### Editable Field

- name

### Read-only Fields

- id
- slug
- credits
- companyLicensePaperUrl
- selfDocumentUrl
- timestamps where useful

Infrastructure IDs should not be shown by default:

- companyLicensePaperPublicId
- selfDocumentPublicId

### Validation

- name 2–150

### Acceptance Criteria

- rename updates slug server-side when needed
- company cache invalidated/updated after success
- documents are read-only because no replacement endpoint exists
- credit balance is read-only

---

## S-30 — Recruiter Billing

**Route:** `/recruiter/billing`

### APIs

- `POST /api/v1/stripe-payments/checkout`
- `POST /api/v1/bkash-payments/checkout`
- one payment-list endpoint, subject to provider ambiguity
- `GET /api/v1/companies/me` for reliable current credit balance

### Components

- current credits
- provider tabs/cards
- package cards
- checkout CTA
- payment history
- status filters

### Stripe Packages

- STARTER: 10 credits, USD 10
- GROWTH: 50 credits, USD 40
- SCALE: 150 credits, USD 100

### bKash Packages

- STARTER: 10 credits, BDT 500
- GROWTH: 50 credits, BDT 2,000
- SCALE: 150 credits, BDT 5,000

### Payload

Only:

- packageCode

### Acceptance Criteria

- browser never sends authoritative amount/credits
- repeated checkout click is prevented
- redirect uses backend-returned URL
- company credits are not incremented optimistically
- returning user refreshes payment/company status
- unified payment history must not guess provider or currency

---

## S-31 — Payment Detail

**Route:** `/recruiter/billing/payments/[paymentId]`

### API

Recommended single canonical read until provider modeling is fixed:

`GET /api/v1/stripe-payments/:id`

Both Stripe and bKash read services query the same Payment table by company and do not actually provider-filter.

### Data

Confirmed Payment fields:

- id
- amount
- creditsPurchased
- status
- stripeSessionId
- stripePaymentIntentId
- bkashPaymentId
- bkashTransactionId
- invoiceNumber
- invoiceEmailSentAt
- companyId
- timestamps

### Acceptance Criteria

- other company payment returns not found
- provider is not guessed from endpoint name
- currency is not guessed if backend has not supplied an explicit reliable contract
- no refund action is shown

---

## S-32 — Stripe Success

**Route:** TBC; backend default is `/payments/success?session_id=...`

### Purpose

Return surface after Stripe Checkout.

### APIs

No dedicated “confirm success” endpoint exists.

Recommended frontend behavior:

- show processing state
- refetch company credits and payment history
- poll at conservative intervals for a short bounded period if the payment is still PENDING
- never mark success based only on the redirect query string

### Acceptance Criteria

- webhook-confirmed backend status is authoritative
- session ID is not treated as proof of payment
- user has navigation back to billing

---

## S-33 — Stripe Cancel

**Route:** TBC; backend default is `/payments/cancel`

### Purpose

Inform user that checkout was not completed.

### Acceptance Criteria

- no credits are changed client-side
- user can return to billing and retry
- cancellation is not presented as a backend SUCCEEDED state

---

## S-34 — Admin Dashboard

**Route:** `/admin/dashboard`

### Recommended Compatible API

`GET /api/v1/admin/dashboard-stats`

### Why Not `/dashboard/admin` Yet

The richer endpoint references Payment fields absent from supplied Prisma schema.

### Compatible Stats Data

Users:

- total
- active
- suspended
- byRole admin/recruiter/candidate

Companies:

- total

Problems:

- total

Assessments:

- total/draft/published/closed/archived

Invitations:

- total/pending/accepted/revoked

Attempts:

- total/inProgress/submitted/evaluated/expired

Payments:

- total/pending/succeeded/failed
- successfulAmount
- creditsPurchased

### Components

- KPI cards
- user role distribution
- user status distribution
- assessment status summary
- attempt status summary
- payment summary

### Acceptance Criteria

- compatible endpoint is used until richer dashboard is fixed
- successfulAmount is not labelled as a universal currency total when mixed Stripe/bKash records exist

---

## S-35 — Admin Users

**Route:** `/admin/users`

### APIs

- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id/status`

### Query Parameters

- page
- limit max 100
- q
- role
- status
- sortBy
- sortOrder

Sort fields:

- createdAt
- updatedAt
- email
- name
- role
- status

### Components

- search
- role filter
- status filter
- sortable table
- pagination
- status change confirmation

### Actions

- set ACTIVE
- set SUSPENDED

### Acceptance Criteria

- current admin cannot modify their own status
- filters live in URL
- mutation invalidates user/admin-stat queries
- safe user data only is displayed

---

## S-36 — Admin Audit Logs

**Route:** `/admin/audit-logs`

### API

`GET /api/v1/admin/audit-logs`

### Query Parameters

- page
- limit
- actorId
- action
- entityType
- entityId
- from
- to
- sortOrder

### Data

AuditLog plus optional actor safe user object.

### Components

- filter toolbar
- date range
- action/entity search fields
- table
- actor display
- metadata JSON viewer
- pagination

### Acceptance Criteria

- JSON metadata is rendered safely as text/data
- no HTML execution
- dates submitted to API are ISO datetimes
- filters are URL synchronized

---

## S-37 — Admin Payments

**Route:** `/admin/payments`

### API

`GET /api/v1/admin/payments`

### Query Parameters

- page
- limit
- status
- companyId
- sortOrder

### Data

Payment plus company:

- id
- name
- slug

### Components

- status filter
- company ID filter/search input
- payment table
- pagination

### Acceptance Criteria

- no refund button is shown
- amount is not universally labelled as one currency
- provider is not invented
- Payment `creditsPurchased` is used, not nonexistent `creditsGranted`

---

# 11. Functional Requirements

## 11.1 Authentication

- **FR-AUTH-01:** System shall support email/password login.
- **FR-AUTH-02:** System shall support Google credential login.
- **FR-AUTH-03:** Candidate registration shall require email OTP verification.
- **FR-AUTH-04:** Recruiter registration shall require email OTP verification.
- **FR-AUTH-05:** Recruiter registration shall require two PDF documents.
- **FR-AUTH-06:** Public candidate registration shall not send a role.
- **FR-AUTH-07:** Password recovery shall use OTP followed by temporary reset token.
- **FR-AUTH-08:** Suspended users shall not be treated as successfully authenticated.
- **FR-AUTH-09:** Client shall clear private query data when session ends.

## 11.2 Problems

- **FR-PROB-01:** Recruiter shall manage only company-scoped problems through backend-authorized endpoints.
- **FR-PROB-02:** Problem type shall be MCQ, WRITTEN, or CODING.
- **FR-PROB-03:** MCQ shall require at least two options and exactly one correct option.
- **FR-PROB-04:** WRITTEN/CODING shall not contain MCQ options.
- **FR-PROB-05:** Archive shall be represented as a soft archive action.

## 11.3 Assessments

- **FR-ASMT-01:** Recruiter shall create an assessment from 1–100 active company problems.
- **FR-ASMT-02:** Selected problem order shall be preserved.
- **FR-ASMT-03:** Passing score shall not exceed total possible points.
- **FR-ASMT-04:** Only DRAFT assessment shall expose edit.
- **FR-ASMT-05:** Only DRAFT assessment shall expose publish.
- **FR-ASMT-06:** Current UI shall treat result visibility as read-only/default AFTER_REVIEW.
- **FR-ASMT-07:** No Close action shall be exposed without a backend endpoint.

## 11.4 Invitations

- **FR-INV-01:** Recruiter shall invite existing active candidates to PUBLISHED assessments.
- **FR-INV-02:** Invitation default lifetime shall be understood as seven days when no date is sent.
- **FR-INV-03:** Frontend shall support `/invitations/accept?token=...`.
- **FR-INV-04:** UI shall represent invalid, expired, unavailable, and inactive-candidate cases.
- **FR-INV-05:** UI shall not invent revoke/resend/extend operations.

## 11.5 Attempts

- **FR-ATT-01:** Candidate shall start only an assigned assessment.
- **FR-ATT-02:** Existing IN_PROGRESS attempt shall resume rather than create another.
- **FR-ATT-03:** Candidate workspace shall display ordered questions.
- **FR-ATT-04:** Candidate shall never receive/display `isCorrect`.
- **FR-ATT-05:** MCQ answer shall persist selectedOptionId.
- **FR-ATT-06:** WRITTEN/CODING answer shall persist answerText.
- **FR-ATT-07:** Answers shall autosave to upsert endpoint.
- **FR-ATT-08:** `expiresAt` shall be authoritative deadline.
- **FR-ATT-09:** Candidate shall explicitly confirm manual submission.
- **FR-ATT-10:** Non-active attempts shall be read-only.
- **FR-ATT-11:** CODING shall be treated as textual answer only until execution API exists.

## 11.6 Evaluation

- **FR-EVAL-01:** MCQ scores shall be automatic/read-only.
- **FR-EVAL-02:** Manual score shall be in range 0..problem.points.
- **FR-EVAL-03:** Manual evaluation shall require existing Answer record.
- **FR-EVAL-04:** Finalization shall require all manual problem answers to have scores under current backend behavior.
- **FR-EVAL-05:** Finalized evaluation shall become read-only.
- **FR-EVAL-06:** Candidate result shall obey resultVisibility.
- **FR-EVAL-07:** Feedback shall not be represented as persistent result feedback under current schema.

## 11.7 Payments

- **FR-PAY-01:** Frontend shall send packageCode only for checkout pricing selection.
- **FR-PAY-02:** Backend-provided checkout URL shall be used for redirect.
- **FR-PAY-03:** Client shall not grant credits optimistically.
- **FR-PAY-04:** Company credit balance shall be refreshed after payment return.
- **FR-PAY-05:** No refund UI shall exist without endpoint.
- **FR-PAY-06:** Provider/currency shall not be inferred where backend lacks explicit field.

## 11.8 Admin

- **FR-ADMIN-01:** Admin shall list/search/filter/sort users.
- **FR-ADMIN-02:** Admin shall update another user's ACTIVE/SUSPENDED status.
- **FR-ADMIN-03:** Admin shall not change own status using this API/UI.
- **FR-ADMIN-04:** Admin shall inspect audit logs.
- **FR-ADMIN-05:** Admin shall inspect payments.
- **FR-ADMIN-06:** Admin dashboard shall use schema-compatible stats until richer dashboard endpoint is fixed.

---

# 12. API Integration and ofetch Strategy

## 12.1 Single Transport Client

Create one shared ofetch client responsible for:

- base URL
- request headers
- bearer/session integration
- JSON content handling
- multipart passthrough
- response envelope unwrapping
- normalized API errors
- timeout policy
- request cancellation through AbortSignal where appropriate
- 401 handling

Presentation components must not construct backend URLs manually.

## 12.2 API Envelope Type

Conceptually all normal successful handlers use:

```text
ApiSuccess<T> = {
  success: true
  message: string
  data?: T
}
```

Normal errors use:

```text
ApiError = {
  success: false
  message: string
  errors?: unknown
}
```

Payment/bKash custom errors may currently be flattened to generic 500 by global middleware. Frontend must therefore have a generic fallback.

## 12.3 HTTP Error UX

### 400

Use field errors where backend validation path can map to form; otherwise form/page error.

### 401

- clear invalid session
- clear private query cache
- redirect to login
- preserve intended route when safe

### 403

Do not collapse all 403 into “Forbidden”. Examples:

- suspended account
- hidden result
- result awaiting review
- ownership/role denial

### 404

Use resource-specific not-found UI.

### 409

Examples:

- duplicate email
- duplicate invitation
- finalized attempt mutation
- manual evaluation incomplete

### 410

Invitation expired.

### 500/502

Use retry only when the operation is safe to repeat.

## 12.4 BFF Recommendation

Recommended production architecture:

- browser -> same-origin Next.js BFF/session endpoint -> Express backend
- access token kept in Secure HttpOnly SameSite cookie or server-side session wrapper
- Next proxy attaches `Authorization: Bearer ...`

This avoids storing backend JWT in localStorage.

If direct browser-to-backend mode is chosen, it must receive explicit security review because the backend only provides a bearer access token and no refresh token.

---

# 13. TanStack Query Strategy

## 13.1 Query Key Factories

Use feature-owned key factories, not ad hoc arrays scattered through UI.

### Auth

- `['auth', 'me']`

### Company

- `['company', 'me']`

### Dashboard

- `['dashboard', 'candidate']`
- `['dashboard', 'recruiter']`
- `['dashboard', 'admin-stats']`

### Problems

- `['problems', 'list']`
- `['problems', 'detail', problemId]`

### Assessments

- `['assessments', 'list']`
- `['assessments', 'detail', assessmentId]`

### Invitations

- `['invitations', 'verify', token]`
- `['invitations', 'assessment', assessmentId]`

### Candidate

- `['candidate', 'assessments']`

### Attempts

- `['attempts', 'mine']`
- `['attempts', 'detail', attemptId]`

### Evaluation

- `['evaluation', 'submissions', assessmentId, filters]`
- `['evaluation', 'attempt', attemptId]`
- `['evaluation', 'result', attemptId]`
- `['evaluation', 'report', assessmentId]`

### Payments

- `['payments', 'recruiter', filters]`
- `['payments', 'detail', paymentId]`

### Admin

- `['admin', 'users', filters]`
- `['admin', 'audit-logs', filters]`
- `['admin', 'payments', filters]`
- `['admin', 'stats']`

## 13.2 Query Defaults

Recommended starting policy:

- `refetchOnWindowFocus`: selective, not globally aggressive
- GET query retries: limited retry for network/5xx only
- 4xx: do not automatically retry
- auth 401: no retry
- mutation retry: off by default
- `gcTime`: normal TanStack default or explicitly documented project value

## 13.3 Staleness Guidelines

- auth/me: short/moderate
- company: moderate
- problem list/detail: moderate
- assessment list/detail: moderate
- invitation verification: short
- candidate dashboard: 30–60 seconds
- candidate assessment list: short
- active attempt detail: short but avoid disruptive overwrites
- submission/evaluation lists: short
- reports: short/moderate
- admin tables: short/moderate
- payment status after checkout: short bounded polling only

## 13.4 Mutation Invalidation Matrix

| Mutation | Invalidate/update |
|---|---|
| Register/login/verify | auth session + role entry state |
| Company update | company, recruiter dashboard |
| Problem create | problem list |
| Problem update | problem detail + list |
| Problem archive | problem detail/list |
| Assessment create | assessment list |
| Assessment update | assessment detail/list |
| Assessment publish | assessment detail/list, recruiter dashboard when fixed |
| Assessment archive | assessment list/detail |
| Invitation create | assessment invitations, recruiter metrics |
| Start assessment | candidate assessments, attempts, candidate dashboard; seed attempt detail |
| Save answer | update attempt-detail answer locally from response |
| Submit attempt | attempt detail, mine, candidate assessments, candidate dashboard, result |
| Evaluate answer | evaluation attempt, submissions |
| Finalize evaluation | evaluation attempt, submissions, report, result, relevant dashboards |
| Checkout return/refetch | company, payment list/detail |
| Admin user status | admin users, admin stats |

## 13.5 Mutation Retry Safety

Do not automatically retry:

- start assessment
- submit attempt
- create invitation
- publish/archive assessment
- finalize evaluation
- create payment checkout

Autosave may retry transport failures cautiously because the backend upsert operation is naturally repeatable for the same current answer, but race protection is still required.

---

# 14. TanStack Form + Zod Strategy

## 14.1 Forms Using TanStack Form

- login
- candidate registration
- registration OTP
- recruiter registration
- recruiter OTP
- forgot password
- reset verification
- reset password
- problem create/edit
- assessment create/edit
- invitation
- company update
- manual answer evaluation

## 14.2 Validation Source

Frontend Zod schemas should mirror backend validation exactly where possible.

Frontend-only cross-field validation may add:

- password confirmation
- passing score <= selected total points
- exactly one correct option UX
- file validation
- invitation date > current client time before server validation
- manual score <= maxScore

Backend remains authoritative.

## 14.3 Error Path Mapping

Backend validation may identify paths similar to:

- `body.email`
- `body.options`
- `params.id`

Create one common mapper that:

1. normalizes path
2. maps body fields to form fields
3. maps unmatched issues to form-level error
4. preserves backend message

## 14.4 Recruiter Multipart Form

Use FormData. Do not JSON-encode the file fields.

Do not manually set a multipart boundary header; allow browser/ofetch to produce it.

---

# 15. Authentication and Authorization Architecture

## 15.1 Backend Authentication Contract

Backend expects:

`Authorization: Bearer <accessToken>`

No refresh-token endpoint is supplied.

JWT default expiry in backend config/code should be treated as backend-controlled; frontend must not assume endless session validity.

## 15.2 Recommended Session Design

Preferred:

1. auth island posts to Next BFF
2. BFF calls Express backend
3. BFF receives accessToken
4. token is stored HttpOnly/Secure/SameSite
5. browser only receives sanitized user/session result
6. same-origin BFF attaches bearer token to backend requests

## 15.3 Role Guards

Candidate shell expects CANDIDATE.  
Recruiter shell expects RECRUITER.  
Admin shell expects ADMIN.

Guard behavior:

- no session -> login
- wrong role -> role home or forbidden route
- 401 from API -> expire session
- 403 from business endpoint -> show business-specific state

## 15.4 Logout

Because no backend logout endpoint exists, frontend logout means:

- delete local/BFF token cookie
- clear QueryClient private cache
- clear temporary workflow state
- route to login

## 15.5 Session Cache Isolation

Query cache must never leak private data between users in the same browser session after logout/login.

On logout or account switch, clear all role/user scoped data.

---

# 16. Assessment Timer, Autosave, and Submission Requirements

## 16.1 Authoritative Deadline

Use server `attempt.expiresAt`.

Do not initialize a timer solely from `assessment.duration` because the actual attempt can be shortened by invitation expiration.

## 16.2 Timer Calculation

Remaining time:

`max(0, expiresAt - currentWallClockTime)`

Recompute from the wall clock rather than decrementing a counter as the source of truth.

Recalculate after:

- tab visibility changes
- browser focus
- computer sleep/wake
- route hydration
- network reconnect

## 16.3 Timer UI

Show:

- time remaining
- normal/warning/critical visual states
- accessible text status

Do not announce every second through a screen reader.

Warning thresholds are frontend UX choices and must be documented in implementation tests.

## 16.4 Autosave Rules

### MCQ

Save immediately on selected option change.

### WRITTEN/CODING

Recommended:

- update local buffer immediately
- debounce network save around 500–1000 ms
- save on blur
- flush before manual submission

## 16.5 Per-Question Save State

Maintain:

- idle/unchanged
- unsaved
- saving
- saved
- failed

User must be able to distinguish local text from confirmed server save.

## 16.6 Race Condition Protection

For each problem:

- maintain monotonically increasing local save version or serial queue
- only latest response may confirm latest local value
- stale responses must not overwrite newer text/selection

## 16.7 Offline/Temporary Network Failure

No true offline assessment contract exists.

Frontend may:

- retain unsaved local buffer in memory
- optionally retain temporary session-scoped draft locally after security review
- show disconnected state
- retry pending save while attempt is still active

Frontend must not:

- extend server deadline
- claim offline submission
- assume a local answer is safely persisted

## 16.8 Submission Flow

1. Candidate clicks Submit.
2. Frontend flushes pending autosaves.
3. Frontend displays answered/unanswered summary.
4. Candidate confirms.
5. Submit mutation executes once.
6. Submit controls are locked while pending.
7. Success replaces/updates attempt cache.
8. Workspace becomes read-only.

## 16.9 Expiry Behavior — Critical Backend Gap

`assertAttemptCanBeEdited` changes an expired IN_PROGRESS attempt to EXPIRED and throws. The same guard is used by submit.

Therefore once server time reaches/exceeds `expiresAt`, frontend cannot submit saved answers successfully through `/submit`.

There is no automatic server finalization at deadline.

This cannot be solved reliably only in browser code.

Required backend product decision:

- auto-submit at expiry, or
- mark expired and treat saved answers under a defined evaluation rule, or
- introduce grace period/server scheduler

Until fixed, frontend should:

- keep aggressive save status visibility near deadline
- stop edits at local zero
- call backend and present actual EXPIRED response
- never claim successful submission if backend rejected it

---

# 17. Evaluation, Reports, Invitations, and Payment Requirements

## 17.1 Evaluation UI Logic

### MCQ

Recruiter may see:

- all options
- correct option flag
- candidate selected option
- auto score

Recruiter may not edit score.

### WRITTEN/CODING

Recruiter may see:

- candidate answer text
- problem points
- manual score field
- optional feedback input under current API

Feedback warning: it is stored only in AuditLog metadata, not Answer.

## 17.2 Missing Manual Answer Problem

If candidate never saved a WRITTEN/CODING answer:

- no Answer row exists
- evaluation serializer returns `answer: null`
- manual evaluation endpoint requires an `answerId`
- finalization sees missing manual problem and returns 409

Frontend cannot create a zero-score Answer because no recruiter endpoint exists for that.

This is a production blocker for finalization of unanswered manual questions.

## 17.3 Report Rules

Use report endpoint as source of truth.

Do not recompute report metrics with a different denominator.

## 17.4 Invitation Rules

No frontend actions for:

- revoke
- resend
- extend

Statuses may still display REVOKED/EXPIRED if returned.

## 17.5 Payment Rules

Frontend owns display/checkout initiation only.

Backend owns:

- pricing
- package credits
- payment success
- credit granting
- invoice email

## 17.6 Payment Provider/Currency Problem

The Payment schema lacks provider and currency.

Current facts:

- Stripe prices are USD
- bKash prices are BDT
- both write to `amount`
- both write to same Payment table
- Stripe list and bKash list filter only by company/status
- bKash stores its payment ID in `stripeSessionId` during creation

Therefore frontend must not present a single “total spent” currency without backend correction.

---

# 18. Loading, Empty, Error, and Success States

## 18.1 Loading

Use:

- static shell immediately
- skeletons for island data
- button pending states for mutations
- row/card skeletons for lists
- inline autosave indicator
- non-blocking refetch indicator

Avoid turning the entire application into a blocking spinner.

## 18.2 Empty States

Required examples:

- no problems
- no assessments
- no invitations
- no submissions
- no attempts
- no results yet
- no payments
- no audit logs
- no admin user matches

Include the next valid action only when the current role and backend support it.

## 18.3 Error States

Required:

- route error boundary
- query-level retry for safe GET
- form-level API error
- field validation errors
- invitation invalid
- invitation expired
- assessment unavailable
- result hidden
- result awaiting review
- attempt expired
- save failed
- payment creation failed
- payment still pending
- generic backend error

## 18.4 Success Feedback

Use toast plus persistent state change where appropriate for:

- problem create/update/archive
- assessment create/update/publish/archive
- invitation create
- company update
- manual score save
- finalization
- admin user status update

Important state transitions must not be communicated only by disappearing toast.

---

# 19. Responsive UI/UX Requirements

## 19.1 Navigation

Desktop:

- role sidebar
- top header
- main content area

Mobile:

- drawer/sheet navigation
- accessible menu trigger
- no hidden primary action

## 19.2 Tables

Prefer responsive cards on narrow widths where columns would become unreadable.

If horizontal scrolling is required:

- keep key identifier/status/action columns understandable
- provide sticky headers where helpful

## 19.3 Forms

- labels always visible
- errors adjacent to fields
- touch targets appropriate for mobile
- destructive actions clearly separated
- dialogs usable on small screens

## 19.4 Attempt Workspace

Mobile requirements:

- timer remains visible
- question navigation accessible via sheet/drawer
- option tap targets are large
- text answer area has sufficient height
- submit action remains accessible without covering answer content

## 19.5 Accessibility

Target WCAG 2.1 AA behavior.

Requirements:

- keyboard navigation
- visible focus
- semantic labels
- accessible dialogs
- no color-only statuses
- appropriate contrast
- screen-reader form errors
- restrained timer announcements
- textual alternatives for charts
- tables use correct headers

---

# 20. Security Requirements

## 20.1 Authentication Security

- **SEC-01:** Prefer HttpOnly Secure SameSite cookie/session proxy over localStorage bearer token.
- **SEC-02:** Never expose access token in URL, logs, analytics payload, or visible UI.
- **SEC-03:** Never log password, OTP, resetToken, Google credential, or recruiter document contents.
- **SEC-04:** Clear private QueryClient data on logout/session invalidation.
- **SEC-05:** Treat backend 401 as session invalidation, not as an endlessly retryable request.

## 20.2 Authorization Security

- **SEC-06:** Frontend role guards are UX only; backend is authoritative.
- **SEC-07:** Candidate attempt UI must not contain `ProblemOption.isCorrect` in types/state/props.
- **SEC-08:** Recruiter company ownership must not be inferred or bypassed client-side.
- **SEC-09:** Admin evaluation UI must remain disabled until backend service authorization matches route permission.

## 20.3 Input and Output Security

- **SEC-10:** Render backend/user content as escaped text by default.
- **SEC-11:** Do not use `dangerouslySetInnerHTML` for problem descriptions or audit metadata without an explicitly defined sanitized markup contract.
- **SEC-12:** Validate recruiter file type and size client-side, but rely on backend enforcement too.
- **SEC-13:** Audit metadata JSON viewer must not execute embedded markup/script.
- **SEC-14:** Client-side Zod validation must not be treated as security validation.

## 20.4 Payment Security

- **SEC-15:** Never trust amount/credits from browser; send packageCode only.
- **SEC-16:** Never grant credits based only on payment redirect.
- **SEC-17:** Use backend payment status as authority.
- **SEC-18:** Do not expose public UI controls for bKash execute/query endpoints merely because routes are public; those are provider/process endpoints, not normal end-user actions.
- **SEC-19:** Validate external redirect URL origin/contract according to backend provider configuration before navigation if feasible.

## 20.5 Browser Security

Recommended:

- strict Content Security Policy compatible with Google/Stripe/bKash requirements
- `frame-ancestors` policy appropriate to product
- HTTPS only in production
- secure cookie flags
- minimal third-party scripts
- no sensitive query parameters beyond provider-required IDs

---

# 21. Performance Requirements

- **PERF-01:** Public route shells shall be statically generated/static-prerendered where practical.
- **PERF-02:** Keep client islands small and feature-scoped.
- **PERF-03:** Avoid marking full layouts `use client` when only a nested feature is interactive.
- **PERF-04:** Use TanStack Query caching to avoid duplicate backend requests.
- **PERF-05:** Use server pagination for submissions/admin lists/payments/audit logs/users.
- **PERF-06:** Problem and assessment endpoints currently return unpaginated lists; monitor volume and request backend pagination before scale becomes a UX issue.
- **PERF-07:** Load chart code only on dashboard/report pages.
- **PERF-08:** Debounce server-backed text search.
- **PERF-09:** Do not refetch active attempt detail on a cadence that overwrites local editing state.
- **PERF-10:** Use route-level code splitting and dynamic import for heavy optional visualization modules.
- **PERF-11:** Keep autosave payloads problem-scoped rather than repeatedly sending full attempt state.
- **PERF-12:** Avoid optimistic payment success.

### Suggested Performance Targets

These are frontend engineering targets, not backend contractual guarantees:

- static shell should become visible quickly even on slower connections
- interaction-ready auth forms should hydrate without loading dashboard libraries
- table/filter interaction should not require full page navigation
- autosave UI should acknowledge local edit immediately, independent of network latency

---

# 22. Testing Requirements

## 22.1 Unit Tests — Vitest

Test pure logic for:

- query key factories
- API envelope parsing
- API error normalization
- role redirect rules
- result visibility policies
- assessment point calculations
- passing score validation
- problem type validation
- invitation date validation
- timer remaining-time calculation
- payment display rules
- date formatting helpers

## 22.2 Component Tests — React Testing Library

### Authentication

- email validation
- login loading/error states
- Google login error
- registration password confirmation
- OTP formatting
- no role selector in candidate registration
- recruiter PDF validation
- reset password flow state

### Problems

- MCQ option editor
- minimum options
- exactly one correct option
- manual problem hides options
- type-switch behavior

### Assessments

- problem selector
- ordered selection
- total points
- passing score bound
- draft-only actions
- no result visibility editor

### Invitations

- valid invitation
- invalid token
- expired token
- candidate missing/inactive messages

### Attempt

- MCQ rendering
- WRITTEN rendering
- CODING textual rendering
- timer
- answered/unanswered state
- autosave pending/saved/failed
- race protection behavior
- submit confirmation
- expired state
- non-active read-only state

### Evaluation

- MCQ read-only score
- manual max-score validation
- answer null state
- finalization 409 state
- finalized read-only state

### Payments

- package display
- checkout button loading
- no optimistic credit change
- pending/succeeded/failed states
- no universal currency inference

### Admin

- search/filter state
- pagination
- own status action disabled
- audit metadata viewer safety

## 22.3 API Mocking — MSW

Mock at minimum:

- 200/201 success
- 400 validation
- 401 invalid session
- 403 inactive/forbidden/result hidden/result pending review
- 404 not found
- 409 conflict
- 410 invitation expired
- 500 generic error
- 502 provider error
- delayed network
- aborted request
- offline/network failure

## 22.4 End-to-End — Playwright

### E2E-01 Candidate registration

Register -> OTP -> authenticated candidate area.

### E2E-02 Candidate Google login

Mock/controlled Google credential -> backend login -> candidate redirect.

### E2E-03 Recruiter onboarding

Register -> two PDFs -> OTP -> company created.

### E2E-04 Problem lifecycle

Create MCQ -> view -> edit -> archive.

### E2E-05 Manual problem lifecycle

Create WRITTEN/CODING -> ensure no options payload.

### E2E-06 Assessment draft

Select/reorder problems -> calculate points -> create DRAFT.

### E2E-07 Publish and invite

Publish -> invite existing candidate -> candidate receives/opens invitation flow.

### E2E-08 Start/resume attempt

Start -> refresh -> resume same attempt.

### E2E-09 Autosave

Answer MCQ/manual questions -> verify save updates -> reload -> server data restored.

### E2E-10 Submit MCQ-only

Submit -> verify backend score result semantics.

### E2E-11 Submit mixed assessment

Submit -> SUBMITTED -> recruiter evaluates -> finalize -> EVALUATED.

### E2E-12 Candidate result after review

Before review -> 403 awaiting review; after finalize -> visible result.

### E2E-13 Hidden result

Backend fixture with HIDDEN -> result hidden state.

### E2E-14 Admin user management

List -> search -> filter -> change another user status -> own action disabled.

### E2E-15 Stripe checkout

Mock backend checkout -> redirect target -> return -> backend status refresh.

### E2E-16 bKash checkout

Mock checkout URL -> callback/return behavior after backend flow is finalized.

## 22.5 Timer-Specific Tests

Required scenarios:

- normal countdown
- browser hidden then shown
- OS sleep/wake
- page refresh during attempt
- network failure near expiry
- autosave in flight at expiry
- submit just before deadline
- submit after server deadline -> EXPIRED
- server/client clock difference

Use fake timers only for pure timer utilities; E2E should include real wall-clock reconciliation logic where practical.

## 22.6 Accessibility Tests

Automate and manually inspect:

- keyboard-only navigation
- dialogs
- forms
- validation messages
- drawer/sidebar
- assessment question navigation
- timer announcement behavior
- table semantics
- chart textual equivalents

---

# 23. Development Phases and Roadmap

## Phase 0 — Backend Contract Alignment

Before production frontend implementation of affected modules, resolve:

1. assessment update `durationMinutes` vs Prisma `duration`
2. public registration role security
3. unanswered manual question finalization
4. expiry/auto-submit policy
5. admin evaluation authorization mismatch
6. admin result authorization mismatch
7. resultVisibility update requirement
8. payment provider field
9. payment currency field
10. bKash using `stripeSessionId`
11. payment list provider ambiguity
12. Stripe invoice currency incorrectly labelled BDT
13. recruiter dashboard `creditsGranted` mismatch
14. admin dashboard nonexistent Payment fields
15. credit consumption business rule
16. bKash callback frontend redirect UX
17. payment custom error integration with global middleware

## Phase 1 — Project Foundation

Deliver:

- Next.js 16.0.3 App Router
- TypeScript strict mode
- Tailwind
- shadcn/ui
- layered feature folders
- static shell layout conventions
- QueryClient provider
- ofetch API client
- error normalization
- session architecture
- Zod conventions
- TanStack Form conventions
- lint/format
- Vitest/RTL/MSW/Playwright setup

## Phase 2 — Public Authentication

Deliver:

- landing shell
- login
- Google login
- candidate registration
- candidate OTP
- recruiter registration
- recruiter OTP
- forgot/reset password
- role redirect logic

## Phase 3 — Recruiter Core Authoring

Deliver:

- company settings
- problem list/detail/create/edit/archive
- assessment list/detail/create
- publish/archive
- assessment edit excluding blocked duration behavior until fixed

## Phase 4 — Invitations and Candidate Portal

Deliver:

- assessment invitations
- public invitation verification
- candidate dashboard
- candidate assessment list
- attempt history
- start/resume

## Phase 5 — Assessment Workspace

Deliver:

- attempt fetch
- question renderer
- MCQ/manual input
- question navigation
- wall-clock timer
- autosave queue/versioning
- save status
- submission confirmation
- read-only attempt states

Production release depends on expiry policy resolution.

## Phase 6 — Evaluation and Results

Deliver:

- submissions list
- evaluation page
- manual score
- finalization
- candidate/recruiter result page
- assessment report

Production release depends on unanswered manual-answer fix.

## Phase 7 — Billing

Deliver after payment model alignment:

- company credits
- Stripe packages/checkout
- bKash packages/checkout
- payment return states
- payment list/detail

## Phase 8 — Admin

Deliver:

- compatible admin stats dashboard
- users
- user status update
- audit logs
- payments

Defer admin evaluation until backend authorization is fixed.

## Phase 9 — Hardening

- full regression
- accessibility audit
- responsive QA
- performance review
- security review
- error monitoring
- production payment tests
- timer reliability tests
- browser support tests

---

# 24. Backend-to-Frontend Traceability Matrix

| Backend Contract | Frontend Route/Feature | Primary Requirements |
|---|---|---|
| User model / UserRole | all auth + role shells | FR-AUTH, authorization |
| Company model | recruiter company/billing | company/credits |
| Problem + ProblemOption | problem CRUD + attempts | FR-PROB, candidate secrecy |
| Assessment + AssessmentProblem | assessment authoring/attempts | FR-ASMT, ordering |
| Invitation | invitation screens/candidate assignment | FR-INV |
| Attempt + Answer | assessment workspace/history | FR-ATT |
| AuditLog | admin audit/evaluation feedback metadata | FR-ADMIN, evaluation note behavior |
| Payment | billing/admin payments | FR-PAY |
| `POST /auth/register` | `/register` | candidate registration |
| `POST /auth/verify-registration-otp` | `/register/verify` | candidate activation |
| `POST /auth/login` | `/login` | session |
| `POST /auth/google` | `/login` | Google session |
| `GET /auth/me` | auth bootstrap | route/session identity |
| `POST /auth/forgot-password` | `/forgot-password` | recovery |
| `POST /auth/verify-forgot-password-otp` | `/forgot-password/verify` | recovery token |
| `POST /auth/reset-password` | `/reset-password` | password replacement |
| `POST /recruiters/register` | `/register/recruiter` | recruiter onboarding |
| `POST /recruiters/verify-otp` | recruiter verification | recruiter/company creation |
| `GET /companies/me` | `/recruiter/company`, billing | company/credits |
| `PATCH /companies/me` | `/recruiter/company` | rename |
| `GET /problems` | problem list + assessment form | active problem source |
| `POST /problems` | problem create | authoring |
| `GET /problems/:id` | problem detail/edit | authoring |
| `PATCH /problems/:id` | problem edit | authoring |
| `DELETE /problems/:id` | problem list/detail | archive |
| `GET /assessments` | assessment list | authoring |
| `POST /assessments` | assessment create | draft creation |
| `GET /assessments/:id` | detail/edit | assessment data |
| `PATCH /assessments/:id` | edit | blocked duration issue |
| `POST /assessments/:id/publish` | detail/list | lifecycle |
| `DELETE /assessments/:id` | detail/list | archive |
| `GET /invitations/verify/:token` | `/invitations/accept` | public validation |
| `POST /invitations/:id/invitations` | recruiter invitations | invite |
| `GET /invitations/:id/invitations` | recruiter invitations | invitation list |
| `GET /candidate/assessments` | candidate assessments | assignments |
| `POST /candidate/assessments/:id/start` | invitation/assignments | start/resume |
| `GET /attempts/me` | attempt history | candidate history |
| `GET /attempts/:id` | attempt workspace | assessment content |
| `PUT /attempts/:id/answers/:problemId` | attempt workspace | autosave |
| `POST /attempts/:id/submit` | attempt workspace | submit |
| `GET /evaluation/assessments/:id/submissions` | submissions | recruiter queue |
| `GET /evaluation/attempts/:id/evaluation` | evaluation | scoring view |
| `PATCH /evaluation/attempts/:id/answers/:answerId/evaluate` | evaluation | manual score |
| `POST /evaluation/attempts/:id/finalize-evaluation` | evaluation | finalization |
| `GET /evaluation/attempts/:id/result` | `/assessment-results/:id` | result |
| `GET /evaluation/assessments/:id/report` | assessment report | metrics |
| `POST /stripe-payments/checkout` | billing | Stripe redirect |
| Stripe webhook | backend-only | authoritative success |
| `GET /stripe-payments` | billing history | Payment rows |
| `GET /stripe-payments/:id` | payment detail | Payment row |
| `POST /bkash-payments/checkout` | billing | bKash redirect |
| bKash execute/query/callback | provider flow | payment completion |
| `GET /admin/users` | admin users | management |
| `PATCH /admin/users/:id/status` | admin users | status mutation |
| `GET /admin/dashboard-stats` | admin dashboard | compatible stats |
| `GET /admin/audit-logs` | admin audit logs | audit inspection |
| `GET /admin/payments` | admin payments | platform payment list |
| `GET /dashboard/candidate` | candidate dashboard | candidate metrics |
| `GET /dashboard/recruiter` | recruiter dashboard | BLOCKED by schema mismatch |
| `GET /dashboard/admin` | richer admin dashboard | BLOCKED by schema mismatch |

---

# 25. Backend Blockers and Open Questions / TBC

## B-01 — Assessment Duration Update Field Mismatch — Critical

Prisma Assessment field:

- `duration`

Create service correctly writes:

- `duration: data.durationMinutes`

Update service attempts:

- `durationMinutes: data.durationMinutes`

This must be changed to Prisma field `duration` or the schema/API redesigned consistently.

**Frontend rule until fixed:** do not ship duration edit as trusted production functionality.

## B-02 — Public Registration Accepts Role — Security Critical

`POST /auth/register` validation accepts optional `UserRole`.

Service stores supplied role or defaults to CANDIDATE.

A malicious client may attempt to request RECRUITER/ADMIN unless backend restricts it elsewhere.

**Required backend fix:** generic public registration should force CANDIDATE.

**Frontend rule:** never send or expose role.

## B-03 — Result Visibility Cannot Be Configured

Prisma default is confirmed:

- `AFTER_REVIEW`

Assessment create/update validation does not accept `resultVisibility`.

**Current frontend:** display read-only where returned; no editor.

**TBC:** should recruiter be allowed to choose IMMEDIATE/AFTER_REVIEW/HIDDEN?

## B-04 — Attempt Expiry Cannot Auto-Submit — Critical

Once server deadline passes, submit fails and attempt becomes EXPIRED.

**TBC:** product expectation for saved answers at timeout.

Recommended backend-owned policy is required.

## B-05 — Unanswered Manual Question Can Prevent Finalization — Critical

No Answer record exists when a candidate never saves WRITTEN/CODING response.

Recruiter cannot score it because evaluation mutation requires answerId.

Finalize returns 409.

**Required backend decision:** create zero-score rows on submit, allow recruiter evaluation by problem, or automatically treat missing manual answer as 0.

## B-06 — Feedback Is Not Persistent

`EvaluateAnswerInput.feedback` is recorded only in AuditLog metadata.

Answer schema has no feedback field.

**TBC:** is feedback internal audit note or candidate-visible feedback?

## B-07 — Admin Evaluation Route/Service Mismatch

Routes authorize ADMIN, but service requires a recruiter-owned Company through `getRecruiterCompany(userId)`.

**Frontend:** no admin evaluation UI until fixed.

## B-08 — Admin Result Route/Service Mismatch

Route authorizes ADMIN, but result service only accepts candidate owner or recruiter company owner.

**Frontend:** no admin result UI until fixed.

## B-09 — Recruiter Dashboard Payment Field Mismatch — Critical

Dashboard service aggregates:

- `payment._sum.creditsGranted`

Prisma Payment field is:

- `creditsPurchased`

**Frontend:** do not depend on `/dashboard/recruiter` until corrected.

## B-10 — Admin Rich Dashboard Payment Field Mismatch — Critical

`/dashboard/admin` references Payment fields not present in supplied schema, including:

- `creditsGranted`
- `recruiterId`
- `providerReference`
- `completedAt`

**Frontend:** use `/admin/dashboard-stats` as compatible admin dashboard source until corrected.

## B-11 — Payment Provider Missing

Payment has Stripe and bKash-specific IDs but no explicit provider enum/field.

**Recommended backend:** add provider field such as STRIPE/BKASH.

## B-12 — Payment Currency Missing

Stripe packages are USD. bKash packages are BDT. Payment stores only numeric amount.

**Recommended backend:** store currency per payment.

## B-13 — Payment Lists Are Provider-Ambiguous

Stripe and bKash recruiter list services both query all company payments with optional status and no provider filter.

Calling `/stripe-payments` does not guarantee Stripe-only rows.

Calling `/bkash-payments` does not guarantee bKash-only rows.

**Frontend:** use one generic history presentation until provider field/filter exists.

## B-14 — bKash Payment ID Stored in Stripe Field

On bKash creation:

- provider `paymentID` is written to `stripeSessionId`

This makes provider inference unreliable and weakens schema semantics.

## B-15 — Stripe Invoice Currency Is Wrong

Stripe package constants use USD, but Stripe success invoice code passes:

- `currency: "BDT"`

**Required fix:** invoice currency must match actual provider/package transaction currency.

## B-16 — Mixed-Currency Aggregates Are Not Meaningful

Admin stats/recruiter metrics sum Payment.amount across shared table.

If Stripe USD and bKash BDT coexist, a single aggregate is invalid without conversion or grouping.

**Required backend/product decision:** group by currency/provider or normalize to a base currency with explicit conversion rules.

## B-17 — Payment Error Classes Bypass Global AppError Handling

PaymentHttpError and BkashPaymentError extend Error, not AppError.

Global error handler only checks `instanceof AppError`.

Provider/payment errors may become generic 500 responses.

**Frontend:** generic error fallback required.

**Backend recommendation:** normalize custom errors in global middleware or subclass AppError.

## B-18 — No Refresh Token

Backend exposes no refresh endpoint/token rotation.

**TBC:** whether re-login on access token expiry is accepted product behavior.

## B-19 — No Logout Endpoint

Frontend logout is local/session-proxy cleanup only.

If server-side revocation is required, backend support must be added.

## B-20 — Invitation Revocation/Resend/Extension Missing

REVOKED exists in enum but no supplied endpoint performs revoke.

No resend or extension endpoint exists.

**Frontend:** display statuses only; no unsupported action.

## B-21 — Assessment CLOSED Transition Missing

CLOSED exists in enum and dashboard stats but no endpoint changes an assessment to CLOSED.

**Frontend:** no Close button.

**TBC:** lifecycle policy for closing assessments.

## B-22 — Starting Non-Published/Archived Assessment Needs Stronger Enforcement

Invitation verification checks PUBLISHED, but candidate `startAssessment` service primarily checks invitation state and does not explicitly reject based on current assessment status.

**Recommended backend:** enforce assessment status at start.

## B-23 — Archive Semantics with Active Invitations/Attempts

Assessment archive currently changes status without a supplied rule about:

- pending invitations
- active attempts
- result access

Evaluation recruiter lookups explicitly exclude archived assessment.

**TBC:** product lifecycle semantics.

## B-24 — Candidate Must Exist Before Invitation

Invitation service requires existing user account.

**TBC:** intentional product rule or should invitation support unregistered emails?

Current frontend must state the candidate needs an account.

## B-25 — Recruiter Document Review Workflow Missing

Recruiter becomes ACTIVE immediately after OTP even though verification documents are uploaded.

No admin approval/rejection endpoint exists.

**Frontend:** do not invent verification status or admin review workflow.

## B-26 — Recruiter Document Replacement Missing

Company documents exist in schema but no update API supports them.

**Frontend:** read-only only.

## B-27 — Credit Consumption Rule Missing

Company credits increase after successful payment.

No supplied service decrements credits for:

- assessment creation
- publish
- invitation
- start
- submission

**TBC:** what an “assessment credit” actually buys.

Frontend must never implement credit deduction itself.

## B-28 — bKash Callback UX

Backend callback responds through API handling rather than a confirmed frontend redirect contract.

**TBC:** success/failure/cancel frontend routes and redirect behavior.

## B-29 — Public bKash Execute/Query Endpoints

Execute/query are currently public routes.

**Security/product review recommended.** Frontend should not expose them as direct user actions.

## B-30 — No Coding Execution/Judge API

CODING is a confirmed ProblemType, but no compiler, test case, language, code execution, or judge endpoint/model exists.

**Frontend:** coding answer is a textual answer editor only.

Do not invent:

- language selector
- Run Code
- test cases
- execution result
- syntax evaluation

unless backend is extended.

## B-31 — MCQ-Only Attempts Remain SUBMITTED

Submit calculates score/percentage/pass for MCQ-only assessments but sets status SUBMITTED, not EVALUATED.

Result visibility AFTER_REVIEW therefore still hides the result until someone finalizes evaluation.

**TBC:** should MCQ-only attempts auto-finalize to EVALUATED?

## B-32 — Passing Score Is Nullable in Prisma but Required on Create

Assessment Prisma allows `passingScore: Int?`, while create API requires a non-null integer.

Frontend follows API: passing score is required on create.

## B-33 — Assessment/User and Problem/User Optional Relations Are Unused in Current Frontend Contract

Prisma includes optional `userId` on Assessment and Problem, but current services primarily scope them by company and do not expose creation semantics for these relations.

Frontend must not invent author/creator behavior from these fields.

---

# 26. Recommended Shared UI Components

These are frontend implementation abstractions, not backend features.

## 26.1 Generic

- AppShell
- RoleSidebar
- MobileNavigation
- PageHeader
- DataTable
- Pagination
- EmptyState
- ErrorState
- QueryBoundary
- StatusBadge
- ConfirmDialog
- DateTimeDisplay
- MetricCard
- ChartCard
- SearchInput
- FilterBar

## 26.2 Forms

- FormField wrapper
- FormErrorSummary
- PasswordField
- OtpField
- PdfUploadField
- TagsField
- DateTimeField
- ScoreField

## 26.3 Assessment-Specific

- AssessmentStatusBadge
- ProblemTypeBadge
- ProblemSelector
- OrderedProblemList
- QuestionNavigator
- QuestionCard
- McqQuestion
- TextAnswerQuestion
- AttemptTimer
- AutosaveIndicator
- AttemptSubmitDialog
- EvaluationQuestionCard
- ResultSummary

## 26.4 Payment-Specific

- CreditBalance
- PackageCard
- PaymentStatusBadge
- PaymentHistoryTable
- PaymentPendingState

---

# 27. TypeScript Domain Model Guidance

Create frontend types based on actual response DTOs, not direct copies of every Prisma model.

Examples of separate concerns:

- `ProblemAdminDto` may include `isCorrect`
- `CandidateProblemDto` must omit `isCorrect`
- `AttemptDetailDto` reflects candidate serializer, not raw Attempt model
- `EvaluationAttemptDto` includes full recruiter problem options
- `PaymentDto` reflects confirmed Payment fields only

Use discriminated unions for problem UI where practical:

- MCQ question -> options required
- WRITTEN question -> text answer
- CODING question -> text/code answer

Do not make `options` universally meaningful for manual question types.

---

# 28. URL State and Navigation Strategy

Use URL search params for shareable list state:

- admin users filters
- audit log filters
- admin payment filters
- evaluation submissions search/status/page
- recruiter payment list filters

Recommended library: `nuqs`.

Rules:

- defaults should match backend defaults
- invalid URL enum values should normalize to safe defaults
- changing filter resets page to 1
- back/forward browser navigation should restore filters

Do not place:

- accessToken
- resetToken
- passwords
- OTPs

in persistent URL state.

Invitation token is already part of the backend email URL and is therefore the supported exception.

---

# 29. Observability and Diagnostics

Recommended frontend telemetry:

- route error boundary exceptions
- API request failures by endpoint/status without sensitive payloads
- autosave failure rate
- attempt submission failures
- payment checkout creation failures
- client timer-expiry conflicts
- hydration/runtime errors

Do not record:

- candidate answer text in analytics/error monitoring by default
- passwords/OTP/reset tokens
- access tokens
- recruiter document URLs if they are sensitive
- audit metadata wholesale without redaction review

---

# 30. Definition of Done for Each Frontend Feature

A feature is complete only when:

1. route shell exists and follows static-shell rule
2. interactive logic is isolated to appropriate client island
3. domain types match backend response/request contract
4. Zod validation mirrors backend
5. ofetch infrastructure adapter exists
6. TanStack Query key/query/mutation exists where needed
7. cache invalidation is defined
8. loading/empty/error/success states exist
9. permissions/actions follow backend rules
10. responsive behavior is verified
11. keyboard/accessibility behavior is verified
12. unit/component tests exist
13. critical path E2E is covered
14. no known backend blocker is hidden by fabricated frontend behavior
15. acceptance criteria for the screen pass

---

# 31. Final Architecture Decision Summary

The frontend should be implemented as:

- **Next.js 16.0.3 App Router**
- **static-first route shells**
- **small dynamic client islands** for browser/user-specific interactions
- **feature-modular layered architecture**
- **presentation -> application -> domain/infrastructure dependency discipline**
- **TanStack Query** as the only default server-state system
- **TanStack Form + Zod** for forms and validation
- **ofetch** behind centralized infrastructure adapters
- **Tailwind + shadcn/ui** for UI composition
- **TanStack Table** for operational tables
- **nuqs** for URL filter state
- **date-fns** for deadlines and formatting
- **Sonner** for transient mutation feedback
- **Recharts** for approved dashboards/reports
- **Vitest + RTL + MSW + Playwright** for layered testing
- **HttpOnly BFF session pattern** preferred for bearer-token security

The frontend must remain intentionally conservative around backend inconsistencies. The highest-priority backend fixes before production are:

1. assessment duration update mismatch
2. public role escalation risk
3. attempt timeout/finalization policy
4. unanswered manual-question evaluation
5. recruiter/admin dashboard Payment schema mismatch
6. payment provider/currency modeling
7. admin evaluation authorization mismatch
8. Stripe invoice currency mismatch
9. credit consumption rule
10. bKash callback/return contract

Once those contracts are aligned, this SRS can be implemented without inventing business behavior in the frontend.
