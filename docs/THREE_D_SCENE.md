# 3D Hero Scene

The hero centerpiece is a **clearly recognizable brain** split into two distinct hemispheres:

- **Left hemisphere — engineering / logic.** A network of structured circuit traces hugging the surface, with small chip-like boxes at sparse grid points.
- **Right hemisphere — creativity / ideas.** Organic branching neurons growing inward from soma cell-bodies, with travelling light particles along the dendrites and pulsing endpoint nodes.

The brief: not an abstract polyhedron, not a medical render — a brain that reads as "intelligence in motion" with both hemispheres immediately distinguishable.

## Composition

```
BrainScene
└─ Canvas (frameloop = "always" when in viewport, "never" otherwise)
   ├─ ambientLight        (low base illumination)
   ├─ directionalLight    (single key light)
   ├─ pointLight (inner)  (cyan inner glow at brain center)
   └─ Brain (group)
      ├─ BrainShell         ← translucent parametric brain (vertex-coloured
      │                       cool on the left, warm on the right)
      ├─ CircuitTraces      ← LineSegments (1 draw) + instanced chips (1 draw)
      ├─ Neurons            ← LineSegments (1 draw) + instanced particles (1 draw)
      │                       + instanced endpoint nodes (1 draw)
      └─ PhiSpine           ← small accent torus along the fissure
```

**Total draw calls:** ~8.
**Total vertices:** ~4 k.
**Lights:** 3.

## The brain shell

Built parametrically on a 64 × 32 grid (~2 k verts). The longitude `u ∈ [0, 1]` maps to azimuth `0 → 2π`. By construction:

- `u ∈ (0, 0.5)` is the **right hemisphere** (`x > 0`)
- `u ∈ (0.5, 1.0)` is the **left hemisphere** (`x < 0`)

`brainPoint(u, v)` deforms an ellipsoid (a=1.35, b=1.0, c=1.12) with:

1. A longitudinal fold to suggest lobes.
2. A Gaussian-shaped interhemispheric fissure along the top centre.
3. A bottom flatten where the brainstem would attach.

Vertex colours blend from neutral white at the centre toward a cool blue on the left and a warm peach on the right, so the hemispheres read as distinct without a hard seam.

Material: `MeshStandardMaterial` with `vertexColors`, `transparent`, `opacity: 0.42`, `depthWrite: false`. Inner emissive cyan pulses slowly over time to suggest internal glow.

## Left hemisphere — circuit traces

A grid of polylines sampled at constant `v` across `u ∈ [0.52, 0.98]`, projected just outside the surface (`× 1.012`):

- 7 horizontal traces × 18 segments each.
- A handful of vertical connectors so the result reads as a circuit rather than stripes.

All segment pairs are flattened into a single `BufferGeometry` and rendered as **one `THREE.LineSegments`** — 1 draw call.

22 "chips" (small flat boxes) are placed at scattered points on the left surface and rendered as a single `instancedMesh`. Each chip is oriented along its surface normal. Emissive intensity pulses subtly via `useFrame`.

## Right hemisphere — neurons + idea flow

`buildNeurons()` generates four soma cell-bodies inside the right hemisphere. Each soma grows 2–3 main dendrites outward, biased toward `+x`. Each dendrite walks 3–4 steps and occasionally throws off a short side-branch.

- The whole branching network → **one `LineSegments`** (1 draw call).
- Each main dendrite path is also kept as a `CatmullRomCurve3` so particles can travel along it.
- **Travelling particles** are a single `instancedMesh` (~14 instances). Each frame, the curve is sampled at `u = (t * 0.13 + offset) % 1` and the instance matrix updated. One `instanceMatrix.needsUpdate` per frame, one draw call.
- **Endpoint nodes** are another single `instancedMesh` (~16 instances). Positions are written once on mount; the whole group pulses via a single `scale` update per frame rather than per-instance.

The neurons are cyan/mint; the circuit traces are violet. This colour split reinforces the hemisphere distinction at a glance.

## Motion

- **Idle float** — `position.y = sin(t * 0.6) * 0.05`.
- **Slow rotation** — `rotation.y += 0.0006` per frame.
- **Pointer parallax** — lerp toward normalised pointer with factor 0.04. Gentle, never aggressive.
- **Particle travel** — `u = (t * 0.13 + offset) % 1`. Slow enough to read.
- **Pulses** — node scale and shell emissive intensity follow low-frequency sines (1.5 Hz and 0.7 Hz respectively).

## Performance gates

| Gate                           | Behaviour                                                |
|--------------------------------|----------------------------------------------------------|
| `useIsMobile()` (Hero)         | Below 768px → render `BrainStatic` (SVG fallback)        |
| `usePrefersReducedMotion()`    | Reduced motion → render `BrainStatic`                    |
| `IntersectionObserver` (Canvas)| Off-screen → `frameloop="never"`, zero per-frame cost    |
| `dpr={[1, 1.5]}`               | Pixel ratio capped — no 3× retina overdraw              |
| `dynamic(... { ssr: false })`  | The whole scene is split off the initial JS bundle       |
| `LineSegments` + `instancedMesh` | All repeating structure goes through 1 draw call each  |

`@react-three/drei` is **not** a dependency. Materials are all plain `MeshStandardMaterial` / `MeshBasicMaterial` — no transmission, no environment HDR, no post-processing.

## Customisation

- **Brand colours** — `CYAN`, `VIOLET`, `MINT` constants at the top of `BrainScene.tsx`.
- **Brain proportions** — `a / b / c` in `brainPoint`.
- **Trace density (left)** — `rows`, `cols` in `CircuitTraces`.
- **Neuron count (right)** — `somaPositions` count + `mainCount` in `buildNeurons`.
- **Particle speed** — `t * 0.13` in `Neurons.useFrame`.
- **Shell translucency** — `opacity={0.42}` in `BrainShell`.

## Mobile / no-WebGL fallback

`BrainStatic` renders a pure SVG idea-flow with a brain silhouette, 13 pulsing nodes, 20 connecting edges, and a travelling pulse via SVG `<animateMotion>`. Total ≤ 4 KB, paints in the first frame, zero JS animation cost beyond the SMIL clock.
