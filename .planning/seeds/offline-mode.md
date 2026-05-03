---
title: "Offline Mode & PWA Polish"
trigger_condition: "When prioritizing accessibility and user experience in poor network conditions"
planted_date: "2026-05-03"
---

# Offline Mode & PWA Polish

Allow users to study while commuting (e.g., on the train with poor reception) by enhancing the existing `serwist` configuration to fully support offline quiz taking.

This requires syncing quiz results to `localStorage` or IndexedDB while offline, and automatically syncing to Supabase when the connection is restored via a background sync service worker.
