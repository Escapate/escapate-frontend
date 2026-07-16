"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, useTexture, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const JET_MODEL = "/models/jet.glb";

const GLOBE_R = 1.4;
const ORBIT_R = 2.02;

function Earth() {
  const tex = useTexture("/textures/world-map.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });

  return (
    <group rotation={[0.32, 0, 0]}>
      <mesh ref={ref}>
        {/* 64 segmentos se ven idénticos a este tamaño (~460px) con menos vértices. */}
        <sphereGeometry args={[GLOBE_R, 64, 64]} />
        <meshStandardMaterial map={tex} roughness={0.92} metalness={0.05} />
      </mesh>
      {/* soft atmospheric halo — es un halo difuso, los segmentos casi no importan */}
      <mesh scale={1.16}>
        <sphereGeometry args={[GLOBE_R, 32, 32]} />
        <meshBasicMaterial
          color="#E8732A"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Airplane() {
  // Detailed low-poly jet (Poly by Google, CC-BY 3.0), texture optimized to 256².
  // The model's nose already points toward +Z and it sits upright on +Y, matching
  // the orbit convention below, so no reorientation is needed — only a slight bank.
  const { scene } = useGLTF(JET_MODEL);
  const model = useMemo(() => scene.clone(true), [scene]);
  return (
    <group scale={0.05} rotation={[0, 0, -0.32]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(JET_MODEL);

function FlightPath() {
  const orbit = useRef<THREE.Group>(null!);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const t = (i / 160) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * ORBIT_R, 0, Math.sin(t) * ORBIT_R));
    }
    return pts;
  }, []);

  useFrame((_, dt) => {
    // Negative so the nose (+Z) leads the direction of travel.
    if (orbit.current) orbit.current.rotation.y -= dt * 0.5;
  });

  return (
    <group rotation={[0.52, 0, 0.22]}>
      <Line
        points={points}
        color="#E8732A"
        lineWidth={1.4}
        dashed
        dashSize={0.13}
        gapSize={0.11}
        transparent
        opacity={0.65}
      />
      <group ref={orbit}>
        <group position={[ORBIT_R, 0, 0]}>
          <Suspense fallback={null}>
            <Airplane />
          </Suspense>
        </group>
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 3, 5]} intensity={1.5} />
      <pointLight position={[-4, -1, -2]} intensity={0.5} color="#E8732A" />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <FlightPath />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
      />
    </>
  );
}

export default function GlobeCanvas({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  // En pantallas de alta densidad (móvil retina) el antialias es innecesario —
  // los píxeles ya son densos — y ahorra fill-rate.
  const hiDpr = typeof window !== "undefined" && window.devicePixelRatio >= 2;
  return (
    <Canvas
      frameloop={frameloop}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: !hiDpr, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
