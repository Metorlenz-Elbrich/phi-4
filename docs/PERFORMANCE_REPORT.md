# Performance Report

This build is intentionally lean. The hero is SVG + image, scroll progress
uses Framer Motion's built-in `useScroll`, and there is no WebGL / GSAP /
smooth-scroll library.

## Targets (production)

| Metric                          | Target                  |
|---------------------------------|-------------------------|
| Largest Contentful Paint (LCP)  | < 2.0s on 4G            |
| First Input Delay / INP         | < 200ms                 |
| Cumulative Layout Shift (CLS)   | < 0.02                  |
| JS shipped (initial, gzipped)   | < 180 KB                |
| Lighthouse desktop perf         | ≥ 95                    |
| Lighthouse mobile perf          | ≥ 90                    |

## What was removed

The simplification pass dropped five libraries from production deps:

- `three` and `@react-three/fiber` (~ 250 KB combined, was lazy-loaded on desktop)
- `gsap` (~ 35 KB, was loaded inside two sections via dynamic `import()`)
- `lenis` (~ 6 KB)
- The `Marquee` and `Storytelling` sections (animation-heavy decoration)

Before / after for a desktop user on the home page (cold cache):

| State          | Total page JS         | LCP-blocking JS   |
|----------------|-----------------------|-------------------|
| Pre-simplify   | ~ 420 KB (3D lazy)    | ~ 169 KB          |
| After          | **~ 172 KB**          | **~ 172 KB**      |

(Numbers are gzipped, from `next build` output.)

## Techniques in use

### 1. Bundle composition

- Only six production dependencies remain: `next`, `react`, `react-dom`, `framer-motion`, `next-themes`, `lucide-react` (+ the trio of `cn` helpers).
- `experimental.optimizePackageImports` in `next.config.mjs` tree-shakes `lucide-react`.

### 2. Rendering

- The home page is a **server component** composing client sections. The whole page is statically prerendered (`○ (Static)` in `next build` output).
- The contact form keeps its state locally (`useState`); there's no global state library.

### 3. Animation cost

- Framer Motion uses `viewport={{ once: true }}` for all entrance animations so observers disconnect after firing.
- The Process timeline progress rail uses one `useScroll` + one `useTransform`. No GSAP, no ScrollTrigger.
- The BrainVisual idle animation is CSS keyframe + SVG SMIL — there is **no `requestAnimationFrame` loop running on the home page**.

### 4. CSS

- Tailwind v3 with content scanning limited to `app/`, `components/`, and `features/` — no orphan classes.
- `mask-fade-bottom` and `mask-fade-edges` use CSS `mask-image`, which the GPU rasterises.
- Ambient gradients are CSS `radial-gradient` + `filter: blur()` on positioned divs — cheaper than any SVG / WebGL alternative for the same look.

### 5. Fonts

- Google Fonts loaded via `next/font` (Inter + JetBrains Mono) with `display: "swap"` and only required subsets. Self-hosted and cache-stable.

### 6. Images

- The PhiBrain logo is served from `public/assets`. `next/image` is used everywhere it's rendered so the responsive image pipeline handles it.
- All section "art" is SVG generated inline, so there are no extra network requests for hero / project illustrations.

## How to audit

1. **Build & start.** `npm run build && npm run start`
2. **Lighthouse desktop.** Run Lighthouse against <http://localhost:3000>. Confirm LCP ≤ 2.0 s.
3. **Lighthouse mobile.** Run with mobile preset. Confirm LCP ≤ 2.5 s.
4. **Bundle inspection.** Add `@next/bundle-analyzer` to verify the main page chunk contains only the listed dependencies.

## Future improvements

- Add `next-sitemap` for SEO at deploy time.
- Add a real OG image (1200×630 PNG) under `public/og.png` and wire it into the `metadata.openGraph` block in `app/layout.tsx`.
- Wire the contact form `handleSubmit` to a Next.js server action so submissions land directly in the studio inbox without depending on the user's mail client.
