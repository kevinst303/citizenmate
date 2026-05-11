# Phase 11: Anxiety-Reduction & Wellbeing Features - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Mitigate evaluative stress during mock tests and quiz flows with scaffolded AI feedback (hints before answers), anxiety-reducing copywriting, and optional wellbeing micro-interventions (breathing prompts during timed tests). This phase focuses on the UX & copy layer — no new backend APIs, no new data models. All i18n keys updated across 6 locales.
</domain>

<decisions>
## Implementation Decisions

### AI Hints Integration
- Intercept incorrect answers in `QuizCard` — show a "Need a hint?" prompt before revealing the correct answer
- Hint is generated client-side from the question context (no Gemini API call needed — use question data + topic mapping for lightweight hints)
- Hint displays as a gentle slide-in banner below the question, not a modal
- Free users see 1 hint per test; premium users see unlimited hints (respects existing `usePremium()` gate)

### Wellbeing Prompt
- Add a `WellbeingPrompt` component that appears at the 15-min and 30-min marks during 45-min mock tests
- Shows a 30-second breathing exercise (4-count inhale, 4-count hold, 4-count exhale) with animated circle
- Dismissible: "I'm good, continue" button
- Respects `reduceMotion` from `useSettingsStore` for the breathing animation
- Placed in the quiz flow via `quiz-context` timer integration

### Copy Audit & Reframe
- Replace failure-oriented language with growth-mindset framing across results summary and quiz feedback
- "You missed 5 questions" → "You've mastered 75% — let's focus on these specific areas"
- "Need ≥15" badge → "15+ to pass" (less intimidating)
- "Failed" category → "Keep Going" — always highlight what was accomplished first
- All i18n keys updated in `results.*` namespace across all 6 locales

### Code Integration
- `quiz-card.tsx` — add hint state + hint display
- `quiz-timer.tsx` — add wellbeing prompt trigger at time thresholds
- `results-summary.tsx` — copy audit for growth-mindset reframing
- New: `components/wellbeing/WellbeingPrompt.tsx`
- New: `components/quiz/quiz-hint.tsx`
- i18n: `en.json` results namespace expanded with `mastered_pct`, `growth_focus`, wellbeing keys
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `quiz-card.tsx` — question rendering with `selectAnswer` callback, `state.answers` map, `isValuesQuestion` flag
- `quiz-timer.tsx` — countdown timer (not yet reviewed, need to inspect for time-threshold triggers)
- `results-summary.tsx` — pass/fail hero, score cards, topic breakdown, AI recommendation, premium upsell
- `useQuiz()` from `quiz-context` — state machine with `state.test`, `state.answers`, `selectAnswer`
- `usePremium()`, `useAuth()` from `auth-context` — premium gating
- `useSettingsStore` — `reduceMotion` boolean
- `useT()` from `i18n-context` — i18n hook

### Established Patterns
- Framer Motion with `AnimatePresence` for transitions
- MotionProvider wraps app with `reducedMotion` config
- Conseil design tokens (cm-teal, cm-navy, cm-slate, card shadows, 15px radius)
- All copy is i18n-keyed via `t("namespace.key")`

### Integration Points
- Quiz flow: `[lang]/practice/[testId]` → `quiz-context` → `QuizCard` + `QuizTimer` → `ResultsSummary`
- Timer: `quiz-timer.tsx` counts down from 45 min, auto-submits on expiry
- Premium gate: `isPremium` boolean from `usePremium()` determines feature access
</code_context>

<specifics>
## Specific Ideas

- Hint content should be encouraging: "Here's a clue..." not "Wrong! Try..."
- Breathing animation: soft pulsing circle with "Breathe in... hold... breathe out" text
- Growth mindset copy: always state what was achieved before what needs work
- Quiz timer already exists — wellbeing prompt should appear as a gentle overlay, not interrupt the test flow
</specifics>

<deferred>
## Deferred Ideas

- Gemini AI-powered personalized hints (Phase 11 keeps it lightweight — future phase for full AI tutor integration)
- Post-test breathing cooldown (nice-to-have, defer to future wellbeing expansion)
- Voice-guided breathing exercises (out of scope)
</deferred>
