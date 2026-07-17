import { describe, it, expect } from "vitest";
import {
  onlyDigits,
  filterPhoneInput,
  sanitizePhone,
  isValidPhone,
  sanitizeEmail,
  isValidEmail,
} from "./sanitize";

describe("onlyDigits", () => {
  it("deja solo los dígitos", () => {
    expect(onlyDigits("300 123 4567")).toBe("3001234567");
    expect(onlyDigits("+57-300.123")).toBe("57300123");
    expect(onlyDigits("")).toBe("");
  });
});

describe("filterPhoneInput", () => {
  it("permite dígitos, espacios, + - ( ) y borra el resto en vivo", () => {
    expect(filterPhoneInput("+57 (300) 123-4567")).toBe("+57 (300) 123-4567");
  });
  it("descarta letras y otros caracteres mientras se escribe", () => {
    expect(filterPhoneInput("300abc123")).toBe("300123");
    expect(filterPhoneInput("tel: 3001234567")).toBe(" 3001234567");
  });
});

describe("sanitizePhone", () => {
  it("conserva un '+' inicial y descarta el resto de símbolos", () => {
    expect(sanitizePhone("+57 (300) 123-4567")).toBe("+573001234567");
    expect(sanitizePhone("  +1 202 555 0142 ")).toBe("+12025550142");
  });
  it("sin '+' inicial deja solo dígitos", () => {
    expect(sanitizePhone("300 123 4567")).toBe("3001234567");
  });
  it("un '+' que no está al inicio se descarta", () => {
    expect(sanitizePhone("300+123")).toBe("300123");
  });
});

describe("isValidPhone", () => {
  it("acepta cualquier prefijo internacional razonable (8–15 dígitos)", () => {
    expect(isValidPhone("+57 300 123 4567")).toBe(true); // Colombia
    expect(isValidPhone("3001234567")).toBe(true); // Colombia sin prefijo
    expect(isValidPhone("+1 202 555 0142")).toBe(true); // EEUU
    expect(isValidPhone("+34 612 345 678")).toBe(true); // España
    expect(isValidPhone("+44 20 7946 0958")).toBe(true); // Reino Unido
  });
  it("rechaza demasiado corto o demasiado largo", () => {
    expect(isValidPhone("12345")).toBe(false);
    expect(isValidPhone("1234567890123456")).toBe(false); // 16 dígitos
  });
  it("rechaza vacío o sin dígitos", () => {
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("abc")).toBe(false);
  });
});

describe("sanitizeEmail", () => {
  it("recorta espacios y pasa a minúsculas", () => {
    expect(sanitizeEmail("  JUAN@Example.COM ")).toBe("juan@example.com");
  });
});

describe("isValidEmail", () => {
  it("acepta correos con forma válida (ignora espacios alrededor)", () => {
    expect(isValidEmail("juan@example.com")).toBe(true);
    expect(isValidEmail("juan.perez@sub.dominio.co")).toBe(true);
    expect(isValidEmail("  juan@x.com ")).toBe(true);
  });
  it("rechaza formas inválidas", () => {
    expect(isValidEmail("sinarroba.com")).toBe(false);
    expect(isValidEmail("juan@")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("juan@example")).toBe(false);
    expect(isValidEmail("a b@x.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});
