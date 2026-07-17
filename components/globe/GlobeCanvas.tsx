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
const CLUSTER_DEG = 5; // separación angular para agrupar destinos cercanos (a zoom 1)
const ZOOM_POW = 1.5; // el umbral baja como CLUSTER_DEG / zoom^ZOOM_POW → separa pares muy juntos sin agrandar tanto
const BASE_TILT = 0.32; // inclinación base del globo
const MANUAL_AZ = 0.9; // velocidad de giro manual (longitud)
const MANUAL_POL = 0.7; // velocidad de giro manual (latitud/tilt)
const TILT_RANGE = 0.6; // cuánto se puede inclinar arriba/abajo respecto a la base
const INTERACT_PAUSE_MS = 6000; // tras interactuar, la rotación ambiente se pausa este tiempo

type MarkerCotizar = { name: string; nights: string; price: string };
type FocusTarget = { id: string; lat: number; lng: number };

// Ángulos (spin en Y, tilt en X) que traen un lat/lng al frente, mirando a la cámara.
function faceTarget(lat: number, lng: number): { spinY: number; tiltX: number } {
  const [x, y, z] = latLngToVec3(lat, lng, 1);
  return {
    spinY: Math.atan2(-x, z),
    tiltX: Math.atan2(y, Math.hypot(x, z)) - BASE_TILT,
  };
}

function Earth({
  spinRef,
  tiltRef,
  clusters,
  active,
  setActive,
  onCotizar,
  cotizarLabel,
  zoom,
}: {
  spinRef: RefObject<THREE.Group>;
  tiltRef: RefObject<THREE.Group>;
  clusters: Cluster[];
  active: string | null;
  setActive: (id: string | null) => void;
  onCotizar?: (m: MarkerCotizar) => void;
  cotizarLabel: string;
  zoom: number;
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
                zoom={zoom}
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

function Scene({
  clusters,
  active,
  setActive,
  onCotizar,
  cotizarLabel,
  input,
  zoom,
  focusTarget,
  focusNonce,
}: {
  clusters: Cluster[];
  active: string | null;
  setActive: (id: string | null) => void;
  onCotizar?: (m: MarkerCotizar) => void;
  cotizarLabel: string;
  input?: RefObject<GlobeInput>;
  zoom: number;
  focusTarget: FocusTarget | null;
  focusNonce: number;
}) {
  const spinRef = useRef<THREE.Group>(null!);
  const tiltRef = useRef<THREE.Group>(null!);
  const zoomRef = useRef<THREE.Group>(null!);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const lastReset = useRef(0);
  const fly = useRef({ nonce: 0, spinY: 0, tiltX: 0, id: "", active: false });
  const lastInteract = useRef(-Infinity);
  const dragging = useRef(false);

  useFrame((_, dt) => {
    const inp = input?.current;
    const spin = spinRef.current;
    const tilt = tiltRef.current;
    const controls = controlsRef.current;
    const zoomed = zoom > 1.01;

    // Vuelo a un destino (click en el menú de "Explorar"): calcula el destino angular y anima.
    if (focusNonce !== fly.current.nonce) {
      fly.current.nonce = focusNonce;
      if (focusTarget) {
        const t = faceTarget(focusTarget.lat, focusTarget.lng);
        fly.current.spinY = t.spinY;
        fly.current.tiltX = THREE.MathUtils.clamp(t.tiltX, -TILT_RANGE, TILT_RANGE);
        fly.current.id = focusTarget.id;
        fly.current.active = true;
        // Re-centra la cámara: el drag de OrbitControls es independiente del spin/tilt, así
        // que sin esto un destino podía quedar en la cara trasera tras arrastrar el globo.
        controls?.reset();
      }
    }
    const flying = fly.current.active;
    if (flying && spin && tilt) {
      const k = 1 - Math.exp(-6 * dt);
      let dy = fly.current.spinY - spin.rotation.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy)); // camino más corto
      spin.rotation.y += dy * k;
      const dx = fly.current.tiltX - tilt.rotation.x;
      tilt.rotation.x += dx * k;
      if (Math.abs(dy) < 0.01 && Math.abs(dx) < 0.01) {
        fly.current.active = false;
        setActive(fly.current.id); // al llegar, abre la card
      }
    }

    // Pausa tras interactuar: arrastrar o usar los controles detiene la rotación ambiente unos
    // segundos (mejor UX — el globo no se "escapa" apenas sueltas).
    const now = performance.now();
    if (inp && (inp.azVel !== 0 || inp.polVel !== 0)) lastInteract.current = now;
    const interacting = dragging.current || now - lastInteract.current < INTERACT_PAUSE_MS;

    // Al acercar, en pleno vuelo o justo tras interactuar, se detiene la rotación ambiente.
    const auto =
      (inp ? inp.autoRotate : true) && active === null && !zoomed && !flying && !interacting;

    // Zoom acotado: escala suave del globo hacia el nivel objetivo.
    if (zoomRef.current) {
      zoomRef.current.scale.setScalar(THREE.MathUtils.damp(zoomRef.current.scale.x, zoom, 6, dt));
    }

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
      <group ref={zoomRef}>
        <Suspense fallback={null}>
          <Earth
            spinRef={spinRef}
            tiltRef={tiltRef}
            clusters={clusters}
            active={active}
            setActive={setActive}
            onCotizar={onCotizar}
            cotizarLabel={cotizarLabel}
            zoom={zoom}
          />
        </Suspense>
      </group>
      {/* El avión/órbita se ocultan al acercar (se verían desproporcionados). */}
      {zoom <= 1.01 && <FlightPath />}
      <OrbitControls
        ref={controlsRef}
        onStart={() => {
          dragging.current = true;
        }}
        onEnd={() => {
          dragging.current = false;
          lastInteract.current = performance.now();
        }}
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
  zoom = 1,
  focusId = null,
  focusNonce = 0,
}: {
  frameloop?: "always" | "never";
  markers?: GlobeMarker[];
  onCotizar?: (m: MarkerCotizar) => void;
  cotizarLabel?: string;
  input?: RefObject<GlobeInput>;
  zoom?: number;
  focusId?: string | null;
  focusNonce?: number;
}) {
  const [active, setActive] = useState<string | null>(null);
  // El umbral baja con el zoom → los clústers se separan al acercar y se reagrupan al alejar.
  // El destino enfocado (fly-to) se saca del clustering y se renderiza suelto para que su card
  // pueda abrirse aunque estuviera agrupado.
  const clusters = useMemo(() => {
    const base = focusId ? markers.filter((m) => m.id !== focusId) : markers;
    const cl = clusterMarkers(base, CLUSTER_DEG / Math.pow(zoom, ZOOM_POW), GLOBE_R * 1.02);
    if (focusId) {
      const fm = markers.find((m) => m.id === focusId);
      if (fm) {
        cl.push({ id: fm.id, position: latLngToVec3(fm.lat, fm.lng, GLOBE_R * 1.02), members: [fm] });
      }
    }
    return cl;
  }, [markers, zoom, focusId]);

  const focusTarget = useMemo<FocusTarget | null>(() => {
    if (!focusId) return null;
    const fm = markers.find((m) => m.id === focusId);
    return fm ? { id: fm.id, lat: fm.lat, lng: fm.lng } : null;
  }, [focusId, markers]);
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
        zoom={zoom}
        focusTarget={focusTarget}
        focusNonce={focusNonce}
      />
    </Canvas>
  );
}
