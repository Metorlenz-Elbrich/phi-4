"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrainStatic } from "@/components/three/BrainStatic";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

const BrainScene = dynamic(
  () => import("@/components/three/BrainScene").then((m) => m.BrainScene),
  { ssr: false, loading: () => null }
);

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const useThree = !isMobile && !reduced;

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16"
    >
      {/* Ambient gradient field — softer, more breathing room */}
      <div
        className="ambient-glow"
        style={{
          width: "55rem",
          height: "55rem",
          left: "-15%",
          top: "-20%",
          background:
            "radial-gradient(circle, hsl(var(--brand-cyan) / 0.28) 0%, transparent 65%)",
        }}
      />
      <div
        className="ambient-glow"
        style={{
          width: "45rem",
          height: "45rem",
          right: "-10%",
          top: "20%",
          background:
            "radial-gradient(circle, hsl(var(--brand-violet) / 0.22) 0%, transparent 65%)",
        }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 bg-grid-pattern [background-size:64px_64px] opacity-[0.18] mask-fade-bottom" />

      <div className="container relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
            <span>Creative technology studio · est. 2019</span>
          </motion.div>

          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-7xl lg:leading-[1.02]">
            Ideas with a <span className="text-gradient">brain</span>.
            <br className="hidden sm:block" />
            <span className="sm:ml-0"> Products with a </span>
            <span className="text-gradient-cyan">soul</span>.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
          >
            We design, build, and secure websites, web apps, and mobile experiences for
            ambitious teams. Premium craft, startup energy, and the engineering taste to
            make it last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-3 text-xs sm:mt-12 sm:gap-6 sm:text-sm"
          >
            <div>
              <div className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                120+
              </div>
              <div className="text-muted-foreground">products shipped</div>
            </div>
            <div>
              <div className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                14
              </div>
              <div className="text-muted-foreground">countries served</div>
            </div>
            <div>
              <div className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                99.9%
              </div>
              <div className="text-muted-foreground">on-time delivery</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease }}
          className="relative aspect-square w-full lg:col-span-6"
        >
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-brand-cyan/10 via-transparent to-brand-violet/10 blur-2xl" />
          {useThree ? (
            <BrainScene className="h-full w-full" />
          ) : (
            <BrainStatic className="h-full w-full" />
          )}
        </motion.div>
      </div>
    </section>
  );
}
