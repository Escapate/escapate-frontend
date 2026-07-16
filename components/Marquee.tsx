"use client";

import { useI18n } from "@/lib/i18n";
import { Plane } from "lucide-react";

// Banda naranja con la frase de marca desplazándose (design-system §6.3).
// Se renderiza el grupo dos veces y se anima translateX(0 → -50%) para un
// bucle sin costuras. Decorativo → aria-hidden.
export default function Marquee() {
  const { c } = useI18n();

  const group = (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="mx-8 flex items-center gap-8 font-display text-3xl italic text-white sm:text-4xl"
        >
          {c.marquee}
          <Plane className="h-6 w-6 -rotate-45" strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/10 bg-orange py-5 sm:py-6"
    >
      <div className="flex w-max animate-marquee">
        {group}
        {group}
      </div>
    </div>
  );
}
