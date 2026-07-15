"use client";

import { useTheme } from "@/lib/theme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
      className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 text-ink/70 transition hover:border-orange hover:text-orange"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
