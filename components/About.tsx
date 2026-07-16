"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal, Stamp } from "./ui";

export default function About() {
  const { c } = useI18n();

  return (
    <section
      id="nosotros"
      className="screen grain relative flex flex-col justify-center overflow-hidden bg-cream-50 py-24 text-navy-900"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionHead
            eyebrow={c.about.eyebrow}
            title={c.about.title}
            tone="light"
            font="heading"
          />
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-900/70">
              {c.about.body}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 sm:max-w-md">
              {c.about.stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-4xl font-black tracking-tightest text-orange sm:text-5xl">
                    {s.n}
                  </dt>
                  <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-navy-900/55">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Foto del local */}
        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgba(12,27,47,0.5)]">
            <Image
              src="/renders/local-tagline.jpg"
              alt="Interior del local de Escápate con el mural 'Tu viaje empieza aquí'"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
          <Stamp className="absolute -bottom-6 -left-6 h-28 w-28 rotate-[8deg] drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]" />
        </Reveal>
      </div>
    </section>
  );
}
