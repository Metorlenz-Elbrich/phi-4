"use client";

import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/40 py-14">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8">
                <Image
                  src="/assets/phibrain-logo.png"
                  alt="PhiBrain"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-display text-base font-semibold">
                Phi<span className="text-gradient-cyan">Brain</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A creative technology studio. We design, build, and secure beautiful digital
              products for ambitious teams.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={site.social.github}
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={site.social.linkedin}
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={site.social.twitter}
                aria-label="Twitter"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Studio
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-foreground/80 transition-colors hover:text-brand-cyan"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Get in touch
            </h4>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 block font-display text-xl text-foreground transition-colors hover:text-brand-cyan"
            >
              {site.email}
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Available worldwide. Remote-first, with hubs in EU & MEA.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} PhiBrain. Crafted with care.</p>
          <p className="font-mono">
            Built with Next.js · React Three Fiber · GSAP · Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
