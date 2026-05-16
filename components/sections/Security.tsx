"use client";

import { motion } from "framer-motion";
import { Lock, ShieldCheck, Eye } from "lucide-react";
import { securityPillars, trustBadges } from "@/lib/site";

const icons = [ShieldCheck, Lock, Eye];

export function Security() {
  return (
    <section id="security" className="section-soft relative scroll-mt-24 py-20 sm:py-28 lg:py-32">
      <div
        className="ambient-glow"
        style={{
          width: "38rem",
          height: "38rem",
          right: "-10%",
          top: "0%",
          background:
            "radial-gradient(circle, hsl(var(--brand-cyan) / 0.22) 0%, transparent 60%)",
        }}
      />

      <div className="container">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-glow-pulse" />
              Security
            </div>
            <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl sm:leading-tight lg:text-5xl">
              Secure by design.{" "}
              <span className="text-gradient-cyan">Human by default</span>.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
              Security shouldn't feel like a wall — it should feel like a guardrail. We
              bake hardening, monitoring, and incident response into the same repo as your
              product, with playbooks your team can actually follow.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {trustBadges.map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur"
                >
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid gap-5 lg:col-span-7">
            {securityPillars.map((p, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.1,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all hover:border-brand-cyan/40 sm:p-6 lg:p-7"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-cyan/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
