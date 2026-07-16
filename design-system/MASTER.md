# Escápate — Design System (MASTER)

> Fuente de verdad del diseño. Generado con **UI/UX Pro Max v2.5** (`search.py --design-system`)
> y ajustado con la **paleta real de la marca** extraída de los renders del local
> (`RENDERS FINALES AGENCIA DE VIAJES.pdf`). El branding manda sobre las sugerencias genéricas de la skill.

## 1. Proyecto

- **Producto:** Landing page de la agencia de viajes **Escápate** (Cúcuta, Colombia).
- **Idiomas:** Bilingüe **ES / EN** (ES por defecto).
- **Alcance:** Opción 2 — vitrina + **WhatsApp** (CTA principal) + **formulario** de contacto a correo (Web3Forms). Sin reservas/pagos.
- **Tono:** minimalismo cálido y sofisticado, editorial, **pocas cards**. Que NO parezca hecho por IA: fotos reales del local, layout asimétrico, tipografía con carácter, micro-interacciones.
- **Tagline oficial (ya existe en el local):** "Tu viaje empieza aquí".

## 2. Patrón de landing (skill: Immersive/Interactive Experience + Social Proof)

- Hero = **elemento interactivo a pantalla** (el globo 3D). +40% engagement, pero con **trade-off de rendimiento** → exige fallback.
- Fondo **oscuro** para enfocar; resaltar el elemento interactivo con el acento naranja.
- CTA tras la interacción + **botón "saltar"/scroll** para impacientes.
- Reforzar con **prueba social** (testimonios) antes del CTA final.
- **Mobile fallback esencial** (no exigir el 3D pesado en móvil).

## 3. Paleta (marca real — override de la skill)

| Token | Hex | Uso |
|-------|-----|-----|
| `--navy-950` | `#0C1B2F` | Fondo más profundo (hero) |
| `--navy-900` | `#11233E` | Azul marino primario de marca |
| `--navy-800` | `#16253F` | Superficies/secciones oscuras |
| `--navy-700` | `#1E3357` | Bloques elevados, inputs |
| `--orange-500`| `#E8732A` | **Acento / CTA** (alas del logo, estela del avión) |
| `--orange-300`| `#F0A04B` | Hover, palabras en itálica destacadas |
| `--cream-100` | `#EDE7DB` | Secciones cálidas (sofás bouclé) |
| `--cream-50`  | `#F5F1E9` | Fondo claro suave |
| `--espresso`  | `#262220` | Paredes de acento, mapamundi negro |
| `--white`     | `#FFFFFF` | Texto sobre navy, superficies limpias |
| `--wa-green`  | `#25D366` | Botón WhatsApp (color oficial) |

Contraste objetivo: texto **≥ 4.5:1**. Naranja sobre navy cumple para texto grande/iconos; para texto pequeño usar blanco/crema.

## 4. Tipografía (skill: "Classic Elegant")

- **Display / titulares:** `Playfair Display` (400–900, *italic* para acentos). Hero `font-weight:700–900`, `leading: 0.95–1.05`, `tracking: tight`.
- **Cuerpo:** `Inter` (300–600).
- **Etiquetas / horas / índices (01·02·03):** `JetBrains Mono`, MAYÚSCULAS, `tracking: widest`.

```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&display=swap');
```
Tailwind: `fontFamily: { display:['Playfair Display','serif'], sans:['Inter','sans-serif'], mono:['JetBrains Mono','monospace'] }`

## 5. Hero — globo 3D interactivo

- **Estilo:** continentes **reales** (geografía verdadera) en **dos colores: blanco sobre navy**. Conecta con el mapamundi negro retroiluminado del local.
- **Movimiento:** avión recorriendo una **órbita** con **estela punteada naranja** (= el logo, vivo). Auto-rotación suave; **arrastrable** (OrbitControls / drag esférico).
- **Stack:** `@react-three/fiber` + `@react-three/drei` + `three`.
- **Rendimiento (skill threejs.csv):**
  - `dpr={[1, 2]}` (cap pixel ratio en 2).
  - Un solo renderer; liberar geometrías/materiales al desmontar (R3F lo hace).
  - **`dynamic(() => import('./Globe'), { ssr:false })`** + `<Suspense>` con placeholder.
- **Accesibilidad (skill ux — severidad alta):**
  - Respetar **`prefers-reduced-motion`** → si activo, globo **estático** (imagen/SVG), sin auto-rotación.
  - **Móvil:** versión ligera o imagen estática del globo.
  - Botón "explorar destinos" como skip al contenido.

## 6. Estructura de secciones

1. **Navbar** — transparente sobre hero → sólida al hacer scroll. Toggle ES/EN. CTA WhatsApp.
2. **Hero** — globo 3D + "Tu viaje empieza aquí" + 2 CTAs + hint "arrastra para girar".
3. **Marquee** — frase gigante en movimiento (banda naranja).
4. **Destinos** — **bandas full-bleed** (no cards) con índice 01·02·03, nombre, precio "desde", flecha.
5. **Relojes del mundo** — franja horaria (New York · Francia · España).
6. **Quiénes somos** — titular grande + foto del local. Sin card.
7. **Servicios** — lista editorial (no tarjetas).
8. **Por qué Escápate** — fila de cifras/diferenciadores.
9. **Galería del local** — mosaico asimétrico con los renders.
10. **Testimonios** — 3–5, con foto + nombre + rol (prueba social antes del CTA).
11. **Contacto** — formulario (Web3Forms) + WhatsApp + mapa + redes.
12. **Footer** — logo, contacto, redes, idioma.

## 7. Stack técnico

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (+ tokens de §3/§4)
- **Framer Motion** (reveal on scroll, parallax 300–400ms)
- **react-three-fiber + drei + three** (globo)
- **next/image** para los renders del local
- i18n ES/EN: `next-intl` o toggle simple con diccionarios
- Form: **Web3Forms** (gratis). WhatsApp: enlace `wa.me`.
- Deploy: **Cloudflare Pages** (export estático)
- Iconos: **Lucide** (SVG, NO emojis como iconos)

## 8. Checklist pre-entrega (skill)

- [ ] Iconos SVG (Lucide), nunca emojis.
- [ ] `cursor-pointer` en todo lo clickeable.
- [ ] Hover con transición 150–300ms.
- [ ] Contraste texto ≥ 4.5:1 (revisar naranja sobre navy en texto pequeño).
- [ ] Focus visible para teclado + skip link.
- [ ] `prefers-reduced-motion` respetado (globo y scroll).
- [ ] Responsive: 375 · 768 · 1024 · 1440.
- [ ] Globo: lazy + fallback móvil + dispose al desmontar.

## 9. Pendientes de contenido (del cliente)

- Logo en alta (PNG transparente / SVG).
- Textos finales (historia, servicios) — borrador lo redacta el dev.
- **Destinos y precios reales** (los actuales son placeholders de ejemplo).
- Datos de contacto: WhatsApp, dirección exacta, @Instagram/Facebook, horarios.
