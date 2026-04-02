# Conseil Behaviors
Source: https://conseil.pixfort.com/consulting/
Date: 2026-04-02

---

## Smooth Scroll Library
- **Lenis:** NO
- **Locomotive Scroll:** NO
- Native browser scroll

---

## Navbar Scroll Behavior

**Trigger:** Page scrolls past ~0px (fires immediately on scroll)
**CSS class added:** `is-scroll` on `.pixfort-header-area`

**State A (scroll = 0):**
- Background: `#FFFFFF` (white — already opaque, NOT transparent)
- Box shadow: none
- Backdrop filter: none

**State B (scrolled):**
- Background: `var(--pix-header-scroll-bg-color, var(--pix-header-bg-color, var(--pix-gray-1)))` → resolves to `#FFFFFF`
- Box shadow: none (no shadow added on scroll)
- Backdrop filter: none

**Transition:** `box-shadow 0.2s cubic-bezier(0.165, 0.84, 0.44, 1), background-color 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)`

> **CitizenMate Note:** The Conseil navbar is simply white and fixed — no glass, no blur. CitizenMate's `.navbar-glass` (backdrop-blur) should be replaced with a simple solid white fixed navbar. The existing scroll listener can be simplified or removed.

---

## Entrance Animations

**No scroll-triggered entrance animations detected** on the Conseil site. Elements are static — no fade-up, slide-in, or IntersectionObserver patterns visible.

> **CitizenMate Note:** Keep Framer Motion animations in CitizenMate for a richer feel, but reduce density to match Conseil's lighter aesthetic. Subtle fade-in is acceptable; heavy spring stagger should be softened.

---

## Marquee (Logo Strip in Hero)

**Location:** Bottom of hero section, client logos
**Animation:** CSS animation (marquee/ticker style — continuous horizontal scroll)
**Direction:** Left to right (or right to left, standard marquee)
**Speed:** Slow, continuous loop
**Note:** Animation class present but `animation: none` reported (may be JS-driven or paused in Playwright snapshot)

---

## Card Hover States

Based on the CSS shadow system:
- Cards gain elevated shadow on hover (transition from `--pix-shadow` to `--pix-shadow-lg`)
- Estimated: `transition: box-shadow 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)`
- No transform/scale detected on cards

---

## Button Hover States

- Primary teal buttons: background darkens slightly on hover (standard)
- Transition: `0.2s cubic-bezier(0.165, 0.84, 0.44, 1)`

---

## Responsive Behavior

### 1440px (Desktop)
- Full multi-column layouts (3-col cards, 2-col splits)
- Container: 1140px centered

### 768px (Tablet)
- 3-col grids collapse to 2-col or 1-col
- Split sections stack vertically
- Text sizes reduce slightly
- Nav: hamburger visible

### 390px (Mobile)
- All grids: 1 column
- Padding reduces
- Hero: stacked, smaller text
- Buttons: full-width or centered

---

## Section Alternating Backgrounds

Pattern: White → White → White → #F4F4F5 → White → #F4F4F5 → ...
Only two background values used across the entire page:
- `rgb(255, 255, 255)` = `#FFFFFF`
- `rgb(244, 244, 245)` = `#F4F4F5` (zinc-100)
