/**
 * Devuelve el id de sección de una ancla interna ("#seccion" → "seccion"),
 * o null si el href no es una ancla interna aprovechable ("#", "", rutas, URLs).
 * Lógica pura para poder testearla; el wiring al DOM vive en SmoothHashScroll.
 */
export function hashTargetId(href: string | null | undefined): string | null {
  if (!href || !href.startsWith("#") || href === "#") return null;
  return href.slice(1);
}

/**
 * scrollLeft que centra un hijo dentro de su contenedor horizontal, acotado a
 * [0, maxScroll] para no sobre-desplazar en los extremos.
 *
 * Se calcula a mano en vez de usar `child.scrollIntoView({ inline: "center" })`
 * porque scrollIntoView desplaza TODOS los contenedores con scroll de la cadena
 * de ancestros — incluida la ventana en vertical. Eso hacía que, al entrar
 * #destinos en pantalla, su tira robara el scroll de la página y anclara ahí
 * (rompiendo la navegación desde el hero). Aquí solo movemos la tira.
 */
export function centerScrollLeft(args: {
  scrollLeft: number; // container.scrollLeft actual
  clientWidth: number; // container.clientWidth (ancho visible)
  scrollWidth: number; // container.scrollWidth (ancho total)
  containerLeft: number; // container.getBoundingClientRect().left
  childLeft: number; // child.getBoundingClientRect().left
  childWidth: number; // child.getBoundingClientRect().width
}): number {
  const childCenter = args.childLeft + args.childWidth / 2;
  const containerCenter = args.containerLeft + args.clientWidth / 2;
  const target = args.scrollLeft + (childCenter - containerCenter);
  const max = args.scrollWidth - args.clientWidth;
  return Math.max(0, Math.min(target, max));
}
