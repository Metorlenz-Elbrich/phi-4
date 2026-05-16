# Project Architecture

PhiBrain Premium — a Next.js 15 (App Router) marketing site built with
TypeScript, Tailwind, Framer Motion, and `next-themes`. No WebGL, no GSAP,
no smooth-scroll library — the implementation is intentionally lean.

## High-level shape

```
/app                  → App Router entry (layout, page, global CSS)
/components
  /providers          → ThemeProvider
  /sections           → Page-level sections (Navbar, Hero, Services, …, Contact, Footer)
  /visuals            → BrainVisual (animated SVG hero centerpiece)
  /ui                 → Reusable primitives (Button, ThemeToggle)
/features             → Reserved for feature-scoped modules
/hooks                → Cross-cutting React hooks
/lib                  → Pure utilities (cn, mapRange) + content (site, services)
/styles               → Reserved for additional global stylesheets
/public/assets        → Static assets served by Next.js
/docs                 → This documentation
```

## Why this layout

- **App Router** keeps server/client boundaries explicit. The page is a server component composing client section components.
- **`/components/sections`** is the unit of composition for the marketing site. Each section is self-contained — its motion, layout, and content live in one file so it can be moved or reused without untangling cross-section state.
- **`/components/visuals`** isolates illustrative components from layout sections. Today there's just `BrainVisual`, but anything else heavy (lottie, illustrations) belongs here.
- **`/lib/site.ts`** is the single source of truth for copy. Marketing edits never need to touch JSX.
- **`/hooks`** holds hooks that several sections reuse: reduced-motion + mobile detection.
- **`/features`** is reserved for future product surfaces (e.g. a case-study detail page) so the marketing scope and product scope don't bleed into each other.

## Rendering model

| Surface              | Render mode | Notes |
|----------------------|-------------|-------|
| `app/page.tsx`       | Server      | Composes section components only |
| `Navbar`, `Hero`, … | Client      | Interactive — Framer Motion, form state, theme |
| `BrainVisual`        | Client      | SVG + Next/Image, no JS animation loop |
| `Contact`            | Client      | Controlled form with client validation |

## Data flow

There is no API layer. All marketing copy is static and lives in
`/lib/site.ts`. The contact form composes a `mailto:` link client-side
and opens the user's default mail client.

For a real production form, wire `handleSubmit` to a server action
(Next.js `"use server"`) or a serverless function that emails the studio.

## Theming

`next-themes` is wrapped in `components/providers/ThemeProvider.tsx` and configured with `attribute="class"`, `defaultTheme="system"`, and persistent storage. Dark mode is the `class="dark"` selector on `<html>`. CSS custom properties in `app/globals.css` define both palettes; Tailwind reads them via the `colors` config in `tailwind.config.ts`.

## Build & deploy

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm run start` — production server
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next.js ESLint config

Recommended host: Vercel. The whole site prerenders statically.

## Dependencies (production)

```
next, react, react-dom
framer-motion          — section entrances, useScroll progress rail
next-themes            — light/dark mode
lucide-react           — icons
class-variance-authority, clsx, tailwind-merge   — `cn()` and Button variants
```

No `three`, `@react-three/fiber`, `gsap`, or `lenis`. The marketing build
is **plain React, plain Tailwind, plain SVG**.
