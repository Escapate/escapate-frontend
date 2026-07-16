import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Space_Mono,
} from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

// Aplica el tema guardado antes del primer paint (evita parpadeo).
const themeScript = `(function(){try{var t=localStorage.getItem('escapate-theme');if(t==='light'||t==='dark'){document.documentElement.classList.add('theme-'+t);}}catch(e){}})();`;

// Display / titulares — "pase de abordar" en mayúsculas.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Titulares suaves (El local, Testimonios).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// Cuerpo.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Etiquetas / eyebrows / códigos de vuelo.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: reemplazar por el dominio real de producción (Cloudflare Pages).
  metadataBase: new URL("https://escapate.com"),
  title: "Escápate · Agencia de viajes en Cúcuta",
  description:
    "Tu viaje empieza aquí. Diseñamos escapadas a tu medida: vuelos, hoteles y planes pensados para ti. Agencia de viajes en Cúcuta, Colombia.",
  keywords: [
    "agencia de viajes",
    "Cúcuta",
    "viajes",
    "paquetes turísticos",
    "Escápate",
    "tiquetes",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Escápate · Agencia de viajes",
    description: "Tu viaje empieza aquí. Escapadas a tu medida desde Cúcuta.",
    type: "website",
    locale: "es_CO",
    siteName: "Escápate",
    // La imagen social la genera app/opengraph-image.tsx (1200×630).
  },
};

export const viewport: Viewport = {
  themeColor: "#0C1B2F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${archivo.variable} ${bricolage.variable} ${hanken.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
