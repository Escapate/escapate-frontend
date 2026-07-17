"use client";

import { useEffect } from "react";
import { hashTargetId } from "@/lib/scroll";

/**
 * Hace que TODOS los enlaces internos (href="#seccion") lleven a su sección en
 * cada click — incluso si ya estás en ese hash.
 *
 * Por defecto el navegador solo desplaza cuando el fragmento del URL cambia, así
 * que tras el primer "Cotizar" los siguientes clicks al mismo #contacto "no iban
 * a ningún lado". Aquí forzamos el scroll en cada click; scrollIntoView respeta
 * el scroll-padding-top del navbar sticky (igual que las anclas nativas).
 */
export default function SmoothHashScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Solo click izquierdo sin modificadores (respeta abrir en pestaña nueva).
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const id = hashTargetId(link?.getAttribute("href"));
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) return; // Si el destino no existe, deja el comportamiento nativo.

      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
