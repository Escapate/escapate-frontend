"use client";

import { motion, useReducedMotion } from "framer-motion";
import { airportCode } from "@/lib/airports";

/* ── Reveal on scroll ─────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 0.61, 0.18, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Slots de tema ────────────────────────────────────────────────────── */
// "a"/"b" se adaptan a los 3 temas; "onDark"/"onLight" son fijos (hero, fotos).
export type Slot = "a" | "b" | "onDark" | "onLight";

const inkCls: Record<Slot, string> = {
  a: "text-inkA",
  b: "text-inkB",
  onDark: "text-cream-50",
  onLight: "text-navy-900",
};

/* ── Eyebrow (etiqueta mono con barra) ────────────────────────────────── */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  // El naranja funciona sobre crema y navy en los tres temas.
  return (
    <p className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-orange-500 sm:text-xs">
      <span className="inline-block h-2.5 w-px bg-current opacity-80" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ── SectionHead ──────────────────────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  slot = "a",
  font = "display",
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  slot?: Slot;
  font?: "display" | "heading";
  align?: "left" | "center";
  className?: string;
}) {
  const titleCls =
    font === "display"
      ? "font-display font-black uppercase tracking-tightest"
      : "font-heading font-extrabold tracking-tight";
  return (
    <Reveal
      className={`${align === "center" ? "flex flex-col items-center text-center" : ""} ${className}`}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={`mt-3 max-w-2xl text-balance text-[clamp(1.9rem,4.2vw,3.2rem)] leading-[1.02] ${titleCls} ${inkCls[slot]}`}
      >
        {title}
      </h2>
    </Reveal>
  );
}

/* ── RouteTag "CUC ✈ CTG" ─────────────────────────────────────────────── */

export function RouteTag({
  to,
  from = "Cúcuta",
  className = "",
}: {
  to: string;
  from?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded bg-orange px-2 py-1 font-mono text-[11px] font-bold tracking-wider text-white ${className}`}
    >
      {airportCode(from)} <span aria-hidden="true">✈</span> {airportCode(to)}
    </span>
  );
}

/* ── Perforation: línea punteada con muescas troqueladas ──────────────── */

export function Perf({
  notch = "#0C1B2F",
  className = "",
}: {
  notch?: string;
  className?: string;
}) {
  return (
    <div className={`relative h-0 border-t-2 border-dashed border-navy-900/25 ${className}`}>
      <span
        aria-hidden="true"
        className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full"
        style={{ background: notch }}
      />
      <span
        aria-hidden="true"
        className="absolute -right-[9px] -top-[9px] h-[18px] w-[18px] rounded-full"
        style={{ background: notch }}
      />
    </div>
  );
}

/* ── Sello de caucho (rubber stamp) ───────────────────────────────────── */

export function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <path id="escStampTop" d="M100,100 m-74,0 a74,74 0 1,1 148,0" />
      </defs>
      <circle cx="100" cy="100" r="93" stroke="#E8732A" strokeWidth="3" />
      <circle cx="100" cy="100" r="84" stroke="#E8732A" strokeWidth="1.4" />
      <text
        fill="#E8732A"
        fontFamily="var(--font-mono), monospace"
        fontSize="12.5"
        fontWeight="700"
        letterSpacing="3"
      >
        <textPath href="#escStampTop" startOffset="4%">
          ESCÁPATE · AGENCIA DE VIAJES ·
        </textPath>
      </text>
      <text
        fill="#E8732A"
        fontFamily="var(--font-mono), monospace"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2.5"
      >
        <textPath href="#escStampTop" startOffset="58%">
          CÚCUTA · COLOMBIA ·
        </textPath>
      </text>
      <circle cx="100" cy="101" r="41" fill="#E8732A" opacity=".08" />
      <circle cx="100" cy="101" r="41" stroke="#E8732A" strokeWidth="2" />
      <g stroke="#E8732A" strokeWidth="1.4" opacity=".92">
        <ellipse cx="100" cy="101" rx="41" ry="16" />
        <ellipse cx="100" cy="101" rx="16" ry="41" />
        <line x1="59" y1="101" x2="141" y2="101" />
        <line x1="100" y1="60" x2="100" y2="142" />
      </g>
      <path
        d="M66,142 Q100,120 138,140"
        stroke="#E8732A"
        strokeWidth="2"
        strokeDasharray="1.5 5"
        strokeLinecap="round"
      />
      <path d="M138,140 l-11,-3 l4,4 l-3,5 z" fill="#E8732A" />
    </svg>
  );
}

/* ── Estela / ruta de vuelo punteada (fondo) ──────────────────────────── */

export function FlightPath({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 1400 700"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M-40,560 C320,400 560,520 820,300 C1010,140 1180,180 1460,40"
        fill="none"
        stroke="#F0A04B"
        strokeWidth="2"
        strokeDasharray="2 9"
        strokeLinecap="round"
        className={reduced ? "" : "animate-dash"}
      />
    </svg>
  );
}

/* ── Ícono real de WhatsApp (lucide no trae el logo de marca) ──────────── */

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
