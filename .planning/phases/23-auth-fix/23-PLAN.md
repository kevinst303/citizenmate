# Phase 23: Auth/Login 404 Remediation — Implementation Plan

**Phase:** 23 — Auth Route Fix (login 404)
**Requirements:** PROD-05
**Plan created:** 2026-05-15
**Status:** Ready for execution

---

## Plan 23-1: Create /auth/confirm Route

**Goal:** Create `src/app/auth/confirm/route.ts` to handle Supabase email verification links and eliminate the 404.

**Success criteria:**
1. `npm run build` exits 0
2. `/auth/confirm?token_hash=...` correctly exchanges the token and redirects
3. New users receive welcome email (matching callback pattern)

**Implementation:**
1. Create `src/app/auth/confirm/route.ts`
2. Handler extracts `token_hash` and `type` from query params
3. Uses `supabase.auth.verifyOtp()` to complete email verification
4. Redirects to `/dashboard` on success, `/` on error
5. Sends welcome email for new users (within 60s of creation)

**Files to create:**
- `citizenmate/src/app/auth/confirm/route.ts`

---

## Verification
1. `npm run build` — must exit 0
2. New route exists at `src/app/auth/confirm/route.ts`
3. Handler follows same pattern as existing `api/auth/callback/route.ts`
