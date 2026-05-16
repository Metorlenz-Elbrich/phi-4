"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="container">
        <div
          className={cn(
            "flex items-center justify-between rounded-full border px-4 transition-all duration-500 sm:px-6",
            scrolled
              ? "border-border bg-background/70 backdrop-blur-xl shadow-[0_6px_30px_-10px_hsl(var(--brand-cyan)/0.25)]"
              : "border-transparent bg-transparent"
          )}
        >
          <Link
            href="#top"
            className="group flex items-center gap-2.5 py-2.5 text-sm font-semibold tracking-tight"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image
                src="/assets/phibrain-logo.png"
                alt="PhiBrain"
                fill
                sizes="32px"
                className="object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="font-display text-base">
              Phi<span className="text-gradient-cyan">Brain</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="#contact" className="hidden sm:block">
              <Button size="sm" className="hidden sm:inline-flex">
                Start a project
              </Button>
            </a>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur md:hidden"
              onClick={() => setOpen((s) => !s)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="mt-2 rounded-3xl border border-border bg-background/90 p-2 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col p-2">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2"
              >
                <Button size="md" className="w-full">
                  Start a project
                </Button>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
