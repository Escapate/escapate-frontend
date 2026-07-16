"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHead } from "./ui";

export default function Services() {
  const { c } = useI18n();

  return (
    <section
      id="servicios"
      className="screen relative flex flex-col justify-center overflow-hidden bg-sectionB py-24 text-inkB"
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow={c.services.eyebrow} title={c.services.title} slot="b" />

        <div className="mt-12 border-t border-inkB/12">
          {c.services.items.map((s, i) => (
            <Reveal key={s.title}>
              <div className="group grid gap-2 border-b border-inkB/12 py-7 transition sm:grid-cols-[auto_1.05fr_1.9fr] sm:items-baseline sm:gap-10">
                <span className="font-display text-3xl font-black leading-none text-orange-400 transition group-hover:text-orange sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                  {s.title}
                </h3>
                <p className="max-w-md leading-relaxed text-inkB/70">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
