---
phase: 14
plan: 2
title: Configure Serwist
status: completed
type: code
wave: 1
depends_on: [1]
---

# Plan 2: Configure Serwist

## Objective
Update `src/sw.ts` and `next.config.ts` to configure Serwist with aggressive caching for static assets and NetworkFirst/NetworkOnly strategies for dynamic routes.

## Requirements
- Use `@serwist/next` and `@serwist/sw`.
- Precache core assets (fonts, icons, offline fallback page).
- Set up caching strategies:
  - CacheFirst for static assets.
  - NetworkFirst for user profile and dynamic content.
- Ensure the offline fallback page matches the Conseil design system.

## Steps
1. Install `@serwist/next` and `@serwist/sw` if not already installed.
2. Update `next.config.ts` to wrap the Next.js config with `withSerwist`.
3. Create or update `src/sw.ts` with custom runtime caching rules.
4. Implement an offline fallback page (`src/app/~offline/page.tsx`) with glassmorphism design.
5. Create `manifest.json` and standard PWA icons in the `public` directory.
