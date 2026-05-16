"use client";

const words = [
  "Premium craft",
  "Startup energy",
  "Engineering taste",
  "Pixel-true UI",
  "Secure by design",
  "Shipped weekly",
  "Design tokens",
  "WCAG AA",
  "Edge-rendered",
  "Brand-led",
];

export function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card/40 py-6">
      <div className="mask-fade-edges flex gap-12 whitespace-nowrap animate-marquee will-change-transform">
        {[...words, ...words, ...words].map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-lg font-medium text-muted-foreground"
          >
            {w}
            <span className="h-1 w-1 rounded-full bg-brand-cyan/60" />
          </span>
        ))}
      </div>
    </section>
  );
}
