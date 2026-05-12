# DHA Terminology Alignment Design

**Date:** 2026-05-12
**Status:** Design (pre-implementation)
**Related Milestone:** Launch Readiness (v1.x)

---

## Objective

Align all CitizenMate i18n terminology across 6 supported languages with the official Department of Home Affairs (DHA) documentation to ensure professional, accurate word usage in all user-facing text.

---

## Source Material

7 DHA markdown documents in `DHA_docs/official-docs-md/`:

| DHA Source File | Target Dictionary | Target Locale |
|---|---|---|
| `[MAIN]our-common-bond-testable.md` | `en.json` + UI + Quiz | English |
| `Spanish.md` | `es.json` + UI + Quiz | Spanish |
| `Arabic.md` | `ar.json` + UI + Quiz | Arabic |
| `Hindi.md` | `hi.json` + UI + Quiz | Hindi |
| `Vietnamese.md` | `vi.json` + UI + Quiz | Vietnamese |
| `Simplified-Chinese.md` | `zh.json` + UI + Quiz | Chinese (Simplified) |
| `Chinese-Traditional.md` | *Reference only for zh.json* | Chinese |

---

## Scope: Three Layers

### Layer 1: Dictionary Keys (Foundation)
- All 6 locale JSON files in `src/i18n/dictionaries/`
- **Key preservation:** Keep existing key names, update **values** only
- Add new keys where DHA content has no current mapping
- This avoids breaking existing references across the codebase

### Layer 2: Quiz Questions & Explanations
- All hardcoded quiz content (questions, answer choices, explanations)
- Quiz content may exist in dictionaries (`quiz.questions.*` keys) or directly in components
- Must match official DHA wording for accuracy

### Layer 3: UI Components
- Visible strings in components (headings, labels, tooltips, buttons, error messages, navigation)
- Any static text rendered to users that references citizenship concepts

---

## Phasing Strategy

7 phases executed sequentially, one per language:

| Phase | Language | Priority | Rationale |
|---|---|---|---|
| **1** | English (en) | Highest | Establishes master terminology baseline |
| **2** | Spanish (es) | High | Largest translated user base |
| **3** | Arabic (ar) | High | RTL layout considerations |
| **4** | Hindi (hi) | Medium | Growing user segment |
| **5** | Vietnamese (vi) | Medium | Significant usage |
| **6** | Chinese (zh) | Medium | Simplified + Traditional reference |
| **7** | Cross-Language Validation | Final | Consistency check across all locales |

---

## Per-Phase Workflow

Each phase follows a consistent 4-step process:

### Step 1: Audit
1. Extract key terminology from DHA source document
2. Compare against current dictionary values
3. Identify discrepancies: terms that differ, are missing, or are outdated
4. Identify quiz/UI components using those terms

### Step 2: Plan
1. Create terminology mapping: Old/Current → DHA-correct term
2. List all affected dictionary keys
3. List all affected UI components and quiz locations
4. Note any structural changes needed (new keys to add)

### Step 3: Execute
1. Update dictionary JSON values (preserve key names)
2. Update quiz strings in dictionaries or components
3. Update UI component strings
4. Remove any deprecated keys if safe (no codebase references)

### Step 4: Verify
1. Run `i18n-validate` or equivalent check for missing/orphaned keys
2. Confirm no dead references (grep for old terms)
3. Verify the build compiles without errors
4. Run the app and spot-check affected screens

---

## Key Design Decisions

1. **Preserve key names, update values** — Avoids breaking hundreds of `useT()` calls across the codebase
2. **English first** — Establishes the authoritative terminology baseline before propagating to translations
3. **One language at a time** — Each phase is independent, reviewable, and reversible
4. **Dictionary-first** — Update JSON files before touching component strings; components should read from dictionaries wherever possible
5. **DHA doc as single source of truth** — If DHA uses "testable section" vs "section", we use "testable section" everywhere

---

## Validation Criteria

| Criterion | Method |
|---|---|
| All dictionary values use DHA-correct terminology | Manual comparison per phase |
| No dead or orphaned keys | `validate-i18n` script or grep |
| Quiz content matches DHA wording | Spot-check per phase |
| UI strings consistent with dictionaries | Visual verification per phase |
| Build compiles without errors | `pnpm build` or `next build` |
| Cross-language consistency | Phase 7 full comparison |
