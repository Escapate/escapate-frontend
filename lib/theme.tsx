"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

type ThemeValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Load the saved preference once (read-only: never writes localStorage here,
  // so it can't clobber the value under React Strict Mode's double-invoke).
  useEffect(() => {
    const saved = window.localStorage.getItem("escapate-theme");
    if (saved === "light" || saved === "dark") setThemeState(saved);
  }, []);

  // Apply the class to <html> whenever the theme changes (no persistence here).
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  // Persistence happens only on explicit user action.
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem("escapate-theme", t);
    } catch {}
  }, []);

  const toggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
