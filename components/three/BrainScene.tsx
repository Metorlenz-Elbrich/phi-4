"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

/**
 * BrainScene
 * ------------------------------------------------------------------
 * A semi-realistic brain with an internal "idea flow":
 *   • A single low-poly translucent brain shell (subtle sulci)
 *   • A handful of glowing tube paths threading the interior
 *   • Small instanced particles travelling along the paths
 *   • Pulsing instanced nodes at the path endpoints
 *
 * Performance budget (the whole scene):
 *   • ~9 draw calls
 *   • ~2k vertices on the shell, ~2.4k across all tubes
 *   • 3 lights total (1 ambient + 1 directional + 1 inner accent)
 *   • DPR capped at 1.5
 *   • frameloop is "always" only while the canvas is in viewport
 *   • No environment HDR, no transmission, no post-processing
 */

const ACCENT_CYAN = new THREE.Color("#22d3ee");
const ACCENT_VIOLET = new THREE.Color("#a78bfa");

// ---------- Geometry: a smooth, brain-ish shell ----------
function makeBrainGeometry() {
  // Low-poly sphere as a base. 48×32 ≈ 1568 verts — plenty for hero scale.
  const geom = new THREE.SphereGeometry(1, 48, 32);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Brain proportions: wider than tall, slightly deeper than wide.
    v.x *= 1.28;
    v.y *= 1.0;
    v.z *= 1.12;

    // Interhemispheric fissure: a soft groove down the top centre.
    const fissure =
      Math.exp(-Math.pow(v.x * 4.5, 2)) * Math.max(v.y - 0.05, 0) * 0.22;
    v.y -= fissure;

    // Subtle sulci/gyri — three layered sinusoidal bumps so the surface
    // reads as "folded" without becoming noisy.
    const sulci =
      Math.sin(v.x * 6.5) * 0.018 +
      Math.cos(v.z * 5.5) * 0.014 +
      Math.sin(v.y * 5.0 + v.z * 2.0) * 0.012;
    const normal = v.clone().normalize();
    v.add(normal.multiplyScalar(sulci));

    // Soft flatten at the bottom (where the brainstem would attach).
    const bottomDamp = Math.exp(-Math.pow((v.y + 0.85) * 4, 2));
    v.y += bottomDamp * 0.08;

    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geom.computeVertexNormals();
  return geom;
}

// Deterministic pseudo-random so curves stay stable across renders.
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ---------- Brain shell ----------
function BrainShell({ tint, inner }: { tint: string; inner: number }) {
  const geom = useMemo(() => makeBrainGeometry(), []);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (!matRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle inner glow pulse.
    matRef.current.emissiveIntensity = inner + Math.sin(t * 0.6) * 0.05;
  });
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial
        ref={matRef}
        color={tint}
        emissive={ACCENT_CYAN}
        emissiveIntensity={inner}
        roughness={0.45}
        metalness={0.1}
        transparent
        opacity={0.32}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ---------- Idea flow: curves + particles + endpoint nodes ----------
type Flow = {
  curves: THREE.CatmullRomCurve3[];
  tubes: THREE.TubeGeometry[];
  endpoints: THREE.Vector3[];
};

function buildFlow(count = 5): Flow {
  const rng = makeRng(7331);
  const curves: THREE.CatmullRomCurve3[] = [];
  const tubes: THREE.TubeGeometry[] = [];
  const endpoints: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const points: THREE.Vector3[] = [];
    const segments = 5;
    // Each curve drifts roughly in one quadrant so paths don't all overlap.
    const baseAngle = (i / count) * Math.PI * 2;

    for (let j = 0; j < segments; j++) {
      const u = j / (segments - 1);
      // Spiral / drift along the brain volume.
      const angle = baseAngle + u * Math.PI * 1.4 + (rng() - 0.5) * 0.4;
      const r = 0.45 + rng() * 0.4;
      const y = (rng() - 0.5) * 1.3;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * r * 1.15,
          y,
          Math.sin(angle) * r * 0.95
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.6);
    curves.push(curve);
    tubes.push(new THREE.TubeGeometry(curve, 64, 0.006, 5, false));
    endpoints.push(points[0].clone(), points[points.length - 1].clone());
  }
  return { curves, tubes, endpoints };
}

function IdeaFlow() {
  const { curves, tubes, endpoints } = useMemo(() => buildFlow(5), []);

  // Tube material — emissive so it reads as a "trace of thought".
  const tubeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ACCENT_CYAN,
        transparent: true,
        opacity: 0.55,
        toneMapped: false,
      }),
    []
  );

  // Particles (instanced, ~3 per curve).
  const PARTICLES_PER_CURVE = 3;
  const totalParticles = curves.length * PARTICLES_PER_CURVE;
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: totalParticles }, () => Math.random()),
    [totalParticles]
  );

  // Endpoint nodes (instanced).
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!nodesRef.current) return;
    endpoints.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      nodesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    nodesRef.current.instanceMatrix.needsUpdate = true;
  }, [endpoints, dummy]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (particlesRef.current) {
      let idx = 0;
      for (let c = 0; c < curves.length; c++) {
        for (let p = 0; p < PARTICLES_PER_CURVE; p++) {
          const u = (t * 0.12 + offsets[idx] + p * 0.33) % 1;
          curves[c].getPoint(u, dummy.position);
          const pulse = 0.85 + Math.sin(t * 4 + idx) * 0.25;
          dummy.scale.setScalar(pulse);
          dummy.updateMatrix();
          particlesRef.current.setMatrixAt(idx, dummy.matrix);
          idx++;
        }
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (nodesRef.current) {
      // Pulse the node scales subtly without re-writing positions.
      const pulse = 1 + Math.sin(t * 1.6) * 0.12;
      nodesRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {tubes.map((g, i) => (
        <mesh key={i} geometry={g} material={tubeMat} />
      ))}

      <instancedMesh
        ref={particlesRef}
        args={[undefined, undefined, totalParticles]}
      >
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshStandardMaterial
          color={ACCENT_CYAN}
          emissive={ACCENT_CYAN}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, endpoints.length]}
      >
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial
          color={ACCENT_VIOLET}
          emissive={ACCENT_VIOLET}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

// ---------- The brain group ----------
function Brain({
  pointer,
  isDark,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Lerp toward pointer for subtle parallax.
    const targetY = pointer.current.x * 0.45;
    const targetX = -pointer.current.y * 0.22;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    // Idle float + slow rotation.
    group.current.position.y = Math.sin(t * 0.6) * 0.06;
    group.current.rotation.y += 0.0008;
  });

  return (
    <group ref={group}>
      <BrainShell tint={isDark ? "#cbe6ff" : "#aee7ff"} inner={0.35} />
      <IdeaFlow />
    </group>
  );
}

// ---------- Pointer handler that lives inside the Canvas ----------
function PointerCapture({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    canvas.addEventListener("pointermove", onMove, { passive: true });
    return () => canvas.removeEventListener("pointermove", onMove);
  }, [gl, pointer]);
  return null;
}

// ---------- Scene wrapper ----------
function Scene({ isDark }: { isDark: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <>
      <PointerCapture pointer={pointer} />
      <ambientLight intensity={isDark ? 0.4 : 0.7} />
      <directionalLight
        position={[3, 4, 3]}
        intensity={isDark ? 0.95 : 1.25}
        color="#ffffff"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={isDark ? 1.4 : 1.0}
        distance={3.5}
        color={ACCENT_CYAN}
      />
      <Brain pointer={pointer} isDark={isDark} />
    </>
  );
}

export function BrainScene({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "200px" }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.1, 4.2], fov: 38 }}
        frameloop={visible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
