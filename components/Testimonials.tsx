"use client";

import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal } from "./ui";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const { c } = useI18n();

  return (
    <section className="relative bg-surface2 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow={c.testimonials.eyebrow}
          title={c.testimonials.title}
        />

        <div className="mt-12 grid divide-y divide-ink/10 border-y border-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {c.testimonials.items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col px-1 py-8 sm:px-7">
                <Quote className="h-7 w-7 text-orange/50" />
                <blockquote className="mt-4 flex-1 font-display text-lg italic leading-relaxed text-ink/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="text-ink">{t.name}</span>
                  <span className="text-ink/40"> · {t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
