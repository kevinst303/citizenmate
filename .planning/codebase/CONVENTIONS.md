# Code Conventions

## Language & TypeScript

- **Strict mode**: `strict: true` in `tsconfig.json`
- **Target**: ES2017
- **Module resolution**: `bundler`
- **Path alias**: `@/*` → `./src/*`
- **JSX**: `react-jsx` (automatic runtime)
- **No type assertions**: Code avoids `as` casts where possible; uses narrowing instead
- **Explicit return types**: Not enforced globally, but used on exported functions

## File Organization

### Naming
- **Files**: `kebab-case.tsx` for components, `kebab-case.ts` for utilities
- **Components**: PascalCase exports (`export function Hero()`, `export function QuizCard()`)
- **Hooks**: `useAuth()`, `usePremium()` — standard React hook naming
- **Constants**: `UPPER_SNAKE_CASE` (`SPRINT_PASS_DAYS`, `QUIZ_WEIGHT`)
- **Types/Interfaces**: PascalCase (`QuizQuestion`, `ReadinessData`, `StudySection`)

### Module Pattern
- Each file has a clear section header comment: `// ===== Section Name =====`
- Sub-sections use lighter markers: `// ── Section ──`
- Related types are defined at the top of the file, before the implementation
- Exports are inline (not barrel exports) — no `index.ts` barrel files

### Component Pattern
```tsx
"use client";  // Only when needed

import { ... } from "react";
import { ... } from "@/lib/...";
import { ... } from "@/components/...";

// ===== Types =====
interface Props { ... }

// ===== Component =====
export function ComponentName({ prop1, prop2 }: Props) {
  // hooks
  // state
  // effects
  // handlers

  return (
    <section className="...">
      {/* JSX */}
    </section>
  );
}
```

## React Patterns

### Server vs. Client Components
- **Default**: Components are server components (no `"use client"` directive)
- **`"use client"`** is added only when the component needs:
  - `useState`, `useEffect`, or other client hooks
  - Browser APIs (`window`, `localStorage`)
  - Event handlers (`onClick`, `onChange`)
  - Context consumption (`useAuth()`, `useQuiz()`)
- Layout files are typically server components
- Page files are mixed (server for static pages, client for interactive)

### Context Provider Pattern
All providers follow this structure in `src/lib/`:

```tsx
"use client";

// 1. Types
interface ContextValue { ... }

// 2. Context
const MyContext = createContext<ContextValue | null>(null);

// 3. Provider component
export function MyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(...);
  // ... logic

  return (
    <MyContext.Provider value={{ ... }}>
      {children}
    </MyContext.Provider>
  );
}

// 4. Hook
export function useMyContext(): ContextValue {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error("useMyContext must be used within MyProvider");
  return ctx;
}
```

### Error Handling
- API routes use try/catch with typed error extraction:
  ```tsx
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
  ```
- Context providers catch and log errors with `console.error("[Module] context:", err)`
- Empty catches (`catch {}`) are used for non-critical operations (e.g., localStorage parse failures)

### Supabase Availability Guards
All Supabase-dependent code checks configuration first:
```tsx
function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
```
This ensures the app works without Supabase configured (demo/development mode).

## Styling Conventions

### CSS Strategy
The project uses a **three-tier styling approach**:

1. **Custom CSS classes** (`.card-conseil`, `.badge-pill`, `.btn-rounded-*`) — Conseil design system components defined in `globals.css`
2. **Tailwind utility classes** — For layout, spacing, responsive design
3. **shadcn/ui components** — Pre-built primitives (Button, Card, etc.) with CVA variants

### Design Token Usage
- **Colors**: Use CSS custom properties (`bg-cm-teal`, `text-cm-dark`) or Tailwind theme colors (`bg-primary`, `text-muted-foreground`)
- **Fonts**: `font-heading` (Poppins) for headings, `font-sans` (Inter) for body — set via CSS variables in root layout
- **Radii**: Conseil standard is `15px` (`.card-conseil`) or Tailwind `rounded-2xl`
- **Shadows**: Use `.shadow-card` / `.shadow-card-hover` or Conseil dual-layer shadows

### Animation Pattern
- Framer Motion for entrance animations (fade-in, slide-up)
- CSS animations for micro-interactions (`@keyframes` in globals.css)
- `prefers-reduced-motion` respected via CSS media query

### Responsive Design
- Mobile-first Tailwind classes: `p-5 sm:p-6 lg:p-8`
- Container width: `max-w-[1140px]` (Conseil standard)
- Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## API Route Conventions

### Route Handler Pattern
```tsx
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Auth verification (if needed)
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Input validation
    const body = await req.json();

    // 3. Business logic

    // 4. Response
    return NextResponse.json({ data: ... });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

### Auth in API Routes
- Server routes use `createSupabaseServerClient()` for cookie-based auth
- Webhook routes use `createSupabaseAdminClient()` (service role key)
- Client-provided user IDs are **never trusted** — always verified server-side

## Data Conventions

### localStorage Keys
All follow the pattern: `citizenmate-<entity-name>`
- `citizenmate-study-progress`
- `citizenmate-quiz-history`
- `citizenmate-test-date`
- `citizenmate-study-lang`

### JSONB Fields
Supabase JSONB columns use camelCase keys (matching TypeScript interfaces):
- `completed_sections: { "section-id-1": true, "section-id-2": true }`
- `topic_breakdown: { "topic-id": { correct: 5, total: 8 } }`

## Import Conventions

```tsx
// 1. External libraries (React, Next.js)
import { useState, useEffect } from "react";
import type { Metadata } from "next";

// 2. Internal utilities and contexts (@/ alias)
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

// 3. Components
import { Button } from "@/components/ui/button";

// 4. Data (last)
import { studyTopics } from "@/data/study-content";
```

Type-only imports use `import type { ... }` consistently.

## Git Conventions

- **Branch**: `feat/conseil-design-overhaul` for v1.0 feature work
- **Commits**: Prefixed with type (`docs:`, `feat:`, `fix:`)
- **.gitignore**: Standard Next.js ignores + `.env.local`, `node_modules`, `.next`

## Documentation Conventions

### Component CLAUDE.md Files
Several component directories contain `CLAUDE.md` files with the same directive:
> "Check .planning/codebase/*.md files before editing this component group."

Found in: `src/app/`, `src/components/shared/`, `src/components/landing/`, `src/components/dashboard/`
