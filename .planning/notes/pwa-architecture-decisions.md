---
title: "PWA Architecture Decisions"
date: "2026-05-12"
context: "Exploration session — Mobile Optimization: PWA vs native app"
---

# PWA Architecture Decisions

## Core Decision
CitizenMate will use **PWA (Progressive Web App)** rather than native app store distribution. Rationale:
- App store presence is unnecessary overhead for our non-technical user base
- Users struggle with storage space and app store downloads
- PWA delivers native-like experience without the install friction
- Works seamlessly on low-end devices with limited storage

## Technology Choices

| Concern | Choice | Rationale |
|---------|--------|-----------|
| PWA Engine | **Serwist** (`@serwist/next` + `serwist`) | Already installed, modern successor to `next-pwa`, App Router compatible |
| Offline data store | **IndexedDB** via `idb-keyval` (Zustand persist integration) | More storage than localStorage, survives cache evictions |
| Offline actions | **Serwist Background Sync API** | Queue failed requests in IndexedDB, auto-retry on reconnect |
| Push notifications | **Web Push API** + VAPID keys | Store subscriptions in Supabase, trigger via API route or Edge Function |
| Install prompt | **Custom "Add to Home Screen" modal** | Conseil design system, explains value to non-technical users, replaces browser default banner |

## Key Architecture Patterns

1. **Intelligent caching**: Service worker caches static assets (fonts, CSS, JS) aggressively. App router HTML cached with network-first strategy for dynamic pages.
2. **Offline-first reads**: Dashboard, streaks, quiz progress loaded from IndexedDB first, background refresh from Supabase.
3. **Background Sync writes**: Quiz completions, profile updates queued when offline and synced when connection restores.
4. **Push notifications**: Weekly streak reminders, milestone celebrations sent via Supabase-managed VAPID subscriptions.
