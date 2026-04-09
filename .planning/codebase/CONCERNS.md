# Concerns

## Technical Debt

### 1. Legacy Glassmorphism Remnants (Known — from STATE.md)

Several components retain old glass/blur effects from pre-Conseil design that don't match the current design system:

| Component | File | Issue |
|-----------|------|-------|
| `stat-card` CSS class | `src/app/globals.css` | Retains `backdrop-filter: blur(16px)` in dashboard stats grid |
| `CountryFactsWidget` | `src/components/dashboard/country-facts-widget.tsx` | Uses `glass-card-premium` class |
| `quiz-header.tsx` | `src/components/quiz/quiz-header.tsx` | Sticky bar uses `backdrop-blur-lg` on `bg-white/95` |
| `auth-modal.tsx` | `src/components/shared/auth-modal.tsx` | Submit button uses legacy `bg-cm-navy` alias |

**Impact**: Visual inconsistency with Conseil design spec. Functional but not pixel-accurate.

### 2. Legacy `cm-navy` Class Usage

Several files still reference `cm-navy` color classes (which alias to teal `#006d77`):

Found in:
- `src/app/practice/page.tsx` — Extensive use of `bg-cm-navy`, `text-cm-navy`, `hover:text-cm-navy`, etc. (10+ instances)
- `src/app/practice/smart/session/page.tsx` — Some `cm-navy` references
- `src/components/shared/auth-modal.tsx` — `bg-cm-navy` on submit button

**Impact**: Low (renders identically since they're aliased), but creates confusion when reading code. Should be normalized to `cm-teal`.

### 3. Practice Page Not Fully Conseil-Styled

`src/app/practice/page.tsx` uses `glass-card` and other pre-Conseil styles that weren't updated during the v1.0 design overhaul. It was likely out of scope for Phase 3 tracks.

---

## Fragile Areas

### 1. Dashboard Page Monolith

`src/app/dashboard/page.tsx` is **30KB** — the single largest page component. It contains:
- Readiness score calculation
- Quiz history display
- Topic mastery breakdown
- Multiple widget integrations
- Study progress visualization
- Test countdown logic

**Risk**: Any change to the dashboard requires understanding the entire 800+ line component. A bug in one section can cascade to others.

**Recommendation**: Extract into sub-components (`ReadinessPanel`, `QuizHistorySection`, `TopicGrid`, etc.).

### 2. Static Question Bank (373KB Compiled)

`src/data/questions.ts` is 373KB of static TypeScript data compiled into the JS bundle. This:
- Bloats the client-side bundle significantly
- Has no validation (no automated checks for ID uniqueness, valid indices)
- Cannot be updated without a rebuild
- Makes the initial page load heavier

**Recommendation**: Consider lazy-loading or splitting the question bank by topic.

### 3. In-Memory Rate Limiter

`src/lib/rate-limit.ts` uses an in-memory `Map` for rate limiting. The code already documents this:
> "NOTE: This is per-instance. For multi-instance deployments (e.g. Vercel serverless), consider using Upstash Redis rate limiting instead."

**Impact**: On Vercel (serverless), each function invocation gets a fresh memory space, making the rate limiter ineffective. A determined user could bypass the free-tier AI tutor limit.

### 4. localStorage Reliance

All user progress relies on `localStorage`:
- If the user clears browser data, all progress is lost (unless previously synced to Supabase)
- No cross-device sync without signing in
- No prompt to sign in to save progress
- Data merge on sign-in uses "union" strategy (may retain stale data)

### 5. Chat Widget Complexity

`src/components/shared/chat-widget.tsx` at 18KB is the most complex component. It handles:
- Message streaming state
- Rate limit tracking (client-side)
- Typing indicators
- Follow-up suggestions
- Expand/collapse panel
- Mobile responsiveness

Any refactor needs careful handling of the streaming state machine.

---

## Security Considerations

### 1. CSP Configuration Includes `unsafe-inline` and `unsafe-eval` (Dev)

`next.config.ts` CSP:
- `script-src 'unsafe-inline'` — always enabled (required by Next.js)
- `script-src 'unsafe-eval'` — enabled in development only
- `style-src 'unsafe-inline'` — required for styled-components/Tailwind

**Impact**: `unsafe-inline` for scripts weakens CSP protection. This is a common Next.js trade-off.

### 2. No CSRF Protection on API Routes

The `POST /api/checkout` and `POST /api/chat` routes verify Supabase auth but don't check for CSRF tokens. Next.js App Router API routes don't include automatic CSRF protection.

**Mitigation**: The routes require authentication (Supabase session cookie), which provides some protection.

### 3. Rate Limiter Bypassable (See Fragile Areas #3)

The in-memory rate limiter doesn't persist across serverless function invocations.

---

## Performance Concerns

### 1. Large Bundle Size

- `questions.ts` (373KB) + `study-content.ts` (39KB) = ~412KB of static data in the client bundle
- `globals.css` (24KB) — large because it includes the full design system
- No dynamic imports or code splitting for data files

### 2. No Image Optimization

The `public/generated/` directory contains pre-generated images, but there's no evidence of Next.js `<Image>` component usage in landing components for automatic optimization (WebP conversion, lazy loading, etc.).

### 3. Service Worker Precaching

Serwist precaches all routes, which could lead to large cache sizes if the question bank grows further.

---

## Missing Features / Gaps

### 1. No Automated Tests
See `TESTING.md` for detailed analysis. This is the most significant gap.

### 2. No Error Tracking
No Sentry, LogRocket, or other error tracking service configured. Console errors are the only diagnostic tool in production.

### 3. No i18n Framework
Bilingual content (EN/ZH) is handled manually via paired fields (`title`/`titleZh`, `content`/`contentZh`). There's no `next-intl` or `i18next` integration. Adding a third language would require touching every content file and component.

### 4. No Database Migrations
`supabase/schema.sql` is a flat SQL file. There's no migration system (no `supabase/migrations/` directory). Schema changes must be applied manually.

### 5. No CI/CD Pipeline Definition
No `.github/workflows/`, `vercel.json`, or CI config files. Deployment relies entirely on Vercel's auto-detect behavior with the `vercel-build` script.

---

## Summary Priority Matrix

| Issue | Severity | Effort | Impact |
|-------|----------|--------|--------|
| No automated tests | 🔴 High | Medium | Blocks confident refactoring |
| Dashboard monolith (30KB) | 🟡 Medium | Medium | Maintainability risk |
| In-memory rate limiter | 🟡 Medium | Low | Security on serverless |
| Legacy cm-navy/glass classes | 🟢 Low | Low | Visual consistency (cosmetic) |
| Static question bank in bundle | 🟡 Medium | Medium | Performance |
| No error tracking | 🟡 Medium | Low | Production debugging |
| No database migrations | 🟡 Medium | Low | Schema management |
