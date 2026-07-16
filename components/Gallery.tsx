"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal } from "./ui";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";

const tiles = [
  { src: "/renders/local-lounge.jpg", cls: "col-span-2 row-span-2" },
  { src: "/renders/local-clocks.jpg", cls: "" },
  { src: "/renders/local-reception.jpg", cls: "" },
  { src: "/renders/local-worldmap.jpg", cls: "col-span-2" },
];

export default function Gallery() {
  const { c } = useI18n();
  // Ubicación real de "Escápate" (Cúcuta): 7.853932, -72.4663327
  const mapEmbed =
    "https://maps.google.com/maps?q=7.853932,-72.4663327&z=16&output=embed";
  const mapsLink = "https://maps.app.goo.gl/YnDfD9VLLPeg2bBYA";

  return (
    <section
      id="galeria"
      className="screen grain relative flex flex-col justify-center overflow-hidden bg-sectionA py-24 text-inkA"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-3">
          <SectionHead
            eyebrow={c.gallery.eyebrow}
            title={c.gallery.title}
            slot="a"
            font="heading"
          />
          <Reveal delay={0.05}>
            <p className="max-w-md text-inkA/65">{c.gallery.body}</p>
          </Reveal>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          {/* Bento de fotos del local */}
          <Reveal className="grid grid-cols-2 grid-rows-[repeat(3,minmax(0,1fr))] gap-3 sm:grid-cols-4 sm:grid-rows-2">
            {tiles.map((t, i) => (
              <div
                key={t.src}
                className={`relative overflow-hidden rounded-2xl ${t.cls} ${
                  i === 0 ? "min-h-[220px]" : "min-h-[104px]"
                }`}
              >
                <Image
                  src={t.src}
                  alt="Interior del local de Escápate en Cúcuta"
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </Reveal>

          {/* Ubicación */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-navy-950 text-cream-50 shadow-[0_40px_80px_-40px_rgba(12,27,47,0.6)]">
              <div className="relative h-40 w-full">
                <iframe
                  title="Ubicación de Escápate en Cúcuta"
                  src={mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  <p className="text-sm leading-relaxed text-cream-50/85">
                    {c.contact.address}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  <p className="text-sm leading-relaxed text-cream-50/85">
                    {c.contact.hours}
                  </p>
                </div>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-semibold transition hover:border-orange hover:text-orange-400"
                >
                  {c.gallery.directions}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
