"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { WHATSAPP_NUMBER, WEB3FORMS_KEY } from "@/lib/content";
import {
  PlaneTakeoff,
  MapPin,
  Users,
  CalendarDays,
  ChevronDown,
  Minus,
  Plus,
  MessageCircle,
  Mail,
  Check,
  Route,
} from "lucide-react";

type Menu = "from" | "dest" | "pax" | null;
type Status = "idle" | "sending" | "ok" | "err";

function Stepper({
  value,
  onChange,
  min = 0,
  max = 30,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="−"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-8 w-8 place-items-center rounded-lg border border-ink/25 text-ink transition hover:border-orange disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center font-mono text-base tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="+"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-8 w-8 place-items-center rounded-lg bg-orange text-white transition hover:bg-orange-600 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function FieldLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink/45">
      {icon}
      {children}
    </div>
  );
}

function Options({
  options,
  value,
  onPick,
}: {
  options: readonly string[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <ul
      role="listbox"
      className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-ink/15 bg-panel p-1.5 shadow-2xl"
    >
      {options.map((o) => (
        <li key={o}>
          <button
            type="button"
            onClick={() => onPick(o)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
              o === value
                ? "bg-orange/15 text-orange-400"
                : "text-ink/80 hover:bg-ink/5"
            }`}
          >
            {o}
            {o === value && <Check className="h-4 w-4" />}
          </button>
        </li>
      ))}
    </ul>
  );
}

const triggerCls =
  "flex w-full items-center justify-between rounded-xl border border-ink/15 bg-field p-3 text-left text-ink transition hover:border-ink/30";

export default function Cotizador() {
  const { c } = useI18n();
  const q = c.quote;
  const wa = `https://wa.me/${WHATSAPP_NUMBER}`;
  const ref = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<Menu>(null);
  const [from, setFrom] = useState<string>(q.cities[0]);
  const [dest, setDest] = useState<string>(q.tours[0]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [days, setDays] = useState(5);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setFrom(q.cities[0]);
    setDest(q.tours[0]);
  }, [q]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const total = adults + children + infants;
  const paxParts = [
    `${adults} ${q.adults}`,
    children > 0 ? `${children} ${q.children}` : null,
    infants > 0 ? `${infants} ${q.infants}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  const summary = `${from} → ${dest} · ${paxParts} · ${days} ${q.daysUnit}`;

  const message = `Hola, quiero cotizar un viaje:
• Salida: ${from}
• Destino: ${dest}
• Pasajeros: ${paxParts}
• Días: ${days}${name ? `\n• Nombre: ${name}` : ""}`;

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
          pasajeros: paxParts,
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
    <div
      ref={ref}
      className="rounded-3xl border border-ink/10 bg-panel p-5 shadow-sm sm:p-7"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Ciudad de salida */}
        <div className="relative">
          <FieldLabel icon={<PlaneTakeoff className="h-3.5 w-3.5 text-orange-400" />}>
            {q.from}
          </FieldLabel>
          <button
            type="button"
            className={triggerCls}
            aria-haspopup="listbox"
            aria-expanded={menu === "from"}
            onClick={() => setMenu(menu === "from" ? null : "from")}
          >
            {from}
            <ChevronDown className="h-4 w-4 text-ink/40" />
          </button>
          {menu === "from" && (
            <Options
              options={q.cities}
              value={from}
              onPick={(v) => {
                setFrom(v);
                setMenu(null);
              }}
            />
          )}
        </div>

        {/* Destino / Tour */}
        <div className="relative">
          <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-400" />}>
            {q.dest}
          </FieldLabel>
          <button
            type="button"
            className={triggerCls}
            aria-haspopup="listbox"
            aria-expanded={menu === "dest"}
            onClick={() => setMenu(menu === "dest" ? null : "dest")}
          >
            {dest}
            <ChevronDown className="h-4 w-4 text-ink/40" />
          </button>
          {menu === "dest" && (
            <Options
              options={q.tours}
              value={dest}
              onPick={(v) => {
                setDest(v);
                setMenu(null);
              }}
            />
          )}
        </div>

        {/* Pasajeros */}
        <div className="relative">
          <FieldLabel icon={<Users className="h-3.5 w-3.5 text-orange-400" />}>
            {q.passengers}
          </FieldLabel>
          <button
            type="button"
            className={triggerCls}
            aria-expanded={menu === "pax"}
            onClick={() => setMenu(menu === "pax" ? null : "pax")}
          >
            {total} {q.people}
            <ChevronDown className="h-4 w-4 text-ink/40" />
          </button>
          {menu === "pax" && (
            <div className="absolute z-20 mt-2 w-full rounded-xl border border-ink/15 bg-panel p-3 shadow-2xl">
              {[
                { label: q.adults, value: adults, set: setAdults, min: 1 },
                { label: q.children, value: children, set: setChildren, min: 0 },
                { label: q.infants, value: infants, set: setInfants, min: 0 },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-1.5"
                >
                  <span className="text-sm text-ink/80">{row.label}</span>
                  <Stepper
                    value={row.value}
                    onChange={row.set}
                    min={row.min}
                    max={20}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Días */}
        <div>
          <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-400" />}>
            {q.days}
          </FieldLabel>
          <div className="flex items-center justify-between rounded-xl border border-ink/15 bg-field p-3">
            <span className="text-ink">
              {days} {q.daysUnit}
            </span>
            <Stepper value={days} onChange={setDays} min={1} max={60} />
          </div>
        </div>
      </div>

      {/* Nombre */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={q.name}
        className="mt-3 w-full rounded-xl border border-ink/15 bg-field px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-orange focus:ring-2 focus:ring-orange/30"
      />

      {/* Resumen en vivo */}
      <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-orange/25 bg-orange/5 px-4 py-3">
        <Route className="h-5 w-5 shrink-0 text-orange-400" />
        <span className="text-sm text-ink/85">{summary}</span>
      </div>

      {/* Acciones */}
      <div className="mt-4 grid gap-2 sm:grid-cols-[1.4fr_1fr]">
        <button
          type="button"
          onClick={onWhatsApp}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-wa px-5 py-3.5 font-medium text-[#06351a] transition hover:brightness-105"
        >
          <MessageCircle className="h-5 w-5" />
          {q.whatsapp}
        </button>
        <button
          type="button"
          onClick={onEmail}
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange/50 px-5 py-3.5 text-ink transition hover:bg-orange/10 disabled:opacity-60"
        >
          <Mail className="h-4 w-4" />
          {q.email}
        </button>
      </div>

      {status === "ok" && <p className="mt-3 text-sm text-wa">{q.ok}</p>}
      {status === "err" && (
        <p className="mt-3 text-sm text-orange-400">{q.err}</p>
      )}
    </div>
  );
}
