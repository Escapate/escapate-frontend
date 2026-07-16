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

/* ── Eyebrow (etiqueta mono con barra) ────────────────────────────────── */

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const color = tone === "dark" ? "text-orange-400" : "text-orange-600";
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] sm:text-xs ${color}`}
    >
      <span
        className="inline-block h-2.5 w-px bg-current opacity-70"
        aria-hidden="true"
      />
      {children}
    </p>
  );
}

/* ── SectionHead ──────────────────────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  tone = "light",
  font = "display",
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  tone?: "light" | "dark";
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
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-3 max-w-2xl text-balance text-[clamp(1.9rem,4.2vw,3.2rem)] leading-[1.02] ${titleCls}`}
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
