"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal, Stamp } from "./ui";

export default function About() {
  const { c } = useI18n();

  return (
    <section
      id="nosotros"
      className="screen grain relative flex flex-col justify-center overflow-hidden bg-sectionA py-24 text-inkA"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionHead
            eyebrow={c.about.eyebrow}
            title={c.about.title}
            slot="a"
            font="heading"
          />
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-inkA/70">
              {c.about.body}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 sm:max-w-md">
              {c.about.stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-4xl font-black tracking-tightest text-orange sm:text-5xl">
                    {s.n}
                  </dt>
                  <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-inkA/55">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Foto del local — altura acotada para que no se pase de una pantalla */}
        <Reveal delay={0.1} className="relative">
          <div className="relative h-[42svh] max-h-[440px] w-full overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgba(12,27,47,0.5)] lg:h-[58svh] lg:max-h-[560px]">
            <Image
              src="/renders/local-tagline.jpg"
              alt="Interior del local de Escápate con el mural 'Tu viaje empieza aquí'"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
          <Stamp className="absolute -bottom-6 -left-6 h-24 w-24 rotate-[8deg] drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] sm:h-28 sm:w-28" />
        </Reveal>
      </div>
    </section>
  );
}
