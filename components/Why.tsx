"use client";

import { useI18n } from "@/lib/i18n";
import { SectionHead, Reveal } from "./ui";
import { Headset, Tag, ShieldCheck, Wallet } from "lucide-react";

const icons = [Headset, Tag, ShieldCheck, Wallet];

export default function Why() {
  const { c } = useI18n();

  return (
    <section className="screen relative flex flex-col justify-center overflow-hidden bg-sectionB py-24 text-inkB">
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-orange/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow={c.why.eyebrow} title={c.why.title} slot="b" />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.why.points.map((p, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={p} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-inkB/10 bg-inkB/[0.04] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-orange/50 hover:bg-inkB/[0.06] hover:shadow-[0_24px_44px_-26px_rgba(0,0,0,0.55)]">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange/15 transition duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-orange/25">
                    <Icon className="h-6 w-6 text-orange-400 transition group-hover:text-orange" strokeWidth={1.8} />
                  </span>
                  <span
                    className="mt-5 block h-0.5 w-8 bg-orange/40 transition-all duration-300 group-hover:w-14 group-hover:bg-orange"
                    aria-hidden="true"
                  />
                  <p className="mt-4 leading-relaxed text-inkB/80">{p}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
