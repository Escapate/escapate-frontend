"use client";

import { useI18n } from "@/lib/i18n";

export function LangToggle() {
  const { lang, toggle } = useI18n();
  return (
    <button
      onClick={toggle}
      aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
      className="rounded-full border border-ink/25 px-3 py-1 font-mono text-[11px] tracking-wider transition hover:border-ink/50"
    >
      <span className={lang === "es" ? "text-ink" : "text-ink/40"}>ES</span>
      <span className="mx-1 text-ink/30">/</span>
      <span className={lang === "en" ? "text-ink" : "text-ink/40"}>EN</span>
    </button>
  );
}
