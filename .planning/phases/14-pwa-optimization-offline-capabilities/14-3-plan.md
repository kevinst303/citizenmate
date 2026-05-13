---
phase: 14
plan: 3
title: Implement Background Sync
status: completed
type: code
wave: 1
depends_on: [2]
---

# Plan 3: Implement Background Sync

## Objective
Configure Serwist Background Sync API to queue failed quiz completions when offline and auto-retry on network reconnection.

## Requirements
- Use Serwist's Background Sync plugin.
- Queue `POST` and `PUT` requests that fail due to network errors.
- Ensure the offline sync queue is named `quiz-sync-queue` for tracking.
- Test that quiz progress is synced seamlessly upon reconnection.

## Steps
1. Add `BackgroundSyncPlugin` to the relevant runtime caching routes in `src/sw.ts`.
2. Configure the plugin to retry for up to 24 hours.
3. Verify that mutating API requests (quiz completions) use the configured caching route.
4. Add global online/offline status detection in the UI (e.g., using a toast notification) to inform users when they are working offline and that progress is saved.
