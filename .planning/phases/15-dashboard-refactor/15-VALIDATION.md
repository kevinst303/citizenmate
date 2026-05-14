---
phase: 15
slug: dashboard-refactor
status: validated
nyquist_compliant: true
wave_0_complete: true
created: "2026-05-14"
---

# Phase 15 — Validation Strategy

> Retroactive validation for completed phase. All code shipped and verified.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + Next.js build |
| **Config file** | `citizenmate/tsconfig.json` |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 15-PLAN | 1 | DASH-01 | N/A | N/A | build | `npx tsc --noEmit` | ✅ | ✅ green |
| 15-01-02 | 15-PLAN | 1 | DASH-02 | N/A | N/A | build | `npx tsc --noEmit` | ✅ | ✅ green |
| 15-01-03 | 15-PLAN | 1 | DASH-03 | N/A | N/A | build | `npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing TypeScript + Next.js build infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dashboard renders identically to pre-refactor state | DASH-03 | Visual regression — requires side-by-side comparison | Load dashboard at `/[lang]/dashboard`, verify all sections (readiness ring, topic mastery, quick actions, stats, streak, badges, progression, facts, life-in-australia) render with Conseil styling intact |
| All 5 extracted components have explicit TypeScript interfaces | DASH-02 | Interface inspection | Open `src/components/dashboard/*.tsx`, verify each component exports a named TypeScript interface for its props |
| page.tsx ≤ 150 LOC layout orchestrator | DASH-01 | Manual LOC count | `wc -l src/app/[lang]/dashboard/page.tsx` should be ≤150 |

---

## Validation Sign-Off

- [x] All tasks have automated verify (TypeScript + build)
- [x] Sampling continuity maintained
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-05-14
