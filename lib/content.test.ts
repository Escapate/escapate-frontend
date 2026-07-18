import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
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

describe("catálogo del globo (items + more)", () => {
  for (const lang of langs) {
    const { items, more } = content[lang].destinos;

    it(`${lang}: entre items y more se cubren los 50 destinos del globo`, () => {
      const ids = new Set([...items, ...more].map((d) => d.id));
      expect(ids.size).toBe(DESTINO_GEO.length);
      for (const g of DESTINO_GEO) expect(ids.has(g.id)).toBe(true);
    });

    it(`${lang}: more no repite ningún id de items`, () => {
      const enItems = new Set(items.map((d) => d.id));
      for (const d of more) expect(enItems.has(d.id)).toBe(false);
    });

    it(`${lang}: los destinos de more no traen precio`, () => {
      for (const d of more) expect("price" in d).toBe(false);
    });
  }

  it("es y en comparten los mismos ids de more en el mismo orden", () => {
    expect(content.en.destinos.more.map((d) => d.id)).toEqual(
      content.es.destinos.more.map((d) => d.id)
    );
  });
});

describe("fotos de destinos", () => {
  const publicDir = path.join(process.cwd(), "public/destinos");

  it("cada destino del globo tiene su miniatura en /destinos/globo", () => {
    for (const g of DESTINO_GEO) {
      expect(
        fs.existsSync(path.join(publicDir, "globo", `${g.id}.webp`)),
        `falta la miniatura de ${g.id}`
      ).toBe(true);
    }
  });

  it("cada paquete del carrusel tiene su foto en alta", () => {
    for (const d of content.es.destinos.items) {
      // `img` es una ruta absoluta del sitio: /destinos/<id>.webp
      expect(fs.existsSync(path.join(process.cwd(), "public", d.img)), `falta ${d.img}`).toBe(true);
    }
  });
});
