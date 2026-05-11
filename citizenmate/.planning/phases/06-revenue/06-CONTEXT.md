# Phase 6: Revenue Engine & Monetization — Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**Mode:** Auto-generated (gsd-autonomous — discuss skipped)

<domain>
## Phase Boundary

The monetization pipeline is the business backbone of CitizenMate. It needs to convert free users into paying subscribers through a test-date-anchored onboarding flow, multi-trigger upgrade prompts, and tiered Stripe checkout.

**Requirements:** REV-01, REV-02, REV-03
**Success Criteria:**
- Users can complete a test-date-anchored onboarding flow that generates a personalized study plan.
- Six distinct upgrade triggers are active and successfully prompt users to subscribe.
- Stripe checkout supports both Pro and Premium tiered subscriptions with recurring and micro-transaction logic.
</domain>

<decisions>
## Implementation Decisions

### All Implementation at Agent's Discretion
This is a pure verification/audit phase — the revenue engine code is largely complete. We audit each criterion against the existing codebase and only implement gaps.

### Verification Approach
- Checkout: Already fully implemented and battle-tested (Stripe session creation, webhook handling, upgrade modal)
- Onboarding flow: TestDateProvider + StudyProvider exist in layout, need to verify full flow
- Upgrade triggers: Need to count and verify 6 distinct triggers
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/api/checkout/route.ts` — Stripe Checkout session creation with rate limiting, promo codes, Sentry error capture
- `src/components/global/upgrade-modal.tsx` — Upgrade modal component in layout
- `src/lib/test-date-context.tsx` — Test date context provider
- `src/lib/study-context.tsx` — Study plan context
- `src/app/api/webhooks/stripe/route.ts` — Stripe webhook handler (need to verify)
- `src/app/[lang]/onboarding/` — Onboarding pages (need to verify)
- `.env.example` — All Stripe price IDs configured (Pro monthly/yearly, Premium monthly/yearly, Sprint Pass)

### Integration Points
- Upgrade modal is in root layout (L153 of layout.tsx)
- Checkout API uses checkoutLimiter, Sentry, Supabase auth
- PostHog for conversion funnel tracking
</code_context>

<specifics>
## Specific Ideas

1. Audit Stripe webhook handler for subscription lifecycle management
2. Verify onboarding flow: test date → study plan → dashboard
3. Count and categorize upgrade triggers (need 6 distinct)
4. Verify Stripe price IDs map correctly to tiers (Pro, Premium, Sprint Pass)
5. Check upgrade modal implementation against design system
</specifics>

<deferred>
## Deferred Ideas

None — revenue phase.
</deferred>
