# Phase 14: PWA Optimization & Offline Capabilities - Context

**Gathered:** 2026-05-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Enhance the CitizenMate application with Progressive Web App (PWA) capabilities, focusing on offline mode support for quizzes, background synchronization, push notifications, and a custom "Add to Home Screen" install modal using the Conseil design system.
</domain>

<decisions>
## Implementation Decisions

### PWA Engine & Offline Storage
- **PWA Engine:** Use Serwist (`@serwist/next` + `serwist`) as it is already installed and modern.
- **Offline Data Store:** Use IndexedDB via `idb-keyval` (Zustand persist integration) for robust storage.
- **Offline Actions:** Implement Serwist Background Sync API to queue failed requests (e.g., quiz completions, profile updates) when offline and auto-retry on reconnect.

### Push Notifications
- **Web Push API:** Implement Web Push API with VAPID keys.
- **Triggering Strategy:** Store subscriptions in Supabase. Trigger push notifications via Next.js API Routes initially for simplicity and to avoid cold-start issues with Edge Functions, pending further performance evaluation.

### Install Prompt
- **Custom Modal:** Create a custom "Add to Home Screen" modal replacing the browser's default banner.
- **Design:** Use the Conseil design system (glassmorphism, teal/emerald palette).
- **Content:** Explain the value (streak reminders, offline access). Must be multilingual-ready (English & Vietnamese) and mobile-responsive.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Conseil design system tokens (globals.css).
- Existing UI components (e.g., modals, buttons) to be reused for the install prompt.
- Zustand store setup for tracking state (can be extended for install dismissed/installed state).

### Established Patterns
- Service worker is already stubbed/installed via `src/sw.ts`.
- i18n patterns are established and should be used for the new modal.

</code_context>

<specifics>
## Specific Ideas
- Users must be able to study while commuting with poor reception.
- Quiz results must sync to IndexedDB while offline and sync to Supabase when connection restores.
- Push notifications should focus on weekly streak reminders and milestone celebrations.

</specifics>

<deferred>
## Deferred Ideas
- Native app store distribution (explicitly rejected in favor of PWA).
</deferred>
