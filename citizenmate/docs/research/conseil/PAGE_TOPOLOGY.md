# Conseil Page Topology
Source: https://conseil.pixfort.com/consulting/
Date: 2026-04-02

---

## Page Structure

The page is a full-scroll single-page layout with no scroll-snap. Standard browser scroll (no Lenis).

---

## Sections (Top to Bottom)

### 1. Navbar
- **Type:** Fixed overlay (z-index: 6050), not in page flow
- **Interaction model:** Scroll-driven — gains white background on scroll
- **Height:** 66px
- **Components:** Logo (left), utility bar (top), main nav links, "Get a Quote" (purple pill), "Get in Touch" (teal) CTA
- **Mobile:** Hamburger menu

### 2. Hero
- **Type:** Flow content, first visible section
- **Interaction model:** Static
- **Background:** Full-width image with dark overlay (~rgba(0,0,0,0.5))
- **Layout:** Centered content — star rating badge, h1 headline, subtitle, avatar group + trust text, CTA button ("Check Our Services" — white pill), client logo strip (marquee)
- **Notable:** Logo strip at bottom of hero is a marquee animation (continuous scroll)

### 3. Wave Divider
- **Type:** SVG shape divider
- **Interaction model:** Static
- **Background:** Transitions from hero dark to white

### 4. Services Section — "Embrace The Future Of Business Design"
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** White
- **Layout:** Section badge + h2 + description (centered), then 3-column card grid
- **Cards:** 3 service cards with icon, title, description, "Learn more" link
  - Popular badge on center card
  - New badge on right card

### 5. Feature Split — "Streamlined Workflow for Fast Deployment"
- **Type:** Flow content
- **Interaction model:** Possibly click-driven (carousel dots visible)
- **Background:** White (alt: #F4F4F5 for left panel)
- **Layout:** 2-col split — left: text + CTA button, right: large image
- **Split card:** Left panel rounded (15px 0 0 15px), right panel (0 15px 15px 0), outer container rounded 15px

### 6. Features Grid — "Optimized Workflow for Rapid Deployment"
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** White
- **Layout:** 2-col — left: card with brand mockup image, right: heading + feature list with teal icons

### 7. Split Section — "Take Control of Your Website"
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** White / #F4F4F5
- **Layout:** Left: heading + description + 2 CTA buttons + feature tags. Right: card with "Trending Solutions" tag, heading, description, CTA button, image with overlay checkmarks

### 8. Partner Logos Strip
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** White
- **Layout:** 3 partner logos + 3 feature descriptions in columns

### 9. Operations Section — "Operations with Intelligent Solutions"
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** #F4F4F5
- **Layout:** Left: heading + description + CTA + stats. Right: large image with overlay

### 10. Q&A Banner
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** White
- **Layout:** Centered text + single CTA button

### 11. Blog Cards — "Embrace The Future Of Business Design"
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** White
- **Layout:** Section heading (centered) + 3-col blog card grid + "Visit our blog" CTA

### 12. Testimonials — "Success Stories from Clients"
- **Type:** Flow content
- **Interaction model:** Static (or click-driven carousel)
- **Background:** #F4F4F5
- **Layout:** Section badge + heading + avatar row, then 3-col testimonial card grid + dual CTA

### 13. CTA Section — "Elevate Your Brand Through Design"
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** Dark teal overlay on image (full-width bg image)
- **Layout:** Centered heading + description + single CTA button

### 14. Footer
- **Type:** Flow content
- **Interaction model:** Static
- **Background:** White
- **Layout:** 4-column: Brand/contact info (left), Product links, Company links, Certifications
- **Bottom bar:** Copyright + social links

---

## CitizenMate Mapping

| Conseil Section | CitizenMate Component | Notes |
|---|---|---|
| Navbar | `navbar.tsx` | Simplify: remove glass, use solid white fixed |
| Hero | `hero.tsx` | Keep Framer Motion, update bg + layout |
| Wave Divider | `page.tsx` (inline SVG) | Add between hero and services |
| Services (3-col cards) | `features.tsx` | Match 3-col card grid with badge |
| Feature Split | `how-it-works.tsx` | Adapt to split-card layout |
| Features Grid | (can merge with features) | Icon + text list pattern |
| Split Section | (can merge with how-it-works) | Dual-CTA pattern |
| Partner Logos | `social-proof.tsx` (marquee) | Logo strip stays in hero area |
| Operations | — | Merge with features/how-it-works |
| Q&A Banner | `cta-section.tsx` | Simple centered CTA |
| Blog Cards | — | Optional — CitizenMate has blog |
| Testimonials | `social-proof.tsx` | 3-col testimonial cards + dual CTA |
| CTA Dark | `cta-section.tsx` | Dark teal full-width band |
| Footer | `footer.tsx` | 4-column layout |
