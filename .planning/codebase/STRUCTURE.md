# Project Structure

## Repository Layout

```
AuTest/                              ← Repository root
├── citizenmate/                     ← Main application (Next.js 16)
│   ├── src/                         ← Source code (~24,196 LOC)
│   │   ├── app/                     ← Next.js App Router pages & API routes
│   │   ├── components/              ← React components (6 groups)
│   │   ├── content/                 ← MDX blog content
│   │   ├── data/                    ← Static data (questions, study content)
│   │   ├── lib/                     ← Shared logic, contexts, utilities
│   │   ├── proxy.ts                 ← Supabase auth middleware
│   │   └── sw.ts                    ← Service worker (Serwist)
│   ├── supabase/                    ← Database schema
│   ├── scripts/                     ← Image generation scripts
│   ├── public/                      ← Static assets (icons, images, manifest)
│   ├── docs/                        ← Internal documentation
│   ├── package.json                 ← Dependencies & scripts
│   ├── next.config.ts               ← Next.js config (Serwist, CSP, headers)
│   ├── tsconfig.json                ← TypeScript config
│   ├── components.json              ← shadcn/ui config
│   ├── eslint.config.mjs            ← ESLint flat config
│   └── postcss.config.mjs           ← PostCSS (Tailwind v4)
├── design-system/                   ← Design system documentation
│   └── citizenmate/
│       ├── MASTER.md                ← Master design reference
│       └── pages/                   ← Per-page design specs
├── docs/                            ← Project-level docs
│   ├── research/                    ← Design research
│   └── superpowers/                 ← Additional docs
├── .planning/                       ← GSD project management
├── .agent/                          ← Agent config (workflows, skills)
├── BUSINESS_PLAN.md                 ← Business plan document
├── MEMORY.md                        ← Session context memory
└── README.md                        ← Project overview
```

## Source Directory Deep Dive

### `src/app/` — Pages & Routes

```
app/
├── layout.tsx               ← Root layout (providers, fonts, metadata, JSON-LD)
├── page.tsx                 ← Landing page (composites 10 landing components)
├── globals.css              ← Design system (1018 lines, tokens + utilities)
├── error.tsx                ← Global error boundary
├── not-found.tsx            ← 404 page
├── loading.tsx              ← Global loading state
├── opengraph-image.tsx      ← Dynamic OG image generation
├── sitemap.ts               ← Dynamic sitemap
├── robots.ts                ← Robots.txt
├── favicon.ico              ← Favicon
│
├── dashboard/               ← User dashboard
│   ├── layout.tsx           ← Dashboard layout wrapper
│   └── page.tsx             ← Dashboard page (~30KB — large component)
│
├── practice/                ← Quiz practice area
│   ├── layout.tsx           ← Practice layout
│   ├── page.tsx             ← Test selection page
│   ├── [testId]/            ← Dynamic quiz route
│   │   ├── layout.tsx
│   │   ├── page.tsx         ← Active quiz session
│   │   └── results/
│   │       └── page.tsx     ← Quiz results page
│   └── smart/               ← Smart practice (SRS)
│       ├── layout.tsx
│       ├── page.tsx         ← Smart practice setup
│       └── session/
│           └── page.tsx     ← Smart practice session
│
├── study/                   ← Study mode
│   ├── layout.tsx           ← Study layout
│   ├── page.tsx             ← Topic overview
│   └── [topicId]/
│       └── page.tsx         ← Topic detail (bilingual content)
│
├── blog/                    ← Blog system
│   ├── layout.tsx           ← Blog layout
│   ├── page.tsx             ← Blog index (server)
│   ├── [slug]/
│   │   └── page.tsx         ← Individual blog post (MDX)
│   └── blog-client.tsx      ← Client-side blog interactions
│
├── api/                     ← API route handlers
│   ├── chat/
│   │   └── route.ts         ← AI Tutor (Gemini streaming)
│   ├── checkout/
│   │   └── route.ts         ← Stripe checkout session creation
│   ├── webhooks/
│   │   └── stripe/
│   │       └── route.ts     ← Stripe webhook receiver
│   ├── abs-population/
│   │   └── route.ts         ← ABS population data proxy
│   ├── australia-insights/
│   │   └── route.ts         ← Australia facts API
│   └── generate-image/
│       └── route.ts         ← AI image generation (Kie.ai)
│
├── privacy/page.tsx         ← Privacy policy
├── terms/page.tsx           ← Terms of service
├── cookies/page.tsx         ← Cookie policy
└── offline/                 ← PWA offline fallback
    ├── layout.tsx
    └── page.tsx
```

### `src/components/` — Component Groups

```
components/
├── landing/                 ← Landing page sections (12 components)
│   ├── hero.tsx             ← Hero section with generated background
│   ├── features.tsx         ← Feature cards grid
│   ├── how-it-works.tsx     ← Step-by-step guide
│   ├── interactive-demo.tsx ← Live quiz demo
│   ├── stats-hero.tsx       ← Statistics display
│   ├── social-proof.tsx     ← Testimonials/social proof
│   ├── pricing-preview.tsx  ← Pricing cards (10KB — complex component)
│   ├── faq.tsx              ← FAQ accordion
│   ├── cta-section.tsx      ← CTA section
│   ├── inline-cta.tsx       ← Inline CTA (zero-prop component)
│   └── footer.tsx           ← Site footer (4-column Conseil layout)
│
├── quiz/                    ← Quiz flow components (6 components)
│   ├── quiz-card.tsx        ← Question card with answer selection
│   ├── quiz-header.tsx      ← Quiz status bar (score, timer, progress)
│   ├── quiz-progress.tsx    ← Visual progress indicator
│   ├── quiz-timer.tsx       ← Countdown timer (45 min)
│   ├── results-summary.tsx  ← Results page (16KB — complex with charts)
│   └── question-review.tsx  ← Individual question review
│
├── study/                   ← Study mode components (4 components)
│   ├── study-section-card.tsx  ← Section card with bilingual content
│   ├── study-progress-bar.tsx  ← Topic progress indicator
│   ├── key-facts-panel.tsx     ← Key facts sidebar
│   └── language-toggle.tsx     ← EN/ZH language switcher
│
├── dashboard/               ← Dashboard widgets (7 components)
│   ├── abs-insights-widget.tsx     ← ABS population stats
│   ├── country-facts-widget.tsx    ← Australia facts
│   ├── currency-widget.tsx         ← Currency conversion
│   ├── holidays-widget.tsx         ← Upcoming holidays
│   ├── weather-widget.tsx          ← Weather widget
│   └── life-in-australia-section.tsx ← "Life in Australia" section wrapper
│
├── shared/                  ← Cross-cutting components (14 components)
│   ├── navbar.tsx           ← Main navigation (12KB — complex with mobile)
│   ├── layout-shell.tsx     ← Body wrapper (navbar + footer)
│   ├── auth-modal.tsx       ← Login/signup modal (10KB)
│   ├── chat-widget.tsx      ← AI Tutor floating widget (18KB — largest component)
│   ├── user-menu.tsx        ← Authenticated user dropdown
│   ├── premium-gate.tsx     ← Premium feature gating
│   ├── subpage-hero.tsx     ← Subpage hero banner
│   ├── test-date-banner.tsx ← Test countdown banner
│   ├── test-date-modal.tsx  ← Test date selection modal
│   ├── cookie-consent.tsx   ← Cookie consent bar
│   ├── install-prompt.tsx   ← PWA install prompt
│   ├── legal-layout.tsx     ← Legal pages wrapper
│   └── analytics.tsx        ← GA4 integration
│
├── ui/                      ← shadcn/ui primitives (7 components)
│   ├── button.tsx           ← Button (CVA variants)
│   ├── card.tsx             ← Card
│   ├── accordion.tsx        ← Accordion
│   ├── badge.tsx            ← Badge
│   ├── separator.tsx        ← Separator
│   ├── sheet.tsx            ← Sheet (mobile drawer)
│   └── goey-toaster.tsx     ← Toast notification container
│
└── mdx-components.tsx       ← Custom MDX component mappings
```

### `src/lib/` — Shared Logic

```
lib/
├── auth-context.tsx         ← Auth provider (user, premium, checkout)
├── quiz-context.tsx         ← Quiz session state management
├── study-context.tsx        ← Study progress state
├── srs-context.tsx          ← SRS performance state
├── test-date-context.tsx    ← Test date countdown
├── srs-engine.ts            ← SM-2 spaced repetition algorithm
├── srs-types.ts             ← SRS TypeScript types
├── readiness.ts             ← Readiness score calculator
├── sync.ts                  ← localStorage ↔ Supabase bidirectional sync
├── supabase.ts              ← Browser Supabase client (singleton)
├── supabase-server.ts       ← Server Supabase client (cookie-based)
├── supabase-admin.ts        ← Admin Supabase client (service role)
├── chat-context.ts          ← AI Tutor system prompt
├── rate-limit.ts            ← In-memory API rate limiter
├── abs-api.ts               ← ABS external API client
├── mdx.ts                   ← MDX file loading utilities
├── toast.ts                 ← Toast notification wrapper
├── types.ts                 ← Core TypeScript types (Quiz, Study)
└── utils.ts                 ← cn() utility (clsx + tailwind-merge)
```

### `src/data/` — Static Content

```
data/
├── questions.ts             ← 500+ citizenship test questions (~373KB)
├── study-content.ts         ← Bilingual study material (~39KB, EN+ZH)
└── tests.ts                 ← Test definitions (mock test configs)
```

### `src/content/` — Blog MDX

```
content/
└── blog/                    ← 20 MDX blog posts
    ├── ai-weakness-identification.mdx
    ├── australian-values-guarantee.mdx
    ├── fail-rates-2024.mdx
    └── ... (20 total)
```

## Key Naming Conventions

| Convention | Example | Usage |
|-----------|---------|-------|
| kebab-case files | `quiz-card.tsx`, `auth-context.tsx` | All source files |
| PascalCase exports | `QuizCard`, `AuthProvider` | Components and providers |
| camelCase functions | `calculateReadiness`, `syncAllToSupabase` | Utility functions |
| `*-context.tsx` | `auth-context.tsx`, `quiz-context.tsx` | React Context providers |
| `*-widget.tsx` | `weather-widget.tsx` | Dashboard data widgets |
| `UPPER_CASE.md` | `STACK.md`, `ARCHITECTURE.md` | Documentation files |

## Large Files (>5KB)

| File | Size | Notes |
|------|------|-------|
| `src/data/questions.ts` | 373KB | Static question bank, should not be edited manually |
| `src/data/study-content.ts` | 39KB | Bilingual content, structured by topic |
| `src/app/dashboard/page.tsx` | 30KB | Dashboard — candidate for component extraction |
| `src/app/globals.css` | 24KB | Full design system — 1018 lines |
| `src/components/shared/chat-widget.tsx` | 18KB | AI Tutor widget — complex component |
| `src/app/practice/page.tsx` | 17KB | Practice test selection |
| `src/components/quiz/results-summary.tsx` | 16KB | Results with charts |
| `src/app/study/page.tsx` | 14KB | Study topic overview |
| `src/lib/quiz-context.tsx` | 13KB | Quiz state management |
| `src/components/shared/navbar.tsx` | 12KB | Navigation with mobile menu |
| `src/components/landing/pricing-preview.tsx` | 11KB | Pricing section |
