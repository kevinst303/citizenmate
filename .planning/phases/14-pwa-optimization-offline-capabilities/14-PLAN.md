# Phase 14: PWA Optimization & Offline Capabilities - Execution Plan

**Goal:** Enhance the CitizenMate application with Progressive Web App (PWA) capabilities, focusing on offline mode support, background synchronization, push notifications, and a custom "Add to Home Screen" install modal.

## Wave 1: PWA Infrastructure & Offline Storage
| Step | Task | Details | Type | Depends On |
|------|------|---------|------|------------|
| 1 | Setup IndexedDB Storage | Implement `idb-keyval` integrated with Zustand to persist quiz state and profile data for offline access. | code | None |
| 2 | Configure Serwist | Update `src/sw.ts` and `next.config.ts` to configure Serwist with aggressive caching for static assets and NetworkFirst/NetworkOnly strategies for dynamic routes. | code | 1 |
| 3 | Implement Background Sync | Configure Serwist Background Sync API to queue failed quiz completions when offline and auto-retry on network reconnection. | code | 2 |

## Wave 2: Push Notifications & Subscriptions
| Step | Task | Details | Type | Depends On |
|------|------|---------|------|------------|
| 4 | Notification DB Schema | Create a Supabase migration to add a `push_subscriptions` table for storing user endpoint and auth keys. | db | None |
| 5 | Subscribe API Route | Create `src/app/api/notifications/subscribe/route.ts` to securely save push subscriptions to Supabase. | code | 4 |
| 6 | Send Notification API | Create `src/app/api/notifications/send/route.ts` utilizing VAPID keys to trigger Web Push notifications (e.g., streak reminders). | code | 5 |

## Wave 3: Custom Install Modal & Integration
| Step | Task | Details | Type | Depends On |
|------|------|---------|------|------------|
| 7 | Global PWA Store | Implement a Zustand store to track PWA install state (dismissed, installed) and intercept the `beforeinstallprompt` event. | code | None |
| 8 | Build Install Modal | Create `PwaInstallModal` component using Conseil design system (glassmorphism, teal/emerald). Add i18n support and clear value props (offline mode, streak reminders). | code | 7 |
| 9 | Global Integration & Verify | Integrate the install modal into the global layout. Verify offline quiz taking, background sync, and push notification delivery. | verify | All |
