# Requirements: CitizenMate Conseil Design Overhaul

**Defined:** 2026-04-02
**Core Value:** Every page of CitizenMate renders with the Conseil design system

## v1 Requirements

Requirements for the component implementation phase. Phases 1–2 are complete; these requirements track Phase 3 work.

### Navigation

- [ ] **NAV-01**: Navbar renders as solid white fixed bar, 66px tall, no glassmorphism or backdrop-blur
- [ ] **NAV-02**: Navbar scroll transition uses `0.2s cubic-bezier(0.165,0.84,0.44,1)` (no shadow added on scroll)
- [ ] **NAV-03**: Layout shell page spacer updated to `pt-[66px]`
- [ ] **NAV-04**: User menu/avatar styled with Conseil card design (15px radius, #E9ECEF border, card shadow)

### Hero & CTA

- [x] **HERO-01**: Hero section uses full-width bg image with dark overlay (~rgba(0,0,0,0.5))
- [x] **HERO-02**: Hero layout includes star-rating badge, h1, subtitle, avatar group + trust text, white pill CTA
- [x] **HERO-03**: Hero marquee logo strip renders at bottom of hero section
- [x] **CTA-01**: Dark teal CTA band uses full-width bg image with overlay, centered heading + single button
- [x] **CTA-02**: Simple Q&A/inline CTA section renders as centered text + teal button

### Footer

- [x] **FOOT-01**: Footer uses 4-column layout: brand/contact, product links, company links, certifications
- [x] **FOOT-02**: Footer bottom bar shows copyright + social links

### Features & How It Works

- [x] **FEAT-01**: Features section renders as 3-column card grid with section badge + h2 + description
- [x] **FEAT-02**: Feature cards include icon, title, description, "Learn more" link; center card has Popular badge
- [x] **HIOW-01**: How It Works section uses split-card layout (left panel: text + CTA, right: image; split radii: 15px 0 0 15px / 0 15px 15px 0)
- [x] **HIOW-02**: Wave divider SVG renders between hero and features sections

### Social Proof

- [x] **SOCP-01**: Testimonials section renders as 3-column card grid on #F4F4F5 background
- [x] **SOCP-02**: Testimonial cards include avatar, name, rating, quote
- [x] **SOCP-03**: Social proof section includes section badge + heading + dual CTA buttons

### Pricing & FAQ

- [ ] **PRIC-01**: Pricing cards styled with Conseil card design (white, 15px radius, border, shadow)
- [ ] **PRIC-02**: Highlighted/popular pricing card uses teal primary style
- [ ] **FAQ-01**: FAQ section styled with Conseil accordion pattern
- [ ] **MODL-01**: Shared modal components use Conseil card design tokens

### Quiz Flow

- [ ] **QUIZ-01**: Quiz container and question cards styled with Conseil design tokens
- [ ] **QUIZ-02**: Quiz progress bar, option buttons, and results screen use Conseil palette
- [ ] **QUIZ-03**: Quiz navigation buttons use Conseil primary/secondary button styles

### Study Flow

- [x] **STUD-01**: Study card components styled with Conseil card design (15px radius, border, shadow)
- [x] **STUD-02**: Study session UI (flashcards, progress, controls) uses Conseil design tokens
- [x] **STUD-03**: Study topic/chapter navigation uses Conseil palette and typography

### Dashboard

- [x] **DASH-01**: Dashboard layout and stat cards use Conseil card design
- [x] **DASH-02**: Dashboard charts and data visualizations updated to Conseil palette
- [x] **DASH-03**: Dashboard navigation/sidebar styled with Conseil design tokens

## v2 Requirements

### Animations

- **ANIM-01**: Entrance animations further tuned to exactly match Conseil timing curves
- **ANIM-02**: Page transition animations added

### Extended Pages

- **EXT-01**: Blog listing/detail pages updated to Conseil card style
- **EXT-02**: Settings and profile pages updated to Conseil design tokens

## Out of Scope

| Feature | Reason |
|---------|--------|
| Lenis / Locomotive Scroll | Conseil uses native browser scroll; deliberately excluded |
| New features or pages | Design-only overhaul — no new functionality |
| Mobile-native app styles | Web-first; responsive web only |
| Conseil blog section structure | CitizenMate has own blog; structure unchanged |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01–04 | Phase 3 | Pending |
| HERO-01–03, CTA-01–02 | Phase 3 | Pending |
| FOOT-01–02 | Phase 3 | Pending |
| FEAT-01–02, HIOW-01–02 | Phase 3 | Pending |
| SOCP-01–03 | Phase 3 | Pending |
| PRIC-01–02, FAQ-01, MODL-01 | Phase 3 | Pending |
| QUIZ-01–03 | Phase 3 | Pending |
| STUD-01–03 | Phase 3 | Pending |
| DASH-01–03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after bootstrap from HANDOFF.md*
