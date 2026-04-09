# External Integrations

## Supabase (Auth + Database)

**Role**: Authentication, user profiles, data persistence.

### Auth Providers
- **Email/Password**: Standard sign-up/sign-in
- **Google OAuth**: Via `signInWithOAuth({ provider: "google" })`, redirects to `/dashboard`

### Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles (extends `auth.users`) | `id`, `email`, `display_name`, `is_premium`, `premium_expires_at`, `stripe_customer_id`, `study_language`, `test_date` |
| `study_progress` | Study completion state | `user_id`, `completed_sections` (JSONB), `last_studied_at`, `last_section_id` |
| `quiz_attempts` | Full quiz attempt records | `user_id`, `test_id`, `answers` (JSONB), `flagged_questions`, `result` (JSONB) |
| `quiz_history` | Simplified quiz results for readiness | `user_id`, `test_id`, `score`, `total`, `values_correct`, `values_total`, `passed`, `topic_breakdown` (JSONB) |

### Database Functions & Triggers
- `handle_new_user()` — Auto-creates profile on auth signup
- `update_updated_at()` — Auto-updates `updated_at` timestamps on profiles and study_progress

### Row-Level Security
All 4 tables have RLS enabled. Policies restrict all operations to `auth.uid() = id/user_id`.

### Client Architecture
- **Browser client**: `src/lib/supabase.ts` — singleton `createBrowserClient` from `@supabase/ssr`
- **Server client**: `src/lib/supabase-server.ts` — cookie-based `createServerClient`, used in API routes and server components
- **Admin client**: `src/lib/supabase-admin.ts` — `SUPABASE_SERVICE_ROLE_KEY`, used only by Stripe webhook handler
- **Middleware proxy**: `src/proxy.ts` — refreshes auth session cookie on every request

### Data Sync (localStorage ↔ Supabase)
`src/lib/sync.ts` implements bidirectional sync:
- **localStorage** is the primary store (works offline)
- **On sign-in**: `syncAllToSupabase()` pushes local data → Supabase, then `pullFromSupabase()` merges cloud → local
- Synced entities: study progress, quiz history, test date, language preference
- Deduplication by `completed_at` timestamp for quiz history

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

---

## Stripe (Payments)

**Role**: One-time payment processing for "Sprint Pass" premium upgrade.

### Product Model
- **Sprint Pass**: One-time payment, grants 90 days of premium access
- On checkout success, `premium_expires_at` is set to `NOW + 90 days`

### API Routes
| Route | Purpose |
|-------|---------|
| `POST /api/checkout` | Creates Stripe Checkout Session (server-side auth-verified) |
| `POST /api/webhooks/stripe` | Handles `checkout.session.completed` and `customer.subscription.deleted` events |

### Checkout Flow
1. Client calls `POST /api/checkout` (auth required)
2. Server verifies user via Supabase server client
3. Creates Stripe Checkout Session with `client_reference_id: user.id`
4. Client redirects to Stripe-hosted checkout page
5. On success → redirects to `/dashboard?checkout=success`
6. Webhook receives `checkout.session.completed`, updates `profiles.is_premium`

### Webhook Security
- Verifies Stripe signature via `stripe.webhooks.constructEvent(body, signature, secret)`
- Uses admin Supabase client to update user profiles

### Environment Variables
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Google Gemini AI (AI Tutor)

**Role**: AI-powered citizenship test tutoring chatbot.

### Implementation
- **Model**: Gemini 2.5 Flash via `@ai-sdk/google`
- **SDK**: Vercel AI SDK (`ai`, `@ai-sdk/react`) for streaming chat
- **API Route**: `POST /api/chat` (`src/app/api/chat/route.ts`)
- **System prompt**: `src/lib/chat-context.ts` — domain-specific prompt for Australian citizenship test tutoring
- **UI**: `src/components/shared/chat-widget.tsx` — floating chat widget

### Safety & Cost Controls
| Protection | Implementation |
|-----------|---------------|
| Rate limiting | Tiered: Free users 5 req/hr (by IP), Premium 100 req/hr (by user ID) |
| Context window | Last 6 messages only |
| Message length | Truncated to 500 chars |
| Relevance filter | Zero-token pre-filter: keyword check before sending to model |
| Off-topic rejection | Falls back with a static response if no relevant keywords found |

### Environment Variables
```
GOOGLE_GENERATIVE_AI_API_KEY=<gemini-api-key>
CHAT_RATE_LIMIT=20
```

---

## Australian Bureau of Statistics (ABS) API

**Role**: Real-time population statistics for dashboard widget.

### Implementation
- **API Route**: `GET /api/abs-population` (`src/app/api/abs-population/route.ts`)
- **Client module**: `src/lib/abs-api.ts`
- **Dashboard widget**: `src/components/dashboard/abs-insights-widget.tsx`

### CSP Configuration
Connected source: `https://*.abs.gov.au`

---

## Australia Insights API

**Role**: Dynamic Australian facts/insights for dashboard.

### Implementation
- **API Route**: `GET /api/australia-insights` (`src/app/api/australia-insights/route.ts`)

---

## WeatherAPI

**Role**: Weather data for dashboard widget.

### Implementation
- **Dashboard widget**: `src/components/dashboard/weather-widget.tsx`
- **CSP Configuration**: Connected source `https://api.weatherapi.com`

---

## Kie.ai (Image Generation)

**Role**: AI image generation (likely for blog/marketing assets).

### Environment Variables
```
KIE_API_KEY=<kie-api-key>
```

### Implementation
- **API Route**: `POST /api/generate-image` (`src/app/api/generate-image/route.ts`)

---

## Vercel Analytics

**Role**: Web analytics.

### Implementation
- `<Analytics />` component from `@vercel/analytics/react` in root layout
- Automatically tracks page views and web vitals

---

## Google Analytics (GA4)

**Role**: Additional analytics tracking.

### Implementation
- Custom `<Analytics>` component in `src/components/shared/analytics.tsx`
- Measurement ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Environment Variables
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## External Data Flow Summary

```
┌───────────────┐     ┌──────────────┐     ┌───────────────┐
│   Browser     │────▷│  Next.js     │────▷│  Supabase     │
│  (localStorage│     │  API Routes  │     │  (Auth + DB)  │
│   + React)    │     │              │     └───────────────┘
│               │     │              │────▷│  Stripe       │
│               │     │              │     │  (Payments)   │
│               │     │              │     └───────────────┘
│               │     │              │────▷│  Gemini AI    │
│               │     │              │     │  (AI Tutor)   │
│               │     │              │     └───────────────┘
│               │     │              │────▷│  ABS API      │
│               │     │              │     │  (Stats)      │
│               │     │              │     └───────────────┘
│               │     │              │────▷│  WeatherAPI   │
│               │     │              │     │  (Weather)    │
└───────────────┘     └──────────────┘     └───────────────┘
```
