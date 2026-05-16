# Content Strategy

## Voice

- **Smart.** We can describe complex engineering, briefly, in plain English.
- **Approachable.** We use contractions, short sentences, and no jargon.
- **Premium.** We don't oversell. We don't undersell. We say what we'll do.
- **Startup-modern.** Energetic, current, and willing to have a personality.
- **Human.** We address founders, designers, and engineers as people.

We **avoid**: AI buzzwords, enterprise-jargon, fake compliance claims, "synergy / leverage", over-promised case-study numbers.

## Headline pattern

The site leans on **dual-clause headlines** that pair a tangible noun with a quality:

- "Ideas with a brain. Products with a soul."
- "One studio. Seven crafts."
- "From idea to launch — and the months after."
- "Secure by design. Human by default."

The first clause is the promise; the second is the texture.

## Section copy hierarchy

| Element            | Length     | Tone                 |
|--------------------|------------|----------------------|
| Eyebrow chip       | 2–4 words  | Quiet, descriptive   |
| H2 / H3 headline   | 5–10 words | Bold, dual-clause    |
| Lede / subhead     | 1–2 lines  | Plain, useful        |
| Body / description | 2–4 lines  | Concrete, no fluff   |

## Service descriptions

Each service in `/lib/site.ts` has:

- **`tagline`** — the promise in one short sentence.
- **`description`** — what we actually do, in 2 sentences.
- **`bullets`** — four 3-word capabilities (tech / deliverable / standard / outcome).

Bullets read like sticker chips, not full sentences.

## Case study pattern

Each project in `/lib/site.ts` follows:

```
client → what made it interesting →
  the move we made → the measurable change
```

Numbers belong in the case study summary when honest; if they aren't measured, we say so qualitatively.

## CTA

The single canonical CTA is **"Start a project"**. Secondary CTAs in marketing surfaces use **"Explore services"** or **"See more work"**. Email is shown literally so users can copy it.

## Editorial governance

All copy that ships to the marketing site lives in `/lib/site.ts`. Designers and marketers edit there; engineers don't touch JSX unless structure changes. If you find inline strings in a section component, they should be lifted into `site.ts`.
