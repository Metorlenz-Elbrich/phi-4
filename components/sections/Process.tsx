"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { processSteps } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!mounted) return;
      gsap.registerPlugin(ScrollTrigger);

      const el = containerRef.current;
      if (!el) return;

      ctx = gsap.context(() => {
        const steps = gsap.utils.toArray<HTMLElement>(".process-step");
        gsap.fromTo(
          ".process-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              end: "bottom 70%",
              scrub: 0.5,
            },
          }
        );
        steps.forEach((s, i) => {
          gsap.fromTo(
            s,
            { opacity: 0.35, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              duration: 0.9,
              scrollTrigger: {
                trigger: s,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
              delay: i * 0.05,
            }
          );
        });
      }, el);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section id="process" className="relative scroll-mt-24 py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-violet animate-glow-pulse" />
            How we work
          </div>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            From <span className="text-gradient-cyan">idea</span> to{" "}
            <span className="text-gradient">launch</span> — and the months after.
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative mx-auto mt-20 max-w-4xl">
          <div className="absolute left-6 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />
          <div
            className="process-progress absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-brand-cyan via-brand-violet to-brand-coral md:left-1/2 md:-translate-x-1/2"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="flex flex-col gap-12 md:gap-20">
            {processSteps.map((step, i) => {
              const isRight = i % 2 === 1;
              return (
                <div
                  key={step.index}
                  className={`process-step relative grid grid-cols-1 items-center md:grid-cols-2 md:gap-8 ${
                    isRight ? "md:[&>:first-child]:order-2" : ""
                  }`}
                >
                  <div
                    className={`relative pl-16 md:pl-0 ${
                      isRight ? "md:pl-16 md:pr-0 md:text-left" : "md:pr-16 md:text-right"
                    }`}
                  >
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
                      {step.index}
                    </div>
                    <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  <div className="hidden md:block" />

                  <span className="absolute left-6 top-2 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-1/2">
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-brand-cyan opacity-60 blur-[3px]" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
