import { describe, it, expect } from "vitest";
import { parseNights, buildQuoteIntent, nextIntent } from "./quote-intent";

describe("parseNights", () => {
  it("extrae el primer entero", () => {
    expect(parseNights("4 noches")).toBe(4);
    expect(parseNights("10 nights")).toBe(10);
  });
  it("usa el fallback (4) cuando no hay número", () => {
    expect(parseNights("sin número")).toBe(4);
  });
});

describe("buildQuoteIntent", () => {
  it("mapea un paquete a dest/days/note con N noches = N+1 días", () => {
    const r = buildQuoteIntent(
      { name: "Cartagena", nights: "4 noches", price: "desde $890.000" },
      "Interesado en el paquete"
    );
    expect(r).toEqual({
      dest: "Cartagena",
      days: 5,
      note: "Interesado en el paquete Cartagena · 4 noches, desde $890.000",
    });
  });

  it("sin precio ni noches deja la nota solo con el destino y cae al fallback de días", () => {
    const r = buildQuoteIntent({ name: "Tokio" }, "Interesado en el paquete");
    expect(r).toEqual({
      dest: "Tokio",
      days: 5, // fallback de 4 noches + 1
      note: "Interesado en el paquete Tokio",
    });
  });
});

describe("nextIntent", () => {
  it("arranca seq en 1 y lo incrementa", () => {
    const a = nextIntent(null, { dest: "X", days: 5 });
    expect(a.seq).toBe(1);
    const b = nextIntent(a, { dest: "Y", days: 3 });
    expect(b.seq).toBe(2);
    expect(b.dest).toBe("Y");
  });
});
