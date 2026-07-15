"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal } from "./ui";
import { ArrowUpRight } from "lucide-react";

export default function Destinos() {
  const { c } = useI18n();
  const groupKeys = Object.keys(c.destinos.groups) as Array<
    keyof typeof c.destinos.groups
  >;
  const [group, setGroup] = useState<string>("colombia");
  const items = c.destinos.items.filter((d) => d.group === group);

  return (
    <section id="destinos" className="relative bg-surface py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow={c.destinos.eyebrow} title={c.destinos.title} />

        {/* Tabs Colombia / Internacional */}
        <div className="mt-8 inline-flex rounded-full border border-ink/15 bg-panel p-1">
          {groupKeys.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                group === g
                  ? "bg-orange text-white"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {c.destinos.groups[g]}
            </button>
          ))}
        </div>

        {/* Photo cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {items.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.05}>
              <a
                href="#contacto"
                className="group relative block overflow-hidden rounded-2xl ring-1 ring-ink/10"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={d.img}
                    alt={d.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-navy-950/80 px-3 py-1.5 font-mono text-sm text-orange-400 backdrop-blur">
                    {d.price}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <div>
                      <h3 className="font-display text-3xl text-white">
                        {d.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/75">
                        {d.region} · {d.nights}
                      </p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange text-white transition group-hover:translate-x-0.5">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink/40">{c.destinos.note}</p>
      </div>
    </section>
  );
}
