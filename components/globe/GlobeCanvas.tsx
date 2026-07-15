"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

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
        <sphereGeometry args={[GLOBE_R, 96, 96]} />
        <meshStandardMaterial map={tex} roughness={0.92} metalness={0.05} />
      </mesh>
      {/* soft atmospheric halo */}
      <mesh scale={1.16}>
        <sphereGeometry args={[GLOBE_R, 48, 48]} />
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
  const body = "#F5F1E9";
  const accent = "#E8732A";
  // Nose points toward +Z (the direction of travel). Slight bank into the turn.
  return (
    <group scale={0.19} rotation={[0, 0, -0.32]}>
      {/* fuselage */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.14, 1.05, 12, 24]} />
        <meshStandardMaterial color={body} roughness={0.32} metalness={0.25} />
      </mesh>
      {/* nose cone */}
      <mesh position={[0, 0, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 0.5, 24]} />
        <meshStandardMaterial color={accent} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* swept wings */}
      <mesh position={[-0.44, 0, -0.06]} rotation={[0, 0.52, 0]}>
        <boxGeometry args={[0.95, 0.035, 0.32]} />
        <meshStandardMaterial color={body} roughness={0.5} />
      </mesh>
      <mesh position={[0.44, 0, -0.06]} rotation={[0, -0.52, 0]}>
        <boxGeometry args={[0.95, 0.035, 0.32]} />
        <meshStandardMaterial color={body} roughness={0.5} />
      </mesh>
      {/* orange stripe on fuselage */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.145, 0.18, 8, 20]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
      {/* horizontal stabilizers */}
      <mesh position={[-0.2, 0, -0.7]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.42, 0.03, 0.18]} />
        <meshStandardMaterial color={body} roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0, -0.7]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[0.42, 0.03, 0.18]} />
        <meshStandardMaterial color={body} roughness={0.5} />
      </mesh>
      {/* vertical fin */}
      <mesh position={[0, 0.15, -0.74]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.035, 0.3, 0.24]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
    </group>
  );
}

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
          <Airplane />
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

export default function GlobeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
