# CitizenMate — v1.5 Requirements

## Milestone: Production Hardening & v2 Foundation

**Goal:** Close remaining production monitoring gaps and launch-quality polish items identified in the 2026-05-15 production readiness audit.

---

## v1.5 Requirements

### Production Monitoring (PROD)

- [ ] **PROD-01**: Create `src/instrumentation.ts` that initializes Sentry SDK on server startup. Runtime errors in API routes and server components must be captured in Sentry dashboard.
- [ ] **PROD-02**: Create `src/app/global-error.tsx` as a React error boundary that captures uncaught rendering errors via `Sentry.captureException()` and displays a Conseil-styled fallback UI.
- [ ] **PROD-03**: Set explicit `metadataBase` on all 6 page layouts currently falling back to `localhost:3000`. Each layout must reference the production URL (`https://citizenmate.com.au`).
- [ ] **PROD-04**: Migrate deprecated Sentry config keys (`disableLogger`, `automaticVercelMonitors`, `reactComponentAnnotation`) to current SDK conventions per Sentry migration guide.

### Framework Modernization (FW)

- [ ] **FW-01**: Rename `middleware.ts` to `proxy.ts` per Next.js 16 convention. All existing middleware behavior (auth protection, CSP headers, locale detection) must work identically after rename.
- [ ] **FW-02**: Set `outputFileTracingRoot` explicitly in `next.config.ts` to suppress Next.js workspace inference warning.

### User Access (UX)

- [ ] **UX-01**: Fix `/auth/login` returning 404. Add a dedicated login page at `app/[lang]/auth/login/page.tsx` that renders the existing auth modal as a full-page flow, OR implement a redirect that opens the homepage with `?auth=required` trigger.
- [ ] **UX-02**: Make one practice test (e.g., "Australian Values") accessible without a subscription. Unauthenticated users visiting `/practice` must see at least one free test they can take.

### Quality (QUAL)

- [ ] **QUAL-01**: Correct i18n translation drift on `hi` (Hindi), `zh` (Chinese), and `ar` (Arabic) locale files. All three must pass `tsx scripts/validate-i18n.ts` with zero missing keys.
- [ ] **QUAL-02**: Implement Upstash Redis rate-limiter for the AI chat endpoint (`/api/chat`). Enforce the `CHAT_RATE_LIMIT` env var (default 20 req/hr/IP) with proper error responses (429) and user-facing feedback.

---

## Future Requirements (Deferred)

None — all audit findings are scoped into this milestone.

## Out of Scope

- New feature development (gamification, offline mode, targeted quizzes) — deferred to future milestones (seeds exist in `.planning/seeds/`)
- Stripe/payment changes
- Design system changes (Conseil compliance is 100%)
- PWA service worker changes (Serwist correctly configured)
- Backend API changes beyond rate-limiter

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| PROD-01 | 20. Sentry Instrumentation | Active |
| PROD-02 | 20. Sentry Instrumentation | Active |
| PROD-03 | 21. Build Warnings Resolution | Active |
| PROD-04 | 21. Build Warnings Resolution | Active |
| FW-01 | 22. Middleware Migration | Active |
| FW-02 | 21. Build Warnings Resolution | Active |
| UX-01 | 23. Auth Route Fix | Active |
| UX-02 | 24. Free Sample Test | Active |
| QUAL-01 | 25. i18n Drift Correction | Active |
| QUAL-02 | 26. Rate Limiter | Active |

10/10 requirements mapped to phases ✓

---

*Requirements defined: 2026-05-15 — v1.5 Production Hardening & v2 Foundation*
