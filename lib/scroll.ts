/**
 * Devuelve el id de sección de una ancla interna ("#seccion" → "seccion"),
 * o null si el href no es una ancla interna aprovechable ("#", "", rutas, URLs).
 * Lógica pura para poder testearla; el wiring al DOM vive en SmoothHashScroll.
 */
export function hashTargetId(href: string | null | undefined): string | null {
  if (!href || !href.startsWith("#") || href === "#") return null;
  return href.slice(1);
}
