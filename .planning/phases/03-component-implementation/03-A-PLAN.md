---
phase: 03-component-implementation
plan: A
type: execute
wave: 1
depends_on: []
files_modified:
  - citizenmate/src/components/shared/navbar.tsx
  - citizenmate/src/components/shared/layout-shell.tsx
  - citizenmate/src/components/shared/user-menu.tsx
autonomous: true
branch_name: feat/03a-navbar-layout
requirements:
  - NAV-01
  - NAV-02
  - NAV-03
  - NAV-04

must_haves:
  truths:
    - "Navbar renders as a solid white fixed bar exactly 66px tall with no glassmorphism or backdrop-blur anywhere"
    - "Navbar scroll transition uses cubic-bezier(0.165,0.84,0.44,1) over 0.2s; no shadow or border appears on scroll"
    - "Page body content is not hidden behind the navbar — layout shell spacer is pt-[66px]"
    - "User menu dropdown panel has 15px border-radius, #E9ECEF border, and dual-layer Conseil card shadow"
  artifacts:
    - path: "citizenmate/src/components/shared/navbar.tsx"
      provides: "Solid white fixed navbar with correct scroll transition"
      contains: "cubic-bezier(0.165,0.84,0.44,1)"
    - path: "citizenmate/src/components/shared/layout-shell.tsx"
      provides: "Page spacer pt-[66px]"
      contains: "pt-[66px]"
    - path: "citizenmate/src/components/shared/user-menu.tsx"
      provides: "User menu dropdown with Conseil card tokens"
      contains: "borderRadius: '15px'"
  key_links:
    - from: "citizenmate/src/components/shared/navbar.tsx"
      to: "CSS transition"
      via: "inline style or Tailwind transition utility"
      pattern: "cubic-bezier\\(0\\.165"
    - from: "citizenmate/src/components/shared/user-menu.tsx"
      to: "dropdown panel div"
      via: "inline style or className"
      pattern: "E9ECEF|border-\\[#E9ECEF\\]"
---

<objective>
Verify and finalise the Navbar, Layout Shell, and User Menu components to exactly meet Conseil spec. The navbar was partially updated in Phase 2; this plan confirms no regressions and corrects the user menu dropdown card styling.

Purpose: NAV-01 through NAV-04 — the top-of-page chrome must be pixel-accurate before any other tracks are verified visually.
Output: Three confirmed/updated files; build passes; scroll transition verified.
</objective>

<execution_context>
@/Users/kevin/.claude/get-shit-done/workflows/execute-plan.md
@/Users/kevin/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

<!-- Key types/patterns the executor needs -->
<interfaces>
<!-- Conseil CSS utility classes defined in globals.css -->
<!-- .card-conseil → border-radius: 10px (DO NOT USE for user-menu — needs 15px) -->
<!-- .shadow-card → dual-layer conseil shadow -->
<!-- Target dropdown style (from research): -->
<!--   borderRadius: '15px' -->
<!--   border: '1px solid #E9ECEF' -->
<!--   boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' -->

<!-- Conseil navbar spec: -->
<!--   height: 66px, background: #FFFFFF, position: fixed, z-index: high -->
<!--   scroll transition: 0.2s cubic-bezier(0.165,0.84,0.44,1) -->
<!--   NO shadow on scroll, NO backdrop-blur, NO border added on scroll -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Verify and update Navbar scroll transition (NAV-01, NAV-02)</name>
  <files>citizenmate/src/components/shared/navbar.tsx</files>
  <action>
Read the current navbar.tsx. Confirm:
1. Root element has `position: fixed`, full width, `height: 66px` (or `h-[66px]`), `bg-white`, high z-index (z-50 or higher). If any of these differ, correct them.
2. The scroll-triggered transition uses exactly `0.2s cubic-bezier(0.165,0.84,0.44,1)`. Look for the `scrolled` state or `useScrollPosition` hook. The transition should animate only opacity or background — it must NOT add a box-shadow or border when scrolled. If a shadow is conditionally added on scroll, remove it.
3. Remove any `backdrop-blur`, `backdrop-filter`, or `bg-white/90` opacity classes. The navbar must be fully opaque white at all times.
4. If using Framer Motion for the scroll animation, the `animate` prop variants must not include shadow. If using CSS classes toggled by state, ensure the scrolled class adds NO new shadow or border.
5. Make the minimum change necessary. If all items above are already correct, add a comment `// NAV-01, NAV-02: verified correct` and leave the file unchanged.

Do NOT add any animation or new feature beyond what is listed above.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>navbar.tsx has fixed white bar, 66px height, and scroll transition uses cubic-bezier(0.165,0.84,0.44,1) with no shadow added on scroll</done>
</task>

<task type="auto">
  <name>Task 2: Confirm layout shell spacer and update user menu card tokens (NAV-03, NAV-04)</name>
  <files>
    citizenmate/src/components/shared/layout-shell.tsx
    citizenmate/src/components/shared/user-menu.tsx
  </files>
  <action>
**layout-shell.tsx (NAV-03):**
Read the file. Confirm the main content wrapper has `pt-[66px]`. If it already does, add a comment `// NAV-03: verified pt-[66px]` and make no other change.

**user-menu.tsx (NAV-04):**
Read the file. Find the dropdown panel div (the popover/menu container that appears when the user avatar is clicked). Update its border-radius, border, and shadow to Conseil card spec:
- Change `rounded-xl` or `rounded-2xl` to `rounded-[15px]` (use inline style if className doesn't support arbitrary px)
- Change border to `border border-[#E9ECEF]` — remove any `border-cm-slate-200` or `border-zinc-200`
- Replace `shadow-xl` or `shadow-2xl` with the dual-layer conseil shadow via inline style:
  `style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}`
- Remove any `backdrop-blur` from the dropdown panel
- Keep all existing Framer Motion animation (open/close) — only the visual tokens change
- Do NOT remove any functionality (links, sign-out button, avatar display)

Note: If the dropdown already uses inline style for borderRadius, update it. If it uses a className, switch to inline style for the borderRadius value since Tailwind `rounded-[15px]` is also acceptable.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>layout-shell.tsx confirms pt-[66px] spacer; user-menu.tsx dropdown has 15px radius, #E9ECEF border, and conseil dual-layer shadow with no backdrop-blur</done>
</task>

</tasks>

<verification>
Run TypeScript check and build after both tasks complete:
```bash
cd /Volumes/home/Documents/App/AuTest/citizenmate
npx tsc --noEmit
npm run build
```
Both must exit 0.
</verification>

<success_criteria>
- `npx tsc --noEmit` passes with zero errors
- `npm run build` passes with zero errors
- navbar.tsx: fixed, white, 66px, scroll uses cubic-bezier(0.165,0.84,0.44,1), no shadow on scroll, no backdrop-blur
- layout-shell.tsx: main content has pt-[66px]
- user-menu.tsx: dropdown panel has borderRadius 15px, border #E9ECEF, conseil card shadow
</success_criteria>

<output>
After completion, create `.planning/phases/03-component-implementation/03-A-SUMMARY.md` following the summary template.
</output>
