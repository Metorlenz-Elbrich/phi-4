"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { processSteps } from "@/lib/site";

/**
 * Process — a four-step timeline.
 * Progress is scrubbed by scroll using framer-motion's useScroll/useTransform.
 * No GSAP, no IntersectionObserver hand-rolled — minimal JS.
 */
export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="process"
      className="section-soft relative scroll-mt-24 py-20 sm:py-28 lg:py-32"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-violet" />
            How we work
          </div>
          <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl sm:leading-tight lg:text-5xl">
            From <span className="text-gradient-cyan">idea</span> to{" "}
            <span className="text-gradient">launch</span>
            <span className="block text-muted-foreground/90 sm:mt-2 sm:inline sm:text-foreground">
              <span className="hidden sm:inline"> — </span>
              and the months after.
            </span>
          </h2>
        </motion.div>

        <div
          ref={containerRef}
          className="relative mx-auto mt-12 max-w-3xl sm:mt-16 lg:mt-20"
        >
          {/* Vertical rail */}
          <div className="absolute left-5 top-0 h-full w-px bg-border" />
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-brand-cyan via-brand-violet to-brand-coral"
          />

          <div className="flex flex-col gap-10 sm:gap-12">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.05,
                }}
                className="relative pl-12"
              >
                <span className="absolute left-5 top-2 flex h-3 w-3 -translate-x-1/2 items-center justify-center">
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-brand-cyan opacity-50 blur-[3px]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet" />
                </span>

                <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
                  {step.index}
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
