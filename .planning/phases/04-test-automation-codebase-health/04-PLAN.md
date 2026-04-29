# Phase 4: Test Automation & Codebase Health - Plan

## Goal
Establish a testing baseline and reduce monolithic technical debt to ensure future feature development is safe and maintainable.

## Strategy
1. **Testing Infrastructure Setup**: Configure `vitest`, `jsdom`, and `@testing-library/react` for the project.
2. **Core Logic Testing**: Write unit tests for the core SRS engine and Readiness calculations. Fix any discovered bugs.
3. **Component Refactoring & Testing**: Extract monolithic UI components (like `ReadinessRing`) into standalone files and write component tests for them.
4. **Data Structure Unification**: Unify scattered category data files into a cohesive structure to be tested properly.

## Tasks
1. Install testing dependencies (`vitest`, etc.)
2. Add global test setup and configurations.
3. Fix the floating-point precision error in `src/lib/__tests__/srs-engine.test.ts`.
4. Extract `ReadinessRing` into `src/components/dashboard/readiness-ring.tsx` and refactor `page.tsx` to use it.
5. Create unit tests for `ReadinessRing` and mock `framer-motion` for jsdom compatibility.
6. Verify all tests pass (`npm test`).
