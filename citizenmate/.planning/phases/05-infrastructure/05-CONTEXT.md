# Phase 5: Production Infrastructure & Monitoring - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Harden the application for production traffic by addressing security vulnerabilities and enabling comprehensive monitoring. This is primarily a verification phase — Sentry and PostHog are already integrated. Upstash rate limiting packages are installed but not wired up.

**Requirements:** INFRA-02, INFRA-03, REV-04
**Success Criteria:**
- Sentry is integrated and successfully capturing frontend and backend errors.
- Upstash Redis rate limiting is active for the AI Tutor and Vercel serverless functions.
- PostHog analytics is configured and tracking key conversion funnels.
</domain>

<decisions>
## Implementation Decisions

### the agent's Discretion
All implementation choices are at the agent's discretion — pure infrastructure phase.

### Verification Approach
- Sentry: Already configured via `@sentry/nextjs` with client/server/edge configs in `next.config.ts`
- PostHog: Already configured via `posthog-provider.tsx` with pageview tracking
- Upstash: Packages installed, env vars configured — need to add actual rate limiting implementation
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@sentry/nextjs` ^10.50.0 — sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts
- `posthog-js` ^1.372.3 — src/components/providers/posthog-provider.tsx with pageview capture
- `@upstash/ratelimit` ^2.0.8, `@upstash/redis` ^1.37.0 — packages installed, not wired up
- Sentry referenced in: `src/app/[lang]/error.tsx`, `src/lib/auth-context.tsx`, `src/middleware.ts`, API routes

### Integration Points
- `next.config.ts` wraps config with `withSentryConfig`
- `.env.example` has all required env vars (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, SENTRY_DSN, NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST)
</code_context>

<specifics>
## Specific Ideas

1. Verify Sentry config covers all 3 runtimes (client, server, edge)
2. Create `src/lib/rate-limit.ts` with Upstash Redis rate limiter for AI Tutor and API routes
3. Verify PostHog provider is in the layout tree
4. Document all infrastructure in SUMMARY.md
</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.
</deferred>
