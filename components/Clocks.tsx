"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

// Franja horaria del mundo (design-system §6.5). Los datos (ciudades + zonas)
// ya viven en content.clocks. La hora se calcula en el cliente tras montar
// para evitar cualquier desajuste de hidratación.
export default function Clocks() {
  const { c, lang } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const timeIn = (tz: string) =>
    now
      ? new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: tz,
        }).format(now)
      : "--:--";

  return (
    <section className="border-y border-ink/10 bg-surface2 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/40">
          {c.clocks.label}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {c.clocks.cities.map((city) => (
            <div key={city.tz}>
              <div className="font-numeric text-4xl leading-none text-ink tabular-nums sm:text-5xl">
                {timeIn(city.tz)}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-orange-400">
                {city.city}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
