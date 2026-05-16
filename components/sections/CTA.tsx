"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export function CTA() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28 lg:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-card p-7 sm:rounded-[2.5rem] sm:p-12 lg:p-16"
        >
          {/* Decorative glows */}
          <div
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--brand-cyan) / 0.5) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--brand-violet) / 0.4) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute right-1/3 top-1/2 h-72 w-72 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--brand-coral) / 0.25) 0%, transparent 60%)",
            }}
          />

          {/* Logo watermark */}
          <div className="pointer-events-none absolute right-6 top-6 h-28 w-28 opacity-30 sm:right-10 sm:top-10 sm:h-40 sm:w-40">
            <Image
              src="/assets/phibrain-logo.png"
              alt=""
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-glow-pulse" />
              Let's make something
            </div>
            <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl">
              Bring us the idea.{" "}
              <span className="text-gradient">We'll bring the brain</span>.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base lg:text-lg">
              Tell us about your product, your team, your timeline. We'll come back inside
              one business day with a sharp scope and a clear next step.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={`mailto:${site.email}`}>
                <Button size="lg">
                  Email the team
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#work">
                <Button size="lg" variant="secondary">
                  See more work
                </Button>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-brand-cyan" />
              <a
                href={`mailto:${site.email}`}
                className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {site.email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
