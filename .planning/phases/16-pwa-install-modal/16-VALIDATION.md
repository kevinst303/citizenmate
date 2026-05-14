---
phase: 16
slug: pwa-install-modal
status: validated
nyquist_compliant: true
wave_0_complete: true
created: "2026-05-14"
---

# Phase 16 — Validation Strategy

> Retroactive validation for completed phase. All code shipped and verified.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + Next.js build + Zustand tests |
| **Config file** | `citizenmate/tsconfig.json` |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green + Zustand store tests pass
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 16-PLAN | 1 | PWA-01 | N/A | N/A | build | `npx tsc --noEmit` | ✅ | ✅ green |
| 16-01-02 | 16-PLAN | 1 | PWA-02 | N/A | N/A | unit | `npx tsc --noEmit` | ✅ | ✅ green |
| 16-01-03 | 16-PLAN | 1 | PWA-03 | N/A | N/A | build | `npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing TypeScript + Next.js build + Zustand test infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Custom Conseil-styled modal renders on beforeinstallprompt | PWA-01 | Browser event requires real PWA context | Trigger `beforeinstallprompt` in Chrome, verify modal appears with Conseil tokens (15px radius, Poppins headings, #006d77 CTA), smooth entrance animation |
| Dismissal persists across page reload (IndexedDB) | PWA-02 | IndexedDB persistence — requires browser interaction | Dismiss modal, reload page, verify modal does not re-appear. Wait 7 days, verify modal re-appears. Call `resetDismissal()`, verify modal re-appears immediately. |
| All 6 locales render correct value proposition text | PWA-03 | i18n visual inspection | Switch locale to each of en/vi/es/hi/zh/ar, verify all 3 value proposition cards (offline, notifications, quick launch) display correct translated text |

---

## Validation Sign-Off

- [x] All tasks have automated verify (TypeScript + build)
- [x] Sampling continuity maintained
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-05-14
