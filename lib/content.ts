export const WHATSAPP_NUMBER = "573102108900"; // +57 310 210 8900
export const INSTAGRAM = "escapate.cuc";
export const EMAIL = "reservas@escapate.tours";
export const WEB3FORMS_KEY = ""; // TODO: pega tu access key de https://web3forms.com

/** Enlace de WhatsApp con un mensaje opcional prellenado. */
export function waLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Deep link de Google Maps para "Cómo llegar" (abre el pin del local).
 * Distinto de BUSINESS.maps, que alimenta el `hasMap` del JSON-LD.
 */
export const MAPS_DIRECTIONS_URL = "https://maps.app.goo.gl/YnDfD9VLLPeg2bBYA";

/**
 * Datos del negocio — fuente única de verdad para el structured data (SEO local)
 * y para la UI (NAP visible). Que el JSON-LD y lo que se ve en la página coincidan
 * es justo lo que Google premia para el negocio local / Google Maps.
 */
export const BUSINESS = {
  name: "Escápate",
  legalName: "Escápate · Agencia de Viajes",
  url: "https://escapate.tours",
  // Email de contacto público (el formulario del sitio enruta a EMAIL / reservas@).
  email: "hola@escapate.tours",
  phone: "+573102108900",
  priceRange: "$$",
  currency: "COP",
  address: {
    street: "Local 2, Autopista Internacional Vía Antigua Boconó K1-046",
    locality: "Cúcuta",
    region: "Norte de Santander",
    country: "CO",
    // Cadena lista para mostrar (NAP visible == structured data).
    full: "Local 2, Autopista Internacional Vía Antigua Boconó K1-046, Cúcuta, Norte de Santander",
  },
  // Coordenadas del pin (opcional). Mantén presionado el pin en Google Maps para
  // copiarlas y ponlas aquí como { lat, lng }; el pin real ya lo da tu Google
  // Business verificado, así que esto solo lo refuerza.
  geo: null as { lat: number; lng: number } | null,
  maps: "https://share.google/4xzchCjiY6NQzaqlN",
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "18:00",
  },
  sameAs: [`https://www.instagram.com/${INSTAGRAM}`],
  logo: "/logo/escapate-transparent.png",
  photos: ["/renders/local-reception.jpg", "/renders/local-lounge.jpg"],
};

export const content = {
  es: {
    wa: { hello: "¡Hola! Quisiera información sobre sus planes de viaje." },
    nav: {
      links: [
        { id: "destinos", label: "Destinos" },
        { id: "nosotros", label: "Nosotros" },
        { id: "servicios", label: "Servicios" },
        { id: "contacto", label: "Contacto" },
      ],
      cta: "Cotizar",
      skip: "Saltar al contenido",
    },
    hero: {
      eyebrow: "Agencia de viajes · Cúcuta",
      titleA: "Tu viaje",
      titleB: "empieza",
      titleAccent: "aquí",
      subtitle:
        "Gira el mundo, elige un destino y nosotros armamos la escapada completa. Vuelos, hoteles y planes pensados a tu medida.",
      ctaPrimary: "Planear mi viaje",
      ctaSecondary: "Explorar destinos",
      dragHint: "arrastra para girar el mundo",
      passenger: "Pasajero",
      route: "Cúcuta → el mundo",
    },
    destinos: {
      eyebrow: "Destinos",
      title: "A dónde te llevamos",
      note: "Precios de referencia por persona. Cuéntanos tus fechas y armamos el plan exacto.",
      groups: { colombia: "Colombia", internacional: "Internacional" },
      items: [
        { group: "colombia", name: "Cartagena", region: "Caribe colombiano", nights: "4 noches", price: "desde $890.000", img: "/destinos/cartagena.jpg" },
        { group: "colombia", name: "San Andrés", region: "Mar de siete colores", nights: "5 noches", price: "desde $1.250.000", img: "/destinos/san-andres.jpg" },
        { group: "colombia", name: "Santa Marta", region: "Tayrona y Caribe", nights: "4 noches", price: "desde $760.000", img: "/destinos/santa-marta.jpg" },
        { group: "colombia", name: "Eje Cafetero", region: "Valle de Cocora", nights: "3 noches", price: "desde $640.000", img: "/destinos/eje-cafetero.jpg" },
        { group: "internacional", name: "Cancún", region: "Riviera Maya", nights: "6 noches", price: "desde $3.100.000", img: "/destinos/cancun.jpg" },
        { group: "internacional", name: "Punta Cana", region: "Caribe", nights: "6 noches", price: "desde $3.400.000", img: "/destinos/punta-cana.jpg" },
        { group: "internacional", name: "España", region: "Madrid · Sevilla", nights: "8 noches", price: "desde $5.400.000", img: "/destinos/espana.jpg" },
        { group: "internacional", name: "Europa", region: "París · multidestino", nights: "10 noches", price: "desde $7.200.000", img: "/destinos/europa.jpg" },
      ],
    },
    about: {
      eyebrow: "Quiénes somos",
      title: "No vendemos viajes. Diseñamos recuerdos.",
      body: "Somos un equipo de Cúcuta apasionado por viajar. Creemos en el trato cercano: te escuchamos, entendemos cómo sueñas tu escapada y nos encargamos de cada detalle para que tú solo te preocupes por disfrutar.",
      stats: [
        { n: "+10", label: "años de experiencia" },
        { n: "+40", label: "destinos" },
        { n: "100%", label: "acompañamiento" },
      ],
    },
    services: {
      eyebrow: "Lo que hacemos por ti",
      title: "Todo en un solo lugar",
      items: [
        { title: "Paquetes a tu medida", desc: "Vuelo, hotel, traslados y planes en una sola cotización clara." },
        { title: "Asesoría experta", desc: "Te guiamos paso a paso, desde la idea hasta la maleta lista." },
        { title: "Soporte total", desc: "Acompañamiento antes, durante y después de tu viaje." },
        { title: "Lunas de miel y grupos", desc: "Experiencias especiales para parejas, familias y empresas." },
      ],
    },
    why: {
      eyebrow: "Por qué Escápate",
      title: "Viajar tranquilo se siente distinto",
      board: "Tablero de salidas",
      onTime: "A tiempo",
      points: [
        "Atención personalizada, cara a cara o por WhatsApp.",
        "Precios transparentes, sin sorpresas de último minuto.",
        "Aliados confiables en aerolíneas y hoteles.",
        "Planes flexibles que se adaptan a tu presupuesto.",
      ],
    },
    gallery: {
      eyebrow: "El local",
      title: "Ven a soñar tu viaje en persona",
      body: "Un espacio pensado para inspirarte. Te esperamos en el centro de Cúcuta.",
      directions: "Cómo llegar",
    },
    testimonials: {
      eyebrow: "Lo que dicen",
      title: "Viajeros que ya se escaparon",
      items: [
        { quote: "Nos armaron la luna de miel perfecta. Cada detalle salió tal como lo soñamos.", name: "Laura & Andrés", role: "Cancún 2025" },
        { quote: "Súper atentos por WhatsApp a cualquier hora. Viajé tranquila y sin estrés.", name: "Daniela M.", role: "España 2025" },
        { quote: "Mejor precio que buscando por mi cuenta, y con todo resuelto. Repetiré.", name: "Carlos R.", role: "San Andrés 2024" },
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "¿Listo para volar?",
      subtitle: "Escríbenos por WhatsApp o déjanos tus datos y te contactamos hoy mismo.",
      whatsapp: "Hablar por WhatsApp",
      form: {
        name: "Tu nombre",
        email: "Correo electrónico",
        destination: "¿A dónde quieres ir?",
        message: "Cuéntanos más (fechas, personas...)",
        submit: "Enviar solicitud",
        sending: "Enviando...",
        ok: "¡Gracias! Te contactaremos muy pronto.",
        err: "Algo salió mal. Escríbenos por WhatsApp.",
      },
      address: BUSINESS.address.full,
      hours: "Lun a Sáb · 8:00 a.m. – 6:00 p.m.",
    },
    quote: {
      eyebrow: "Cotiza tu viaje",
      title: "Arma tu escapada",
      from: "Ciudad de salida",
      dest: "Destino / Tour",
      passengers: "Pasajeros",
      adults: "Adultos",
      children: "Niños",
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
      otherPrefPh: "Otra preferencia…",
      required: "Completa este campo",
      days: "Días",
      daysUnit: "días",
      name: "Tu nombre",
      people: "personas",
      whatsapp: "Cotizar por WhatsApp",
      email: "Enviar al correo",
      ok: "¡Gracias! Te enviaremos la cotización muy pronto.",
      err: "Algo salió mal. Escríbenos por WhatsApp.",
      cities: ["Cúcuta", "Bogotá", "Medellín", "Cali", "Bucaramanga", "Otra ciudad"],
      tours: ["Cartagena", "San Andrés", "Santa Marta", "Eje Cafetero", "Cancún", "Punta Cana", "Panamá", "España", "Europa", "Aún no lo decido"],
      months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
      hotelOptions: ["3★","4★","5★","Apartamento","Sin preferencia"],
      planOptions: ["Solo alojamiento","Desayuno incluido","Todo incluido"],
      prefsOptions: ["Frente al mar","Centro de la ciudad","Cerca al aeropuerto"],
      msg: {
        intro: "Hola, quiero cotizar un viaje:",
        from: "Salida",
        dest: "Destino",
        pax: "Pasajeros",
        days: "Días",
        name: "Nombre",
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
      },
    },
    footer: {
      tagline: "Tu viaje empieza aquí.",
      rights: "Todos los derechos reservados.",
      madeIn: "Hecho con cariño en Cúcuta.",
    },
  },

  en: {
    wa: { hello: "Hi! I'd like information about your travel plans." },
    nav: {
      links: [
        { id: "destinos", label: "Destinations" },
        { id: "nosotros", label: "About" },
        { id: "servicios", label: "Services" },
        { id: "contacto", label: "Contact" },
      ],
      cta: "Get a quote",
      skip: "Skip to content",
    },
    hero: {
      eyebrow: "Travel agency · Cúcuta",
      titleA: "Your journey",
      titleB: "starts",
      titleAccent: "here",
      subtitle:
        "Spin the globe, pick a destination and we'll handle the whole escape. Flights, hotels and plans tailored to you.",
      ctaPrimary: "Plan my trip",
      ctaSecondary: "Explore destinations",
      dragHint: "drag to spin the globe",
      passenger: "Passenger",
      route: "Cúcuta → the world",
    },
    destinos: {
      eyebrow: "Destinations",
      title: "Where we take you",
      note: "Reference prices per person. Tell us your dates and we'll build the exact plan.",
      groups: { colombia: "Colombia", internacional: "International" },
      items: [
        { group: "colombia", name: "Cartagena", region: "Colombian Caribbean", nights: "4 nights", price: "from $890,000", img: "/destinos/cartagena.jpg" },
        { group: "colombia", name: "San Andrés", region: "Seven-color sea", nights: "5 nights", price: "from $1,250,000", img: "/destinos/san-andres.jpg" },
        { group: "colombia", name: "Santa Marta", region: "Tayrona & Caribbean", nights: "4 nights", price: "from $760,000", img: "/destinos/santa-marta.jpg" },
        { group: "colombia", name: "Coffee Region", region: "Cocora Valley", nights: "3 nights", price: "from $640,000", img: "/destinos/eje-cafetero.jpg" },
        { group: "internacional", name: "Cancún", region: "Riviera Maya", nights: "6 nights", price: "from $3,100,000", img: "/destinos/cancun.jpg" },
        { group: "internacional", name: "Punta Cana", region: "Caribbean", nights: "6 nights", price: "from $3,400,000", img: "/destinos/punta-cana.jpg" },
        { group: "internacional", name: "Spain", region: "Madrid · Seville", nights: "8 nights", price: "from $5,400,000", img: "/destinos/espana.jpg" },
        { group: "internacional", name: "Europe", region: "Paris · multi-city", nights: "10 nights", price: "from $7,200,000", img: "/destinos/europa.jpg" },
      ],
    },
    about: {
      eyebrow: "About us",
      title: "We don't sell trips. We design memories.",
      body: "We're a team from Cúcuta who love to travel. We believe in a personal touch: we listen, understand how you dream your escape, and take care of every detail so all you have to do is enjoy.",
      stats: [
        { n: "+10", label: "years of experience" },
        { n: "+40", label: "destinations" },
        { n: "100%", label: "support" },
      ],
    },
    services: {
      eyebrow: "What we do for you",
      title: "Everything in one place",
      items: [
        { title: "Tailor-made packages", desc: "Flight, hotel, transfers and plans in one clear quote." },
        { title: "Expert advice", desc: "We guide you step by step, from the idea to a packed suitcase." },
        { title: "Full support", desc: "We're with you before, during and after your trip." },
        { title: "Honeymoons & groups", desc: "Special experiences for couples, families and companies." },
      ],
    },
    why: {
      eyebrow: "Why Escápate",
      title: "Traveling with peace of mind feels different",
      board: "Departures board",
      onTime: "On time",
      points: [
        "Personal attention, face to face or over WhatsApp.",
        "Transparent prices, no last-minute surprises.",
        "Trusted airline and hotel partners.",
        "Flexible plans that fit your budget.",
      ],
    },
    gallery: {
      eyebrow: "Our space",
      title: "Come dream your trip in person",
      body: "A space made to inspire you. Come see us in downtown Cúcuta.",
      directions: "Get directions",
    },
    testimonials: {
      eyebrow: "What they say",
      title: "Travelers who already escaped",
      items: [
        { quote: "They built the perfect honeymoon. Every detail turned out just as we dreamed.", name: "Laura & Andrés", role: "Cancún 2025" },
        { quote: "Super responsive on WhatsApp at any hour. I traveled relaxed and stress-free.", name: "Daniela M.", role: "Spain 2025" },
        { quote: "Better price than booking on my own, with everything sorted. I'll be back.", name: "Carlos R.", role: "San Andrés 2024" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Ready to fly?",
      subtitle: "Message us on WhatsApp or leave your details and we'll reach out today.",
      whatsapp: "Chat on WhatsApp",
      form: {
        name: "Your name",
        email: "Email address",
        destination: "Where do you want to go?",
        message: "Tell us more (dates, people...)",
        submit: "Send request",
        sending: "Sending...",
        ok: "Thank you! We'll contact you very soon.",
        err: "Something went wrong. Message us on WhatsApp.",
      },
      address: BUSINESS.address.full,
      hours: "Mon to Sat · 8:00 a.m. – 6:00 p.m.",
    },
    quote: {
      eyebrow: "Get a quote",
      title: "Build your escape",
      from: "Departure city",
      dest: "Destination / Tour",
      passengers: "Passengers",
      adults: "Adults",
      children: "Children",
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
      otherPrefPh: "Other preference…",
      required: "Please complete this field",
      days: "Days",
      daysUnit: "days",
      name: "Your name",
      people: "people",
      whatsapp: "Quote on WhatsApp",
      email: "Send by email",
      ok: "Thank you! We'll send your quote very soon.",
      err: "Something went wrong. Message us on WhatsApp.",
      cities: ["Cúcuta", "Bogotá", "Medellín", "Cali", "Bucaramanga", "Other city"],
      tours: ["Cartagena", "San Andrés", "Santa Marta", "Coffee Region", "Cancún", "Punta Cana", "Panama", "Spain", "Europe", "Not sure yet"],
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      hotelOptions: ["3★","4★","5★","Apartment","No preference"],
      planOptions: ["Room only","Breakfast included","All inclusive"],
      prefsOptions: ["Beachfront","City center","Near the airport"],
      msg: {
        intro: "Hi, I'd like a quote for a trip:",
        from: "Departure",
        dest: "Destination",
        pax: "Passengers",
        days: "Days",
        name: "Name",
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
      },
    },
    footer: {
      tagline: "Your journey starts here.",
      rights: "All rights reserved.",
      madeIn: "Made with love in Cúcuta.",
    },
  },
} as const;

export type Lang = keyof typeof content;
export type Dict = (typeof content)[Lang];
