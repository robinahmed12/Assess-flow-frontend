# Auth Feature

This feature contains the authentication foundation and login flow.

## Included

- Domain types, DTOs, enums, and Zod schemas
- Backend auth API adapter
- Auth repository
- `useMe` TanStack Query hook
- Login mutation against a same-origin BFF route
- Basic HttpOnly cookie server-session foundation for login
- Lightweight route guard utilities/components
- Login page and TanStack Form login client island

## Not Included Yet

- Registration UI
- OTP UI
- Password reset UI
- Google login UI
- Full logout route
- Full refresh-token handling because backend has no refresh endpoint

## Security Note

The login page calls `/api/auth/login` instead of calling the backend directly from the browser.
That route stores the backend JWT in an HttpOnly cookie and returns only the authenticated user to the client.

The backend has no refresh-token endpoint, so the current session expires when the backend JWT expires.

## Source of Truth

Backend auth routes and Prisma enums remain authoritative.
The public candidate registration DTO intentionally does not expose a `role` field.
