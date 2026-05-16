"use client";

import Image from "next/image";

/**
 * BrainVisual
 * ------------------------------------------------------------------
 * The hero centerpiece — the official PhiBrain logo, lifted by:
 *   • soft cyan + violet radial halos behind the brain
 *   • a slow CSS float on the logo itself
 *   • two SVG orbital rings + 8 pulsing idea-particles
 *
 * No WebGL, no JS animation loop. Everything animates via CSS / SMIL.
 * Paints in the first frame; the whole module is ≤ 5 KB gzipped.
 */

const PARTICLES = Array.from({ length: 8 }).map((_, i) => {
  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
  const radius = 88;
  return {
    cx: 100 + Math.cos(angle) * radius,
    cy: 100 + Math.sin(angle) * radius,
    delay: i * 0.55,
  };
});

export function BrainVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Soft brand halos behind the brain */}
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-brand-cyan/25 blur-3xl" />
      <div className="pointer-events-none absolute left-[18%] top-[22%] h-[50%] w-[50%] rounded-full bg-brand-violet/15 blur-3xl" />

      {/* SVG ambient layer — orbital rings + idea particles */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="hsl(var(--brand-cyan) / 0.22)"
          strokeWidth="0.5"
          strokeDasharray="3 6"
        />
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke="hsl(var(--brand-violet) / 0.18)"
          strokeWidth="0.4"
          strokeDasharray="1 4"
        />

        {PARTICLES.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="1.6"
            fill="hsl(var(--brand-cyan))"
          >
            <animate
              attributeName="opacity"
              values="0.25;1;0.25"
              dur="3.6s"
              begin={`${p.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="1;2.2;1"
              dur="3.6s"
              begin={`${p.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* A single travelling thought along the inner ring */}
        <circle r="2" fill="hsl(var(--brand-violet))" opacity="0.85">
          <animateMotion
            dur="10s"
            repeatCount="indefinite"
            path="M 100,22 a 78,78 0 1,1 0,156 a 78,78 0 1,1 0,-156"
          />
        </circle>
      </svg>

      {/* The brain — official PhiBrain logo */}
      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src="/assets/phibrain-logo.png"
          alt="PhiBrain"
          width={420}
          height={420}
          priority
          sizes="(max-width: 768px) 70vw, 420px"
          className="relative z-10 max-w-[78%] animate-float drop-shadow-[0_24px_60px_hsl(var(--brand-cyan)/0.35)]"
        />
      </div>
    </div>
  );
}
