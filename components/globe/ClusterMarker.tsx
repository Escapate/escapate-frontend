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
      <Html center occlude={[occludeRef]} zIndexRange={[50, 0]}>
        {active ? (
          <div className="w-56 overflow-hidden rounded-xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-orange-400">
                <MapPin className="h-3.5 w-3.5" />
                {members.length} destinos
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid h-6 w-6 place-items-center rounded-full bg-white/5 text-cream-50 transition hover:bg-white/15"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="max-h-56 divide-y divide-white/5 overflow-auto">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-2.5 px-3 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-sm font-bold leading-tight">{m.name}</p>
                    <p className="truncate font-mono text-[10px] text-orange-400">{m.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCotizar(m)}
                    className="shrink-0 rounded-lg bg-orange px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-orange-600"
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
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/70 bg-orange text-sm font-black text-white shadow-[0_6px_16px_-4px_rgba(232,115,42,0.9)] outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-white"
          >
            {members.length}
          </button>
        )}
      </Html>
    </group>
  );
}
