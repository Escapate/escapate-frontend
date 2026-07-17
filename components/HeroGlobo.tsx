"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import Globe, { type GlobeInput } from "./globe/Globe";
import GlobeControls from "./globe/GlobeControls";
import { ArrowRight, Hand } from "lucide-react";
import { DESTINO_GEO } from "@/lib/destino-geo";
import { buildQuoteIntent } from "@/lib/quote-intent";
import { useQuoteIntent } from "@/lib/quote-provider";

// Zoom acotado para romper clústers (ajuste fino en pnpm dev).
const ZOOM_MIN = 1;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.5;

// Variante del hero que conserva el globo 3D (en vez de la tarjeta boarding-pass),
// estilizado dentro del tema editorial "Pase de Abordar".
export default function HeroGlobo() {
  const { c } = useI18n();
  const reduced = useReducedMotion();
  const stats = c.about.stats.slice(0, 3);

  const { requestQuote } = useQuoteIntent();
  // Objeto de control compartido con el canvas (lo mutan los GlobeControls, lo lee el frame).
  const globeInput = useRef<GlobeInput>({
    azVel: 0,
    polVel: 0,
    autoRotate: true,
    resetToken: 0,
  });
  // Nivel de zoom (estado React → recalcula el clustering al cambiar).
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2))),
    []
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2))),
    []
  );
  const resetGlobe = useCallback(() => setZoom(ZOOM_MIN), []);
  const markers = DESTINO_GEO.flatMap((geo) => {
    const info = c.destinos.items.find((d) => d.id === geo.id);
    if (!info) return [];
    return [
      {
        id: geo.id,
        name: info.name,
        price: info.price,
        img: info.img,
        nights: info.nights,
        lat: geo.lat,
        lng: geo.lng,
      },
    ];
  });
  const handleCotizar = (m: { name: string; nights: string; price: string }) =>
    requestQuote(buildQuoteIntent(m, c.quote.prefillNote));

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay },
        };

  return (
    <section
      id="top"
      className="screen relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 text-cream-50"
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-[38vh] w-[38vh] rounded-full bg-orange/15 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-5 pb-8 sm:px-8 lg:grid-cols-[1.04fr_0.92fr] lg:gap-12">
        {/* Copy */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.p
            {...rise(0)}
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:justify-start"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-400 sm:text-sm">
              Agencia de viajes
            </span>
            <span className="hidden h-5 w-px bg-cream-50/30 sm:inline-block" aria-hidden="true" />
            <span className="font-display text-xl font-black uppercase tracking-tight text-cream-50 sm:text-2xl">
              Escápate
            </span>
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-5 font-display text-[clamp(3rem,8vw,6.25rem)] font-black uppercase leading-[0.9] tracking-tightest lg:text-[6.75rem]"
          >
            {c.hero.titleA}
            <br />
            {c.hero.titleB}{" "}
            <span className="text-orange">{c.hero.titleAccent}.</span>
          </motion.h1>

          <motion.p
            {...rise(0.18)}
            className="mx-auto mt-6 max-w-md text-pretty text-base leading-relaxed text-cream-50/80 sm:text-lg lg:mx-0"
          >
            {c.hero.subtitle}
          </motion.p>

          <motion.div
            {...rise(0.26)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-6 lg:justify-start"
          >
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 rounded-md bg-orange px-7 py-4 font-semibold text-white shadow-[0_18px_36px_-16px_rgba(232,115,42,0.8)] transition hover:bg-orange-600"
            >
              {c.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#destinos"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-7 py-4 font-medium text-cream-50 transition hover:border-white/60"
            >
              {c.hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.div
            {...rise(0.34)}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-cream-50/55 lg:mt-6 lg:justify-start"
          >
            {stats.map((s, i) => (
              <span key={s.label} className="flex items-center gap-6">
                {i > 0 && <span className="opacity-30" aria-hidden="true">/</span>}
                <span>
                  <b className="text-cream-50">{s.n}</b> {s.label}
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Globo 3D */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-[80vw] max-w-[460px] lg:w-full lg:max-w-[520px]">
            <Globe
              markers={markers}
              onCotizar={handleCotizar}
              cotizarLabel={c.nav.cta}
              input={globeInput}
              zoom={zoom}
            />
            <div className="pointer-events-none absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <Hand className="h-3.5 w-3.5 text-orange-400" />
              <span className="font-mono text-[11px] tracking-wide text-cream-50/60">
                {c.hero.dragHint}
              </span>
            </div>
            {/* Controles accesibles (fuera del subárbol aria-hidden del globo). */}
            {!reduced && (
              <div className="absolute bottom-1 right-1 z-20">
                <GlobeControls
                  input={globeInput}
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  onReset={resetGlobe}
                  canZoomIn={zoom < ZOOM_MAX}
                  canZoomOut={zoom > ZOOM_MIN}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
