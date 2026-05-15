# Phase 16: PWA Install Modal — Refine Customs

**Status:** `completed`
**Date:** 2026-05-13
**Completed:** 2026-05-13
**Milestone:** v1.3 — Codebase Polish & UX Refinements

## Objective

Refine the existing `InstallPrompt` component to eliminate hardcoded English strings, implement timestamp-based 7-day dismissal expiry, and ensure full 6-locale i18n support — completing the Conseil-styled PWA install modal.

## Tasks

### Task 1: Add timestamp-based dismissal to `usePwaStore`

**Files:**
- `citizenmate/src/lib/store/usePwaStore.ts`

**Changes:**
- Replace `hasDismissedModal: boolean` with `dismissedAt: number | null`
- `dismissModal()` sets `dismissedAt` to `Date.now()`
- Add getter/computed `shouldShowModal()` that checks if 7 days have elapsed since `dismissedAt`
- Add `resetDismissal()` that clears the timestamp

### Task 2: Add i18n keys for value proposition cards

**Files:**
- `citizenmate/src/i18n/dictionaries/en.json`
- `citizenmate/src/i18n/dictionaries/vi.json`
- `citizenmate/src/i18n/dictionaries/es.json`
- `citizenmate/src/i18n/dictionaries/hi.json`
- `citizenmate/src/i18n/dictionaries/zh.json`
- `citizenmate/src/i18n/dictionaries/ar.json`

**Changes:**
Add keys under `install`:
- `value_offline_title`, `value_offline_desc` — "Study offline" / "Take quizzes without internet"
- `value_notif_title`, `value_notif_desc` — "Streak reminders" / "Never miss a study day"
- `value_launch_title`, `value_launch_desc` — "Quick launch" / "One tap from your home screen"

Translate for all 6 locales (vi, hi, es, zh, ar).

### Task 3: Update `InstallPrompt` to use timestamp + i18n

**Files:**
- `citizenmate/src/components/shared/install-prompt.tsx`

**Changes:**
- Read `dismissedAt` from store; compute visibility with `DISMISS_DURATION_MS` expiry
- Replace hardcoded value proposition strings with `t()` calls

## Verification

- `npx tsc --noEmit` passes
- `npm run build` passes
- Existing `usePwaStore` tests pass (if any)
- iOS instructions path still works
- Standard install path still works
- Dismissal persists across page reload (IndexedDB)
- Dismissal expires after 7 days and modal reappears
