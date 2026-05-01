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

</domain>

<decisions>
## Implementation Decisions

### Core Functionality
- **User Management**: Admins can view, edit, suspend, or delete users.
- **Subscription Management**: Admins can view and manage user subscriptions and plans.
- **Analytics & Insights**: Implement a dashboard view showing key metrics (active users, revenue, conversion rates, etc.).
- **Blog Management**: Admins can create, edit, delete, and publish blog posts.

### UI/UX
- Use the existing design system (Conseil).
- Ensure the super admin dashboard is protected by robust authentication and authorization checks (e.g., verifying an `isAdmin` flag).

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
