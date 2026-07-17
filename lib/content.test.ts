import { describe, it, expect } from "vitest";
import { content } from "./content";
import { DESTINO_GEO } from "./destino-geo";

const geoIds = new Set(DESTINO_GEO.map((g) => g.id));
const langs = ["es", "en"] as const;

describe("ids de destinos ↔ cobertura geo", () => {
  for (const lang of langs) {
    it(`cada destino ${lang} tiene coordenadas en DESTINO_GEO`, () => {
      for (const d of content[lang].destinos.items) {
        expect(geoIds.has(d.id)).toBe(true);
      }
    });
    it(`cada quote ${lang} tiene prefillNote`, () => {
      expect(typeof content[lang].quote.prefillNote).toBe("string");
      expect(content[lang].quote.prefillNote.length).toBeGreaterThan(0);
    });
  }
  it("es y en comparten los mismos ids en el mismo orden", () => {
    const es = content.es.destinos.items.map((d) => d.id);
    const en = content.en.destinos.items.map((d) => d.id);
    expect(en).toEqual(es);
  });
});
