# Phase 5: Production Infrastructure & Monitoring — Plan

**Created:** 2026-05-11
**Mode:** Autonomous (gsd-autonomous)

## Wave 1: Rate Limiter Implementation
### ✓ W1: Create Upstash rate limiter utility
**File:** `src/lib/rate-limit.ts`
**Criteria:** Exports `rateLimit` function using `@upstash/ratelimit` with Redis client. Configurable window/limit. Returns `{success, limit, remaining, reset}`.

### ✓ W2: Wrap AI Tutor API route with rate limiting
**File:** `src/app/api/tutor/chat/route.ts`
**Criteria:** AI Tutor API returns `429 Too Many Requests` when rate limit exceeded. Rate limit is 10 requests per 60s per user.

### ✓ W3: Add global API rate limit in middleware
**File:** `src/middleware.ts`
**Criteria:** General API routes (non-AI) protected at 60 req/60s. AI Tutor protected at 10 req/60s. Valid session required for counting.

## Wave 2: Verification
### ✓ W4: Verify Sentry integration
**Check:** `next.config.ts` has `withSentryConfig`, configs exist for client/server/edge
**Criteria:** All 3 runtimes covered. Error boundary in layout. (already done)

### ✓ W5: Verify PostHog provider in layout
**Check:** `src/components/providers/posthog-provider.tsx` is imported in root layout
**Criteria:** Pageview tracking active. PostHog initialized before render.

### ✓ W6: Write SUMMARY.md
**File:** `05-SUMMARY.md`
**Criteria:** All implementation decisions documented. Verification results recorded.
