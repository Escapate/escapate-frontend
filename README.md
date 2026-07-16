# Escápate — Landing page

Landing bilingüe (ES/EN) para la agencia de viajes **Escápate** (Cúcuta, Colombia).
Hero con **globo 3D interactivo** (arrástralo para girar) y un avión orbitando con estela naranja.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · react-three-fiber + drei (globo 3D) · Lucide.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
```

> **Importante (entorno):** este proyecto vive en el sistema de archivos de WSL
> (`\\wsl.localhost\...`). **Node de Windows NO puede usar esa ruta de red como
> directorio de trabajo** (falla `next dev`/`next build` con errores `UNC`/`EISDIR`).
> Opciones para correrlo:
> 1. **Recomendada:** instalar Node nativo en WSL (p. ej. con `nvm`) y correr `npm run dev`
>    desde Ubuntu (`/home/usuario/ClaudeCode/Escapate`).
> 2. Mapear la carpeta a una unidad de Windows y usar polling:
>    `net use Z: \\wsl.localhost\Ubuntu` y luego, en esa unidad,
>    `set WATCHPACK_POLLING=1000 && npm run dev`.
>
> El **deploy en Cloudflare Pages compila en Linux**, así que la build de producción
> funciona sin problemas allí (no sufre la limitación de Windows).

## Deploy

**Cloudflare Pages** (export estático). Ajustes del proyecto en Cloudflare:

- Build command: `pnpm build`
- Output directory: `out`
- Node version: fijada en `.node-version`; pnpm vía `.npmrc` / `packageManager`.

`next.config.mjs` usa `output: "export"` con `images.unoptimized`, así que el sitio
sale como HTML/JS/CSS estáticos servidos directamente por Cloudflare.

## Qué falta completar (placeholders)

En `lib/content.ts`:
- `WHATSAPP_NUMBER` — número real (formato internacional sin `+`, ej. `573001234567`).
- `WEB3FORMS_KEY` — access key de https://web3forms.com para que el formulario llegue al correo
  (si se deja vacío, el formulario abre WhatsApp con el mensaje pre-cargado como respaldo).
- `EMAIL`, `INSTAGRAM` — correo y usuario reales.
- **Destinos y precios** en `content.es.destinos` / `content.en.destinos` (los actuales son de ejemplo).
- Textos de "Nosotros", testimonios, horarios y dirección exacta.

Otros:
- **Logo:** se usa un placeholder (avión en un círculo). Reemplazar por el logo real
  (PNG transparente / SVG) en `components/Navbar.tsx` y `components/Footer.tsx`.
- **Fotos:** se extrajeron de `RENDERS FINALES AGENCIA DE VIAJES.pdf` a `public/renders/`.

## Estructura

- `app/` — layout (fuentes + metadatos) y página principal.
- `components/` — secciones (Navbar, Hero, Destinos, Clocks, About, Services, Why, Gallery,
  Testimonials, Contact, Footer) + `globe/` (el globo 3D y su fallback estático).
- `lib/content.ts` — todo el texto ES/EN y datos de contacto.
- `lib/i18n.tsx` — toggle de idioma (persistido en localStorage).
- `public/textures/world-map.png` — mapa de continentes para el globo.
- `design-system/MASTER.md` — sistema de diseño (paleta, tipografía, specs del globo).

## Accesibilidad / rendimiento

- `prefers-reduced-motion`: el globo se sirve estático y se desactivan las animaciones.
- Globo cargado con `dynamic(..., { ssr:false })` y `dpr` limitado a 2.
