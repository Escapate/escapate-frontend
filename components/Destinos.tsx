"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SectionHead, RouteTag } from "./ui";
import { airportCode } from "@/lib/airports";
import { useQuoteIntent } from "@/lib/quote-provider";
import { buildQuoteIntent } from "@/lib/quote-intent";
import { centerScrollLeft } from "@/lib/scroll";
import { ArrowUpRight } from "lucide-react";

const ADVANCE_MS = 4000; // avance automático al siguiente destino
const HOVER_RESUME_MS = 3000; // retoma 3 s después de quitar el mouse (sin click)
const CLICK_RESUME_MS = 15000; // retoma 15 s después de quitar el mouse (con click)

export default function Destinos() {
  const { c } = useI18n();
  const items = c.destinos.items;
  const q = c.quote;
  const { requestQuote } = useQuoteIntent();
  const [active, setActive] = useState(0);
  const feat = items[active];
  const count = items.length;

  // El precio viene como "desde $890.000": separo la etiqueta del monto.
  const dollarIdx = feat.price.indexOf("$");
  const priceFrom = dollarIdx > 0 ? feat.price.slice(0, dollarIdx).trim() : "";
  const priceAmount = dollarIdx >= 0 ? feat.price.slice(dollarIdx) : feat.price;

  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();
  const clickedRef = useRef(false);
  const [hovering, setHovering] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Programa la reanudación del autoplay pasados `ms`.
  function scheduleResume(ms: number) {
    clearTimeout(resumeTimer.current);
    setCooldown(true);
    resumeTimer.current = setTimeout(() => setCooldown(false), ms);
  }

  // Mientras el mouse está encima: pausa. Al salir, el retomar depende de si hubo click.
  function handleEnter() {
    clearTimeout(resumeTimer.current);
    setCooldown(false);
    clickedRef.current = false;
    setHovering(true);
  }
  function handleLeave() {
    setHovering(false);
    scheduleResume(clickedRef.current ? CLICK_RESUME_MS : HOVER_RESUME_MS);
  }

  // Click en una card: fija el destino y hace que al salir el retomar sea el largo (15 s).
  function selectAndPause(i: number) {
    setActive(i);
    clickedRef.current = true;
    scheduleResume(CLICK_RESUME_MS);
  }
  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  // Respeta la preferencia del sistema de menos movimiento.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Solo corre el autoplay cuando la sección está a la vista.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay: avanza al siguiente destino salvo que esté pausado.
  useEffect(() => {
    if (reducedMotion || hovering || cooldown || !visible || count <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), ADVANCE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, hovering, cooldown, visible, count]);

  // Centra la mini-card activa en la tira (por si no cabe completa). Movemos solo
  // el scroll horizontal de la tira, NO usamos scrollIntoView: ese desplaza también
  // la ventana en vertical y, al entrar la sección en pantalla, robaba el scroll de
  // la página anclándola en #destinos (rompía la navegación desde el hero).
  useEffect(() => {
    if (!visible) return;
    const list = listRef.current;
    const li = list?.children[active] as HTMLElement | undefined;
    if (!list || !li) return;
    const liBox = li.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const left = centerScrollLeft({
      scrollLeft: list.scrollLeft,
      clientWidth: list.clientWidth,
      scrollWidth: list.scrollWidth,
      containerLeft: listBox.left,
      childLeft: liBox.left,
      childWidth: liBox.width,
    });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active, visible]);

  return (
    <section
      ref={sectionRef}
      id="destinos"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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
          className="w-fit rounded-2xl bg-black/35 px-5 py-4 backdrop-blur-sm"
        />

        <div className="flex flex-col gap-7">
          {/* Featured */}
          <div className="w-fit rounded-2xl bg-black/25 p-5 backdrop-blur-sm sm:p-6">
            <RouteTag to={feat.name} />
            <h3 className="mt-4 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tightest drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {feat.name}
            </h3>
            <p className="mt-2 text-lg text-cream-50 [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
              {feat.region} · {feat.nights}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex flex-col leading-none">
                {priceFrom && (
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">
                    {priceFrom}
                  </span>
                )}
                <span className="font-mono text-4xl font-black tabular-nums text-cream-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-5xl">
                  {priceAmount}
                </span>
                <span className="mt-1 font-mono text-[11px] font-medium tracking-wide text-cream-50/70">
                  {c.destinos.perPerson}
                </span>
              </div>
              <button
                type="button"
                onClick={() => requestQuote(buildQuoteIntent(feat, q.prefillNote))}
                className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3 text-base font-semibold backdrop-blur transition hover:border-white hover:bg-white/15 sm:text-lg"
              >
                {c.hero.ctaPrimary}
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Selector: mini-cards con foto */}
          <ul
            ref={listRef}
            className="-mx-1 flex gap-3 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((d, i) => (
              <li key={d.img} className="shrink-0">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => selectAndPause(i)}
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

          <p className="w-fit rounded-lg bg-black/30 px-2.5 py-1 font-mono text-[11px] text-cream-50/70 backdrop-blur-sm">
            {c.destinos.note}
          </p>
        </div>
      </div>
    </section>
  );
}
