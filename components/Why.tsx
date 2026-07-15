"use client";

import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal } from "./ui";
import { Headset, Tag, ShieldCheck, Wallet } from "lucide-react";

const icons = [Headset, Tag, ShieldCheck, Wallet];

export default function Why() {
  const { c } = useI18n();

  return (
    <section className="relative overflow-hidden bg-surface py-14 sm:py-20">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-orange/5 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow={c.why.eyebrow} title={c.why.title} />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.why.points.map((p, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={p} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-ink/10 bg-panel p-6 transition hover:border-orange/30">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange/15">
                    <Icon className="h-6 w-6 text-orange-400" />
                  </span>
                  <p className="mt-4 text-lg leading-relaxed text-ink/80">{p}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
