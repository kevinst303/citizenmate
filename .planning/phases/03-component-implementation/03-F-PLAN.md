---
phase: 03-component-implementation
plan: F
type: execute
wave: 1
depends_on: []
files_modified:
  - citizenmate/src/components/study/study-section-card.tsx
  - citizenmate/src/components/study/study-progress-bar.tsx
  - citizenmate/src/components/study/key-facts-panel.tsx
  - citizenmate/src/components/study/language-toggle.tsx
  - citizenmate/src/app/study/page.tsx
  - citizenmate/src/app/study/[topicId]/page.tsx
autonomous: true
branch_name: feat/03f-study-components
requirements:
  - STUD-01
  - STUD-02
  - STUD-03

must_haves:
  truths:
    - "StudySectionCard uses exactly 15px border-radius with #E9ECEF border and conseil dual-layer shadow (not rounded-2xl border-2)"
    - "Study progress bar fill colour uses cm-teal (not cm-eucalyptus)"
    - "Key facts panel and language toggle use Conseil palette and card tokens"
    - "Study topics page navigation cards use Conseil card tokens (15px radius, #E9ECEF border)"
    - "Study session page uses Conseil layout tokens and Poppins/Inter font stack"
  artifacts:
    - path: "citizenmate/src/components/study/study-section-card.tsx"
      provides: "Study section card with conseil tokens"
      contains: "borderRadius.*15px|rounded-\\[15px\\]"
    - path: "citizenmate/src/components/study/study-progress-bar.tsx"
      provides: "Progress bar with cm-teal fill"
      contains: "cm-teal"
    - path: "citizenmate/src/components/study/key-facts-panel.tsx"
      provides: "Key facts panel with conseil card/badge tokens"
    - path: "citizenmate/src/app/study/page.tsx"
      provides: "Study topics page with conseil card tokens on topic cards"
    - path: "citizenmate/src/app/study/[topicId]/page.tsx"
      provides: "Study session page with conseil layout tokens"
  key_links:
    - from: "citizenmate/src/components/study/study-section-card.tsx"
      to: "border-radius 15px"
      via: "inline style or rounded-[15px]"
      pattern: "15px|rounded-\\[15px\\]"
    - from: "citizenmate/src/components/study/study-progress-bar.tsx"
      to: "fill div"
      via: "className on fill element"
      pattern: "cm-teal"
---

<objective>
Update all study flow components and pages to use Conseil design tokens — replacing rounded-2xl with 15px, cm-eucalyptus with cm-teal, and ensuring topic navigation and session pages use the correct palette and typography.

Purpose: Study is the second core engagement flow after Quiz. Token consistency here reinforces the Conseil design throughout the authenticated experience.
Output: All study components use Conseil card tokens; progress bar uses teal; topics page uses conseil card grid.
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
<!-- Conseil card target (use inline style since card-conseil may be 10px until 03-D merges): -->
<!-- bg-white border border-[#E9ECEF] rounded-[15px] -->
<!-- style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }} -->

<!-- Study-section-card current state: rounded-2xl border-2 — change to rounded-[15px] border -->
<!-- Study-progress-bar current state: cm-eucalyptus fill — change to cm-teal -->

<!-- cm-navy vs cm-teal: same rule as 03-E -->
<!-- cm-navy is aliased to #006d77 (teal) — still use cm-teal for semantic clarity -->
<!-- If cm-navy is used as dark text on white, change to text-foreground (zinc-900) for accessibility -->

<!-- Font stack: font-heading = Poppins (set in Phase 2), font-sans = Inter -->
<!-- These cascade from body — no explicit font classes needed unless overriding -->
<!-- If any study component sets font-manrope or font-dm-sans, remove those classes -->

<!-- badge-pill, badge-pill-teal available for topic labels/section labels -->
<!-- Avoid glass-card and feature-card-glass — use card-conseil or explicit conseil tokens -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update StudySectionCard and StudyProgressBar to Conseil tokens (STUD-01, STUD-02)</name>
  <files>
    citizenmate/src/components/study/study-section-card.tsx
    citizenmate/src/components/study/study-progress-bar.tsx
  </files>
  <action>
**study-section-card.tsx (STUD-01):**
Read the file. Find the card container element. Apply these targeted changes:
1. Replace `rounded-2xl` with `rounded-[15px]`
2. Replace `border-2` (2px border) with `border` (1px border)
3. Replace any `border-cm-slate-200` or `border-zinc-200` with `border-[#E9ECEF]`
4. Add conseil dual-layer shadow via inline style: `style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}`
5. If card uses `shadow-xl` or `shadow-2xl`, remove those classes (replaced by inline shadow)
6. Keep all existing content, click handlers, and inner layout

If the card has a hover state (`hover:shadow-lg` or similar), replace with `hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]` or similar Conseil-spec hover elevation. If no hover state exists, do not add one.

**study-progress-bar.tsx (STUD-02):**
Read the file. Find the progress bar fill element (the div whose width is set dynamically to show completion percentage). Change its background colour:
1. Replace `bg-cm-eucalyptus` with `bg-cm-teal`
2. Replace `bg-cm-eucalyptus-light` (if used for track/background) with `bg-[#E9ECEF]` or `bg-zinc-200`
3. If the progress bar container uses `bg-cm-eucalyptus-light` for the track background, change to `bg-[#E9ECEF]`
4. If there are text labels showing percentage (e.g., "75% complete"), ensure text uses `text-cm-teal` not `text-cm-eucalyptus`
5. Keep the width calculation logic and animation intact
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>study-section-card.tsx uses rounded-[15px] + border border-[#E9ECEF] + conseil dual-layer shadow; study-progress-bar.tsx fill uses bg-cm-teal</done>
</task>

<task type="auto">
  <name>Task 2: Update KeyFacts, LanguageToggle, study pages to Conseil palette (STUD-02, STUD-03)</name>
  <files>
    citizenmate/src/components/study/key-facts-panel.tsx
    citizenmate/src/components/study/language-toggle.tsx
    citizenmate/src/app/study/page.tsx
    citizenmate/src/app/study/[topicId]/page.tsx
  </files>
  <action>
**key-facts-panel.tsx (STUD-02):**
Read the file. Apply Conseil tokens:
1. Panel container: change `rounded-xl` or `rounded-2xl` to `rounded-[15px]`; update border to `border border-[#E9ECEF]`; add conseil shadow inline style
2. Fact item headings: if using `font-semibold text-cm-navy`, change `text-cm-navy` to `text-cm-teal` (accent colour) or `text-foreground` (dark text) depending on context. Use `text-cm-teal` for icon/accent labels and `text-foreground` for body text
3. Badge labels: if any tags/badges use old colours, update to `badge-pill` or `badge-pill-teal` from globals.css
4. Keep all content and expand/collapse logic unchanged

**language-toggle.tsx (STUD-03):**
Read the file. This is likely a toggle switch or tab selector for English/Chinese (or similar). Apply:
1. Active state: replace `bg-cm-navy` or `bg-cm-eucalyptus` active indicator with `bg-cm-teal`
2. Toggle container: if using `rounded-xl`, change to `rounded-[10px]` (toggle buttons are button-sized elements — 10px radius)
3. Active tab/pill background: `bg-cm-teal text-white`; inactive: `text-foreground hover:text-cm-teal`
4. Keep toggle functionality and state management intact

**study/page.tsx (STUD-03):**
Read the file. This is the topic navigation page with cards for each study topic. Apply:
1. Topic card elements: if using `rounded-2xl`, change to `rounded-[15px]`; update border to `border border-[#E9ECEF]`; add conseil shadow if missing
2. Section heading: ensure it uses `font-heading font-bold text-foreground` (Poppins via font-heading)
3. Container: if using `max-w-7xl`, change to `max-w-[1140px]`
4. Remove any `bg-slate-50` or custom page backgrounds — use `bg-white`
5. Keep all routing/link logic unchanged

**study/[topicId]/page.tsx (STUD-02):**
Read the file. This is the study session page. Apply:
1. Page/section background: change any `bg-slate-50` to `bg-white`
2. Container: change `max-w-7xl` to `max-w-[1140px]` if present
3. Section card wrappers: apply conseil card tokens (`rounded-[15px] border border-[#E9ECEF]` + conseil shadow inline)
4. If any heading uses `font-manrope` or explicit old font classes, remove them (font-heading cascade from layout is sufficient)
5. Keep all data-fetching and component rendering logic intact
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>key-facts-panel.tsx uses conseil card tokens and cm-teal accents; language-toggle uses bg-cm-teal for active state; study/page.tsx topic cards use 15px radius, #E9ECEF border, max-w-[1140px]; study/[topicId]/page.tsx uses bg-white and conseil card tokens</done>
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
- study-section-card.tsx: rounded-[15px], border border-[#E9ECEF], conseil dual-layer shadow
- study-progress-bar.tsx: fill uses bg-cm-teal
- key-facts-panel.tsx: conseil card tokens, cm-teal accents
- language-toggle.tsx: active state bg-cm-teal
- study/page.tsx: topic cards 15px, #E9ECEF border, max-w-[1140px], bg-white
- study/[topicId]/page.tsx: bg-white, conseil card tokens on wrappers
</success_criteria>

<output>
After completion, create `.planning/phases/03-component-implementation/03-F-SUMMARY.md` following the summary template.
</output>
