# v1.3 Requirements

## DASH — Dashboard Refactor

- [ ] **DASH-01**: Extract dashboard page.tsx monolith into modular components (ReadinessPanel, TopicMasteryGrid, QuickActions, StatsSummary, TestDateCard)
- [ ] **DASH-02**: All extracted components use Conseil design tokens with proper TypeScript types
- [ ] **DASH-03**: Dashboard page loads and renders identically to pre-refactor state

## PWA — PWA Install Modal

- [ ] **PWA-01**: Implement custom Conseil-styled PWA install modal with animations
- [ ] **PWA-02**: Add Zustand store for install modal dismissal tracking with localStorage persistence
- [ ] **PWA-03**: Add i18n support (en/vi/es/hi/zh/ar) for install modal copy

## BLOG — Admin Blog Cleanup

- [ ] **BLOG-01**: Replace all hardcoded hex values in Admin/Blog with Conseil CSS variables
- [ ] **BLOG-02**: Verify visual consistency — all blog admin pages render identically post-migration

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| DASH-01 | 15. Dashboard Refactor | Not Started |
| DASH-02 | 15. Dashboard Refactor | Not Started |
| DASH-03 | 15. Dashboard Refactor | Not Started |
| PWA-01 | 16. PWA Install Modal | Not Started |
| PWA-02 | 16. PWA Install Modal | Not Started |
| PWA-03 | 16. PWA Install Modal | Not Started |
| BLOG-01 | 17. Admin Blog Cleanup | Not Started |
| BLOG-02 | 17. Admin Blog Cleanup | Not Started |
