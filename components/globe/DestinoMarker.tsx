"use client";

import { Html } from "@react-three/drei";
import { X } from "lucide-react";
import type { RefObject } from "react";
import type * as THREE from "three";

export type DestinoMarkerData = {
  id: string;
  name: string;
  price: string;
  img: string;
};

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
  return (
    <group position={position}>
      {/* Área de hit invisible (mayor que el punto) para facilitar hover/tap. */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onActivate();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Punto visible. */}
      <mesh scale={active ? 1.6 : 1}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#E8732A" toneMapped={false} />
      </mesh>

      {active && (
        <Html center distanceFactor={6} occlude={[occludeRef]} zIndexRange={[40, 0]}>
          <div className="w-44 overflow-hidden rounded-xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl backdrop-blur">
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
  );
}
