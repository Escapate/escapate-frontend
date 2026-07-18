import { describe, it, expect } from "vitest";
import { foldAccents, matchesQuery } from "./search";
import { content } from "./content";

describe("foldAccents", () => {
  it("baja a minúsculas y quita tildes", () => {
    expect(foldAccents("Cúcuta")).toBe("cucuta");
    expect(foldAccents("SAN ANDRÉS")).toBe("san andres");
  });

  it("descompone la ñ para que 'espana' encuentre 'España'", () => {
    expect(foldAccents("España")).toBe("espana");
  });
});

describe("matchesQuery", () => {
  it("ignora tildes en cualquiera de los dos lados", () => {
    expect(matchesQuery("Cancún", "cancun")).toBe(true);
    expect(matchesQuery("Cancun", "cancún")).toBe(true);
    expect(matchesQuery("España", "espana")).toBe(true);
  });

  it("ignora mayúsculas", () => {
    expect(matchesQuery("Buenos Aires", "BUENOS")).toBe(true);
  });

  it("hace match parcial, no solo por prefijo", () => {
    expect(matchesQuery("Buenos Aires", "aires")).toBe(true);
    expect(matchesQuery("Río de Janeiro", "janeiro")).toBe(true);
  });

  it("ignora espacios sobrantes alrededor", () => {
    expect(matchesQuery("Nueva York", "  york ")).toBe(true);
  });

  it("no inventa coincidencias", () => {
    expect(matchesQuery("Tokio", "paris")).toBe(false);
  });

  it("una consulta vacía deja pasar todo", () => {
    expect(matchesQuery("Tokio", "")).toBe(true);
    expect(matchesQuery("Tokio", "   ")).toBe(true);
  });
});

// El buscador del globo filtra sobre estos nombres, así que conviene fijar el
// comportamiento contra los datos reales y no solo contra cadenas de ejemplo.
describe("buscador sobre el catálogo real del globo", () => {
  const nombres = (lang: "es" | "en") =>
    [...content[lang].destinos.items, ...content[lang].destinos.more].map((d) => d.name);
  const buscar = (lang: "es" | "en", q: string) =>
    nombres(lang).filter((n) => matchesQuery(n, q));

  it("encuentra destinos con tilde escribiéndolos sin tilde", () => {
    expect(buscar("es", "espana")).toContain("España");
    expect(buscar("es", "cancun")).toContain("Cancún");
    expect(buscar("es", "rio")).toContain("Río de Janeiro");
  });

  it("encuentra por una palabra del medio del nombre", () => {
    expect(buscar("es", "aires")).toContain("Buenos Aires");
  });

  it("un destino que no está en el catálogo no da coincidencias", () => {
    // Este es el caso que dispara el estado vacío con el botón de cotizar igual.
    expect(buscar("es", "tailandia")).toHaveLength(0);
    expect(buscar("en", "thailand")).toHaveLength(0);
  });
});
