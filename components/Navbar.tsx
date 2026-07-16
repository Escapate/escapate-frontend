"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { WHATSAPP_NUMBER } from "@/lib/content";
import { LangToggle } from "./LangToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { c } = useI18n();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}`;
  const logoSrc =
    theme === "light"
      ? "/logo/escapate-transparent.png"
      : "/logo/escapate-mono-white.png";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-surface/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a
        href="#destinos"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-orange focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {c.nav.skip}
      </a>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#top"
          className="flex items-center"
          aria-label="Escápate · Agencia de viajes"
        >
          <Image
            src={logoSrc}
            alt="Escápate · Agencia de viajes"
            width={1502}
            height={912}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {c.nav.links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-sm text-ink/70 transition hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
          <LangToggle />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            {c.nav.cta}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LangToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menú"
            className="text-ink"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-surface/95 px-5 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-4">
            {c.nav.links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="text-ink/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 rounded-full bg-orange px-4 py-2 text-center font-medium text-white"
            >
              {c.nav.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
