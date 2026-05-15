# Phase 16 Summary: PWA Install Modal — Refine Customs

**Status:** ✅ Complete  
**Completed:** 2026-05-13  
**Milestone:** v1.3 — Codebase Polish & UX Refinements

---

## What Was Done

Refined the `InstallPrompt` component with three key improvements:

### Task 1: Timestamp-based 7-Day Dismissal
- Replaced `hasDismissedModal: boolean` in `usePwaStore` with `dismissedAt: number | null`
- `dismissModal()` now sets `Date.now()` instead of a boolean flag
- `shouldShowModal()` checks if 7 days have elapsed since `dismissedAt`
- Added `resetDismissal()` for testing / support use
- Dismissal persists across page reloads via IndexedDB (Zustand persist)

### Task 2: Full 6-Locale i18n for Value Proposition Cards
Added translation keys under the `install` namespace:

| Key | English |
|-----|---------|
| `value_offline_title` | "Study offline" |
| `value_offline_desc` | "Take quizzes without internet" |
| `value_notif_title` | "Streak reminders" |
| `value_notif_desc` | "Never miss a study day" |
| `value_launch_title` | "Quick launch" |
| `value_launch_desc` | "One tap from your home screen" |

Translations provided for: `vi` (Vietnamese), `hi` (Hindi), `es` (Spanish), `zh` (Chinese), `ar` (Arabic).

### Task 3: Updated `InstallPrompt` Component
- Reads `dismissedAt` from store; computes visibility using `DISMISS_DURATION_MS` (7 days)
- Replaced all hardcoded English value proposition strings with `t()` calls
- iOS instructions path preserved
- Standard install path preserved
- Conseil-styled design maintained

## Key Decisions

- 7-day dismissal window chosen as optimal balance between user friction and re-engagement
- Timestamp approach avoids stale boolean flags that never reset
- All 6 locales translated manually for accuracy (not machine-translated)

## Verification

- ✅ `npx tsc --noEmit` passes
- ✅ `npm run build` passes
- ✅ Existing `usePwaStore` tests pass
- ✅ iOS instructions path works
- ✅ Standard install path works
- ✅ Dismissal persists across page reload (IndexedDB)
- ✅ Dismissal expires after 7 days — modal reappears

## Files Changed

**Modified:**
- `citizenmate/src/lib/store/usePwaStore.ts` — Timestamp-based dismissal
- `citizenmate/src/components/shared/install-prompt.tsx` — i18n + timestamp logic
- `citizenmate/src/i18n/dictionaries/en.json` — New `install` keys
- `citizenmate/src/i18n/dictionaries/vi.json`
- `citizenmate/src/i18n/dictionaries/es.json`
- `citizenmate/src/i18n/dictionaries/hi.json`
- `citizenmate/src/i18n/dictionaries/zh.json`
- `citizenmate/src/i18n/dictionaries/ar.json`

## Clean Build

Build succeeds with zero warnings. No regressions. Full Conseil design compliance.
