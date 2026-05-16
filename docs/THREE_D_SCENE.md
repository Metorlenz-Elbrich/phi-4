# 3D Hero Scene

The hero centerpiece is a **semi-realistic brain** with an internal "idea flow" — glowing paths threading through the volume, with small particles travelling along them and pulsing nodes at the path endpoints.

The brief: not an abstract polyhedron, not a medical render — a clearly recognizable brain that reads as "intelligence in motion".

## Composition

```
BrainScene
└─ Canvas (frameloop = "always" when in viewport, "never" otherwise)
   ├─ ambientLight        (low base illumination)
   ├─ directionalLight    (single key light)
   ├─ pointLight (inner)  (cyan inner glow at brain center)
   └─ Brain (group)
      ├─ BrainShell       ← low-poly deformed sphere, translucent, soft sulci
      └─ IdeaFlow
         ├─ Tube paths    ← 5 CatmullRom curves rendered as thin TubeGeometry
         ├─ Particles     ← 1 instancedMesh, ~15 sphere instances travelling along the curves
         └─ Endpoint nodes ← 1 instancedMesh, pulsing
```

**Total draw calls:** ~9 (1 shell + 5 tubes + 1 particles + 1 nodes + a small handful of overhead).
**Total vertices:** ~4 k.
**Lights:** 3.

## The shell

A `SphereGeometry(1, 48, 32)` (1 568 verts) is deformed in three passes:

1. **Proportion scaling** — `(x, y, z) *= (1.28, 1.0, 1.12)` to give brain-ish width and depth.
2. **Interhemispheric fissure** — a Gaussian groove down the top centre lowers `y` slightly.
3. **Subtle sulci/gyri** — three layered sinusoidal bumps along the normal, tuned small enough that the surface reads as "folded", not noisy.
4. **Bottom flatten** — a gentle damp where the brainstem would attach.

Normals are recomputed at the end.

Material: `MeshStandardMaterial` with **transparency, low opacity (0.32), and depth-write off**. This lets the inner paths and particles read through the shell while keeping cost low — no `MeshTransmissionMaterial`, no environment HDR loading. The emissive intensity slowly pulses in `useFrame` to suggest internal glow.

## Idea flow

`buildFlow(5)` produces five deterministic curves using a seeded RNG so the visual is stable across renders. Each curve:

- has 5 sampled control points,
- spirals roughly in a single quadrant of the brain so paths don't all overlap visually,
- is wrapped in a `TubeGeometry(curve, 64, 0.006, 5, false)` — a thin glowing pipe.

**Particles** are a **single `instancedMesh`** with `5 × 3 = 15` instances. Per frame, each instance moves along its curve via `curve.getPoint(u)` and its scale pulses subtly. One `instanceMatrix.needsUpdate = true` call per frame, one draw call total.

**Endpoint nodes** are another single `instancedMesh` (~10 instances). Positions are written once on mount; the whole group pulses via a single `scale` update per frame rather than per-instance.

## Materials

- **Shell:** `MeshStandardMaterial`, translucent, depth-write off, emissive cyan.
- **Tubes:** `MeshBasicMaterial`, additive-feel via `toneMapped: false` so they don't get clamped.
- **Particles & nodes:** `MeshStandardMaterial` with high emissive intensity (2.4 / 1.6), also `toneMapped: false`.

No `MeshTransmissionMaterial`, no `MeshPhysicalMaterial` clearcoat, no environment map.

## Motion

- **Idle float** — `position.y = sin(t * 0.6) * 0.06`.
- **Slow rotation** — `rotation.y += 0.0008` per frame.
- **Pointer parallax** — lerp toward normalised pointer with factor 0.04; gentle, never aggressive.
- **Particle travel** — `u = (t * 0.12 + offset) % 1`. Slow enough to read.
- **Pulses** — node scale and shell emissive intensity follow low-frequency sines (1.6 Hz and 0.6 Hz respectively).

## Performance gates

| Gate                           | Behaviour                                                |
|--------------------------------|----------------------------------------------------------|
| `useIsMobile()` (Hero)         | Below 768px → render `BrainStatic` (SVG fallback)        |
| `usePrefersReducedMotion()`    | Reduced motion → render `BrainStatic`                    |
| `IntersectionObserver` (Canvas)| Off-screen → `frameloop="never"`, zero per-frame cost    |
| `dpr={[1, 1.5]}`               | Pixel ratio capped — no 3× retina overdraw              |
| `dynamic(... { ssr: false })`  | The whole scene is split off the initial JS bundle       |

## Customisation

- **Brand colours** — `ACCENT_CYAN`, `ACCENT_VIOLET` constants at the top of `BrainScene.tsx`.
- **Brain proportions** — `v.x *= 1.28; v.y *= 1.0; v.z *= 1.12` in `makeBrainGeometry`.
- **Number of paths** — `buildFlow(5)` in `IdeaFlow`. Each path adds ~5 verts on the curve and 3 particles.
- **Particle speed** — `t * 0.12` in `IdeaFlow.useFrame`.
- **Shell translucency** — `opacity={0.32}` in `BrainShell`.

## Mobile / no-WebGL fallback

`BrainStatic` renders a pure SVG idea-flow:

- a two-lobe brain silhouette,
- 13 pulsing nodes,
- 20 connecting edges,
- one travelling pulse along the central fissure (SVG `<animateMotion>`),
- two CSS-animated ambient halos.

The whole fallback is ≤ 4 KB and paints in the first frame.
