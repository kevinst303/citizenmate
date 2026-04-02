# Behaviors — Conseil Consulting Site

## Extracted Design Tokens

### Colors (from getComputedStyle)
| Token | Value | Usage |
|-------|-------|-------|
| Primary Teal | `rgb(0, 109, 119)` / `#006d77` | Buttons, accents, navbar CTA |
| Secondary Purple | `rgb(61, 52, 139)` / `#3d348b` | Secondary accents |
| Heading Color | `rgb(33, 37, 41)` / `#212529` | All headings |
| Body Text | `rgb(51, 51, 51)` / `#333333` | Body paragraphs |
| Muted Text | `rgb(63, 63, 70)` / `#3f3f46` | Secondary text |
| White | `rgb(255, 255, 255)` | Backgrounds, button text |
| Light Overlay | `rgba(107, 97, 196, 0.15)` | Purple tint overlays |
| Dark Overlay | `rgba(0, 0, 0, 0.5)` | Hero image overlay |

### Typography (from getComputedStyle)
| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 (Hero) | Poppins, sans-serif | 600 | 60px | 60px (1.0) |
| H2 (Section titles) | Poppins, sans-serif | 500 | 48px | 61.44px (1.28) |
| H3 (Card titles) | Poppins, sans-serif | 600 | 18px | 23.04px |
| Body text | Inter, sans-serif | 400 | 16px | 28.8px (1.8) |
| Nav links | Poppins, sans-serif | 600 | 14px | 16px |
| Badges | Inter | 700 | 12px | 16px |
| CTA button text | Poppins, sans-serif | 600 | 14px | 16px |

### Button Styles
| Button Type | BG | Color | Border Radius | Padding | Font |
|-------------|-------|-------|---------------|---------|------|
| Primary CTA ("Get in Touch") | `#006d77` | white | 10px | 9px 18px | Poppins 600 14px |
| Hero CTA ("Check Our Services") | white | `#212529` | 100px (pill) | 12px 24px | Poppins 600 14px |
| Secondary ("Get a Quote") | transparent/light | teal | 10px | 9px 18px | Poppins 600 14px |

### Card Styles
- Border radius: `10px`
- Border: `1px solid rgba(0,0,0,0.1)` (very subtle)
- Shadow: None at rest; soft lift on hover
- Padding: ~32px inner content area
- Background: white

### CSS Variables (from :root)
```css
--pix-primary: #006d77;
--pix-secondary: #61348b;
--pix-heading-color: #212529;
--pix-body-color: #636346;
--pix-border-radius: 10px;
```

## Scroll Behaviors

### Navbar
- **Behavior**: Sticky at top, white background persists
- **Trigger**: Always fixed
- **Height**: 66px
- **z-index**: 6050
- **No scroll-triggered changes observed** (stays white)

### Section Entry Animations
- **Type**: Fade-in + slide-up (AOS-style)
- **Trigger**: Viewport intersection
- **Duration**: ~0.4-0.6s
- **Easing**: ease-out

### Back-to-Top Button
- **Appears**: After scrolling past hero section
- **Position**: Bottom-left corner
- **Style**: Circular, teal background, white chevron-up icon

## Hover Behaviors

### Service Cards (3-card grid)
- **Effect**: Subtle lift (translateY: -4px), faint shadow increase
- **Transition**: ~0.3s ease
- **Border**: Becomes slightly more visible

### Navigation Links
- **Effect**: Color change to teal
- **Transition**: ~0.2s ease
- **Active indicator**: Teal dot/underline

### CTA Buttons
- **Effect**: Slight darkening/lightening of background
- **Transition**: ~0.2s ease

## Click Behaviors

### Vertical Tab Section ("Take Control of Your Website")
- **Interaction Model**: CLICK-DRIVEN (not scroll-driven)
- **3 tabs**: Pioneering Design, Forward-Thinking Solutions, Precision Craftsmanship
- **Each tab click**: Switches right-side content (title, description, image, checklist)
- **Active tab**: Teal background pill, white text
- **Inactive tabs**: Transparent background, grey text with icon
- **Transition**: Content fades/slides; no complex animation

## Responsive Notes
- Desktop (1440px): Full 3-column grids, side-by-side layouts
- Content max-width: ~1200px
- Large section padding: ~80-120px vertical
- Cards maintain consistent 10px border-radius
- Typography scales down on mobile (H1: 60px → ~36px)
