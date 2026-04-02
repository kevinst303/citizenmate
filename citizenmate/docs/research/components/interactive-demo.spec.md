# InteractiveDemo Specification

## Overview
- **Target file:** `src/components/landing/interactive-demo.tsx`
- **Screenshot:** `docs/design-references/section_4_stats_control_*.png`
- **Interaction model:** Click-driven tab switching
- **Conseil equivalent:** "Take Control of Your Website" section

## Purpose in CitizenMate
Replaces the generic Conseil tab content with CitizenMate's core features:
- Tab 1: **Smart Practice Tests** — show the test-taking experience
- Tab 2: **Bilingual Study Mode** — show the dual-language study interface  
- Tab 3: **Progress Analytics** — show the dashboard/progress tracking

## DOM Structure
```
<section> (full-width, light grey background)
  <div.container> (max-w-7xl)
    <div.grid> (2-column: left sidebar tabs + right content area)
      <div.left-column>
        <h2> "Experience CitizenMate"
        <p> subtitle text
        <div.tab-list> (3 vertical tab buttons)
          <button.tab-active> (teal pill bg, white text, icon left)
          <button.tab-inactive> (transparent, grey text, icon left)
          <button.tab-inactive>
      </div.left-column>
      <div.right-column> (flex row of 2 cards)
        <div.content-card> (white bg, rounded, content changes per tab)
          <span.badge> "Trending Solutions" equivalent badge
          <h3> Tab-specific heading
          <p> Tab-specific description
          <a.cta-button> Tab-specific CTA
        <div.feature-card> (image bg with teal overlay, checklist)
          <span.badge> "Tailored Experiences" equivalent
          <ul> 3 checklist items with green check icons
```

## Computed Styles (from Conseil extraction)

### Section Container
- background: light grey (`#f0f4f5` / `var(--cm-ice)` equivalent)
- padding: 80px 0 (py-20)

### Heading (left column)
- fontFamily: Poppins, sans-serif
- fontSize: 48px (desktop), 36px (mobile)
- fontWeight: 700
- lineHeight: 1.1
- color: #000000

### Tab Buttons
- **Active state:**
  - backgroundColor: #006d77
  - color: #ffffff
  - borderRadius: 10px
  - padding: 16px 24px
  - fontWeight: 600
  - fontSize: 16px
  - width: 100%
  - textAlign: left
  - display: flex, alignItems: center, gap: 12px
  - icon: white
  
- **Inactive state:**
  - backgroundColor: transparent
  - color: #3f3f46 (muted)
  - padding: 12px 24px
  - fontWeight: 400
  - fontSize: 16px
  - border-bottom: 1px solid #e8eaef (subtle separator)
  - icon: grey

### Content Card (right, white card)
- backgroundColor: white
- borderRadius: 16px
- padding: 32px
- boxShadow: 0 1px 3px rgba(0,0,0,0.08)

### Feature Card (right, image + overlay)
- borderRadius: 16px
- overflow: hidden
- background: image with teal-dark overlay
- padding: 32px
- color: white

### Badge (inside cards)
- backgroundColor: rgba(0, 109, 119, 0.1)
- color: #006d77
- borderRadius: 100px (pill)
- padding: 4px 12px
- fontSize: 12px
- fontWeight: 700

## States & Behaviors

### Tab Click Switching
- **Trigger:** Click on tab button
- **Transition:** Content fades (opacity 0→1, 0.3s ease)
- **State tracking:** React useState for activeTab index

### Hover states
- **Tab buttons:** Slight background tint on hover (rgba(0,109,119,0.05))
- **CTA button:** Standard teal button hover (darken)
- **Content cards:** None (static)

## Per-State Content (CitizenMate adaptation)

### State 0: "Smart Practice Tests"
- Tab label: "Smart Practice Tests" (icon: ClipboardCheck)
- Badge: "Real Test Format"
- Heading: "Practice with confidence"
- Description: "20 questions, 45 minutes — just like the real Australian citizenship test. Get detailed explanations for every answer."
- CTA: "Start Free Practice →" → /practice
- Feature card badge: "AI-Powered"
- Checklist: ["Official test format", "Detailed explanations", "Instant results"]

### State 1: "Bilingual Study Mode"
- Tab label: "Bilingual Study Mode" (icon: Languages)
- Badge: "15+ Languages"
- Heading: "Study in your language"
- Description: "Read the official Our Common Bond booklet with side-by-side translations. Understand concepts in your native language, answer in English."
- CTA: "Start Studying →" → /study
- Feature card badge: "Inclusive Learning"
- Checklist: ["Side-by-side translations", "15+ languages supported", "Official content"]

### State 2: "Progress Analytics"
- Tab label: "Progress Analytics" (icon: BarChart3)
- Badge: "Know When You're Ready"
- Heading: "Track your readiness"
- Description: "See your mastery level for each topic. AI-powered insights tell you exactly when you're ready to book your test."
- CTA: "View Demo →" → /practice
- Feature card badge: "Smart Insights"
- Checklist: ["Topic-by-topic tracking", "AI readiness score", "Study recommendations"]

## Assets
- Tab icons: ClipboardCheck, Languages, BarChart3 from lucide-react
- Checklist icon: CheckCircle2 from lucide-react (green)
- Feature card images: reuse existing `/generated/feature-*.webp`

## Text Content
See "Per-State Content" above — all adapted for CitizenMate, not copied from Conseil.

## Responsive Behavior
- **Desktop (1440px):** 2-column grid (left tabs ~35%, right cards ~65%)
- **Tablet (768px):** Stacks to single column, tabs become horizontal row
- **Mobile (390px):** Single column, tabs horizontal with scroll if needed
- **Breakpoint:** lg: (1024px) for column→stack transition
