"use client";

import { X } from "lucide-react";
import type { GlobeMarker } from "./Globe";

// Modal fijo y centrado para la card de un destino en móvil (en desktop se usa la card
// flotante anclada al pin). Se renderiza fuera del canvas → position:fixed real.
export default function PinCardModal({
  marker,
  onClose,
  onCotizar,
  cotizarLabel,
}: {
  marker: GlobeMarker;
  onClose: () => void;
  onCotizar: () => void;
  cotizarLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      {/* backdrop: toca fuera para cerrar */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-navy-950/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl">
        <div className="relative h-44 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={marker.img} alt={marker.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-2 top-2 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-navy-950/70 text-cream-50 transition hover:bg-navy-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <p className="font-heading text-xl font-bold leading-tight">{marker.name}</p>
          <p className="mt-1 font-mono text-sm text-orange-400">{marker.price}</p>
          <button
            type="button"
            onClick={onCotizar}
            className="mt-4 w-full cursor-pointer rounded-lg bg-orange px-3 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            {cotizarLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
