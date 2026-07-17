# Cotizar desde Destinos y marcadores interactivos en el globo — Diseño

Fecha: 2026-07-16

## Objetivo

Dos features que comparten una misma base técnica:

1. **Prefill desde Destinos:** al hacer clic en "Cotizar" desde un destino, el formulario
   de contacto (Cotizador) se pre-rellena con el destino + los días (derivados de las
   noches del paquete) + una nota autogenerada.
2. **Marcadores en el globo:** puntos interactivos sobre destinos populares en el globo 3D
   del hero. Al hacer hover (desktop) o tap (móvil), el globo pausa su rotación y aparece
   una tarjeta flotante junto al pin con foto, precio sugerido y un botón "Cotizar" que
   pre-rellena el formulario con ese destino.

Ambas usan el mismo canal de pre-rellenado, construido una sola vez.

## Contexto del código actual

- **Hero activo:** `app/page.tsx` importa `HeroGlobo` (el hero con globo 3D). El globo
  está en pantalla, así que la feature 2 aplica.
- **Cotizador** (`components/Cotizador.tsx`): guarda todo su estado internamente
  (`from`, `dest`, `days`, `notes`, etc.). No existe canal para pre-rellenarlo desde fuera.
- **Destinos** (`components/Destinos.tsx`): el botón "Cotizar" del destino destacado
  (línea ~65) es un `<a href="#contacto">` — solo ancla, no rellena nada.
- **Globo** (`components/globe/`): `Globe.tsx` hace carga diferida de `GlobeCanvas.tsx`
  (three.js en *idle*), con `StaticGlobe.tsx` como fallback SSR / `prefers-reduced-motion`.
  `GlobeCanvas` tiene el mesh de la Tierra rotando por `useFrame` y `OrbitControls` con
  `autoRotate`. El contenedor del globo es `aria-hidden` (decorativo).
- **Datos de destinos** (`lib/content.ts`): 8 items con
  `{ group, name, region, nights, price, img }`. `nights` es un string ("4 noches" /
  "4 nights"). No hay coordenadas lat/lng. Los `name` cambian entre ES/EN en algunos casos
  ("Eje Cafetero"/"Coffee Region", "España"/"Spain", "Europa"/"Europe"); el `img` es
  estable entre idiomas.
- **Cotizador `days`:** es un `number`. El mensaje/payload ya incluye destino, días, notas.

## Decisiones tomadas (brainstorming)

- **Interacción del globo:** hover en desktop + tap en móvil; al activar un marcador el
  globo **pausa** su rotación.
- **Presentación:** tarjeta flotante compacta anclada junto al pin (no modal centrado, no
  redirección a la sección Destinos).
- **Prefill:** rellena Destino + Días + una nota autogenerada.
- **Noches → Días:** convención de viajes, `N noches = N+1 días` ("4 noches" → 5 días).
- **Canal de prefill:** contexto React (`QuoteIntentProvider`), no URL params ni eventos DOM.

## Arquitectura

### A. Canal de intención — `lib/quote-intent.tsx` (nuevo)

Contexto React al estilo de `I18nProvider`.

```ts
export type QuoteIntent = {
  dest: string;
  days: number;
  note?: string;
  seq: number; // se incrementa en cada solicitud → permite re-disparar el mismo destino
};

useQuoteIntent(): {
  intent: QuoteIntent | null;
  requestQuote(partial: { dest: string; days: number; note?: string }): void;
};
```

- `requestQuote(partial)`: incrementa `seq`, guarda el intent y hace scroll suave a
  `#contacto` (`document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })`).
- El provider (`QuoteIntentProvider`) envuelve las secciones en `app/page.tsx` (debe estar
  por encima de `HeroGlobo`, `Destinos` y `Contact`).

**Por qué contexto y no URL/eventos:** idiomático (mismo patrón que i18n), sin ensuciar la
URL de una SPA de una sola página, fácil de testear. react-three-fiber **no propaga el
contexto de React hacia dentro del `<Canvas>`**, por eso el globo no consume el contexto
directamente: `GlobeCanvas` recibe datos ya traducidos y un callback `onCotizar` como
props (ver sección C).

### B. Feature 1 — Cotizar desde Destinos

En `components/Destinos.tsx`, el botón "Cotizar" del destino destacado deja de ser un
`<a href="#contacto">` y pasa a ser un `<button>` que llama:

```ts
const { requestQuote } = useQuoteIntent();

requestQuote({
  dest: feat.name,
  days: parseNights(feat.nights) + 1,
  note: `${q.prefillNote} ${feat.name} · ${feat.nights}, ${feat.price}`,
});
```

Helpers:

- `parseNights(nights: string): number` — extrae el primer entero de "4 noches" / "4 nights"
  (`parseInt(nights, 10)`, con fallback a un valor por defecto si no hay número).
- `q.prefillNote` — prefijo traducible nuevo en `content.ts`, p. ej.
  ES: `"Interesado en el paquete"`, EN: `"Interested in the package"`. La nota resultante:
  *"Interesado en el paquete Cartagena · 4 noches, desde $890.000"*.

En **Cotizador**, un `useEffect` sobre `intent?.seq` siembra el estado cuando llega un
intent nuevo:

```ts
useEffect(() => {
  if (!intent) return;
  setDest(intent.dest);
  setDays(intent.days);
  if (intent.note) {
    setNotes(intent.note);
    setOpen(true); // abre el panel "Más detalles" para que la nota se vea
  }
}, [intent?.seq]); // eslint-disable-line — se dispara por seq a propósito
```

No cambia nada más de la lógica de envío (WhatsApp / Web3Forms). La nota ya se incluye en
`message` y en el payload vía el estado `notes`.

### C. Feature 2 — Marcadores en el globo

**Datos — separación coordenadas vs. info.**

El "mapa maestro" de coordenadas y la info del destino son fuentes **separadas**, unidas por
`id`. Un pin **se renderiza solo si hay info** para ese `id`.

- Nuevo `lib/destino-geo.ts`: lista maestra de **50 destinos populares** con
  `{ id, name, lat, lng }` (ver Apéndice). `name` aquí es solo etiqueta de documentación /
  fallback; el nombre visible en la tarjeta viene de la info localizada.
- **Info** = existe un item en `destinos.items` (`content.ts`) con ese mismo `id`, que aporta
  el nombre localizado, `img`, `price` y `nights`. Para esto se agrega un `id` estable a cada
  item de `destinos.items` (mismo `id` en ES y EN).
- **Condición de render:** `markers = DESTINO_GEO` **join** `destinos.items` por `id`,
  filtrando a los que tienen match. Hoy tienen info los 8 paquetes actuales
  (`cartagena`, `san-andres`, `santa-marta`, `eje-cafetero`, `cancun`, `punta-cana`,
  `espana`, `europa`) → esos 8 pintan pin. Los otros 42 quedan como coordenadas listas: en
  cuanto el cliente agregue un destino a `content.ts` con un `id` de la lista, su pin
  aparece solo, sin tocar el globo.

**Flujo de props.** `HeroGlobo` (fuera del `<Canvas>`, con contexto disponible):

- Construye `markers` recorriendo `DESTINO_GEO` (las 50 coordenadas) y uniéndolas con
  `c.destinos.items` por `id`; **solo entran las que tienen info** (match). Cada marker:
  `{ id, name, price, img, nights, coords: { lat, lng } }` con name/price/img/nights de la
  info localizada.
- Define `handleCotizar(marker)` que llama
  `requestQuote({ dest: marker.name, days: parseNights(marker.nights)+1, note: `${q.prefillNote} ${marker.name} · ${marker.nights}, ${marker.price}` })`
  — **exactamente el mismo formato de payload y de nota que la feature 1**. Para evitar
  duplicar la construcción, extraer un helper compartido
  `buildQuoteIntent({ name, nights, price }, prefillNote)` que devuelva `{ dest, days, note }`
  y usarlo tanto en Destinos como en HeroGlobo.
- Pasa `markers` y `onCotizar={handleCotizar}` por `Globe → GlobeCanvas` como props.
- `StaticGlobe` no recibe marcadores (fallback sin interacción).

**Dentro de `GlobeCanvas`:**

- Refactor menor de `Earth()`: el mesh de la Tierra que gira y el grupo de marcadores viven
  en un **grupo compartido** con el `useFrame` de rotación, para que los pines queden
  pegados a la geografía. Se agrega una prop/estado `paused` que detiene ese `useFrame`.
- `latLngToVec3(lat, lng, r): THREE.Vector3` — coloca cada pin en la superficie:
  ```
  phi = (90 - lat) * PI/180
  theta = (lng + LNG_OFFSET) * PI/180
  x = -r * sin(phi) * cos(theta)
  y =  r * cos(phi)
  z =  r * sin(phi) * sin(theta)
  ```
  `LNG_OFFSET` es el parámetro a **calibrar visualmente** contra `world-map.png` y el
  `rotation={[0.32,0,0]}` actual del grupo Tierra.
- `<Marker>`: punto luminoso pequeño en `latLngToVec3(coords, GLOBE_R * 1.01)`, con
  `onPointerOver` / `onPointerOut` / `onClick`. Opcional: leve pulso.
- **Activación:** `active = id`. Mientras haya `active`:
  - se pausa el `useFrame` del grupo Tierra (los pines quedan quietos),
  - `OrbitControls autoRotate={false}`.
  Al cerrar, se reanuda.
- **Tarjeta flotante:** `<Html>` de drei anclado a la posición del pin activo. Contenido:
  foto (`img`), nombre, precio sugerido (opcional), botón **Cotizar** → `onCotizar(marker)`
  y cerrar. Cierre: `onPointerOut` (desktop), botón ✕ (móvil), o clic/tap fuera.
- **Oclusión:** los pines de la cara trasera quedan tapados por la esfera de forma natural
  (misma radio de superficie); además `<Html occlude>` evita que la tarjeta "atraviese" el
  globo.

### D. Accesibilidad, móvil y motion

- El contenedor del globo sigue `aria-hidden` (decorativo). Los marcadores son **mejora
  progresiva**. El camino accesible equivalente es la sección **Destinos**, que ofrece los
  mismos destinos + Cotizar por teclado y lector de pantalla.
- `prefers-reduced-motion` → `StaticGlobe`, sin marcadores (comportamiento actual intacto).
- Móvil: tap abre la tarjeta, tap-fuera / ✕ cierra; rotación pausada mientras esté abierta.

## Testing

- **Unit:**
  - `parseNights` con "4 noches", "10 nights", y un string sin número (fallback).
  - Construcción de la nota (formato correcto con name · nights, price).
  - `latLngToVec3` con lat/lng conocidos → vector esperado (magnitud = r, signos correctos).
  - Reducer de `requestQuote`: `seq` incrementa en cada llamada; el intent guarda dest/days/note.
- **Componente:**
  - El Cotizador siembra `dest`, `days`, `notes` y abre el panel al llegar un intent nuevo
    (incluyendo re-disparo con el mismo destino vía `seq`).
  - El botón "Cotizar" de Destinos llama `requestQuote` con el payload correcto.
- **Manual / visual:**
  - Calibración de `LNG_OFFSET`: los pines caen sobre la geografía correcta.
  - Colocación de la tarjeta y oclusión trasera.
  - Tap en móvil abre/cierra; hover en desktop; pausa/reanuda de la rotación.
  - `prefers-reduced-motion`: sin marcadores, globo estático.

## Fuera de alcance

- Backend / persistencia de cotizaciones (el envío sigue por WhatsApp / Web3Forms actual).
- Deep-linking por URL a un destino concreto.
- Marcadores en `StaticGlobe` o para usuarios con motion reducido.
- Cambiar la lógica de envío del Cotizador.

## Riesgos

- **Calibración de coordenadas:** `LNG_OFFSET` no saldrá perfecto al primer intento;
  requiere ajuste visual iterativo. Es el único punto con incertidumbre real.
- **Boundary de contexto en R3F:** mitigado pasando datos + callback como props (no se
  intenta consumir contexto dentro del `<Canvas>`).

## Apéndice — `lib/destino-geo.ts` (50 destinos populares)

Lista maestra `{ id, name, lat, lng }`. Las 8 primeras (con **★**) hoy tienen info en
`content.ts` → pintan pin. Las otras 42 son coordenadas listas: agregar el destino a
`content.ts` con el mismo `id` hace aparecer el pin. Coordenadas aproximadas de la ciudad
ancla (lat negativa = Sur, lng negativa = Oeste).

| id | name | lat | lng |
|---|---|---|---|
| cartagena ★ | Cartagena | 10.39 | -75.51 |
| san-andres ★ | San Andrés | 12.58 | -81.70 |
| santa-marta ★ | Santa Marta | 11.24 | -74.20 |
| eje-cafetero ★ | Eje Cafetero (Pereira) | 4.81 | -75.69 |
| cancun ★ | Cancún | 21.16 | -86.85 |
| punta-cana ★ | Punta Cana | 18.58 | -68.40 |
| espana ★ | España (Madrid) | 40.42 | -3.70 |
| europa ★ | Europa (París) | 48.85 | 2.35 |
| rome | Roma | 41.90 | 12.50 |
| london | Londres | 51.51 | -0.13 |
| barcelona | Barcelona | 41.39 | 2.17 |
| lisbon | Lisboa | 38.72 | -9.14 |
| amsterdam | Ámsterdam | 52.37 | 4.90 |
| venice | Venecia | 45.44 | 12.32 |
| santorini | Santorini | 36.39 | 25.46 |
| istanbul | Estambul | 41.01 | 28.98 |
| prague | Praga | 50.08 | 14.44 |
| vienna | Viena | 48.21 | 16.37 |
| athens | Atenas | 37.98 | 23.73 |
| swiss-alps | Alpes Suizos | 46.82 | 8.23 |
| new-york | Nueva York | 40.71 | -74.01 |
| miami | Miami | 25.76 | -80.19 |
| orlando | Orlando | 28.54 | -81.38 |
| los-angeles | Los Ángeles | 34.05 | -118.24 |
| las-vegas | Las Vegas | 36.17 | -115.14 |
| toronto | Toronto | 43.65 | -79.38 |
| mexico-city | Ciudad de México | 19.43 | -99.13 |
| rio-de-janeiro | Río de Janeiro | -22.91 | -43.17 |
| buenos-aires | Buenos Aires | -34.60 | -58.38 |
| lima | Lima | -12.05 | -77.04 |
| cusco | Cusco (Machu Picchu) | -13.53 | -71.97 |
| santiago | Santiago de Chile | -33.45 | -70.67 |
| aruba | Aruba | 12.52 | -69.97 |
| havana | La Habana | 23.11 | -82.37 |
| panama-city | Ciudad de Panamá | 8.98 | -79.52 |
| san-jose-cr | San José (Costa Rica) | 9.93 | -84.09 |
| galapagos | Galápagos | -0.95 | -90.97 |
| dubai | Dubái | 25.20 | 55.27 |
| tokyo | Tokio | 35.68 | 139.65 |
| kyoto | Kioto | 35.01 | 135.77 |
| bangkok | Bangkok | 13.76 | 100.50 |
| bali | Bali | -8.34 | 115.09 |
| singapore | Singapur | 1.35 | 103.82 |
| phuket | Phuket | 7.88 | 98.39 |
| hong-kong | Hong Kong | 22.32 | 114.17 |
| maldives | Maldivas | 3.20 | 73.22 |
| cape-town | Ciudad del Cabo | -33.92 | 18.42 |
| marrakech | Marrakech | 31.63 | -7.98 |
| cairo | El Cairo | 30.04 | 31.24 |
| sydney | Sídney | -33.87 | 151.21 |

## Refinamiento (post-review, 2026-07-16)

Tras la revisión y una pasada visual del cliente, dos ajustes en `components/globe/DestinoMarker.tsx`:

1. **La tarjeta se oculta al salir el mouse.** `onMouseLeave={onClose}` en el `div` raíz de
   la tarjeta. Como la tarjeta va centrada/anclada sobre el pin, no hay "hover-gap". En touch
   (sin hover) se mantienen ✕ / clic-fuera (`onPointerMissed`) / otro-pin / Cotizar.
2. **Marcadores = pin 3D estilo Google Maps** (los puntos planos no resaltaban). Cada pin es
   un cono con la punta clavada en la superficie + cabeza esférica, con `meshStandardMaterial`
   emisivo (naranja de marca) para que resalte. Se orienta a la **normal** de la superficie
   (`quaternion` de +Y a `normalize(position)`), así sobresale hacia afuera. Escala ~1.2 al
   activarse. Oclusión natural en la cara trasera vía z-test de los meshes (no necesita el
   `occludeRef`, que sigue siendo sólo para la tarjeta). Proporciones (altura, radio de cabeza,
   color/emisivo) son **ajuste visual fino** que se calibra en `pnpm dev`, como `LNG_OFFSET`.
