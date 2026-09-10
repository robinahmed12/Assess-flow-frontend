# Folder Architecture

This project has been reorganized to a feature-based Next.js architecture.

## Main folders

- `app` - Next.js App Router pages, layouts, route groups, and API routes.
- `features` - Business features. Each feature owns its UI, hooks, API layer, types, and schemas.
- `shared` - Reusable code used by multiple features.
- `config` - App-level configuration such as env, routes, app name, and navigation.

## Feature folders

Each feature follows this structure:

```txt
features/auth
├── components  # Feature UI components
├── hooks       # Feature React hooks and React Query hooks
├── api         # Feature API/repository functions
├── types       # Feature DTOs, enums, and TypeScript types
├── schemas     # Feature validation schemas
└── utils       # Feature helper/rule functions
```

## Shared folders

```txt
shared
├── components  # Shared UI components and providers
├── hooks       # Shared hooks
├── lib         # API client, query client, auth helpers, constants
├── utils       # Shared utility functions
└── types       # Shared/global types
```
