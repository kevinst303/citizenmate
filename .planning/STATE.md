---
gsd_state_version: 1.0
milestone: v1.6
milestone_name: Payment Trust & Production Readiness
status: complete
last_updated: "2026-10-01T05:00:00.000Z"
last_activity: 2026-10-01 — v1.6 complete (Phase 27)
progress:
  total_phases: 1
  completed_phases: 1
  total_plans: 1
  completed_plans: 1
  percent: 100
---

# Project State: CitizenMate Payment Trust & Production Readiness

## Current Position

Phase: 27 — Payment Trust & Production Readiness — COMPLETE ✅
Branch: `main`
Last activity: 2026-10-01 — committed as fix(27)/feat(27)/test(27) series

## What Was Delivered (Phase 27)

1. **i18n SSR fix** — `[lang]/layout.tsx` seeds `I18nProvider` with the dictionary; server HTML ships translated text for all 6 locales (was raw `landing.*` keys in production).
2. **RLS entitlement lockdown** — migration `20261001000000_lock_entitlement_columns.sql`: column-level UPDATE grants for authenticated limited to `test_date, study_language, xp, level`; INSERT revoked; admin PATCH moved to service-role client. Closes the premium self-grant hole.
3. **Webhook correctness** — subscription grants anchor to real `current_period_end` (+3d grace, no more hardcoded 31 days); ordering-race matching via `subscription_data.metadata.userId`; expiry never shortened (stacking + referral bonuses survive); past_due = 3-day grace; refund revocation scoped (active-subscription check, fail-open); dedup is an upsert; locale extraction validated against locale list; referral attribution covers codes typed into Stripe's promo box.
4. **Member payment UX** — success page verifies the Stripe session server-side with tier-correct copy and polls premium status; POST `/api/billing-portal` + Settings "Manage subscription" button; tier-aware email subjects; dunning email on `invoice.payment_failed`; cron count fix; chat models gated by tier (free → OpenRouter pool, premium → DeepSeek); free-tier copy aligned to enforced 20/day in all locales; GST terms copy corrected.
5. **Verification** — `pnpm build` ✓, 29/29 vitest ✓ (new: entitlement math, i18n SSR seeding), local HTTP smoke of landing/success/settings/health.
6. **Hygiene** — deleted stale branches (`feature/phase-06-revenue-engine`, `feature/phase-07-growth-retention`, `fix/checkout-auth`) + worktrees; removed root debug scripts with live Stripe price IDs; refreshed README.md and MEMORY.md; marked v1.5 shipped here and in ROADMAP.md.

## Accepted Tradeoffs

- Quiz content ships client-side (offline PWA requirement); monetizable surfaces (chat models, API limits) are enforced server-side.
- Expiry-warning email has a single 3–4 day window (missed cron = missed email) — noted in MEMORY.md next steps.

## Blockers/Concerns

- Stripe billing portal must be activated for LIVE mode in the Stripe dashboard (one-time, user action).
- TestSprite API key in `testsprite_tests/tmp/config.json` should be rotated (path now gitignored).
- Local `.env.local` lacks Stripe/Supabase creds — run a test-mode purchase before the next payment change.

---

*State updated: 2026-10-01 — v1.6 complete*
