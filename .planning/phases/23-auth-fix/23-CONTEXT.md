# Phase 23: Auth/Login 404 Remediation - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** Auto-generated (known production bug)

<domain>
## Phase Boundary

Supabase email auth sends verification/confirmation links to `{SITE_URL}/auth/confirm` by default. CitizenMate currently has NO route at `/auth/confirm` — this creates a 404 for any user trying to verify their email after signup or password reset.

The app has `/api/auth/callback` for OAuth (Google) but email auth paths are completely missing.

## Root Cause
- `auth-context.tsx` `signUp()` calls `supabase.auth.signUp()` without setting `emailRedirectTo` → defaults to `{SITE_URL}/auth/confirm`
- No page or API route exists at `src/app/auth/confirm/` to handle the verification

## Fix Strategy
Create `src/app/auth/confirm/route.ts` as a server-side handler that:
1. Exchanges the `token_hash` or `code` from the URL for a verified session
2. Redirects to `/dashboard` on success or `/` on error
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — known bug fix.
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/api/auth/callback/route.ts` — existing auth callback pattern to emulate
- `src/lib/supabase-server.ts` — server-side supabase client factory
- `src/lib/email.ts` — `sendWelcomeEmail` (can reuse for new user detection)

### Integration Points
- Supabase `auth.verifyOtp()` for token_hash exchange
- `createServerClient` from `@supabase/ssr` with `cookies()` from `next/headers`
</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.
</specifics>

<deferred>
## Deferred Ideas

- `emailRedirectTo` configuration in signUp (enhancement, not blocking)
</deferred>
