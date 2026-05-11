---
wave: 1
phase: 7
plan: 07-grow-01
purpose: Verify i18n framework supports 6 locales and passes GROW-01 success criteria
status: ready
depends_on: []
files_modified:
  - src/i18n/config.ts
  - src/i18n/dictionaries/*.json
  - src/i18n/i18n-context.tsx
autonomous: true
requirements: [GROW-01]
---

# Plan 07-GROW-01: i18n Language Pairs Verification

## Goal
Verify the internationalization framework loads correctly for all 6 supported locales (en, es, hi, zh, ar, vi), exceeding the ROADMAP requirement of "4 new language pairs."

## Pre-Flight Checks (Blocking)
- [ ] All 6 JSON dictionary files exist in `src/i18n/dictionaries/` and are non-empty
- [ ] `config.ts` maps all 6 locales to dynamic imports
- [ ] `i18n-context.tsx` properly provides locale switching
- [ ] RTL support confirmed for Arabic (ar)

---

## Task: GROW-01.1 — Audit Dictionary Completeness

<read_first>
- src/i18n/dictionaries/en.json (reference dictionary)
- src/i18n/dictionaries/es.json
- src/i18n/dictionaries/hi.json
- src/i18n/dictionaries/zh.json
- src/i18n/dictionaries/ar.json
- src/i18n/dictionaries/vi.json
- src/i18n/config.ts
</read_first>

<action>
1. Parse `en.json` to extract all top-level keys (this is the canonical key set).
2. For each of the 5 non-English dictionaries (es, hi, zh, ar, vi):
   a. Load the JSON file and extract all top-level keys.
   b. Compare against the en.json canonical key set.
   c. Report: total en keys, total locale keys, missing keys list, extra keys list.
3. Sample-check 5 random keys per dictionary for non-empty translation values (not "", not null, not identical to English key).
4. Write findings to `.planning/phases/07-growth-retention/07-i18n-audit.md`.
</action>

<acceptance_criteria>
- [ ] `grep -c '"' src/i18n/dictionaries/en.json` returns a positive integer (en dictionary has content)
- [ ] `grep -c '"' src/i18n/dictionaries/es.json` returns a positive integer
- [ ] `grep -c '"' src/i18n/dictionaries/hi.json` returns a positive integer  
- [ ] `grep -c '"' src/i18n/dictionaries/zh.json` returns a positive integer
- [ ] `grep -c '"' src/i18n/dictionaries/ar.json` returns a positive integer
- [ ] `grep -c '"' src/i18n/dictionaries/vi.json` returns a positive integer
- [ ] All 6 dictionaries have at least 50 translation keys (functional coverage)
- [ ] No dictionary has more than 10% missing keys compared to en.json
- [ ] `.planning/phases/07-growth-retention/07-i18n-audit.md` exists and contains completeness report
</acceptance_criteria>

---

## Task: GROW-01.2 — Verify RTL Support for Arabic (ar)

<read_first>
- src/i18n/i18n-context.tsx
- src/i18n/config.ts
- src/app/layout.tsx (or root layout where html dir attribute is set)
</read_first>

<action>
1. Read `i18n-context.tsx` — verify the context provider sets `dir="rtl"` on the `<html>` element when locale is `ar`.
2. If no RTL handling exists in the context, check the root layout (`src/app/layout.tsx`) for `dir` attribute logic.
3. Check that the Tailwind/CSS configuration has RTL support (e.g., logical properties, `direction: rtl`).
4. Verify `locales` array in `config.ts` includes `ar`.
5. Document findings (present/missing RTL support) in the audit file.
</action>

<acceptance_criteria>
- [ ] `grep -r "dir.*rtl\|rtl.*dir" src/i18n/ src/app/layout.tsx` finds RTL logic or a clear path exists (e.g., Next.js App Router `html` tag)
- [ ] `grep "'ar'" src/i18n/config.ts` confirms ar is listed in the locales array
- [ ] Audit document records RTL status (present/partial/missing) with specific file references
</acceptance_criteria>

---

## Task: GROW-01.3 — Verify Config Completeness

<read_first>
- src/i18n/config.ts
- src/i18n/dictionaries/ (directory listing)
</read_first>

<action>
1. Confirm `config.ts` exports: `locales` (6-element tuple), `Locale` type, `defaultLocale` ('en'), `getDictionary` function.
2. Verify each locale in the `locales` array has a corresponding dynamic import entry in the `dictionaries` object.
3. Verify `getDictionary` gracefully falls back to `defaultLocale` when an unsupported locale is requested.
4. Confirm the ROADMAP requirement: 4+ new language pairs exist. v1.0 had en; v1.1 adds es, hi, zh, ar, vi = 5 new pairs ✓.
</action>

<acceptance_criteria>
- [ ] `grep "locales =" src/i18n/config.ts` shows all 6 locales: en, es, hi, zh, ar, vi
- [ ] `grep "defaultLocale" src/i18n/config.ts` confirms default is 'en'
- [ ] `grep -c "() => import" src/i18n/config.ts` returns 6 (one import per locale)
- [ ] `grep "dictionaries\[locale\]" src/i18n/config.ts` confirms fallback to default on missing locale
- [ ] 5 new language pairs confirmed (es, hi, zh, ar, vi beyond v1.0 en)
</acceptance_criteria>

---

## Task: GROW-01.4 — Build Check

<read_first>
- package.json (check scripts)
</read_first>

<action>
1. Run `npx next build` (or `npm run build`) to verify all dictionary dynamic imports resolve without TypeScript or webpack errors.
2. Check for any build warnings related to i18n imports.
3. If build succeeds and no i18n-related warnings appear, GROW-01 verification passes.
</action>

<acceptance_criteria>
- [ ] `npm run build` exits with code 0 (or next build succeeds)
- [ ] No build errors reference i18n/dictionary imports
- [ ] Build output does not contain "Cannot find module" for any dictionary file
</acceptance_criteria>

---

## must_haves
1. All 6 language dictionaries load without build errors
2. All 6 locales are registered in config.ts with dynamic imports
3. Arabic (ar) has RTL direction support configured
4. Dictionary coverage is ≥90% of en.json key set for each locale
5. 5 new language pairs confirmed (exceeding ROADMAP requirement of 4)
