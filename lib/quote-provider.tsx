"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type QuoteIntent, nextIntent } from "./quote-intent";

type QuoteIntentValue = {
  intent: QuoteIntent | null;
  requestQuote: (p: { dest: string; days: number; note?: string }) => void;
};

const QuoteIntentContext = createContext<QuoteIntentValue | null>(null);

export function QuoteIntentProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntent] = useState<QuoteIntent | null>(null);

  const requestQuote = useCallback(
    (p: { dest: string; days: number; note?: string }) => {
      setIntent((prev) => nextIntent(prev, p));
      if (typeof document !== "undefined") {
        document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <QuoteIntentContext.Provider value={{ intent, requestQuote }}>
      {children}
    </QuoteIntentContext.Provider>
  );
}

export function useQuoteIntent() {
  const ctx = useContext(QuoteIntentContext);
  if (!ctx) throw new Error("useQuoteIntent must be used within QuoteIntentProvider");
  return ctx;
}
