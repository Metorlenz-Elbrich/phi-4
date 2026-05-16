"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrainVisual } from "@/components/visuals/BrainVisual";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16"
    >
      {/* A single soft ambient field — keeps the hero light. */}
      <div
        aria-hidden
        className="ambient-glow"
        style={{
          width: "52rem",
          height: "52rem",
          left: "-10%",
          top: "-15%",
          background:
            "radial-gradient(circle, hsl(var(--brand-cyan) / 0.22) 0%, transparent 65%)",
        }}
      />

      <div className="container relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="lg:col-span-7"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
            <span>Creative technology studio</span>
          </motion.div>

          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-7xl lg:leading-[1.02]">
            Ideas with a <span className="text-gradient">brain</span>.
            <br className="hidden sm:block" />
            <span> Products with a </span>
            <span className="text-gradient-cyan">soul</span>.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
          >
            We design, build, and secure websites, web apps, and mobile
            experiences for ambitious teams. Premium craft, startup energy,
            and the engineering taste to make it last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#contact">
              <Button size="lg">
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#services">
              <Button size="lg" variant="secondary">
                Explore services
              </Button>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-md lg:col-span-5 lg:max-w-none"
        >
          <BrainVisual className="h-full w-full" />
        </motion.div>
      </div>
    </section>
  );
}
