# Phase 10: Calm UX & Interface Modernization

## 1. Goal
Reduce cognitive load through progressive disclosure, purposeful micro-interactions, and refined dark mode to create a calmer study environment.

## 2. Requirements
- UX-01: Calm UX & Interface Modernization

## 3. Context
- Currently, onboarding and settings flows show all options simultaneously, which increases cognitive load.
- Framer Motion is active but needs accessibility toggles and more subtle, haptic-like animations for correct answers.

## 4. Implementation Steps
- [ ] 01. Refactor onboarding flow `src/app/dashboard/onboarding` to use progressive disclosure (hide advanced settings).
- [ ] 02. Implement `useReducedMotion` support for all Framer Motion `motion.div` elements.
- [ ] 03. Update global settings state (Zustand/Context) to include a `reduceMotion` user toggle.
- [ ] 04. Refine dark mode contrast for primary (`#006d77`) and secondary (`#3d348b`) colors in `src/app/globals.css` to reduce eye strain.
