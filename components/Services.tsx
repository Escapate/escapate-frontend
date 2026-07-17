"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHead } from "./ui";

export default function Services() {
  const { c } = useI18n();

  return (
    <section
      id="servicios"
      className="relative flex flex-col justify-center overflow-hidden bg-sectionB py-16 text-inkB sm:min-h-[100svh] sm:py-24"
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow={c.services.eyebrow} title={c.services.title} slot="b" />

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-7 sm:mt-12 sm:block sm:border-t sm:border-inkB/12">
          {c.services.items.map((s, i) => (
            <Reveal key={s.title}>
              <div className="group grid content-start gap-1.5 transition sm:grid-cols-[auto_1.05fr_1.9fr] sm:items-baseline sm:gap-10 sm:border-b sm:border-inkB/12 sm:py-7">
                <span className="font-display text-3xl font-black leading-none text-orange-400 transition group-hover:text-orange sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-lg font-bold leading-tight sm:text-3xl sm:leading-normal">
                  {s.title}
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-inkB/70 sm:text-base">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
