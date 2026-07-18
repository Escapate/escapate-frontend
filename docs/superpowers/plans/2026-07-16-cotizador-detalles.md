# Cotizador ampliado — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ampliar el cotizador (pase de abordar) para capturar celular, correo, tercera edad, fechas, hospedaje y notas del formato interno de la agencia, con validación por vía de envío.

**Architecture:** Un solo componente cliente `components/Cotizador.tsx` con estado local; los campos de detalle viven en una sección colapsable dentro del mismo pase. Toda la copy pasa por i18n (`lib/content.ts`, bloques `es.quote`/`en.quote`). Las selecciones se guardan por **índice** (no texto) para no perderse al cambiar de idioma. El envío arma un mensaje de WhatsApp y/o un payload de web3forms, incluyendo solo los campos llenos.

**Tech Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · lucide-react · web3forms.

## Global Constraints

- **Sin test runner en el repo** (solo `next lint`, `next build`, `tsc`). No se introduce ninguno (preferencia del usuario: tooling mínimo). Verificación de cada tarea = typecheck + lint + build + un check de comportamiento manual concreto en `npm run dev`.
- **i18n simétrico:** `type Dict = (typeof content)[Lang]` obliga a agregar cada llave nueva a **ambos** bloques `quote` (ES en `lib/content.ts:162`, EN en `lib/content.ts:303`). Asimetría = error de compilación.
- **Selecciones por índice**, no por texto (patrón existente con `cities`/`tours`).
- **Commits:** convención del repo (`feat(...)`, `chore(...)`, español). **NO** agregar trailer `Co-Authored-By` ni co-autoría de IA (regla del `escapate/CLAUDE.md`).
- **Fuera de alcance:** forma de pago, fecha, asesor(a), backend/PDF. `WEB3FORMS_KEY` está vacío hoy (TODO preexistente en `lib/content.ts:4`); no es tarea de este plan configurarlo.
- **Móvil:** 1 columna, detalles colapsados, controles nativos (`select`, `input type=date`). PC: rejillas de 2 columnas para no crecer en alto.

---

### Task 1: i18n — llaves nuevas en ambos bloques `quote`

**Files:**
- Modify: `lib/content.ts` (bloque `es.quote` ~L162-196 y `en.quote` ~L303-337)

**Interfaces:**
- Produces (consumido por todas las tareas siguientes vía `const q = c.quote`):
  `q.phone, q.emailField, q.seniors, q.more, q.notes, q.notesPh, q.hasDates, q.month, q.monthPh, q.months[], q.departure, q.returnLabel, q.lodging, q.hotel, q.hotelOptions[], q.plan, q.planOptions[], q.prefs, q.prefsOptions[], q.otherPref, q.otherPrefPh, q.required`
  y en `q.msg`: `phone, email, seniors, month, departure, ret, hotel, plan, prefs, notes`.
- Nota: `q.email` YA existe y es el **botón** "Enviar al correo" — el campo correo usa `q.emailField`. `q.infants` se elimina (ver Task 2).

- [ ] **Step 1: Crear rama de trabajo**

```bash
git checkout -b feat/cotizador-detalles
```

- [ ] **Step 2: En `es.quote`, reemplazar `infants: "Bebés",` por `seniors` y agregar las llaves escalares**

Reemplaza la línea `infants: "Bebés",` por:

```ts
      seniors: "Tercera edad",
      phone: "Celular",
      emailField: "Correo electrónico",
      more: "Más detalles (opcional)",
      notes: "Notas u observaciones",
      notesPh: "Cuéntanos cualquier detalle extra…",
      hasDates: "¿Ya tienes fechas?",
      month: "Mes tentativo",
      monthPh: "Elige un mes",
      departure: "Salida",
      returnLabel: "Regreso",
      lodging: "Hospedaje",
      hotel: "Categoría del hotel",
      plan: "Tipo de plan",
      prefs: "Preferencias",
      otherPref: "Otros",
      otherPrefPh: "Otra preferencia…",
      required: "Completa este campo",
```

- [ ] **Step 3: En `es.quote`, agregar los arrays (junto a `cities`/`tours`)**

Después de la línea de `tours: [...]` agrega:

```ts
      months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
      hotelOptions: ["3★","4★","5★","Apartamento","Sin preferencia"],
      planOptions: ["Solo alojamiento","Desayuno incluido","Todo incluido"],
      prefsOptions: ["Frente al mar","Centro de la ciudad","Cerca al aeropuerto"],
```

- [ ] **Step 4: En `es.quote.msg`, extender con las nuevas etiquetas**

Dentro del objeto `msg: { ... }` de ES, después de `name: "Nombre",` agrega:

```ts
        phone: "Celular",
        email: "Correo",
        seniors: "Tercera edad",
        month: "Mes",
        departure: "Salida",
        ret: "Regreso",
        hotel: "Hotel",
        plan: "Plan",
        prefs: "Preferencias",
        notes: "Notas",
```

- [ ] **Step 5: Repetir Steps 2-4 en `en.quote` con los valores en inglés**

Reemplaza `infants: "Infants",` por:

```ts
      seniors: "Seniors",
      phone: "Phone",
      emailField: "Email",
      more: "More details (optional)",
      notes: "Notes or comments",
      notesPh: "Tell us any extra details…",
      hasDates: "Do you have dates?",
      month: "Tentative month",
      monthPh: "Choose a month",
      departure: "Departure",
      returnLabel: "Return",
      lodging: "Lodging",
      hotel: "Hotel category",
      plan: "Plan type",
      prefs: "Preferences",
      otherPref: "Other",
      otherPrefPh: "Other preference…",
      required: "Please complete this field",
```

Arrays (tras `tours`):

```ts
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      hotelOptions: ["3★","4★","5★","Apartment","No preference"],
      planOptions: ["Room only","Breakfast included","All inclusive"],
      prefsOptions: ["Beachfront","City center","Near the airport"],
```

`msg` (tras `name: "Name",`):

```ts
        phone: "Phone",
        email: "Email",
        seniors: "Seniors",
        month: "Month",
        departure: "Departure",
        ret: "Return",
        hotel: "Hotel",
        plan: "Plan",
        prefs: "Preferences",
        notes: "Notes",
```

- [ ] **Step 6: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: **Error esperado** en `components/Cotizador.tsx` porque aún referencia `q.infants` / `setInfants` (se arregla en Task 2). NO debe haber error dentro de `lib/content.ts` (ambos bloques simétricos). Si aparece un error en `content.ts` del tipo "Property X is missing in type", falta una llave en un idioma — corrige.

- [ ] **Step 7: Commit**

```bash
git add lib/content.ts
git commit -m "feat(i18n): llaves del cotizador ampliado (contacto, fechas, hospedaje, notas)"
```

---

### Task 2: Pasajeros — tercera edad en vez de bebés

**Files:**
- Modify: `components/Cotizador.tsx`

**Interfaces:**
- Consumes: `q.seniors` (Task 1).
- Produces: estado `seniors`/`setSeniors`; `total` y `paxParts` incluyen tercera edad.

- [ ] **Step 1: Renombrar el estado `infants` → `seniors`**

En `components/Cotizador.tsx:126` reemplaza:

```tsx
  const [infants, setInfants] = useState(0);
```
por:
```tsx
  const [seniors, setSeniors] = useState(0);
```

- [ ] **Step 2: Actualizar `total` y `paxParts`** (`components/Cotizador.tsx:142-149`)

```tsx
  const total = adults + children + seniors;
  const paxParts = [
    `${adults} ${q.adults}`,
    children > 0 ? `${children} ${q.children}` : null,
    seniors > 0 ? `${seniors} ${q.seniors}` : null,
  ]
    .filter(Boolean)
    .join(", ");
```

- [ ] **Step 3: Actualizar la fila del popover de pasajeros** (`components/Cotizador.tsx:289-292`)

```tsx
                  { label: q.adults, value: adults, set: setAdults, min: 1 },
                  { label: q.children, value: children, set: setChildren, min: 0 },
                  { label: q.seniors, value: seniors, set: setSeniors, min: 0 },
```

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS (ya no hay refs a `infants`).
Manual (`npm run dev` → sección Contacto → abrir "Pasajeros"): la tercera fila dice **Tercera edad**; subirla refleja el conteo en el total y en el talón/resumen.

- [ ] **Step 5: Commit**

```bash
git add components/Cotizador.tsx
git commit -m "feat(Cotizador): reemplaza bebés por tercera edad (afecta seguro)"
```

---

### Task 3: Contacto — campos Celular y Correo (visibles)

**Files:**
- Modify: `components/Cotizador.tsx`

**Interfaces:**
- Consumes: `q.phone`, `q.emailField`, `q.required` (Task 1).
- Produces: estado `phone`/`setPhone`, `email`/`setEmail`, `errors`/`setErrors`; helper `inputCls(hasError)`.

- [ ] **Step 1: Agregar estado** (junto a `const [name, setName] = useState("");`, `components/Cotizador.tsx:128`)

```tsx
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
```

- [ ] **Step 2: Agregar helper de clases de input** (antes del `return`, junto a otros helpers dentro del componente)

```tsx
  const inputCls = (bad?: boolean) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-navy-900 outline-none transition placeholder:text-navy-900/35 focus:ring-2 ${
      bad
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-navy-900/15 focus:border-orange focus:ring-orange/30"
    }`;
```

- [ ] **Step 3: Sustituir el input de nombre y añadir celular + correo** (`components/Cotizador.tsx:317-323`)

Reemplaza el bloque `{/* Nombre */}` y su `<input>` por:

```tsx
        {/* Contacto: nombre / celular / correo */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={q.name}
              className={inputCls(errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{q.required}</p>}
          </div>
          <div>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={q.phone}
              className={inputCls(errors.phone)}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{q.required}</p>}
          </div>
          <div>
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={q.emailField}
              className={inputCls(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{q.required}</p>}
          </div>
        </div>
```

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
Manual: aparecen 3 campos (nombre a lo ancho; celular y correo en 2 columnas en PC, apilados en móvil). Se puede escribir en los tres.

- [ ] **Step 5: Commit**

```bash
git add components/Cotizador.tsx
git commit -m "feat(Cotizador): campos celular y correo del cliente"
```

---

### Task 4: "Más detalles" colapsable + Notas + Fechas

**Files:**
- Modify: `components/Cotizador.tsx`

**Interfaces:**
- Consumes: `q.more, q.notes, q.notesPh, q.hasDates, q.month, q.monthPh, q.months, q.departure, q.returnLabel` (Task 1).
- Produces: estado `open`, `notes`, `hasDates`, `monthIdx`, `departure`, `depReturn`. `monthIdx: number | null`.

- [ ] **Step 1: Importar iconos** (añadir a la import de `lucide-react`, `components/Cotizador.tsx:8-18`)

Agrega `ChevronRight` y `StickyNote` a la lista de imports existente.

- [ ] **Step 2: Agregar estado** (junto al resto de `useState`)

```tsx
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [hasDates, setHasDates] = useState(false);
  const [monthIdx, setMonthIdx] = useState<number | null>(null);
  const [departure, setDeparture] = useState("");
  const [depReturn, setDepReturn] = useState("");
```

- [ ] **Step 3: Insertar la sección colapsable** — va **después** del bloque del talón/resumen (`components/Cotizador.tsx:326-339`, el `<div class="mt-4 rounded-xl ...">`) y **antes** del cierre `</div>` de la zona de campos (antes del `<Perf .../>`).

```tsx
        {/* Más detalles (opcional) */}
        <div className="mt-4 border-t border-navy-900/10 pt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-navy-900/60 transition hover:text-orange"
          >
            <ChevronRight className={`h-4 w-4 transition ${open ? "rotate-90" : ""}`} />
            {q.more}
          </button>

          {open && (
            <div className="mt-4 grid gap-4">
              {/* Fechas */}
              <div>
                <label className="flex cursor-pointer items-center justify-between">
                  <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.hasDates}
                  </FieldLabel>
                  <input
                    type="checkbox"
                    checked={hasDates}
                    onChange={(e) => setHasDates(e.target.checked)}
                    className="h-4 w-4 accent-orange"
                  />
                </label>
                {hasDates ? (
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-500" />}>
                        {q.departure}
                      </FieldLabel>
                      <input
                        type="date"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        className={inputCls()}
                      />
                    </div>
                    <div>
                      <FieldLabel icon={<CalendarDays className="h-3.5 w-3.5 text-orange-500" />}>
                        {q.returnLabel}
                      </FieldLabel>
                      <input
                        type="date"
                        value={depReturn}
                        onChange={(e) => setDepReturn(e.target.value)}
                        className={inputCls()}
                      />
                    </div>
                  </div>
                ) : (
                  <select
                    value={monthIdx ?? ""}
                    onChange={(e) => setMonthIdx(e.target.value === "" ? null : Number(e.target.value))}
                    className={`mt-2 ${inputCls()}`}
                  >
                    <option value="">{q.monthPh}</option>
                    {q.months.map((mo, i) => (
                      <option key={mo} value={i}>{mo}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Notas */}
              <div>
                <FieldLabel icon={<StickyNote className="h-3.5 w-3.5 text-orange-500" />}>
                  {q.notes}
                </FieldLabel>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={q.notesPh}
                  rows={3}
                  className={`${inputCls()} resize-none`}
                />
              </div>
            </div>
          )}
        </div>
```

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
Manual: "Más detalles" arranca colapsado (altura base ≈ la de antes). Al abrir: el checkbox alterna entre `select` de mes y dos date inputs; el textarea de notas funciona. En móvil los controles son nativos.

- [ ] **Step 5: Commit**

```bash
git add components/Cotizador.tsx
git commit -m "feat(Cotizador): sección Más detalles colapsable con fechas y notas"
```

---

### Task 5: Hospedaje — chips (categoría, plan, preferencias, otros)

**Files:**
- Modify: `components/Cotizador.tsx`

**Interfaces:**
- Consumes: `q.lodging, q.hotel, q.hotelOptions, q.plan, q.planOptions, q.prefs, q.prefsOptions, q.otherPref, q.otherPrefPh` (Task 1).
- Produces: componente interno `Chips`; estado `hotelIdx`, `planIdx`, `prefsIdx`, `otherPref`.

- [ ] **Step 1: Agregar el componente `Chips`** (a nivel de módulo, junto a `Stepper`/`Options`, `components/Cotizador.tsx:77`)

```tsx
function Chips({
  options,
  isActive,
  onPick,
}: {
  options: readonly string[];
  isActive: (i: number) => boolean;
  onPick: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={isActive(i)}
          onClick={() => onPick(i)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            isActive(i)
              ? "border-orange bg-orange/15 text-orange-600"
              : "border-navy-900/15 text-navy-900/80 hover:border-navy-900/30"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Agregar estado** (junto al resto de `useState`)

```tsx
  const [hotelIdx, setHotelIdx] = useState<number | null>(null);
  const [planIdx, setPlanIdx] = useState<number | null>(null);
  const [prefsIdx, setPrefsIdx] = useState<number[]>([]);
  const [otherPref, setOtherPref] = useState("");
```

- [ ] **Step 3: Insertar el bloque Hospedaje** dentro del `{open && (...)}` de la Task 4, **entre** el bloque de Fechas y el de Notas.

```tsx
              {/* Hospedaje */}
              <div className="grid gap-3">
                <div>
                  <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.hotel}
                  </FieldLabel>
                  <Chips
                    options={q.hotelOptions}
                    isActive={(i) => i === hotelIdx}
                    onPick={(i) => setHotelIdx((cur) => (cur === i ? null : i))}
                  />
                </div>
                <div>
                  <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.plan}
                  </FieldLabel>
                  <Chips
                    options={q.planOptions}
                    isActive={(i) => i === planIdx}
                    onPick={(i) => setPlanIdx((cur) => (cur === i ? null : i))}
                  />
                </div>
                <div>
                  <FieldLabel icon={<MapPin className="h-3.5 w-3.5 text-orange-500" />}>
                    {q.prefs}
                  </FieldLabel>
                  <Chips
                    options={q.prefsOptions}
                    isActive={(i) => prefsIdx.includes(i)}
                    onPick={(i) =>
                      setPrefsIdx((cur) =>
                        cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]
                      )
                    }
                  />
                  <input
                    value={otherPref}
                    onChange={(e) => setOtherPref(e.target.value)}
                    placeholder={q.otherPrefPh}
                    className={`mt-2 ${inputCls()}`}
                  />
                </div>
              </div>
```

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
Manual: en "Más detalles" aparecen 3 grupos de chips. Categoría y Plan son de selección única (clic de nuevo deselecciona); Preferencias acumula varias; "Otros" es texto libre.

- [ ] **Step 5: Commit**

```bash
git add components/Cotizador.tsx
git commit -m "feat(Cotizador): hospedaje (categoría, plan, preferencias) con chips"
```

---

### Task 6: Envío — mensaje + payload extendidos y validación por vía

**Files:**
- Modify: `components/Cotizador.tsx`

**Interfaces:**
- Consumes: todo el estado de Tasks 2-5 y `q.msg.*` (Task 1).
- Produces: `message` con líneas condicionales; `validateEmail()`; `onEmail` valida antes de enviar.

- [ ] **Step 1: Reemplazar el armado del `message`** (`components/Cotizador.tsx:151-156`)

```tsx
  const m = q.msg;
  const lines: string[] = [
    m.intro,
    `• ${m.from}: ${from}`,
    `• ${m.dest}: ${dest}`,
    `• ${m.pax}: ${paxParts}`,
    `• ${m.days}: ${days}`,
  ];
  if (name) lines.push(`• ${m.name}: ${name}`);
  if (phone) lines.push(`• ${m.phone}: ${phone}`);
  if (email) lines.push(`• ${m.email}: ${email}`);
  if (hasDates) {
    if (departure) lines.push(`• ${m.departure}: ${departure}`);
    if (depReturn) lines.push(`• ${m.ret}: ${depReturn}`);
  } else if (monthIdx !== null) {
    lines.push(`• ${m.month}: ${q.months[monthIdx]}`);
  }
  if (hotelIdx !== null) lines.push(`• ${m.hotel}: ${q.hotelOptions[hotelIdx]}`);
  if (planIdx !== null) lines.push(`• ${m.plan}: ${q.planOptions[planIdx]}`);
  const prefsList = [...prefsIdx.map((i) => q.prefsOptions[i]), otherPref].filter(Boolean);
  if (prefsList.length) lines.push(`• ${m.prefs}: ${prefsList.join(", ")}`);
  if (notes) lines.push(`• ${m.notes}: ${notes}`);
  const message = lines.join("\n");
```

- [ ] **Step 2: Agregar `validateEmail` y ajustar `onEmail`** (`components/Cotizador.tsx:162-188`)

```tsx
  function validateEmail() {
    const e: Record<string, boolean> = {};
    if (!name.trim()) e.name = true;
    if (!phone.trim()) e.phone = true;
    if (!email.trim() || !email.includes("@")) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onEmail() {
    if (!validateEmail()) return;
    if (!WEB3FORMS_KEY) {
      onWhatsApp();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Nueva cotización · Escápate",
          name,
          celular: phone,
          correo: email,
          salida: from,
          destino: dest,
          pasajeros: paxParts,
          dias: days,
          fechas: hasDates ? `${departure} → ${depReturn}` : (monthIdx !== null ? q.months[monthIdx] : ""),
          hotel: hotelIdx !== null ? q.hotelOptions[hotelIdx] : "",
          plan: planIdx !== null ? q.planOptions[planIdx] : "",
          preferencias: prefsList.join(", "),
          notas: notes,
          message,
        }),
      });
      const j = await res.json();
      setStatus(j.success ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }
```

- [ ] **Step 3: Limpiar errores al escribir** — para que el borde rojo desaparezca al corregir. En los `onChange` de nombre/celular/correo (Task 3, Step 3) envuelve el set con limpieza del error. Ejemplo para nombre:

```tsx
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: false })); }}
```
Aplica el mismo patrón a `phone` (`errors.phone`) y `email` (`errors.email`).

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS (build completa).
Manual (`npm run dev`):
  1. Botón **WhatsApp** sin llenar nada → abre `wa.me` con el mensaje base (salida/destino/pasajeros/días).
  2. Botón **Correo** con nombre/celular/correo vacíos → NO envía; bordes rojos + "Completa este campo" bajo los 3.
  3. Llenar los 3 + algunos detalles → WhatsApp muestra las líneas extra; el correo empaqueta los campos (con `WEB3FORMS_KEY` vacío hace fallback a WhatsApp, comportamiento esperado hoy).
  4. Cambiar ES↔EN (toggle de idioma) no pierde selecciones de chips/mes.

- [ ] **Step 5: Commit**

```bash
git add components/Cotizador.tsx
git commit -m "feat(Cotizador): mensaje y payload con todos los campos + validación de correo"
```

---

## Notas de cierre

- Al terminar, decidir integración con la skill `superpowers:finishing-a-development-branch` (merge a `main` / PR). Recordar: sin trailer de co-autoría.
- `WEB3FORMS_KEY` sigue vacío: el envío real por correo requiere pegar la key en `lib/content.ts:4` (fuera de este plan).
- El `.docx` de referencia permanece ignorado (`.git/info/exclude`).
