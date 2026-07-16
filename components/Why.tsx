"use client";

import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal } from "./ui";
import { PlaneTakeoff } from "lucide-react";

export default function Why() {
  const { c } = useI18n();

  return (
    <section className="screen relative flex flex-col justify-center overflow-hidden bg-navy-950 py-24 text-cream-50">
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-8">
        <SectionHead eyebrow={c.why.eyebrow} title={c.why.title} tone="dark" />

        <Reveal delay={0.05}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/12 bg-navy-800/60 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]">
            {/* board header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/12 bg-navy-900/70 px-5 py-3">
              <span className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-orange-400">
                <PlaneTakeoff className="h-4 w-4" />
                {c.why.board}
              </span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-cream-50/45">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-wa" aria-hidden="true" />
                Escápate · CUC
              </span>
            </div>

            {/* board rows */}
            <ul className="divide-y divide-white/8">
              {c.why.points.map((p, i) => (
                <li
                  key={p}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 sm:gap-6"
                >
                  <span className="font-mono text-xs font-bold tracking-wider text-orange-400">
                    {`ESC ${String((i + 1) * 111).padStart(3, "0")}`}
                  </span>
                  <span className="font-heading text-base font-semibold text-cream-50 sm:text-lg">
                    {p}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-wa sm:text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-wa" aria-hidden="true" />
                    {c.why.onTime}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
