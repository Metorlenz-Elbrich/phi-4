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
    <header className="fixed inset-x-0 top-0 z-50 py-3 sm:py-4">
      <div className="container">
        <div
          className={cn(
            // Fixed height — never grows on scroll, only the chrome changes.
            "flex h-12 items-center justify-between rounded-full px-3 transition-[background-color,border-color,box-shadow] duration-300 sm:h-14 sm:px-5",
            scrolled
              ? "border border-border bg-background/80 shadow-[0_6px_30px_-12px_hsl(var(--brand-cyan)/0.25)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          )}
        >
          <Link
            href="#top"
            className="group flex h-full items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-8 sm:w-8">
              <Image
                src="/assets/phibrain-logo.png"
                alt="PhiBrain"
                fill
                sizes="32px"
                className="object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="font-display text-sm sm:text-base">
              Phi<span className="text-gradient-cyan">Brain</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:px-4"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle className="h-9 w-9 sm:h-10 sm:w-10" />
            <a href="#contact" className="hidden sm:block">
              <Button size="sm">Start a project</Button>
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur md:hidden"
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
