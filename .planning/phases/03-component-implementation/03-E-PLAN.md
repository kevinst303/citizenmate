---
phase: 03-component-implementation
plan: E
type: execute
wave: 1
depends_on: []
files_modified:
  - citizenmate/src/components/quiz/quiz-card.tsx
  - citizenmate/src/components/quiz/quiz-progress.tsx
  - citizenmate/src/components/quiz/results-summary.tsx
  - citizenmate/src/components/quiz/quiz-header.tsx
  - citizenmate/src/app/practice/[testId]/page.tsx
autonomous: true
branch_name: feat/03e-quiz-components
requirements:
  - QUIZ-01
  - QUIZ-02
  - QUIZ-03

must_haves:
  truths:
    - "Quiz question container and option buttons use Conseil design tokens (15px card radius for container, 10px button radius for options)"
    - "Selected quiz option uses cm-teal border and bg-cm-teal/5 — not cm-navy"
    - "Quiz progress bar and answered/current state indicators use cm-teal — not cm-navy or cm-eucalyptus-light"
    - "Results summary stat cards use card-conseil (15px radius, conseil border/shadow)"
    - "Quiz navigation buttons use Conseil primary style (bg-cm-teal, rounded-[10px]) — not cm-navy"
    - "Practice page background and spacing use Conseil bg tokens (white or section-alt-bg, not custom colors)"
  artifacts:
    - path: "citizenmate/src/components/quiz/quiz-card.tsx"
      provides: "Quiz question card with conseil tokens; option buttons rounded-[10px]"
      contains: "cm-teal"
    - path: "citizenmate/src/components/quiz/quiz-progress.tsx"
      provides: "Progress bar and step indicators using cm-teal"
      contains: "cm-teal"
    - path: "citizenmate/src/components/quiz/results-summary.tsx"
      provides: "Results stat cards using card-conseil"
      contains: "card-conseil"
    - path: "citizenmate/src/components/quiz/quiz-header.tsx"
      provides: "Quiz header with cm-teal submit button rounded-[10px]"
      contains: "bg-cm-teal"
    - path: "citizenmate/src/app/practice/[testId]/page.tsx"
      provides: "Practice page with Conseil bg and spacing"
  key_links:
    - from: "citizenmate/src/components/quiz/quiz-card.tsx"
      to: "option button selected state"
      via: "conditional className"
      pattern: "cm-teal|border-cm-teal"
    - from: "citizenmate/src/components/quiz/quiz-progress.tsx"
      to: "active indicator"
      via: "className conditional"
      pattern: "cm-teal"
---

<objective>
Update all quiz flow components (QuizCard, QuizProgress, ResultsSummary, QuizHeader, practice page) to use Conseil design tokens throughout — replacing cm-navy references with cm-teal where used as accent/active state, updating card radii, and aligning button styles.

Purpose: Quiz is the core engagement flow — token consistency here is essential for a polished user experience.
Output: All quiz components use Conseil palette; option buttons are 10px; container cards are 15px; progress bar uses teal.
</objective>

<execution_context>
@/Users/kevin/.claude/get-shit-done/workflows/execute-plan.md
@/Users/kevin/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

<interfaces>
<!-- CRITICAL: cm-navy is aliased to cm-teal (#006d77) via CSS variable. -->
<!-- BUT quiz components use cm-navy as an accent/active-state class name. -->
<!-- For semantic clarity and future-proofing, change cm-navy class names to cm-teal. -->
<!-- Do NOT change cm-navy where it is used as dark text on light background — use text-foreground instead. -->
<!-- Check WCAG: #006d77 on white is AA (4.56:1) for normal text — acceptable. -->

<!-- Quiz option button target pattern (from research): -->
<!-- <button className={` -->
<!--   w-full flex items-start gap-4 p-4 rounded-[10px] border-2 text-left -->
<!--   transition-colors duration-200 cursor-pointer -->
<!--   ${isSelected -->
<!--     ? 'border-cm-teal bg-cm-teal/5' -->
<!--     : 'border-[#E9ECEF] bg-white hover:border-cm-teal/50 hover:bg-cm-teal/3' -->
<!--   } -->
<!-- `}> -->

<!-- Quiz container card pattern: -->
<!-- Use rounded-[15px] for the question card container -->
<!-- Use card-conseil class if appropriate, OR manual: bg-white border border-[#E9ECEF] rounded-[15px] shadow-card -->

<!-- Results summary stat card pattern: -->
<!-- <div className="card-conseil"> (15px radius after 03-D updates globals.css) -->
<!-- Track 03-D updates globals.css — these tracks are parallel, so use rounded-[15px] explicitly -->
<!-- OR rely on card-conseil if confident 03-D will merge first. Use explicit rounded-[15px] to be safe. -->

<!-- QuizHeader submit button: bg-cm-teal rounded-[10px] (not pill shape) -->
<!-- This overlaps with 03-D which also touches quiz-header.tsx for the MODAL. -->
<!-- 03-E handles the main header button; 03-D handles the modal panel. -->
<!-- Coordinate: 03-E changes submit button className ONLY; 03-D changes modal panel ONLY. -->
<!-- When merging, both changes will coexist in quiz-header.tsx — no conflict. -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update QuizCard option buttons and container to Conseil tokens (QUIZ-01)</name>
  <files>citizenmate/src/components/quiz/quiz-card.tsx</files>
  <action>
Read quiz-card.tsx in full. Apply these specific updates:

1. **Question container card:** Find the outermost card div wrapping the question. If it uses `rounded-2xl` or `rounded-xl`, change to `rounded-[15px]`. Add `border border-[#E9ECEF]` if no border is present. Keep existing padding. If it uses `card-conseil` class, no change needed for radius (assumes 03-D runs first, but use explicit rounded-[15px] to be safe — add `rounded-[15px]` via inline style or replace the card class).

2. **Question number badge:** If present, ensure it uses `rounded-[10px]` (button/badge radius) not `rounded-full` or `rounded-xl`. If it uses a pill style, leave it. If it uses a box style badge, use `rounded-[10px]`.

3. **Option buttons (multiple choice):** Find the option button elements. Update the selected/unselected conditional classes to use cm-teal instead of cm-navy:
   - Selected: `border-cm-teal bg-cm-teal/5` (remove any `border-cm-navy` or `bg-cm-navy/5`)
   - Unselected: `border-[#E9ECEF] bg-white hover:border-cm-teal/50`
   - Button radius: `rounded-[10px]` (replace any `rounded-xl` or `rounded-lg`)
   - Keep `border-2` weight, keep `p-4` padding, keep all other classes

4. **Correct/incorrect feedback colours:** If the card shows correct/incorrect state after answering, keep green for correct and red for incorrect — do NOT change these to teal.

5. **Framer Motion:** Do NOT touch any `motion.div` variants, initial/animate props.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>QuizCard container uses rounded-[15px]; option buttons use rounded-[10px]; selected state uses border-cm-teal/bg-cm-teal instead of cm-navy</done>
</task>

<task type="auto">
  <name>Task 2: Update QuizProgress, ResultsSummary, practice page, and verify quiz navigation (QUIZ-02, QUIZ-03)</name>
  <files>
    citizenmate/src/components/quiz/quiz-progress.tsx
    citizenmate/src/components/quiz/results-summary.tsx
    citizenmate/src/app/practice/[testId]/page.tsx
  </files>
  <action>
**quiz-progress.tsx (QUIZ-02):**
Read the file. Find where progress bar fill colour and step indicators are set:
- Progress bar fill: change `bg-cm-navy` or `bg-cm-eucalyptus` to `bg-cm-teal`
- Current step indicator: change `cm-navy` classes to `cm-teal`
- Answered step indicator: change `cm-eucalyptus-light` or `cm-eucalyptus` to `bg-cm-teal/30` or `bg-cm-teal/20` (a lighter teal, not the full saturated colour)
- Unanswered step: keep neutral (`bg-[#E9ECEF]` or `bg-zinc-200`)
No radius or shadow changes needed here — progress indicators are small pills or squares.

**results-summary.tsx (QUIZ-02):**
Read the file. Find stat/score cards (the boxes showing e.g., score percentage, correct count, time taken). Apply:
- Replace `rounded-xl border-cm-slate-200` (or similar legacy classes) with explicit Conseil card tokens:
  `className="bg-white border border-[#E9ECEF] p-[30px]"` with inline `style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}`
- If cards already use `card-conseil`, no change needed
- Keep all score display logic unchanged

**practice/[testId]/page.tsx (QUIZ-01 container verification):**
Read the file. Verify:
- Page background: should be `bg-white` or use default (no custom bg colour like `bg-slate-100`)
- Page top padding: should account for fixed navbar (`pt-[66px]` if this page uses the full layout, OR if it's a standalone layout, ensure content doesn't hide behind navbar)
- If the page uses `bg-gray-100` or `bg-slate-50`, change to `bg-white` for Conseil consistency
- No new features or components — layout only

**quiz-header.tsx submit button (QUIZ-03):**
Note: 03-D also touches quiz-header.tsx for the modal panel. In THIS plan (03-E), only update the main submit button in the header bar. Find the submit/finish button in the header. Change `bg-cm-navy` to `bg-cm-teal`. Change radius from `rounded-xl` or `rounded-2xl` to `rounded-[10px]`. Keep all onClick handlers and loading state logic unchanged.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>quiz-progress.tsx uses bg-cm-teal for active/current indicators; results-summary.tsx stat cards use conseil card tokens (15px, #E9ECEF border, dual shadow); practice page uses bg-white; quiz-header submit button is bg-cm-teal rounded-[10px]</done>
</task>

</tasks>

<verification>
```bash
cd /Volumes/home/Documents/App/AuTest/citizenmate
npx tsc --noEmit
npm run build
```
Both must exit 0.
</verification>

<success_criteria>
- `npx tsc --noEmit` zero errors
- `npm run build` zero errors
- quiz-card.tsx: container rounded-[15px], option buttons rounded-[10px], selected state uses cm-teal
- quiz-progress.tsx: active state uses bg-cm-teal, not cm-navy or cm-eucalyptus
- results-summary.tsx: stat cards use conseil card tokens (15px radius, #E9ECEF border, dual shadow)
- practice page: bg-white background, no regressions
- quiz-header.tsx: submit button bg-cm-teal rounded-[10px]
</success_criteria>

<output>
After completion, create `.planning/phases/03-component-implementation/03-E-SUMMARY.md` following the summary template.
</output>
