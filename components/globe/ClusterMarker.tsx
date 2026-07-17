"use client";

import { Html } from "@react-three/drei";
import { MapPin, X } from "lucide-react";
import type { RefObject } from "react";
import type * as THREE from "three";
import type { ClusterInput } from "@/lib/cluster";

// Marcador de grupo: un badge con el número de destinos que, al tocarlo, despliega
// un popover con la lista para elegir. Es DOM (drei <Html>) → nítido, accesible y
// clickeable con teclado; se oculta en la cara trasera con `occlude`.
export default function ClusterMarker({
  position,
  members,
  active,
  onActivate,
  onClose,
  onCotizar,
  cotizarLabel,
  occludeRef,
}: {
  position: [number, number, number];
  members: ClusterInput[];
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
  onCotizar: (m: ClusterInput) => void;
  cotizarLabel: string;
  occludeRef: RefObject<THREE.Object3D>;
}) {
  return (
    <group position={position}>
      {/* Badge colapsado por debajo de las cards (20); popover abierto por encima (60). */}
      <Html center occlude={[occludeRef]} zIndexRange={active ? [60, 0] : [20, 0]}>
        {active ? (
          <div className="w-72 overflow-hidden rounded-2xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-orange-400">
                <MapPin className="h-4 w-4" />
                {members.length} destinos
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white/5 text-cream-50 transition hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-72 divide-y divide-white/5 overflow-auto">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-base font-bold leading-tight">{m.name}</p>
                    <p className="truncate font-mono text-[11px] text-orange-400">{m.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCotizar(m)}
                    className="shrink-0 cursor-pointer rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
                  >
                    {cotizarLabel}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            type="button"
            onClick={onActivate}
            aria-label={`${members.length} destinos en esta zona, abrir lista`}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-2 border-white/70 bg-orange text-sm font-black text-white shadow-[0_6px_16px_-4px_rgba(232,115,42,0.9)] outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-white"
          >
            {members.length}
          </button>
        )}
      </Html>
    </group>
  );
}
