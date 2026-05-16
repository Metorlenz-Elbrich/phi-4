"use client";

/**
 * Lightweight idea-flow visualization for mobile / reduced-motion.
 * Pure SVG + CSS animations — paints in the first frame, ≤ 4 KB.
 */

const NODES: Array<[number, number, number]> = [
  [50, 22, 0],
  [72, 32, 0.4],
  [82, 56, 0.8],
  [70, 80, 0.2],
  [50, 90, 0.6],
  [30, 80, 0.3],
  [18, 56, 0.5],
  [28, 32, 0.1],
  [50, 50, 0.7],
  [40, 42, 0.2],
  [60, 42, 0.9],
  [60, 64, 0.5],
  [40, 64, 0.0],
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [8, 0],
  [8, 2],
  [8, 4],
  [8, 6],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 9],
  [9, 1],
  [10, 2],
  [11, 4],
  [12, 6],
];

export function BrainStatic({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        aria-hidden
        className="ambient-glow"
        style={{
          width: "65%",
          height: "65%",
          background:
            "radial-gradient(circle, hsl(var(--brand-cyan) / 0.35) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="ambient-glow"
        style={{
          width: "45%",
          height: "45%",
          left: "25%",
          top: "30%",
          background:
            "radial-gradient(circle, hsl(var(--brand-violet) / 0.25) 0%, transparent 65%)",
        }}
      />

      <svg
        role="img"
        aria-label="PhiBrain — ideas flowing"
        viewBox="0 0 100 100"
        className="relative z-10 max-w-[min(80vw,460px)] drop-shadow-[0_18px_60px_hsl(var(--brand-cyan)/0.3)] animate-float"
      >
        <defs>
          <radialGradient id="brain-fill" cx="0.5" cy="0.45" r="0.5">
            <stop offset="0%" stopColor="hsl(var(--brand-cyan))" stopOpacity="0.22" />
            <stop offset="60%" stopColor="hsl(var(--brand-cyan))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--brand-violet))" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="edge-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-cyan))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--brand-violet))" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Brain silhouette (two-lobe shape) */}
        <path
          d="M50 8
             C 64 8, 76 14, 80 26
             C 88 28, 92 40, 88 50
             C 92 60, 88 72, 80 76
             C 76 88, 64 92, 50 92
             C 36 92, 24 88, 20 76
             C 12 72, 8 60, 12 50
             C 8 40, 12 28, 20 26
             C 24 14, 36 8, 50 8 Z"
          fill="url(#brain-fill)"
          stroke="hsl(var(--brand-cyan) / 0.35)"
          strokeWidth="0.4"
        />

        {/* Central fissure */}
        <path
          d="M50 10 Q 52 30 50 50 Q 48 70 50 90"
          fill="none"
          stroke="hsl(var(--brand-cyan) / 0.35)"
          strokeWidth="0.3"
          strokeDasharray="1 2"
        />

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#edge-grad)"
              strokeWidth="0.35"
              opacity="0.45"
            />
          );
        })}

        {/* Travelling pulse along the central fissure */}
        <circle r="1.2" fill="hsl(var(--brand-cyan))">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M50 10 Q 52 30 50 50 Q 48 70 50 90"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Nodes */}
        {NODES.map(([x, y, delay], i) => (
          <g key={i} style={{ transformOrigin: `${x}px ${y}px` }}>
            <circle
              cx={x}
              cy={y}
              r="1.6"
              fill="hsl(var(--brand-cyan))"
              opacity="0.85"
            >
              <animate
                attributeName="r"
                values="1.2;1.8;1.2"
                dur="3s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.55;1;0.55"
                dur="3s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
