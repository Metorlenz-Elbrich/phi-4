# PhiBrain — Premium Marketing Site

A clean, fast, conversion-focused marketing site for **PhiBrain**, the
creative technology studio. Built with Next.js 15, TypeScript, Tailwind
CSS, Framer Motion, and `next-themes`.

> This is **PhiBrain, premium and lean** — the warm, vibrant identity
> rendered without 3D, GSAP, or smooth-scroll libraries. Just React,
> Tailwind, and SVG.

## Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## What's inside

- **Hero centerpiece**: the official PhiBrain logo, lifted by soft brand
  halos, two dashed SVG orbital rings, and eight pulsing idea-particles.
- **Full light / dark theme** with system-preference detection and
  persistence.
- **Seven services** — websites, web apps, mobile apps, branding, UI/UX,
  cybersecurity, digital transformation.
- **Real contact form** with client-side validation and a `mailto:`
  submit that pre-fills the studio's inbox.
- **Scroll-scrubbed timeline** in the *Process* section using Framer
  Motion's `useScroll`.
- **Premium mobile UX** — fixed-height navbar (max 56 px), responsive
  typography with `text-balance`, no horizontal-scroll surprises.

## Documentation

| Document                                | Purpose                              |
|------------------------------------------|--------------------------------------|
| `docs/PROJECT_ARCHITECTURE.md`           | Folder layout & rendering model      |
| `docs/DESIGN_SYSTEM.md`                  | Tokens, typography, radii, elevation |
| `docs/ANIMATION_ARCHITECTURE.md`         | Framer Motion + CSS + SMIL          |
| `docs/HERO_VISUAL.md`                    | BrainVisual breakdown                |
| `docs/CONTENT_STRATEGY.md`               | Voice, headlines, copy patterns      |
| `docs/COMPONENT_INVENTORY.md`            | Every component, every prop          |
| `docs/SETUP.md`                          | Install, run, deploy, customise      |
| `docs/PERFORMANCE_REPORT.md`             | Targets and the techniques behind them |

## Project layout

```
app/                # App Router (layout, page, globals.css)
components/
  providers/        # ThemeProvider
  sections/         # Page sections (Navbar, Hero, Services, Process, Projects, Security, Contact, Footer)
  visuals/          # BrainVisual (animated SVG)
  ui/               # Button, ThemeToggle
hooks/              # useIsMobile, useReducedMotion
lib/                # utils + site content
public/assets/      # Static media (incl. official logo)
docs/               # Documentation (above)
```

## Customising copy

All marketing copy lives in `lib/site.ts`. Marketing edits never need to
touch JSX.

## License

© PhiBrain. All rights reserved.
