"use client";

import { Html } from "@react-three/drei";
import { X } from "lucide-react";
import { useMemo, type RefObject } from "react";
import * as THREE from "three";

export type DestinoMarkerData = {
  id: string;
  name: string;
  price: string;
  img: string;
};

// Naranja de marca. Proporciones/altura/color son ajuste visual fino (calibrar en pnpm dev).
const PIN_COLOR = "#E8732A";
const PIN_UP = new THREE.Vector3(0, 1, 0);

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
  // Orienta el pin a lo largo de la normal de la superficie (apunta hacia afuera del globo).
  const quaternion = useMemo(() => {
    const normal = new THREE.Vector3(position[0], position[1], position[2]).normalize();
    return new THREE.Quaternion().setFromUnitVectors(PIN_UP, normal);
  }, [position]);

  return (
    <group position={position}>
      <group quaternion={quaternion} scale={active ? 1.2 : 1}>
        {/* Área de hit invisible que cubre todo el pin (facilita hover/tap). */}
        <mesh
          position={[0, 0.09, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            onActivate();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onActivate();
          }}
        >
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Cuerpo del pin: cono con la punta clavada en la superficie (y≈0). */}
        <mesh position={[0, 0.075, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.15, 20]} />
          <meshStandardMaterial
            color={PIN_COLOR}
            emissive={PIN_COLOR}
            emissiveIntensity={0.35}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Cabeza esférica brillante. */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.055, 20, 20]} />
          <meshStandardMaterial
            color={PIN_COLOR}
            emissive={PIN_COLOR}
            emissiveIntensity={active ? 0.7 : 0.45}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>

        {active && (
          <Html
            position={[0, 0.22, 0]}
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
