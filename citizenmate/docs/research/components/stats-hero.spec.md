# StatsHero Specification

## Overview
- **Target file:** `src/components/landing/stats-hero.tsx`
- **Screenshot:** `docs/design-references/section_6_footer_final_*.png`
- **Interaction model:** Static with scroll-reveal entry animation
- **Conseil equivalent:** "80K+ Customers Since 2012" stats block

## Purpose in CitizenMate
Adds a powerful social proof + credibility section with a large stat number,
strategic edge messaging, and an image overlay with value propositions.

## DOM Structure
```
<section> (white or light background)
  <div.container>
    <div.card> (rounded card with subtle border)
      <div.grid> (2-column: left stats + right image overlay)
        <div.left>
          <div.stat-block>
            <span.big-number> "10K+"
            <span.label> "STUDENTS HELPED SINCE 2024"
          <div.feature-block>
            <span.icon> (small teal icon)
            <span.title> "Ready to Succeed"
            <p> supportive text
        <div.right> (image with teal overlay)
          <span.badge> "Proven Results"
          <ul.checklist> 3 items with check icons
```

## Computed Styles

### Card Container
- borderRadius: 16px
- border: 1px solid rgba(0,0,0,0.06)
- overflow: hidden
- background: white

### Big Number
- fontFamily: Poppins, sans-serif
- fontSize: 72px (desktop)
- fontWeight: 800
- color: #1a1a1a
- lineHeight: 1.0

### Label (under number)
- fontSize: 12px
- fontWeight: 600
- letterSpacing: 2px
- textTransform: uppercase
- color: #52525b (muted)

### Image Overlay (right side)
- borderRadius: 16px (within card)
- background: image with linear-gradient overlay
- overlay: from-[#004a50]/75 to-[#006d77]/85
- padding: 32px

### Badge on Image
- backgroundColor: rgba(255,255,255,0.15)
- backdropFilter: blur(8px)
- borderRadius: 100px (pill)
- padding: 6px 16px
- color: white
- fontSize: 12px
- fontWeight: 600

### Checklist Items
- color: white
- fontSize: 16px
- fontWeight: 600
- gap: 12px between items
- icon: green check circle (20px)

## Content (CitizenMate adaptation)

### Left Side
- Big number: "10K+"
- Label: "STUDENTS HELPED ACROSS AUSTRALIA"
- Feature icon: Shield/Star
- Feature title: "Study with Confidence"
- Feature text: "Our AI-powered platform adapts to your learning style, helping you master every topic."

### Right Side
- Image: `/generated/hero-study.webp` or similar
- Badge: "Proven Results"
- Checklist:
  - "97% first-attempt pass rate"
  - "Official test format questions"
  - "AI-powered study guidance"

## Responsive Behavior
- **Desktop:** 2-column (stats left, image right)
- **Mobile:** Stacks vertically (stats on top, image below)
- **Breakpoint:** lg: (1024px)
