# Architecture

## Pattern: Next.js App Router SPA-Hybrid

CitizenMate is a **server-first hybrid application** built on Next.js 16 App Router. It combines:
- **Server Components** for initial page rendering (SEO, performance)
- **Client Components** for interactive features (quiz, study, chat, dashboard)
- **API Routes** for backend logic (payments, AI, data proxies)
- **localStorage** as primary data store with **Supabase cloud sync**

## Architectural Layers

```
┌─────────────────────────────────────────────────────┐
│                    Presentation                      │
│  Components (landing, quiz, study, dashboard, shared)│
│  UI Primitives (shadcn/ui: Button, Card, etc.)       │
├─────────────────────────────────────────────────────┤
│                  State Management                    │
│  React Context Providers (Auth, Quiz, Study, SRS,    │
│  TestDate) — all client-side, wrapping <body>        │
├─────────────────────────────────────────────────────┤
│                   Data Layer                         │
│  localStorage (primary) ↔ Supabase sync module       │
│  Static data (questions.ts, study-content.ts)        │
├─────────────────────────────────────────────────────┤
│                    API Layer                          │
│  Next.js Route Handlers (chat, checkout, webhooks,   │
│  abs-population, australia-insights, generate-image) │
├─────────────────────────────────────────────────────┤
│                 External Services                    │
│  Supabase (Auth+DB) · Stripe · Gemini AI · ABS ·    │
│  WeatherAPI · Kie.ai · Vercel Analytics              │
└─────────────────────────────────────────────────────┘
```

## Entry Points

| Entry Point | File | Purpose |
|-------------|------|---------|
| App shell | `src/app/layout.tsx` | Root layout with all providers, fonts, metadata |
| Home page | `src/app/page.tsx` | Landing page composition |
| Middleware | `src/proxy.ts` | Supabase session refresh on all requests |
| Service worker | `src/sw.ts` | PWA precaching + offline fallback |

## State Management

All state is managed via **React Context** providers, composed in the root layout:

```tsx
<AuthProvider>
  <TestDateProvider>
    <StudyProvider>
      <SRSProvider>
        <LayoutShell>{children}</LayoutShell>
      </SRSProvider>
    </StudyProvider>
  </TestDateProvider>
</AuthProvider>
```

### Context Providers

| Provider | File | Purpose |
|----------|------|---------|
| `AuthProvider` | `src/lib/auth-context.tsx` | User auth state, premium status, Stripe checkout, sign-in/out |
| `TestDateProvider` | `src/lib/test-date-context.tsx` | Citizenship test date tracking + countdown |
| `StudyProvider` | `src/lib/study-context.tsx` | Study progress (completed sections) |
| `SRSProvider` | `src/lib/srs-context.tsx` | Spaced repetition system state |
| `QuizProvider` | `src/lib/quiz-context.tsx` | Quiz session state (in-progress test, answers, timer) |

**All providers persist to localStorage** and sync to Supabase when user is authenticated.

## Data Flow Patterns

### Offline-First with Cloud Sync

```
User Action → Context Provider → localStorage (immediate)
                                      ↓
                              Supabase (background, if authenticated)
```

Key module: `src/lib/sync.ts` — implements bidirectional merge:
- **Push** (`syncAllToSupabase`): localStorage → Supabase on sign-in
- **Pull** (`pullFromSupabase`): Supabase → localStorage on sign-in (union merge)
- **Deduplication**: Quiz history deduped by `completed_at` timestamp

### Quiz Engine Flow

```
questions.ts (static bank) → QuizContext (session management) → QuizCard (UI)
                                                                     ↓
                                                              ResultsSummary
                                                                     ↓
                                                         readiness.ts (score)
                                                                     ↓
                                                              Dashboard
```

### Smart Practice (SRS) Flow

```
srs-engine.ts (SM-2 algorithm) → selectSmartQuestions() → Quiz Session
          ↑                                                      ↓
    SRSContext (performance records)  ←  updatePerformance() ←──┘
```

### AI Tutor Flow

```
ChatWidget (client) → POST /api/chat → Rate Limit Check
                                     → Relevance Filter (keyword-based)
                                     → Gemini 2.5 Flash (streaming)
                                     → StreamResponse → Client UI
```

### Payment Flow

```
PricingPreview → AuthContext.startCheckout()
                       ↓
              POST /api/checkout (server auth verification)
                       ↓
              Stripe Checkout (external redirect)
                       ↓
              Stripe Webhook → /api/webhooks/stripe
                       ↓
              Supabase admin update (is_premium, premium_expires_at)
```

## Component Architecture

### Domain-Specific Component Groups

| Group | Path | Components |
|-------|------|------------|
| Landing | `src/components/landing/` | Hero, Features, HowItWorks, InteractiveDemo, StatsHero, SocialProof, PricingPreview, FAQ, CTASection, InlineCTA, Footer |
| Quiz | `src/components/quiz/` | QuizCard, QuizHeader, QuizProgress, QuizTimer, ResultsSummary, QuestionReview |
| Study | `src/components/study/` | StudySectionCard, StudyProgressBar, KeyFactsPanel, LanguageToggle |
| Dashboard | `src/components/dashboard/` | ABSInsightsWidget, CountryFactsWidget, CurrencyWidget, HolidaysWidget, WeatherWidget, LifeInAustraliaSection |
| Shared | `src/components/shared/` | Navbar, LayoutShell, AuthModal, ChatWidget, UserMenu, PremiumGate, SubpageHero, TestDateBanner, TestDateModal, CookieConsent, InstallPrompt, Analytics |
| UI Primitives | `src/components/ui/` | Button, Card, Accordion, Badge, Separator, Sheet, GoeyToaster (all shadcn/ui) |

### Utility vs. Business Logic Separation

- **Pure utilities**: `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge)
- **Business logic**: `src/lib/readiness.ts` — readiness score algorithm
- **Algorithms**: `src/lib/srs-engine.ts` — SM-2 spaced repetition
- **Data access**: `src/lib/supabase.ts`, `supabase-server.ts`, `supabase-admin.ts`
- **Content processing**: `src/lib/mdx.ts` — MDX file loading

## Key Design Decisions

1. **localStorage as primary store** — Enables full offline functionality. Supabase is a convenience layer for cross-device sync, not a requirement.

2. **No middleware auth gates** — The proxy (`src/proxy.ts`) only refreshes sessions; it doesn't block routes. Auth-gating is done client-side via `useAuth()` and `PremiumGate` component.

3. **Static question bank** — All 500+ questions are compiled into the JS bundle (`src/data/questions.ts`). No API needed for questions, enabling offline quiz functionality.

4. **Conseil Design System** — All visual styling follows the Conseil/Pixfort template tokens. Custom CSS classes (`.card-conseil`, `.badge-pill`, `.btn-rounded-*`) are preferred over ad-hoc Tailwind utilities for design-system components.

5. **Streaming AI responses** — The AI tutor uses Vercel AI SDK's streaming protocol, sending tokens to the client as they're generated for instant feedback.

6. **One-time payment model** — Sprint Pass is a one-time Stripe checkout (not subscription), with explicit expiry date handling.

7. **PWA with offline fallback** — Serwist service worker precaches the app shell and serves `/offline` when network is unavailable.
