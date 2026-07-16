"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// 3 temas: "default" (el editorial, alterna crema↔navy), "light" (todo claro),
// "dark" (todo oscuro). Se aplica una clase en <html>; "default" no lleva clase.
export type Theme = "default" | "light" | "dark";

const THEMES: Theme[] = ["default", "light", "dark"];

type ThemeValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cycle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

function apply(theme: Theme) {
  const el = document.documentElement;
  el.classList.remove("theme-light", "theme-dark");
  if (theme !== "default") el.classList.add(`theme-${theme}`);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("default");

  useEffect(() => {
    const saved = window.localStorage.getItem("escapate-theme-v2");
    if (saved === "light" || saved === "dark" || saved === "default") {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem("escapate-theme-v2", t);
    } catch {}
  }, []);

  const cycle = useCallback(() => {
    setThemeState((cur) => {
      const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
      try {
        window.localStorage.setItem("escapate-theme-v2", next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
