"use client";

import { useTheme, type Theme } from "@/lib/theme";
import { Sparkles, Sun, Moon } from "lucide-react";

const OPTIONS: { value: Theme; Icon: typeof Sun; label: string }[] = [
  { value: "default", Icon: Sparkles, label: "Tema predeterminado" },
  { value: "light", Icon: Sun, label: "Tema claro" },
  { value: "dark", Icon: Moon, label: "Tema oscuro" },
];

export function ThemeToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { theme, setTheme } = useTheme();
  const border = tone === "dark" ? "border-white/20" : "border-navy-900/15";
  const idle =
    tone === "dark"
      ? "text-white/55 hover:text-white"
      : "text-navy-900/50 hover:text-navy-900";

  return (
    <div
      role="group"
      aria-label="Tema"
      className={`flex items-center gap-0.5 rounded-full border ${border} p-0.5`}
    >
      {OPTIONS.map(({ value, Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`grid h-7 w-7 place-items-center rounded-full transition ${
              active ? "bg-orange text-white" : idle
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
}
