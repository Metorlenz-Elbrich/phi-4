"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cinematic horizontal-pin scroll telling the PhiBrain transformation arc:
 *   Spark → Sketch → System → Ship.
 * Falls back to a clean vertical stack when reduced motion is preferred or
 * GSAP fails to load.
 */
const chapters = [
  {
    label: "Spark",
    title: "A messy idea — out loud.",
    body:
      "It usually starts with a voice note, a slide, a sketch on a napkin. We listen, then mirror it back as a sharp scope written in plain language.",
    accent: "cyan" as const,
  },
  {
    label: "Sketch",
    title: "Flows. Wireframes. A first feel.",
    body:
      "Design moves fast and stays honest. Real content, real flows, a click-through prototype your team can actually use.",
    accent: "violet" as const,
  },
  {
    label: "System",
    title: "Tokens, types, and a tidy repo.",
    body:
      "Tokens become Tailwind, components become TypeScript, decisions become docs. The same repo that ships the marketing site can ship the app.",
    accent: "coral" as const,
  },
  {
    label: "Ship",
    title: "Live in the wild — and looked after.",
    body:
      "Launch is the start, not the end. We watch performance, security, and the product analytics, and we iterate weekly.",
    accent: "mint" as const,
  },
];

const accentColors = {
  cyan: "hsl(var(--brand-cyan))",
  violet: "hsl(var(--brand-violet))",
  coral: "hsl(var(--brand-coral))",
  mint: "hsl(var(--brand-mint))",
} as const;

export function Storytelling() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let mounted = true;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!mounted) return;
      gsap.registerPlugin(ScrollTrigger);

      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      ctx = gsap.context(() => {
        const totalScroll = () => track.scrollWidth - window.innerWidth;
        const horizontalTween = gsap.to(track, {
          x: () => -totalScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: () => `+=${totalScroll()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".chapter-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".chapter-inner"),
            { opacity: 0.2, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "left 70%",
                end: "left 30%",
                scrub: 0.5,
                containerAnimation: horizontalTween,
              },
            }
          );
        });
      }, wrapper);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section className="relative scroll-mt-24 py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-amber animate-glow-pulse" />
            How an idea becomes a product
          </div>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The path from <span className="text-gradient">spark</span> to{" "}
            <span className="text-gradient-cyan">ship</span>.
          </h2>
        </motion.div>
      </div>

      <div
        ref={wrapperRef}
        className="relative mt-16 h-[100svh] w-full overflow-hidden md:block"
      >
        <div
          ref={trackRef}
          className="flex h-full w-max items-center gap-8 px-[10vw] md:gap-12"
        >
          {chapters.map((c, i) => (
            <article
              key={c.label}
              className="chapter-card relative flex h-[70vh] w-[80vw] shrink-0 items-center justify-center overflow-hidden rounded-[2.5rem] border border-border bg-card/50 p-10 md:w-[60vw] lg:w-[44vw]"
            >
              <div
                className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${
                    accentColors[c.accent]
                  } 0%, transparent 65%)`,
                  opacity: 0.35,
                }}
              />
              <div
                className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full blur-3xl opacity-25"
                style={{
                  background: `radial-gradient(circle, ${accentColors[c.accent]} 0%, transparent 70%)`,
                }}
              />

              <div className="chapter-inner relative max-w-md text-left">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-mono text-foreground"
                    style={{
                      background: `${accentColors[c.accent]}20`,
                      border: `1px solid ${accentColors[c.accent]}55`,
                      color: accentColors[c.accent],
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.22em]"
                    style={{ color: accentColors[c.accent] }}
                  >
                    {c.label}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {c.title}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </div>
            </article>
          ))}

          {/* Outro card */}
          <article className="relative flex h-[70vh] w-[80vw] shrink-0 items-center justify-center overflow-hidden rounded-[2.5rem] border border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 via-card to-brand-violet/10 p-10 md:w-[50vw] lg:w-[38vw]">
            <div className="text-center">
              <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Your story <span className="text-gradient">starts here</span>.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Three to twelve weeks from kickoff to launch, depending on scope.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
