export type QuoteIntent = { dest: string; days: number; note?: string; seq: number };

/** Extrae el primer entero de "4 noches" / "10 nights"; usa `fallback` si no hay número. */
export function parseNights(nights: string, fallback = 4): number {
  const m = nights.match(/\d+/);
  return m ? parseInt(m[0], 10) : fallback;
}

/**
 * Convierte un destino en la intención de cotización (N noches = N+1 días).
 * `nights` y `price` son opcionales: los destinos del globo que aún no tienen
 * paquete armado no los traen, y ahí la nota queda solo con el nombre.
 */
export function buildQuoteIntent(
  pkg: { name: string; nights?: string; price?: string },
  prefillNote: string
): { dest: string; days: number; note: string } {
  const detalle = [pkg.nights, pkg.price].filter(Boolean).join(", ");
  return {
    dest: pkg.name,
    days: parseNights(pkg.nights ?? "") + 1,
    note: detalle ? `${prefillNote} ${pkg.name} · ${detalle}` : `${prefillNote} ${pkg.name}`,
  };
}

/** Reducer puro: siguiente intención con `seq` incrementado (permite re-disparar el mismo destino). */
export function nextIntent(
  prev: QuoteIntent | null,
  partial: { dest: string; days: number; note?: string }
): QuoteIntent {
  return { ...partial, seq: (prev?.seq ?? 0) + 1 };
}
