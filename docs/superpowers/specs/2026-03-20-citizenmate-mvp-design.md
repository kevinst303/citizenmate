# CitizenMate MVP — Design Spec

> **Product:** CitizenMate — AI-powered, multilingual Australian citizenship test prep PWA
> **Scope:** Phase 1 MVP (Sub-project 1: Foundation + Landing Page)
> **Tech Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion

---

## 1. Architecture Overview

### Sub-project Decomposition

Phase 1 MVP is decomposed into 4 independently buildable sub-projects:

| # | Sub-project | What it delivers |
|---|---|---|
| 1 | **Foundation + Landing** | Scaffold, design system, PWA, landing page, SEO |
| 2 | **Mock Test Engine** | Question bank, quiz UI, timer, results, rationales |
| 3 | **Auth + Progress** | Supabase auth, onboarding, progress dashboard |
| 4 | **Bilingual Study** | "Our Common Bond" content, side-by-side reader |

This spec covers **Sub-project 1**. Each subsequent sub-project will get its own spec.

### Project Structure

```
citizenmate/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker (via @serwist/next)
│   ├── icons/                 # PWA icons (192, 512)
│   └── og-image.png           # Social sharing image
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (fonts, metadata, nav shell)
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Global styles + design tokens
│   │   └── manifest.ts        # Dynamic web manifest
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── landing/           # Landing page sections
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── social-proof.tsx
│   │   │   ├── pricing-preview.tsx
│   │   │   ├── cta-section.tsx
│   │   │   └── footer.tsx
│   │   └── shared/            # Shared components
│   │       ├── navbar.tsx
│   │       └── pwa-install-prompt.tsx
│   └── lib/
│       └── utils.ts           # cn() helper, constants
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 2. Design System

### Brand Identity

| Attribute | Value |
|---|---|
| **Name** | CitizenMate |
| **Tagline** | "Your mate for the citizenship test." |
| **Voice** | Warm, friendly, encouraging, trustworthy — like a knowledgeable friend |
| **Target emotion** | Confidence, not fear |

### Color Palette — "Warm Sunset"

A custom palette that reflects Australian warmth, sunshine, and mateship:

| Role | Hex | Tailwind Variable | Usage |
|---|---|---|---|
| **Primary** | `#F97316` | `--primary` | Orange — warm, energetic, Australian sun |
| **Primary Dark** | `#EA580C` | `--primary-dark` | Hover/active states |
| **Secondary** | `#0EA5E9` | `--secondary` | Sky blue — trust, clarity, Australian sky |
| **CTA/Success** | `#10B981` | `--cta` | Emerald green — "You're ready", pass, confidence |
| **Background** | `#FFFBF5` | `--background` | Warm off-white — inviting, not clinical |
| **Surface** | `#FFFFFF` | `--surface` | Cards, elevated surfaces |
| **Text** | `#1C1917` | `--foreground` | Stone 900 — warm dark, high contrast |
| **Text Muted** | `#57534E` | `--muted-foreground` | Stone 600 — secondary text |
| **Border** | `#E7E5E4` | `--border` | Stone 200 — subtle boundaries |
| **Danger** | `#EF4444` | `--danger` | Red — errors, warnings |
| **Accent** | `#FBBF24` | `--accent` | Amber/gold — highlights, Australian gold |

### Typography — "Modern Professional"

| Role | Font | Weight | Usage |
|---|---|---|---|
| **Heading** | Poppins | 600, 700 | H1-H6, nav items, CTAs |
| **Body** | Nunito Sans | 400, 500, 600 | Paragraphs, UI text, forms |
| **Display** | Poppins | 700, 800 | Hero headlines, large numbers |

**Why:** Poppins is geometric and modern yet approachable. Nunito Sans is humanist, highly readable, and warm. Together they strike the "professional but friendly" balance that CitizenMate needs — trustworthy enough for test prep, warm enough for anxious migrants.

### Motion Design (Framer Motion)

| Element | Animation | Duration |
|---|---|---|
| Page transitions | Fade + slide up | 300ms |
| Card hover | Subtle lift (translateY -2px) + shadow | 200ms |
| CTA buttons | Scale 1.02 on hover | 150ms |
| Section reveal | Fade in + slide up on scroll | 500ms, stagger 100ms |
| Progress bars | Spring animation | 600ms |
| Countdown timer | Flip animation (numbers) | 200ms |

### Component Style Rules

- **Rounded corners:** `rounded-xl` (12px) for cards, `rounded-lg` (8px) for buttons
- **Shadows:** `shadow-sm` for cards, `shadow-md` on hover — subtle, not heavy
- **Spacing:** 8px grid system (p-2, p-4, p-8, etc.)
- **Icons:** Lucide React — consistent 24px viewBox
- **No emojis as UI icons** — use SVG throughout (emojis okay in content text)

---

## 3. Landing Page Sections

### 3.1 Navigation Bar

- Floating navbar with `top-4 left-4 right-4` spacing
- Logo (CitizenMate wordmark + Australian flag accent) left
- Nav links: Features, How it Works, Pricing (smooth scroll)
- CTA button: "Start Free Practice" (primary orange)
- Mobile: hamburger → slide-out drawer
- Transparent on hero, white/blur on scroll

### 3.2 Hero Section

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Pass your Australian                                │
│  Citizenship Test — guaranteed.                      │
│                                                      │
│  Your mate for the journey.                          │
│  Study in your language. Practice with AI.           │
│  Know when you're ready.                             │
│                                                      │
│  [ Start Free Practice ]  [ See How It Works ]       │
│                                                      │
│  ✓ 500+ practice questions  ✓ Bilingual study        │
│  ✓ Mock tests feel like real test  ✓ Free to start   │
│                                                      │
│  "1 in 3 people fail. CitizenMate users don't."      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Large display heading with gradient text (orange → amber)
- Animated background: subtle floating geometric shapes or wave pattern
- Primary CTA: "Start Free Practice" → `/practice` (Phase 2 link)
- Secondary CTA: "See How It Works" → smooth scroll
- Trust badges row below CTAs
- Social proof stat at bottom

### 3.3 Features Section

3-column grid (mobile: stack) with animated reveal:
1. **Smart Mock Tests** — "Feel like the real test" with timer icon
2. **Bilingual Study** — "Learn in your language" with language icon
3. **Know When You're Ready** — "Readiness score" with chart icon

Each card: icon (Lucide SVG) + heading + short description + subtle hover animation

### 3.4 How It Works

4-step horizontal flow (mobile: vertical):
1. "Take a free diagnostic" — clipboard icon
2. "See your readiness gaps" — chart icon
3. "Study with your personalised plan" — book icon
4. "Pass with confidence" — checkmark/celebration icon

Connected with animated dotted line between steps.

### 3.5 Social Proof

- Stats row: "183,000+ tests/year", "1 in 3 fail", "Our users don't"
- Placeholder for future testimonials (empty state with "Be our first success story")
- Trust indicators: "Content from official Home Affairs booklet"

### 3.6 Pricing Preview

Simple comparison: Free vs Pro ($29.99 Sprint Pass)
- Highlight Sprint Pass as "Most Popular"
- Show key feature differences
- CTA: "Start Free" / "Get Sprint Pass"

### 3.7 FAQ Section

Collapsible accordion (shadcn Accordion):
- "Is this an official government app?" → No, independent + disclaimer
- "How is the test structured?" → 20 MCQs, 75%, values must be perfect
- "What languages are supported?" → English + Chinese (more coming)

### 3.8 CTA Section

Full-width orange gradient section:
- "Ready to become an Australian citizen, mate?"
- "Start your free practice test now — no signup needed"
- Large CTA button

### 3.9 Footer

- CitizenMate logo + tagline
- Links: About, Privacy, Terms, Contact
- Independence disclaimer: "CitizenMate is independent from the Australian Government"
- "Content based on 'Our Common Bond' — [version date]"
- © 2026 CitizenMate

---

## 4. PWA Foundation

| Feature | Implementation |
|---|---|
| **Web App Manifest** | `manifest.json` — name: "CitizenMate", theme: #F97316, display: standalone |
| **Service Worker** | `@serwist/next` — cache static assets, app shell |
| **Icons** | 192px + 512px PNG, maskable versions |
| **Install Prompt** | Custom banner (deferred to after first interaction, not on first visit) |
| **Splash Screen** | Orange theme, CitizenMate logo |

---

## 5. SEO Strategy

| Element | Implementation |
|---|---|
| **Title** | "CitizenMate — Pass Your Australian Citizenship Test \| Free Practice" |
| **Meta desc** | "Free practice tests for the Australian citizenship test. Study in your language. 500+ questions from Our Common Bond. Know when you're ready." |
| **OG tags** | Custom og-image with CitizenMate branding |
| **Structured data** | JSON-LD: WebApplication, FAQPage |
| **Heading hierarchy** | Single H1 in hero, H2 per section |
| **Semantic HTML** | `<main>`, `<section>`, `<nav>`, `<footer>`, `<article>` |
| **Sitemap** | Auto-generated via next-sitemap |
| **robots.txt** | Allow all, reference sitemap |

---

## 6. Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| **375px** (mobile) | Single column, stacked sections, hamburger nav |
| **768px** (tablet) | 2-column features grid, visible nav |
| **1024px** (desktop) | 3-column features, full nav, side-by-side layouts |
| **1440px** (wide) | Max-width container, centered content |
