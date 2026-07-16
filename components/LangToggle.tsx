"use client";

import { useI18n } from "@/lib/i18n";

export function LangToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang, toggle } = useI18n();
  const border = tone === "dark" ? "border-white/25" : "border-navy-900/25";
  const on = tone === "dark" ? "text-white" : "text-navy-900";
  const off = tone === "dark" ? "text-white/40" : "text-navy-900/40";
  const sep = tone === "dark" ? "text-white/30" : "text-navy-900/30";
  return (
    <button
      onClick={toggle}
      aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
      className={`rounded border ${border} px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition hover:border-orange`}
    >
      <span className={lang === "es" ? on : off}>ES</span>
      <span className={`mx-1 ${sep}`}>/</span>
      <span className={lang === "en" ? on : off}>EN</span>
    </button>
  );
}
