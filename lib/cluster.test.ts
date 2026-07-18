import { describe, it, expect } from "vitest";
import { clusterMarkers, type ClusterInput } from "./cluster";
import { latLngToVec3 } from "./destino-geo";

// El clustering solo mira lat/lng; el resto del marcador viaja como carga útil.
const cartagena: ClusterInput = { id: "cartagena", name: "Cartagena", img: "", region: "", lat: 10.39, lng: -75.51 };
const santaMarta: ClusterInput = { id: "santa-marta", name: "Santa Marta", img: "", region: "", lat: 11.24, lng: -74.2 };
const tokyo: ClusterInput = { id: "tokyo", name: "Tokio", img: "", region: "", lat: 35.68, lng: 139.65 };

describe("clusterMarkers", () => {
  it("devuelve [] con lista vacía", () => {
    expect(clusterMarkers([], 5, 1.4)).toEqual([]);
  });

  it("un solo marcador → un clúster de 1 en su posición", () => {
    const out = clusterMarkers([cartagena], 5, 1.4);
    expect(out).toHaveLength(1);
    expect(out[0].members).toHaveLength(1);
    const [x, y, z] = latLngToVec3(cartagena.lat, cartagena.lng, 1.4);
    expect(out[0].position[0]).toBeCloseTo(x, 5);
    expect(out[0].position[1]).toBeCloseTo(y, 5);
    expect(out[0].position[2]).toBeCloseTo(z, 5);
  });

  it("agrupa dos cercanos (Cartagena + Santa Marta ~1.6°) con umbral 5°", () => {
    const out = clusterMarkers([cartagena, santaMarta, tokyo], 5, 1.4);
    expect(out).toHaveLength(2);
    const big = out.find((c) => c.members.length === 2);
    expect(big).toBeDefined();
    expect(big!.members.map((m) => m.id).sort()).toEqual(["cartagena", "santa-marta"]);
    expect(big!.id).toContain("+");
    expect(out.some((c) => c.members.length === 1 && c.members[0].id === "tokyo")).toBe(true);
  });

  it("con umbral pequeño (1°) no agrupa cercanos", () => {
    const out = clusterMarkers([cartagena, santaMarta, tokyo], 1, 1.4);
    expect(out).toHaveLength(3);
    expect(out.every((c) => c.members.length === 1)).toBe(true);
  });

  it("el centroide de un clúster queda sobre la esfera de radio r", () => {
    const out = clusterMarkers([cartagena, santaMarta], 5, 1.4);
    const [x, y, z] = out[0].position;
    expect(Math.hypot(x, y, z)).toBeCloseTo(1.4, 5);
  });
});
