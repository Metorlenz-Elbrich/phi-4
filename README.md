# PhiBrain — Premium Evolution

A premium modern immersive digital experience for **PhiBrain**, the creative
technology studio. Built with Next.js 15, TypeScript, Tailwind CSS, Framer
Motion, GSAP, React Three Fiber, and Lenis.

> This is **PhiBrain, elevated** — the same warm, vibrant, startup-modern
> personality, executed at the level of a premium product brand.

## Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## What's inside

- **3D logo-brain hero** — a parametric brain mesh with a circuit hemisphere
  (left) and an organic glowing node-network hemisphere (right), connected by
  a luminous "phi spine".
- **Full light / dark theme** with system-preference detection and persistence.
- **Inertial smooth scroll** via Lenis (auto-disabled under
  `prefers-reduced-motion`).
- **Scroll storytelling** in the *Process* and *Storytelling* sections, using
  GSAP ScrollTrigger.
- **Seven services** — websites, web apps, mobile apps, branding, UI/UX,
  cybersecurity, digital transformation.
- **Mobile-aware** — the 3D hero swaps for a CSS-only fallback on small
  viewports and under reduced motion.

## Documentation

| Document                                | Purpose                              |
|------------------------------------------|--------------------------------------|
| `docs/PROJECT_ARCHITECTURE.md`           | Folder layout & rendering model      |
| `docs/DESIGN_SYSTEM.md`                  | Tokens, typography, radii, elevation |
| `docs/ANIMATION_ARCHITECTURE.md`         | Framer / GSAP / R3F / Lenis split    |
| `docs/THREE_D_SCENE.md`                  | Geometry & material breakdown        |
| `docs/CONTENT_STRATEGY.md`               | Voice, headlines, copy patterns      |
| `docs/COMPONENT_INVENTORY.md`            | Every component, every prop          |
| `docs/SETUP.md`                          | Install, run, deploy, customise      |
| `docs/PERFORMANCE_REPORT.md`             | Targets and the techniques behind them |

## Project layout

```
app/                # App Router (layout, page, globals.css)
components/
  providers/        # Theme + smooth-scroll providers
  sections/         # Page sections (Navbar, Hero, Services, …)
  three/            # BrainScene + BrainStatic fallback
  ui/               # Button, ThemeToggle
hooks/              # useInView, useIsMobile, useMousePosition, useReducedMotion
lib/                # utils + site content
public/assets/      # Static media (incl. official logo)
docs/               # Documentation (above)
```

## Customising copy

All marketing copy lives in `lib/site.ts`. Marketing edits never need to
touch JSX.

## License

© PhiBrain. All rights reserved.
