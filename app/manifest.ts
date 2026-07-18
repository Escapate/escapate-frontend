import type { MetadataRoute } from "next";

// Web App Manifest → mejora la instalación en móvil y da señales de confianza.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Escápate · Agencia de viajes en Cúcuta",
    short_name: "Escápate",
    description:
      "Agencia de viajes en Cúcuta. Vuelos, hoteles y paquetes turísticos a tu medida.",
    start_url: "/",
    display: "standalone",
    lang: "es-CO",
    background_color: "#0C1B2F",
    theme_color: "#0C1B2F",
    // Chrome/Android solo ofrecen instalar si hay un PNG grande declarado; con el SVG
    // suelto la app quedaba fuera del criterio de instalabilidad. /icon.png lo genera
    // Next a partir de app/icon.png (512×512).
    icons: [
      {
        src: "/icon.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
