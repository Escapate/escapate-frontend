# Cotizador ampliado — formulario de solicitud de cotización

**Fecha:** 2026-07-16
**Componente:** `components/Cotizador.tsx` (incrustado en `components/Contact.tsx`)
**Origen:** formato Word interno de la agencia ("FORMATO DE SOLICITUD DE COTIZACIÓN").
El `.docx` es material de referencia, **no versionado** (`.git/info/exclude`).

## Objetivo

Ampliar el cotizador existente (estética "pase de abordar") para capturar los datos
del formato interno que sí corresponden al cliente, manteniendo el pase **compacto en
alto en PC** y **funcional en móvil**. Sigue siendo informativo: sin backend, sin PDF
automático, sin cuentas de cliente.

## Alcance

Sobre el `Cotizador.tsx` actual de `main` (no se coordina con la rama del rediseño
editorial del pase; la lógica sobrevive a un restyle posterior).

**Dentro:** ampliar campos, sección de detalles colapsable, validación por vía de
envío, extender mensaje de WhatsApp y payload de web3forms, i18n ES/EN.

**Fuera:** forma de pago, fecha, asesor(a) (son campos internos de la agencia). Envío
automático de PDF / backend de cotizaciones (pieza futura, ya fuera de alcance en el
`CLAUDE.md` del proyecto).

## Campos

### Visibles (el "pase", siempre a la vista)

| Campo | Control | Nota |
|---|---|---|
| Origen | dropdown | ya existe (`q.cities`) |
| Destino | dropdown | ya existe (`q.tours`) |
| Pasajeros | popover con steppers: **adultos, niños, tercera edad** | reemplaza "bebés/infants" por "tercera edad/seniors" (razón: seguro más caro) |
| Días | stepper | ya existe |
| Nombre | texto | ya existe |
| Celular | `tel` | **nuevo** |
| Correo | `email` | **nuevo** |

### "Más detalles" (colapsable, colapsado por defecto, todo opcional)

- **Fechas:** toggle *¿Ya tienes fechas?*
  - No → `mes tentativo` (select de meses).
  - Sí → `salida` + `regreso` (inputs de fecha nativos).
- **Hospedaje:**
  - Categoría — chips selección única: 3★ / 4★ / 5★ / Apartamento / Sin preferencia.
  - Plan — chips selección única: Solo alojamiento / Desayuno incluido / Todo incluido.
  - Preferencias — chips multi-selección: Frente al mar / Centro de la ciudad /
    Cerca al aeropuerto + campo de texto "Otros".
- **Notas / observaciones:** textarea (al final).

## Reglas de obligatorio (mínimas)

- **Botón WhatsApp:** no exige nada. Abre `wa.me` con el mensaje pre-armado
  (la conversación ocurre en el chat).
- **Botón Correo:** exige **nombre + celular + correo** (validación inline; foco/borde
  en el primer campo faltante, expandir detalles no es necesario porque los 3 son
  visibles). Todos los campos de "detalles" son opcionales.

## Envío y flujo

- El **mensaje de WhatsApp** y el **payload de web3forms** se extienden con: pasajeros
  (adultos/niños/tercera edad), celular, correo, fechas (mes o salida/regreso),
  hospedaje (categoría, plan, preferencias/otros) y notas. **Solo se incluye lo que se
  llenó** (los campos vacíos de detalles no aparecen).
- **Flujo de correo (acordado):** web3forms entrega el formulario **al buzón de la
  agencia**, no envía un correo automático al cliente. El correo del cliente viaja
  *dentro* de ese envío para que **el asesor le mande la cotización manualmente** y le
  escriba también por WhatsApp al celular. No hay auto-envío de PDF.

## Layout

- Rejillas de 2 columnas dentro del pase (`sm:grid-cols-2`) para que crezca a lo ancho
  y no a lo alto en PC. Los campos de contacto (nombre / celular / correo) se agrupan
  en fila.
- La sección "Más detalles" colapsada mantiene la altura base ≈ la actual.
- **Móvil:** 1 columna, detalles colapsados, controles nativos (select de mes, date
  inputs) — se prioriza función sobre densidad.
- El grid externo de la sección de contacto (pase + panel de datos) no se toca.

## i18n

Se agregan llaves en **ambos** bloques `quote` (ES/EN) de `lib/content.ts`:

- `phone` (celular) y `emailField` (label del campo correo). Ojo: `email` ya existe y
  es el **botón** "Enviar al correo" — no reusar esa llave para el campo.
- `seniors` (tercera edad; EN: "Seniors").
- `more` / `moreDetails` (toggle "Más detalles").
- Fechas: `hasDates` (toggle), `month` + lista de meses, `departure`, `return`.
- Hospedaje: `hotelCategory` + opciones, `plan` + opciones, `prefs` + opciones,
  `otherPref`.
- `notes` (notas/observaciones).
- Validación: `required` (o mensajes por campo).
- Se renombra el uso de `infants` → `seniors` en el estado y en el label (ES "Tercera
  edad", EN "Seniors").

El estado del cotizador debe seguir usando **índices**, no texto, donde aplique
(patrón actual) para no perder la selección al cambiar de idioma.

## Verificación

- Enviar por WhatsApp sin llenar nada → abre chat con mensaje base.
- Enviar por Correo sin nombre/celular/correo → bloquea con validación inline.
- Llenar detalles → aparecen en el mensaje y en el payload; vacíos no aparecen.
- Cambiar ES↔EN no pierde selecciones (índices).
- Altura del pase colapsado en PC ≈ la actual; móvil usable.
