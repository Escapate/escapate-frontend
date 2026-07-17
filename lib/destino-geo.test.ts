import { describe, it, expect } from "vitest";
import { DESTINO_GEO, latLngToVec3 } from "./destino-geo";

describe("DESTINO_GEO", () => {
  it("tiene 50 destinos", () => {
    expect(DESTINO_GEO).toHaveLength(50);
  });
  it("tiene ids únicos", () => {
    expect(new Set(DESTINO_GEO.map((g) => g.id)).size).toBe(50);
  });
  it("coordenadas en rango válido", () => {
    for (const g of DESTINO_GEO) {
      expect(g.lat).toBeGreaterThanOrEqual(-90);
      expect(g.lat).toBeLessThanOrEqual(90);
      expect(g.lng).toBeGreaterThanOrEqual(-180);
      expect(g.lng).toBeLessThanOrEqual(180);
    }
  });
});

describe("latLngToVec3", () => {
  it("mantiene los puntos sobre la esfera de radio r", () => {
    const r = 1.4;
    const samples: Array<[number, number]> = [
      [0, 0],
      [10.39, -75.51],
      [48.85, 2.35],
      [-33.87, 151.21],
    ];
    for (const [lat, lng] of samples) {
      const [x, y, z] = latLngToVec3(lat, lng, r);
      expect(Math.hypot(x, y, z)).toBeCloseTo(r, 5);
    }
  });
  it("el polo norte cae en +Y", () => {
    const [x, y, z] = latLngToVec3(90, 0, 1.4);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(1.4, 5);
    expect(z).toBeCloseTo(0, 5);
  });
});
