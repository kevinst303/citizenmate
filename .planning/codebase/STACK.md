# Technology Stack

## Runtime & Language

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | ^5 |
| Runtime | Node.js | (via Next.js) |
| Framework | Next.js | 16.2.0 |
| React | React | 19.2.4 |
| Build System | Turbopack (dev) / Webpack (prod) | built-in |

## Key Framework Details

- **Next.js 16** — Uses the App Router exclusively (`src/app/`). No Pages Router.
- **React 19** — Latest React with concurrent features.
- **Turbopack** in development mode; Webpack for production builds (`next build --webpack`).
- **TypeScript Strict Mode** — `strict: true` in `tsconfig.json`, target ES2017, bundler module resolution.

## Styling

| Tool | Purpose | Config File |
|------|---------|-------------|
| Tailwind CSS | v4 — utility-first CSS | `src/app/globals.css` (`@import "tailwindcss"`) |
| `@tailwindcss/postcss` | PostCSS integration | `postcss.config.mjs` |
| `tw-animate-css` | Animation utilities | Imported in globals.css |
| Custom CSS | Conseil design system classes | `src/app/globals.css` (~1018 lines) |

### Design Tokens (Conseil/Pixfort Inspired)

Core palette defined as CSS custom properties in `globals.css`:

- **Primary teal**: `#006d77` (brand color, used throughout)
- **Secondary purple**: `#3d348b` (accent)
- **Dark**: `#1a1a1a` (headings, dark CTAs)
- **Alt background**: `#F4F4F5` (sections)
- **Fonts**: Poppins (headings), Inter (body) — loaded via `next/font/google`
- **Card radius**: 15px (`.card-conseil`)
- **Card shadow**: dual-layer (`rgba(0,0,0,0.05) 0px 2px 6px, rgba(0,0,0,0.1) 0px 8px 19.2px`)

Legacy aliases exist: `cm-navy` → maps to `#006d77` (same as teal).

## UI Component Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| shadcn/ui (v4) | `shadcn@^4.1.0` | UI primitives (Button, Card, Accordion, Badge, Sheet, Separator) |
| `@base-ui/react` | `^1.3.0` | Base unstyled components |
| Lucide React | `^0.577.0` | Icon set |
| `class-variance-authority` | `^0.7.1` | Component variants (CVA) |
| `clsx` + `tailwind-merge` | `^2.1.1` / `^3.5.0` | Class name utilities |
| Framer Motion | `^12.38.0` | Entrance animations, transitions |
| Recharts | `^3.8.0` | Dashboard charts |

**shadcn/ui config** (`components.json`): Style `base-nova`, using CSS variables, RSC enabled, Lucide icons. Aliases: `@/components/ui`, `@/lib/utils`.

## Data & Content

| Type | Technology | Details |
|------|-----------|---------|
| Question bank | Static TS file | `src/data/questions.ts` (~373KB, ~500+ questions) |
| Study content | Static TS file | `src/data/study-content.ts` (~39KB, bilingual EN/ZH) |
| Test definitions | Static TS file | `src/data/tests.ts` (~5KB) |
| Blog content | MDX files | `src/content/blog/` (20 articles) |
| MDX rendering | `next-mdx-remote@^6` | Server-side MDX, `gray-matter` for frontmatter |

## Authentication & Database

| Service | Library | Role |
|---------|---------|------|
| Supabase Auth | `@supabase/ssr@^0.9.0`, `@supabase/supabase-js@^2.99.3` | Email/password + Google OAuth |
| Supabase Database | PostgreSQL (hosted) | Profiles, study progress, quiz history, quiz attempts |

Client setup:
- **Browser**: Singleton pattern in `src/lib/supabase.ts` via `createBrowserClient`
- **Server**: Cookie-based in `src/lib/supabase-server.ts` via `createServerClient`
- **Admin**: Service role key in `src/lib/supabase-admin.ts` (webhook use only)
- **Middleware**: Session refresh proxy in `src/proxy.ts`

## Payments

| Service | Library | Version |
|---------|---------|---------|
| Stripe | `stripe@^21.0.1` | Server-side SDK |
| Stripe.js | `@stripe/stripe-js@^9.0.1` | Client-side (unused currently, checkout is redirect-based) |

Product model: "Sprint Pass" — one-time payment, 90-day premium access.

## AI / ML

| Service | Library | Purpose |
|---------|---------|---------|
| Google Gemini (Gemini 2.5 Flash) | `@ai-sdk/google@^3.0.43` | AI Tutor chatbot backend |
| Vercel AI SDK | `ai@^6.0.116`, `@ai-sdk/react@^3.0.118` | Streaming chat UI framework |

## PWA / Service Worker

| Library | Purpose |
|---------|---------|
| Serwist | `serwist@^9.5.7`, `@serwist/next@^9.5.7` | Service worker with precaching, offline fallback |

Config in `next.config.ts`: SW source `src/sw.ts`, disabled in development.
Offline fallback page at `/offline`.

## Analytics & Monitoring

| Service | Library |
|---------|---------|
| Vercel Analytics | `@vercel/analytics@^2.0.1` |
| Google Analytics (GA4) | Custom `<Analytics>` component in `src/components/shared/analytics.tsx` |

## Toast Notifications

| Library | Purpose |
|---------|---------|
| `goey-toast@^0.3.0` | Toast notification system |

Custom wrapper in `src/lib/toast.ts`.

## SEO

| Feature | Implementation |
|---------|---------------|
| Sitemap | `src/app/sitemap.ts` — dynamic generation |
| Robots | `src/app/robots.ts` |
| OpenGraph | `src/app/opengraph-image.tsx` (dynamic OG image) |
| Structured data | JSON-LD in root `layout.tsx` |
| Meta tags | Per-page `Metadata` exports |
| Canonical URLs | `metadataBase: new URL("https://citizenmate.com.au")` |

## Security

- **CSP headers**: Comprehensive Content-Security-Policy in `next.config.ts`
- **Security headers**: X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **RLS**: Row-Level Security on all Supabase tables
- **Auth verification**: Stripe checkout verifies user server-side (never trusts client)
- **Rate limiting**: In-memory rate limiter (`src/lib/rate-limit.ts`) for AI chat API

## Development Scripts

```json
{
  "dev": "next dev --port ${PORT:-4000}",
  "dev:local": "PORT=4000 next dev",
  "build": "next build --webpack",
  "vercel-build": "next build --webpack",
  "start": "next start",
  "lint": "eslint"
}
```

## Linting

- ESLint 9 flat config (`eslint.config.mjs`)
- `eslint-config-next` (core-web-vitals + TypeScript)

## Deployment

| Platform | Configuration |
|----------|---------------|
| Vercel | Auto-deploy from GitHub, `vercel-build` script |
| Domain | `citizenmate.com.au` |

## Image Generation Scripts

Utility scripts in `citizenmate/scripts/`:
- `generate-conseil-images.mjs` — Generates hero/CTA images using Imagen 4
- `generate-blog-images.ts` — Blog post header images
- `generate-images.py` / `.sh` / `.ts` — Various image generation pipelines
