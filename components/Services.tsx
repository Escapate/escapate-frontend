"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHead } from "./ui";

export default function Services() {
  const { c } = useI18n();

  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-surface2 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow={c.services.eyebrow} title={c.services.title} />

        <div className="mt-12 border-t border-ink/10">
          {c.services.items.map((s, i) => (
            <Reveal key={s.title}>
              <div className="grid gap-2 border-b border-ink/10 py-8 sm:grid-cols-[auto_1.1fr_2fr] sm:items-baseline sm:gap-10">
                <span className="font-numeric text-4xl leading-none text-orange-400 sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl text-ink sm:text-3xl">
                  {s.title}
                </h3>
                <p className="max-w-md text-lg leading-relaxed text-ink/80">
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
