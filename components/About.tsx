"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Reveal, Eyebrow } from "./ui";

export default function About() {
  const { c } = useI18n();

  return (
    <section id="nosotros" className="relative bg-surface py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow>{c.about.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-balance font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            {c.about.title}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
            {c.about.body}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-9">
            {c.about.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-numeric text-5xl leading-none text-orange-400 sm:text-6xl">
                  {s.n}
                </dt>
                <dd className="mt-2 text-xs leading-snug text-ink/50">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-ink/10">
            <Image
              src="/renders/local-tagline.jpg"
              alt="Interior del local de Escápate con el mural 'Tu viaje empieza aquí'"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
