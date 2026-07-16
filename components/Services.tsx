"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHead } from "./ui";

export default function Services() {
  const { c } = useI18n();

  return (
    <section
      id="servicios"
      className="screen relative flex flex-col justify-center overflow-hidden bg-navy-950 py-24 text-cream-50"
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow={c.services.eyebrow}
          title={c.services.title}
          tone="dark"
        />

        <div className="mt-12 border-t border-white/12">
          {c.services.items.map((s, i) => (
            <Reveal key={s.title}>
              <div className="group grid gap-2 border-b border-white/12 py-7 transition sm:grid-cols-[auto_1.05fr_1.9fr] sm:items-baseline sm:gap-10">
                <span className="font-display text-3xl font-black leading-none text-orange-400 sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                  {s.title}
                </h3>
                <p className="max-w-md leading-relaxed text-cream-50/70">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
