# Animation Architecture

PhiBrain animates with **one library plus CSS**.

| Technology         | Job                                                       |
|--------------------|-----------------------------------------------------------|
| **Framer Motion**  | Section entrance, hover micro-interactions, scroll-scrubbed progress rail |
| **CSS keyframes**  | The BrainVisual logo float + ambient pulses (`globals.css`) |
| **SVG SMIL**       | The BrainVisual idea-particles + travelling thought       |

There is no GSAP, no Lenis, no IntersectionObserver hand-rolled by us. Framer Motion's `whileInView` and `useScroll` handle every scroll-aware effect on the site.

## Why this lean stack

GSAP and Lenis are excellent libraries — but they each ship a few dozen kilobytes of JS for effects we can build natively in framer-motion. Removing them shrinks the bundle, removes per-frame schedulers, and reduces the number of "moving parts" that can desynchronize on slow devices.

## Section entrance pattern

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-15%" }}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
>
```

Easing `[0.22, 1, 0.36, 1]` is the project's signature curve — a fast-out, slow-end ease that reads as "confident, not anxious".

## Scroll-scrubbed progress (Process section)

`Process` uses `useScroll` / `useTransform` to map scroll progress within the timeline container to a `scaleY` value on the gradient progress rail:

```tsx
const containerRef = useRef(null);
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start 80%", "end 50%"],
});
const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
return <motion.div style={{ scaleY, transformOrigin: "top" }} />;
```

This is everything GSAP's `ScrollTrigger { scrub }` would have given us, in 5 lines, with no extra library.

## Idle animation (BrainVisual)

- The logo floats via the Tailwind `animate-float` keyframe (a 12-px gentle sine).
- Eight SVG particles around the logo pulse `r` and `opacity` via `<animate>` tags on a 3.6s cycle, staggered.
- One travelling "thought" dot follows an SVG path via `<animateMotion>` on a 10s loop.

All of this is browser-native. There is no JS animation loop running for the hero.

## Reduced motion

The global stylesheet honours `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This catches CSS keyframes (float, glow-pulse, marquee) and SVG SMIL (the browser respects the same media query for SMIL animations on most platforms). Framer Motion automatically respects the media query via its built-in reduced-motion support.
