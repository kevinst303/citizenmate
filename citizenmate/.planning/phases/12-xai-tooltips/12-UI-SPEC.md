# UI-SPEC: Phase 12 — Explainable AI (XAI) Tooltips

**Status:** Approved ✓
**Target:** Quiz results page (`/practice/[testId]/results`),
Smart practice session page (`/practice/smart/session`)
**Components affected:** `QuestionReview`, `ResultsSummary`
**Reusable component:** `XaiTooltip` (exists at `src/components/shared/xai-tooltip.tsx`)

---

## 1. Design System & Stack

| Token | Value |
|-------|-------|
| **Component** | `XaiTooltip` — existing reusable component |
| **Trigger icon** | `Info` from lucide-react (`w-3.5 h-3.5`) |
| **Tooltip container** | `bg-white/5 backdrop-blur-xl border border-white/10` (dark glass) |
| **Text** | `text-xs text-white/90` |
| **Max width** | `max-w-[260px]` (sm), `max-w-xs` (md) |
| **Position** | Configurable: top (default), bottom, left, right |
| **Animation** | `Framer Motion` fade-in + slide-up (4px offset), 150ms ease-out |
| **Trigger** | Hover (desktop) + click (mobile) |
| **Dismiss** | Click outside or Escape key |
| **Icon default** | `text-purple-400/70`, hover → `text-purple-300` |
| **Icon active** | `text-purple-300` |

## 2. Integration Point A: QuestionReview Rationale Section

**File:** `src/components/quiz/question-review.tsx`

**Change:** Add `XaiTooltip` after the reference line explaining how SRS confidence affects review intervals.

**Placement:** After the book reference `<p>` tag (around line 130), inline on the same line.

**Content key:** `xai.confidence_explanation`

**Visual layout:**
```
┌──────────────────────────────────────┐
│ 📖 EXPLANATION                       │
│ {rationale text explaining answer}   │
│ Reference: {book}  ℹ️                │
└──────────────────────────────────────┘
```

## 3. Integration Point B: ResultsSummary Time Used Card

**File:** `src/components/quiz/results-summary.tsx`

**Change:** Add `XaiTooltip` next to the "Time Used" label text to explain the test timing.

**Placement:** After the label "Time Used" text (around line 268), centered in the card.

**Content key:** `xai.interval_explanation`

**Visual layout:**
```
┌──────────────────────┐
│       ⏰             │
│   Time Used ℹ️       │
│      5m 32s          │
│  of 45 minutes       │
└──────────────────────┘
```

## 4. Integration Point C: ResultsSummary AI Recommendation Card

**File:** `src/components/quiz/results-summary.tsx`

**Change:** Add `XaiTooltip` next to the "AI Recommendation" label to explain how the recommendation is generated.

**Placement:** After the "AI Recommendation" uppercase label (around line 399).

**Content key:** `xai.how_srs_works`

**Visual layout:**
```
┌──────────────────────────────────────┐
│ ✦ AI RECOMMENDATION ℹ️               │
│ 🎉 You're Test-Ready!               │
│ Great result! You passed...          │
│ [Practice Again →]                   │
└──────────────────────────────────────┘
```

## 5. Mobile Adaptations

| Concern | Solution |
|---------|----------|
| Tooltip clipped by viewport | Component uses absolute positioning relative to trigger |
| Touch not hover | Component handles both `onMouseEnter` (hover) and `onClick` (touch) |
| Narrow card width | Use `size="sm"` with `max-w-[260px]` for all placements |
| Overlapping tooltips | Only one tooltip per card, no risk of overlap |

## 6. Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Keyboard trigger | `button` element with `onClick` — focusable by default |
| Screen reader | `aria-label="Learn more about SRS spacing"` already present |
| ARIA expanded | `aria-expanded={isOpen}` already present |
| Dismiss | Escape key handler already present |
| Color contrast | Icon `text-purple-400/70` on white/bg — sufficient contrast |
| Text size | `text-xs` (12px) in tooltip body |

## 7. i18n Key Mapping

All keys already exist in `en.json`, `vi.json`, `es.json` (95+ character descriptions):

| Key | Used In |
|-----|---------|
| `xai.interval_explanation` | ResultsSummary Time Used card |
| `xai.confidence_explanation` | QuestionReview rationale |
| `xai.how_srs_works` | ResultsSummary AI Recommendation card |
| `xai.early_review` | Future use |
| `xai.late_review` | Future use |

## 8. Interaction States

| State | Visual |
|-------|--------|
| Default (closed) | `ℹ` icon in `text-purple-400/70` |
| Hover | Icon changes to `text-purple-300` |
| Open (tooltip visible) | Icon in `text-purple-300`, tooltip fades in with slide-up |
| Dismiss | Tooltip fades out with slide-down |

## 9. Non-Goals (Explicitly Out of Scope)

- ❌ Creating new `XaiTooltip` variants or themes
- ❌ Changing the smart practice session (already has tooltips)
- ❌ SRS interval visualization or timeline charts
- ❌ Gamification XP rewards for reading tooltips (deferred)
- ❌ Analytics tracking on tooltip open rate (deferred)
- ❌ Personalised AI explanations based on user history (deferred)
