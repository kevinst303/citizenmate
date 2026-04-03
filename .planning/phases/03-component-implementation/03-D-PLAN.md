---
phase: 03-component-implementation
plan: D
type: execute
wave: 1
depends_on: []
files_modified:
  - citizenmate/src/components/landing/pricing-preview.tsx
  - citizenmate/src/components/landing/faq.tsx
  - citizenmate/src/components/shared/auth-modal.tsx
  - citizenmate/src/components/shared/premium-gate.tsx
  - citizenmate/src/components/quiz/quiz-header.tsx
  - citizenmate/src/app/globals.css
autonomous: true
branch_name: feat/03d-pricing-faq-modals
requirements:
  - PRIC-01
  - PRIC-02
  - FAQ-01
  - MODL-01

must_haves:
  truths:
    - "Pricing cards use Conseil card design with exactly 15px border-radius, #E9ECEF border, and dual-layer conseil shadow"
    - "The highlighted/popular pricing card uses the teal primary gradient (card-conseil-popular)"
    - "FAQ accordion items have exactly 15px border-radius and correct border colour"
    - "AuthModal and PremiumGate modal panels use 15px radius and conseil card shadow (not rounded-2xl or shadow-2xl)"
    - "QuizHeader submit-confirm modal uses 15px radius and conseil card shadow"
  artifacts:
    - path: "citizenmate/src/components/landing/pricing-preview.tsx"
      provides: "Conseil pricing cards at 15px radius"
      contains: "rounded-\\[15px\\]|borderRadius.*15px"
    - path: "citizenmate/src/components/landing/faq.tsx"
      provides: "FAQ accordion with Conseil border/radius"
      contains: "rounded-\\[15px\\]"
    - path: "citizenmate/src/components/shared/auth-modal.tsx"
      provides: "Auth modal with conseil card tokens"
      contains: "borderRadius.*15px|rounded-\\[15px\\]"
    - path: "citizenmate/src/components/shared/premium-gate.tsx"
      provides: "Premium gate modal with conseil card tokens"
      contains: "borderRadius.*15px|rounded-\\[15px\\]"
    - path: "citizenmate/src/app/globals.css"
      provides: "Updated .card-conseil to 15px radius (if updated globally)"
  key_links:
    - from: "citizenmate/src/components/landing/pricing-preview.tsx"
      to: "card-conseil CSS class"
      via: "className on card div"
      pattern: "card-conseil"
    - from: "citizenmate/src/components/shared/auth-modal.tsx"
      to: "modal panel div"
      via: "borderRadius inline style or className"
      pattern: "15px"
    - from: "citizenmate/src/components/quiz/quiz-header.tsx"
      to: "submit confirm dialog panel"
      via: "className or style"
      pattern: "15px"
---

<objective>
Update Pricing cards, FAQ accordion, and all shared modal components to use Conseil card design tokens (15px radius, #E9ECEF border, dual-layer shadow). Also resolve the card-conseil 10px vs 15px discrepancy globally via globals.css.

Purpose: These components appear across authenticated flows — using the correct 15px radius is critical to token consistency throughout the app.
Output: globals.css `.card-conseil` updated to 15px; pricing/FAQ/modals use correct tokens; build passes.
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
<!-- CRITICAL: globals.css card-conseil has border-radius: 10px (as found in code review) -->
<!-- REQUIREMENTS.md specifies 15px for cards (PRIC-01, STUD-01, MODL-01) -->
<!-- Resolution: update .card-conseil in globals.css to border-radius: 15px -->
<!-- This is a GLOBAL change — all consumers of .card-conseil will update automatically -->
<!-- Buttons remain at rounded-[10px] — they do NOT use .card-conseil -->
<!-- Verify: .btn-rounded uses its own border-radius (separate from card) -->

<!-- Conseil card target spec: -->
<!--   background: #FFFFFF -->
<!--   border: 1px solid #E9ECEF -->
<!--   border-radius: 15px -->
<!--   box-shadow: rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px -->
<!--   padding: 30px -->

<!-- FAQ: uses @base-ui/react Accordion — do NOT replace with custom toggle -->
<!-- Only update classNames on AccordionItem, AccordionTrigger, AccordionContent wrappers -->
<!-- FAQ container is max-w-3xl — this is acceptable per research -->

<!-- Modal pattern: find the panel/container div (not the backdrop/overlay) -->
<!-- Change rounded-2xl → rounded-[15px] -->
<!-- Change shadow-2xl → inline style boxShadow conseil dual-layer -->
<!-- Keep all Framer Motion animations intact -->
<!-- Keep all functional logic (auth flows, close handlers) unchanged -->

<!-- globals.css append rule: mark additions with /* Track 03-D: [description] */ -->
<!-- Do NOT edit @theme inline block or existing rule properties EXCEPT .card-conseil radius -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix .card-conseil to 15px in globals.css; update Pricing and FAQ (PRIC-01, PRIC-02, FAQ-01)</name>
  <files>
    citizenmate/src/app/globals.css
    citizenmate/src/components/landing/pricing-preview.tsx
    citizenmate/src/components/landing/faq.tsx
  </files>
  <action>
**globals.css — fix card-conseil radius (resolves the 10px/15px discrepancy):**
Find the `.card-conseil` rule. Change `border-radius: 10px` to `border-radius: 15px`. Also update `.card-conseil-popular` from `border-radius: 10px` to `border-radius: 15px`. Also check `.shadow-card` and update its `border: 1px solid rgba(0,0,0,0.08)` to `border: 1px solid #E9ECEF` if the current border colour differs from Conseil spec. Append a comment `/* Track 03-D: updated card-conseil and card-conseil-popular to 15px radius per DESIGN_TOKENS.md */` after the change. Do NOT edit any other rule.

**pricing-preview.tsx (PRIC-01, PRIC-02):**
Read the file. Confirm cards use `card-conseil` class (now 15px after globals.css fix). The popular/highlighted card must use `card-conseil-popular` class. Verify the section uses `mx-auto max-w-[1140px]` container — if it uses `max-w-7xl`, change to `max-w-[1140px]`. No other changes needed if the classes are already applied.

If any pricing card has explicit `rounded-2xl` or `rounded-xl` inline that would override the CSS class, remove those Tailwind radius classes (the CSS class's border-radius takes precedence as long as there's no inline override).

**faq.tsx (FAQ-01):**
Read the file. It uses `@base-ui/react` Accordion. Do NOT replace it. Find the AccordionItem wrapper div or the trigger/content container. Ensure it has `rounded-[15px]` on the item container and border colour `border-[#E9ECEF]` (or equivalent). If AccordionItems currently use `rounded-lg` or `rounded-xl`, update to `rounded-[15px]`. Verify the overall FAQ section has a section badge above the accordion list.

Note: If the AccordionItem border is applied via `className` on the base-ui primitive, check whether base-ui respects className or uses its own slot. Add `className="rounded-[15px] border border-[#E9ECEF]"` to the AccordionItem component. If there is a wrapper div around AccordionItem, add the classes to that wrapper.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>globals.css .card-conseil border-radius is 15px; pricing cards use card-conseil and max-w-[1140px]; FAQ accordion items have rounded-[15px] and #E9ECEF border</done>
</task>

<task type="auto">
  <name>Task 2: Update shared modal components to Conseil card tokens (MODL-01)</name>
  <files>
    citizenmate/src/components/shared/auth-modal.tsx
    citizenmate/src/components/shared/premium-gate.tsx
    citizenmate/src/components/quiz/quiz-header.tsx
  </files>
  <action>
For each modal file, find the modal panel/container element (the white box that appears, NOT the backdrop overlay div). Apply Conseil card tokens:

1. Replace `rounded-2xl` → `rounded-[15px]` (use `rounded-[15px]` as Tailwind class OR inline style `borderRadius: '15px'`)
2. Replace `shadow-2xl` → remove from className and add inline:
   `style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}`
   If a `style` prop already exists on the element, merge the boxShadow into it.
3. Add `border border-[#E9ECEF]` if no border class is present on the panel (or inline `border: '1px solid #E9ECEF'` in the style prop)
4. Keep all Framer Motion `motion.div` animation props (variants, initial, animate, exit) intact — only change the visual token classes
5. Keep `bg-white` and existing padding classes

**auth-modal.tsx:** Find the modal panel div (typically the animated div inside the backdrop). Apply the 3 changes above.

**premium-gate.tsx:** Same as above — find the card/panel container and update radius, shadow, border.

**quiz-header.tsx:** This file has TWO concerns: (a) the main header bar, and (b) a submit-confirm modal/dialog. Only update the modal/dialog panel element (the confirm dialog that asks "Are you sure you want to submit?"). Do NOT change the header bar styling. Apply the same 3 changes to the dialog panel only. Also check the submit button in the header bar: if it uses `bg-cm-navy`, change to `bg-cm-teal`. If it already uses `bg-cm-teal`, leave it. Add `rounded-[10px]` to the submit button if it currently uses `rounded-xl` or `rounded-2xl` (buttons use 10px, cards use 15px).

Do NOT remove Framer Motion animations, do NOT change functional logic, do NOT add new buttons or content.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>auth-modal.tsx, premium-gate.tsx, and quiz-header.tsx modal panels use rounded-[15px], conseil card shadow, and #E9ECEF border; quiz-header submit button uses bg-cm-teal rounded-[10px]</done>
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
- globals.css: .card-conseil has border-radius 15px, border #E9ECEF
- pricing-preview.tsx: uses card-conseil, card-conseil-popular, max-w-[1140px]
- faq.tsx: AccordionItems have rounded-[15px] and #E9ECEF border
- auth-modal.tsx, premium-gate.tsx: modal panels use 15px radius + conseil shadow
- quiz-header.tsx: submit dialog uses 15px radius; submit button is bg-cm-teal rounded-[10px]
</success_criteria>

<output>
After completion, create `.planning/phases/03-component-implementation/03-D-SUMMARY.md` following the summary template.
</output>
