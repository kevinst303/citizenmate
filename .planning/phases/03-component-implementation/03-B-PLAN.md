---
phase: 03-component-implementation
plan: B
type: execute
wave: 1
depends_on: []
files_modified:
  - citizenmate/src/components/landing/hero.tsx
  - citizenmate/src/components/landing/cta-section.tsx
  - citizenmate/src/components/landing/footer.tsx
  - citizenmate/src/app/page.tsx
autonomous: true
branch_name: feat/03b-hero-cta-footer
requirements:
  - HERO-01
  - HERO-02
  - HERO-03
  - CTA-01
  - CTA-02
  - FOOT-01
  - FOOT-02

must_haves:
  truths:
    - "Hero renders with a full-width dark-overlaid background image (~rgba(0,0,0,0.5)), star-rating badge, h1, subtitle, avatar group + trust text, and a white pill CTA button"
    - "A marquee logo strip renders at the bottom of the hero section"
    - "A dark teal CTA band (full-width bg image with overlay) renders with centered heading and single button"
    - "A simple centered-text inline CTA section (Q&A banner variant) renders with a teal button"
    - "Footer uses a 4-column layout in a max-w-[1140px] inner container with brand/contact, product, company, and resources/Australia columns"
    - "Footer bottom bar shows copyright text and social links"
  artifacts:
    - path: "citizenmate/src/components/landing/hero.tsx"
      provides: "Hero section with bg image, overlay, badge, avatar group, marquee"
      contains: "btn-rounded"
    - path: "citizenmate/src/components/landing/cta-section.tsx"
      provides: "Dark CTA band (CTA-01)"
      contains: "bg-black"
    - path: "citizenmate/src/components/landing/footer.tsx"
      provides: "4-column footer with max-w-[1140px] inner container"
      contains: "max-w-[1140px]"
    - path: "citizenmate/src/app/page.tsx"
      provides: "Landing page composition including simple inline CTA (CTA-02)"
      contains: "InlineCTA"
  key_links:
    - from: "citizenmate/src/app/page.tsx"
      to: "hero.tsx marquee strip"
      via: "Hero component renders marquee internally"
      pattern: "marquee"
    - from: "citizenmate/src/app/page.tsx"
      to: "InlineCTA or CTASimple component"
      via: "import and JSX render"
      pattern: "InlineCTA|CTASimple"
    - from: "citizenmate/src/components/landing/footer.tsx"
      to: "max-w-[1140px] inner div"
      via: "wrapping div className"
      pattern: "max-w-\\[1140px\\]"
---

<objective>
Finalise the Hero, CTA sections, and Footer for the Conseil landing page design. Hero and CTASection were partially completed in Phase 2 — this plan closes specific gaps: adding the simple inline CTA (CTA-02), fixing the footer 4-column layout and container width, and verifying hero element completeness.

Purpose: These components are the primary above-the-fold and below-the-fold brand impression points.
Output: hero.tsx confirmed spec-complete; cta-section.tsx confirmed CTA-01; new InlineCTA component or inline section for CTA-02 in page.tsx; footer.tsx 4-column at 1140px.
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
<!-- Conseil CSS utility classes available in globals.css: -->
<!-- .btn-rounded — base pill button -->
<!-- .btn-rounded-teal — primary teal pill CTA -->
<!-- .btn-rounded-outline — outline pill CTA -->
<!-- .badge-pill, .badge-pill-teal — pill badges -->
<!-- @keyframes marquee — already defined in globals.css for hero logo strip -->

<!-- Hero white pill CTA (HERO-02): -->
<!--   className="btn-rounded bg-white text-cm-teal font-semibold" -->

<!-- CTA-02 simple inline section pattern: -->
<!--   Centered section, white bg, heading (text-2xl font-heading font-bold), -->
<!--   subtext (text-foreground/70), single teal button (btn-rounded-teal) -->
<!--   max-w-[1140px] container, py-16 section padding -->

<!-- Footer pitfall: keep <footer> full width for background; only inner <div> gets max-w-[1140px] -->
<!-- Footer 4 columns: brand/contact | Product links | Company links | Australia/Resources links -->
<!-- FOOT-02 social links already present — preserve them -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Verify Hero completeness and fix white pill CTA (HERO-01, HERO-02, HERO-03)</name>
  <files>citizenmate/src/components/landing/hero.tsx</files>
  <action>
Read hero.tsx in full. Verify each requirement element is present:

**HERO-01 (bg image + overlay):** Confirm the hero section has a background image (public/images/conseil/hero-bg.jpg or similar) with a dark overlay of approximately `rgba(0,0,0,0.5)` — e.g., `bg-black/50` or `bg-black/[0.5]` overlay div. If the overlay is lighter (e.g. bg-black/30), update to `bg-black/50`.

**HERO-02 (elements):** Confirm all of these exist in the JSX:
- A star-rating badge (star icon + rating text, using `badge-pill` or similar)
- An `<h1>` with the main heading (font-heading font-bold text-white)
- A subtitle paragraph (text-white/80 or similar muted)
- An avatar group (3-4 circular avatar images or initials) + trust text ("X students trust us" or similar)
- A primary CTA button: must use `btn-rounded` class and appear white with teal text. Current state may use `btn-rounded bg-white text-cm-teal`. If the CTA is a different colour or style, update it to `className="btn-rounded bg-white text-cm-teal font-semibold"`.

**HERO-03 (marquee):** Confirm the marquee logo strip is present at the bottom of the hero section. It should use the CSS `@keyframes marquee` animation already defined in globals.css. The marquee track must use `animate-[marquee_25s_linear_infinite]`. If present and working, no change needed.

Make the minimum changes necessary. Only correct what does not match spec.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>hero.tsx has bg-image + bg-black/50 overlay, star badge, h1, subtitle, avatar group + trust text, white pill CTA (btn-rounded bg-white text-cm-teal), and marquee strip at bottom</done>
</task>

<task type="auto">
  <name>Task 2: Confirm CTA-01 dark band, add simple inline CTA (CTA-02), and fix Footer (CTA-01, CTA-02, FOOT-01, FOOT-02)</name>
  <files>
    citizenmate/src/components/landing/cta-section.tsx
    citizenmate/src/components/landing/footer.tsx
    citizenmate/src/app/page.tsx
  </files>
  <action>
**CTA-01 — cta-section.tsx:**
Read the file. Confirm it renders a full-width dark CTA band with:
- A background image (public/images/conseil/cta-bg.jpg or similar)
- A dark overlay (bg-black/60 or similar)
- Centered heading (text-white font-heading)
- A single CTA button
If any dual-CTA buttons exist (two buttons) and the spec says "single button", remove the second button. Otherwise verify and leave unchanged.

**CTA-02 — new inline CTA section:**
Create a new component at `citizenmate/src/components/landing/inline-cta.tsx` OR add an inline JSX section directly in `page.tsx`. Prefer the standalone component. The InlineCTA component renders:
- Full-width `<section>` with `bg-white py-16`
- Inner `<div className="mx-auto max-w-[1140px] px-4 text-center">`
- A heading: `<h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3">Ready to pass your citizenship test?</h2>` (adjust copy to match CitizenMate tone)
- A subtext `<p className="text-foreground/70 mb-6">Join thousands of students preparing smarter.</p>`
- A single button: `<a href="/practice" className="btn-rounded-teal">Start for free</a>`
This section requires NO props — it's static. Do NOT add Framer Motion animations.

Then in `src/app/page.tsx`, import the new InlineCTA component and render it after the SocialProof section and before the dark CTASection band. Order in page.tsx should be:
`<Hero /> → wave → <Features /> → <HowItWorks /> → <SocialProof /> → <InlineCTA /> → <CTASection /> → <PricingPreview /> → <FAQ /> → <Footer />`
(Adjust if current order differs — add InlineCTA between SocialProof and CTASection.)

**FOOT-01, FOOT-02 — footer.tsx:**
Read the file. Make these targeted changes:
1. Change the outer `max-w-7xl` to `max-w-[1140px]` on the inner content div only. The `<footer>` tag itself stays full width with its background colour.
2. Ensure there are 4 distinct grid columns. Current columns: brand/contact + Product + Support + Legal. Rename/restructure to: brand/contact | Product | Company (rename Support→Company or Legal→Company) | Australia (add 4th column with 3-4 links: e.g., "Dept. of Home Affairs", "IELTS", "DIBP", "immi.homeaffairs.gov.au"). Keep all existing links in their columns.
3. Verify FOOT-02: bottom bar has copyright text and social icon links. If the copyright text was previously dark-on-dark (fixed in Phase 2), confirm it is visible. No other changes to bottom bar.

**globals.css append (if InlineCTA needs no new classes):** The inline-cta.tsx component uses only existing utility classes. No additions to globals.css needed for this track.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>cta-section.tsx is dark band with single CTA; InlineCTA component exists and is imported in page.tsx; footer.tsx has 4 columns in max-w-[1140px] inner div; build passes</done>
</task>

</tasks>

<verification>
```bash
cd /Volumes/home/Documents/App/AuTest/citizenmate
npx tsc --noEmit
npm run build
```
Both must exit 0. All 7 required items visible on landing page.
</verification>

<success_criteria>
- `npx tsc --noEmit` zero errors
- `npm run build` zero errors
- Hero: bg image + black/50 overlay, star badge, h1, subtitle, avatar group, white pill CTA, marquee
- Dark CTA band: full-width bg image, single centered button
- InlineCTA: centered heading + subtext + teal button, renders between SocialProof and CTASection
- Footer: 4 columns, inner container is max-w-[1140px], bottom bar copyright + social links
</success_criteria>

<output>
After completion, create `.planning/phases/03-component-implementation/03-B-SUMMARY.md` following the summary template.
</output>
