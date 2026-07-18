"use client";

import { Html } from "@react-three/drei";
import { MapPin, X } from "lucide-react";
import type { RefObject } from "react";
import type * as THREE from "three";
import type { ClusterInput } from "@/lib/cluster";
import type { GlobeLabels } from "./Globe";

// Marcador de grupo: un badge con el número de destinos que, al tocarlo, despliega
// un popover con la lista para elegir. Es DOM (drei <Html>) → nítido y clickeable;
// se oculta en la cara trasera con `occlude`.
//
// Ojo con tabIndex={-1}: todo esto vive dentro del contenedor aria-hidden del globo
// (ver Globe.tsx). Un botón enfocable dentro de aria-hidden es una violación de WCAG
// 4.1.2 — el foco entra pero el lector de pantalla no anuncia nada. La ruta accesible
// equivalente es el modo "Explorar", que sí está fuera del subárbol oculto.
export default function ClusterMarker({
  position,
  members,
  active,
  onActivate,
  onClose,
  onCotizar,
  labels,
  occludeRef,
}: {
  position: [number, number, number];
  members: ClusterInput[];
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
  onCotizar: (m: ClusterInput) => void;
  labels: GlobeLabels;
  occludeRef: RefObject<THREE.Object3D>;
}) {
  return (
    <group position={position}>
      {/* Badge colapsado por debajo de las cards (20); popover abierto por encima (60). */}
      <Html center occlude={[occludeRef]} zIndexRange={active ? [60, 0] : [20, 0]}>
        {active ? (
          <div className="w-80 overflow-hidden rounded-2xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-orange-400">
                <MapPin className="h-4 w-4" />
                {members.length} {labels.destinations.toLowerCase()}
              </span>
              <button
                type="button"
                tabIndex={-1}
                onClick={onClose}
                aria-label={labels.close}
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white/5 text-cream-50 transition hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-96 divide-y divide-white/5 overflow-auto">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3.5 px-4 py-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-lg font-bold leading-tight">{m.name}</p>
                    <p className="font-heading text-sm font-semibold text-cream-50">
                      {m.price ?? <span className="font-mono text-xs text-cream-50/60">{m.region}</span>}
                    </p>
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => onCotizar(m)}
                    className="shrink-0 cursor-pointer rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
                  >
                    {labels.cotizar}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          /* El botón es solo el área de toque; el círculo visible es el <span>. En celular
             el círculo se achica (36px) pero el padding compensa, así que el blanco para el
             dedo no encoge — importa porque se toca sobre un globo que además se arrastra.
             El número se mantiene en text-base en los dos tamaños. */
          <button
            type="button"
            tabIndex={-1}
            onClick={onActivate}
            aria-label={`${members.length} ${labels.inArea}`}
            className="grid cursor-pointer place-items-center rounded-full p-1.5 outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-white sm:p-0"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/70 bg-orange text-base font-black text-white shadow-[0_6px_16px_-4px_rgba(232,115,42,0.9)] sm:h-11 sm:w-11">
              {members.length}
            </span>
          </button>
        )}
      </Html>
    </group>
  );
}
