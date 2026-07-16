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
      className="screen relative flex flex-col overflow-hidden bg-navy-950 text-cream-50"
    >
      {/* Fondo: foto del destino activo (más visible que antes) */}
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
            alt={`${d.name} · ${d.region}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}
      {/* Velo más suave: la foto se ve más; solo se oscurece abajo para leer el texto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-950/45 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between gap-8 px-5 py-24 sm:px-8">
        <SectionHead
          eyebrow={c.destinos.eyebrow}
          title={c.destinos.title}
          slot="onDark"
        />

        <div className="flex flex-col gap-7">
          {/* Featured */}
          <div>
            <RouteTag to={feat.name} />
            <h3 className="mt-4 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tightest drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {feat.name}
            </h3>
            <p className="mt-2 text-lg text-cream-50 [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
              {feat.region} · {feat.nights}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="rounded-md bg-orange px-4 py-2 font-mono text-lg font-bold text-white shadow-[0_12px_28px_-12px_rgba(232,115,42,0.9)]">
                {feat.price}
              </span>
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:border-white hover:bg-white/15"
              >
                {c.hero.ctaPrimary}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Selector: mini-cards con foto */}
          <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((d, i) => (
              <li key={d.img} className="shrink-0">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-label={d.name}
                  className={`group relative block h-24 w-32 overflow-hidden rounded-xl transition ${
                    i === active
                      ? "ring-2 ring-orange ring-offset-2 ring-offset-navy-950"
                      : "opacity-70 ring-1 ring-white/20 hover:opacity-100"
                  }`}
                >
                  <Image src={d.img} alt="" fill className="object-cover" sizes="128px" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between px-2 pb-1.5">
                    <span className="font-heading text-xs font-bold text-white drop-shadow">
                      {d.name}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-orange-400">
                      {airportCode(d.name)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="font-mono text-[11px] text-cream-50/55">{c.destinos.note}</p>
        </div>
      </div>
    </section>
  );
}
