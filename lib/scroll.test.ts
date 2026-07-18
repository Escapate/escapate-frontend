import { describe, it, expect } from "vitest";
import { hashTargetId, centerScrollLeft } from "./scroll";

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

describe("centerScrollLeft", () => {
  // Tira de 300px visible, contenido de 900px; hijos de 120px.
  const base = { clientWidth: 300, scrollWidth: 900, containerLeft: 0, childWidth: 120 };

  it("centra un hijo del medio dentro del contenedor", () => {
    // Hijo cuyo centro cae en x=450 (medido desde el borde del contenedor):
    // debe moverse hasta que su centro coincida con el centro visible (150).
    const left = centerScrollLeft({ ...base, scrollLeft: 0, childLeft: 390 });
    expect(left).toBe(300); // 0 + (450 - 150)
  });

  it("no sobre-desplaza al inicio (acota a 0)", () => {
    // Primer hijo, ya visible al inicio: centrarlo pediría scrollLeft negativo.
    const left = centerScrollLeft({ ...base, scrollLeft: 0, childLeft: 0 });
    expect(left).toBe(0);
  });

  it("no sobre-desplaza al final (acota a maxScroll)", () => {
    // Último hijo, pegado al borde derecho: no puede pasar de scrollWidth - clientWidth.
    const left = centerScrollLeft({ ...base, scrollLeft: 600, childLeft: 180 });
    expect(left).toBe(600); // max = 900 - 300
  });
});
