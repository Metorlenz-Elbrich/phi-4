# Animation Architecture

PhiBrain blends four motion technologies. Each has a job and a clear boundary.

| Technology         | Job                                                       |
|--------------------|-----------------------------------------------------------|
| **Framer Motion**  | Section entrance, hover micro-interactions, layout fades  |
| **GSAP**           | Scroll-driven storytelling (pinning, scrubbed timelines)  |
| **React Three Fiber** | The 3D brain hero (the only WebGL surface)             |
| **Lenis**          | Inertial smooth scroll wrapping the whole page            |

## Why split this way

Framer Motion shines at declarative, viewport-aware reveals. GSAP wins on scrubbed scroll because `ScrollTrigger` ties timeline progress directly to scroll position. Mixing them in the same section is fine, but each individual effect lives in one tool, never both.

## Smooth scroll

`components/providers/SmoothScroll.tsx` instantiates Lenis on mount with a 1.15s `expo` ease, registered to the GSAP ticker indirectly via `requestAnimationFrame`. ScrollTrigger picks up the scroll naturally because Lenis updates `window.scrollY`.

Reduced motion: Lenis is skipped entirely; the browser falls back to native scrolling.

## Section entrance pattern

```tsx
<motion.div
  initial={{ opacity: 0, y: 28 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-15%" }}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
>
```

Easing `[0.22, 1, 0.36, 1]` is the project's signature curve — a fast-out, slow-end ease that reads as "confident, not anxious".

## Scroll storytelling

**`Process`** uses GSAP to scrub the height of a vertical timeline marker as the section enters the viewport.

**`Storytelling`** pins the section and translates a horizontal track using `gsap.to(track, { x: ... , scrollTrigger: { pin: true, scrub } })`. Each chapter has a nested timeline (`containerAnimation`) so chapter copy fades in *within* the pinned scroll.

The horizontal pin is disabled on viewports below `768px` and when `prefers-reduced-motion` is set; the chapters then fall back to a normal vertical stack.

## 3D motion

`BrainScene` keeps three independent motion loops:

1. **Float idle** — `<Float speed={1.2}>` from drei wraps the brain so it gently bobs.
2. **Pointer parallax** — `useFrame` lerps brain rotation toward `pointer.current.x/y`.
3. **Per-element pulses** — node spheres pulse via `emissiveIntensity = 0.6 + 0.4 * sin(t)`; circuit chips pulse on a different phase.

These all run on the same `useFrame` tick — no extra rAF loops.

## Performance notes

- Framer Motion is tree-shaken via `experimental.optimizePackageImports` in `next.config.mjs`.
- GSAP + ScrollTrigger are loaded **dynamically inside `useEffect`** in only the two sections that need them. The hero never imports GSAP.
- `BrainScene` is dynamically imported (`ssr: false`) — its weight stays out of the LCP path.
