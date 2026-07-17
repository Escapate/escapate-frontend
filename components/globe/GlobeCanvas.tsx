"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, useTexture, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState, type ElementRef, type RefObject } from "react";
import * as THREE from "three";
import { latLngToVec3 } from "@/lib/destino-geo";
import { clusterMarkers, type Cluster } from "@/lib/cluster";
import DestinoMarker from "./DestinoMarker";
import ClusterMarker from "./ClusterMarker";
import type { GlobeMarker, GlobeInput } from "./Globe";

const JET_MODEL = "/models/jet.glb";

const GLOBE_R = 1.4;
const ORBIT_R = 2.02;

// Clustering + control manual (ajuste fino en pnpm dev).
const CLUSTER_DEG = 5; // separación angular para agrupar destinos cercanos
const BASE_TILT = 0.32; // inclinación base del globo
const MANUAL_AZ = 0.9; // velocidad de giro manual (longitud)
const MANUAL_POL = 0.7; // velocidad de giro manual (latitud/tilt)
const TILT_RANGE = 0.6; // cuánto se puede inclinar arriba/abajo respecto a la base

type MarkerCotizar = { name: string; nights: string; price: string };

function Earth({
  spinRef,
  tiltRef,
  clusters,
  active,
  setActive,
  onCotizar,
  cotizarLabel,
}: {
  spinRef: RefObject<THREE.Group>;
  tiltRef: RefObject<THREE.Group>;
  clusters: Cluster[];
  active: string | null;
  setActive: (id: string | null) => void;
  onCotizar?: (m: MarkerCotizar) => void;
  cotizarLabel: string;
}) {
  const tex = useTexture("/textures/world-map.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const earthRef = useRef<THREE.Mesh>(null!);

  return (
    <group rotation={[BASE_TILT, 0, 0]}>
      {/* tilt manual (latitud) — sin prop de rotación para que no se resetee al re-render */}
      <group ref={tiltRef}>
        {/* spin (longitud) — mutado en el useFrame de Scene */}
        <group ref={spinRef}>
          <mesh ref={earthRef}>
            <sphereGeometry args={[GLOBE_R, 64, 64]} />
            <meshStandardMaterial map={tex} roughness={0.92} metalness={0.05} />
          </mesh>
          {clusters.map((cl) =>
            cl.members.length === 1 ? (
              <DestinoMarker
                key={cl.id}
                data={{
                  id: cl.members[0].id,
                  name: cl.members[0].name,
                  price: cl.members[0].price,
                  img: cl.members[0].img,
                }}
                position={cl.position}
                active={active === cl.members[0].id}
                onActivate={() => setActive(cl.members[0].id)}
                onClose={() => setActive(null)}
                onCotizar={() => {
                  onCotizar?.(cl.members[0]);
                  setActive(null);
                }}
                cotizarLabel={cotizarLabel}
                occludeRef={earthRef}
              />
            ) : (
              <ClusterMarker
                key={cl.id}
                position={cl.position}
                members={cl.members}
                active={active === cl.id}
                onActivate={() => setActive(cl.id)}
                onClose={() => setActive(null)}
                onCotizar={(m) => {
                  onCotizar?.(m);
                  setActive(null);
                }}
                cotizarLabel={cotizarLabel}
                occludeRef={earthRef}
              />
            )
          )}
        </group>
      </group>
      {/* halo atmosférico (estático) */}
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

function Scene({
  clusters,
  active,
  setActive,
  onCotizar,
  cotizarLabel,
  input,
}: {
  clusters: Cluster[];
  active: string | null;
  setActive: (id: string | null) => void;
  onCotizar?: (m: MarkerCotizar) => void;
  cotizarLabel: string;
  input?: RefObject<GlobeInput>;
}) {
  const spinRef = useRef<THREE.Group>(null!);
  const tiltRef = useRef<THREE.Group>(null!);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const lastReset = useRef(0);

  useFrame((_, dt) => {
    const inp = input?.current;
    const spin = spinRef.current;
    const tilt = tiltRef.current;
    const controls = controlsRef.current;
    const auto = (inp ? inp.autoRotate : true) && active === null;

    // Rotación ambiente (el mapa se desliza).
    if (auto && spin) spin.rotation.y += dt * 0.04;

    if (inp) {
      // Recentrar.
      if (inp.resetToken !== lastReset.current) {
        lastReset.current = inp.resetToken;
        if (spin) spin.rotation.y = 0;
        if (tilt) tilt.rotation.x = 0;
        controls?.reset();
      }
      // Giro manual (mantener presionado / flechas).
      if (inp.azVel && spin) spin.rotation.y += inp.azVel * MANUAL_AZ * dt;
      if (inp.polVel && tilt) {
        tilt.rotation.x = THREE.MathUtils.clamp(
          tilt.rotation.x + inp.polVel * MANUAL_POL * dt,
          -TILT_RANGE,
          TILT_RANGE
        );
      }
    }

    // La órbita de cámara (autoRotate) sigue el play/pausa y se detiene con una tarjeta abierta.
    if (controls) controls.autoRotate = auto;
  });

  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 3, 5]} intensity={1.5} />
      <pointLight position={[-4, -1, -2]} intensity={0.5} color="#E8732A" />
      <Suspense fallback={null}>
        <Earth
          spinRef={spinRef}
          tiltRef={tiltRef}
          clusters={clusters}
          active={active}
          setActive={setActive}
          onCotizar={onCotizar}
          cotizarLabel={cotizarLabel}
        />
      </Suspense>
      <FlightPath />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
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
  markers = [],
  onCotizar,
  cotizarLabel = "Cotizar",
  input,
}: {
  frameloop?: "always" | "never";
  markers?: GlobeMarker[];
  onCotizar?: (m: MarkerCotizar) => void;
  cotizarLabel?: string;
  input?: RefObject<GlobeInput>;
}) {
  const [active, setActive] = useState<string | null>(null);
  const clusters = useMemo(
    () => clusterMarkers(markers, CLUSTER_DEG, GLOBE_R * 1.02),
    [markers]
  );
  // En pantallas de alta densidad (móvil retina) el antialias es innecesario.
  const hiDpr = typeof window !== "undefined" && window.devicePixelRatio >= 2;
  return (
    <Canvas
      frameloop={frameloop}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: !hiDpr, alpha: true }}
      style={{ background: "transparent" }}
      onPointerMissed={() => setActive(null)}
    >
      <Scene
        clusters={clusters}
        active={active}
        setActive={setActive}
        onCotizar={onCotizar}
        cotizarLabel={cotizarLabel}
        input={input}
      />
    </Canvas>
  );
}
