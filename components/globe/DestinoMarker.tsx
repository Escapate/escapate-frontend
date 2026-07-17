"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { X } from "lucide-react";
import { useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

export type DestinoMarkerData = {
  id: string;
  name: string;
  price: string;
  img: string;
};

// Naranja de marca. Proporciones/altura/emisivo/color son ajuste visual fino (calibrar en pnpm dev).
const PIN_COLOR = "#E8732A";
const EYE_COLOR = "#FFF3E6";
const PIN_UP = new THREE.Vector3(0, 1, 0);
const LIFT = 0.05; // cuánto se eleva el pin al hover/activo (hacia afuera del globo)

// Perfil (radio, altura) de la gota estilo Google Maps: punta afilada abajo → cabeza redonda arriba.
const PIN_PROFILE: Array<[number, number]> = [
  [0.0, 0.0],
  [0.01, 0.015],
  [0.024, 0.04],
  [0.04, 0.075],
  [0.052, 0.11],
  [0.056, 0.14],
  [0.05, 0.168],
  [0.034, 0.188],
  [0.014, 0.198],
  [0.0, 0.202],
];

export default function DestinoMarker({
  data,
  position,
  active,
  onActivate,
  onClose,
  onCotizar,
  cotizarLabel,
  occludeRef,
}: {
  data: DestinoMarkerData;
  position: [number, number, number];
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
  onCotizar: () => void;
  cotizarLabel: string;
  occludeRef: RefObject<THREE.Object3D>;
}) {
  const [hovered, setHovered] = useState(false);
  const liftRef = useRef<THREE.Group>(null!);

  // Orienta el pin a lo largo de la normal de la superficie (apunta hacia afuera del globo).
  const quaternion = useMemo(() => {
    const normal = new THREE.Vector3(position[0], position[1], position[2]).normalize();
    return new THREE.Quaternion().setFromUnitVectors(PIN_UP, normal);
  }, [position]);

  const profile = useMemo(() => PIN_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), []);

  // Elevación + escala animadas (damp = independiente del frame-rate).
  useFrame((_, dt) => {
    const g = liftRef.current;
    if (!g) return;
    const up = hovered || active;
    g.position.y = THREE.MathUtils.damp(g.position.y, up ? LIFT : 0, 9, dt);
    const target = active ? 1.22 : hovered ? 1.12 : 1;
    const s = THREE.MathUtils.damp(g.scale.x, target, 9, dt);
    g.scale.setScalar(s);
  });

  return (
    <group position={position}>
      <group quaternion={quaternion}>
        {/* Área de hit invisible (estática, cubre el pin incluso elevado) para hover/click. */}
        <mesh
          position={[0, 0.11, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onActivate();
          }}
        >
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Pin visible (se eleva/escala en liftRef). */}
        <group ref={liftRef}>
          {/* Cuerpo: gota revuelta, material glossy con emisivo para que resalte. */}
          <mesh>
            <latheGeometry args={[profile, 28]} />
            <meshStandardMaterial
              color={PIN_COLOR}
              emissive={PIN_COLOR}
              emissiveIntensity={active || hovered ? 0.5 : 0.32}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>

          {/* "Ojo" crema incrustado en la cabeza (detalle tipo Maps). */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial
              color={EYE_COLOR}
              emissive={EYE_COLOR}
              emissiveIntensity={0.25}
              roughness={0.5}
            />
          </mesh>
        </group>

        {active && (
          <Html
            position={[0, 0.24, 0]}
            center
            distanceFactor={6}
            occlude={[occludeRef]}
            zIndexRange={[40, 0]}
          >
            <div
              onMouseLeave={onClose}
              className="w-44 overflow-hidden rounded-xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl backdrop-blur"
            >
              <div className="relative h-24 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.img} alt={data.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy-950/70 text-cream-50 transition hover:bg-navy-950"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="font-heading text-sm font-bold">{data.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-orange-400">{data.price}</p>
                <button
                  type="button"
                  onClick={onCotizar}
                  className="mt-2 w-full rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
                >
                  {cotizarLabel}
                </button>
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
