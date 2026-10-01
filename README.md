# 🇦🇺 CitizenMate

> **Your mate for the citizenship test.**

An AI-powered, multilingual web app that helps migrants prepare for the Australian citizenship test with confidence — live at **[citizenmate.com.au](https://citizenmate.com.au)**.

## ✨ Features

- 🎯 **15 Mock Tests** — realistic practice tests with 20 questions each, seeded shuffling
- 📚 **Bilingual Study Guide** — topic-by-topic study with progress tracking
- 🧠 **Smart Practice (SRS)** — spaced repetition adapts to your weak areas
- 🤖 **AI Tutor** — Ask questions via streaming chat (free tier on OpenRouter free models, premium on DeepSeek)
- 📊 **Readiness Dashboard** — Calibrated score + test-date countdown
- 🏆 **Gamification** — Daily streaks, XP levels, achievement badges
- 🎁 **Referrals** — "Help a Mate" promo codes with Stripe coupons and bonus days
- 👨‍💼 **Admin** — User management, blog CMS with AI writing tools, referral dashboard
- 📱 **PWA** — Install on phone, works offline (IndexedDB + background sync)
- 🔐 **Cloud Sync** — Sign in to sync progress across devices (Supabase)
- 🌐 **6 Locales** — English, Español, हिन्दी, 中文, العربية, Tiếng Việt
- 💳 **Payments** — Stripe Checkout + billing portal; Free / Exam Sprint Pass (A$29.99 / 60 days) / Pro / Premium tiers

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router, proxy.ts) + TypeScript + React 19 |
| Styling | Tailwind CSS 4 + shadcn/ui + Conseil design system |
| Animation | Framer Motion |
| Auth & DB | Supabase (Postgres + Auth + RLS) |
| AI | Vercel AI SDK 6 — Gemini, OpenAI, DeepSeek, OpenRouter |
| Payments | Stripe (Checkout, webhooks, billing portal, referral coupons) |
| Email | Resend (transactional templates + daily cron) |
| Rate limiting | Upstash Redis |
| Monitoring | Sentry, PostHog, GA4, Vercel Analytics |
| PWA | Serwist (Workbox) |
| Hosting | Vercel (production: citizenmate.com.au) |

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/kevinst303/citizenmate.git CitizenMate
cd CitizenMate/citizenmate

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase, Stripe, Resend, Upstash, AI keys

# Run development server (defaults to port 4000; override with PORT)
PORT=3002 pnpm dev
# Visit http://localhost:3002
```

## 📁 Project Structure

```
CitizenMate/
├── citizenmate/              ← Next.js application
│   ├── src/
│   │   ├── app/              ← App Router pages ([lang] i18n) + ~30 API routes
│   │   ├── components/       ← React components (landing, quiz, shared, ui…)
│   │   ├── data/             ← Question bank (~500 questions) & 15 test definitions
│   │   ├── i18n/             ← Dictionary loader + 6 locale dictionaries
│   │   └── lib/              ├── Utilities, contexts, types
│   │                         ├── entitlement.ts (expiry math, unit-tested)
│   │                         └── supabase-admin.ts (service-role client)
│   ├── supabase/             ← Schema + 18 migrations (RLS hardened)
│   └── public/               ← Static assets & PWA manifest
├── .planning/                ← GSD milestone state, roadmaps, audits
├── docs/                     ← Research & implementation plans
├── design-system/            ← Design token references
├── BUSINESS_PLAN.md          ← Full business plan (v3)
├── MEMORY.md                 ← Project context for AI continuity
└── README.md                 ← You are here
```

## 📋 Key Documents

| Document | Description |
|----------|-------------|
| [BUSINESS_PLAN.md](./BUSINESS_PLAN.md) | Market research, monetization, growth strategy |
| [MEMORY.md](./MEMORY.md) | Full project context — architecture, decisions, next steps |
| [.planning/STATE.md](./.planning/STATE.md) | Current milestone & progress |
| [docs/research/](./docs/research/) | Market validation & referral strategy research |
| [docs/superpowers/](./docs/superpowers/) | Implementation plans & design specs |

## 💰 Business Model

- **Freemium + Exam Sprint Pass** ($29.99 for 60 days) — primary CTA
- Pro ($14.99/mo) and Premium ($29.99/mo) subscriptions (yearly options)
- B2B licensing for migration agents (planned)
- "Help a Mate" referral program (Stripe promo codes, +7 days each side)

## 📊 Content

- **~500 questions** across 4 topics (Australian Values, Australia & Its People, Government & Law, Democratic Beliefs)
- **15 mock tests** × 20 questions each (15 general + 5 values, seeded)
- **Smart practice** with spaced repetition algorithm
- Study content translated across 6 locales

## 🔒 Security Notes

- `profiles` entitlement columns (`is_premium`, `tier`, `premium_expires_at`, …) are **service-role only** via column-level RLS grants — browsers can only update `test_date`, `study_language`, `xp`, `level`
- All Stripe entitlement writes flow through the signed webhook with event deduplication
- Rate limiting (Upstash) on chat + checkout; CSP headers via proxy.ts

---

*CitizenMate — "Your mate for the citizenship test." 🇦🇺*
