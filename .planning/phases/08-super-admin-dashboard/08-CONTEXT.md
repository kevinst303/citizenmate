# Phase 08: Super Admin Dashboard - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning
**Source:** User prompt

<domain>
## Phase Boundary

This phase involves planning and building a super admin dashboard to:
- Manage users
- Manage subscriptions and plans
- View insights and analytics
- Manage blog posts

### Refinement Wave (08-04)
Address gaps from VERIFICATION.md and align all UI with Conseil design system:
- Upgrade dashboard to full analytics hub with trend data and charts
- Complete user management CRUD (edit, suspend, delete via modals)
- Pagination on all data tables
- Conseil design system alignment (remove inline styles, emoji icons)
- Confirmation dialogs for destructive actions

</domain>

<decisions>
## Implementation Decisions

### Core Functionality
- **User Management**: Admins can view, edit, suspend, or delete users via modal overlays.
- **Subscription Management**: Admins can view and manage user subscriptions and plans.
- **Analytics & Insights**: Full analytics hub with recharts — KPI trend arrows, sparkline charts, revenue chart, user growth chart, time period selector (7d/30d/90d/all).
- **Blog Management**: Admins can create, edit, delete, and publish blog posts.
- **Pagination**: Server-side or client-side pagination on Users, Blog Posts, and Referral Activity tables.
- **Search/Filter**: Search and filter on Users table (by name, email, role, tier).

### UI/UX
- Use the existing design system (Conseil) — `card-conseil` class instead of inline shadow styles.
- All cards use consistent border `#E9ECEF` via the Conseil design tokens.
- Lucide SVG icons only — **no emoji icons** anywhere in admin UI.
- Sidebar shows active page indicator.
- Confirmation dialogs before destructive actions (delete user, delete blog, suspend).
- Responsive sidebar (collapsible on smaller screens).

### Technical Decisions
- **Charting**: recharts (already in dependencies).
- **User editing**: Modal overlay (not separate page) for faster UX.
- **Confirmation**: Custom lightweight confirmation dialog component.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### General Guidelines
- `src/components/shared/` — Reusable components
- `.planning/ROADMAP.md` — Project roadmap

</canonical_refs>

<specifics>
## Specific Ideas

- Ensure routing is protected and nested under an `/admin` or `/super-admin` route.
- Consider utilizing existing Prisma/Supabase models or expanding them if needed for the blog and insights.

</specifics>

<deferred>
## Deferred Ideas

- None at the moment.
</deferred>

---
*Phase: 08-super-admin-dashboard*
*Context gathered: 2026-05-01*
