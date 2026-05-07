# Phase 11: Anxiety-Reduction & Wellbeing Features

## 1. Goal
Mitigate evaluative stress with scaffolded AI feedback, anxiety-reducing copywriting, and optional wellbeing micro-interventions.

## 2. Requirements
- UX-02: Anxiety-Reduction & Wellbeing

## 3. Context
- Current mock tests and quizzes provide immediate correct/incorrect feedback, which can spike anxiety.
- System copy uses standard success/failure verbiage rather than supportive framing.

## 4. Implementation Steps
- [ ] 01. Update Quiz Engine `src/components/quiz/` to optionally intercept incorrect answers and fetch a targeted hint from Gemini AI before revealing the exact answer.
- [ ] 02. Add a `WellbeingPrompt` component that displays optional breathing exercises or pause reminders during the 45-minute mock tests.
- [ ] 03. Audit and update static copy across UI components to reframe failure as mastery-in-progress (e.g., "You missed 5 questions" -> "You've mastered 75%, let's focus on these specific areas").
