"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { waLink } from "@/lib/content";
import { LangToggle } from "./LangToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { c } = useI18n();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const wa = waLink(c.wa.hello);
  const dark = theme === "dark";
  const tone = dark ? "dark" : "light";
  const logo = dark
    ? "/logo/escapate-mono-white.png"
    : "/logo/escapate-transparent.png";

  return (
    <header className="sticky top-0 z-50 border-b border-inkA/10 bg-sectionA/85 backdrop-blur-md">
      <a
        href="#destinos"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-orange focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {c.nav.skip}
      </a>
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
        <a href="#top" className="flex items-center" aria-label="Escápate · Agencia de viajes">
          <Image
            src={logo}
            alt="Escápate · Agencia de viajes"
            width={600}
            height={364}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {c.nav.links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="font-mono text-xs font-bold uppercase tracking-wider text-inkA/70 transition hover:text-orange"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle tone={tone} />
          <LangToggle tone={tone} />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#06351a] transition hover:brightness-105"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#06351a]" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle tone={tone} />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menú"
            aria-expanded={open}
            className="text-inkA"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-inkA/10 bg-sectionA/95 px-5 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-4">
            {c.nav.links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="font-mono text-sm font-bold uppercase tracking-wider text-inkA/80"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-1">
              <LangToggle tone={tone} />
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-wa px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#06351a]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
