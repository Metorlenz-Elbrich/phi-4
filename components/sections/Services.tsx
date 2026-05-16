"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Globe,
  Layers,
  PenTool,
  Shield,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { services, type Service } from "@/lib/site";
import { cn } from "@/lib/utils";

const iconMap: Record<Service["icon"], LucideIcon> = {
  globe: Globe,
  layers: Layers,
  smartphone: Smartphone,
  sparkles: Sparkles,
  "pen-tool": PenTool,
  shield: Shield,
  compass: Compass,
};

const accentStyles: Record<Service["accent"], { ring: string; chip: string; glow: string }> = {
  cyan: {
    ring: "from-brand-cyan/40 to-transparent",
    chip: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30",
    glow: "hsl(var(--brand-cyan) / 0.35)",
  },
  violet: {
    ring: "from-brand-violet/40 to-transparent",
    chip: "bg-brand-violet/10 text-brand-violet border-brand-violet/30",
    glow: "hsl(var(--brand-violet) / 0.35)",
  },
  coral: {
    ring: "from-brand-coral/40 to-transparent",
    chip: "bg-brand-coral/10 text-brand-coral border-brand-coral/30",
    glow: "hsl(var(--brand-coral) / 0.35)",
  },
  amber: {
    ring: "from-brand-amber/40 to-transparent",
    chip: "bg-brand-amber/10 text-brand-amber border-brand-amber/30",
    glow: "hsl(var(--brand-amber) / 0.35)",
  },
  mint: {
    ring: "from-brand-mint/40 to-transparent",
    chip: "bg-brand-mint/10 text-brand-mint border-brand-mint/30",
    glow: "hsl(var(--brand-mint) / 0.35)",
  },
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = iconMap[service.icon];
  const style = accentStyles[service.accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        (e.currentTarget as HTMLElement).style.setProperty(
          "--mx",
          `${e.clientX - rect.left}px`
        );
        (e.currentTarget as HTMLElement).style.setProperty(
          "--my",
          `${e.clientY - rect.top}px`
        );
      }}
      className="premium-card group p-6 sm:p-7 lg:p-8"
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r",
          style.ring
        )}
      />

      <div
        className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: style.glow }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
            style.chip
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          0{index + 1}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-2xl font-semibold tracking-tight">
        {service.title}
      </h3>
      <p className="relative mt-2 text-sm font-medium text-foreground/80">
        {service.tagline}
      </p>
      <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {service.bullets.map((b) => (
          <li
            key={b}
            className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
          >
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 py-20 sm:py-28 lg:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-glow-pulse" />
            What we do
          </div>
          <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl sm:leading-tight lg:text-5xl">
            One studio.{" "}
            <span className="text-gradient">Seven crafts</span>.
            <br className="hidden sm:block" />
            <span> All wired into the same brain.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
            From the first sketch to the live product — design, engineering, and security
            shipped by one team that actually talks to each other.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
