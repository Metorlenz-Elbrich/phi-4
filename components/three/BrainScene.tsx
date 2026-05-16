"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

/**
 * BrainScene
 * ------------------------------------------------------------------
 * A premium 3D interpretation of the PhiBrain logo.
 *
 * Left hemisphere  → structured circuit lattice (engineering / precision)
 * Right hemisphere → organic glowing node network (creativity / fluidity)
 * Center spine     → glass-like luminous core (the "phi" connector)
 *
 * The form preserves the recognizable brain silhouette and reacts to
 * pointer movement, scroll, and an idle floating animation.
 */

const CYAN = new THREE.Color("#22d3ee");
const VIOLET = new THREE.Color("#a78bfa");
const CORAL = new THREE.Color("#fb923c");
const MINT = new THREE.Color("#34d399");

function brainSurface(u: number, v: number) {
  // Build a smooth brain-like silhouette as a deformed ellipsoid.
  // u: 0..1 longitude (around vertical axis), v: 0..1 latitude.
  const lon = u * Math.PI * 2;
  const lat = v * Math.PI;

  const a = 1.45; // x — width
  const b = 1.05; // y — height
  const c = 1.15; // z — depth

  let x = a * Math.sin(lat) * Math.cos(lon);
  const y = b * Math.cos(lat);
  let z = c * Math.sin(lat) * Math.sin(lon);

  // Brain-ish lobes: a fold along x and a flatten at the bottom.
  const fold = 0.18 * Math.sin(lon * 2) * Math.sin(lat * 1.6);
  z += fold;

  // Slight pinch at the top (frontal/parietal cleft hint).
  const cleft = 0.12 * Math.exp(-Math.pow((v - 0.15) * 5, 2)) * Math.cos(lon);
  x += cleft;

  // Subtle bottom flatten (brainstem area trimmed).
  const flatten = 0.15 * Math.exp(-Math.pow((v - 0.95) * 4, 2));
  return new THREE.Vector3(x, y - flatten, z);
}

// ---------- Right hemisphere: organic node network ----------
function NodeNetwork({ accent = CYAN }: { accent?: THREE.Color }) {
  const group = useRef<THREE.Group>(null);

  const { nodes, edges } = useMemo(() => {
    const ns: THREE.Vector3[] = [];
    const count = 64;
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 0.5; // right hemisphere: u in 0..0.5
      const v = 0.15 + Math.random() * 0.7;
      const p = brainSurface(u, v).multiplyScalar(0.95 + Math.random() * 0.08);
      ns.push(p);
    }
    // Build sparse edges to nearest neighbors.
    const es: [THREE.Vector3, THREE.Vector3][] = [];
    ns.forEach((p, i) => {
      const ranked = ns
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      ranked.forEach((r) => {
        if (i < r.j) es.push([p, ns[r.j]]);
      });
    });
    return { nodes: ns, edges: es };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        const mat = m.material as THREE.MeshStandardMaterial;
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.4 + i * 0.7);
        mat.emissiveIntensity = pulse * 1.6;
      }
    });
  });

  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p.toArray()}>
          <sphereGeometry args={[0.022 + (i % 5) * 0.004, 12, 12]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.3}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      ))}
      {edges.map(([a, b], i) => {
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        );
        const m = new THREE.Matrix4().compose(mid, quat, new THREE.Vector3(1, 1, 1));
        return (
          <mesh key={`e-${i}`} matrix={m} matrixAutoUpdate={false}>
            <cylinderGeometry args={[0.003, 0.003, len, 6]} />
            <meshBasicMaterial color={accent} transparent opacity={0.45} />
          </mesh>
        );
      })}
    </group>
  );
}

// ---------- Left hemisphere: circuit lattice ----------
function CircuitLattice({ accent = VIOLET }: { accent?: THREE.Color }) {
  const group = useRef<THREE.Group>(null);

  const traces = useMemo(() => {
    const lines: { points: THREE.Vector3[]; key: string }[] = [];
    const rows = 8;
    const cols = 12;
    for (let r = 0; r < rows; r++) {
      const v = 0.18 + (r / rows) * 0.7;
      const pts: THREE.Vector3[] = [];
      for (let c = 0; c <= cols; c++) {
        const u = 0.5 + (c / cols) * 0.5; // left hemisphere
        const p = brainSurface(u, v).multiplyScalar(1.005);
        pts.push(p);
      }
      lines.push({ points: pts, key: `h-${r}` });
    }
    // Vertical-ish strokes
    for (let c = 0; c < cols; c += 2) {
      const u = 0.5 + (c / cols) * 0.5;
      const pts: THREE.Vector3[] = [];
      for (let r = 0; r <= rows; r++) {
        const v = 0.18 + (r / rows) * 0.7;
        const p = brainSurface(u, v).multiplyScalar(1.005);
        pts.push(p);
      }
      lines.push({ points: pts, key: `v-${c}` });
    }
    return lines;
  }, []);

  const chips = useMemo(() => {
    const cs: THREE.Vector3[] = [];
    for (let i = 0; i < 22; i++) {
      const u = 0.5 + Math.random() * 0.5;
      const v = 0.2 + Math.random() * 0.65;
      cs.push(brainSurface(u, v).multiplyScalar(1.02));
    }
    return cs;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry.type === "BoxGeometry") {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.8 + Math.sin(t * 2 + i) * 0.6;
      }
    });
  });

  return (
    <group ref={group}>
      {traces.map((t) => {
        const geom = new THREE.BufferGeometry().setFromPoints(t.points);
        const mat = new THREE.LineBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.55,
        });
        const line = new THREE.Line(geom, mat);
        return <primitive key={t.key} object={line} />;
      })}
      {chips.map((p, i) => (
        <mesh key={i} position={p.toArray()}>
          <boxGeometry args={[0.05, 0.012, 0.05]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.2}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Brain shell ----------
function BrainShell() {
  const ref = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => {
    const segU = 96;
    const segV = 48;
    const g = new THREE.BufferGeometry();
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segV; i++) {
      for (let j = 0; j <= segU; j++) {
        const u = j / segU;
        const v = i / segV;
        const p = brainSurface(u, v);
        positions.push(p.x, p.y, p.z);
        normals.push(p.x, p.y, p.z);
      }
    }
    for (let i = 0; i < segV; i++) {
      for (let j = 0; j < segU; j++) {
        const a = i * (segU + 1) + j;
        const b = a + segU + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh ref={ref} geometry={geom}>
      <MeshTransmissionMaterial
        thickness={0.6}
        roughness={0.18}
        chromaticAberration={0.06}
        anisotropy={0.4}
        distortion={0.25}
        distortionScale={0.4}
        temporalDistortion={0.1}
        ior={1.35}
        transmission={0.92}
        color="#9bf8ff"
        attenuationColor="#22d3ee"
        attenuationDistance={2.2}
        backside={false}
      />
    </mesh>
  );
}

// ---------- Central seam (the phi spine) ----------
function PhiSpine() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
  });
  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[0.55, 0.012, 12, 96]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.5, 16]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

// ---------- The combined brain ----------
function Brain({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetY = pointer.current.x * 0.5;
    const targetX = -pointer.current.y * 0.3;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    group.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={group}>
        <BrainShell />
        <NodeNetwork accent={CYAN} />
        <CircuitLattice accent={VIOLET} />
        <PhiSpine />
        {/* Accent glow points */}
        <pointLight position={[1.4, 0.5, 1.2]} color={CYAN} intensity={2.2} distance={5} />
        <pointLight position={[-1.4, 0.3, 1.2]} color={VIOLET} intensity={1.8} distance={5} />
        <pointLight position={[0, 1.3, 0.8]} color={CORAL} intensity={1.2} distance={4} />
        <pointLight position={[0, -1.0, 0.8]} color={MINT} intensity={1.0} distance={4} />
      </group>
    </Float>
  );
}

function Scene() {
  const pointer = useRef({ x: 0, y: 0 });
  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <group onPointerMove={onPointerMove}>
      <ambientLight intensity={isDark ? 0.3 : 0.65} />
      <directionalLight position={[3, 4, 5]} intensity={isDark ? 0.9 : 1.4} />
      <Suspense fallback={null}>
        <Brain pointer={pointer} />
        <Environment preset={isDark ? "night" : "city"} />
      </Suspense>
    </group>
  );
}

export function BrainScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.2, 4.6], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
