"use client";

import { useI18n } from "@/lib/i18n";
import { EMAIL, INSTAGRAM, waLink } from "@/lib/content";
import { Reveal, SectionHead, WhatsAppIcon } from "./ui";
import Cotizador from "./Cotizador";
import { MapPin, Clock, Mail, Instagram } from "lucide-react";

export default function Contact() {
  const { c } = useI18n();
  const wa = waLink(c.wa.hello);

  return (
    <section
      id="contacto"
      className="screen relative flex flex-col justify-center overflow-hidden bg-gradient-to-b from-navy-800 to-navy-950 py-12 text-cream-50"
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow={c.contact.eyebrow}
          title={c.contact.title}
          slot="onDark"
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <Cotizador />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6 rounded-2xl border border-white/15 p-7">
              <p className="max-w-sm leading-relaxed text-cream-50/80">
                {c.contact.subtitle}
              </p>

              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-wa px-5 py-4 font-mono text-sm font-bold uppercase tracking-wider text-[#06351c] transition hover:brightness-105"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {c.contact.whatsapp}
              </a>

              <ul className="flex flex-col gap-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  <span className="text-cream-50/80">{c.contact.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  <span className="text-cream-50/80">{c.contact.hours}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  <a href={`mailto:${EMAIL}`} className="text-cream-50/80 transition hover:text-orange-400">
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  <a
                    href={`https://instagram.com/${INSTAGRAM}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream-50/80 transition hover:text-orange-400"
                  >
                    @{INSTAGRAM}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
