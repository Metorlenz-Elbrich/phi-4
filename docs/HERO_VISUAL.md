# Hero Visual

The hero centerpiece is the **official PhiBrain logo**, lifted by a clean SVG ambient layer. No WebGL, no JS animation loop.

## Composition

```
BrainVisual
├─ Two soft brand halos (CSS, `blur-3xl`)
├─ SVG ambient layer
│   ├─ Two dashed orbital rings (cyan + violet)
│   ├─ Eight pulsing idea-particles around the brain  (SVG <animate>)
│   └─ One travelling thought dot along the inner ring (SVG <animateMotion>)
└─ <Image src="phibrain-logo.png" />   (CSS float, cyan drop-shadow)
```

## Why this and not 3D

- It paints in the first frame — no Canvas mount, no shader compile.
- It's ~5 KB gzipped; the previous WebGL build pulled ~250 KB of three.js + R3F into a lazy chunk.
- It's universally responsive — no mobile / reduced-motion fallback needed because the visual *is* the fallback.
- It's instantly recognisable as PhiBrain — we're using the actual logo, not a re-interpretation.

## Motion budget

| Element                | Mechanism      | Frequency        |
|------------------------|----------------|------------------|
| Logo float             | CSS keyframe   | 6 s cycle        |
| 8 idea-particles       | SVG `<animate>`| 3.6 s, staggered |
| Travelling thought     | `<animateMotion>` | 10 s cycle     |
| Brand halos            | static blur    | none             |

All animations are browser-native and respect `prefers-reduced-motion` automatically.

## Customisation

- **Number of particles** — change the literal in `PARTICLES = Array.from({ length: 8 })`.
- **Orbit speed** — `dur="10s"` on the `<animateMotion>` element.
- **Halo colours / opacity** — the two halo divs at the top of `BrainVisual.tsx`.
- **Drop-shadow glow** — the `drop-shadow-[...]` Tailwind class on the `<Image>`.
