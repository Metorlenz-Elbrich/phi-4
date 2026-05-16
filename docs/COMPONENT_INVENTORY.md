# Component Inventory

## Sections (`components/sections/`)

| Component         | Purpose                                                | Notes |
|-------------------|--------------------------------------------------------|-------|
| `Navbar`          | Floating pill nav, theme toggle, mobile drawer         | Fixed height (`h-12 sm:h-14`), only chrome transitions on scroll |
| `Hero`            | Headline, sub-line, CTAs, brain visual                 | No WebGL — uses `BrainVisual` |
| `Services`        | 7 service cards in 3-column grid                       | Pointer-tracking halo per card |
| `Process`         | 4-step timeline                                        | Progress rail scrubbed by `framer-motion` `useScroll` |
| `Projects`        | 4-project showcase grid with per-project SVG art       | No external images |
| `Security`        | Trust badges + three pillars                           | "Sleep-well-at-night" framing |
| `Contact`         | Real contact form (name, email, project type, message) | Client validation, mailto submit, success state |
| `Footer`          | Studio info, links, social, signature                  | — |

## Providers (`components/providers/`)

| Component       | Purpose                                                  |
|-----------------|----------------------------------------------------------|
| `ThemeProvider` | Wraps `next-themes`, system-preference + persistence     |

## Visuals (`components/visuals/`)

| Component      | Purpose                                                          |
|----------------|------------------------------------------------------------------|
| `BrainVisual`  | Animated SVG centerpiece — official logo + halo + idea-particles |

## UI primitives (`components/ui/`)

| Component     | Purpose                                  | Variants |
|---------------|------------------------------------------|----------|
| `Button`      | The single CTA primitive                 | primary / secondary / ghost / outline · sm / md / lg |
| `ThemeToggle` | Sun ↔ moon transition, system-aware     | — |

## Hooks (`hooks/`)

| Hook                          | Purpose                                  |
|-------------------------------|------------------------------------------|
| `usePrefersReducedMotion`     | Reactive media-query subscription        |
| `useIsMobile`                 | Reactive viewport breakpoint check       |

## Lib (`lib/`)

| Module      | Purpose                                            |
|-------------|----------------------------------------------------|
| `utils.ts`  | `cn` (clsx + tw-merge), `clamp`, `mapRange`        |
| `site.ts`   | Site metadata, nav, services, process steps, projects, security copy |

## How to add a new section

1. Create `components/sections/NewSection.tsx`. Mark it `"use client"` only if it needs hooks or interaction.
2. Source any copy from `lib/site.ts` (extend it as needed).
3. Use the standard entrance pattern: `motion.div` with `whileInView` and ease `[0.22, 1, 0.36, 1]`.
4. Import the section in `app/page.tsx` and place it in the document order.
5. Add it to this inventory.

## Removed (simplification pass)

These existed earlier and were intentionally removed:

- `components/three/BrainScene.tsx`, `BrainStatic.tsx` — WebGL hero (replaced by `BrainVisual`).
- `components/sections/Marquee.tsx` — value-words band (visual noise).
- `components/sections/Storytelling.tsx` — pinned horizontal scroll (visual noise and accessibility friction).
- `components/sections/CTA.tsx` — button-only call-to-action (replaced by the real `Contact` form).
- `components/providers/SmoothScroll.tsx` — Lenis wrapper (native scroll is sufficient).
- `hooks/useInView.ts`, `useMousePosition.ts` — unused after the section rewrites.
