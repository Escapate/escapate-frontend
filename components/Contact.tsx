"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHead } from "./ui";
import Cotizador from "./Cotizador";

export default function Contact() {
  const { c } = useI18n();

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

        <div className="mx-auto mt-12 w-full max-w-4xl">
          <Reveal>
            <Cotizador />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
