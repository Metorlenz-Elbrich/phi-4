# Design System

The PhiBrain palette is a vibrant, warm, startup-modern system layered on a premium navy / off-white base. Tokens live in CSS custom properties and are exposed to Tailwind via `tailwind.config.ts`.

## Tokens

### Surface
| Token              | Light            | Dark              | Role |
|--------------------|------------------|-------------------|------|
| `--background`     | `220 30% 98%`    | `222 45% 6%`      | Page surface |
| `--foreground`     | `222 47% 11%`    | `210 40% 98%`     | Body text |
| `--card`           | `0 0% 100%`      | `222 40% 9%`      | Card / panel |
| `--muted`          | `220 14% 94%`    | `222 30% 14%`     | Subtle pills, secondary backgrounds |
| `--border`         | `220 14% 88%`    | `222 30% 18%`     | Borders, dividers |

### Brand accents
| Token             | Light          | Dark           | Purpose |
|-------------------|----------------|----------------|---------|
| `--brand-cyan`    | `188 95% 45%`  | `188 95% 60%`  | Primary energy, CTAs, links |
| `--brand-violet`  | `262 83% 62%`  | `262 83% 72%`  | Secondary intelligence, transformation |
| `--brand-coral`   | `12 88% 62%`   | `12 88% 68%`   | Warmth, creativity |
| `--brand-amber`   | `38 96% 56%`   | `38 96% 62%`   | Highlight / playful detail |
| `--brand-mint`    | `162 72% 52%`  | `162 72% 58%`  | Success, mobile / native cues |

The palette is intentionally polychromatic — it carries the original PhiBrain warmth rather than the cold monochrome of enterprise SaaS.

## Typography

- **Display / Sans**: Inter (variable), used for everything from H1 to body
- **Mono**: JetBrains Mono, used for chapter indices, dates, footer signature

Body line-height stays generous (`leading-relaxed`); headings tighten to `leading-[1.02]` at large sizes.

## Radii

```
--radius: 1rem;            /* lg */
calc(var(--radius) - 4px)  /* md */
calc(var(--radius) - 8px)  /* sm */
```

Cards use `rounded-3xl` (1.5rem) or `rounded-[2.5rem]` for hero-class containers. Pills are `rounded-full`.

## Elevation

Three elevation modes:

1. **Flat** — text, lists, in-flow elements.
2. **Card** — `border border-border bg-card` with optional `backdrop-blur` for floating headers.
3. **Glow** — `glow-cyan` utility plus `ambient-glow` blurred radial gradients behind hero / CTA. Used sparingly to mark "premium moments" — never on every card.

## Reusable components

| Component            | Location                                  |
|----------------------|-------------------------------------------|
| `Button`             | `components/ui/Button.tsx`                |
| `ThemeToggle`        | `components/ui/ThemeToggle.tsx`           |
| `premium-card` class | `app/globals.css` (`@layer components`)   |
| `glass` class        | `app/globals.css` (`@layer components`)   |
| `text-gradient`      | `app/globals.css`                         |

`premium-card` uses a CSS variable (`--mx`, `--my`) updated via mouse-move to render a soft radial halo following the cursor.

## Accessibility

- All interactive elements have `focus-visible` rings using `--brand-cyan`.
- `aria-label` on icon-only buttons.
- Color contrast targets WCAG AA (`--foreground` on `--background` ≥ 11:1 in both modes).
- `@media (prefers-reduced-motion: reduce)` is honoured globally in `app/globals.css`.
