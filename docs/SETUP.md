# Setup

## Prerequisites

- **Node.js** 18.18+ (Next.js 15 minimum). 20 LTS recommended.
- **npm** 9+ (or pnpm / bun if you prefer — the lockfile is npm by default).
- **Git** for version control.

## Install

```bash
cd "C:\Projet\site phi 5"
npm install
```

If `npm install` fails on a peer-dependency warning related to React 19, retry with:

```bash
npm install --legacy-peer-deps
```

This is only needed because some still-conservative packages haven't updated their `peerDependencies` to React 19 yet; runtime is unaffected.

## Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

## Production build

```bash
npm run build
npm run start
```

## Type-check and lint

```bash
npm run typecheck
npm run lint
```

## Project structure quick reference

```
app/                  → layout.tsx, page.tsx, globals.css
components/
  providers/          → ThemeProvider, SmoothScroll
  sections/           → Each section of the home page
  three/              → 3D scene + static fallback
  ui/                 → Reusable button & theme toggle
hooks/                → Reactive hooks (in-view, mouse, mobile, reduced-motion)
lib/                  → utils + site content
public/assets/        → Logo + future static media
docs/                 → This documentation
```

## Brand assets

`public/assets/phibrain-logo.png` is the official PhiBrain logo. It is used:
- in the navbar
- as the static hero fallback
- as a watermark in the final CTA block
- as the site favicon (via `metadata.icons`)

## Environment variables

None required at this stage. When integrating a CMS or contact form, place keys in `.env.local` and add the names to `.env.example` (not yet committed).

## Customisation cheatsheet

| Want to change…                | Edit                                  |
|--------------------------------|---------------------------------------|
| Copy / services / projects     | `lib/site.ts`                         |
| Palette / radii                | `app/globals.css` (CSS variables)     |
| Brand 3D colours               | constants at top of `components/three/BrainScene.tsx` |
| Section order                  | `app/page.tsx`                        |
| Fonts                          | `app/layout.tsx`                      |

## Deploy

The site is a standard Next.js 15 App-Router project. The recommended host is Vercel. The whole site is statically deliverable except for default Next.js dynamic features — no runtime database, no server-only routes.

```bash
# from a Vercel-linked clone:
vercel --prod
```

## Troubleshooting

- **WebGL never appears.** Check `useIsMobile` (you may be below the 768px breakpoint), or that you haven't enabled reduced-motion in your OS. The fallback `BrainStatic` is intentional and not a bug.
- **Theme flashes on first paint.** `next-themes` already sets `suppressHydrationWarning` on `<html>` and is configured with `disableTransitionOnChange={false}` for a deliberately smooth theme transition. If you see a sharper flash on a slow CDN, switch to `disableTransitionOnChange` `true`.
- **GSAP not animating.** Make sure you're not running with reduced motion enabled in your OS — the storytelling and process scroll animations are gated on it.
