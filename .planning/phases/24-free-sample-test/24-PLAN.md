# Phase 24: Free Sample Test — Implementation Plan

**Phase:** 24 — Free Sample Test (Conversion Funnel)
**Requirements:** PROD-06
**Plan created:** 2026-05-15
**Status:** Ready for execution

---

## Plan 24-1: Create Free-Test Landing & Test Page

**Goal:** Create `src/app/[lang]/free-test/` route enabling unauthenticated users to take one free citizenship test.

**Success criteria:**
1. `npm run build` exits 0
2. Unauthenticated visitors can access `/free-test` and take one full test
3. After completion, signup/sign-in prompt appears ("Sign up to save your score!")
4. `guestAttemptV1` localStorage key prevents retakes from same browser
5. The page uses Conseil design tokens (teal/navy, Poppins font, glass cards)

**Implementation:**
1. Create `src/app/[lang]/free-test/page.tsx` — landing page with test intro + CTA to start
2. Implement inline quiz engine (or reuse QuizProvider if no auth needed):
   - Load `mockTests[0]` (first test — 20 questions)
   - Timer (45 min), score tracking, question navigation
   - On completion: show score + signup prompt
3. Check `localStorage.getItem('guestAttemptV1')` to prevent re-takes
4. After successful completion, set `localStorage.setItem('guestAttemptV1', '1')`

**Files to create:**
- `citizenmate/src/app/[lang]/free-test/page.tsx`

---

## Verification
1. `npm run build` — must exit 0
2. Visit `/free-test` without auth — test loads
3. Complete test — signup prompt shows
4. Refresh `/free-test` — "You've already taken your free test" message
