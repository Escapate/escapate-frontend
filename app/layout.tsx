import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, JetBrains_Mono, Anton } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const themeScript = `(function(){try{var t=localStorage.getItem('escapate-theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`;

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-numeric",
  display: "swap",
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "Escápate · Agencia de viajes",
    description: "Tu viaje empieza aquí. Escapadas a tu medida desde Cúcuta.",
    type: "website",
    locale: "es_CO",
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
        className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} ${anton.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
