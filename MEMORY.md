# 🧠 CitizenMate — Project Memory

> **Last Updated**: 2026-03-23  
> **Purpose**: Full project context for resuming work on any device with Google Antigravity IDE.  
> **NotebookLM**: [AU Citizenship Test SaaS — Knowledge Base](https://notebooklm.google.com/notebook/a4e76a2c-165c-42d6-9f2a-49960264fb93)

---

## 📍 Current State

**Phase**: MVP Complete — Ready for Beta Testing  
**Branch**: `main`  
**Last Session**: 2026-03-23 — Committed full project to git for cross-device continuity

### Completed Sub-Projects

| # | Sub-Project | Status | Key Commits |
|---|-------------|--------|-------------|
| 1 | Foundation + Landing Page | ✅ Complete | Initial commit, design system, branding |
| 2 | Mock Test Engine + Quiz UI | ✅ Complete | Quiz engine, practice mode, SRS smart practice |
| 3 | Auth + Cloud Progress | ✅ Complete | Supabase auth, data sync, cloud persistence |
| 4 | Bilingual Study Guide | ✅ Complete | Study mode with topic progress tracking |
| 5 | AI Tutor Chatbot | ✅ Complete | Gemini streaming, floating widget |
| 6 | PWA + Offline | ✅ Complete | Service worker, offline fallback, install prompt |
| 7 | Dashboard + Readiness | ✅ Complete | Readiness score, test-date countdown |
| 8 | Expanded Question Bank | ✅ Complete | ~150 questions, 6 mock tests |
| 9 | Smart Practice (SRS) | ✅ Complete | Spaced repetition engine |

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 16 + TypeScript | App Router, RSC |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Dark mode, responsive |
| **Animation** | Framer Motion | Page transitions, micro-animations |
| **Icons** | Lucide React | SVG icons, tree-shakeable |
| **Auth** | Supabase Auth | Email/password, Google OAuth |
| **Database** | Supabase (Postgres) | Quiz attempts, study progress, test dates |
| **AI** | Google Gemini API (via AI SDK) | Streaming chat, rate-limited |
| **PWA** | Serwist (Workbox) | Offline support, install prompt |
| **Hosting** | Vercel (planned) | Not yet deployed |

### Directory Structure

```
AuTest/                          ← Project root (git repo)
├── .agent/                      ← Antigravity agent config
│   ├── AGENT.md                 ← Global agent instructions
│   ├── skills/                  ← Project-specific skills
│   │   └── ui-ux-pro-max/       ← UI design intelligence
│   └── workflows/               ← Automated workflows
├── citizenmate/                 ← Next.js application
│   ├── src/
│   │   ├── app/                 ← Pages (App Router)
│   │   │   ├── layout.tsx       ← Root layout
│   │   │   ├── page.tsx         ← Landing page
│   │   │   ├── dashboard/       ← Readiness dashboard
│   │   │   ├── practice/        ← Quiz & smart practice
│   │   │   │   ├── [testId]/    ← Individual test pages
│   │   │   │   └── smart/       ← SRS smart practice
│   │   │   ├── study/           ← Study guide
│   │   │   │   └── [topicId]/   ← Individual topic pages
│   │   │   ├── api/chat/        ← AI tutor API endpoint
│   │   │   └── offline/         ← Offline fallback page
│   │   ├── components/
│   │   │   ├── landing/         ← Landing page sections
│   │   │   ├── quiz/            ← Quiz engine UI
│   │   │   ├── study/           ← Study guide UI
│   │   │   ├── shared/          ← Layout shell, nav, footer
│   │   │   └── ui/              ← shadcn/ui primitives
│   │   ├── data/
│   │   │   ├── questions.ts     ← Question bank (~150 questions)
│   │   │   └── tests.ts         ← Mock test definitions (6 tests)
│   │   └── lib/
│   │       ├── types.ts         ← TypeScript interfaces
│   │       ├── quiz-context.tsx  ← Quiz state management
│   │       ├── readiness.ts     ← Readiness score algorithm
│   │       ├── srs-engine.ts    ← Spaced repetition algorithm
│   │       ├── srs-context.tsx  ← SRS state management
│   │       └── srs-types.ts    ← SRS TypeScript types
│   ├── supabase/                ← Database migrations
│   └── public/                  ← Static assets, icons, manifest
├── docs/
│   ├── research/                ← Market research & validation
│   └── superpowers/
│       ├── plans/               ← Implementation plans
│       └── specs/               ← Design specifications
├── design-system/               ← Design token references
├── BUSINESS_PLAN.md             ← Full business plan (v3)
├── README.md                    ← Project overview
└── MEMORY.md                    ← This file
```

---

## 🎨 Design System

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Navy Blue | `#0C2340` | Primary — headers, nav, CTA backgrounds |
| Federation Red | `#DC2626` | Accent — alerts, important actions |
| Eucalyptus Green | `#059669` | Success — progress, completed states |
| Gold | `#F59E0B` | Warning — countdown, highlights |
| Slate | `#64748B` | Text secondary, borders |

### Typography
- **Headings**: Inter (Google Fonts)
- **Body**: System font stack with Inter fallback

### Theme
- Australian flag-inspired palette (navy, red, white)
- Dark mode support via Tailwind
- Glassmorphism effects on cards
- Smooth Framer Motion animations throughout

---

## 🔑 Environment Variables

The app requires these env vars in `citizenmate/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=<your-gemini-api-key>
```

> ⚠️ **IMPORTANT**: `.env.local` is gitignored. You must create this file on each new device.

---

## 📋 Key Decisions Log

### 1. Monorepo Structure
- **Decision**: Keep all project files (docs, plans, agent config, app code) in one git repo
- **Rationale**: Simplifies version control, ensures docs/plans travel with the code
- **Previous State**: `citizenmate/` had its own nested `.git`; consolidated to root-level repo

### 2. Client-Side State First
- **Decision**: Use localStorage for primary state, sync to Supabase on auth
- **Rationale**: Works offline, fast, no server dependency for core quiz flow
- **Impact**: Users can use app without signing in; data syncs when they authenticate

### 3. SRS (Spaced Repetition) Engine
- **Decision**: Custom lightweight SRS implementation (no external library)
- **Rationale**: Simple enough for quiz cards, avoids dependency bloat
- **Files**: `srs-engine.ts`, `srs-context.tsx`, `srs-types.ts`

### 4. AI Tutor via Gemini
- **Decision**: Google Gemini API with AI SDK streaming
- **Rationale**: Cost-effective, good quality for test prep Q&A
- **Files**: `app/api/chat/route.ts`, floating chat widget component

### 5. PWA with Serwist
- **Decision**: Serwist (modern Workbox wrapper) for service worker
- **Rationale**: Better Next.js integration than raw Workbox
- **Files**: `next.config.ts` (Serwist plugin config)

---

## 🚀 Next Steps (Prioritized)

### Immediate (Before Beta)
1. **Deploy to Vercel** — Connect repo, configure env vars
2. **Supabase production setup** — Create production project, run migrations
3. **Domain setup** — citizenmate.com DNS configuration
4. **SEO verification** — Test meta tags, sitemap, Open Graph

### Near-Term (Post-Beta)
5. **Stripe payments** — Implement Exam Sprint Pass ($29.99/60 days)
6. **User onboarding flow** — Welcome tour, test date picker modal
7. **Analytics** — PostHog integration for feature tracking
8. **Email notifications** — Study reminders, countdown emails

### Future
9. **Multilingual expansion** — Add Vietnamese, Mandarin, Hindi study translations
10. **Community features** — Study groups, leaderboards
11. **B2B portal** — Migration agent licensing dashboard

---

## 🛠️ How to Resume Development

### 1. Clone & Setup
```bash
git clone <repo-url> CitizenMate
cd CitizenMate/citizenmate
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

### 3. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

### 4. Agent Context
The `.agent/` directory contains all Antigravity IDE configuration:
- **AGENT.md** — Global operating rules (memory-first, skill priority)
- **skills/** — Project-specific skills (UI/UX Pro Max)
- **workflows/** — Automated workflows (memory-save, smart-research, etc.)

### 5. External Memory (NotebookLM)
Query the project notebook for past research and decisions:
```
Notebook: "AU Citizenship Test SaaS — Knowledge Base"
ID: a4e76a2c-165c-42d6-9f2a-49960264fb93
```

---

## 📊 Question Bank Stats

| Topic | Questions | Coverage |
|-------|-----------|----------|
| Australian Values | ~38 | Democratic beliefs, freedom, equality |
| History | ~38 | Indigenous history, settlement, federation |
| Government | ~38 | Three levels, Parliament, Constitution |
| Symbols | ~38 | Flag, anthem, coat of arms, flora/fauna |
| **Total** | **~150** | Comprehensive exam coverage |

**Mock Tests**: 6 tests × 20 questions each  
**Smart Practice**: SRS algorithm adapts to weak areas

---

*Last updated by Antigravity IDE — 2026-03-23T10:09+11:00*
