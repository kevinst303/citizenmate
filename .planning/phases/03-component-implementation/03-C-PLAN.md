---
phase: 03-component-implementation
plan: C
type: execute
wave: 1
depends_on: []
files_modified:
  - citizenmate/src/app/page.tsx
  - citizenmate/src/components/landing/features.tsx
  - citizenmate/src/components/landing/how-it-works.tsx
  - citizenmate/src/components/landing/social-proof.tsx
  - citizenmate/src/app/globals.css
autonomous: true
branch_name: feat/03c-features-hiow-socialproof
requirements:
  - FEAT-01
  - FEAT-02
  - HIOW-01
  - HIOW-02
  - SOCP-01
  - SOCP-02
  - SOCP-03

must_haves:
  truths:
    - "A wave-shaped SVG divider renders between the Hero and Features sections"
    - "Features section renders as a 3-column card grid with section badge, h2, and description; the center card (index 1) has the Popular badge"
    - "Feature cards each have an icon, title, description, and Learn more link"
    - "How It Works section renders as a split-card (text+CTA left panel on #F4F4F5, image right panel) with asymmetric border-radii (15px 0 0 15px / 0 15px 15px 0)"
    - "Testimonials section renders as a 3-column card grid on #F4F4F5 background with avatar, name, rating, and quote per card"
    - "Social Proof section includes a section badge, heading, and dual CTA buttons"
  artifacts:
    - path: "citizenmate/src/app/page.tsx"
      provides: "Wave divider SVG between Hero and Features"
      contains: "viewBox=\"0 0 1440 80\""
    - path: "citizenmate/src/components/landing/features.tsx"
      provides: "3-col card grid; Popular badge on index 1"
      contains: "index === 1"
    - path: "citizenmate/src/components/landing/how-it-works.tsx"
      provides: "Split-card layout with asymmetric radii"
      contains: "15px 0 0 15px"
    - path: "citizenmate/src/components/landing/social-proof.tsx"
      provides: "3-col testimonial grid on #F4F4F5 with dual CTA"
      contains: "section-alt-bg"
    - path: "citizenmate/src/app/globals.css"
      provides: "Any new CSS rules appended at end (Track 03-C additions only)"
  key_links:
    - from: "citizenmate/src/app/page.tsx"
      to: "wave SVG"
      via: "inline JSX between Hero and Features"
      pattern: "viewBox.*1440.*80"
    - from: "citizenmate/src/components/landing/how-it-works.tsx"
      to: "feature-split.jpg"
      via: "next/image Image component"
      pattern: "feature-split\\.jpg"
    - from: "citizenmate/src/components/landing/social-proof.tsx"
      to: "#F4F4F5 background"
      via: "section-alt-bg class"
      pattern: "section-alt-bg"
---

<objective>
Implement the wave divider between Hero and Features, fix Features Popular badge position, refactor How It Works from zig-zag to Conseil split-card, and verify Social Proof is spec-complete.

Purpose: These sections form the core value-proposition storytelling of the landing page — visual coherence with Conseil is highest-impact here.
Output: Wave SVG in page.tsx; features.tsx Popular badge on center card; how-it-works.tsx split-card layout; social-proof.tsx confirmed.
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
<!-- Wave SVG pattern (from research): -->
<!--   <div className="relative -mt-1 bg-white"> -->
<!--     <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" -->
<!--          className="w-full h-auto block" preserveAspectRatio="none"> -->
<!--       <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFFFFF" /> -->
<!--     </svg> -->
<!--   </div> -->
<!-- WARNING: hero marquee is position:absolute bottom-0 — do NOT use negative margin that overlaps it -->
<!-- Use natural document flow: wave div placed AFTER <Hero />, not inside it -->

<!-- Split-card pattern (HIOW-01, from research): -->
<!-- <div className="flex overflow-hidden border border-[#E9ECEF]" -->
<!--      style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px ...' }}> -->
<!--   <div className="flex-1 bg-[#F4F4F5] p-[30px]" style={{ borderRadius: '15px 0 0 15px' }}> -->
<!--     text + CTA button -->
<!--   </div> -->
<!--   <div className="flex-1 relative min-h-[320px]" style={{ borderRadius: '0 15px 15px 0' }}> -->
<!--     <Image src="/images/conseil/feature-split.jpg" fill className="object-cover" alt="..." /> -->
<!--   </div> -->
<!-- </div> -->
<!-- Use next/image <Image> component, not <img> -->

<!-- Conseil section badge pattern: -->
<!-- <span className="badge-pill badge-pill-teal"><span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />Label</span> -->

<!-- globals.css: append-only. Mark additions with /* Track 03-C: [description] */ -->
<!-- Do NOT edit existing rules or the @theme inline block -->
<!-- If HowItWorks split-card needs no new CSS, add nothing to globals.css -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add wave divider in page.tsx and fix Features Popular badge to center card (HIOW-02, FEAT-01, FEAT-02)</name>
  <files>
    citizenmate/src/app/page.tsx
    citizenmate/src/components/landing/features.tsx
  </files>
  <action>
**page.tsx — wave divider (HIOW-02):**
Read page.tsx. Find the line where `<Hero />` is rendered and insert a wave divider IMMEDIATELY AFTER it (not inside the Hero component). The divider is:
```tsx
<div className="relative bg-white">
  <svg
    viewBox="0 0 1440 80"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto block"
    preserveAspectRatio="none"
  >
    <path
      d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
      fill="#FFFFFF"
    />
  </svg>
</div>
```
Do NOT use `-mt-1` negative margin — use natural document flow. The wave creates visual continuity between the dark hero background and the white Features section.

**features.tsx — Popular badge position (FEAT-02):**
Read features.tsx. Find where the "Popular" badge (or "Most Popular" label) is conditionally rendered based on index. Change `index === 0` to `index === 1` so the badge appears on the center card. Do not change any other card logic or styling. If the badge check already uses index 1, leave it.

Verify FEAT-01: The features section must have a section badge (badge-pill or badge-pill-teal), an h2 heading, and a description paragraph above the card grid. If any of these are missing, add them. The 3-column card grid must use `card-conseil` class. If cards use `feature-card-glass` or other legacy classes, update to `card-conseil`.

Also verify FEAT-02: Each feature card has an icon (Lucide React icon), title (font-semibold text-foreground), description (text-sm text-foreground/70), and a "Learn more" link or button. If the "Learn more" link is missing from any card, add `<a href="#" className="text-sm text-cm-teal font-medium hover:underline mt-auto">Learn more →</a>`.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>Wave SVG renders in page.tsx after Hero; features.tsx Popular badge is on index 1 (center card); all feature cards have icon, title, desc, and Learn more link</done>
</task>

<task type="auto">
  <name>Task 2: Refactor How It Works to split-card layout and verify Social Proof (HIOW-01, SOCP-01, SOCP-02, SOCP-03)</name>
  <files>
    citizenmate/src/components/landing/how-it-works.tsx
    citizenmate/src/components/landing/social-proof.tsx
  </files>
  <action>
**how-it-works.tsx (HIOW-01):**
Read the current file — it uses a zig-zag alternating layout (step 1, step 2, step 3 in alternating left/right). Replace the layout section with a Conseil split-card:

The new layout:
1. Keep the section container and heading area (section badge + h2 + description if present).
2. Replace the zig-zag step list with ONE primary split-card. The split-card shows the primary value proposition (e.g., "Smart preparation, step by step" or similar). Below the split-card, keep a simplified numbered steps list (3 steps in a row of 3 small cards or inline text) — these are the original 3 steps condensed to a summary, NOT a zig-zag.
3. Split-card structure:
```tsx
<div className="mx-auto max-w-[1140px] px-4">
  <div className="flex flex-col md:flex-row overflow-hidden border border-[#E9ECEF]"
       style={{
         borderRadius: '15px',
         boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px'
       }}>
    {/* Left text panel */}
    <div className="flex-1 bg-[#F4F4F5] p-[30px] flex flex-col justify-center"
         style={{ borderRadius: '15px 0 0 15px' }}>
      <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-3">
        Everything you need to pass
      </h3>
      <p className="text-foreground/70 text-sm mb-6">
        [Keep existing description text from how-it-works.tsx — do not fabricate new copy]
      </p>
      <a href="/practice" className="btn-rounded-teal self-start">
        Start practising
      </a>
    </div>
    {/* Right image panel */}
    <div className="flex-1 relative min-h-[280px] md:min-h-[320px]"
         style={{ borderRadius: '0 15px 15px 0' }}>
      <Image
        src="/images/conseil/feature-split.jpg"
        fill
        className="object-cover"
        alt="CitizenMate study interface"
      />
    </div>
  </div>
</div>
```
Use the actual copy from the existing how-it-works.tsx heading/description — do not fabricate text. Use `next/image` Image component (already imported or add import). On mobile (flex-col), the left panel appears first, right image second.

Note: Radii on the inner panels only apply visually if `overflow-hidden` is set on the outer div. The outer div has `overflow-hidden` so panel radii are cosmetic but set them anyway for clarity.

**social-proof.tsx (SOCP-01, SOCP-02, SOCP-03):**
Read the file. Verify:
- Section wrapper has `section-alt-bg` class (renders #F4F4F5 background) — SOCP-01
- Each testimonial card has: avatar (or initials circle), name, star rating, and quote text — SOCP-02
- There is a section badge (badge-pill or badge-pill-teal) + h2 heading above the grid — SOCP-03
- Dual CTA buttons exist somewhere in this section (e.g., "Get started" + "Learn more") — SOCP-03

If all of the above are confirmed, add a comment `// SOCP-01, SOCP-02, SOCP-03: verified` and make no changes. If anything is missing, add it.

If any testimonial cards use `rounded-2xl`, update to `rounded-[15px]`. If they use `card-glass` or `feature-card-glass`, replace with `card-conseil`.
  </action>
  <verify>
    <automated>cd /Volumes/home/Documents/App/AuTest/citizenmate && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>how-it-works.tsx renders split-card with asymmetric radii (15px 0 0 15px left, 0 15px 15px 0 right); social-proof.tsx has section-alt-bg, 3-col card grid, testimonial cards with avatar/name/rating/quote, badge + heading + dual CTA</done>
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
- Wave SVG present in page.tsx after Hero component
- Features: 3-col card grid, Popular badge on center card, each card has icon/title/desc/"Learn more"
- How It Works: single split-card with 15px-split radii, #F4F4F5 left panel, image right
- Social Proof: section-alt-bg background, 3-col testimonial cards with avatar/name/rating/quote, dual CTA buttons
</success_criteria>

<output>
After completion, create `.planning/phases/03-component-implementation/03-C-SUMMARY.md` following the summary template.
</output>
