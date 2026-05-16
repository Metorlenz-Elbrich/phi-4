# 3D Hero Scene

The hero centerpiece is a 3D interpretation of the PhiBrain logo brain. It is **not** an abstract polyhedron — it preserves the recognizable two-hemisphere silhouette of the source logo.

## Composition

```
BrainScene
└─ Canvas
   ├─ ambientLight + directionalLight
   ├─ <Environment preset="night" | "city" />
   └─ Brain (group)
      ├─ BrainShell           ← glass-like transmission material on a brain-shaped mesh
      ├─ NodeNetwork          ← right hemisphere: organic glowing nodes + edges
      ├─ CircuitLattice       ← left hemisphere: structured grid + circuit chips
      ├─ PhiSpine             ← central torus + cylinder (the connecting "phi")
      └─ pointLight × 4       ← coloured accent lights
```

## The shell

`brainSurface(u, v)` generates a parametric mesh from a deformed ellipsoid:

```
x = a · sin(πv) · cos(2πu) + cleft(v) · cos(2πu)
y = b · cos(πv) − flatten(v)
z = c · sin(πv) · sin(2πu) + fold(u, v)
```

- `a, b, c` are the brain's width/height/depth (1.45 / 1.05 / 1.15).
- `fold` introduces a longitudinal wave (the lobe groove).
- `cleft` adds a small frontal pinch at the top.
- `flatten` trims the bottom to suggest the brainstem cutoff.

The shell uses `<MeshTransmissionMaterial>` from `@react-three/drei` for glass-like refraction. It's tinted toward cyan (`#9bf8ff`) so the brand colour reads even at low light.

## Hemispheres

The same `brainSurface` function generates the support meshes — that's what guarantees both hemispheres sit on the brain silhouette instead of floating inside an abstract bubble.

**Right hemisphere (organic):** 64 nodes sampled at `u ∈ [0, 0.5]`, connected to their two nearest neighbours. Each node is a small sphere with cyan emissive material; edges are thin cylinders with translucent base material.

**Left hemisphere (structured):** A grid of "trace" polylines sampled at `u ∈ [0.5, 1]` on `(rows × cols) = (8 × 12)`. Twenty-two box meshes act as circuit "chips" scattered along the lattice.

## Lighting

| Light                   | Colour          | Purpose                          |
|-------------------------|------------------|----------------------------------|
| `ambientLight`          | neutral          | Base illumination                |
| `directionalLight`      | warm white       | Primary modelling light          |
| Right pointLight        | cyan             | Accent the node network          |
| Left pointLight         | violet           | Accent the circuit lattice       |
| Top pointLight          | coral            | Warmth, breaks coldness          |
| Bottom pointLight       | mint             | Reflection / colour balance      |
| `<Environment>`         | night / city     | Adapts to theme for transmission |

## Interaction

- **Idle:** `<Float>` from drei keeps the form gently bobbing.
- **Pointer:** `onPointerMove` writes normalised coords into a `useRef`; `useFrame` lerps rotation toward those targets.
- **Theme:** the `<Environment>` preset and ambient intensity switch when `next-themes` flips dark/light.

## Performance

- `dpr={[1, 1.75]}` caps device pixel ratio.
- `powerPreference: "high-performance"` requests the discrete GPU on laptops.
- The whole scene is **mounted only on non-mobile, non-reduced-motion** clients. On mobile or accessibility mode, the `BrainStatic` component renders the logo with a CSS halo instead.
- All node/edge/chip arrays are computed once in `useMemo`; only emissive intensities update per-frame.

## Customisation

To rebrand the centerpiece without touching geometry, change the `CYAN`, `VIOLET`, `CORAL`, `MINT` constants at the top of `BrainScene.tsx`. To shift the silhouette, edit the `a / b / c` constants and `fold / cleft / flatten` magnitudes in `brainSurface`.
