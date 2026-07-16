"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { WHATSAPP_NUMBER, WEB3FORMS_KEY } from "@/lib/content";
import { RouteTag, Perf, WhatsAppIcon } from "./ui";
import {
  PlaneTakeoff,
  MapPin,
  Users,
  CalendarDays,
  ChevronDown,
  Minus,
  Plus,
  Mail,
  Check,
  ChevronRight,
  StickyNote,
} from "lucide-react";

type Menu = "from" | "dest" | "pax" | null;
type Status = "idle" | "sending" | "ok" | "err";

/* Stepper +/- (estilo main, sobre crema) */
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
        aria-label="Restar"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-8 w-8 place-items-center rounded-lg border border-navy-900/20 text-navy-900 transition hover:border-orange disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center font-mono text-base tabular-nums text-navy-900">
        {value}
      </span>
      <button
        type="button"
        aria-label="Sumar"
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
    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-navy-900/55">
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
      className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-navy-900/10 bg-white p-1.5 shadow-2xl"
    >
      {options.map((o) => (
        <li key={o} role="option" aria-selected={o === value}>
          <button
            type="button"
            onClick={() => onPick(o)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
              o === value
                ? "bg-orange/15 text-orange-600"
                : "text-navy-900/80 hover:bg-navy-900/5"
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

function Chips({
  options,
  isActive,
  onPick,
}: {
  options: readonly string[];
  isActive: (i: number) => boolean;
  onPick: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={isActive(i)}
          onClick={() => onPick(i)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            isActive(i)
              ? "border-orange bg-orange/15 text-orange-600"
              : "border-navy-900/15 text-navy-900/80 hover:border-navy-900/30"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const triggerCls =
  "flex w-full items-center justify-between rounded-lg border border-navy-900/15 bg-white p-3 text-left text-navy-900 transition hover:border-navy-900/30";

export default function Cotizador() {
  const { c } = useI18n();
  const q = c.quote;
  const wa = `https://wa.me/${WHATSAPP_NUMBER}`;
  const ref = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<Menu>(null);
  // Índices (no texto) → no se pierde la selección al cambiar de idioma.
  const [fromIdx, setFromIdx] = useState(0);
  const [destIdx, setDestIdx] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [days, setDays] = useState(5);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [hasDates, setHasDates] = useState(false);
  const [monthIdx, setMonthIdx] = useState<number | null>(null);
  const [departure, setDeparture] = useState("");
  const [depReturn, setDepReturn] = useState("");
  const [hotelIdx, setHotelIdx] = useState<number | null>(null);
  const [planIdx, setPlanIdx] = useState<number | null>(null);
  const [prefsIdx, setPrefsIdx] = useState<number[]>([]);
  const [otherPref, setOtherPref] = useState("");

  const from = q.cities[fromIdx] ?? q.cities[0];
  const dest = q.tours[destIdx] ?? q.tours[0];

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const total = adults + children + seniors;
  const paxParts = [
    `${adults} ${q.adults}`,
    children > 0 ? `${children} ${q.children}` : null,
    seniors > 0 ? `${seniors} ${q.seniors}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const m = q.msg;
  const message = `${m.intro}
• ${m.from}: ${from}
• ${m.dest}: ${dest}
• ${m.pax}: ${paxParts}
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

  const inputCls = (bad?: boolean) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-navy-900 outline-none transition placeholder:text-navy-900/35 focus:ring-2 ${
      bad
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-navy-900/15 focus:border-orange focus:ring-orange/30"
    }`;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[10px] bg-cream-50 text-navy-900 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
    >
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
      <div className="px-5 py-6 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Ciudad de salida */}
          <div className="relative">
            <FieldLabel icon={<PlaneTakeoff className="h-3.5 w-3.5 text-orange-500" />}>
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
              <ChevronDown
                className={`h-4 w-4 text-navy-900/40 transition ${menu === "from" ? "rotate-180" : ""}`}
              />
            </button>
            {menu === "from" && (
              <Options
                options={q.cities}
                value={from}
                onPick={(v) => {
                  setFromIdx((q.cities as readonly string[]).indexOf(v));
                  setMenu(null);
                }}
              />
            )}
          </div>

          {/* Destino / Tour */}
          <div className="relative">
            <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-500" />}>
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
              <ChevronDown
                className={`h-4 w-4 text-navy-900/40 transition ${menu === "dest" ? "rotate-180" : ""}`}
              />
            </button>
            {menu === "dest" && (
              <Options
                options={q.tours}
                value={dest}
                onPick={(v) => {
                  setDestIdx((q.tours as readonly string[]).indexOf(v));
                  setMenu(null);
                }}
              />
            )}
          </div>

          {/* Pasajeros */}
          <div className="relative">
            <FieldLabel icon={<Users className="h-3.5 w-3.5 text-orange-500" />}>
              {q.passengers}
            </FieldLabel>
            <button
              type="button"
              className={triggerCls}
              aria-haspopup="dialog"
              aria-expanded={menu === "pax"}
              onClick={() => setMenu(menu === "pax" ? null : "pax")}
            >
              {total} {q.people}
              <ChevronDown
                className={`h-4 w-4 text-navy-900/40 transition ${menu === "pax" ? "rotate-180" : ""}`}
              />
            </button>
            {menu === "pax" && (
              <div className="absolute z-20 mt-2 w-full rounded-xl border border-navy-900/10 bg-white p-3 shadow-2xl">
                {[
                  { label: q.adults, value: adults, set: setAdults, min: 1 },
                  { label: q.children, value: children, set: setChildren, min: 0 },
                  { label: q.seniors, value: seniors, set: setSeniors, min: 0 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-navy-900/80">{row.label}</span>
                    <Stepper value={row.value} onChange={row.set} min={row.min} max={20} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Días */}
          <div>
            <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-500" />}>
              {q.days}
            </FieldLabel>
            <div className="flex items-center justify-between rounded-lg border border-navy-900/15 bg-white p-3">
              <span className="text-navy-900">
                {days} {q.daysUnit}
              </span>
              <Stepper value={days} onChange={setDays} min={1} max={60} />
            </div>
          </div>
        </div>

        {/* Contacto: nombre / celular / correo */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={q.name}
              className={inputCls(errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{q.required}</p>}
          </div>
          <div>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={q.phone}
              className={inputCls(errors.phone)}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{q.required}</p>}
          </div>
          <div>
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={q.emailField}
              className={inputCls(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{q.required}</p>}
          </div>
        </div>

        {/* Resumen bonito (talón del pase) */}
        <div className="mt-4 rounded-xl border border-navy-900/10 bg-navy-950/[0.03] p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <RouteTag to={dest} from={from} />
            <span className="flex items-center gap-1.5 text-sm text-navy-900/75">
              <Users className="h-4 w-4 text-orange-500" />
              {total} {q.people}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-navy-900/75">
              <CalendarDays className="h-4 w-4 text-orange-500" />
              {days} {q.daysUnit}
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] text-navy-900/55">{paxParts}</p>
        </div>

        {/* Más detalles (opcional) */}
        <div className="mt-4 border-t border-navy-900/10 pt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-navy-900/60 transition hover:text-orange"
          >
            <ChevronRight className={`h-4 w-4 transition ${open ? "rotate-90" : ""}`} />
            {q.more}
          </button>

          {open && (
            <div className="mt-4 grid gap-4">
              {/* Fechas */}
              <div>
                <label className="flex cursor-pointer items-center justify-between">
                  <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.hasDates}
                  </FieldLabel>
                  <input
                    type="checkbox"
                    checked={hasDates}
                    onChange={(e) => setHasDates(e.target.checked)}
                    className="h-4 w-4 accent-orange"
                  />
                </label>
                {hasDates ? (
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-500" />}>
                        {q.departure}
                      </FieldLabel>
                      <input
                        type="date"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        className={inputCls()}
                      />
                    </div>
                    <div>
                      <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-500" />}>
                        {q.returnLabel}
                      </FieldLabel>
                      <input
                        type="date"
                        value={depReturn}
                        onChange={(e) => setDepReturn(e.target.value)}
                        className={inputCls()}
                      />
                    </div>
                  </div>
                ) : (
                  <select
                    value={monthIdx ?? ""}
                    onChange={(e) => setMonthIdx(e.target.value === "" ? null : Number(e.target.value))}
                    className={`mt-2 ${inputCls()}`}
                  >
                    <option value="">{q.monthPh}</option>
                    {q.months.map((mo, i) => (
                      <option key={mo} value={i}>{mo}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Hospedaje */}
              <div className="grid gap-3">
                <div>
                  <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.hotel}
                  </FieldLabel>
                  <Chips
                    options={q.hotelOptions}
                    isActive={(i) => i === hotelIdx}
                    onPick={(i) => setHotelIdx((cur) => (cur === i ? null : i))}
                  />
                </div>
                <div>
                  <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.plan}
                  </FieldLabel>
                  <Chips
                    options={q.planOptions}
                    isActive={(i) => i === planIdx}
                    onPick={(i) => setPlanIdx((cur) => (cur === i ? null : i))}
                  />
                </div>
                <div>
                  <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.prefs}
                  </FieldLabel>
                  <Chips
                    options={q.prefsOptions}
                    isActive={(i) => prefsIdx.includes(i)}
                    onPick={(i) =>
                      setPrefsIdx((cur) =>
                        cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]
                      )
                    }
                  />
                  <input
                    value={otherPref}
                    onChange={(e) => setOtherPref(e.target.value)}
                    placeholder={q.otherPrefPh}
                    className={`mt-2 ${inputCls()}`}
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <FieldLabel icon={<StickyNote className="h-3.5 w-3.5 text-orange-500" />}>
                  {q.notes}
                </FieldLabel>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={q.notesPh}
                  rows={3}
                  className={`${inputCls()} resize-none`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* muesca troquelada */}
      <Perf notch="#0C1B2F" />

      {/* acciones */}
      <div className="px-5 py-6 sm:px-6">
        <div className="grid gap-2 sm:grid-cols-[1.5fr_1fr]">
          <button
            type="button"
            onClick={onWhatsApp}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-wa px-5 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-[#06351c] shadow-[0_16px_34px_-16px_rgba(37,211,102,0.8)] transition hover:brightness-105"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {q.whatsapp}
          </button>
          <button
            type="button"
            onClick={onEmail}
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-navy-900/20 px-5 py-3.5 text-sm font-semibold text-navy-900 transition hover:border-orange hover:text-orange disabled:opacity-60"
          >
            <Mail className="h-4 w-4" />
            {status === "sending" ? "…" : q.email}
          </button>
        </div>

        {status === "ok" && <p className="mt-3 text-sm font-semibold text-green-700">{q.ok}</p>}
        {status === "err" && (
          <p className="mt-3 text-sm font-semibold text-orange-600">{q.err}</p>
        )}
      </div>
    </div>
  );
}
