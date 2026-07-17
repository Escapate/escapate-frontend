# Cotizar desde Destinos y marcadores en el globo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pre-rellenar el Cotizador desde los destinos y desde marcadores interactivos en el globo 3D, con una lista maestra de 50 destinos que sólo pintan pin cuando tienen info.

**Architecture:** Un contexto React (`QuoteIntentProvider`) es el canal único: los botones "Cotizar" (Destinos y tarjeta del globo) llaman `requestQuote(...)`, que guarda una intención con `seq` y hace scroll a `#contacto`; el Cotizador siembra su estado al llegar una intención nueva. El globo recibe `markers` + `onCotizar` como **props** (react-three-fiber no propaga contexto de React hacia dentro del `<Canvas>`). Los pines salen del *join* de `DESTINO_GEO` (50 coordenadas) con los destinos que tienen info en `content.ts`.

**Tech Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · @react-three/fiber + drei + three · Vitest (nuevo, sólo para helpers puros).

## Global Constraints

- **Sin trailer de co-autoría** en commits/PRs (convención del repo `escapate/CLAUDE.md`). No `Co-Authored-By: Claude...`.
- **Tooling ligero:** la única dependencia nueva permitida es `vitest` (dev). No agregar jsdom/testing-library ni otros frameworks.
- Alias de imports: `@/*` → raíz del proyecto (`tsconfig.json`).
- i18n: todo texto visible sale de `lib/content.ts` (ES/EN). `content` es `as const`.
- Convención de commits del repo: `feat(scope): ...`, `test(scope): ...`, `refactor(scope): ...`, en español.
- El globo sigue siendo `aria-hidden` (decorativo); los marcadores son mejora progresiva. La sección Destinos es el camino accesible equivalente.
- Noches → Días: `N noches = N+1 días`.

---

### Task 1: Vitest + helpers puros de intención de cotización

**Files:**
- Modify: `package.json` (scripts + devDependency)
- Create: `vitest.config.ts`
- Create: `lib/quote-intent.ts`
- Test: `lib/quote-intent.test.ts`

**Interfaces:**
- Produces:
  - `type QuoteIntent = { dest: string; days: number; note?: string; seq: number }`
  - `parseNights(nights: string, fallback?: number): number`
  - `buildQuoteIntent(pkg: { name: string; nights: string; price: string }, prefillNote: string): { dest: string; days: number; note: string }`
  - `nextIntent(prev: QuoteIntent | null, partial: { dest: string; days: number; note?: string }): QuoteIntent`

- [ ] **Step 1: Instalar Vitest**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` aparece en `devDependencies` de `package.json`.

- [ ] **Step 2: Agregar el script de test**

En `package.json`, dentro de `"scripts"`, agregar la línea `"test"` (deja las demás como están):

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Crear `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Escribir el test que falla**

Crear `lib/quote-intent.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseNights, buildQuoteIntent, nextIntent } from "./quote-intent";

describe("parseNights", () => {
  it("extrae el primer entero", () => {
    expect(parseNights("4 noches")).toBe(4);
    expect(parseNights("10 nights")).toBe(10);
  });
  it("usa el fallback (4) cuando no hay número", () => {
    expect(parseNights("sin número")).toBe(4);
  });
});

describe("buildQuoteIntent", () => {
  it("mapea un paquete a dest/days/note con N noches = N+1 días", () => {
    const r = buildQuoteIntent(
      { name: "Cartagena", nights: "4 noches", price: "desde $890.000" },
      "Interesado en el paquete"
    );
    expect(r).toEqual({
      dest: "Cartagena",
      days: 5,
      note: "Interesado en el paquete Cartagena · 4 noches, desde $890.000",
    });
  });
});

describe("nextIntent", () => {
  it("arranca seq en 1 y lo incrementa", () => {
    const a = nextIntent(null, { dest: "X", days: 5 });
    expect(a.seq).toBe(1);
    const b = nextIntent(a, { dest: "Y", days: 3 });
    expect(b.seq).toBe(2);
    expect(b.dest).toBe("Y");
  });
});
```

- [ ] **Step 5: Correr el test y verificar que falla**

Run: `npm test`
Expected: FAIL — no se puede resolver `./quote-intent` (módulo inexistente).

- [ ] **Step 6: Implementar `lib/quote-intent.ts`**

```ts
export type QuoteIntent = { dest: string; days: number; note?: string; seq: number };

/** Extrae el primer entero de "4 noches" / "10 nights"; usa `fallback` si no hay número. */
export function parseNights(nights: string, fallback = 4): number {
  const m = nights.match(/\d+/);
  return m ? parseInt(m[0], 10) : fallback;
}

/** Convierte un paquete de destino en la intención de cotización (N noches = N+1 días). */
export function buildQuoteIntent(
  pkg: { name: string; nights: string; price: string },
  prefillNote: string
): { dest: string; days: number; note: string } {
  return {
    dest: pkg.name,
    days: parseNights(pkg.nights) + 1,
    note: `${prefillNote} ${pkg.name} · ${pkg.nights}, ${pkg.price}`,
  };
}

/** Reducer puro: siguiente intención con `seq` incrementado (permite re-disparar el mismo destino). */
export function nextIntent(
  prev: QuoteIntent | null,
  partial: { dest: string; days: number; note?: string }
): QuoteIntent {
  return { ...partial, seq: (prev?.seq ?? 0) + 1 };
}
```

- [ ] **Step 7: Correr el test y verificar que pasa**

Run: `npm test`
Expected: PASS — 6 tests verdes.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/quote-intent.ts lib/quote-intent.test.ts
git commit -m "feat(cotizador): helpers de intención de cotización + Vitest"
```

---

### Task 2: Lista maestra de 50 destinos + latLngToVec3

**Files:**
- Create: `lib/destino-geo.ts`
- Test: `lib/destino-geo.test.ts`

**Interfaces:**
- Produces:
  - `type DestinoGeo = { id: string; name: string; lat: number; lng: number }`
  - `const DESTINO_GEO: DestinoGeo[]` (50 entradas)
  - `const LNG_OFFSET: number` (calibrable)
  - `latLngToVec3(lat: number, lng: number, r: number): [number, number, number]`

- [ ] **Step 1: Escribir el test que falla**

Crear `lib/destino-geo.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { DESTINO_GEO, latLngToVec3 } from "./destino-geo";

describe("DESTINO_GEO", () => {
  it("tiene 50 destinos", () => {
    expect(DESTINO_GEO).toHaveLength(50);
  });
  it("tiene ids únicos", () => {
    expect(new Set(DESTINO_GEO.map((g) => g.id)).size).toBe(50);
  });
  it("coordenadas en rango válido", () => {
    for (const g of DESTINO_GEO) {
      expect(g.lat).toBeGreaterThanOrEqual(-90);
      expect(g.lat).toBeLessThanOrEqual(90);
      expect(g.lng).toBeGreaterThanOrEqual(-180);
      expect(g.lng).toBeLessThanOrEqual(180);
    }
  });
});

describe("latLngToVec3", () => {
  it("mantiene los puntos sobre la esfera de radio r", () => {
    const r = 1.4;
    const samples: Array<[number, number]> = [
      [0, 0],
      [10.39, -75.51],
      [48.85, 2.35],
      [-33.87, 151.21],
    ];
    for (const [lat, lng] of samples) {
      const [x, y, z] = latLngToVec3(lat, lng, r);
      expect(Math.hypot(x, y, z)).toBeCloseTo(r, 5);
    }
  });
  it("el polo norte cae en +Y", () => {
    const [x, y, z] = latLngToVec3(90, 0, 1.4);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(1.4, 5);
    expect(z).toBeCloseTo(0, 5);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test`
Expected: FAIL — no se puede resolver `./destino-geo`.

- [ ] **Step 3: Implementar `lib/destino-geo.ts`**

```ts
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
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test`
Expected: PASS — todos los tests de `destino-geo` verdes (más los de Task 1).

- [ ] **Step 5: Commit**

```bash
git add lib/destino-geo.ts lib/destino-geo.test.ts
git commit -m "feat(globo): lista maestra de 50 destinos + latLngToVec3"
```

---

### Task 3: `content.ts` — ids en destinos + prefillNote + test de cobertura

**Files:**
- Modify: `lib/content.ts` (destinos ES/EN + quote ES/EN)
- Test: `lib/content.test.ts`

**Interfaces:**
- Produces: cada `content[lang].destinos.items[i]` gana `id: string`; `content[lang].quote.prefillNote: string`.
- Consumes: `DESTINO_GEO` (Task 2).

- [ ] **Step 1: Escribir el test que falla**

Crear `lib/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { content } from "./content";
import { DESTINO_GEO } from "./destino-geo";

const geoIds = new Set(DESTINO_GEO.map((g) => g.id));
const langs = ["es", "en"] as const;

describe("ids de destinos ↔ cobertura geo", () => {
  for (const lang of langs) {
    it(`cada destino ${lang} tiene coordenadas en DESTINO_GEO`, () => {
      for (const d of content[lang].destinos.items) {
        expect(geoIds.has(d.id)).toBe(true);
      }
    });
    it(`cada quote ${lang} tiene prefillNote`, () => {
      expect(typeof content[lang].quote.prefillNote).toBe("string");
      expect(content[lang].quote.prefillNote.length).toBeGreaterThan(0);
    });
  }
  it("es y en comparten los mismos ids en el mismo orden", () => {
    const es = content.es.destinos.items.map((d) => d.id);
    const en = content.en.destinos.items.map((d) => d.id);
    expect(en).toEqual(es);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test`
Expected: FAIL — `d.id` es `undefined` / `prefillNote` no existe (errores de tipo/valor).

- [ ] **Step 3: Agregar `id` a los 8 destinos en ES**

En `lib/content.ts`, reemplazar el bloque `items` de `es.destinos` (líneas ~86-95) por:

```ts
      items: [
        { id: "cartagena", group: "colombia", name: "Cartagena", region: "Caribe colombiano", nights: "4 noches", price: "desde $890.000", img: "/destinos/cartagena.jpg" },
        { id: "san-andres", group: "colombia", name: "San Andrés", region: "Mar de siete colores", nights: "5 noches", price: "desde $1.250.000", img: "/destinos/san-andres.jpg" },
        { id: "santa-marta", group: "colombia", name: "Santa Marta", region: "Tayrona y Caribe", nights: "4 noches", price: "desde $760.000", img: "/destinos/santa-marta.jpg" },
        { id: "eje-cafetero", group: "colombia", name: "Eje Cafetero", region: "Valle de Cocora", nights: "3 noches", price: "desde $640.000", img: "/destinos/eje-cafetero.jpg" },
        { id: "cancun", group: "internacional", name: "Cancún", region: "Riviera Maya", nights: "6 noches", price: "desde $3.100.000", img: "/destinos/cancun.jpg" },
        { id: "punta-cana", group: "internacional", name: "Punta Cana", region: "Caribe", nights: "6 noches", price: "desde $3.400.000", img: "/destinos/punta-cana.jpg" },
        { id: "espana", group: "internacional", name: "España", region: "Madrid · Sevilla", nights: "8 noches", price: "desde $5.400.000", img: "/destinos/espana.jpg" },
        { id: "europa", group: "internacional", name: "Europa", region: "París · multidestino", nights: "10 noches", price: "desde $7.200.000", img: "/destinos/europa.jpg" },
      ],
```

- [ ] **Step 4: Agregar `id` a los 8 destinos en EN**

Reemplazar el bloque `items` de `en.destinos` (líneas ~257-265) por (mismos ids, textos en inglés):

```ts
      items: [
        { id: "cartagena", group: "colombia", name: "Cartagena", region: "Colombian Caribbean", nights: "4 nights", price: "from $890,000", img: "/destinos/cartagena.jpg" },
        { id: "san-andres", group: "colombia", name: "San Andrés", region: "Seven-color sea", nights: "5 nights", price: "from $1,250,000", img: "/destinos/san-andres.jpg" },
        { id: "santa-marta", group: "colombia", name: "Santa Marta", region: "Tayrona & Caribbean", nights: "4 nights", price: "from $760,000", img: "/destinos/santa-marta.jpg" },
        { id: "eje-cafetero", group: "colombia", name: "Coffee Region", region: "Cocora Valley", nights: "3 nights", price: "from $640,000", img: "/destinos/eje-cafetero.jpg" },
        { id: "cancun", group: "internacional", name: "Cancún", region: "Riviera Maya", nights: "6 nights", price: "from $3,100,000", img: "/destinos/cancun.jpg" },
        { id: "punta-cana", group: "internacional", name: "Punta Cana", region: "Caribbean", nights: "6 nights", price: "from $3,400,000", img: "/destinos/punta-cana.jpg" },
        { id: "espana", group: "internacional", name: "Spain", region: "Madrid · Seville", nights: "8 nights", price: "from $5,400,000", img: "/destinos/espana.jpg" },
        { id: "europa", group: "internacional", name: "Europe", region: "Paris · multi-city", nights: "10 nights", price: "from $7,200,000", img: "/destinos/europa.jpg" },
      ],
```

- [ ] **Step 5: Agregar `prefillNote` al `quote` de ES**

En `es.quote` (después de `eyebrow`, línea ~163), agregar:

```ts
      prefillNote: "Interesado en el paquete",
```

- [ ] **Step 6: Agregar `prefillNote` al `quote` de EN**

En `en.quote` (después de su `eyebrow`, línea ~334), agregar:

```ts
      prefillNote: "Interested in the package",
```

- [ ] **Step 7: Correr test y verificar que pasa**

Run: `npm test`
Expected: PASS — cobertura geo + prefillNote verdes.

- [ ] **Step 8: Verificar tipos y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 9: Commit**

```bash
git add lib/content.ts lib/content.test.ts
git commit -m "feat(content): ids en destinos + prefillNote (ES/EN)"
```

---

### Task 4: QuoteIntentProvider montado en la página

**Files:**
- Create: `lib/quote-provider.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `QuoteIntent`, `nextIntent` (Task 1).
- Produces:
  - `QuoteIntentProvider({ children }): JSX.Element`
  - `useQuoteIntent(): { intent: QuoteIntent | null; requestQuote: (p: { dest: string; days: number; note?: string }) => void }`

- [ ] **Step 1: Crear `lib/quote-provider.tsx`**

```tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type QuoteIntent, nextIntent } from "./quote-intent";

type QuoteIntentValue = {
  intent: QuoteIntent | null;
  requestQuote: (p: { dest: string; days: number; note?: string }) => void;
};

const QuoteIntentContext = createContext<QuoteIntentValue | null>(null);

export function QuoteIntentProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntent] = useState<QuoteIntent | null>(null);

  const requestQuote = useCallback(
    (p: { dest: string; days: number; note?: string }) => {
      setIntent((prev) => nextIntent(prev, p));
      if (typeof document !== "undefined") {
        document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <QuoteIntentContext.Provider value={{ intent, requestQuote }}>
      {children}
    </QuoteIntentContext.Provider>
  );
}

export function useQuoteIntent() {
  const ctx = useContext(QuoteIntentContext);
  if (!ctx) throw new Error("useQuoteIntent must be used within QuoteIntentProvider");
  return ctx;
}
```

- [ ] **Step 2: Envolver `<main>` en `app/page.tsx`**

Agregar el import (junto a los demás):

```tsx
import { QuoteIntentProvider } from "@/lib/quote-provider";
```

Envolver el `<main>` existente del componente `Home` con el provider (no cambies el orden ni el contenido de las secciones, sólo agrega el wrapper):

```tsx
export default function Home() {
  return (
    <QuoteIntentProvider>
      <main className="relative">
        <Navbar />
        {/* Secuencia de tonos (intercambio de colores): navy → navy(foto) →
            crema → navy → crema → navy → crema → navy → navy(footer). */}
        <Hero />
        <Destinos />
        <About />
        <Services />
        <Gallery />
        <Why />
        <Testimonials />
        <Contact />
        <Footer />
        <FloatingWhatsApp />
        <FloatingMap />
      </main>
    </QuoteIntentProvider>
  );
}
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build exitoso (sin errores de tipos ni de "must be used within provider" — aún no hay consumidores).

- [ ] **Step 4: Commit**

```bash
git add lib/quote-provider.tsx app/page.tsx
git commit -m "feat(cotizador): QuoteIntentProvider como canal de prefill"
```

---

### Task 5: Feature 1 — Cotizar desde Destinos (siembra + botón)

**Files:**
- Modify: `components/Cotizador.tsx`
- Modify: `components/Destinos.tsx`

**Interfaces:**
- Consumes: `useQuoteIntent` (Task 4), `buildQuoteIntent` (Task 1), `content[lang].quote.prefillNote` (Task 3).

- [ ] **Step 1: Cotizador consume la intención**

En `components/Cotizador.tsx`, agregar el import (junto a los demás de `@/lib`):

```tsx
import { useQuoteIntent } from "@/lib/quote-provider";
```

Dentro de `export default function Cotizador()`, después de `const q = c.quote;` (línea ~192), agregar:

```tsx
  const { intent } = useQuoteIntent();
```

Y después del `useEffect` existente que cierra el menú `pax` (el que registra `mousedown`, termina en la línea ~229), agregar este efecto de siembra:

```tsx
  // Siembra el formulario cuando llega una intención de cotización (Destinos / globo).
  useEffect(() => {
    if (!intent) return;
    setDest(intent.dest);
    setDays(intent.days);
    if (intent.note) {
      setNotes(intent.note);
      setOpen(true); // abre "Más detalles" para que la nota se vea
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent?.seq]);
```

- [ ] **Step 2: Destinos dispara la intención**

En `components/Destinos.tsx`, agregar imports:

```tsx
import { useQuoteIntent } from "@/lib/quote-provider";
import { buildQuoteIntent } from "@/lib/quote-intent";
```

Dentro de `export default function Destinos()`, después de `const items = c.destinos.items;` (línea ~12), agregar:

```tsx
  const q = c.quote;
  const { requestQuote } = useQuoteIntent();
```

Reemplazar el `<a href="#contacto">` del destino destacado (líneas ~65-71) por un `<button>` con el mismo estilo:

```tsx
              <button
                type="button"
                onClick={() => requestQuote(buildQuoteIntent(feat, q.prefillNote))}
                className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:border-white hover:bg-white/15"
              >
                {c.hero.ctaPrimary}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
```

(`feat` es el destino activo; `buildQuoteIntent` toma sólo `name`, `nights`, `price`.)

- [ ] **Step 3: Verificar tipos y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 4: Verificación manual E2E (dev server)**

Run: `npm run dev` y abrir la página.
Comprobar:
1. En la sección **Destinos**, elegir un destino (ej. San Andrés) y hacer clic en el botón "Planear mi viaje" del destacado.
2. La página hace **scroll suave** al Cotizador.
3. El campo **Destino** queda = "San Andrés"; **Días** = 6 (5 noches + 1); el panel **"Más detalles"** abierto con la nota *"Interesado en el paquete San Andrés · 5 noches, desde $1.250.000"*.
4. Cambiar de destino y volver a cotizar re-siembra correctamente (gracias a `seq`).
Detener el server (Ctrl-C) al terminar.

- [ ] **Step 5: Commit**

```bash
git add components/Cotizador.tsx components/Destinos.tsx
git commit -m "feat(cotizador): prefill del formulario al cotizar desde Destinos"
```

---

### Task 6: Feature 2 — Marcadores interactivos en el globo

**Files:**
- Create: `components/globe/DestinoMarker.tsx`
- Modify: `components/globe/GlobeCanvas.tsx`
- Modify: `components/globe/Globe.tsx`
- Modify: `components/HeroGlobo.tsx`

**Interfaces:**
- Consumes: `DESTINO_GEO`, `latLngToVec3` (Task 2), `content[lang].destinos.items` con `id` (Task 3), `useQuoteIntent` + `buildQuoteIntent` (Tasks 1/4), `content[lang].quote.prefillNote`, `content[lang].nav.cta`.
- Tipos compartidos (definidos en `Globe.tsx`, importados por `GlobeCanvas`/`HeroGlobo`):
  - `type GlobeMarker = { id: string; name: string; price: string; img: string; nights: string; lat: number; lng: number }`
  - `onCotizar?: (m: { name: string; nights: string; price: string }) => void`
  - `cotizarLabel?: string`

- [ ] **Step 1: Crear `components/globe/DestinoMarker.tsx`**

```tsx
"use client";

import { Html } from "@react-three/drei";
import { X } from "lucide-react";

export type DestinoMarkerData = {
  id: string;
  name: string;
  price: string;
  img: string;
  nights: string;
};

export default function DestinoMarker({
  data,
  position,
  active,
  onActivate,
  onClose,
  onCotizar,
  cotizarLabel,
}: {
  data: DestinoMarkerData;
  position: [number, number, number];
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
  onCotizar: () => void;
  cotizarLabel: string;
}) {
  return (
    <group position={position}>
      {/* Área de hit invisible (mayor que el punto) para facilitar hover/tap. */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onActivate();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Punto visible. */}
      <mesh scale={active ? 1.6 : 1}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#E8732A" toneMapped={false} />
      </mesh>

      {active && (
        <Html center distanceFactor={6} occlude zIndexRange={[40, 0]}>
          <div className="w-44 overflow-hidden rounded-xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl backdrop-blur">
            <div className="relative h-24 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.img} alt={data.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy-950/70 text-cream-50 transition hover:bg-navy-950"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-3">
              <p className="font-heading text-sm font-bold">{data.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-orange-400">{data.price}</p>
              <button
                type="button"
                onClick={onCotizar}
                className="mt-2 w-full rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
              >
                {cotizarLabel}
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
```

- [ ] **Step 2: Refactor de `GlobeCanvas.tsx` — grupo que gira + marcadores + estado activo**

En `components/globe/GlobeCanvas.tsx`:

a) Agregar imports arriba:

```tsx
import { useState } from "react";
import { latLngToVec3 } from "@/lib/destino-geo";
import DestinoMarker from "./DestinoMarker";
import type { GlobeMarker } from "./Globe";
```

(Combina `useState` con el import existente `{ Suspense, useMemo, useRef }` de `react`.)

b) Reemplazar la función `Earth()` completa por esta versión (mesh que gira y marcadores dentro de un `<group ref={spin}>`; halo estático fuera):

```tsx
function Earth({
  markers,
  active,
  setActive,
  onCotizar,
  cotizarLabel,
}: {
  markers: GlobeMarker[];
  active: string | null;
  setActive: (id: string | null) => void;
  onCotizar?: (m: { name: string; nights: string; price: string }) => void;
  cotizarLabel: string;
}) {
  const tex = useTexture("/textures/world-map.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const spin = useRef<THREE.Group>(null!);
  const paused = active !== null;

  useFrame((_, dt) => {
    if (!paused && spin.current) spin.current.rotation.y += dt * 0.04;
  });

  return (
    <group rotation={[0.32, 0, 0]}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[GLOBE_R, 64, 64]} />
          <meshStandardMaterial map={tex} roughness={0.92} metalness={0.05} />
        </mesh>
        {markers.map((m) => (
          <DestinoMarker
            key={m.id}
            data={{ id: m.id, name: m.name, price: m.price, img: m.img, nights: m.nights }}
            position={latLngToVec3(m.lat, m.lng, GLOBE_R * 1.02)}
            active={active === m.id}
            onActivate={() => setActive(m.id)}
            onClose={() => setActive(null)}
            onCotizar={() => {
              onCotizar?.(m);
              setActive(null);
            }}
            cotizarLabel={cotizarLabel}
          />
        ))}
      </group>
      {/* halo atmosférico (estático) */}
      <mesh scale={1.16}>
        <sphereGeometry args={[GLOBE_R, 32, 32]} />
        <meshBasicMaterial
          color="#E8732A"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
```

c) Reemplazar `Scene()` para que reciba props y pause el `autoRotate`:

```tsx
function Scene({
  markers,
  active,
  setActive,
  onCotizar,
  cotizarLabel,
}: {
  markers: GlobeMarker[];
  active: string | null;
  setActive: (id: string | null) => void;
  onCotizar?: (m: { name: string; nights: string; price: string }) => void;
  cotizarLabel: string;
}) {
  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 3, 5]} intensity={1.5} />
      <pointLight position={[-4, -1, -2]} intensity={0.5} color="#E8732A" />
      <Suspense fallback={null}>
        <Earth
          markers={markers}
          active={active}
          setActive={setActive}
          onCotizar={onCotizar}
          cotizarLabel={cotizarLabel}
        />
      </Suspense>
      <FlightPath />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={active === null}
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
      />
    </>
  );
}
```

d) Reemplazar el componente exportado `GlobeCanvas` para recibir props, sostener el estado `active` y cerrar al hacer clic fuera (`onPointerMissed`):

```tsx
export default function GlobeCanvas({
  frameloop = "always",
  markers = [],
  onCotizar,
  cotizarLabel = "Cotizar",
}: {
  frameloop?: "always" | "never";
  markers?: GlobeMarker[];
  onCotizar?: (m: { name: string; nights: string; price: string }) => void;
  cotizarLabel?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const hiDpr = typeof window !== "undefined" && window.devicePixelRatio >= 2;
  return (
    <Canvas
      frameloop={frameloop}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: !hiDpr, alpha: true }}
      style={{ background: "transparent" }}
      onPointerMissed={() => setActive(null)}
    >
      <Scene
        markers={markers}
        active={active}
        setActive={setActive}
        onCotizar={onCotizar}
        cotizarLabel={cotizarLabel}
      />
    </Canvas>
  );
}
```

- [ ] **Step 3: Threading de props en `Globe.tsx`**

En `components/globe/Globe.tsx`, exportar el tipo y aceptar/forward de props. Agregar al inicio (después de los imports):

```tsx
export type GlobeMarker = {
  id: string;
  name: string;
  price: string;
  img: string;
  nights: string;
  lat: number;
  lng: number;
};
```

Cambiar la firma del componente y la llamada a `GlobeCanvas`:

```tsx
export default function Globe({
  markers = [],
  onCotizar,
  cotizarLabel,
}: {
  markers?: GlobeMarker[];
  onCotizar?: (m: { name: string; nights: string; price: string }) => void;
  cotizarLabel?: string;
}) {
```

Y donde se renderiza `<GlobeCanvas frameloop={inView ? "always" : "never"} />`, pasar las props:

```tsx
          <GlobeCanvas
            frameloop={inView ? "always" : "never"}
            markers={markers}
            onCotizar={onCotizar}
            cotizarLabel={cotizarLabel}
          />
```

(`StaticGlobe` no recibe marcadores — se queda igual.)

- [ ] **Step 4: Wire en `HeroGlobo.tsx`**

En `components/HeroGlobo.tsx`, agregar imports:

```tsx
import { DESTINO_GEO } from "@/lib/destino-geo";
import { buildQuoteIntent } from "@/lib/quote-intent";
import { useQuoteIntent } from "@/lib/quote-provider";
```

Dentro del componente, después de `const stats = c.about.stats.slice(0, 3);`, construir markers y el handler:

```tsx
  const { requestQuote } = useQuoteIntent();
  const markers = DESTINO_GEO.flatMap((geo) => {
    const info = c.destinos.items.find((d) => d.id === geo.id);
    if (!info) return [];
    return [
      {
        id: geo.id,
        name: info.name,
        price: info.price,
        img: info.img,
        nights: info.nights,
        lat: geo.lat,
        lng: geo.lng,
      },
    ];
  });
  const handleCotizar = (m: { name: string; nights: string; price: string }) =>
    requestQuote(buildQuoteIntent(m, c.quote.prefillNote));
```

Pasar las props al `<Globe />` (dentro del bloque "Globo 3D"):

```tsx
            <Globe markers={markers} onCotizar={handleCotizar} cotizarLabel={c.nav.cta} />
```

- [ ] **Step 5: Verificar tipos y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 6: Calibrar `LNG_OFFSET` (checkpoint manual)**

Run: `npm run dev` y abrir la página (esperar ~1-2 s a que el globo 3D reemplace al estático).
Los pines naranjas deben caer sobre la geografía correcta (ej. Cartagena en la costa caribe colombiana, París en Europa). Si están desfasados en longitud, ajustar `LNG_OFFSET` en `lib/destino-geo.ts` (probar 0, 90, 180, 270) y refrescar hasta que alineen. Si hay un desfase fino de latitud/rotación, es por el `rotation={[0.32,0,0]}` del grupo — dejar los pines alineados en longitud es lo prioritario.
Correr `npm test` de nuevo tras cambiar `LNG_OFFSET` (los tests de esfera siguen pasando: sólo dependen del radio).

- [ ] **Step 7: Verificación manual E2E del globo**

Con el dev server abierto:
1. **Desktop:** pasar el mouse sobre un pin → el globo **pausa** su rotación y aparece la tarjeta (foto + nombre + precio + botón Cotizar).
2. Hacer clic en **Cotizar** → scroll al Cotizador con Destino = ese destino, Días correctos y nota prellenada; la tarjeta se cierra y el globo reanuda.
3. Clic en zona vacía del globo → cierra la tarjeta (reanuda rotación).
4. **Móvil (DevTools responsive o teléfono):** tap en un pin abre la tarjeta; ✕ o tap-fuera la cierra; Cotizar prellena igual.
5. **Reduced motion** (DevTools → Rendering → emulate `prefers-reduced-motion`): se ve `StaticGlobe` sin pines; la sección Destinos sigue permitiendo cotizar.
Detener el server al terminar.

- [ ] **Step 8: Commit**

```bash
git add components/globe/DestinoMarker.tsx components/globe/GlobeCanvas.tsx components/globe/Globe.tsx components/HeroGlobo.tsx lib/destino-geo.ts
git commit -m "feat(globo): marcadores interactivos con tarjeta y cotizar desde el globo"
```

---

## Notas de verificación final

Tras completar todas las tareas:

- [ ] `npm test` — todos los tests verdes.
- [ ] `npx tsc --noEmit` — sin errores de tipos.
- [ ] `npm run lint` — sin errores.
- [ ] `npm run build` — build de producción exitoso.
- [ ] E2E manual de las Tasks 5 y 6 confirmado (prefill desde Destinos y desde el globo).
