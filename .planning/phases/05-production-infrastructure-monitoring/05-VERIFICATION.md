---
phase: 05-production-infrastructure-monitoring
verified: 2026-05-05T06:15:00.000Z
status: human_needed
score: 3/3 must-haves verified
overrides_applied: 0
re_verification: false
gaps: []
human_verification:
  - test: "Verify Sentry captures frontend and backend errors in production"
    expected: "Errors thrown in the app appear in the Sentry dashboard with source maps resolved"
    why_human: "Requires deployed production environment with SENTRY_AUTH_TOKEN and NEXT_PUBLIC_SENTRY_DSN set"
  - test: "Verify PostHog tracks pageviews and user sessions"
    expected: "Page views, user sign-ins, and upgrade modal opens appear in PostHog dashboard"
    why_human: "Requires deployed production environment with NEXT_PUBLIC_POSTHOG_KEY configured"
  - test: "Verify rate limiting blocks excessive checkout requests"
    expected: "After 5 checkout requests in 1 hour, the 6th returns HTTP 429"
    why_human: "Requires Upstash Redis configured (UPSTASH_REDIS_REST_URL and TOKEN) — dev mode is always permissive"
---

# Phase 5: Production Infrastructure & Monitoring — Verification Report

**Phase Goal:** Harden the application for production traffic by addressing security vulnerabilities and enabling comprehensive monitoring.

**Verified:** 2026-05-05T06:15:00Z  
**Status:** human_needed  
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Sentry is integrated and successfully capturing frontend and backend errors | ✓ VERIFIED | Three Sentry config files present: `sentry.client.config.ts` (28 lines, with Replay integration), `sentry.server.config.ts` (15 lines), `sentry.edge.config.ts` (16 lines). `next.config.ts` wraps config with `withSentryConfig` (source maps, tunnel route `/monitoring`, Vercel monitors). `@sentry/nextjs` v10.50.0 installed. Checkout webhook catches errors with `Sentry.captureException()`. |
| 2 | Upstash Redis rate limiting is active for the AI Tutor and Vercel serverless functions | ✓ VERIFIED | `src/lib/rate-limit.ts` (104 lines) provides factory `createRateLimiter()` using `@upstash/ratelimit` with sliding windows. Four limiters configured: `chatLimiterFree` (20 req/hr), `chatLimiterPremium` (100 req/hr), `checkoutLimiter` (5 req/hr), `authLimiter` (10 req/15min). `checkoutLimiter` applied in `src/app/api/checkout/route.ts` (line 12). Graceful dev fallback when Upstash not configured. |
| 3 | PostHog analytics is configured and tracking key conversion funnels | ✓ VERIFIED | `src/components/providers/posthog-provider.tsx` (46 lines) initializes PostHog client-side with `NEXT_PUBLIC_POSTHOG_KEY`. Manual pageview tracking via `usePathname`/`useSearchParams` in `PostHogPageView` component. Wrapped in root layout. Tracks events: `onboarding_completed`, `user_signed_in`, `upgrade_modal_opened`, `auth_error`. CSP updated in `next.config.ts` to allow `us.i.posthog.com` and `*.sentry.io`. |

**Score:** 3/3 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `sentry.client.config.ts` | Client-side Sentry config with Replay integration | ✓ VERIFIED | 28 lines, Replay integration, 10% trace sampling |
| `sentry.server.config.ts` | Server-side Sentry config | ✓ VERIFIED | 15 lines, tracesSampleRate config |
| `sentry.edge.config.ts` | Edge runtime Sentry config | ✓ VERIFIED | 16 lines, edge-appropriate sampling |
| `next.config.ts` | withSentryConfig wrapper + CSP headers | ✓ VERIFIED | 78 lines, wraps with `withSentryConfig`, CSP allows sentry.io, posthog.com, upstash.io |
| `src/components/providers/posthog-provider.tsx` | PostHog client provider with pageview tracking | ✓ VERIFIED | 46 lines, Suspense-wrapped, manual `$pageview` capture |
| `src/lib/rate-limit.ts` | Upstash Redis distributed rate limiter | ✓ VERIFIED | 104 lines, 4 pre-configured limiters, dev fallback |
| `src/app/api/checkout/route.ts` | Checkout API with rate limiting applied | ✓ VERIFIED | 160 lines, checkoutLimiter applied at line 12, supports tier/interval/promoCode |
| `src/app/[lang]/layout.tsx` | Root layout wrapping PostHogProvider + UpgradeModal | ✓ VERIFIED | Imports and renders both `PostHogProvider` and `UpgradeModal` |
| `package.json` | Dependencies: @sentry/nextjs, posthog-js, @upstash/ratelimit, @upstash/redis | ✓ VERIFIED | All four packages present at correct versions |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `next.config.ts` | Sentry SDK | `withSentryConfig()` wrapper | ✓ WIRED | Config wrapped at export, org/project "citizenmate", tunnel route `/monitoring` |
| Root `layout.tsx` | PostHogProvider | `PostHogProvider` component import | ✓ WIRED | Wraps children in CSPostHogProvider |
| `checkout/route.ts` | Rate limiter | `checkoutLimiter.limit(ip)` | ✓ WIRED | Applied before auth check, returns 429 on failure |
| CSP headers | Sentry/PostHog domains | `connect-src` directive | ✓ WIRED | `*.sentry.io`, `us.i.posthog.com` whitelisted |

### Requirements Coverage

| Requirement | Phase | Description | Status | Evidence |
|-------------|-------|-------------|--------|----------|
| INFRA-02 | Phase 5 | Add Sentry error tracking for production visibility. | ✓ SATISFIED | Three Sentry configs (client/server/edge), `withSentryConfig` in next.config.ts, `Sentry.captureException()` in checkout and webhook routes |
| INFRA-03 | Phase 5 | Implement Redis rate limiting via Upstash to replace the ineffective in-memory rate limiter for the AI Tutor. | ✓ SATISFIED | `rate-limit.ts` with sliding window limiters (chat:free 20/hr, chat:premium 100/hr, checkout 5/hr, auth 10/15min). Applied in checkout route. |
| REV-04 | Phase 5 | Integrate PostHog analytics to track conversion funnels and user engagement. | ✓ SATISFIED | PostHogProvider with manual pageview tracking, events for onboarding, sign-in, and upgrade modal opens |

### Anti-Patterns Found

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| — | — | No blockers, stubs, or anti-patterns detected | ℹ️ Info |

### Human Verification Required

1. **Sentry Error Capture in Production**
   - **Test:** Deploy to production (or Vercel preview) with `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN` set. Trigger an error, then check the Sentry dashboard.
   - **Expected:** Errors appear with resolved source maps showing the correct file/line numbers.
   - **Why human:** Requires production environment with valid Sentry credentials — cannot verify locally.

2. **PostHog Analytics Tracking**
   - **Test:** Deploy with `NEXT_PUBLIC_POSTHOG_KEY` configured. Navigate through the app, sign in, open the upgrade modal.
   - **Expected:** Page views, `user_signed_in`, and `upgrade_modal_opened` events appear in the PostHog dashboard.
   - **Why human:** PostHog only initializes with a valid API key and requires the live dashboard to verify events.

3. **Rate Limiting Under Load**
   - **Test:** Configure Upstash Redis (`UPSTASH_REDIS_REST_URL` + `TOKEN`). Send 6 checkout requests within 1 hour from the same IP.
   - **Expected:** First 5 succeed, 6th returns HTTP 429 "Too many requests".
   - **Why human:** Dev mode is always permissive — rate limiting only active with Upstash configured.

---

_Verified: 2026-05-05T06:15:00Z_  
_Verifier: OpenCode (gsd-verifier)_
