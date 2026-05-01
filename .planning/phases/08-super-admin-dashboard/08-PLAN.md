---
wave: 1
depends_on: []
files_modified:
  - supabase/migrations/20260501000000_super_admin.sql
  - src/middleware.ts
  - src/app/[lang]/admin/layout.tsx
  - src/app/[lang]/admin/page.tsx
  - src/app/[lang]/admin/users/page.tsx
  - src/app/[lang]/admin/blog/page.tsx
autonomous: true
---

# Phase 08: Super Admin Dashboard Plan

## Task 1: Supabase Schema Updates
<read_first>
- supabase/migrations/
- src/db/schema.ts
</read_first>
<action>
Create a new migration file `supabase/migrations/20260501000000_super_admin.sql` (or use Supabase MCP to apply it directly).
1. Add `is_admin BOOLEAN DEFAULT FALSE` to `public.profiles`.
2. Create `public.blog_posts` table with id, title, slug, content, published, published_at, author_id, created_at, updated_at.
3. Add RLS policies for `blog_posts` allowing public read and admin-only write.
4. Update `profiles` RLS to allow admins to read all profiles.
</action>
<acceptance_criteria>
- `supabase-mcp-server` lists `blog_posts` table.
- `public.profiles` has `is_admin` column.
</acceptance_criteria>

## Task 2: Backend Route Protection
<read_first>
- src/middleware.ts (if exists) or new admin wrapper
</read_first>
<action>
Modify the Next.js middleware or create an admin layout guard to check the `is_admin` flag.
If a user is not an admin and tries to access `/admin/*`, redirect them to the home page or a 403 page.
</action>
<acceptance_criteria>
- Non-admin users cannot load `/admin` pages.
</acceptance_criteria>

## Task 3: Admin Layout & UI
<read_first>
- src/app/[lang]/layout.tsx
- src/components/shared/
</read_first>
<action>
Create `src/app/[lang]/admin/layout.tsx` incorporating a sidebar and top bar styled with the Conseil design system.
Create `src/app/[lang]/admin/page.tsx` displaying Insights (Total Users, Active Subscriptions).
Create `src/app/[lang]/admin/users/page.tsx` as a data table listing all `profiles`.
Create `src/app/[lang]/admin/blog/page.tsx` for managing blog posts.
</action>
<acceptance_criteria>
- Admin routes compile without errors.
- UI elements exist for the required admin pages.
</acceptance_criteria>
