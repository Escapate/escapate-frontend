"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import StaticGlobe from "./StaticGlobe";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => <StaticGlobe />,
});

export type GlobeMarker = {
  id: string;
  name: string;
  price: string;
  img: string;
  nights: string;
  lat: number;
  lng: number;
};

// Intención de control del globo, escrita por GlobeControls (DOM) y leída por el canvas
// cada frame. Es un objeto mutable compartido (no estado React) → sin re-renders por frame.
export type GlobeInput = {
  azVel: number; // -1 (izq) .. 1 (der)
  polVel: number; // -1 (arriba) .. 1 (abajo)
  autoRotate: boolean;
  resetToken: number;
};

export default function Globe({
  markers = [],
  onCotizar,
  cotizarLabel,
  input,
  zoom = 1,
  paused = false,
}: {
  markers?: GlobeMarker[];
  onCotizar?: (m: { name: string; nights: string; price: string }) => void;
  cotizarLabel?: string;
  input?: RefObject<GlobeInput>;
  zoom?: number;
  paused?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false); // el navegador ya está ocioso
  const [inView, setInView] = useState(true); // el hero está en pantalla
  const [mounted, setMounted] = useState(false); // el canvas ya se enganchó

  // (1) Diferir el "upgrade" a WebGL hasta que el navegador esté ocioso. Así
  // three.js (~233 KB gz) no compite con la carga crítica: el globo estático ya
  // está pintado y el 3D entra ~1s después, casi imperceptible.
  useEffect(() => {
    if (reduced) return;
    const start = () => setReady(true);
    const w = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(start, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(start, 1200);
    return () => window.clearTimeout(id);
  }, [reduced]);

  // (2) Pausar el render cuando el hero sale de pantalla → no quema CPU/GPU/batería
  // mientras el usuario lee el resto de la página.
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Engancha el canvas una vez que está ocioso y visible; luego lo deja montado y
  // solo alterna el bucle de render con `inView` (evita re-crear el contexto WebGL).
  useEffect(() => {
    if (ready && inView) setMounted(true);
  }, [ready, inView]);

  // Respeta prefers-reduced-motion: globo estático, sin three.js.
  if (reduced) return <StaticGlobe />;

  // El canvas se desborda del contenedor cuadrado para que la órbita + el avión
  // queden visibles por todos lados (la cámara se retrae el mismo factor en GlobeCanvas).
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      {mounted ? (
        <div className="absolute inset-[-24%]">
          <GlobeCanvas
            frameloop={paused || !inView ? "never" : "always"}
            markers={markers}
            onCotizar={onCotizar}
            cotizarLabel={cotizarLabel}
            input={input}
            zoom={zoom}
          />
        </div>
      ) : (
        <StaticGlobe />
      )}
    </div>
  );
}
