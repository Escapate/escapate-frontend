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

**Datos.**

- Agregar `id` estable a cada item de `destinos.items` en `content.ts` (mismo `id` en ES y
  EN). Ids sugeridos: `cartagena`, `san-andres`, `santa-marta`, `eje-cafetero`, `cancun`,
  `punta-cana`, `espana`, `europa`.
- Nuevo `lib/destino-geo.ts`: mapa `id → { lat, lng }` para los 8 destinos:

  | id | lat | lng |
  |---|---|---|
  | cartagena | 10.39 | -75.51 |
  | san-andres | 12.58 | -81.70 |
  | santa-marta | 11.24 | -74.20 |
  | eje-cafetero | 4.81 | -75.69 |
  | cancun | 21.16 | -86.85 |
  | punta-cana | 18.58 | -68.40 |
  | espana | 40.42 | -3.70 |
  | europa | 48.85 | 2.35 |

**Flujo de props.** `HeroGlobo` (fuera del `<Canvas>`, con contexto disponible):

- Construye `markers = c.destinos.items.map(d => ({ id, name, price, img, nights, coords: GEO[d.id] }))`
  (omite los que no tengan coords, por robustez).
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
