"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/lib/site";
import { cn } from "@/lib/utils";

const accentBg: Record<Project["accent"], string> = {
  cyan: "from-brand-cyan/20 via-transparent to-brand-violet/10",
  violet: "from-brand-violet/20 via-transparent to-brand-coral/10",
  coral: "from-brand-coral/20 via-transparent to-brand-amber/10",
  amber: "from-brand-amber/20 via-transparent to-brand-coral/10",
  mint: "from-brand-mint/20 via-transparent to-brand-cyan/10",
};

const accentPattern: Record<Project["accent"], string> = {
  cyan: "hsl(var(--brand-cyan))",
  violet: "hsl(var(--brand-violet))",
  coral: "hsl(var(--brand-coral))",
  amber: "hsl(var(--brand-amber))",
  mint: "hsl(var(--brand-mint))",
};

function PatternArt({ accent, variant }: { accent: Project["accent"]; variant: string }) {
  const color = accentPattern[accent];
  // Per-project signature illustrations rendered as SVG so they're crisp & light.
  switch (variant) {
    case "lumen":
      return (
        <svg viewBox="0 0 400 260" className="h-full w-full">
          <defs>
            <linearGradient id="g-lumen" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {Array.from({ length: 7 }).map((_, i) => (
            <circle
              key={i}
              cx={200}
              cy={130}
              r={20 + i * 18}
              fill="none"
              stroke="url(#g-lumen)"
              strokeWidth="1"
              opacity={0.6 - i * 0.06}
            />
          ))}
          <circle cx={200} cy={130} r={12} fill={color} opacity={0.8} />
        </svg>
      );
    case "northwind":
      return (
        <svg viewBox="0 0 400 260" className="h-full w-full">
          {Array.from({ length: 16 }).map((_, i) => (
            <rect
              key={i}
              x={20 + i * 23}
              y={130 - Math.abs(Math.sin(i / 2)) * 70}
              width="14"
              height={Math.abs(Math.sin(i / 2)) * 140 + 10}
              rx="6"
              fill={color}
              opacity={0.25 + (i % 4) * 0.18}
            />
          ))}
        </svg>
      );
    case "atlas":
      return (
        <svg viewBox="0 0 400 260" className="h-full w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`l-${i}`}
              x1="0"
              x2="400"
              y1={20 + i * 24}
              y2={20 + i * 24 + (i % 2 ? 14 : -8)}
              stroke={color}
              strokeWidth="0.7"
              opacity={0.45}
            />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <circle
              key={`n-${i}`}
              cx={(i * 53) % 400}
              cy={20 + ((i * 41) % 220)}
              r="3"
              fill={color}
            />
          ))}
        </svg>
      );
    case "halo":
      return (
        <svg viewBox="0 0 400 260" className="h-full w-full">
          <defs>
            <radialGradient id="g-halo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor={color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="130" r="110" fill="url(#g-halo)" />
          {Array.from({ length: 5 }).map((_, i) => (
            <ellipse
              key={i}
              cx="200"
              cy="130"
              rx={80 + i * 20}
              ry={18 + i * 4}
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              opacity={0.7 - i * 0.12}
              transform={`rotate(${i * 20} 200 130)`}
            />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

function Card({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className={cn("relative aspect-[16/10] bg-gradient-to-br", accentBg[project.accent])}>
        <PatternArt accent={project.accent} variant={project.id} />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/0 to-transparent" />
      </div>
      <div className="relative p-7">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.18em]">
            {project.client}
          </span>
          <span>{project.year}</span>
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-brand-cyan">
          View case study
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative scroll-mt-24 py-28">
      <div
        className="ambient-glow"
        style={{
          width: "30rem",
          height: "30rem",
          left: "-5%",
          top: "20%",
          background:
            "radial-gradient(circle, hsl(var(--brand-coral) / 0.18) 0%, transparent 60%)",
        }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral animate-glow-pulse" />
              Selected work
            </div>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Products we've{" "}
              <span className="text-gradient">poured the brain into</span>.
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground">
            A handful of recent work — from healthtech to logistics, from a single landing
            page to multi-platform product suites.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Card key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
