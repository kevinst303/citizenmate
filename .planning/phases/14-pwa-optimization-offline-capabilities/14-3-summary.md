# Plan 3 Summary: Implement Background Sync

**Status:** ✅ Complete
**Completed:** 2026-05-13

## Deliverables
- **Service Worker Sync**: `BackgroundSyncPlugin` configured in `src/sw.ts` for `quizQueue` with 24-hour max retention
- **Sync API Route**: Created `src/app/api/sync/route.ts` supporting:
  - `quiz-history` sync type — batch inserts quiz attempts to Supabase with deduplication by `completed_at`
  - `srs-data` sync type — upserts SRS performance data keyed by `user_id`
  - Authentication via Bearer token (extracted from Authorization header, validated via `supabase.auth.getUser`)
  - Deduplication logic to prevent double-counting offline quiz attempts
- **Connectivity UI**:
  - `use-online-status.ts` hook for reactive online/offline detection
  - `ConnectivityStatus` component for toast notifications on network change
  - `OnlineStatusIndicator` component for persistent online/offline indicator
- **PWA Install Infrastructure**:
  - `PwaInstallProvider` — intercepts `beforeinstallprompt` and `appinstalled` events
  - `InstallPrompt` — custom install modal with Conseil design system
  - Zustand `usePwaStore` tracks: `isInstallable`, `isInstalled`, `hasDismissedModal`, `isOffline`

## Verification
- ✅ BackgroundSyncPlugin configured for API sync POST requests
- ✅ Sync API route handles quiz-history and srs-data types
- ✅ Deduplication by completed_at prevents duplicate offline entries
- ✅ Connectivity UI components render online/offline status
- ✅ PWA install provider + modal fully wired
- ✅ Build passes with zero errors
