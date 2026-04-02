# Blog Card Spec

## Visual Reference
Reference: `docs/design-references/blog_post_list_...png`

## Anatomy
Used on `/blog` list pages.
1. Wrap entirely in a link to the article.
2. Large prominent image area (aspect ratio approx 16:9 or 3:2).
3. 10px rounded corners on the card/image.
4. Content block below the image containing:
   - Specific light-teal category badge.
   - Title (bold, large font).
   - Date and author.
   - Short excerpt.

## Design Tokens
- **Border Radius**: exactly 10px (`rounded-[10px]`).
- **Shadow**: Standard Conseil shadow (`shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]`) and elevated on hover (`hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]`).
- **Image**: `object-cover` full width. 
- **Category Badge**: `bg-conseil-teal/10 text-conseil-teal px-3 py-1 text-xs font-semibold rounded-full`.
- **Title**: `text-gray-900 text-xl font-bold mt-3 group-hover:text-conseil-teal transition-colors`.

## API & Props
```typescript
interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    imageUrl: string;
  }
}
```
