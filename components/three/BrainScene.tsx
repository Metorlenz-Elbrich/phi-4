"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

/**
 * BrainScene — recognisable brain with two hemispheres.
 *
 *   LEFT hemisphere  (engineering / logic): a grid of circuit traces hugging
 *                                          the surface with small "chips".
 *   RIGHT hemisphere (creativity / ideas):  organic branching neurons with
 *                                          travelling particles and pulsing
 *                                          endpoint nodes.
 *
 * Performance budget:
 *   • One translucent brain shell (~1.5k verts)
 *   • One LineSegments object for all circuit traces  (1 draw call)
 *   • One LineSegments object for all neuron branches (1 draw call)
 *   • One instancedMesh for circuit chips             (1 draw call)
 *   • One instancedMesh for travelling particles      (1 draw call)
 *   • One instancedMesh for endpoint nodes            (1 draw call)
 *   • 3 lights total. dpr ≤ 1.5. frameloop paused when off-screen.
 */

const CYAN = new THREE.Color("#22d3ee");
const VIOLET = new THREE.Color("#a78bfa");
const MINT = new THREE.Color("#34d399");

// ----------- Parametric brain surface -----------
// u ∈ [0, 1] sweeps longitude; left hemisphere is u ∈ (0.5, 1.0).
function brainPoint(u: number, v: number, out = new THREE.Vector3()) {
  const lon = u * Math.PI * 2;
  const lat = v * Math.PI;
  const a = 1.35;
  const b = 1.0;
  const c = 1.12;

  let x = a * Math.sin(lat) * Math.sin(lon);
  let y = b * Math.cos(lat);
  let z = c * Math.sin(lat) * Math.cos(lon);

  // Lobe-suggesting longitudinal fold.
  z += 0.12 * Math.sin(lon * 2) * Math.sin(lat * 1.4);

  // Interhemispheric fissure (only on the top half).
  if (y > 0) {
    const fissure =
      0.13 * Math.exp(-Math.pow(x * 5.5, 2)) * Math.max(y, 0);
    y -= fissure;
  }

  // Bottom flatten.
  y += 0.08 * Math.exp(-Math.pow((v - 0.95) * 4, 2));

  return out.set(x, y, z);
}

function makeBrainGeometry() {
  const segU = 64;
  const segV = 32;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const tmp = new THREE.Vector3();
  const left = new THREE.Color("#bcd8ff"); // cool tint
  const right = new THREE.Color("#ffd9c7"); // warm tint

  for (let i = 0; i <= segV; i++) {
    for (let j = 0; j <= segU; j++) {
      const u = j / segU;
      const v = i / segV;
      brainPoint(u, v, tmp);
      positions.push(tmp.x, tmp.y, tmp.z);
      const c = tmp.x < 0 ? left : right;
      // Mix toward white near centre so the seam reads softly.
      const mix = Math.min(1, Math.abs(tmp.x) * 1.5);
      colors.push(
        THREE.MathUtils.lerp(1, c.r, mix),
        THREE.MathUtils.lerp(1, c.g, mix),
        THREE.MathUtils.lerp(1, c.b, mix)
      );
    }
  }
  for (let i = 0; i < segV; i++) {
    for (let j = 0; j < segU; j++) {
      const a = i * (segU + 1) + j;
      const b = a + segU + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function BrainShell() {
  const geom = useMemo(() => makeBrainGeometry(), []);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.emissiveIntensity =
      0.08 + Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
  });
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        transparent
        opacity={0.42}
        depthWrite={false}
        side={THREE.DoubleSide}
        roughness={0.55}
        metalness={0.05}
        emissive={CYAN}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

// ----------- LEFT hemisphere: circuit traces -----------
function CircuitTraces() {
  const { lineSegments, chipPositions } = useMemo(() => {
    const segs: THREE.Vector3[] = [];
    const chips: THREE.Vector3[] = [];
    const tmp = new THREE.Vector3();

    const rows = 7;
    const cols = 18;
    // Left hemisphere covers u ∈ (0.5, 1.0).
    // Horizontal traces.
    for (let r = 0; r < rows; r++) {
      const v = 0.18 + (r / (rows - 1)) * 0.62;
      let prev: THREE.Vector3 | null = null;
      for (let c = 0; c <= cols; c++) {
        const u = 0.52 + (c / cols) * 0.46;
        const p = brainPoint(u, v, tmp.clone()).multiplyScalar(1.012);
        if (prev) {
          segs.push(prev, p);
        }
        prev = p;
      }
    }
    // A few vertical connectors so it reads as a circuit, not stripes.
    for (let c = 1; c < cols; c += 3) {
      const u = 0.52 + (c / cols) * 0.46;
      let prev: THREE.Vector3 | null = null;
      for (let r = 0; r < rows; r++) {
        const v = 0.18 + (r / (rows - 1)) * 0.62;
        const p = brainPoint(u, v, tmp.clone()).multiplyScalar(1.012);
        if (prev) segs.push(prev, p);
        prev = p;
      }
    }

    // Chips at sparse grid points.
    let s = 9173;
    const rng = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = 0; i < 22; i++) {
      const u = 0.55 + rng() * 0.4;
      const v = 0.22 + rng() * 0.55;
      const p = new THREE.Vector3();
      brainPoint(u, v, p).multiplyScalar(1.02);
      chips.push(p);
    }

    const geom = new THREE.BufferGeometry().setFromPoints(segs);
    const mat = new THREE.LineBasicMaterial({
      color: VIOLET,
      transparent: true,
      opacity: 0.65,
      toneMapped: false,
    });
    const lines = new THREE.LineSegments(geom, mat);
    return { lineSegments: lines, chipPositions: chips };
  }, []);

  const chipsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!chipsRef.current) return;
    chipPositions.forEach((p, i) => {
      dummy.position.copy(p);
      // Orient flat against the surface (rough — normalize from origin).
      const normal = p.clone().normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normal
      );
      dummy.quaternion.copy(quat);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      chipsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    chipsRef.current.instanceMatrix.needsUpdate = true;
  }, [chipPositions, dummy]);

  useFrame((state) => {
    if (!chipsRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = chipsRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.0 + Math.sin(t * 2.2) * 0.5;
  });

  return (
    <group>
      <primitive object={lineSegments} />
      <instancedMesh
        ref={chipsRef}
        args={[undefined, undefined, chipPositions.length]}
      >
        <boxGeometry args={[0.05, 0.012, 0.05]} />
        <meshStandardMaterial
          color={VIOLET}
          emissive={VIOLET}
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.35}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

// ----------- RIGHT hemisphere: neurons + idea flow -----------
type NeuronData = {
  staticSegments: THREE.Vector3[]; // pairs for LineSegments
  particlePaths: THREE.CatmullRomCurve3[];
  endpoints: THREE.Vector3[];
};

function buildNeurons(): NeuronData {
  let s = 31337;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const segs: THREE.Vector3[] = [];
  const paths: THREE.CatmullRomCurve3[] = [];
  const endpoints: THREE.Vector3[] = [];
  const tmp = new THREE.Vector3();

  // 4 soma cell-bodies distributed across the right hemisphere interior.
  const somaPositions: THREE.Vector3[] = [];
  for (let i = 0; i < 4; i++) {
    // Right hemisphere: u ∈ (0, 0.5).
    const u = 0.06 + (i / 4) * 0.36 + rng() * 0.05;
    const v = 0.3 + rng() * 0.4;
    const p = new THREE.Vector3();
    brainPoint(u, v, p).multiplyScalar(0.78); // pull inside the surface
    somaPositions.push(p);
  }

  somaPositions.forEach((soma) => {
    // Each neuron grows 2–3 main dendrites outward.
    const mainCount = 2 + Math.floor(rng() * 2);
    for (let m = 0; m < mainCount; m++) {
      const pathPts: THREE.Vector3[] = [soma.clone()];
      let current = soma.clone();
      // Bias dendrites toward +x (deeper into right hemisphere) and outward.
      const baseDir = new THREE.Vector3(
        0.6 + rng() * 0.3,
        (rng() - 0.5) * 0.8,
        (rng() - 0.5) * 0.8
      ).normalize();
      const steps = 3 + Math.floor(rng() * 2);

      for (let st = 0; st < steps; st++) {
        const stepLen = 0.18 + rng() * 0.08;
        const noise = new THREE.Vector3(
          (rng() - 0.5) * 0.4,
          (rng() - 0.5) * 0.4,
          (rng() - 0.5) * 0.4
        );
        const dir = baseDir.clone().add(noise).normalize();
        const next = current.clone().add(dir.multiplyScalar(stepLen));
        // Keep inside brain volume by softly clamping radius.
        if (next.length() > 1.25) next.setLength(1.18);

        // Occasionally branch off a short static side-dendrite.
        if (st >= 1 && rng() > 0.4) {
          const sideDir = new THREE.Vector3(
            (rng() - 0.5) * 2,
            (rng() - 0.5) * 2,
            rng() * 1.0
          ).normalize();
          const sideEnd = current
            .clone()
            .add(sideDir.multiplyScalar(0.1 + rng() * 0.1));
          if (sideEnd.length() > 1.25) sideEnd.setLength(1.18);
          segs.push(current.clone(), sideEnd.clone());
          endpoints.push(sideEnd.clone());
        }

        segs.push(current.clone(), next.clone());
        pathPts.push(next.clone());
        current = next;
      }
      endpoints.push(current.clone());
      paths.push(
        new THREE.CatmullRomCurve3(pathPts, false, "catmullrom", 0.5)
      );
    }
  });

  return { staticSegments: segs, particlePaths: paths, endpoints };
}

function Neurons() {
  const { staticSegments, particlePaths, endpoints } = useMemo(
    () => buildNeurons(),
    []
  );

  const segmentsObject = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(staticSegments);
    const mat = new THREE.LineBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.55,
      toneMapped: false,
    });
    return new THREE.LineSegments(geom, mat);
  }, [staticSegments]);

  const PARTICLES_PER_PATH = 2;
  const totalParticles = particlePaths.length * PARTICLES_PER_PATH;
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: totalParticles }, () => Math.random()),
    [totalParticles]
  );

  useEffect(() => {
    if (!nodesRef.current) return;
    endpoints.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      nodesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    nodesRef.current.instanceMatrix.needsUpdate = true;
  }, [endpoints, dummy]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (particlesRef.current) {
      let idx = 0;
      for (let c = 0; c < particlePaths.length; c++) {
        for (let p = 0; p < PARTICLES_PER_PATH; p++) {
          const u = (t * 0.13 + offsets[idx] + p * 0.5) % 1;
          particlePaths[c].getPoint(u, dummy.position);
          const pulse = 0.85 + Math.sin(t * 4 + idx * 1.3) * 0.25;
          dummy.scale.setScalar(pulse);
          dummy.updateMatrix();
          particlesRef.current.setMatrixAt(idx, dummy.matrix);
          idx++;
        }
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
    if (nodesRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.1;
      nodesRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <primitive object={segmentsObject} />
      <instancedMesh
        ref={particlesRef}
        args={[undefined, undefined, totalParticles]}
      >
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </instancedMesh>
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, endpoints.length]}
      >
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color={MINT}
          emissive={MINT}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

// ----------- Central spine (subtle accent on the fissure) -----------
function PhiSpine() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.04, 0.008, 6, 24]} />
      <meshStandardMaterial
        color={CYAN}
        emissive={CYAN}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

// ----------- Brain group with pointer parallax + idle motion -----------
function Brain({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const ty = pointer.current.x * 0.35;
    const tx = -pointer.current.y * 0.18;
    group.current.rotation.y += (ty - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.04;
    group.current.position.y = Math.sin(t * 0.6) * 0.05;
    group.current.rotation.y += 0.0006;
  });
  return (
    <group ref={group}>
      <BrainShell />
      <CircuitTraces />
      <Neurons />
      <PhiSpine />
    </group>
  );
}

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

function Scene({ isDark }: { isDark: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <>
      <PointerCapture pointer={pointer} />
      <ambientLight intensity={isDark ? 0.45 : 0.75} />
      <directionalLight
        position={[3, 4, 3]}
        intensity={isDark ? 1.0 : 1.3}
        color="#ffffff"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={isDark ? 1.2 : 0.9}
        distance={3.5}
        color={CYAN}
      />
      <Brain pointer={pointer} />
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
