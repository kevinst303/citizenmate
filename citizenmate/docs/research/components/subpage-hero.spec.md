# Subpage Hero Spec

## Visual Reference
Reference: `docs/design-references/blog_hero_page_...png`, `services_hero_...png`

## Anatomy
The subpage hero is a top-level banner used across all internal pages.
It features:
1. Full width container, height typically `min-h-[400px]` to `min-h-[500px]`.
2. Teal background gradient overlay on top of an image, or pure teal gradient. In CitizenMate, we'll use a deep teal gradient (`bg-gradient-to-b from-conseil-teal/90 to-conseil-teal` or `bg-conseil-teal`).
3. Content centered vertically and horizontally.
4. Breadcrumb trail at the top of content (e.g., `Home > Blog`).
5. Large bold H1 title (e.g., 4xl or 5xl, text-white).
6. SVG Arched transition at the bottom to transition into white page content.

## Design Tokens
- **Background**: Teal overlay masking a background pattern.
- **Breadcrumb Text**: `text-white/80` with `hover:text-white` transition. Font size `text-sm font-medium`.
- **Title Text**: `text-white font-bold text-4xl md:text-5xl lg:text-6xl`. Font family matches headers.
- **Bottom Curve**: An absolute positioned SVG that masks the bottom. `<svg viewBox="0 0 1920 150" ...>`

## API & Props
```typescript
interface SubpageHeroProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  description?: string;
  badge?: string; // Optional badge like "Leading Partner"
}
```

## Internal Dependencies
- `Link` from `next/link` for breadcrumbs.
- Icons from `lucide-react` (e.g. `ChevronRight` for breadcrumb separators).
