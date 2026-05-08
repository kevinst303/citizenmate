---
status: complete
audited: "2026-05-08"
sources:
  - v1.1-MILESTONE-AUDIT.md (2026-05-05)
  - v1.1-MILESTONE-AUDIT-I18N.md (2026-05-06)
  - CODE-QUALITY-AUDIT.md (2026-05-08)
  - UI-QUALITY-AUDIT.md (2026-05-08)
  - Architecture & Security deep-dive (2026-05-08)
milestone: v1.1
milestone_name: Launch Readiness
overall_risk: MEDIUM-HIGH
total_findings: 68
  critical: 6
  high: 14
  medium: 27
  low: 21
---

# CitizenMate — Comprehensive Audit Synthesis & Improvement Plan

**Date:** 2026-05-08
**Scope:** Full codebase (24K+ LOC), Supabase backend, Stripe payments, 6-i18n surface, UI system
**Milestone:** v1.1 Launch Readiness (54% complete)

---

## Executive Summary

CitizenMate is a **solidly engineered but incomplete** SaaS application. The foundation — Next.js 16, Supabase auth/data, Conseil design system, i18n infrastructure, Stripe payments — is well-implemented. However, the gap between what's built and what's production-ready is significant.

**Health Score: 62/100**

| Dimension | Score | Assessment |
|-----------|-------|------------|
| Architecture | 7/10 | Clean layers, good separation — but monolithic dashboard + 373KB question file |
| Code Quality | 6/10 | TypeScript well-used but `any` in critical paths, code duplication, no tests beyond 15 unit tests |
| Security | 5/10 | 2 critical vulns (admin delete broken, partial refund bug), 5 high-risk findings |
| UI/UX | 6.7/10 | 16/24 score — dark mode dead, Arabic RTL broken, hardcoded colors |
| Production Readiness | 5/10 | Sentry config exists but unused manually, PostHog pageview-only, 0 verification docs |
| Feature Completeness | 5.4/10 | 54% phase completion, 7/11 requirements partial or unsatisfied |

**Verdict:** Not launch-ready. ~2-3 weeks of focused work needed to close critical security gaps, complete Phase 7 (growth), and wire monitoring properly before public launch.

---

## Critical Path to Launch (Must-Fix Before Public Users)

### Tier 0 — CRITICAL (Fix Immediately — 2-3 days)

| # | Finding | Source | Location | Fix |
|---|---------|--------|----------|-----|
| C1 | Stored XSS in blog HTML renderer | Code Audit | `components/blog/blog-html-content.tsx:74` | Sanitize with `sanitize-html` (already in deps, unused) |
| C2 | Admin user delete silently fails (wrong Supabase client) | Arch Audit | `src/app/api/admin/users/route.ts:117` | Use `createSupabaseAdminClient()` for auth.admin operations |
| C3 | Partial Stripe refund revokes premium access | Arch Audit | `src/app/api/webhooks/stripe/route.ts:238` | Check `amount_refunded === amount` before revoking |
| C4 | Rate limit bypass in chat — increments after AI call | Code Audit | `src/app/api/chat/route.ts:139-171` | Move increment to before AI call |
| C5 | Unsubscribe endpoint has no CSRF protection | Arch Audit | `src/app/api/unsubscribe/route.ts:4-8` | Add signed token or POST with nonce |
| C6 | Duplicated submit button group in quiz-header | Code Audit | `src/components/quiz/quiz-header.tsx:134-184` | Remove duplicate lines 159-184 |

### Tier 1 — HIGH (Fix Before Launch — 1 week)

| # | Finding | Source | Location | Fix |
|---|---------|--------|----------|-----|
| H1 | Self-referral possible via `raw_user_meta_data` | Arch Audit | `src/lib/referrals.ts:20-81` | Add `referrerId !== refereeId` + server-trusted referral tracking |
| H2 | Auth callback open redirect | Arch Audit | `src/app/api/auth/callback/route.ts:10,52` | Validate `next` against path whitelist |
| H3 | Blog content stored without HTML sanitization | Arch Audit | `src/app/api/admin/blog/route.ts:117-128` | Sanitize on write (not just read) |
| H4 | Arabic RTL layout completely broken | i18n Audit + UI Audit | Root layout + fonts + CSS | `dir="rtl"` + load Arabic font subsets + RTL CSS logical overrides |
| H5 | 28+ hardcoded links cause 307 redirects | i18n Audit | 28+ components | Create `getLocalizedPath(path, lang)` helper |
| H6 | Stripe checkout strips locale from return URLs | i18n Audit | `src/app/api/checkout/route.ts` | Prepend `/${lang}` to success/cancel URLs |
| H7 | LanguageSwitcher doesn't set NEXT_LOCALE cookie | i18n Audit | `src/components/shared/language-switcher.tsx` | Set cookie on switch |
| H8 | Duplicate referral cookie logic | Code Audit | `middleware.ts` + `referral-tracker.tsx` | Single source of truth |
| H9 | Stripe price interval/tier unvalidated in checkout | Code Audit | `src/app/api/checkout/route.ts:67` | Validate against known price IDs |
| H10 | PostHog only tracks $pageview — no conversion funnel | Milestone Audit | Root layout + all flows | Add `posthog.identify()` + custom events for signup/onboarding/checkout/SRS |
| H11 | Sentry not manually called in critical error paths | Milestone Audit | checkout, webhook, auth routes | Add `Sentry.captureException()` in all catch blocks |
| H12 | Column name mismatch: sync writes `preferred_language`, schema has `study_language` | i18n Audit | `src/lib/sync.ts:144` | Align field name |
| H13 | Dark mode defined but unreachable | UI Audit | `globals.css` + no toggle | Add next-themes toggle + wire `.dark` class |
| H14 | Hardcoded colors undermine design token system | UI Audit | 20+ hex values in admin, `cm-navy` legacy alias | Convert to Conseil tokens |

### Tier 2 — MEDIUM (Fix During Phase 7-9 — 2 weeks)

| # | Finding | Source | Location | Fix |
|---|---------|--------|----------|-----|
| M1 | Blog links/breadcrumbs without locale prefix | i18n Audit | `src/app/[lang]/blog/` | Add locale to all blog links |
| M2 | No RLS UPDATE/INSERT on referral_rewards table | Arch Audit | `citizenmate/supabase/schema.sql:152-155` | Add RLS policies |
| M3 | Blog SEO metadata stored without sanitization | Arch Audit | `src/app/api/admin/blog/route.ts:117-128` | Sanitize title, description, keywords |
| M4 | Cron email has no dedup — users get duplicate inactivity emails | Arch Audit | `src/app/api/cron/emails/route.ts:26-46` | Track `last_inactivity_email_sent` |
| M5 | `blog_translations` + `blog_media` tables not in migrations | Arch Audit | `citizenmate/supabase/migrations/` | Create migration files |
| M6 | Webhook events table has no auto-cleanup | Arch Audit | `supabase/schema.sql:199-204` | Add scheduled cleanup (PG cron or Edge Function) |
| M7 | No consistent API error response format | Arch Audit | Multiple API routes | Create `ApiResponse<T>` type |
| M8 | Chat route uses `any` for messages — no validation | Arch Audit | `src/app/api/chat/route.ts:91` | Add Zod validation for message structure |
| M9 | Deep provider nesting with no memoization | Arch Audit | `src/app/[lang]/layout.tsx:138-158` | Memoize provider values |
| M10 | `supabase/schema.sql` duplicated between root and `citizenmate/` | Arch Audit | Both schema directories | Consolidate to one authoritative location |
| M11 | Only 4 of 6 upgrade triggers implemented | Milestone Audit | Revenue engine | Implement remaining 2 triggers |
| M12 | Sprint Pass ($29.99 one-time) not implemented | Milestone Audit | Checkout | Add one-time payment flow |
| M13 | 15 unit tests for 24K LOC | Milestone Audit | `__tests__/` | Expand test coverage to critical paths |
| M14 | Dashboard still 675 lines monolithic | Milestone Audit | `src/app/[lang]/dashboard/page.tsx` | Extract remaining widgets |
| M15 | `authLimiter` exported but orphaned | Milestone Audit | `src/lib/rate-limit.ts` | Apply to auth routes or remove |
| M16 | `triggerSource` captured but never consumed by analytics | Milestone Audit | `src/lib/store/useUpgradeModal.ts` | Send to PostHog on modal open |
| M17 | Full-page reload for onboarding redirect | Code Audit | `src/lib/auth-context.tsx` | Use `router.push()` instead of `window.location.href` |
| M18 | Supabase sync firehose on every keystroke/click | Code Audit | `src/lib/sync.ts` | Add debouncing (500ms) |
| M19 | Study content baked into every AI system prompt | Arch Audit | `src/lib/chat-context.ts:25-50` | Implement RAG chunking or selective context |

### Tier 3 — LOW (Future Phases — ongoing)

| # | Finding | Source | Fix |
|---|---------|--------|-----|
| L1 | Offline page hardcoded English | UI Audit | Wire `useT()` to offline page |
| L2 | AI system prompt hardcoded English | UI Audit + Code Audit | Translate system prompt per locale |
| L3 | Quiz questions not in i18n system (373KB static TS) | i18n Audit | Move to JSON dictionaries or database |
| L4 | `sanitize-html` in deps but never imported | Code Audit | Remove or wire in (see C1) |
| L5 | TypeScript `any` in `deepseek.ts`, `email.ts`, `ai/write/route.ts` | Code Audit + Arch Audit | Add proper types |
| L6 | Diagnostic route leaks auth cookie names | Arch Audit | Remove or gate behind dev mode |
| L7 | CSP uses `unsafe-inline` | Arch Audit | Implement nonce-based CSP |
| L8 | Arabic/Hindi font subsets not loaded | UI Audit | Add Google Fonts subsets |
| L9 | `shadcn/components.json` has `rtl: false` | UI Audit | Enable RTL support |
| L10 | `@vitejs/plugin-react` in deps — unused with Next.js | Arch Audit | Remove |
| L11 | Multiple component hardcoded strings un-wired to i18n | UI Audit | Wire remaining strings |
| L12 | Blog date format hardcoded `en-AU` | i18n Audit | Use locale-aware date formatting |
| L13 | `Sentry DSN` reused for both client and server | Arch Audit | Separate server and client DSNs |
| L14 | PWA cache strategy may cache API responses | Arch Audit | Customize Serwist cache rules |
| L15 | Test scripts at repo root (`test-admin-access.js`, `query_profiles.js`) | Arch Audit | Move to `scripts/` or delete |
| L16 | `NEXT_PUBLIC_STRIPE_PRICE_ID_SPRINT_PASS` missing from `.env.example` | Arch Audit | Add to example file |
| L17 | `cm-navy` legacy alias in 10+ practice page instances | UI Audit + Milestone | Replace with `cm-teal` |
| L18 | Legacy glassmorphism classes in quiz-header, auth-modal, stat-card | Milestone Audit | Remove backdrop-blur patterns |

---

## Phase-Impact Matrix

How findings affect existing and planned GSD phases:

| Phase | Status | Critical/High Findings Affecting It | Recommended Action |
|-------|--------|-------------------------------------|--------------------|
| **04** Test Automation | Complete (unverified) | M13 (15 tests), M14 (monolithic dashboard) | Create VERIFICATION.md, add 50+ tests |
| **05** Production Infra | Complete (unverified) | H10 (PostHog), H11 (Sentry), M15 (authLimiter) | Wire PostHog events, Sentry captures, verification |
| **06** Revenue Engine | Complete (unverified) | M11 (missing triggers), M12 (Sprint Pass), C3 (refund bug) | Fix refund, add triggers + Sprint Pass |
| **07** Growth & Retention | Executing | C4 (rate limit), H4-H8 (i18n gaps), M4 (email dedup), M6 (cleanup) | Complete + fix i18n wiring |
| **08** Super Admin | Complete | C2 (admin delete), M1 (blog locale), M3 (blog sanitize) | Fix admin bugs + wire blog i18n |
| **09** Stripe Audit | Not started | C3 (refund), H9 (price validation), M12 (Sprint Pass) | Merge into phase — fix during audit |
| **10** Calm UX | Not started | H13 (dark mode), M9 (provider nesting), M8 (chat types) | Dark mode + animation cleanup |
| **11** Anxiety Reduction | Not started | TBD (new features) | Build anxiety-reduction features |
| **12** Gamification | Not started | TBD (new features) | Build gamification features |
| **13** Vietnamese | Planned | L2 (AI prompts), L4 (hardcoded strings) | Add vi + fix remaining i18n gaps |

---

## Recommended Revised Phase Plan

### Phase 7A: Critical Security & Bug Fixes (NEW — inject before Phase 7 completion)
**Priority:** Highest  
**Effort:** 2-3 days

- [ ] C1: Sanitize blog HTML renderer with `sanitize-html`
- [ ] C2: Fix admin delete to use admin client
- [ ] C3: Fix partial refund detection in Stripe webhook
- [ ] C4: Fix chat rate limit timing
- [ ] C5: Add CSRF to unsubscribe endpoint
- [ ] C6: Remove duplicate quiz-header button group
- [ ] H2: Fix auth callback redirect validation
- [ ] H9: Validate Stripe price interval/tier

### Phase 7B: Complete Phase 7 — Growth & Retention
**Priority:** High  
**Effort:** 1 week

- [ ] H4: Fix Arabic RTL (dir + fonts + CSS)
- [ ] H5: Fix 28+ hardcoded links with `getLocalizedPath()`
- [ ] H6: Fix Stripe checkout locale in return URLs
- [ ] H7: Set NEXT_LOCALE cookie in LanguageSwitcher
- [ ] H8: Consolidate referral cookie logic
- [ ] H12: Fix column name mismatch (`preferred_language` → `study_language`)
- [ ] GROW-01: Complete i18n wiring for remaining components
- [ ] GROW-02: Complete "Help a Mate" referral program
- [ ] GROW-03: Complete email notifications with dedup

### Phase 7C: Monitoring & Analytics Wiring
**Priority:** High  
**Effort:** 3-4 days

- [ ] H10: Add PostHog identify() + custom events (signup, onboarding, checkout, SRS, upgrade_modal)
- [ ] H11: Add Sentry.captureException() in checkout, webhook, auth, AI routes
- [ ] M16: Wire `triggerSource` to PostHog analytics

### Phase 8A: Admin Bug Fixes (inject before Phase 9)
**Priority:** Medium  
**Effort:** 2-3 days

- [ ] M1: Fix blog links/breadcrumbs without locale
- [ ] M3: Sanitize blog SEO metadata on write
- [ ] M2: Add RLS policies for referral_rewards
- [ ] M5: Create migrations for `blog_translations` + `blog_media` tables
- [ ] M7: Create consistent API response format
- [ ] M10: Consolidate duplicate schema directories

### Phase 9: Stripe Audit + Sprint Pass
**Priority:** High  
**Effort:** 3-4 days

- [ ] H1: Fix self-referral vulnerability
- [ ] M12: Implement Sprint Pass one-time payment ($29.99)
- [ ] M11: Implement remaining 2 upgrade triggers
- [ ] C3 verification: Test all refund scenarios
- [ ] H9 verification: Test price ID validation

### Phase 10: Calm UX & Dark Mode
**Priority:** Medium  
**Effort:** 1 week

- [ ] H13: Activate dark mode (next-themes + toggle)
- [ ] H14: Replace all hardcoded colors with Conseil tokens
- [ ] M9: Memoize provider values to reduce re-renders
- [ ] L1: Wire i18n to offline page
- [ ] L5: Replace `any` types in deepseek, email, ai/write
- [ ] L7: Improve CSP (nonce-based)
- [ ] L9: Enable RTL in shadcn config
- [ ] L11: Wire remaining hardcoded strings to i18n
- [ ] L12: Locale-aware date formatting
- [ ] L17: Replace cm-navy legacy alias
- [ ] L18: Remove legacy glassmorphism

---

## Quick Wins (Low Effort, High Impact — 1 Day)

These can be done immediately with minimal risk:

1. **Remove duplicate quiz-header button group** (C6) — 2 minute fix
2. **Remove duplicate schema.sql directory** (M10) — 5 minute cleanup
3. **Remove unused deps:** `@vitejs/plugin-react`, `sanitize-html` if replaced (L4, L10)
4. **Add SPRINT_PASS to .env.example** (L16)
5. **Move test scripts to scripts/** (L15)
6. **Set NEXT_LOCALE cookie in LanguageSwitcher** (H7) — simple cookie set
7. **Fix auth callback redirect validation** (H2) — add path whitelist array
8. **Remove `cm-navy` legacy alias** (L17) — global find-and-replace
9. **Wire `useT()` to offline page** (L1)
10. **Add PostHog `identify()` call on login** (H10 partial) — one line in auth-context

---

## Risk Register

| Risk | Severity | Likelihood | Impact | Mitigation |
|------|----------|------------|--------|------------|
| XSS via blog content | CRITICAL | Low (admin-only) | User data theft, session hijacking | Sanitize with sanitize-html |
| Admin delete silently fails | CRITICAL | High | Data integrity, security | Use admin client |
| Partial refund revokes premium | CRITICAL | Medium | Revenue loss, user churn | Fix amount check |
| Self-referral fraud | HIGH | Medium | Revenue loss | Add referrerId check |
| Unsubscribe CSRF | HIGH | Low | User annoyance, spam reports | Add signed tokens |
| Arabic market unusable | HIGH | Certain | Lost ~400M user market | Fix RTL |
| Analytics pipeline non-functional | HIGH | Certain | Can't measure conversion | Wire PostHog |
| Stripe strips locale | HIGH | Certain | Poor UX for non-English users | Fix return URLs |
| Sentry gaps in critical paths | MEDIUM | Medium | Undetected production errors | Add manual capture |

---

## Recommended Execution Order

```
Week 1: Phase 7A (Critical Security Fixes) → Phase 7B (i18n wiring)
Week 2: Phase 7C (Monitoring) → Phase 8A (Admin fixes)
Week 3: Phase 9 (Stripe + revenue engine completion)
Week 4: Phase 10 (Calm UX + dark mode)
```

After these 4 weeks, reassess and continue with Phases 11-13.

---

## Files Created By This Audit

| File | Content |
|------|---------|
| `CODE-QUALITY-AUDIT.md` | 52 files reviewed, 30 findings (4 critical, 14 warning, 12 info) |
| `UI-QUALITY-AUDIT.md` | 6-pillar visual audit, score 16/24, 344 lines |
| `COMPREHENSIVE-AUDIT-SYNTHESIS.md` | This file — merged findings + improvement plan |

*Audit completed by GSD comprehensive workflow, 2026-05-08*
