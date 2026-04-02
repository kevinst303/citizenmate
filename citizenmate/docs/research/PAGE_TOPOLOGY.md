# Page Topology — Conseil Consulting (conseil.pixfort.com/consulting/)

## Source → CitizenMate Section Mapping

| # | Conseil Section | Type | Interaction | → CitizenMate Section | Status |
|---|----------------|------|------------|----------------------|--------|
| 1 | Top Info Bar | Static bar | Static | N/A (not needed) | Skip |
| 2 | Sticky Navbar | Fixed overlay | Scroll-triggered bg change | Navbar (already exists) | Adapt |
| 3 | Hero Banner | Full-width hero | Static + entry animations | Hero | Adapt |
| 4 | Trusted Logos Bar | Horizontal strip | Static with entry anim | Hero bottom bar | Already done ✅ |
| 5 | "Innovative Solutions" 3-Card Grid | Content section | Hover + entry animations | Features | Adapt |
| 6 | "Effortless Efficiency" Split Layout | Alternating columns | Image carousel + scroll reveal | HowItWorks | Adapt |
| 7 | "Industry Pioneers" Split Layout | Alternating columns (reversed) | Scroll reveal | HowItWorks (step 2) | Adapt |
| 8 | "Take Control" Vertical Tabs | Interactive tabs | Click-driven tab switching | NEW: InteractiveDemo | Build |
| 9 | Person Info Cards | 2-col cards | Hover effects | SocialProof | Adapt |
| 10 | Stats Hero ("80K+ Customers") | Stats + image | Static with overlay | SocialProof/Stats | Adapt |
| 11 | "Have a question?" CTA Bar | Conversion CTA | Static | CTASection | Already close ✅ |
| 12 | Partner Logos (Zentrix, Institute, Foundation) | Logo grid | Static | N/A or SocialProof | Optional |
| 13 | "Powerful Tools" Feature Block | Content + image | Scroll reveal | Features (additional) | Optional |
| 14 | Blog Articles Grid | 3-col cards | Hover effects | N/A (no blog yet) | Skip |
| 15 | Footer | Footer | Hover on links | Footer | Already exists ✅ |

## Z-Index Layers
1. **z-6050**: Navbar (sticky, top: 0)
2. **z-auto**: All flow content sections
3. **z-10**: Back-to-top button (bottom-left)
4. **z-50**: Cookie banner overlay

## Page Layout
- Single-column flow, no sidebar
- `max-width: ~1200px` content container within full-width sections
- Alternating white/light-grey (`#f8f9fa`-ish) section backgrounds
- Large vertical padding between sections (~80-120px)

## Priority Sections to Adapt
1. **Hero** — Already Conseil-inspired, needs exact token alignment
2. **Features (3-card grid)** — Already built, polish card styles
3. **Interactive Tabs** — NEW build needed, high value for showcasing features
4. **Stats section** — Would add credibility, map to citizenship test stats
5. **CTA Bar** — Already close, minor polish
