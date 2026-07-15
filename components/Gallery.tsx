"use client";

import { useI18n } from "@/lib/i18n";
import { SectionHead } from "./ui";

const tiles = [
  { src: "/renders/local-tagline.jpg", ratio: "aspect-[3/4]" },
  { src: "/renders/local-worldmap.jpg", ratio: "aspect-[4/3]" },
  { src: "/renders/local-clocks.jpg", ratio: "aspect-square" },
  { src: "/renders/local-reception.jpg", ratio: "aspect-[4/3]" },
  { src: "/renders/local-sofa.jpg", ratio: "aspect-[3/4]" },
  { src: "/renders/local-lounge.jpg", ratio: "aspect-square" },
];

export default function Gallery() {
  const { c } = useI18n();

  return (
    <section className="relative bg-surface py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow={c.gallery.eyebrow} title={c.gallery.title} />

        <div className="mt-12 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {tiles.map((t) => (
            <div
              key={t.src}
              className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl ring-1 ring-ink/10 ${t.ratio}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.src}
                alt="Interior del local de Escápate"
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.06]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
