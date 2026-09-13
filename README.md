# Online Assessment & Recruitment Platform

A full-stack role-based online assessment and recruitment platform designed for companies to create assessments, evaluate candidates, manage recruitment workflows, and handle payment-based credit management.

## Table of Contents

- Project Overview
- Features
- User Roles
- Technology Stack
- Architecture
- Project Structure
- Authentication
- Candidate Workflow
- Recruiter Workflow
- Admin Workflow
- Assessment System
- Evaluation System
- Payment System
- Environment Setup
- Installation
- Development
- Security
- Future Improvements

---

# Project Overview

The platform provides a complete recruitment assessment workflow:

- Recruiters create problems and assessments
- Candidates complete assigned assessments
- Recruiters evaluate submissions
- Administrators monitor the platform

The application supports three major roles:

- Candidate
- Recruiter
- Admin

---

# Features

## Authentication

- Email/password authentication
- Google OAuth login
- OTP verification
- Password recovery
- Role-based access control

## Candidate Features

- Candidate dashboard
- View assigned assessments
- Start and resume attempts
- Answer MCQ, written, and coding questions
- Autosave answers
- Submit assessments
- View results

## Recruiter Features

- Company management
- Problem management
- Assessment creation
- Candidate invitations
- Submission review
- Manual evaluation
- Reports
- Billing and payments

## Admin Features

- Dashboard analytics
- User management
- Audit log monitoring
- Payment monitoring

---

# Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- TanStack Form
- Zod
- ofetch
- date-fns

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication

---

# Architecture

The frontend follows a feature modular architecture.

```
src/

├── app/
├── features/
├── shared/
├── components/
└── config/
```

Each feature contains:

```
feature/

├── api/
├── hooks/
├── components/
├── types/
└── utils/
```

---

# User Roles

## Candidate

Capabilities:

- Register
- Login
- Receive assessment invitations
- Take assessments
- Submit answers
- View results

---

## Recruiter

Capabilities:

- Manage company
- Create problems
- Create assessments
- Invite candidates
- Evaluate submissions
- Generate reports
- Purchase credits

---

## Admin

Capabilities:

- Monitor users
- Manage user status
- View audit logs
- Monitor payments

---

# Candidate Workflow

```
Registration

      ↓

OTP Verification

      ↓

Login

      ↓

Dashboard

      ↓

Assessment List

      ↓

Start Assessment

      ↓

Attempt Workspace

      ↓

Submit

      ↓

Evaluation

      ↓

Result
```

---

# Recruiter Workflow

```
Recruiter Registration

        ↓

Company Setup

        ↓

Create Problems

        ↓

Create Assessment

        ↓

Invite Candidates

        ↓

Review Submission

        ↓

Evaluate Answers

        ↓

Generate Report

        ↓

Billing
```

---

# Admin Workflow

```
Admin Login

    ↓

Dashboard

    ↓

User Management

    ↓

Audit Logs

    ↓

Payments
```

---

# Assessment System

Supported question types:

- MCQ
- WRITTEN
- CODING

## MCQ

Features:

- Multiple options
- Automatic scoring

## Written

Features:

- Text answers
- Manual evaluation

## Coding

Current support:

- Text-based coding answers

---

# Assessment Lifecycle

```
DRAFT

 ↓

PUBLISHED

 ↓

CLOSED

 ↓

ARCHIVED
```

---

# Attempt Lifecycle

```
IN_PROGRESS

 ↓

SUBMITTED

 ↓

EVALUATED

 ↓

EXPIRED
```

---

# Evaluation System

Automatic evaluation:

- MCQ


Manual evaluation:

- Written answers
- Coding answers


Flow:

```
Candidate Submit

       ↓

Recruiter Review

       ↓

Score Assignment

       ↓

Finalize

       ↓

Result Published
```

---

# Payment System

Supported providers:

- Stripe
- bKash


Flow:

```
Select Package

      ↓

Checkout

      ↓

Payment Provider

      ↓

Verification

      ↓

Credit Update
```

---

# Environment Setup

Create:

```
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

Backend:

```env
DATABASE_URL=

JWT_SECRET=

REDIS_URL=

GOOGLE_CLIENT_ID=
```

---

# Installation

Clone project:

```bash
git clone repository-url
```

Install dependencies:

```bash
npm install
```

Run development:

```bash
npm run dev
```

Application:

```
http://localhost:3000
```

---

# Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migration:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# Security

Implemented:

- JWT authentication
- Role authorization
- Protected routes
- Input validation
- Secure payment handling
- Sensitive data protection

---

# Performance

Implemented:

- TanStack Query caching
- Feature based loading
- Static shell rendering
- Optimized API communication

---

# Future Improvements

Possible improvements:

- AI candidate ranking
- Resume analysis
- Coding judge engine
- Advanced analytics
- Email notification system
- Collaboration features

---

# License

Private Commercial Project
