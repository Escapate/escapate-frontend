"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { content, type Lang, type Dict } from "./content";

type I18nValue = {
  lang: Lang;
  c: Dict;
  toggle: () => void;
  setLang: (l: Lang) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const saved = window.localStorage.getItem("escapate-lang");
    if (saved === "es" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem("escapate-lang", lang);
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === "es" ? "en" : "es")), []);

  return (
    <I18nContext.Provider value={{ lang, c: content[lang], toggle, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
