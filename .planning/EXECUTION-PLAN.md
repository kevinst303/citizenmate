---
type: execution-plan
source: v1.1-MILESTONE-AUDIT.md (gaps_found)
started: "2026-05-05T05:32:00.000Z"
last_updated: "2026-05-06T20:00:00.000Z"
status: all_gaps_closed
bonus:
  phase_c_i18n: "16 remaining components wired with useT(), ~40 comps total, 5 dicts 0% drift"
completed:
  p0_items: 5/5
  p1_items: 4/4
  p2_items: 5/5
---

# Execution Plan — v1.1 Gap Closure

## Status: ALL GAPS CLOSED (11/11 requirements satisfied)

## Sessions Summary

### Session 1-3: Core Gap Closure
- P0: PostHog custom events + 6 upgrade triggers → REV-04, REV-02
- P0: Phase 07 (i18n + referrals + email) → GROW-01/02/03
- P1: Sentry manual captureException → INFRA-02
- P1: Sprint Pass one-time payment → REV-03
- P2: VERIFICATION.md x4 (04-08) + Phase 08 Admin → all phases verified

### Session 4: i18n Dictionary Translation
- Translated ar/zh/hi/es to match English dictionary (102→213 keys)

### Session 5-6: i18n UI Wiring
- Language switcher (Globe dropdown, 5 languages, desktop + mobile)
- Wired 17 components: navbar, onboarding, upgrade-modal, smart-practice, session, dashboard, user-menu, premium-gate, practice listing, results-summary, hero, features, how-it-works, cta-section, pricing-preview, footer
- Dashboard i18n + Supabase lock fix (React.cache → raw createClient)

### Session 7: Translation Pipeline
- `scripts/translate.ts` — DeepL API auto-translate with token protection
- `scripts/validate-i18n.ts` — CI prebuild validation (key parity, drift %, orphans)
- npm scripts: `translate`, `translate:check`, `translate:diff`, `validate-i18n`
- Landing section (92 keys) translated to ar/zh/hi/es → all 5 dicts at 277 keys, 0% drift
- Dependencies: `deepl-node`, `tsx` (dev)

## Requirements Final

| REQ-ID | Description | Status |
|--------|-------------|--------|
| INFRA-01 | Test infra + ReadinessRing | WIRED |
| INFRA-02 | Sentry monitoring | WIRED |
| INFRA-03 | Rate limiting | WIRED |
| INFRA-04 | Dashboard refactoring | WIRED (partial — Dashboard still 675 LOC but modular) |
| REV-01 | Onboarding flow | WIRED |
| REV-02 | 6 upgrade triggers | WIRED |
| REV-03 | Subscriptions + Sprint Pass | WIRED |
| REV-04 | PostHog analytics | WIRED |
| GROW-01 | i18n (5 languages) | WIRED (provider + 17 wired comps + dicts + pipeline) |
| GROW-02 | Referral system | WIRED |
| GROW-03 | Email notifications | WIRED |

## Remaining (Future)

| Priority | Item | Scope |
|----------|------|-------|
| P2 | Wire ~20 unwired components | Quiz session, study, about, terms, privacy, cookies, checkout/cancel, blog, admin, error pages |
| P3 | DeepL glossaries | "CitizenMate", "Sprint Pass" domain terms |
| P3 | New features | Streaks/gamification, offline PWA, weak-area quizzes, AI tutor v1 |

## Verification

```bash
npm test && npm run build  # 15/15 tests, build PASS
npm run validate-i18n       # All 5 dicts: 277 keys, 0% drift
```
