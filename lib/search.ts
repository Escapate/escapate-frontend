/**
 * Comparación de texto escrito por el usuario contra nombres del catálogo.
 * Funciones puras, sin dependencias — el buscador del globo las usa por cada tecla.
 */

// NFD separa la letra de su diacrítico, y U+0300–U+036F son justamente esos diacríticos
// combinantes, así que "ú" → "u" y "ñ" → "n". Lo segundo es deliberado: quien escribe
// "espana" tiene que encontrar "España". Se usa el rango en escapes (no los caracteres
// literales) porque son invisibles en el editor y se pierden en cualquier copiar/pegar.
const COMBINING_MARKS = /[\u0300-\u036f]/g;

/** Minúsculas y sin tildes: "Cancún" → "cancun". */
export function foldAccents(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "");
}

/**
 * ¿`name` contiene `query`, ignorando tildes, mayúsculas y espacios alrededor?
 * Match parcial en cualquier posición: "aires" encuentra "Buenos Aires".
 * Una consulta vacía deja pasar todo (lista sin filtrar).
 */
export function matchesQuery(name: string, query: string): boolean {
  const q = foldAccents(query).trim();
  if (!q) return true;
  return foldAccents(name).includes(q);
}
