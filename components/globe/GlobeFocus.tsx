"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import Globe, { type GlobeInput, type GlobeMarker } from "./Globe";
import GlobeControls from "./GlobeControls";
import { useI18n } from "@/lib/i18n";
import { matchesQuery } from "@/lib/search";

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
  onClose,
}: {
  markers: GlobeMarker[];
  onCotizar: (m: { name: string; nights?: string; price?: string }) => void;
  onClose: () => void;
}) {
  const { c } = useI18n();
  const g = c.globe;
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
  const searchRef = useRef<HTMLInputElement>(null);
  const pushedRef = useRef(false);
  // Buscador: colapsado es solo la lupa; al abrirlo ocupa la fila del encabezado. Filtra
  // la lista lateral, no los pines: vaciar el globo mientras se escribe lo hace ver roto
  // y rompería el vuelo al destino. Por ahora filtra por nombre (país/continente después).
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Overflow original del body. Se guarda en un ref (no en una variable del efecto)
  // porque `cotizar` también necesita restaurarlo — ver el comentario de abajo.
  const prevOverflowRef = useRef("");

  const zoomIn = useCallback(() => setZoom((z) => clamp(+(z + ZOOM_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => clamp(+(z - ZOOM_STEP).toFixed(2))), []);
  const reset = useCallback(() => setZoom(ZOOM_MIN), []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  // Cerrar la búsqueda siempre limpia la consulta: dejar un filtro activo escondido
  // detrás de la lupa haría que la lista se viera incompleta sin explicación.
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  // El foco entra al input recién cuando aparece (no se puede enfocar antes de montarlo).
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const visibles = useMemo(
    () => markers.filter((m) => matchesQuery(m.name, query)),
    [markers, query]
  );
  // Exige consulta escrita: así el estado vacío nunca aparece con la lista sin filtrar
  // (y el botón de cotizar nunca se dispara con un destino en blanco).
  const sinResultados = visibles.length === 0 && query.trim().length > 0;

  // Cerrar consumiendo la entrada de historial (→ dispara popstate → onClose). Así el botón
  // "atrás" del navegador y el ✕/Escape terminan en el mismo lugar (el hero), sin salir del sitio.
  const requestClose = useCallback(() => {
    if (typeof window !== "undefined") window.history.back();
  }, []);

  const cotizar = useCallback(
    (m: { name: string; nights?: string; price?: string }) => {
      // Se suelta el scroll del body antes de pedir la cotización: requestQuote hace
      // scrollIntoView hacia #contacto y el desmontaje del overlay (que restauraría el
      // overflow) llega tarde, porque requestClose va por history.back(), que es
      // asíncrono. Esto por sí solo NO alcanza: lo que rompía el scroll era la
      // restauración de posición del navegador al volver atrás — ver el efecto de
      // historial más abajo, donde se pone scrollRestoration en "manual".
      document.body.style.overflow = prevOverflowRef.current;
      onCotizar(m);
      requestClose();
    },
    [onCotizar, requestClose]
  );

  // Historial: al abrir se empuja una entrada; el back del navegador (popstate) cierra el overlay.
  useEffect(() => {
    // Mientras el overlay vive, el scroll lo manejamos nosotros. Por defecto
    // (scrollRestoration = "auto") el navegador restaura la posición guardada en la
    // entrada a la que se vuelve — el hero — como parte de la travesía de history.back().
    // Esa restauración ocurre DESPUÉS del scrollIntoView que dispara "Cotizar", así que lo
    // pisaba y el usuario terminaba arriba con el formulario prellenado fuera de vista.
    const prevRestoration = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!pushedRef.current) {
      window.history.pushState({ globeFocus: true }, "");
      pushedRef.current = true;
    }
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = prevRestoration;
      }
    };
  }, [onClose]);

  // Foco inicial + bloqueo del scroll de la página. Va en su propio efecto, con deps [],
  // a propósito: si volviera a correr, `prevOverflowRef` capturaría el "hidden" que puso
  // la pasada anterior y al desmontar dejaría la página entera sin poder scrollear.
  useEffect(() => {
    closeRef.current?.focus();
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, []);

  // Escape + trampa de foco (aria-modal).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Escape cierra por capas: primero la búsqueda, y solo si no hay búsqueda
        // abierta cierra el overlay. Si no, escribir mal una consulta te echaba del globo.
        if (searchOpen) {
          closeSearch();
          return;
        }
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
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose, searchOpen, closeSearch]);

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
      aria-label={`${g.explore} · ${g.destinations}`}
      className="fixed inset-0 z-[100] flex flex-col bg-navy-950/97 backdrop-blur-md lg:flex-row"
    >
      {/* Escenario del globo (overflow-hidden → el globo no se desborda sobre el menú/la X). */}
      <div
        ref={stageRef}
        className={`relative flex-1 touch-none overflow-hidden lg:min-h-0 ${
          // En celular el alto se reparte con el menú: al buscar, el globo cede sitio para
          // que la lista y el teclado virtual quepan sin desbordar la pantalla.
          searchOpen ? "min-h-[28vh]" : "min-h-[55vh]"
        }`}
      >
        <Globe
          markers={markers}
          onCotizar={cotizar}
          input={input}
          zoom={zoom}
          focusId={focusId}
          focusNonce={focusNonce}
        />
        {/* Hint oculto en celular (no hay rueda; el gesto de pellizco/arrastre se descubre solo). */}
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 sm:block">
          <span className="rounded-full border border-orange/30 bg-navy-950/80 px-4 py-1.5 font-mono text-[11px] tracking-wide text-cream-50/90 shadow-lg backdrop-blur">
            {g.hint}
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

      {/* Menú de destinos. En celular crece cuando se busca (y el escenario del globo cede
          el alto), para que quepan resultados con el teclado virtual abierto. */}
      <aside
        className={`flex w-full flex-col border-t border-white/10 bg-navy-950/80 lg:max-h-none lg:w-80 lg:border-l lg:border-t-0 ${
          searchOpen ? "max-h-[70vh]" : "max-h-[45vh]"
        }`}
      >
        {/* Encabezado pegajoso: la lupa y la ✕ quedan siempre a mano aunque la lista scrollee. */}
        <div className="sticky top-0 z-10 flex items-center gap-2 bg-navy-950/95 px-5 py-4 backdrop-blur">
          {searchOpen ? (
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-50/40"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={g.searchPlaceholder}
                aria-label={g.search}
                autoComplete="off"
                className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pl-9 pr-10 text-sm text-cream-50 outline-none transition placeholder:text-cream-50/40 focus:border-orange focus-visible:ring-2 focus-visible:ring-orange"
              />
              {/* Cierra la búsqueda. Va DENTRO del campo para no competir con la ✕ del
                  overlay, que tiene que seguir disponible: en celular no hay Escape y sin
                  ella el usuario quedaría encerrado en el globo mientras busca. */}
              <button
                type="button"
                onClick={closeSearch}
                aria-label={g.closeSearch}
                className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-cream-50/50 outline-none transition hover:bg-white/10 hover:text-cream-50 focus-visible:ring-2 focus-visible:ring-orange"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-orange-400">
                  {g.explore}
                </p>
                <h2 className="font-display text-xl font-black uppercase tracking-tight text-cream-50">
                  {g.destinations}
                </h2>
              </div>
              <button
                type="button"
                onClick={openSearch}
                aria-label={g.search}
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-cream-50 outline-none transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-orange"
              >
                <Search className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label={g.closeMap}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-cream-50 outline-none transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-orange"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {sinResultados ? (
          /* Sin coincidencias no es un callejón sin salida: el catálogo del globo es una
             selección, no el límite de lo que se puede vender. Se ofrece cotizar lo que
             el usuario escribió, que entra tal cual como destino del formulario. */
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-auto px-6 pb-24 pt-4 text-center lg:pb-6">
            <SearchX className="h-9 w-9 shrink-0 text-orange-400" aria-hidden="true" />
            <p className="font-heading text-lg font-bold leading-tight text-cream-50">
              {g.noResultsFor} «{query.trim()}»
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-cream-50/70">{g.noResultsBody}</p>
            <button
              type="button"
              onClick={() => cotizar({ name: query.trim() })}
              className="mt-1 w-full max-w-xs shrink-0 cursor-pointer rounded-lg bg-orange px-4 py-3.5 text-sm font-bold text-white outline-none transition hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange"
            >
              {c.nav.cta}
            </button>
          </div>
        ) : (
        <ul className="min-h-0 flex-1 divide-y divide-white/5 overflow-auto px-2 pb-24 lg:pb-3">
          {visibles.map((m) => (
            <li key={m.id} className="flex items-center gap-2 py-1">
              <button
                type="button"
                onClick={() => flyTo(m.id)}
                aria-label={`${g.viewOnGlobe}: ${m.name}`}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
              >
                {/* lazy: la lista son 50 miniaturas; sin esto se piden todas de golpe
                    al abrir el modo enfoque. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 shrink-0 rounded-lg object-cover lg:h-16 lg:w-16"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-xl font-bold leading-tight text-cream-50 lg:text-lg">
                    {m.name}
                  </span>
                  {m.price ? (
                    <span className="mt-0.5 block font-heading text-base font-semibold text-cream-50 lg:text-sm">
                      {m.price}
                    </span>
                  ) : (
                    <span className="mt-0.5 block truncate font-mono text-sm tracking-wide text-cream-50/60 lg:text-xs">
                      {m.region}
                    </span>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => cotizar(m)}
                className="mr-2 shrink-0 cursor-pointer rounded-lg bg-orange px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                {c.nav.cta}
              </button>
            </li>
          ))}
        </ul>
        )}
      </aside>
    </div>
  );
}
