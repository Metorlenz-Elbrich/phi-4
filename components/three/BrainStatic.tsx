"use client";

import Image from "next/image";

/**
 * Lightweight fallback shown on mobile / reduced-motion / when WebGL is unavailable.
 * Uses the official PhiBrain logo with an ambient halo so the hero never feels empty.
 */
export function BrainStatic({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        className="ambient-glow"
        style={{
          width: "70%",
          height: "70%",
          background:
            "radial-gradient(circle, hsl(var(--brand-cyan) / 0.45) 0%, transparent 65%)",
        }}
      />
      <div
        className="ambient-glow"
        style={{
          width: "55%",
          height: "55%",
          left: "20%",
          top: "30%",
          background:
            "radial-gradient(circle, hsl(var(--brand-violet) / 0.35) 0%, transparent 65%)",
        }}
      />
      <Image
        src="/assets/phibrain-logo.png"
        alt="PhiBrain logo"
        width={420}
        height={420}
        priority
        className="relative z-10 max-w-[min(70vw,420px)] animate-float drop-shadow-[0_20px_60px_hsl(var(--brand-cyan)/0.35)]"
      />
    </div>
  );
}
