"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SectionHead, RouteTag } from "./ui";
import { airportCode } from "@/lib/airports";
import { ArrowUpRight } from "lucide-react";

export default function Destinos() {
  const { c } = useI18n();
  const items = c.destinos.items;
  const [active, setActive] = useState(0);
  const feat = items[active];

  return (
    <section
      id="destinos"
      className="screen relative flex flex-col justify-center overflow-hidden bg-navy-950 text-cream-50"
    >
      {/* Fondo: foto del destino activo */}
      {items.map((d, i) => (
        <div
          key={d.img}
          aria-hidden={i !== active}
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={d.img}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-24 sm:px-8">
        <SectionHead
          eyebrow={c.destinos.eyebrow}
          title={c.destinos.title}
          tone="dark"
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          {/* Featured */}
          <div>
            <RouteTag to={feat.name} />
            <h3 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase leading-[0.92] tracking-tightest">
              {feat.name}
            </h3>
            <p className="mt-2 text-cream-50/75">
              {feat.region} · {feat.nights}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="font-mono text-lg font-bold text-orange-400">
                {feat.price}
              </span>
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 rounded-md bg-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {c.hero.ctaPrimary}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Lista */}
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
            {items.map((d, i) => (
              <li key={d.img}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    i === active
                      ? "border-orange/60 bg-white/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-bold tracking-wider text-orange-400">
                      {airportCode(d.name)}
                    </span>
                    <span className="font-heading font-bold">{d.name}</span>
                  </span>
                  <span className="font-mono text-xs text-cream-50/55">
                    {d.price}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[11px] text-cream-50/40">{c.destinos.note}</p>
      </div>
    </section>
  );
}
