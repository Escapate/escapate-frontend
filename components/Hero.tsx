"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Globe from "./globe/Globe";
import { ArrowRight, Hand, ChevronDown } from "lucide-react";

export default function Hero() {
  const { c } = useI18n();

  return (
    <section id="top" className="grain relative min-h-[100svh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-[130px]" />
        <div className="absolute -right-20 top-1/4 h-[30vh] w-[30vh] rounded-full bg-orange/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-4 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-20">
        {/* Copy */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 font-mono text-sm font-medium uppercase tracking-[0.2em] text-orange-400 sm:text-base lg:justify-start"
          >
            <span className="h-px w-8 bg-orange-400/70" aria-hidden="true" />
            {c.hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-5 font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.98] text-ink"
          >
            {c.hero.titleA} {c.hero.titleB}{" "}
            <span className="italic text-orange-400">{c.hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mx-auto mt-6 max-w-md text-pretty text-lg leading-relaxed text-ink/75 lg:mx-0"
          >
            {c.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              {c.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#destinos"
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-sm text-ink transition hover:border-ink/60"
            >
              {c.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        {/* Globe */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-[82vw] max-w-[520px] lg:w-full">
            <Globe />
            <div className="pointer-events-none absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-ink/10 bg-ink/5 px-4 py-1.5 backdrop-blur-sm">
              <Hand className="h-3.5 w-3.5 text-orange" />
              <span className="font-mono text-[11px] tracking-wide text-ink/60">
                {c.hero.dragHint}
              </span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#destinos"
        aria-label="Bajar"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-ink/40 transition hover:text-ink lg:block"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
