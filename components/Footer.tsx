"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { INSTAGRAM, waLink } from "@/lib/content";
import { LangToggle } from "./LangToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  const { c } = useI18n();
  const { theme } = useTheme();
  const wa = waLink(c.wa.hello);
  const year = new Date().getFullYear();
  // Footer = slot B: navy en default/dark, crema-100 en light.
  const light = theme === "light";
  const tone = light ? "light" : "dark";
  const logo = light
    ? "/logo/escapate-transparent.png"
    : "/logo/escapate-mono-white.png";

  return (
    <footer className="border-t border-inkB/10 bg-sectionB py-12 text-inkB">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Image
              src={logo}
              alt="Escápate · Agencia de viajes"
              width={600}
              height={364}
              className="h-12 w-auto"
            />
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-inkB/45">
              {c.footer.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {c.nav.links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="font-mono text-xs font-bold uppercase tracking-wider text-inkB/60 transition hover:text-orange"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-inkB/15 text-inkB/70 transition hover:border-orange hover:text-orange"
            >
              <Instagram className="h-4 w-4" />
            </a>
            {/* TODO: URL real de Facebook o quitar este ícono. */}
            <a
              href="#"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full border border-inkB/15 text-inkB/70 transition hover:border-orange hover:text-orange"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full border border-inkB/15 text-inkB/70 transition hover:border-orange hover:text-orange"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <ThemeToggle tone={tone} />
            <LangToggle tone={tone} />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-inkB/10 pt-6 font-mono text-[11px] uppercase tracking-wider text-inkB/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Escápate. {c.footer.rights}</p>
          <p>{c.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
