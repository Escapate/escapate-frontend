# Checklist antes de publicar — Escápate

Lo que falta para que la landing pase de "lista técnicamente" a "publicable".
Ordenado por prioridad. Los ítems 🔴 son **bloqueantes** (no se puede lanzar sin
resolverlos); los 🟡 son mejoras recomendadas; los ⚪ son detalles/pulido.

> Última revisión: 2026-07-18. Los datos de contacto, el favicon, la imagen social
> y el dominio ya quedaron resueltos — lo que sigue abierto es sobre todo **contenido
> real del cliente**, que es justo lo que más riesgo de marca tiene.

---

## 🔴 1. Contenido ficticio a reemplazar

Todo esto está inventado como ejemplo y hoy se muestra como si fuera real. Publicar
con testimonios y cifras falsas es un riesgo legal y de reputación, no un detalle.

- [ ] **Testimonios** (`testimonials.items`, ES y EN en [`lib/content.ts`](lib/content.ts)) —
      inventados, con nombre y año. Usar reseñas reales con permiso, o quitar la sección
      completa (`components/Testimonials.tsx` fuera de `app/page.tsx`).
- [ ] **Destinos y precios** (`destinos.items`, ES y EN) — nombres, noches y precios
      "desde" son de ejemplo. Los precios además se muestran como ancla de venta.
- [ ] **Cifras de "Nosotros"** (`about.stats`): `+10 años`, `+40 destinos`, `100%
      acompañamiento`. Ajustar a lo real.
- [ ] Texto de "Nosotros" (`about.body`) — borrador; validar con el cliente.

## 🔴 2. Correo de recepción de cotizaciones

- [ ] `WEB3FORMS_KEY` está **vacío**. Mientras siga así, el botón "Enviar al correo"
      del cotizador cae en WhatsApp como respaldo (ver `onEmail` en
      [`components/Cotizador.tsx`](components/Cotizador.tsx)). Sacar la key gratis en
      https://web3forms.com y ponerla en `NEXT_PUBLIC_WEB3FORMS_KEY` (ver `.env.example`)
      y en las variables de entorno de Cloudflare Pages.
- [ ] Confirmar que **`reservas@escapate.tours` existe y lo lee alguien**. Es el correo
      que se muestra en el footer y el que se publica en el structured data (`EMAIL` en
      content.ts, fuente única desde la revisión de 2026-07-18).
- [ ] Al configurar la key, restringirla al dominio `escapate.tours` en el panel de
      Web3Forms. La key viaja en el bundle del navegador — el blindaje real va allá.
- [ ] Probar un envío de punta a punta y verificar que **"Responder"** en la bandeja
      le escriba al cliente (el formulario ya manda `replyto` y `from_name`).

## 🔴 3. Datos del negocio — confirmar con el cliente

Todo en `BUSINESS` al inicio de [`lib/content.ts`](lib/content.ts), que es la fuente
única del NAP: alimenta a la vez el JSON-LD, el footer, el mapa embebido y el pie.

- [ ] Dirección exacta (`address.street` / `address.full`).
- [ ] Horarios (`hours` + la cadena visible `contact.hours`).
- [ ] Coordenadas (`geo`) — hoy `7.853932, -72.4663327`. Verificar contra el pin real
      del Google Business verificado.

## 🟡 4. Accesibilidad / UX (mejoras conocidas)

- [ ] Los combobox de ciudad/destino del cotizador no tienen navegación por teclado con
      flechas. Ya cierran con Escape y con Enter, exponen roles ARIA y funcionan con
      mouse/tap; falta el recorrido con ↑/↓.
- [ ] El cotizador guarda ciudad y destino como **texto**, no como índice: al cambiar de
      idioma el valor elegido se queda en el idioma anterior (p. ej. "Eje Cafetero" con
      la lista en inglés). Se arregla guardando el índice.
- [ ] Flash breve del logo al cargar en **tema oscuro**: el estado del tema arranca en
      `default` y solo lee localStorage después de montar, así que se ve un instante el
      logo de tema claro. Se elimina sirviendo ambos logos por CSS en vez de por estado
      de React.
- [ ] Los pines y las cards del globo son deliberadamente invisibles para lectores de
      pantalla (van dentro de un contenedor `aria-hidden` y con `tabIndex={-1}`). La ruta
      accesible equivalente es el modo **"Explorar"**, que sí es navegable con teclado.
      Si algún día se quiere paridad total, hay que sacar las cards del subárbol oculto.

## ⚪ 5. Deploy en Cloudflare Pages

- Build command: `pnpm build`
- Output directory: `out`
- Node: fijado en [`.node-version`](.node-version); pnpm vía `packageManager` / `.npmrc`.
- Variables de entorno: `NEXT_PUBLIC_WEB3FORMS_KEY`.
- [ ] Confirmar que el dominio apunta al apex `escapate.tours` (es el canónico que
      declara `metadataBase` y el sitemap).

## ⚪ 6. Verificación final (probar a mano)

- [ ] Responsive: 375 · 768 · 1024 · 1440 px.
- [ ] ES ↔ EN: que todo el texto cambie, incluido el globo y el mensaje de WhatsApp
      del cotizador.
- [ ] Los 3 temas: default ↔ claro ↔ oscuro.
- [ ] Enviar una cotización de prueba por WhatsApp y por correo.
- [ ] Cotizar desde una card del globo y desde el modo "Explorar": debe sembrar el
      formulario y **dejarte parado en él**.
- [ ] Globo 3D con `prefers-reduced-motion` activo (debe salir el globo estático).
- [ ] Lighthouse (rendimiento / accesibilidad).

---

## Ya resuelto (no volver a abrir)

- WhatsApp, correo e Instagram reales en `lib/content.ts`.
- Favicon (`app/icon.png`, `app/apple-icon.png`) e imagen social generada en build
  (`app/opengraph-image.tsx`).
- `metadataBase`, `sitemap.xml`, `robots.txt` y manifest apuntando a `escapate.tours`.
- Logo optimizado (804 KB → ~50 KB).
- El ícono de Facebook del footer se quitó: solo quedan Instagram y WhatsApp, ambos
  con URL real.
