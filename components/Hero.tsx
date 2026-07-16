"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Stamp, FlightPath } from "./ui";
import { ArrowRight, Globe2 } from "lucide-react";

export default function Hero() {
  const { c } = useI18n();
  const reduced = useReducedMotion();
  const stats = c.about.stats.slice(0, 3);

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
      {/* fondo: papel milimetrado + estela + halo */}
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <FlightPath className="pointer-events-none absolute inset-0 h-full w-full opacity-50" />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-[38vh] w-[38vh] rounded-full bg-orange/15 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-14 pt-24 sm:px-8 lg:grid-cols-[1.04fr_0.92fr] lg:gap-14 lg:pt-24">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.p
            {...rise(0)}
            className="flex items-center justify-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-orange-400 sm:text-xs lg:justify-start"
          >
            Pase de abordar
            <span className="inline-block h-px w-10 bg-orange-400/60" aria-hidden="true" />
            Boarding pass
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-5 font-display text-[clamp(3rem,8.4vw,6.75rem)] font-black uppercase leading-[0.9] tracking-tightest"
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
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
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
            className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-cream-50/55 lg:justify-start"
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

        {/* Boarding pass card */}
        <motion.div
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, y: 26, rotate: -1 },
                animate: { opacity: 1, y: 0, rotate: 0 },
                transition: { duration: 0.8, delay: 0.2 },
              })}
          className="relative mx-auto w-full max-w-[420px]"
        >
          <Stamp className="absolute -right-4 -top-9 z-10 h-32 w-32 rotate-[-9deg] drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)] sm:-right-6 sm:h-36 sm:w-36" />

          <div className="relative z-[5] rounded-[10px] bg-cream-50 text-navy-900 shadow-[0_50px_90px_-34px_rgba(0,0,0,0.6)]">
            {/* header */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-navy-900/20 px-6 py-4">
              <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-orange">
                PASE DE ABORDAR
              </span>
              <span className="font-mono text-[11px] font-bold tracking-wider text-navy-900/45">
                ESC · 001
              </span>
            </div>

            {/* route */}
            <div className="px-6 py-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-display text-4xl font-black leading-none tracking-tightest sm:text-5xl">
                    CUC
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-wider text-navy-900/50">
                    CÚCUTA
                  </div>
                </div>
                <div className="mb-1 flex-1 px-2">
                  <svg viewBox="0 0 120 24" className="w-full" aria-hidden="true">
                    <path
                      d="M2,20 C40,20 60,6 110,4"
                      fill="none"
                      stroke="#E8732A"
                      strokeWidth="1.6"
                      strokeDasharray="2 4"
                      strokeLinecap="round"
                    />
                    <path d="M110,4 l-8,-1 l3,3 l-2,4 z" fill="#E8732A" />
                  </svg>
                </div>
                <div className="flex flex-col items-end text-right">
                  <Globe2 className="h-11 w-11 text-orange sm:h-12 sm:w-12" strokeWidth={1.5} />
                  <div className="mt-1 font-mono text-[10px] tracking-wider text-navy-900/50">
                    {c.hero.route}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-wider text-navy-900/50">
                <div>
                  <div className="opacity-70">{c.hero.passenger}</div>
                  <div className="mt-1 text-sm font-bold text-navy-900">TÚ / YOU</div>
                </div>
                <div>
                  <div className="opacity-70">Vuelo</div>
                  <div className="mt-1 text-sm font-bold text-navy-900">ESC 2026</div>
                </div>
                <div>
                  <div className="opacity-70">Clase</div>
                  <div className="mt-1 text-sm font-bold text-orange">A MEDIDA</div>
                </div>
              </div>
            </div>

            {/* barcode footer */}
            <div className="border-t-2 border-dashed border-navy-900/20 px-6 py-4">
              <div
                className="h-10 w-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg,#11233E 0 2px,transparent 2px 3px,#11233E 3px 4px,transparent 4px 7px,#11233E 7px 10px,transparent 10px 12px)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
