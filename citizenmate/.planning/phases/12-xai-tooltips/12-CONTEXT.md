# Phase 12: Explainable AI (XAI) Tooltips — Context

**Gathered:** 2026-05-12
**Status:** Ready for planning
**Mode:** Smart discuss (user accepted all proposals)

<domain>
## Phase Boundary

Add SRS algorithm explanation tooltips and trust-building UI to help users understand why the AI recommends specific study intervals.

**Requirements:** XAI-01, XAI-02
**Depends on:** Phase 11 (Progression System)

</domain>

<decisions>
## Implementation Decisions

### 1. XAI Approach
Point-of-action tooltip triggers (ℹ icons) that explain SRS intervals in plain language. Tooltips are non-blocking and don't interrupt the study flow.

### 2. Location
Quiz review page (`[lang]/quiz/review`) — on the "Review Now / Later" buttons and the interval indicator. This is where SRS decisions are made.

### 3. Content to Explain
1. Why this interval was chosen
2. How confidence affects spacing
3. What happens if you review early/late

### 4. Visual Style
Glassmorphism tooltip popover matching Conseil design system — dark glass (`bg-white/5 backdrop-blur-xl`). Consistent with existing dashboard gamification UI.

### 5. Content Source
Static copy with i18n support for en/vi/es. SRS algorithms are deterministic, so no AI-generated explanations needed.

### 6. Animation
Fade-in + subtle slide-up on hover/focus using Framer Motion — matches existing `ProgressionCard` animation patterns.

### 7. i18n Scope
Add translation keys for ~5 explanation strings in all 3 locales (en, vi, es).

</decisions>

<code_context>
## Existing Code Insights

- Quiz review page exists at `src/app/[lang]/quiz/review/page.tsx`
- i18n system uses JSON files in `src/locales/{en,vi,es}/common.json`
- Framer Motion is already a dependency (used in ProgressionCard)
- Conseil design system is the project's design language (glassmorphism, dark theme)

</code_context>

<specifics>
## Specific Ideas

- Create a reusable `XaiTooltip` component with tooltip trigger icon
- Hook into existing quiz review UI to add info icons next to SRS interval decisions
- Use the pattern from `ProgressionCard` for glassmorphism styling
- Translations key naming: `xai.interval.explanation`, `xai.confidence.explanation`, `xai.early_review`, `xai.late_review`, `xai.how_it_works`

</specifics>

<deferred>
## Deferred Ideas

- Gamification XP reward for reading tooltips (future)
- AI-personalized explanations based on user history (future)
- Analytics tracking on tooltip open rate (future)

</deferred>
