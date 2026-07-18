// Códigos IATA para los tags tipo "pase de abordar" (CUC ✈ CTG).
// Se mapea por nombre normalizado para cubrir ES y EN sin duplicar datos.

import { foldAccents } from "./search";

const CODES: Record<string, string> = {
  cucuta: "CUC",
  bogota: "BOG",
  medellin: "MDE",
  cali: "CLO",
  bucaramanga: "BGA",
  cartagena: "CTG",
  "san andres": "ADZ",
  "santa marta": "SMR",
  "eje cafetero": "PEI",
  "coffee region": "PEI",
  cancun: "CUN",
  "punta cana": "PUJ",
  panama: "PTY",
  espana: "MAD",
  spain: "MAD",
  madrid: "MAD",
  europa: "CDG",
  europe: "CDG",
};

function normalize(s: string): string {
  // El plegado de tildes/mayúsculas es el mismo que usa el buscador del globo.
  return foldAccents(s)
    .replace(/[^a-z\s]/g, "")
    .trim();
}

/** Devuelve el código IATA de una ciudad/destino, o "•••" si no se conoce. */
export function airportCode(name: string): string {
  const n = normalize(name);
  if (CODES[n]) return CODES[n];
  // "Madrid (España)" → primera palabra conocida
  for (const key of Object.keys(CODES)) {
    if (n.includes(key)) return CODES[key];
  }
  return "•••";
}
