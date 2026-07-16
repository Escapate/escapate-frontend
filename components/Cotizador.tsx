"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { WHATSAPP_NUMBER, WEB3FORMS_KEY } from "@/lib/content";
import { RouteTag, Perf } from "./ui";
import { Mail } from "lucide-react";

type Status = "idle" | "sending" | "ok" | "err";

const fieldCls =
  "w-full appearance-none border-0 border-b-2 border-navy-900/30 bg-transparent px-0 py-1.5 font-display text-lg font-extrabold uppercase tracking-tight text-navy-900 outline-none transition focus:border-orange";
const labelCls =
  "font-mono text-[10px] uppercase tracking-[0.08em] text-navy-900/55";

export default function Cotizador() {
  const { c } = useI18n();
  const q = c.quote;
  const wa = `https://wa.me/${WHATSAPP_NUMBER}`;

  // Guardamos ÍNDICES (no el texto traducido) para no perder la selección
  // al cambiar de idioma — las listas ES/EN tienen la misma longitud.
  const [fromIdx, setFromIdx] = useState(0);
  const [destIdx, setDestIdx] = useState(0);
  const [pax, setPax] = useState(2);
  const [days, setDays] = useState(5);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const from = q.cities[fromIdx] ?? q.cities[0];
  const dest = q.tours[destIdx] ?? q.tours[0];
  const paxLabel = `${pax} ${q.people}`;

  const m = q.msg;
  const message = `${m.intro}
• ${m.from}: ${from}
• ${m.dest}: ${dest}
• ${m.pax}: ${paxLabel}
• ${m.days}: ${days}${name ? `\n• ${m.name}: ${name}` : ""}`;

  function onWhatsApp() {
    window.open(`${wa}?text=${encodeURIComponent(message)}`, "_blank");
  }

  async function onEmail() {
    if (!WEB3FORMS_KEY) {
      onWhatsApp();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Nueva cotización · Escápate",
          name: name || "Sin nombre",
          salida: from,
          destino: dest,
          pasajeros: paxLabel,
          dias: days,
          message,
        }),
      });
      const j = await res.json();
      setStatus(j.success ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="overflow-hidden rounded-[10px] bg-cream-50 text-navy-900 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
      {/* header del pase */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-navy-900/20 px-6 py-4">
        <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-orange">
          {q.eyebrow.toUpperCase()}
        </span>
        <Image
          src="/logo/escapate-transparent.png"
          alt="Escápate"
          width={600}
          height={364}
          className="h-5 w-auto"
        />
      </div>

      {/* campos */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 px-6 py-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelCls}>{q.from}</span>
          <select
            className={fieldCls}
            value={fromIdx}
            onChange={(e) => setFromIdx(Number(e.target.value))}
          >
            {q.cities.map((city, i) => (
              <option key={city} value={i}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelCls}>{q.dest}</span>
          <select
            className={fieldCls}
            value={destIdx}
            onChange={(e) => setDestIdx(Number(e.target.value))}
          >
            {q.tours.map((tour, i) => (
              <option key={tour} value={i}>
                {tour}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelCls}>{q.passengers}</span>
          <input
            type="number"
            min={1}
            max={30}
            className={fieldCls}
            value={pax}
            onChange={(e) => setPax(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelCls}>{q.days}</span>
          <input
            type="number"
            min={1}
            max={60}
            className={fieldCls}
            value={days}
            onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className={labelCls}>{q.name}</span>
          <input
            type="text"
            className={`${fieldCls} normal-case`}
            value={name}
            placeholder="—"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      {/* muesca / talón troquelado (las muescas asoman en el borde) */}
      <Perf notch="#0C1B2F" />

      {/* resumen + acciones */}
      <div className="flex flex-col gap-4 px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <RouteTag to={dest} from={from} />
          <span className="font-mono text-xs text-navy-900/60">
            {paxLabel} · {days} {q.daysUnit}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1.5fr_1fr]">
          <button
            type="button"
            onClick={onWhatsApp}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-wa px-5 py-4 font-mono text-sm font-bold uppercase tracking-wider text-[#06351c] shadow-[0_16px_34px_-16px_rgba(37,211,102,0.8)] transition hover:brightness-105"
          >
            <span className="h-2 w-2 rounded-full bg-[#06351c]" aria-hidden="true" />
            {q.whatsapp}
          </button>
          <button
            type="button"
            onClick={onEmail}
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-navy-900/20 px-5 py-4 text-sm font-semibold text-navy-900 transition hover:border-orange hover:text-orange disabled:opacity-60"
          >
            <Mail className="h-4 w-4" />
            {status === "sending" ? "…" : q.email}
          </button>
        </div>

        {status === "ok" && <p className="text-sm font-semibold text-green-700">{q.ok}</p>}
        {status === "err" && <p className="text-sm font-semibold text-orange-600">{q.err}</p>}
      </div>
    </div>
  );
}
