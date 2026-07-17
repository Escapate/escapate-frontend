export type DestinoGeo = { id: string; name: string; lat: number; lng: number };

/** Offset de longitud para alinear los pines con la textura equirectangular. Calibrar visualmente (Task 5, Step de calibración). */
export const LNG_OFFSET = 180;

/** Lat/lng → posición [x,y,z] sobre una esfera de radio r (tuple, sin dependencia de three). */
export function latLngToVec3(lat: number, lng: number, r: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + LNG_OFFSET) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

/**
 * Mapa maestro de 50 destinos populares. Los 8 con info en content.ts (mismo id)
 * pintan pin hoy; los demás son coordenadas listas: al agregar el destino a
 * content.ts con ese id, su pin aparece solo. Coords aproximadas de la ciudad ancla.
 */
export const DESTINO_GEO: DestinoGeo[] = [
  { id: "cartagena", name: "Cartagena", lat: 10.39, lng: -75.51 },
  { id: "san-andres", name: "San Andrés", lat: 12.58, lng: -81.7 },
  { id: "santa-marta", name: "Santa Marta", lat: 11.24, lng: -74.2 },
  { id: "eje-cafetero", name: "Eje Cafetero (Pereira)", lat: 4.81, lng: -75.69 },
  { id: "cancun", name: "Cancún", lat: 21.16, lng: -86.85 },
  { id: "punta-cana", name: "Punta Cana", lat: 18.58, lng: -68.4 },
  { id: "espana", name: "España (Madrid)", lat: 40.42, lng: -3.7 },
  { id: "europa", name: "Europa (París)", lat: 48.85, lng: 2.35 },
  { id: "rome", name: "Roma", lat: 41.9, lng: 12.5 },
  { id: "london", name: "Londres", lat: 51.51, lng: -0.13 },
  { id: "barcelona", name: "Barcelona", lat: 41.39, lng: 2.17 },
  { id: "lisbon", name: "Lisboa", lat: 38.72, lng: -9.14 },
  { id: "amsterdam", name: "Ámsterdam", lat: 52.37, lng: 4.9 },
  { id: "venice", name: "Venecia", lat: 45.44, lng: 12.32 },
  { id: "santorini", name: "Santorini", lat: 36.39, lng: 25.46 },
  { id: "istanbul", name: "Estambul", lat: 41.01, lng: 28.98 },
  { id: "prague", name: "Praga", lat: 50.08, lng: 14.44 },
  { id: "vienna", name: "Viena", lat: 48.21, lng: 16.37 },
  { id: "athens", name: "Atenas", lat: 37.98, lng: 23.73 },
  { id: "swiss-alps", name: "Alpes Suizos", lat: 46.82, lng: 8.23 },
  { id: "new-york", name: "Nueva York", lat: 40.71, lng: -74.01 },
  { id: "miami", name: "Miami", lat: 25.76, lng: -80.19 },
  { id: "orlando", name: "Orlando", lat: 28.54, lng: -81.38 },
  { id: "los-angeles", name: "Los Ángeles", lat: 34.05, lng: -118.24 },
  { id: "las-vegas", name: "Las Vegas", lat: 36.17, lng: -115.14 },
  { id: "toronto", name: "Toronto", lat: 43.65, lng: -79.38 },
  { id: "mexico-city", name: "Ciudad de México", lat: 19.43, lng: -99.13 },
  { id: "rio-de-janeiro", name: "Río de Janeiro", lat: -22.91, lng: -43.17 },
  { id: "buenos-aires", name: "Buenos Aires", lat: -34.6, lng: -58.38 },
  { id: "lima", name: "Lima", lat: -12.05, lng: -77.04 },
  { id: "cusco", name: "Cusco (Machu Picchu)", lat: -13.53, lng: -71.97 },
  { id: "santiago", name: "Santiago de Chile", lat: -33.45, lng: -70.67 },
  { id: "aruba", name: "Aruba", lat: 12.52, lng: -69.97 },
  { id: "havana", name: "La Habana", lat: 23.11, lng: -82.37 },
  { id: "panama-city", name: "Ciudad de Panamá", lat: 8.98, lng: -79.52 },
  { id: "san-jose-cr", name: "San José (Costa Rica)", lat: 9.93, lng: -84.09 },
  { id: "galapagos", name: "Galápagos", lat: -0.95, lng: -90.97 },
  { id: "dubai", name: "Dubái", lat: 25.2, lng: 55.27 },
  { id: "tokyo", name: "Tokio", lat: 35.68, lng: 139.65 },
  { id: "kyoto", name: "Kioto", lat: 35.01, lng: 135.77 },
  { id: "bangkok", name: "Bangkok", lat: 13.76, lng: 100.5 },
  { id: "bali", name: "Bali", lat: -8.34, lng: 115.09 },
  { id: "singapore", name: "Singapur", lat: 1.35, lng: 103.82 },
  { id: "phuket", name: "Phuket", lat: 7.88, lng: 98.39 },
  { id: "hong-kong", name: "Hong Kong", lat: 22.32, lng: 114.17 },
  { id: "maldives", name: "Maldivas", lat: 3.2, lng: 73.22 },
  { id: "cape-town", name: "Ciudad del Cabo", lat: -33.92, lng: 18.42 },
  { id: "marrakech", name: "Marrakech", lat: 31.63, lng: -7.98 },
  { id: "cairo", name: "El Cairo", lat: 30.04, lng: 31.24 },
  { id: "sydney", name: "Sídney", lat: -33.87, lng: 151.21 },
];
