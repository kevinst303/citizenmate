---
phase: 03-component-implementation
plan: G
type: execute
wave: 1
depends_on: []
files_modified:
  - citizenmate/src/app/dashboard/page.tsx
  - citizenmate/src/app/dashboard/layout.tsx
  - citizenmate/src/components/dashboard/abs-insights-widget.tsx
  - citizenmate/src/components/dashboard/weather-widget.tsx
  - citizenmate/src/components/dashboard/currency-widget.tsx
  - citizenmate/src/components/dashboard/holidays-widget.tsx
  - citizenmate/src/components/dashboard/life-in-australia-section.tsx
  - citizenmate/src/components/shared/subpage-hero.tsx
autonomous: true
branch_name: feat/03g-dashboard-components
requirements:
  - DASH-01
  - DASH-02
  - DASH-03

must_haves:
  truths:
    - "Dashboard stat cards and widget cards use Conseil card design — card-glass class replaced with card-conseil (or explicit 15px/border-[#E9ECEF]/conseil shadow tokens)"
    - "AbsInsightsWidget Recharts chart uses Conseil colour palette (#006d77 primary, #3d348b secondary) instead of hardcoded legacy HEX values"
    - "All dashboard widgets (weather, currency, holidays, life-in-australia) use Conseil card tokens"
    - "Dashboard layout/sidebar navigation uses Conseil palette (cm-teal for active states, font-heading for titles)"
    - "SubpageHero heading typography uses font-heading (Poppins) for h1/h2 elements"
  artifacts:
    - path: "citizenmate/src/app/dashboard/page.tsx"
      provides: "Dashboard page with conseil stat cards"
      contains: "card-conseil"
    - path: "citizenmate/src/components/dashboard/abs-insights-widget.tsx"
      provides: "Recharts widget with Conseil palette"
      contains: "#006d77"
    - path: "citizenmate/src/components/shared/subpage-hero.tsx"
      provides: "Subpage hero with Poppins heading"
      contains: "font-heading"
  key_links:
    - from: "citizenmate/src/app/dashboard/page.tsx"
      to: "widget card divs"
      via: "className card-conseil or explicit conseil tokens"
      pattern: "card-conseil|rounded-\\[15px\\]"
    - from: "citizenmate/src/components/dashboard/abs-insights-widget.tsx"
      to: "Recharts COLORS array"
      via: "const COLORS or fill prop"
      pattern: "#006d77|#3d348b"
---

<objective>
Update the dashboard page, all dashboard widget components, the dashboard layout, and the subpage hero to use Conseil design tokens — replacing card-glass with card-conseil, updating Recharts to the Conseil palette, and ensuring sidebar/navigation active states use cm-teal.

Purpose: Dashboard is the landing page for authenticated users — Conseil token consistency here completes the design system coverage across all CitizenMate flows.
Output: Dashboard widgets and layout use Conseil card tokens; charts use teal/purple palette; subpage hero uses Poppins heading.
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
<!-- Dashboard key change: replace card-glass with card-conseil -->
<!-- card-glass uses backdrop-blur — deprecated in Phase 3. Use card-conseil instead. -->
<!-- card-conseil after 03-D updates globals.css = 15px radius, #E9ECEF border, dual shadow -->
<!-- To be safe (parallel execution), use explicit tokens: -->
<!--   className="bg-white border border-[#E9ECEF] p-[30px]" -->
<!--   style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }} -->

<!-- Recharts colour update pattern: -->
<!-- Find: const COLORS = ['#someHex', '#anotherHex', ...] or hardcoded fill props -->
<!-- Replace with Conseil palette: -->
<!--   Primary bar/line: '#006d77' (cm-teal) -->
<!--   Secondary: '#3d348b' (cm-secondary/purple) -->
<!--   Tertiary/additional: '#00a3ad' (lighter teal) or '#6b61c4' (lighter purple) -->

<!-- SubpageHero: used as dashboard header. -->
<!-- The h1/h2 inside must use font-heading class. -->
<!-- If the component uses font-bold with no font-family class, add font-heading. -->
<!-- Do NOT change the background or layout — only typography tokens. -->

<!-- cm-navy in dashboard: same rule as 03-E and 03-F -->
<!-- If cm-navy is used as active nav state (sidebar link highlight), change to cm-teal -->
<!-- If cm-navy is dark background (sidebar bg), change to appropriate dark: bg-zinc-900 or keep -->
<!-- Dashboard sidebar context: if it's a full dark sidebar, keep dark bg; change accent/highlight to cm-teal -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update dashboard page stat cards and all widget cards to Conseil tokens (DASH-01)</name>
  <files>
    citizenmate/src/app/dashboard/page.tsx
    citizenmate/src/components/dashboard/weather-widget.tsx
    citizenmate/src/components/dashboard/currency-widget.tsx
    citizenmate/src/components/dashboard/holidays-widget.tsx
    citizenmate/src/components/dashboard/life-in-australia-section.tsx
  </files>
  <action>
**dashboard/page.tsx (DASH-01):**
Read the file. For every card element (stat cards showing scores, progress, streaks, etc.) and widget container:
1. Replace `card-glass` class with `card-conseil` class. If `card-glass` does not exist, look for `rounded-xl bg-white/80 backdrop-blur` or similar glass-card pattern and replace with: `className="bg-white border border-[#E9ECEF]"` with inline `style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}`
2. Remove any `backdrop-blur` or `bg-white/80` (partially transparent white) — use solid `bg-white`
3. If page has a custom background (e.g., `bg-gray-50` or `bg-slate-100`), change to `bg-white` or `bg-[#F4F4F5]` (section-alt-bg)
4. Keep all data display, conditional rendering, and link logic unchanged

**weather-widget.tsx, currency-widget.tsx, holidays-widget.tsx, life-in-australia-section.tsx:**
For each file, read it and apply the same targeted change:
- Find the card container div. Replace `card-glass` or `rounded-xl bg-white/...` pattern with explicit Conseil tokens (bg-white, border border-[#E9ECEF], rounded-[15px], conseil dual-layer shadow)
- Remove backdrop-blur
- If the widget uses `cm-navy` as a text accent, change to `cm-teal` or `text-foreground` depending on whether it's accent or dark text
- Keep all widget content, data fetching, and conditional rendering intact
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>dashboard/page.tsx stat cards use card-conseil or explicit conseil tokens (no card-glass); all 4 widget components use conseil card tokens without backdrop-blur</done>
</task>

<task type="auto">
  <name>Task 2: Update AbsInsightsWidget chart colours, dashboard layout, and SubpageHero typography (DASH-02, DASH-03)</name>
  <files>
    citizenmate/src/components/dashboard/abs-insights-widget.tsx
    citizenmate/src/app/dashboard/layout.tsx
    citizenmate/src/components/shared/subpage-hero.tsx
  </files>
  <action>
**abs-insights-widget.tsx (DASH-02):**
Read the file. Find the Recharts chart colour configuration:
1. Look for `const COLORS`, `const CHART_COLORS`, or hardcoded `fill="#..."` or `stroke="#..."` props on Recharts components (Bar, Line, Pie, Area, etc.)
2. Replace the colour array with Conseil palette. Typical pattern:
   ```tsx
   const COLORS = ['#006d77', '#3d348b', '#00a3ad', '#6b61c4', '#005a61'];
   ```
   Adjust the number of colours to match the existing array length. The first colour must be `#006d77` (cm-teal), second `#3d348b` (cm-secondary purple).
3. If colours are used in `<Cell fill={COLORS[index % COLORS.length]} />` pattern, the array change is sufficient
4. If any `stroke` or `fill` props are hardcoded inline (not from COLORS array), change those to `#006d77` or `#3d348b` as appropriate
5. Do NOT change chart type, data structure, axes, or any other Recharts configuration

**dashboard/layout.tsx (DASH-03):**
Read the file. This is the dashboard layout wrapper (may contain sidebar/navigation). Apply:
1. Active navigation link state: change `bg-cm-navy` or `text-cm-navy` (active link highlight) to `bg-cm-teal/10 text-cm-teal`
2. Sidebar background: if using `bg-cm-navy` as the sidebar background, change to `bg-zinc-900` or `bg-white` depending on current intent (dark sidebar → bg-zinc-900; light sidebar → bg-white). Do NOT keep it as #006d77 teal — a full teal sidebar is not Conseil design.
3. Font: ensure the layout heading or brand name uses `font-heading` class (Poppins)
4. Container: if layout uses `max-w-7xl`, change to `max-w-[1140px]`
5. Keep all authentication guards, slot rendering, and layout structure intact

**subpage-hero.tsx (DASH-03):**
Read the file. This component is used as the heading section for dashboard and other authenticated pages. Apply:
1. Main heading element (h1 or h2): add `font-heading` class if not already present. This ensures Poppins renders for dashboard page titles.
2. If there is a background gradient or image, keep it — only typography token changes needed
3. If using `text-cm-navy` for heading text on a dark background, verify contrast is adequate. On dark backgrounds, keep `text-white`. On light backgrounds, use `text-foreground`.
4. Do NOT change layout, padding, or background of the SubpageHero
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>abs-insights-widget.tsx COLORS array starts with #006d77 and #3d348b; dashboard/layout.tsx active nav uses cm-teal; subpage-hero.tsx heading uses font-heading class</done>
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
- dashboard/page.tsx: stat cards use conseil card tokens, no card-glass, no backdrop-blur
- All 4 widget components: conseil card tokens, no backdrop-blur
- abs-insights-widget.tsx: COLORS[0] = #006d77, COLORS[1] = #3d348b
- dashboard/layout.tsx: active nav state uses cm-teal; no full teal sidebar background
- subpage-hero.tsx: heading uses font-heading class
</success_criteria>

<output>
After completion, create `.planning/phases/03-component-implementation/03-G-SUMMARY.md` following the summary template.
</output>
