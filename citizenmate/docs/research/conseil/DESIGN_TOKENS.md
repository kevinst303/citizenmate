# Conseil Design Tokens
Extracted via getComputedStyle() on https://conseil.pixfort.com/consulting/
Date: 2026-04-02

---

## Colors

### Primary Palette
| Token | Value | Usage |
|---|---|---|
| Primary | `#006d77` | CTA buttons, links, accents |
| Secondary | `#3d348b` | Secondary CTA ("Get a Quote"), purple accent |
| Background | `#FFFFFF` | Page background, cards |
| Alt background | `#F4F4F5` (zinc-100) | Alternating section backgrounds |

### Text
| Token | Value | Usage |
|---|---|---|
| Heading | `#000000` | All headings h1–h4 |
| Body | `rgb(63, 63, 70)` = `#3F3F46` | Body copy, card text |
| Muted (on dark) | `rgba(255, 255, 255, 0.7)` | Text on hero dark overlay |
| Nav text | `rgb(0, 0, 0)` | Navigation links |

### Gray Scale (Zinc)
| Token | Value |
|---|---|
| zinc-950 | `#09090B` |
| zinc-900 | `#18181B` |
| zinc-800 | `#27272A` |
| zinc-700 | `#3F3F46` |
| zinc-600 | `#52525B` |
| zinc-500 | `#71717A` |
| zinc-400 | `#A1A1AA` |
| zinc-300 | `#D4D4D8` |
| zinc-200 | `#E4E4E7` |
| zinc-100 | `#F4F4F5` |
| zinc-50 | `#FAFAFA` |

### Border
| Token | Value |
|---|---|
| Card border | `1px solid rgb(233, 236, 239)` = `#E9ECEF` |

---

## Typography

### Font Families
- **Headings:** `Poppins, sans-serif`
- **Body:** `Inter, sans-serif`

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| h1 | 60px | 600 | 60px (1.0) | -2.4px |
| h2 | 48px | 500 | 61.44px (1.28) | -1.92px |
| h3 | 36px | 600 | 46.08px (1.28) | -1.44px |
| Body | 18px | 400 | 27px (1.5) | -0.16px |
| Nav link | 16px | 400 | 28.8px (1.8) | -0.16px |
| Button (sm) | 14px | 600 | — | — |
| Button (lg) | 16px | 400 | — | — |
| Card text | 16px | 400 | 28.8px (1.8) | -0.16px |

---

## Spacing & Layout

| Token | Value |
|---|---|
| Container max-width | 1140px |
| Nav height | 66px |
| Card padding | 30px |
| Section padding | Varies (~80px vertical) |

---

## Border Radius

| Element | Value |
|---|---|
| Cards (standard) | 15px |
| Cards (split section — left half) | 15px 0px 0px 15px |
| Cards (split section — right half) | 0px 15px 15px 0px |
| Buttons (primary/secondary) | 10px |
| Hero CTA (white pill) | 9999px (full pill) |
| Dropdown/submenu | 6px |

---

## Shadows

| Name | Value |
|---|---|
| Card shadow | `rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px` |
| sm | `0 1px 5px 0 rgba(0,0,0,0.1)` |
| default | `0 0.125rem 0.375rem rgba(0,0,0,0.03), 0 0.5rem 1.2rem rgba(0,0,0,0.08)` |
| lg | `0 0.25rem 0.5rem rgba(0,0,0,0.03), 0 1.5rem 2.2rem rgba(0,0,0,0.08)` |

---

## Transitions

| Context | Value |
|---|---|
| Nav outer (height/position) | `0.6s cubic-bezier(0.365, 0.84, 0.44, 1)` |
| Nav scroll state (bg/shadow) | `0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` |
| Standard component | `0.2s–0.4s cubic-bezier(0.165, 0.84, 0.44, 1)` |

---

## Buttons

### Primary (Teal)
- Background: `#006d77`
- Color: `#FFFFFF`
- Border radius: `10px`
- Padding (sm): `9px 18px`
- Padding (lg): `10px 24px`
- Font size: `14px–16px`, weight `400–600`
- No border

### Secondary (Purple)
- Background: `rgba(107, 97, 196, 0.15)`
- Color: `rgb(61, 52, 139)` = `#3D348B`
- Border radius: `10px`
- Padding: `9px 18px`
- Font size: `14px`, weight `600`

### Hero CTA (White Pill)
- Background: `#FFFFFF`
- Color: `rgb(51, 51, 51)` = `#333333`
- Border radius: `9999px`
- Padding: `10px 24px`
- Font size: `16px`, weight `400`

---

## Navbar

| State | Value |
|---|---|
| Height | 66px |
| Position | `fixed` (is-sticky) |
| Bg at scroll-0 | `#FFFFFF` (header-bg-color = white — opaque) |
| Bg on scroll | `#FFFFFF` (same — no glass, no blur) |
| Backdrop filter | none |
| Box shadow on scroll | none (no shadow either) |
| z-index | 6050 |
| Transition | `0.6s cubic-bezier(0.365, 0.84, 0.44, 1)` |

> Note: The Conseil navbar is simply white and fixed. No glassmorphism. No backdrop blur.
> CitizenMate's current `.navbar-glass` (backdrop-blur) is a CitizenMate-specific design, not in Conseil.
> For this overhaul, update navbar to solid white fixed, matching Conseil.

---

## Smooth Scroll Library
- **Lenis:** NO
- **Locomotive Scroll:** NO
- Native browser scroll only
