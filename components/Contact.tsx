"use client";

import { useI18n } from "@/lib/i18n";
import { WHATSAPP_NUMBER, EMAIL, INSTAGRAM } from "@/lib/content";
import { Reveal, Eyebrow } from "./ui";
import Cotizador from "./Cotizador";
import { MessageCircle, MapPin, Clock, Mail, Instagram } from "lucide-react";

export default function Contact() {
  const { c } = useI18n();
  const wa = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-surface py-14 sm:py-20"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-orange/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Left: pitch + info */}
        <Reveal>
          <Eyebrow>{c.contact.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-balance font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
            {c.contact.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/75">
            {c.contact.subtitle}
          </p>

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-wa px-6 py-3.5 text-sm font-medium text-[#06351a] transition hover:brightness-105"
          >
            <MessageCircle className="h-5 w-5" />
            {c.contact.whatsapp}
          </a>

          <ul className="mt-10 space-y-4 text-sm text-ink/70">
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-orange" />
              {c.contact.address}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-orange" />
              {c.contact.hours}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-orange" />
              <a href={`mailto:${EMAIL}`} className="hover:text-ink">
                {EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="h-4 w-4 text-orange" />
              <a
                href={`https://instagram.com/${INSTAGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                @{INSTAGRAM}
              </a>
            </li>
          </ul>
        </Reveal>

        {/* Right: cotizador */}
        <Reveal delay={0.1}>
          <Cotizador />
        </Reveal>
      </div>
    </section>
  );
}
