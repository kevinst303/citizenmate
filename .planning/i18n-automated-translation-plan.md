---
type: i18n-translation-plan
audit_date: "2026-05-06"
status: draft
author: GSD Automated Audit
---

# i18n Automated Translation — Audit & Plan

## 1. Current State Audit

### 1.1 Architecture

| Component | File | Status |
|-----------|------|--------|
| Locale config | `src/i18n/config.ts` (15 lines) | ✅ 5 locales: en, es, hi, zh, ar |
| Client provider | `src/i18n/i18n-context.tsx` (88 lines) | ✅ I18nProvider + useT() hook |
| Dictionary loader | Dynamic import `./dictionaries/{locale}.json` | ✅ Per-locale code splitting |
| English dictionary | `src/i18n/dictionaries/en.json` | ✅ 303 lines, 289 keys, 10 sections |
| Middleware | `src/middleware.ts` | ✅ Locale detection + redirect |
| Language switcher | `src/components/shared/language-switcher.tsx` | ✅ Globe dropdown, 5 languages |

### 1.2 Dictionary Status

| Language | File | Lines | Keys | Status |
|----------|------|-------|------|--------|
| English (source) | en.json | 303 | ~170 | ✅ Complete |
| Spanish | es.json | 213 | ~120 | ⚠️ Missing landing section (85 keys) |
| Arabic | ar.json | 213 | ~120 | ⚠️ Missing landing section (85 keys) |
| Hindi | hi.json | 213 | ~120 | ⚠️ Missing landing section (85 keys) |
| Chinese | zh.json | 213 | ~120 | ⚠️ Missing landing section (85 keys) |

**Gap**: All 4 non-English dictionaries were translated for the pre-landing sections (navigation, dashboard, onboarding, upgrade, smart_practice, user_menu, practice, results, premium, referral, common) but the new `landing` section (85 keys added in Session 7) has NOT been translated — meaning the landing page shows English for non-English users.

### 1.3 Component Wiring Status

| Status | Count | Files |
|--------|-------|-------|
| ✅ Wired with useT() | 17 | navbar, onboarding, upgrade-modal, smart-practice, smart-practice/session, dashboard, user-menu, premium-gate, practice listing, results-summary, language-switcher, hero, features, how-it-works, cta-section, pricing-preview, footer |
| ❌ Not yet wired | 20 | practice quiz session, study pages, about, blog, terms, privacy, cookies, offline, checkout success/cancel, admin pages, error pages |

**Key unwired pages**: The actual quiz-taking page (`practice/[testId]/page.tsx`) has hardcoded English — highly visible during the core product experience.

### 1.4 Translation Method

- **Current**: Manual — JSON files hand-written by task agents per session
- **Sync mechanism**: None — dictionaries are static files, no auto-sync
- **Translation quality**: AI-generated (Claude task agents), reviewed by no one
- **Missing key prevention**: None — if a key exists in en.json but not in ar.json, `useT()` falls back to English gracefully

---

## 2. Problem Statement

1. **Dictionaries drift out of sync** every time new keys are added to en.json
2. **Manual translation is slow and expensive** — 4 languages × 85 keys = 340 translations needed just for the landing section
3. **No CI/CD integration** — no automated check that all dictionaries have all keys
4. **No quality assurance** — translations are AI-generated with zero human review
5. **Scalability ceiling** — adding a 6th language means 300+ new translations

---

## 3. Translation API Comparison

### 3.1 Options Evaluated

| Criteria | DeepL API | Claude/GPT API | i18nexus | Crowdin | Better i18n |
|----------|-----------|----------------|----------|---------|-------------|
| Translation quality | ★★★★★ (gold standard) | ★★★★ (context-aware) | ★★★★ (OpenAI) | ★★★ (MT + human) | ★★★★ (AI + human) |
| Security/GDPR | ★★★★★ (text deleted after translation, SOC 2, ISO 27001) | ★★★ (depends on provider policy) | ★★★ (data goes through OpenAI) | ★★★★ (enterprise-grade) | ★★★★ (SOC 2) |
| Cost | Pay per character (~$0.00002/char) | Pay per token (~$0.01/1K tokens) | Free tier + paid | Per-seat + word count | Free tier + usage-based |
| Developer DX | ★★★★ (REST API, client libs) | ★★★★ (SDK, prompt-based) | ★★★★★ (CLI: pull, listen, push) | ★★★ (web UI + CLI) | ★★★★★ (GitHub-native, CLI) |
| JSON/bulk support | ★★★ (text API, 50 texts per call) | ★★★★★ (can translate entire JSON in one prompt) | ★★★★★ (designed for it) | ★★★★ (file-based) | ★★★★★ (auto-detects) |
| Australian English nuance | ★★ (generic MT) | ★★★★ (promptable for slang) | ★★★ | ★★ | ★★★ |
| Setup complexity | Low | Low | Medium (account + CLI) | High | Low |

### 3.2 Recommendation: DeepL API + Build Script

**Why DeepL as primary:**
- GDPR/SOC 2 compliant — critical for an Australian government-related app
- Text is deleted from DeepL servers immediately after translation
- Best non-English translation quality in the industry
- Simple REST API with `deepl-node` client library
- 500,000 chars/month free tier
- 50 texts per API call for bulk translation
- Native formality support (formal/informal tone)
- Glossaries for domain-specific terms ("Sprint Pass", "CitizenMate")

**Why NOT the alternatives:**
- **i18nexus**: Adds a third-party dependency to your rendering path; designed for next-intl/i18next (not custom systems); data goes through OpenAI
- **Crowdin/Lokalise**: Enterprise-scale tools that are overkill for a solo dev; require human translators; per-seat pricing
- **Claude/GPT direct**: More expensive per translation; text may be retained for training (unless using API with opt-out); not purpose-built for translation
- **Better i18n**: Very new (2025), ecosystem not mature yet; data goes through OpenAI

---

## 4. Implementation Plan

### 4.1 Phase A: Build-Time Translation Script (P0 — 2 hours)

Create `scripts/translate.ts` — a standalone Node.js script that:

1. Reads `en.json` as the source of truth
2. For each target language (es, hi, zh, ar):
   - Reads existing dictionary to preserve human-reviewed translations
   - Identifies NEW keys (in en.json but not in target)
   - Batches 50 keys at a time (DeepL limit)
   - Calls DeepL `/v2/translate` API
   - Merges new translations into existing dictionary
   - Writes updated file
3. Preserves interpolation tokens (`{variable}`) by substituting before translation and restoring after
4. Logs a diff of what was translated

```typescript
// scripts/translate.ts (pseudocode)
import * as deepl from 'deepl-node';
import en from '../src/i18n/dictionaries/en.json';

const DEEPL_TARGETS = {
  es: 'ES', hi: 'HI', zh: 'ZH', ar: 'AR'
};

async function translateSection(enDict, targetLang, existingDict) {
  const newKeys = findMissingKeys(enDict, existingDict);
  const texts = extractTranslationTexts(newKeys);
  const translated = await deepl.translateText(texts, null, targetLang);
  return mergeIntoExisting(translated, existingDict, newKeys);
}
```

**npm scripts added:**
```json
{
  "translate": "tsx scripts/translate.ts",
  "translate:check": "tsx scripts/translate.ts --check-only",
  "translate:diff": "tsx scripts/translate.ts --diff"
}
```

**Security measures:**
- DeepL API key stored in `.env.local` (never committed)
- Script is run locally/dev only, NOT in CI/CD by default
- `translate:check` can run in CI to detect drift without calling API
- Interpolation tokens (`{variable}`) protected from translation

### 4.2 Phase B: Dictionary Sync Validation (P1 — 1 hour)

Create `scripts/validate-i18n.ts` — validates dictionary integrity:

1. All target dictionaries have the same top-level sections as en.json
2. All target dictionaries have every key that en.json has
3. No target dictionary has keys NOT in en.json (orphaned keys)
4. All interpolation tokens match between source and target
5. Reports drift percentage per language

**npm scripts:**
```json
{
  "validate-i18n": "tsx scripts/validate-i18n.ts",
  "prebuild": "npm run validate-i18n -- --warn-only"
}
```

### 4.3 Phase C: Wire Remaining 20 Components (P1 — 3 hours)

Priority order:
1. **`practice/[testId]/page.tsx`** — Quiz session page (core UX, high visibility)
2. **`practice/[testId]/results/page.tsx`** — Quiz results (linked from results-summary)
3. **`study/page.tsx`** + **`study/[topicId]/page.tsx`** — Study material pages
4. **`about/page.tsx`** — About page
5. **`checkout/success/page.tsx`** + **`checkout/cancel/page.tsx`** — Post-purchase
6. **`terms/page.tsx`** + **`privacy/page.tsx`** + **`cookies/page.tsx`** — Legal pages
7. **`blog/*`** — Blog pages (lower traffic)
8. **Admin pages** — Internal only, lowest priority

### 4.4 Phase D: DeepL Glossary for Domain Terms (P2 — 30 min)

Create a DeepL glossary for terms that should NOT be translated or need specific translations:
- "CitizenMate" → keep as-is in all languages
- "Sprint Pass" → "Pase Sprint" (es), "冲刺通行证" (zh), etc.
- "AI" → keep as-is
- "mate" → use colloquial equivalent per language

### 4.5 Cost Estimate

| Item | Cost |
|------|------|
| DeepL API (289 keys × 4 languages × ~20 chars avg) | ~$0.50 USD one-time |
| Ongoing (10 new keys × 4 languages per update) | ~$0.02 per update |
| DeepL free tier | 500,000 chars/month free |

**Total cost: Under $1/month for automated translation.**

---

## 5. Performance & Security Analysis

### 5.1 Performance Impact: ZERO

- Dictionaries are static JSON files imported at build time
- Translation script runs as a dev tool, not at runtime
- `validate-i18n` in CI runs in <200ms (simple JSON comparison)
- No external API calls at runtime — dictionaries are bundled into the app
- Current dynamic imports with per-locale code splitting already optimal

### 5.2 Security Considerations

| Concern | Mitigation |
|---------|------------|
| DeepL API key exposure | Stored in `.env.local`, never committed; `.gitignore` already covers it |
| User data leaked to DeepL | **Zero risk** — only static dictionary text is sent, never user data or PII |
| Translation injection attacks | DeepL escapes HTML entities; interpolation tokens protected by pre-substitution |
| API key compromise | DeepL allows key rotation; usage limits prevent cost explosion |
| Third-party dependency risk | `deepl-node` package auditable; can fall back to raw REST API if needed |

### 5.3 Resilience

- If DeepL API is down: `translate` script fails gracefully with error message; does NOT corrupt existing dictionaries
- If a key is missing in target language: `useT()` falls back to `fallback ?? key`, showing English
- Translation script is idempotent — running it twice produces the same result
- `validate-i18n --warn-only` in prebuild ensures builds never fail on i18n drift

---

## 6. Comparison: Current vs Proposed

| Dimension | Current | Proposed |
|-----------|---------|-----------|
| Translation speed | Hours (manual per session) | Minutes (automated) |
| Sync detection | Manual (human notices drift) | Automated (`validate-i18n`) |
| Adding new keys | Manually translate 4 languages | `npm run translate` → done in 30s |
| Adding new language | Full manual translation | Add to config → run script |
| Consistency | AI agents vary per session | DeepL model is deterministic |
| Cost | Time + Claude API tokens | ~$0.50 total, $0.02/update |
| Human review | None | Optional: extract diff for review |
| Australian slang | Hit-or-miss per agent | Glossary ensures consistency |

---

## 7. Execution Order

| Step | Task | Effort | Priority | Depends on |
|------|------|--------|----------|------------|
| 1 | Install `deepl-node` + `tsx` | 5 min | P0 | — |
| 2 | Create `scripts/translate.ts` | 90 min | P0 | Step 1 |
| 3 | Create `scripts/validate-i18n.ts` | 60 min | P1 | Step 2 |
| 4 | Add npm scripts + prebuild hook | 10 min | P1 | Step 3 |
| 5 | Run initial translation for landing section | 5 min | P0 | Step 2 |
| 6 | Wire useT() into practice quiz session page | 45 min | P1 | — |
| 7 | Wire useT() into study pages | 30 min | P2 | — |
| 8 | Wire useT() into blog/about/legal pages | 45 min | P2 | — |
| 9 | Create DeepL glossary | 15 min | P2 | Step 2 |
| 10 | Update en.json for remaining unwired pages | 30 min | P2 | Steps 6-8 |
| 11 | Commit + push + Vercel deploy | 5 min | P0 | Steps 2-5 |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| DeepL mistranslates Australian slang | Medium | Low | Glossary locks terms; `mate` → `amigo`/`दोस्त`/`朋友`/`صديقي` verified per language |
| Translation quality varies by language pair | Medium | Medium | EN→ES (high quality), EN→AR (good), EN→HI/ZH (adequate); review first 10 keys per language |
| `{variable}` interpolation tokens corrupted | Low | High | Pre-substitution with UUID placeholders before translation, restore after |
| Script accidentally overrides human-reviewed translations | Low | High | Script only writes NEW keys; existing translations preserved via merge |
| Dependency on `deepl-node` package | Low | Low | Package is well-maintained (DeepL official); can fall back to REST API |
