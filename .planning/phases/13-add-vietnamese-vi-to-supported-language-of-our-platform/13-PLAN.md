# Phase 13: Add Vietnamese (Vi) to supported language of our platform - Plan

## Approach
1. **Add `vi` to the supported locales array in `src/i18n/config.ts`** and map it to `dictionaries/vi.json`.
2. **Add Vietnamese to the `LANGUAGES` object in `src/components/shared/language-switcher.tsx`**.

## Steps
1. Modify `src/i18n/config.ts`
   - Update `locales` array to include `'vi'`.
   - Update `dictionaries` object to include `vi: () => import("./dictionaries/vi.json").then((module) => module.default)`.
2. Modify `src/components/shared/language-switcher.tsx`
   - Add `vi: { label: "Vietnamese", native: "Tiếng Việt" }` to the `LANGUAGES` object.

## Verification
- Run `npm run build` to ensure no TypeScript or build errors.
- Ensure the language switcher correctly renders "Tiếng Việt" in the UI.
