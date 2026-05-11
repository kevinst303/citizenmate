# Phase 11 Plan: Anxiety-Reduction & Wellbeing Features

**Status:** executing
**Created:** 2026-05-11

## Wave 1: AI Hint System

### Task 1.1: Create quiz-hint component
- Build `src/components/quiz/quiz-hint.tsx`
- Accept props: `question`, `topic`, `selectedAnswer` (the wrong one)
- Generate lightweight hint from question data + topic mapping (no Gemini API)
- Render as slide-in banner below question with Framer Motion
- Use premium gate: `isPremium ? unlimited : 1 hint per session`

### Task 1.2: Integrate hints into quiz-card
- Add `showHint` state to `quiz-card.tsx`
- After incorrect answer, show "Need a hint?" button before revealing correct answer
- Wire hint display below question area
- Add hint-related i18n keys: `quiz.hint_prompt`, `quiz.show_hint`, `quiz.hint_used`

### Task 1.3: Add hint i18n keys
- Add to `en.json` under `quiz.*`: `hint_prompt`, `show_hint`, `hint_used`, `hint_premium_gate`
- Sync to es.json, hi.json, vi.json, zh.json, ar.json

## Wave 2: Wellbeing Prompt

### Task 2.1: Create WellbeingPrompt component
- Build `src/components/wellbeing/WellbeingPrompt.tsx`
- Breathing exercise: animated circle with "Breathe in (4s) → Hold (4s) → Breathe out (4s)" cycle
- Two buttons: "Continue" and "Dismiss"
- Respect `reduceMotion` — disable animation if set

### Task 2.2: Integrate into quiz timer flow
- Add prompt triggers at 30:00 and 15:00 remaining in `quiz-timer.tsx`
- Show as overlay on quiz card (not modal, non-blocking)
- Add wellbeing i18n keys: `wellbeing.breathe_in`, `wellbeing.hold`, `wellbeing.breathe_out`, `wellbeing.continue`, `wellbeing.dismiss`

## Wave 3: Copy Audit & Reframe

### Task 3.1: Rewrite results feedback to growth-mindset
- Update `results-summary.tsx` copy:
  - "You missed X" → "You've mastered X% — let's focus on specific areas"
  - "Failed" → "Keep Going"
  - Always state achievement first, then growth areas
- Update `getRecommendation()` to use growth-oriented framing

### Task 3.2: Update i18n for results namespace
- Add new keys to `en.json`: `results.mastered_pct`, `results.growth_focus`, `results.keep_going`
- Sync to all 6 locales

## Verification Checklist

- [ ] Quiz hints appear after wrong answers (premium: unlimited, free: 1)
- [ ] Hint content is correct for question topic
- [ ] Wellbeing prompt appears at 30:00 and 15:00 in timed tests
- [ ] Breathing animation respects reduceMotion
- [ ] Results summary uses growth-mindset language
- [ ] All i18n keys synced across 6 locales
- [ ] No visual regressions in dark mode
- [ ] TypeScript compiles cleanly
