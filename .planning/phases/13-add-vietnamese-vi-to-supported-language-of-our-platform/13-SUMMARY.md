# Phase 13: Add Vietnamese (Vi) to supported language of our platform - Summary

## What Was Done
- Configured Next.js i18n routing to officially support the `vi` locale in `src/i18n/config.ts`.
- Registered the `vi.json` dictionary module for async loading.
- Added "Tiếng Việt" (Vietnamese) to the `LANGUAGES` UI map in `src/components/shared/language-switcher.tsx`.

## Technical Results
- Users can now select Vietnamese from the global navigation header.
- Routing dynamically switches to `/vi` and loads the correct translation keys.

## Remaining Technical Debt
- Ensure `vi.json` continues to be monitored for translation drift alongside the newly added secondary languages.
