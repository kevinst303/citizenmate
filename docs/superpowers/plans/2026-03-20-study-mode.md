# Sub-project 3: Study Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual study experience where users can browse "Our Common Bond" content organized by topic, track mastery per section, and link study material to relevant practice questions.

**Architecture:** Client-side only (same pattern as Sub-project 2). Static JSON content data, localStorage for progress tracking, React Context for study state. 4 new routes under `/study`, reusing existing design system tokens and component patterns.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide React

---

### Task 1: Study Content Data Layer

**Files:**
- Modify: `src/lib/types.ts` — add study types
- Create: `src/data/study-content.ts` — structured content for all 4 topics

- [ ] **Step 1: Add study types to types.ts**

Append to `src/lib/types.ts`:

```ts
// ===== CitizenMate Study Mode Types =====

export interface StudySection {
  id: string;
  title: string;
  titleZh: string; // Simplified Chinese translation
  content: string; // English markdown content
  contentZh: string; // Chinese markdown content
  keyFacts: string[];
  keyFactsZh: string[];
  relatedQuestionIds: string[]; // links to quiz question IDs
}

export interface StudyTopic {
  id: TopicCategory;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  icon: string; // Lucide icon name
  sections: StudySection[];
}

export interface StudyProgress {
  completedSections: Record<string, boolean>; // sectionId -> completed
  lastStudiedAt: string | null; // ISO timestamp
  lastSectionId: string | null;
}
```

- [ ] **Step 2: Create study content data file**

Create `src/data/study-content.ts` with structured content for all 4 topics from "Our Common Bond":

1. **Australia and Its People** (~5 sections): Geography & land, Indigenous culture & history, Immigration & multiculturalism, National symbols & holidays, Key historical events
2. **Democratic Beliefs, Rights & Liberties** (~4 sections): Parliamentary democracy, Freedoms (speech, religion, association, movement), Rule of law & equality, Rights & responsibilities
3. **Government and the Law** (~4 sections): Three levels of government, The Constitution, Federal Parliament (Senate + House), Courts & the High Court
4. **Australian Values** (~4 sections): Respect & equality, Fair go & mateship, Freedom & dignity, Compassion & peacefulness

Each section includes: English content (3-6 paragraphs), Chinese translation, 3-5 key facts, and `relatedQuestionIds` linking to IDs from `questions.ts`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(study): add study content data layer with bilingual content"
```

---

### Task 2: Study Progress Context

**Files:**
- Create: `src/lib/study-context.tsx` — React Context for study progress

- [ ] **Step 1: Create study context provider**

Create `src/lib/study-context.tsx` following the same pattern as `quiz-context.tsx`:

```ts
// State: progress per topic (completedSections map), lastStudied
// Persistence: localStorage key "citizenmate-study-progress"
// Actions:
//   markSectionComplete(sectionId) — toggles section completion
//   getTopicProgress(topicId) — returns { completed, total, percentage }
//   getOverallProgress() — returns { completed, total, percentage }
//   resetProgress() — clears all study progress
// Export: StudyProvider, useStudy hook, getStudyProgress (standalone)
```

Key design decisions:
- Use `useContext` + `useReducer` (same pattern as quiz-context)
- Persist to localStorage on every state change
- Load from localStorage on mount (with SSR guard)
- Export a standalone `getStudyProgress()` for server-safe access

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat(study): add study progress context with localStorage persistence"
```

---

### Task 3: Study Dashboard Page (`/study`)

**Files:**
- Create: `src/app/study/page.tsx` — study dashboard
- Create: `src/app/study/layout.tsx` — metadata

- [ ] **Step 1: Create study layout with metadata**

Create `src/app/study/layout.tsx`:
```tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Study Guide",
  description: "Study the official Our Common Bond content topic by topic. Track your mastery and prepare for the Australian citizenship test.",
};
export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Build study dashboard page**

Create `src/app/study/page.tsx` — "use client" page following the same visual pattern as `/practice/page.tsx`:

**Structure:**
1. **Hero section** — navy gradient background with decorative orbs, heading "Study Our Common Bond", subtext about bilingual study
2. **Overall progress card** — floating card overlapping hero (-mt-8), shows overall completion percentage with progress bar
3. **Topic cards grid** — 2x2 grid (stacks on mobile), one card per topic:
   - Lucide icon (Globe for australia-people, Scale for democratic-beliefs, Landmark for government-law, Heart for australian-values)
   - Topic title
   - Section count (e.g., "5 sections")
   - Progress bar with X/Y sections complete
   - Link to `/study/[topicId]`
4. **Study tips section** — similar to practice page tips

Use Framer Motion: staggered fade-in for cards, animated progress bars.
Use design tokens: `cm-navy`, `cm-ice`, `cm-gold`, `cm-eucalyptus`, `cm-slate-*`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(study): add study dashboard with topic cards and progress tracking"
```

---

### Task 4: Topic Study Page (`/study/[topicId]`)

**Files:**
- Create: `src/app/study/[topicId]/page.tsx` — topic detail view

- [ ] **Step 1: Build topic study page**

Create `src/app/study/[topicId]/page.tsx` — "use client" page:

**Structure:**
1. **Topic header** — Breadcrumb (Study > Topic Name), topic icon + title, progress (X/Y sections), language toggle (EN | 中文 | Both)
2. **Sections list** — Vertical stack of expandable section cards:
   - Section title (bilingual based on language toggle)
   - Completion checkbox
   - Expand to reveal: content paragraphs + key facts sidebar
3. **Key Facts panel** — For each section, a highlighted box with bullet-pointed key facts
4. **Related Questions link** — At bottom of each section: "Practice questions on this topic →" linking to filtered practice
5. **Navigation footer** — "← Previous Topic" / "Next Topic →" buttons

**Language toggle behavior:**
- "EN" — English only
- "中文" — Chinese only  
- "Both" — Side-by-side bilingual view (2-column on desktop, stacked on mobile)

Store language preference in localStorage.

**Route validation:** If `topicId` doesn't match a valid `TopicCategory`, redirect to `/study`.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat(study): add topic study page with bilingual content and section tracking"
```

---

### Task 5: Study Components

**Files:**
- Create: `src/components/study/study-section-card.tsx`
- Create: `src/components/study/language-toggle.tsx`
- Create: `src/components/study/key-facts-panel.tsx`
- Create: `src/components/study/study-progress-bar.tsx`

- [ ] **Step 1: Build StudySectionCard component**

Expandable card with:
- Collapsed: section title, completion status icon (CheckCircle2 green / Circle outline), estimated read time
- Expanded: full content with markdown rendering, key facts panel, related questions link
- Framer Motion: `AnimatePresence` + `motion.div` for smooth expand/collapse
- Completion toggle: clicking the check circle marks section as complete via `useStudy()`

- [ ] **Step 2: Build LanguageToggle component**

Three-option segmented control: EN | 中文 | Both
- Uses shadcn-style pill buttons
- Persists selection to localStorage
- Emits `onLanguageChange` callback

- [ ] **Step 3: Build KeyFactsPanel component**

Highlighted panel (cm-gold-light background, cm-gold left border):
- Lightbulb icon header: "Key Facts"
- Bulleted list of key facts
- Bilingual based on current language setting

- [ ] **Step 4: Build StudyProgressBar component**

Reusable progress bar:
- Props: `completed`, `total`, `label`, `colorClass`
- Animated fill width using Framer Motion
- Shows "X of Y sections" text

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(study): add study UI components (section card, language toggle, key facts, progress)"
```

---

### Task 6: Navigation & Layout Integration

**Files:**
- Modify: `src/components/shared/navbar.tsx` — add "Study" nav link
- Modify: `src/app/layout.tsx` — wrap with StudyProvider
- Modify: `src/components/shared/layout-shell.tsx` — no changes needed (study pages show navbar/footer)

- [ ] **Step 1: Add "Study" link to navbar**

In `navbar.tsx`, add to `navLinks` array after "Practice":
```ts
{ label: "Study", href: "/study" },
```

- [ ] **Step 2: Add StudyProvider to root layout**

In `src/app/layout.tsx`, wrap children with `<StudyProvider>` (inside existing providers).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(study): add Study nav link and StudyProvider to layout"
```

---

### Task 7: Landing Page Study CTA

**Files:**
- Modify: `src/components/landing/features.tsx` — update feature card to link study
- Modify: `src/components/landing/cta-section.tsx` — add secondary study CTA

- [ ] **Step 1: Update features section**

In `features.tsx`, update the "Bilingual Study Mode" feature card to include a "Start Studying →" link to `/study`.

- [ ] **Step 2: Add study mention to CTA section**

In `cta-section.tsx`, add a secondary link: "Or start studying →" below the main CTA button.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(study): add study CTAs to landing page"
```

---

## Verification Plan

### Build Verification
```bash
cd /Volumes/home/Documents/App/AuTest/citizenmate && npm run build
```
Must complete with zero TypeScript errors and zero lint warnings.

### Browser Testing

**Test 1 — Study Dashboard:**
1. Navigate to `http://localhost:3001/study`
2. Verify 4 topic cards render with icons, titles, section counts
3. Verify progress bars show 0% initially
4. Click a topic card → navigates to `/study/[topicId]`

**Test 2 — Topic Study Page:**
1. Verify breadcrumb and topic header render
2. Click language toggle → content switches between EN/中文/Both
3. Expand a section → content and key facts appear with animation
4. Mark a section complete → checkbox fills, progress updates
5. Return to dashboard → progress bar reflects completion

**Test 3 — Navigation:**
1. Verify "Study" link appears in navbar (desktop + mobile)
2. Verify landing page feature card links to `/study`
3. Verify previous/next topic navigation works

**Test 4 — Mobile Responsiveness:**
1. Resize to 375px
2. Verify topic cards stack vertically
3. Verify bilingual "Both" mode stacks content vertically
4. Verify section cards are tappable and expand properly

**Test 5 — Persistence:**
1. Mark 2 sections complete
2. Refresh the page
3. Verify progress is preserved from localStorage
