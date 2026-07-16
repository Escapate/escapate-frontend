"use client";

import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal } from "./ui";

function initials(name: string): string {
  const words = name.split(/\s+/).filter((w) => /[a-zá-úñ]/i.test(w));
  if (words.length === 0) return "★";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function Testimonials() {
  const { c } = useI18n();

  return (
    <section className="screen relative flex flex-col justify-center overflow-hidden bg-cream-100 py-24 text-navy-900">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow={c.testimonials.eyebrow}
          title={c.testimonials.title}
          tone="light"
          font="heading"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {c.testimonials.items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col gap-4 rounded-2xl border border-navy-900/[0.06] bg-white p-7 shadow-[0_22px_50px_-38px_rgba(12,27,47,0.55)]">
                <div
                  className="text-base tracking-[2px] text-orange"
                  aria-label="5 de 5 estrellas"
                >
                  ★★★★★
                </div>
                <blockquote className="flex-1 leading-relaxed text-navy-900/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-navy-700 to-navy-950 font-heading font-extrabold text-orange-400"
                    aria-hidden="true"
                  >
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block font-bold">{t.name}</span>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-navy-900/50">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
