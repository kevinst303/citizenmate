# 🧠 CitizenMate — Project Memory

> **Last Updated**: 2026-10-01  
> **Purpose**: Full project context for resuming work on any device.  
> **NotebookLM**: [AU Citizenship Test SaaS — Knowledge Base](https://notebooklm.google.com/notebook/a4e76a2c-165c-42d6-9f2a-49960264fb93)

---

## 📍 Current State

**Phase**: v1.6 "Payment Trust & Production Readiness" — Complete (2026-10-01)  
**Branch**: `main` (tagged through v1.5.0)  
**Production**: LIVE at https://citizenmate.com.au (Vercel)  
**Last Session**: 2026-10-01 — Production-readiness pass over payments & member flows

### Milestone History

| Milestone | Shipped | Scope |
|-----------|---------|-------|
| MVP | 2026-03-23 | Quiz engine, study guide, AI tutor, PWA, dashboard |
| v1.0 Conseil Design Overhaul | 2026-04-06 | Design system unification (Phases 1–3) |
| v1.1 Launch Readiness | 2026-05-12 | Revenue engine (Stripe), referrals, gamification, admin, i18n (Phases 4–13) |
| v1.2 PWA & Mobile | 2026-05-13 | IndexedDB, Serwist, background sync (Phase 14) |
| v1.3 Polish & UX | 2026-05-14 | Dashboard refactor, install modal (Phases 15–17) |
| v1.4 Tech Debt | 2026-05-14 | 100% Conseil compliance (Phases 18–19) |
| v1.5 Production Hardening | 2026-05-15 | Sentry, proxy.ts, /auth/confirm, i18n drift → 0%, Upstash rate limits, free test (Phases 20–26) |
| **v1.6 Payment Trust** | **2026-10-01** | i18n SSR fix, RLS entitlement lockdown, webhook correctness (interval grant, race safety, grace, refund scoping), billing portal, verified success page, tier-gated chat models |

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 16 + TypeScript + React 19 | App Router, `proxy.ts` (Next 16 convention) |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Conseil design system, dark mode |
| **Auth & DB** | Supabase (Postgres) | Email + Google OAuth; RLS with column-level grants |
| **AI** | Vercel AI SDK 6 | Chat: free→OpenRouter free pool, premium→DeepSeek; plus Gemini/OpenAI for writing tools |
| **Payments** | Stripe | Checkout, webhooks (deduped), billing portal, referral coupons |
| **Email** | Resend | Welcome, purchase, expiry warning, inactivity, milestone, dunning |
| **Rate limiting** | Upstash Redis | Chat (20 free / 100 premium per day), checkout |
| **Monitoring** | Sentry + PostHog + GA4 | instrumentation.ts + onRequestError wired |
| **PWA** | Serwist (Workbox) | Offline fallback, background sync to /api/sync |
| **Hosting** | Vercel | cron: /api/cron/emails daily 10:00 UTC |

### Directory Structure

```
CitizenMate/
├── citizenmate/                 ← Next.js application
│   ├── src/
│   │   ├── app/[lang]/          ← All pages under i18n routing (en es hi zh ar vi)
│   │   ├── app/api/             ← ~30 routes: checkout, webhooks/stripe, chat,
│   │   │                          sync, gamification/*, admin/*, billing-portal…
│   │   ├── components/          ← landing/, quiz/, shared/, ui/, providers/
│   │   ├── data/                ← questions.ts + categories/ (~500 Qs), tests.ts (15 tests)
│   │   ├── i18n/                ← config, dictionaries/, i18n-context (SSR-seeded)
│   │   └── lib/
│   │       ├── entitlement.ts   ← Expiry math (pure, unit-tested)
│   │       ├── auth-context.tsx ← Auth + premium state (useAuth, usePremium)
│   │       ├── supabase-admin.ts← Service-role client (webhook, admin, cron)
│   │       └── srs-engine.ts    ← Spaced repetition (unit-tested)
│   ├── supabase/                ← schema.sql + 18 migrations
│   └── .planning/               ← (stale, superseded by root .planning/)
├── .planning/                   ← GSD state: STATE.md, ROADMAP.md, todos/
├── docs/                        ← research/, superpowers/{plans,specs}
├── BUSINESS_PLAN.md             ← Business plan v3
└── README.md                    ← Refreshed 2026-10-01
```

---

## 🔑 Environment Variables

Full list in `citizenmate/.env.example`. Key groups:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
# Stripe (5 price IDs + webhook secret + referral coupon)
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PRICE_ID_*
# AI
GOOGLE_GENERATIVE_AI_API_KEY, OPENROUTER_API_KEY, DEEPSEEK_API_KEY
# Email / rate limiting / monitoring / analytics
RESEND_API_KEY (+7 templates), UPSTASH_REDIS_REST_*, SENTRY_*, NEXT_PUBLIC_POSTHOG_*
# Misc
KIE_API_KEY (image gen), NEXT_PUBLIC_GA_MEASUREMENT_ID, CRON_SECRET
```

> ⚠️ `.env.local` is gitignored. The local machine's `.env.local` currently has UI-only vars; full production env lives in Vercel.

---

## 📋 Key Decisions Log

### 1. Monorepo Structure
All project files (docs, plans, app code) in one git repo; `citizenmate/` is the app.

### 2. Client-Side State First
localStorage/IndexedDB primary, Supabase sync on auth. Offline PWA flows queue through `/api/sync`.

### 3. Entitlements are service-role only (v1.6)
`profiles` column-level RLS grants: browsers write only `test_date, study_language, xp, level`. Everything payment-related flows through the Stripe webhook (service role) or admin routes (verifyAdmin + service role). **Never broaden these grants.**

### 4. Expiry math is pure and tested (v1.6)
`src/lib/entitlement.ts`: subscriptions anchor to Stripe `current_period_end` + 3d (not hardcoded intervals); Sprint Pass purchases stack; nothing shortens a later expiry; past_due grants 3-day grace. Unit tests in `src/lib/__tests__/entitlement.test.ts`.

### 5. Chat model gating follows tier (v1.6)
Free users hit the OpenRouter free-model pool only; DeepSeek (paid) is premium-only. Client limit (20/day) mirrors the server's enforced limit.

### 6. i18n is SSR-seeded (v1.6)
`[lang]/layout.tsx` awaits `getDictionary()` and passes `initialDictionary` to `I18nProvider` — server HTML ships fully translated text (SEO + no raw-key flash).

---

## 🚀 Next Steps (Prioritized)

### Immediate (post-v1.6)
1. **Stripe billing portal** — confirm the portal is activated for LIVE mode in the Stripe dashboard (test mode works out of the box)
2. **TestSprite API key rotation** — the key inside `testsprite_tests/tmp/config.json` should be rotated; that path is now gitignored
3. **Real Stripe test-mode pass** — local env lacks Stripe keys; run one test-mode purchase (Sprint Pass + a yearly sub) with webhook forwarding before the next production payment change
4. **Vercel cron reliability** — expiry-warning email has a single 3–4 day window; if the daily cron is missed the email never sends. Consider widening the window with a dedup column

### Near-Term
5. **Server-side content gating** — mock-test content ships client-side (offline PWA requirement); enforce per-test attempt limits at the API layer for logged-in users
6. **Renewal receipt email** (webhook has a TODO slot in `invoice.paid`)
7. **Analytics review** — PostHog funnels for landing → signup → checkout

### Future
8. **Community features** — study groups, leaderboards
9. **B2B portal** — migration agent licensing dashboard

---

## 🛠️ How to Resume Development

### 1. Clone & Setup
```bash
git clone https://github.com/kevinst303/citizenmate.git CitizenMate
cd CitizenMate/citizenmate
pnpm install
cp .env.example .env.local   # fill in keys
```

### 2. Run
```bash
PORT=3002 pnpm dev           # dev (webpack)
pnpm test                    # vitest (29 tests)
pnpm build                   # production build
pnpm validate-i18n           # dictionary drift check
```

### 3. Deploy
Push to `main` → Vercel auto-deploys. Supabase migrations run via `supabase db push` (linked project) or the dashboard SQL editor.

---

## 📊 Content Stats

| Topic | Questions |
|-------|-----------|
| Australian Values | 135 |
| Australia & Its People | 125 |
| Government & Law | 120 |
| Democratic Beliefs | 120 |
| **Total** | **~500** |

**Mock Tests**: 15 tests × 20 questions (15 general + 5 values, seeded shuffling)  
**Locales**: en, es, hi, zh, ar, vi (0% drift, `pnpm validate-i18n`)

---

*Last updated 2026-10-01 — v1.6 Payment Trust & Production Readiness*
