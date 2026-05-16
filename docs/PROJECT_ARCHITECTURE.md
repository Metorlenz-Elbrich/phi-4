# Project Architecture

PhiBrain Premium — a Next.js 15 (App Router) site built with TypeScript, Tailwind, Framer Motion, GSAP, React Three Fiber, and Lenis.

## High-level shape

```
/app                  → App Router entry (layout, page, global CSS)
/components
  /providers          → Theme, smooth-scroll providers
  /sections           → Page-level sections (Navbar, Hero, Services, …)
  /three              → 3D scene (BrainScene) and static fallback
  /ui                 → Reusable primitives (Button, ThemeToggle)
/features             → Reserved for feature-scoped modules
/hooks                → Cross-cutting React hooks
/lib                  → Pure utilities (cn, mapRange) + content (site, services)
/styles               → Reserved for additional global stylesheets
/public/assets        → Static assets served by Next.js
/docs                 → This documentation
```

## Why this layout

- **App Router** keeps server/client boundaries explicit. The page is a server component; anything heavy or interactive is a client component imported into it.
- **`/components/sections`** is the unit of composition for the marketing site. Each section is self-contained — its motion, layout, and content live in one file so it can be moved or reused without untangling cross-section state.
- **`/components/three`** isolates everything WebGL. The Canvas mount and the brain definition are deliberately split from the static fallback so dynamic imports stay slim on mobile.
- **`/lib/site.ts`** is the single source of truth for copy. Marketing edits never need to touch JSX.
- **`/hooks`** holds hooks that several sections reuse: viewport, motion preference, mouse position, mobile detection.
- **`/features`** is reserved for future product surfaces (e.g. a case-study detail page) so the marketing scope and product scope don't bleed into each other.

## Rendering model

| Surface              | Render mode | Notes |
|----------------------|-------------|-------|
| `app/page.tsx`       | Server      | Composes section components only |
| `Navbar`, `Hero`, … | Client      | Interactive — motion, intersection, GSAP |
| `BrainScene`         | Client + dynamic | `dynamic(... { ssr: false })` to avoid hydration of WebGL |
| `BrainStatic`        | Client      | Lightweight DOM fallback |

The Hero decides at runtime which to mount based on `useIsMobile()` and `usePrefersReducedMotion()`.

## Data flow

There is no API layer. All content is static and lives in `/lib/site.ts`. Future dynamic data (CMS, case studies) should land in `/features/<name>/` with its own data module — never in `/lib`.

## Theming

`next-themes` is wrapped in `components/providers/ThemeProvider.tsx` and configured with `attribute="class"`, `defaultTheme="system"`, and persistent storage. Dark mode is the `class="dark"` selector on `<html>`. CSS custom properties in `app/globals.css` define both palettes; Tailwind reads them via the `colors` config in `tailwind.config.ts`.

## Build & deploy

- `npm run dev` — Next.js dev server (turbopack-friendly)
- `npm run build` — production build
- `npm run start` — production server
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next.js ESLint config

Recommended host: Vercel. The site has no server-only routes, so a static export is also viable if WebGL fallbacks satisfy your audience.
