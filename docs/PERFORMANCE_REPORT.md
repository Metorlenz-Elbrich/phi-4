# Performance Report

This document captures the performance discipline applied to the build and the targets each layer is designed against.

## Targets (production)

| Metric                          | Target                  |
|---------------------------------|-------------------------|
| Largest Contentful Paint (LCP)  | < 2.5s on 4G            |
| First Input Delay / INP         | < 200ms                 |
| Cumulative Layout Shift (CLS)   | < 0.05                  |
| JS shipped (initial, gzipped)   | < 180 KB                |
| Lighthouse desktop perf         | ≥ 90                    |
| Lighthouse mobile perf          | ≥ 85 (with WebGL skipped) |

## Techniques in use

### 1. Code-split the heavy stuff

- `BrainScene` is loaded via `dynamic(... { ssr: false })`. R3F, three, and drei are excluded from the initial bundle.
- GSAP is imported inside `useEffect` in `Process` and `Storytelling` only — never at module top-level. Pages that don't include those sections don't ship GSAP at all.
- `experimental.optimizePackageImports` in `next.config.mjs` tree-shakes `lucide-react` and `framer-motion`.

### 2. Mobile fallback

Detection (`useIsMobile`, `usePrefersReducedMotion`) keeps WebGL off-screen on devices where:

- the user's viewport is below 768px,
- the user has `prefers-reduced-motion: reduce`,
- or the dynamic import hasn't resolved yet.

The fallback is a static logo + CSS halo — paints in the first frame.

### 3. Animation cost

- Framer Motion uses `viewport={{ once: true }}` for all entrance animations so observers disconnect after firing.
- The brain scene uses `dpr={[1, 1.75]}` to cap pixel density and `useMemo` for all geometry & instance arrays. Per-frame work is limited to material `emissiveIntensity` updates and a position lerp.
- The horizontal pinned scroll in `Storytelling` is `pin: true, scrub: 0.6` — `scrub` defers updates to the next animation frame, avoiding scroll jank.
- Lenis is gated on reduced-motion; users who opt out get native scroll with no extra cost.

### 4. CSS

- Tailwind v3 with content scanning limited to `app/`, `components/`, and `features/` — no orphan classes.
- `mask-fade-bottom` and `mask-fade-edges` use CSS `mask-image`, which the GPU rasterises — no canvas fallback.
- Ambient gradients are CSS `radial-gradient` + `filter: blur(80px)` on positioned divs — cheaper than any SVG / WebGL alternative for the same look.

### 5. Fonts

- Google Fonts loaded via `next/font` (Inter + JetBrains Mono) with `display: "swap"` and only required subsets. They are self-hosted and cache-stable.

### 6. Images

- The logo is served from `public/assets`. `next/image` is used everywhere it's rendered so the responsive image pipeline handles it.
- All other section "art" is SVG generated inline, so there are no extra network requests for hero / project illustrations.

## How to audit

1. **Build & start.** `npm run build && npm run start`
2. **Lighthouse desktop.** Run Lighthouse against <http://localhost:3000>. Confirm LCP ≤ 2.5s.
3. **Lighthouse mobile.** Run with mobile preset. The WebGL hero is automatically swapped for the static fallback so LCP stays low.
4. **Bundle inspection.** `npx @next/bundle-analyzer` (add the plugin in `next.config.mjs`) to confirm:
   - the main page chunk excludes `three`, `@react-three/*`, `gsap`,
   - those weights only appear in their own dynamic chunks.

## Future improvements

- Preload `Inter` from `next/font` (`preload: true` is the default since Next 14) — verify in the network panel.
- Move `BrainScene` to an `IntersectionObserver`-gated loader so it only initialises when the hero is actually in the viewport on slow connections.
- Add `next-sitemap` for SEO at deploy time.
- Add a real OG image (1200×630 PNG) under `public/og.png` and wire it into the `metadata.openGraph` block in `app/layout.tsx`.
