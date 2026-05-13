---
title: "Design the custom 'Add to Home Screen' modal"
date: "2026-05-12"
priority: "medium"
phase: 16
source: ".planning/todos/pending/design-install-modal.md"
---

# Design Custom PWA Install Modal

**Context:** Native browser "Add to Home Screen" prompt is easily missed by non-technical users. We need a custom modal matching the Conseil design system.

**Requirements:**
- Uses Conseil design system styling (glassmorphism, teal/emerald palette)
- Explains *why* users should install (streak reminders, offline access)
- Works for both `beforeinstallprompt` and already-installed states
- Multilingual-ready (Vietnamese + English, following existing i18n patterns)
- Responsive for mobile-first display
- Clear call to action, easy to dismiss

**References:**
- Existing Conseil design tokens in the codebase
- Zustand store for tracking dismissed/installed state

**Linked to:** Phase 16 (PWA Install Modal) — PWA-01, PWA-02, PWA-03
