"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHead } from "./ui";
import Cotizador from "./Cotizador";

export default function Contact() {
  const { c } = useI18n();

  return (
    <section
      className="screen relative flex flex-col justify-center overflow-hidden bg-gradient-to-b from-navy-800 to-navy-950 py-12 text-cream-50"
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* El ancla #contacto va en el título (no en la sección): así los enlaces
            caen en "¿Listo para volar?" bajo el navbar, dejando ver más del pase. */}
        <SectionHead
          eyebrow={c.contact.eyebrow}
          title={c.contact.title}
          titleId="contacto"
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
