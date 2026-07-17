"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Globe, { type GlobeInput, type GlobeMarker } from "./Globe";
import GlobeControls from "./GlobeControls";

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.4;
const WHEEL_STEP = 0.3;
const PINCH_FACTOR = 0.008;

const clamp = (n: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, n));

// Modo enfoque: el globo a pantalla completa, con espacio real para hacer zoom/pan sin
// recorte, y un menú lateral con todos los destinos. Zoom por botones (+/− accesibles),
// rueda del mouse y pellizco de dos dedos. Cierra con ✕ o Escape.
export default function GlobeFocus({
  markers,
  onCotizar,
  cotizarLabel,
  onClose,
}: {
  markers: GlobeMarker[];
  onCotizar: (m: { name: string; nights: string; price: string }) => void;
  cotizarLabel: string;
  onClose: () => void;
}) {
  const input = useRef<GlobeInput>({ azVel: 0, polVel: 0, autoRotate: true, resetToken: 0 });
  const [zoom, setZoom] = useState(ZOOM_MIN);
  // Destino enfocado: al clickearlo en el menú, el globo vuela hacia él, pausa y abre su card.
  const [focusId, setFocusId] = useState<string | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);
  const flyTo = useCallback((id: string) => {
    setFocusId(id);
    setFocusNonce((n) => n + 1);
  }, []);
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pushedRef = useRef(false);

  const zoomIn = useCallback(() => setZoom((z) => clamp(+(z + ZOOM_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => clamp(+(z - ZOOM_STEP).toFixed(2))), []);
  const reset = useCallback(() => setZoom(ZOOM_MIN), []);

  // Cerrar consumiendo la entrada de historial (→ dispara popstate → onClose). Así el botón
  // "atrás" del navegador y el ✕/Escape terminan en el mismo lugar (el hero), sin salir del sitio.
  const requestClose = useCallback(() => {
    if (typeof window !== "undefined") window.history.back();
  }, []);

  const cotizar = useCallback(
    (m: { name: string; nights: string; price: string }) => {
      onCotizar(m);
      requestClose();
    },
    [onCotizar, requestClose]
  );

  // Historial: al abrir se empuja una entrada; el back del navegador (popstate) cierra el overlay.
  useEffect(() => {
    if (!pushedRef.current) {
      window.history.pushState({ globeFocus: true }, "");
      pushedRef.current = true;
    }
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  // Escape para cerrar + foco inicial en cerrar + trampa de foco (aria-modal) + scroll bloqueado.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        requestClose();
        return;
      }
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const f = root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [requestClose]);

  // Zoom con rueda del mouse y pellizco (listeners nativos con { passive: false } para poder
  // preventDefault y no hacer scroll/zoom de la página).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => clamp(z - Math.sign(e.deltaY) * WHEEL_STEP));
    };
    const dist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    let pinch = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) pinch = dist(e.touches);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = dist(e.touches);
        setZoom((z) => clamp(z + (d - pinch) * PINCH_FACTOR));
        pinch = d;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Explorar destinos en el globo"
      className="fixed inset-0 z-[100] flex flex-col bg-navy-950/97 backdrop-blur-md lg:flex-row"
    >
      {/* Escenario del globo (overflow-hidden → el globo no se desborda sobre el menú/la X). */}
      <div
        ref={stageRef}
        className="relative min-h-[55vh] flex-1 touch-none overflow-hidden lg:min-h-0"
      >
        <Globe
          markers={markers}
          onCotizar={cotizar}
          cotizarLabel={cotizarLabel}
          input={input}
          zoom={zoom}
          focusId={focusId}
          focusNonce={focusNonce}
        />
        {/* Hint oculto en celular (no hay rueda; el gesto de pellizco/arrastre se descubre solo). */}
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 sm:block">
          <span className="rounded-full border border-orange/30 bg-navy-950/80 px-4 py-1.5 font-mono text-[11px] tracking-wide text-cream-50/90 shadow-lg backdrop-blur">
            Rueda o pellizca para acercar · arrastra para girar
          </span>
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <GlobeControls
            input={input}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={reset}
            canZoomIn={zoom < ZOOM_MAX}
            canZoomOut={zoom > ZOOM_MIN}
            showPad={false}
          />
        </div>
      </div>

      {/* Menú de destinos */}
      <aside className="flex max-h-[45vh] w-full flex-col border-t border-white/10 bg-navy-950/80 lg:max-h-none lg:w-80 lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-orange-400">
              Explorar
            </p>
            <h2 className="font-display text-xl font-black uppercase tracking-tight text-cream-50">
              Destinos
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Cerrar el mapa"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-cream-50 outline-none transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-orange"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="min-h-0 flex-1 divide-y divide-white/5 overflow-auto px-2 pb-24 lg:pb-3">
          {markers.map((m) => (
            <li key={m.id} className="flex items-center gap-2 py-0.5">
              <button
                type="button"
                onClick={() => flyTo(m.id)}
                aria-label={`Ver ${m.name} en el globo`}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-base font-bold leading-tight text-cream-50">
                    {m.name}
                  </span>
                  <span className="block truncate font-mono text-[11px] text-orange-400">
                    {m.price}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => cotizar(m)}
                className="mr-2 shrink-0 cursor-pointer rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
              >
                {cotizarLabel}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
