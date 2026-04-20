# DESIGN.md: Pixfort Conseil Consulting Design System

## 1. Visual Theme & Atmosphere
- **Mood**: High-trust, professional, modern, and expansive.
- **Design Philosophy**: High-utility minimalism combined with organic shapes (curves) and deep, professional color gradients.
- **Density**: Airy with significant whitespace (60px-100px section padding) to ensure readability and focus on key value propositions.

## 2. Color Palette & Roles
| Role | Color Name | Hex Code | Functional Application |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Teal | `#006769` | Main brand color, primary buttons, header accents, and gradient overlays. |
| **Primary Light** | Soft Teal | `#E6F0F0` | Hover states for light buttons and background badges. |
| **Text Primary** | Absolute Black | `#0F172A` | Primary headings and important UI labels. |
| **Text Secondary** | Slate Gray | `#475569` | Body copy and descriptive text. |
| **Background** | Off-White | `#F8FAFC` | Main section background for high contrast. |
| **Surface** | Pure White | `#FFFFFF` | Card backgrounds and navigation bar. |
| **Border** | Base Gray | `#E2E8F0` | Subtle dividers and card borders. |

## 3. Typography Rules
- **Primary Font**: `Inter` or `Poppins` (Sans-serif).
- **Secondary Font**: System default sans-serif for fallbacks.

| Level | Size | Weight | Letter Spacing | Color |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero)** | 56px / 3.5rem | 700 (Bold) | -0.02em | `#FFFFFF` (on dark) / `#0F172A` |
| **H2 (Section)** | 42px / 2.6rem | 600 (Semi-Bold) | -0.01em | `#0F172A` |
| **H3 (Card)** | 24px / 1.5rem | 600 (Semi-Bold) | 0 | `#0F172A` |
| **Body (p)** | 16px / 1rem | 400 (Regular) | 0 | `#475569` |
| **Label/Small** | 14px / 0.875rem | 500 (Medium) | 0.05em | `#006769` |

## 4. Component Stylings
- **Buttons (Primary)**:
  - `border-radius: 50px` (Full Pill)
  - `padding: 14px 32px`
  - `background: #006769`
  - `transition: transform 0.3s ease, background 0.3s ease`
- **Cards**:
  - `border-radius: 24px`
  - `padding: 40px`
  - `border: 1px solid #E2E8F0`
  - `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03)`
- **Badges**:
  - `background: #F1F5F9`
  - `border-radius: 8px`
  - `padding: 6px 12px`
  - `font-weight: 600`

## 5. Layout Principles
- **Grid Width**: Standard container at `1280px` max-width.
- **Section Spacing**: `100px` vertical margin between major sections.
- **Inner Column Gap**: `24px` - `32px` depending on card count.
- **Special Feature**: Concave curved section transitions (inverted arches) with a `bottom-radius` of approx `100px`.

## 6. Depth & Elevation
- **Level 1 (Cards)**: `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1)`
- **Level 2 (Hover/Active)**: `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

## 7. Animations & Interactions
- **Reveal on Scroll**: Elements use a "Slide-up and Fade-in" transition (`transform: translateY(20px); opacity: 0;` to `translateY(0); opacity: 1;`) over `0.6s` with `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Card Hover**: 
  - Slight lift effect (`transform: translateY(-8px)`).
  - Background color transition or shadow deepening.
- **Micro-interactions**: Buttons pulse slightly on hover with a brightness increase of `10%`.

## 8. Responsive Behavior
- **Desktop (1024px+)**: Full grid layouts (3-4 columns).
- **Tablet (768px - 1023px)**: 2-column grid; font sizes scaled down by `15%`.
- **Mobile (Up to 767px)**: Single column stack; `H1` reduces to `32px`; navigation becomes a side-drawer or full-screen overlay.

## 9. Agent Prompt Guide
> "Create a high-fidelity consulting website UI using the Pixfort-inspired design system. Use a primary teal color (#006769) for all brand elements. Implement large-radius rounded corners (24px for cards, 50px for buttons). Use a 'concave arch' effect for section bottom transitions. Ensure all typography uses Inter/Poppins with tight tracking for bold H1/H2 headings. Add a subtle slide-up fade-in animation to all containers as they enter the viewport."
