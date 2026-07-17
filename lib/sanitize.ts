/**
 * Saneo y validación de los datos de contacto del cotizador (celular y correo).
 * Funciones puras, sin dependencias — mismo espíritu que el form hermano de rifas,
 * pero aceptando cualquier prefijo internacional razonable (no solo el 57).
 */

/** Deja solo los dígitos. onlyDigits("300 123 4567") → "3001234567" */
export function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * Normaliza un teléfono internacional: conserva un "+" inicial si lo hay y
 * descarta todo lo demás que no sea dígito.
 * sanitizePhone("+57 (300) 123-4567") → "+573001234567"
 */
export function sanitizePhone(s: string): string {
  const hasPlus = s.trim().startsWith("+");
  const digits = onlyDigits(s);
  return hasPlus ? `+${digits}` : digits;
}

// E.164: hasta 15 dígitos. Ponemos un piso de 8 para cubrir números nacionales
// cortos (sin prefijo de país) sin aceptar cadenas obviamente inválidas.
const PHONE_MIN_DIGITS = 8;
const PHONE_MAX_DIGITS = 15;

/**
 * Valida un teléfono internacional razonable: entre 8 y 15 dígitos, con
 * cualquier prefijo de país. No fuerza el 57.
 */
export function isValidPhone(s: string): boolean {
  const len = onlyDigits(s).length;
  return len >= PHONE_MIN_DIGITS && len <= PHONE_MAX_DIGITS;
}

/** Normaliza un correo: recorta espacios y pasa a minúsculas. */
export function sanitizeEmail(s: string): string {
  return s.trim().toLowerCase();
}

// Forma pragmática de correo: algo@algo.tld, sin espacios. No pretende cubrir
// el RFC completo, solo descartar entradas claramente inválidas.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida la forma básica de un correo (ignora espacios alrededor). */
export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(sanitizeEmail(s));
}
