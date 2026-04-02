# App Grid Card Spec (Service Grid)

## Visual Reference
Reference: `docs/design-references/service_cards_...png`

## Anatomy
Used in app routes (`/practice`, `/study`) to select tests or topics. Borrows visual patterns from Conseil's Services grid.
1. Standalone card with image top, or split structure.
2. Distinctive pinned badge element in the top right.
3. Dark CTA button in the footer of the card.
4. Consistent rounded corners (10px) and Conseil shadow interactions.

## Design Tokens
- **Border Radius**: 10px (`rounded-[10px]`).
- **Shadow**: Matches `blog-card.spec.md` (subtle resting, large hover lift).
- **Transitions**: `transition-all duration-300 transform hover:-translate-y-1`.
- **Image/Header**: Contains a background image. Pinned top-right badge: `absolute top-4 right-4 bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-[10px] shadow-sm`.
- **Content Area**: White background, containing Title (`text-2xl font-bold text-gray-900`) and structured data (number of questions, time limit).
- **CTA**: Teal button block or link with a sparkle/arrow icon.

## API & Props
```typescript
interface AppGridCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badgeLabel?: string;
  stats: { label: string; value: string }[];
  href: string;
  ctaText: string;
}
```
