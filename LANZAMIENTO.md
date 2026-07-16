# Checklist antes de publicar — Escápate

Lo que falta para que la landing pase de "lista técnicamente" a "publicable".
Ordenado por prioridad. Los ítems 🔴 son **bloqueantes** (no se puede lanzar sin
resolverlos); los 🟡 son mejoras recomendadas; los ⚪ son detalles/pulido.

---

## 🔴 1. Datos reales de contacto

Todo en [`lib/content.ts`](lib/content.ts) (arriba del archivo):

- [ ] `WHATSAPP_NUMBER` — hoy es `573000000000` (falso). Formato internacional sin `+`
      (ej. `573001234567`). **Afecta a TODOS los botones de WhatsApp** (navbar, hero,
      contacto, cotizador, botón flotante, footer).
- [ ] `EMAIL` — hoy `hola@escapate.com` (placeholder).
- [ ] `INSTAGRAM` — hoy `escapate` (verificar usuario real).
- [ ] `WEB3FORMS_KEY` — vacío. Sin esto, el botón "Enviar al correo" del cotizador
      **cae en WhatsApp** como respaldo. Sacar la key gratis en https://web3forms.com
      si se quiere recibir las cotizaciones por correo.
- [ ] Link de **Facebook** en [`components/Footer.tsx`](components/Footer.tsx) — hoy es
      `href="#"` (muerto). Poner la URL real o quitar el ícono.
- [ ] Dirección y horarios exactos (`contact.address`, `contact.hours` en content.ts).

## 🔴 2. Contenido ficticio a reemplazar

Todo inventado como ejemplo. Ojo: testimonios y cifras falsas son un riesgo real
para la marca.

- [ ] **Destinos y precios** (`destinos.items`, ES y EN) — nombres, noches y precios
      "desde" son de ejemplo.
- [ ] **Cifras de "Nosotros"** (`about.stats`): `+10 años`, `+2.500 viajeros`, `+40
      destinos`, `100%`. Ajustar a lo real.
- [ ] **Testimonios** (`testimonials.items`) — inventados. Usar reseñas reales
      (con permiso) o quitar la sección.
- [ ] Texto de "Nosotros" (`about.body`) — borrador; validar con el cliente.

## 🔴 3. Assets de marca

- [ ] **Favicon** — no hay. Agregar `app/icon.png` (o `favicon.ico`); Next lo toma
      automáticamente.
- [ ] **Imagen social (Open Graph)** — no hay. Crear una de 1200×630 en `public/og.jpg`
      y descomentar `openGraph.images` en [`app/layout.tsx`](app/layout.tsx). Sin ella,
      al compartir el link en WhatsApp/redes no sale preview.
- [x] Logo optimizado — el transparente pasó de 804 KB a ~50 KB (600×364). Si el cliente
      entrega un logo en mejor calidad, re-optimizar igual antes de subirlo.

## 🟡 4. SEO / dominio

- [ ] `metadataBase` en [`app/layout.tsx`](app/layout.tsx) — hoy apunta a
      `https://escapate.com` (placeholder). Poner el dominio real de producción.
- [ ] Configurar el dominio real en Cloudflare Pages.

## 🟡 5. Accesibilidad / UX (mejoras)

- [ ] Los dropdowns del cotizador ([`components/Cotizador.tsx`](components/Cotizador.tsx))
      no tienen navegación por teclado (flechas / Escape). Funcionan con mouse/tap y ya
      exponen roles ARIA, pero un refactor a teclado completo sería lo ideal.
- [ ] El cotizador **resetea** la selección de ciudad/destino al cambiar de idioma
      (guarda el texto traducido como estado). Menor; se arreglaría guardando índices.
- [ ] Flash breve del logo al cargar en **tema claro** (el estado arranca en oscuro).
      Menor; se elimina sirviendo ambos logos por CSS en vez de por estado de React.

## ⚪ 6. Deploy en Cloudflare Pages

- Build command: `pnpm build`
- Output directory: `out`
- Node: fijado en [`.node-version`](.node-version); pnpm vía `packageManager` / `.npmrc`.
- `pnpm install` debe terminar en exit 0 (ya resuelto el build script de `unrs-resolver`
  en [`pnpm-workspace.yaml`](pnpm-workspace.yaml)).

## ⚪ 7. Verificación final (probar a mano)

- [ ] Responsive: 375 · 768 · 1024 · 1440 px.
- [ ] ES ↔ EN: que todo el texto cambie (incluido el mensaje de WhatsApp del cotizador).
- [ ] Tema claro ↔ oscuro.
- [ ] Enviar una cotización de prueba por WhatsApp y por correo.
- [ ] Globo 3D: probar con `prefers-reduced-motion` activo (debe salir el globo estático).
- [ ] Lighthouse (rendimiento / accesibilidad).
