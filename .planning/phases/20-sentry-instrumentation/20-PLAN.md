# Phase 20: Sentry Instrumentation — Implementation Plan

**Phase:** 20 — Sentry Instrumentation
**Requirements:** PROD-01, PROD-02
**Plan created:** 2026-05-15
**Status:** Ready for execution

---

## Plan 20-1: Create instrumentation.ts

**Goal:** Create `src/instrumentation.ts` that registers the Sentry SDK on Next.js server startup so runtime errors in API routes, server components, and edge functions are captured.

**Success criteria:**
1. `npm run build` exits 0 with Sentry SDK initialized on server startup
2. A deliberate test error in an API route appears in the Sentry dashboard
3. `instrumentation.ts` is properly registered via Next.js convention (export `register()`)

**Implementation:**
- Create `citizenmate/src/instrumentation.ts`
- Follow Next.js instrumentation convention: `export async function register()`
- Call `Sentry.init()` with the same config as `sentry.server.config.ts`
- Use `process.env.NEXT_PUBLIC_SENTRY_DSN` (already set in Vercel)
- Guard with `process.env.NEXT_RUNTIME === 'nodejs'` to avoid edge runtime conflicts
- The existing `sentry.server.config.ts`, `sentry.client.config.ts`, and `sentry.edge.config.ts` handle their respective runtimes — `instrumentation.ts` is the final missing piece for server-side initialization

**Files to create:**
- `citizenmate/src/instrumentation.ts`

---

## Plan 20-2: Create global-error.tsx

**Goal:** Create `src/app/global-error.tsx` that captures uncaught React rendering errors and displays a Conseil-styled fallback UI while reporting to Sentry.

**Success criteria:**
1. Uncaught React errors display a Conseil-styled fallback instead of a blank page
2. Errors are captured via `Sentry.captureException()`
3. The error page uses Conseil design tokens (Poppins headings, #006d77 primary, rounded-[15px] cards)
4. The error page provides a "Try Again" button that calls `reset()`

**Implementation:**
- Create `citizenmate/src/app/global-error.tsx`
- Use Next.js `'use client'` directive (global-error must be a Client Component)
- Accept `error: Error & { digest?: string }` and `reset: () => void` props
- Call `Sentry.captureException(error)` in a `useEffect` on mount
- Display a clean, branded error UI:
  - Poppins heading: "Something went wrong"
  - Inter body: "We've been notified and are working on a fix."
  - Conseil-styled CTA button: "Try Again" with cm-teal background
  - Footer link: "Return Home" → `/`
- Match existing Conseil patterns: rounded-[15px] card, dual-layer shadow, max-w-[1140px]

**Files to create:**
- `citizenmate/src/app/global-error.tsx`

---

## Task Summary

| # | Task | Files | Owner |
|---|------|-------|-------|
| 1 | Create `src/instrumentation.ts` | `citizenmate/src/instrumentation.ts` | Claude |
| 2 | Create `src/app/global-error.tsx` | `citizenmate/src/app/global-error.tsx` | Claude |
| 3 | Verify build passes | `npm run build` | Claude |

---

## Verification

After both files are created:
1. Run `npm run build` — must exit 0
2. Verify `instrumentation.ts` imports and pattern match existing Sentry configs
3. Verify `global-error.tsx` uses Conseil design tokens (no ad-hoc colors)
4. Deploy to Vercel preview and trigger a test error to confirm Sentry ingestion
