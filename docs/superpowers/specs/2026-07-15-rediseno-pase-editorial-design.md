# Rediseño Escápate — Tema 3 "Pase de Abordar" (editorial)

Fecha: 2026-07-15 · Rama: `feat/rediseno-pase-editorial`

## Objetivo

Fusionar lo mejor de tres diseños en un único tema principal, con cada sección
importante a **pantalla completa** (`100svh`), fondos con imágenes de destinos y
un lenguaje visual editorial tipo "pase de abordar / pasaporte".

Fuentes:
- **Import (`Escapate Landing.dc.html`)** con 2 frames: `01 · Luminosa Modular` y
  `02 · Pasaporte Editorial`.
- Código existente (Next.js 14 + TS + Tailwind + Framer Motion + globo R3F).

## Qué se toma de cada diseño

| Elemento | Origen | Nota |
|---|---|---|
| Base visual / "intercambio de colores" en el fondo | Pasaporte Editorial | Secciones alternan crema (`#F5F1E9`/`#EDE7DB`) ↔ navy (`#0C1B2F`/`#11233E`) |
| Estilo del formulario (cotizador) | Pasaporte Editorial | Tarjeta "boarding pass": perforación punteada, muescas troqueladas, campos subrayados Archivo mayúsculas |
| Hero pase de abordar + sello de caucho + estela punteada | Pasaporte Editorial | Motivo de marca (el logo son alas + estela naranja) |
| Sección "El local" (mosaico bento) | Luminosa Modular | Fotos reales del local |
| Testimonios (3 cards limpias con estrella + avatar inicial) | Luminosa Modular | Prueba social antes del CTA |
| Ubicación del local (dirección + mapa) | Nuevo (pedido del usuario) | Bloque junto a "El local" |
| Secciones a 1 pantalla + fondos de destinos + Tablero de salidas | Aporte propio | — |

## Tema 3 = tema principal (decisión)

- Se **consolida a un solo tema**. La alternancia crema/navy por sección *es* el
  tema; un toggle claro/oscuro global ya no encaja y además provocaba el "flash
  del logo en tema claro" (ítem de lanzamiento). Se **elimina el ThemeToggle**.
  Reversible si el cliente lo pide.

## Tipografía (nueva)

- **Display / titulares:** `Archivo` (800–900, MAYÚSCULAS, tracking tight) → `--font-display`
- **Titulares suaves (local/testimonios):** `Bricolage Grotesque` (700–800) → `--font-heading`
- **Cuerpo:** `Hanken Grotesk` (400–700) → `--font-sans`
- **Etiquetas / eyebrows / códigos:** `Space Mono` (400/700) → `--font-mono`

## Paleta

Se conserva la de marca ya tokenizada (navy 950–600, orange 500/400/600, cream
50/100, espresso, wa). Ver `tailwind.config.ts`.

## Estructura de secciones (cada una `min-h-[100svh]`, con `scroll-snap`)

1. **Navbar** (sticky, crema translúcida) — logo, links Space Mono, toggle ES/EN, CTA WhatsApp. *(no cuenta como pantalla)*
2. **Hero** (navy) — eyebrow "PASE DE ABORDAR / BOARDING PASS", H1 Archivo "Tu viaje empieza aquí.", 2 CTAs, stats; tarjeta boarding-pass + sello. Fondo: rejilla de puntos + estela punteada.
3. **Destinos** (fotos full-bleed) — destino destacado + lista con tags "CUC ✈ CODE" y precio "desde".
4. **Nosotros** (crema) — titular grande + foto del local + stats.
5. **Servicios** (navy) — índice editorial 01·02·03·04 (sin tarjetas).
6. **Por qué / Tablero de salidas** (navy, tabular Space Mono) — diferenciadores como panel de salidas de aeropuerto.
7. **El local** (crema) — mosaico bento de fotos + bloque ubicación (dirección + mapa embebido/estático).
8. **Testimonios** (crema/navy) — 3 cards limpias (estilo Luminosa).
9. **Cotizador / Contacto** (navy) — formulario boarding-pass "Emite tu pase de abordar" + tarjeta de contacto.
10. **Footer** (navy). *(no cuenta como pantalla)*
11. **FloatingWhatsApp** (persistente).

## Lógica a preservar

- i18n ES/EN (`lib/i18n.tsx`, `lib/content.ts`).
- Cotizador: construcción del mensaje WhatsApp + fallback Web3Forms. Se re-skinnea
  y se **arregla** el reset al cambiar idioma (guardar índices, no texto) y se gana
  navegación por teclado usando `<select>`/`<input>` nativos.
- Globo R3F: se preserva para la **rama alternativa** del hero.

## Ramas (forks)

- `feat/rediseno-pase-editorial` — principal (hero boarding-pass, sin globo).
- `feat/rediseno-globo-hero` — mismo diseño, hero conserva el globo 3D estilizado.

## Ítems de lanzamiento abordables ahora

- Favicon `app/icon.png` (desde el logo).
- OG image `public/og.jpg` 1200×630 + referencia en `layout.tsx`.
- A11y del cotizador (teclado) — resuelto por selects nativos.
- Reset de idioma del cotizador — arreglado.
- Flash del logo — eliminado (sin toggle).

No abordables (requieren datos del cliente): `WHATSAPP_NUMBER`, `EMAIL`,
`INSTAGRAM`, `WEB3FORMS_KEY`, dominio real (`metadataBase`), textos/testimonios/
precios reales, Facebook. Quedan como TODO marcados.

## Éxito

- `pnpm build` (export estático) en verde, sin errores de TS.
- Cada sección importante ocupa ~1 pantalla en 1440px y 375px.
- ES↔EN cambia todo el texto; el mensaje de WhatsApp del cotizador también.
- `prefers-reduced-motion` respetado.
