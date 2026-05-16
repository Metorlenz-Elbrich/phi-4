# Component Inventory

## Sections (`components/sections/`)

| Component         | Purpose                                                 | Notes |
|-------------------|---------------------------------------------------------|-------|
| `Navbar`          | Floating pill nav, theme toggle, mobile drawer          | Reacts to scroll position |
| `Hero`            | Headline, sub, CTAs, stats, 3D brain                   | Auto-fallback on mobile / reduced-motion |
| `Marquee`         | Trust / value-words band beneath hero                   | CSS-animated, mask-faded edges |
| `Services`        | 7 service cards in 3-column grid                        | Pointer-tracking halo per card |
| `Process`         | 4-step timeline with scroll-scrubbed progress           | GSAP ScrollTrigger |
| `Storytelling`    | Pinned horizontal scroll: Spark → Sketch → System → Ship → CTA | GSAP, mobile fallback |
| `Projects`        | 4-project showcase grid with custom SVG art per project | No external images required |
| `Security`        | Trust badges + three pillars                            | Sleep-well-at-night framing |
| `CTA`             | "Bring us the idea." block with gradient + logo watermark | Mailto CTA |
| `Footer`          | Studio info, links, social, signature                   | Year auto-renders |

## Providers (`components/providers/`)

| Component       | Purpose                                                   |
|-----------------|-----------------------------------------------------------|
| `ThemeProvider` | Wraps `next-themes`, system-preference + persistence      |
| `SmoothScroll`  | Mounts Lenis (skipped under reduced-motion)               |

## UI primitives (`components/ui/`)

| Component     | Purpose                                  | Variants |
|---------------|------------------------------------------|----------|
| `Button`      | The single CTA primitive                 | primary / secondary / ghost / outline · sm / md / lg |
| `ThemeToggle` | Sun ↔ moon transition, system-aware     | — |

## Three.js (`components/three/`)

| Component     | Purpose                                                  |
|---------------|----------------------------------------------------------|
| `BrainScene`  | The full WebGL hero (shell + hemispheres + spine + lights) |
| `BrainStatic` | DOM fallback (logo + ambient gradient halos)             |

## Hooks (`hooks/`)

| Hook                          | Purpose                                  |
|-------------------------------|------------------------------------------|
| `useInView`                   | One-shot IntersectionObserver wrapper    |
| `useMousePosition`            | Normalised cursor coords                 |
| `usePrefersReducedMotion`     | Reactive media-query subscription        |
| `useIsMobile`                 | Reactive viewport breakpoint check       |

## Lib (`lib/`)

| Module      | Purpose                                            |
|-------------|----------------------------------------------------|
| `utils.ts`  | `cn` (clsx + tw-merge), `clamp`, `mapRange`        |
| `site.ts`   | Site metadata, nav, services, process, projects, security copy |

## How to add a new section

1. Create `components/sections/NewSection.tsx`. Mark it `"use client"` only if it needs hooks or interaction.
2. Source any copy from `lib/site.ts` (extend it as needed).
3. Use the standard entrance pattern: `motion.div` with `whileInView` and ease `[0.22, 1, 0.36, 1]`.
4. Import the section in `app/page.tsx` and place it in the document order.
5. Add it to this inventory.
