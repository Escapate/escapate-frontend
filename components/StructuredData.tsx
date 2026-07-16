import { BUSINESS } from "@/lib/content";

// JSON-LD para SEO local. Un solo <script> con un @graph:
//  - TravelAgency (el negocio local → Google Maps / panel de conocimiento)
//  - WebSite (relaciona el sitio con el negocio como publisher)
// Todo sale de BUSINESS en lib/content.ts para que coincida con lo visible (NAP).
export default function StructuredData() {
  const description =
    "Agencia de viajes en Cúcuta, Norte de Santander. Diseñamos escapadas a tu medida: " +
    "vuelos, hoteles y paquetes turísticos nacionales e internacionales con asesoría personalizada.";

  const business = {
    "@type": "TravelAgency",
    "@id": `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    alternateName: BUSINESS.legalName,
    description,
    url: BUSINESS.url,
    logo: `${BUSINESS.url}${BUSINESS.logo}`,
    image: BUSINESS.photos.map((p) => `${BUSINESS.url}${p}`),
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currency,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: { "@type": "City", name: BUSINESS.address.locality },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: BUSINESS.hours.days,
        opens: BUSINESS.hours.opens,
        closes: BUSINESS.hours.closes,
      },
    ],
    sameAs: BUSINESS.sameAs,
    hasMap: BUSINESS.maps,
    knowsLanguage: ["es", "en"],
    // geo solo si hay coordenadas cargadas (ver BUSINESS.geo en lib/content.ts).
    ...(BUSINESS.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: BUSINESS.geo.lat,
            longitude: BUSINESS.geo.lng,
          },
        }
      : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${BUSINESS.url}/#website`,
    url: BUSINESS.url,
    name: BUSINESS.name,
    inLanguage: "es-CO",
    publisher: { "@id": `${BUSINESS.url}/#business` },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [business, website],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify evita XSS; los datos son estáticos y controlados por nosotros.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
