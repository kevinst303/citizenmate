# Retrospective

## Milestone: v1.0 — Conseil Design Overhaul

**Shipped:** 2026-04-06
**Phases:** 3 | **Plans:** 7 | **Tasks:** 15
**Timeline:** 14 days (2026-03-23 → 2026-04-06)

### What Was Built

- Solid white 66px fixed navbar with Conseil cubic-bezier scroll transition
- Hero with bg image overlay, star badge, avatar group, white pill CTA, marquee logo strip
- Wave SVG divider, Features 3-col grid with Popular badge, How It Works Conseil split-card
- `.card-conseil` token corrected globally; pricing, FAQ, and shared modals updated
- Quiz flow: QuizCard, QuizProgress, ResultsSummary — all Conseil-compliant with cm-teal
- Study flow: cm-eucalyptus replaced with cm-teal throughout; all study cards, progress, toggle updated
- Dashboard: glass-card-premium replaced with Conseil inline tokens; Recharts palette updated; SubpageHero Poppins headings

### What Worked

- **7 parallel worktree tracks** — running 03-A through 03-G simultaneously shaved significant time. All 7 merged cleanly with zero conflicts.
- **Atomic commits per task** — every task produced its own commit, making rollback trivial and history readable.
- **Global CSS fix strategy** — fixing `.card-conseil` at the globals.css level (03-D) rather than per-component meant all downstream plans (03-E, 03-F, 03-G) inherited the correct 15px radius automatically.
- **Data-driven badge pattern** — Popular badge as a `badge` field in the features data array (not a JSX index check) was cleaner and more extensible.
- **SUMMARY.md frontmatter** — `requirements-completed` lists in frontmatter made the audit fast; integration checker could cross-reference immediately.

### What Was Inefficient

- **conseil-teal token undefined** — SubpageHero used `conseil-teal` instead of `cm-teal`, causing a rendering defect on dashboard and study pages. Caught by audit but should have been caught earlier. Root cause: 03-G modified SubpageHero but didn't audit all its token usages.
- **QUIZ-01/02/03 stale checkboxes** — REQUIREMENTS.md checkboxes were not updated after 03-E completed. Minor but adds noise to audits.
- **No VERIFICATION.md files** — Phase 3 plans executed without per-phase verification artifacts. While SUMMARY.md frontmatter covered requirement tracking, a verification step would have caught the conseil-teal issue sooner.
- **quiz-header.tsx touched by two plans** — 03-D and 03-E both modified quiz-header.tsx. Clean in practice, but required careful ordering note in plans.

### Patterns Established

- **Conseil card inline pattern:** `bg-white border border-[#E9ECEF] rounded-[15px]` + inline `boxShadow` dual-layer
- **Button vs card radius:** buttons always `rounded-[10px]`, cards always `rounded-[15px]`
- **cm-teal as the Conseil accent:** replaces cm-navy and cm-eucalyptus everywhere user interaction is highlighted
- **Footer architecture:** `<footer>` full-width for bg, inner `<div>` gets `max-w-[1140px]` constraint
- **Recharts palette:** `COLORS = ['#006d77', '#3d348b', '#00a3ad', '#6b61c4', '#005a61']`

### Key Lessons

1. **Audit token names against globals.css before shipping** — "conseil-teal" vs "cm-teal" was a one-character typo that produced a transparent hero band on two pages.
2. **When a plan modifies a shared component, check all its token usages** — not just the targeted lines.
3. **Parallel tracks work well for design-only changes** — no shared state, no API coordination, pure CSS/TSX changes per component group.
4. **Global CSS fixes over per-component fixes** — one globals.css correction propagates automatically; 20 per-file edits create drift risk.

### Cost Observations

- Model mix: balanced profile throughout
- Sessions: ~8 sessions across 14 days
- Notable: parallel worktree execution dramatically reduced wall-clock time for Phase 3

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Duration | Key Pattern |
|-----------|--------|-------|----------|-------------|
| v1.0 Conseil Design Overhaul | 3 | 7 | 14 days | Parallel worktree tracks for independent component groups |
