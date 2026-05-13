---
title: "Refactor Dashboard Monolith"
date: "2026-05-03"
priority: "high"
phase: 15
source: ".planning/todos/pending/refactor-dashboard-monolith.md"
---

# Refactor Dashboard Monolith

The `src/app/dashboard/page.tsx` is currently handling too many responsibilities (readiness score calculation, quiz history, topic mastery, widgets). This makes it risky to change and hard to maintain.

**Task:**
Extract the dashboard sections into smaller, focused server/client components (e.g., `ReadinessPanel`, `QuizHistorySection`, `TopicGrid`) to improve maintainability without altering existing functionality.

**Linked to:** Phase 15 (Dashboard Refactor) — DASH-01, DASH-02, DASH-03
