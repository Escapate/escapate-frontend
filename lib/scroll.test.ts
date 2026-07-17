import { describe, it, expect } from "vitest";
import { hashTargetId } from "./scroll";

describe("hashTargetId", () => {
  it("devuelve el id de una ancla interna", () => {
    expect(hashTargetId("#contacto")).toBe("contacto");
    expect(hashTargetId("#top")).toBe("top");
  });
  it("ignora '#' vacío y valores sin hash", () => {
    expect(hashTargetId("#")).toBe(null);
    expect(hashTargetId("")).toBe(null);
    expect(hashTargetId("/ruta")).toBe(null);
    expect(hashTargetId("https://escapate.tours")).toBe(null);
  });
  it("tolera null/undefined", () => {
    expect(hashTargetId(null)).toBe(null);
    expect(hashTargetId(undefined)).toBe(null);
  });
});
