"use client";

import { useI18n } from "@/lib/i18n";
import { MAPS_DIRECTIONS_URL } from "@/lib/content";
import { MapPin } from "lucide-react";

/**
 * FAB de ubicación — solo móvil (sm:hidden). Va apilado justo encima del
 * FloatingWhatsApp. En desktop la ubicación se ve como tarjeta en Gallery.
 */
export default function FloatingMap() {
  const { c } = useI18n();
  return (
    <a
      href={MAPS_DIRECTIONS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.gallery.directions}
      className="fixed bottom-[5.5rem] right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-orange text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition hover:scale-105 sm:hidden"
    >
      <MapPin className="h-7 w-7" />
    </a>
  );
}
