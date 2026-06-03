// SPOTLIGHT - Seed Data & Mock Database

const DEFAULT_SPACES = [
  {
    id: "space-1",
    name: "Glass Pavilion Alto Prado",
    type: "salon",
    category: "Eventos & Salones",
    price: 350000, // COP per hour
    currency: "COP",
    rating: 4.9,
    reviewsCount: 24,
    capacity: 150,
    address: "Cra. 53 #82-102, Alto Prado, Barranquilla",
    lat: 11.0084,
    lng: -74.8118,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Un salón espectacular con paredes de cristal templado de piso a techo, ideal para bodas, eventos corporativos de alto nivel y lanzamientos. Cuenta con climatización centralizada de última generación, acústica profesional y una vista inigualable a los jardines de Alto Prado.",
    amenities: ["Vista al río", "Cocina", "Wifi", "Aire acondicionado", "Sonido Profesional", "Detector de humo", "Accesibilidad"],
    missingAmenities: ["Piscina", "Lavadora", "Detector de monóxido de carbono"],
    host: {
      name: "Andrés Mendoza",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "Super Anfitrión",
      phone: "+57 300 456 7890",
      rating: 4.95
    },
    logisticsOption: "both", // own, spotlight, both
    logisticsDescription: "El anfitrión ofrece su propia logística básica (mesas, sillas). También puedes contratar a Spotlight Events para la organización integral, decoración premium y coordinación del evento.",
    reviews: [
      { user: "María Camila G.", rating: 5, comment: "El lugar es de ensueño. La acústica y las luces hicieron que nuestra boda fuera mágica. ¡Súper recomendado!", date: "2026-05-12" },
      { user: "Juan Sebastián P.", rating: 4.8, comment: "Excelente ubicación y atención. Estacionamiento amplio y seguridad impecable.", date: "2026-04-30" }
    ],
    views: 450,
    bookingsCount: 18,
    status: "active"
  },
  {
    id: "space-2",
    name: "Estadio de Arena Camp Nou (Sintética F11)",
    type: "cancha",
    category: "Deportes & Canchas",
    price: 120000, // COP per hour
    currency: "COP",
    rating: 4.7,
    reviewsCount: 56,
    capacity: 22, // F11
    address: "Calle 98 #65-15, Riomar, Barranquilla",
    lat: 11.0210,
    lng: -74.8250,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Gramado sintético profesional de última tecnología (Shock Pad aprobado por FIFA) para fútbol 11. Cuenta con iluminación LED de alta potencia para partidos nocturnos, gradería cubierta para 100 espectadores, vestidores con ducha de agua fría y parqueadero vigilado.",
    amenities: ["Wifi", "Estacionamiento", "Duchas", "Bebidas disponibles", "Iluminación Nocturna", "Gradería"],
    missingAmenities: ["Cocina", "Piscina", "Aire acondicionado", "Detector de humo"],
    host: {
      name: "Brayan Sainea (Sagan)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      role: "Propietario / Spotlight Admin",
      phone: "+57 301 789 4512",
      rating: 4.88
    },
    logisticsOption: "own",
    logisticsDescription: "Espacio administrado directamente. Cuenta con árbitros y petos incluidos si los solicitas. WhatsApp directo disponible para reservas recurrentes corporativas.",
    reviews: [
      { user: "Carlos A.", rating: 5, comment: "La mejor cancha sintética de Quilla. No quema los pies y la iluminación de noche es espectacular.", date: "2026-05-25" },
      { user: "Esteban R.", rating: 4, comment: "Muy buena, solo que los fines de semana se llena rápido. Hay que reservar con tiempo.", date: "2026-05-18" }
    ],
    views: 820,
    bookingsCount: 42,
    status: "active"
  },
  {
    id: "space-3",
    name: "Rooftop 360 Miramar",
    type: "espacio",
    category: "Eventos & Salones",
    price: 450000, // COP per hour
    currency: "COP",
    rating: 4.95,
    reviewsCount: 38,
    capacity: 80,
    address: "Cra. 42F #99-88, Miramar, Barranquilla",
    lat: 11.0156,
    lng: -74.8312,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Una espectacular terraza con vista de 360 grados sobre toda Barranquilla y el río Magdalena. Cuenta con piscina de borde infinito, barra de bar profesional tipo lounge y un diseño arquitectónico premium. Ideal para fiestas de cumpleaños, aniversarios y eventos de Networking.",
    amenities: ["Vista al río", "Cocina", "Wifi", "Piscina", "Aire acondicionado", "Se permiten mascotas", "Barra de Bar", "Sonido Bose"],
    missingAmenities: ["Lavadora", "Detector de monóxido de carbono", "Detector de humo"],
    host: {
      name: "Valeria Santamaría",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      role: "Super Anfitrión",
      phone: "+57 312 987 6543",
      rating: 5.0
    },
    logisticsOption: "spotlight",
    logisticsDescription: "Este lugar requiere la contratación obligatoria de la logística premium de Spotlight Events para garantizar el cuidado de la piscina de borde infinito y las instalaciones de lujo.",
    reviews: [
      { user: "Diana M.", rating: 5, comment: "La vista es de otro mundo. La piscina iluminada y la logística de Spotlight Events hicieron todo sumamente fácil. Valioso cada peso.", date: "2026-05-29" }
    ],
    views: 610,
    bookingsCount: 22,
    status: "active"
  },
  {
    id: "space-4",
    name: "Casona Colonial El Prado",
    type: "salon",
    category: "Eventos & Salones",
    price: 280000, // COP per hour
    currency: "COP",
    rating: 4.8,
    reviewsCount: 15,
    capacity: 200,
    address: "Cra. 54 #70-45, El Prado, Barranquilla",
    lat: 10.9982,
    lng: -74.7990,
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Una mansión histórica restaurada en el corazón del exclusivo barrio El Prado. Posee amplios jardines tropicales, techos de doble altura con vigas de madera noble y un patio central de estilo andaluz. Perfecta para exposiciones de arte, desfiles de moda y bodas de época.",
    amenities: ["Cocina", "Wifi", "Aire acondicionado", "Patio Andaluz", "Jardines", "Detector de humo", "Detector de monóxido de carbono"],
    missingAmenities: ["Vista al río", "Piscina", "TV", "Lavadora"],
    host: {
      name: "Ricardo Silva",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      role: "Anfitrión Verificado",
      phone: "+57 315 555 4321",
      rating: 4.75
    },
    logisticsOption: "both",
    logisticsDescription: "Puedes usar tus proveedores o contratar a Spotlight Events. Disponemos de rampas y camerinos para artistas.",
    reviews: [
      { user: "Alejandro B.", rating: 5, comment: "Un monumento viviente. Espacios amplios y aire acondicionado perfecto en las salas interiores.", date: "2026-04-15" }
    ],
    views: 310,
    bookingsCount: 9,
    status: "active"
  },
  {
    id: "space-5",
    name: "Spotlight Sport Arena F5",
    type: "cancha",
    category: "Deportes & Canchas",
    price: 70000,
    currency: "COP",
    rating: 4.6,
    reviewsCount: 88,
    capacity: 10, // F5
    address: "Calle 84 #46-72, Riomar, Barranquilla",
    lat: 11.0112,
    lng: -74.8188,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Cancha sintética de fútbol 5 techada para evitar el sol barranquillero o la lluvia. Grama italiana de 50mm, mallas de seguridad, tablero de marcador electrónico y servicio de cafetería. Es perfecta para torneos rápidos entre amigos o eventos de cumpleaños deportivos.",
    amenities: ["Wifi", "Estacionamiento", "Bebidas disponibles", "Techada", "Marcador Electrónico"],
    missingAmenities: ["Vista al río", "Cocina", "Piscina", "Aire acondicionado", "Detector de humo"],
    host: {
      name: "Andrés Mendoza",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "Super Anfitrión",
      phone: "+57 300 456 7890",
      rating: 4.95
    },
    logisticsOption: "own",
    logisticsDescription: "Reservas directas e inmediatas. Alquiler de balones y venta de hidratación directamente en la caja.",
    reviews: [
      { user: "Mateo S.", rating: 5, comment: "Genial porque es techada, se puede jugar al mediodía sin derretirse. Muy recomendada.", date: "2026-05-10" }
    ],
    views: 940,
    bookingsCount: 65,
    status: "active"
  }
];

const DEFAULT_USERS = [
  {
    id: "user-client",
    email: "cliente@spotlight.com",
    password: "123",
    name: "Juan Sebastián Pérez",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    phone: "+57 302 987 6543",
    favorites: ["space-1", "space-3"],
    balance: 5000000 // COP
  },
  {
    id: "user-host",
    email: "anfitrion@spotlight.com",
    password: "123",
    name: "Andrés Mendoza",
    role: "host",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    phone: "+57 300 456 7890",
    favorites: [],
    balance: 1500000 // COP
  },
  {
    id: "user-admin",
    email: "sagan@spotlight.com", // Brayan Sainea (Sagan)
    password: "123",
    name: "Brayan Sainea (Sagan)",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    phone: "+57 301 789 4512",
    favorites: ["space-2"],
    balance: 10000000 // COP
  }
];

const SPONSORS = [
  { name: "SENA - Atlántico", logo: "⚡", description: "Alianza de desarrollo tecnológico y captación de talento estudiantil." },
  { name: "Postobón S.A.", logo: "🥤", description: "Suministro oficial de hidratación y patrocinador de eventos deportivos." },
  { name: "Alcaldía de Barranquilla", logo: "🏛️", description: "Apoyo institucional al turismo de eventos y deporte distrital." },
  { name: "Spotlight Events Logistics", logo: "💡", description: "Nuestra división interna de montaje, sonido y producción de eventos." }
];

const SENA_PRESENTATION = [
  {
    id: 1,
    title: "SPOTLIGHT",
    subtitle: "El Airbnb de los Eventos y Espacios Deportivos",
    theme: "hero",
    bullets: [
      "**Reserva inteligente:** Espacios, salones y canchas en una sola plataforma.",
      "**Logística Integrada:** Opción de reservar solo el lugar o contratar organización premium de **Spotlight Events**.",
      "**Diseño de Vanguardia:** Minimalismo premium en Negro y Blanco Hueso, inspirado en Apple y Nvidia.",
      "**Presentador:** Brayan Sainea (Sagan) - Analista de Datos y Desarrollador."
    ],
    highlight: "Calidad antes que Cantidad. Proyecto Colombo-Estadounidense."
  },
  {
    id: 2,
    title: "La Oportunidad de Mercado",
    subtitle: "Por qué Barranquilla y Estados Unidos",
    theme: "standard",
    bullets: [
      "**Barranquilla como Hub Turístico:** Gran auge de conciertos, congresos internacionales y sede oficial de la Selección Colombia.",
      "**El problema actual:** Dificultad para encontrar espacios con medidas claras, fotos reales, precios transparentes y disponibilidad en tiempo real.",
      "**Modelo Internacional:** Proyectado con adaptaciones de EE. UU. (ej. pasarelas de pago ágiles, pólizas de seguro) para el mercado nacional primero e internacional después."
    ],
    highlight: "Barranquilla es la ventana al mundo ideal para el lanzamiento del MVP."
  },
  {
    id: 3,
    title: "Modelo de Negocio Revolucionario",
    subtitle: "Monetización Inteligente y Sostenible",
    theme: "standard",
    bullets: [
      "**10% de Comisión en Espacios:** Cobrado directamente por la intermediación en alquileres de salones, quintas o rooftops.",
      "**Modelo Premium para Canchas (Anti-Bypass):** WhatsApp directo para conectar clientes y canchas. Se cobra una **suscripción mensual fija** a partir del 2do mes para evitar que evadan comisiones.",
      "**Servicio de Logística Adicional:** Tarifas variables según acuerdo de sonido, catering, decoración y personal de Spotlight Events.",
      "**Suscripciones Premium:** Descuentos exclusivos para usuarios recurrentes y reservas fijas semanales."
    ],
    highlight: "Evitamos la pérdida por contacto directo en canchas mediante un cobro de pauta efectivo."
  },
  {
    id: 4,
    title: "Talento SENA y Alianzas",
    subtitle: "Construyendo el Futuro de la Región",
    theme: "standard",
    bullets: [
      "**Desarrollado con Talento SENA:** Vinculación de estudiantes tecnólogos en desarrollo de software y organización de eventos para realizar prácticas y desarrollo continuo.",
      "**Patrocinadores y Alianzas:**",
      "- **SENA:** Suministro de talento de programación y eventos.",
      "- **Postobón:** Proveedor oficial de bebidas y refrescos para canchas y eventos.",
      "- **Spotlight Events:** Operador logístico oficial del 100% de los montajes premium."
    ],
    highlight: "Impacto social y académico capacitando y empleando talento local."
  },
  {
    id: 5,
    title: "Estrategia de Marketing 'Tryhard'",
    subtitle: "Adquisición Agresiva de Clientes",
    theme: "standard",
    bullets: [
      "**Efecto WOW de la Plataforma:** Animaciones ultra-fluidas y modo claro/oscuro para cautivar a los usuarios exigentes.",
      "**SEO y Geolocalización Directa:** Recomendaciones automáticas basadas en la ubicación física real del usuario.",
      "**Torneos de Fútbol Spotlight:** Organización de copas inter-empresas en Barranquilla transmitidas en vivo para viralizar la marca.",
      "**Campañas de Fotografía Profesional:** Nuestro equipo técnico visita el local, toma fotos, mide el espacio y redacta la descripción gratis para los primeros anfitriones."
    ],
    highlight: "Garantía de calidad: fotos reales y medidas exactas para generar confianza digital."
  }
];

const DICTIONARY = {
  es: {
    heroTitle: "Reserva espacios, salones y canchas únicas",
    heroSubtitle: "Organiza eventos memorables con la logística de Spotlight Events o alquila canchas para tus torneos favoritos.",
    exploreBtn: "Explorar Espacios",
    logisticsBtn: "Servicios de Logística",
    presentationBtn: "Ver Pitch SENA",
    searchPlaceholder: "Buscar salones, canchas, quintas...",
    all: "Todos",
    salons: "Salones & Espacios",
    fields: "Canchas Deportivas",
    rating: "Calificación",
    capacity: "Capacidad",
    pricePerHour: "por hora",
    logisticsOwn: "Logística del Propietario",
    logisticsSpotlight: "Logística Spotlight Events",
    bookNow: "Reservar Ahora",
    description: "Descripción",
    amenities: "Lo que ofrece este lugar",
    missing: "No disponible",
    host: "Anfitrión",
    reviews: "Comentarios",
    dashboard: "Dashboard",
    logout: "Cerrar Sesión",
    login: "Iniciar Sesión",
    register: "Registrarse",
    language: "Idioma",
    theme: "Tema",
    favorites: "Favoritos",
    support: "Soporte",
    statistics: "Estadísticas",
    adminPanel: "Admin Panel",
    commission: "Comisión Spotlight",
    payout: "Pago a Propietario",
    checkoutTitle: "Reserva tu Espacio",
    paymentMethod: "Método de Pago",
    payConfirm: "Confirmar y Pagar",
    aboutUs: "Quiénes Somos",
    footerCopyright: "© 2026 SPOTLIGHT. Todos los derechos reservados. Proyecto Colombo-Estadounidense. Barranquilla, Colombia.",
    sponsors: "Nuestros Patrocinadores",
    capacityText: "Capacidad recomendada",
    logisticOptionTitle: "Seleccionar Logística para el Evento",
    successBooking: "¡Reserva realizada con éxito!",
    noFavorites: "Aún no tienes lugares favoritos. Haz clic en el corazón de cualquier espacio.",
    createSpace: "Crear Nuevo Espacio",
    editSpace: "Editar Espacio",
    visitorCount: "Visitantes Únicos",
    revenue: "Ingresos Totales",
    bookings: "Reservas Activas",
    spotlightLogisticsFull: "Logística & Organización Premium (Spotlight Events)"
  },
  en: {
    heroTitle: "Book unique spaces, halls, and sports fields",
    heroSubtitle: "Organize memorable events with Spotlight Events logistics or rent fields for your favorite tournaments.",
    exploreBtn: "Explore Spaces",
    logisticsBtn: "Logistics Services",
    presentationBtn: "View SENA Pitch",
    searchPlaceholder: "Search halls, fields, country houses...",
    all: "All",
    salons: "Halls & Spaces",
    fields: "Sports Fields",
    rating: "Rating",
    capacity: "Capacity",
    pricePerHour: "per hour",
    logisticsOwn: "Host's Own Logistics",
    logisticsSpotlight: "Spotlight Events Logistics",
    bookNow: "Book Now",
    description: "Description",
    amenities: "What this place offers",
    missing: "Not available",
    host: "Host",
    reviews: "Reviews",
    dashboard: "Dashboard",
    logout: "Log Out",
    login: "Log In",
    register: "Sign Up",
    language: "Language",
    theme: "Theme",
    favorites: "Favorites",
    support: "Support",
    statistics: "Statistics",
    adminPanel: "Admin Panel",
    commission: "Spotlight Commission",
    payout: "Host Payout",
    checkoutTitle: "Book Your Space",
    paymentMethod: "Payment Method",
    payConfirm: "Confirm & Pay",
    aboutUs: "About Us",
    footerCopyright: "© 2026 SPOTLIGHT. All rights reserved. Colombian-American Project. Barranquilla, Colombia.",
    sponsors: "Our Sponsors",
    capacityText: "Recommended capacity",
    logisticOptionTitle: "Select Logistics for the Event",
    successBooking: "Booking completed successfully!",
    noFavorites: "No favorites yet. Click the heart icon on any space.",
    createSpace: "Create New Space",
    editSpace: "Edit Space",
    visitorCount: "Unique Visitors",
    revenue: "Total Revenue",
    bookings: "Active Bookings",
    spotlightLogisticsFull: "Premium Logistics & Organization (Spotlight Events)"
  },
  pt: {
    heroTitle: "Reserve espaços, salões e quadras exclusivas",
    heroSubtitle: "Organize eventos memoráveis com a logística da Spotlight Events ou alugue quadras para seus torneios favoritos.",
    exploreBtn: "Explorar Espaços",
    logisticsBtn: "Serviços de Logística",
    presentationBtn: "Ver Pitch SENA",
    searchPlaceholder: "Buscar salões, quadras, chácaras...",
    all: "Todos",
    salons: "Salões & Espaços",
    fields: "Quadras Esportivas",
    rating: "Classificação",
    capacity: "Capacidade",
    pricePerHour: "por hora",
    logisticsOwn: "Logística do Anfitrião",
    logisticsSpotlight: "Logística Spotlight Events",
    bookNow: "Reservar Agora",
    description: "Descrição",
    amenities: "O que este lugar oferece",
    missing: "Não disponível",
    host: "Anfitrião",
    reviews: "Comentários",
    dashboard: "Painel",
    logout: "Sair",
    login: "Entrar",
    register: "Registrar-se",
    language: "Idioma",
    theme: "Tema",
    favorites: "Favoritos",
    support: "Suporte",
    statistics: "Estatísticas",
    adminPanel: "Painel Admin",
    commission: "Comissão Spotlight",
    payout: "Pagamento do Anfitrião",
    checkoutTitle: "Reserve seu Espaço",
    paymentMethod: "Método de Pagamento",
    payConfirm: "Confirmar e Pagar",
    aboutUs: "Quem Somos",
    footerCopyright: "© 2026 SPOTLIGHT. Todos os direitos reservados. Projeto Colombo-Americano. Barranquilla, Colômbia.",
    sponsors: "Nossos Patrocinadores",
    capacityText: "Capacidade recomendada",
    logisticOptionTitle: "Selecionar Logística para o Evento",
    successBooking: "Reserva realizada com sucesso!",
    noFavorites: "Nenhum favorito ainda. Clique no coração em qualquer espaço.",
    createSpace: "Criar Novo Espaço",
    editSpace: "Editar Espaço",
    visitorCount: "Visitantes Únicos",
    revenue: "Receita Total",
    bookings: "Reservas Ativas",
    spotlightLogisticsFull: "Logística e Organização Premium (Spotlight Events)"
  },
  fr: {
    heroTitle: "Réservez des espaces, salons et terrains de sport uniques",
    heroSubtitle: "Organisez des événements mémorables avec la logistique de Spotlight Events ou louez des terrains pour vos tournois.",
    exploreBtn: "Explorer les Espaces",
    logisticsBtn: "Services Logistiques",
    presentationBtn: "Voir Pitch SENA",
    searchPlaceholder: "Rechercher des salons, terrains, villas...",
    all: "Tout",
    salons: "Salons & Espaces",
    fields: "Terrains de Sport",
    rating: "Évaluation",
    capacity: "Capacité",
    pricePerHour: "par heure",
    logisticsOwn: "Logistique de l'Hôte",
    logisticsSpotlight: "Logistique Spotlight Events",
    bookNow: "Réserver Maintenant",
    description: "Description",
    amenities: "Ce que ce lieu propose",
    missing: "Non disponible",
    host: "Hôte",
    reviews: "Commentaires",
    dashboard: "Tableau de bord",
    logout: "Se Déconnecter",
    login: "Se Connecter",
    register: "S'inscrire",
    language: "Langue",
    theme: "Thème",
    favorites: "Favoris",
    support: "Support",
    statistics: "Statistiques",
    adminPanel: "Admin Panel",
    commission: "Commission Spotlight",
    payout: "Paiement de l'Hôte",
    checkoutTitle: "Réservez votre Espace",
    paymentMethod: "Mode de Paiement",
    payConfirm: "Confirmer & Payer",
    aboutUs: "Qui Sommes-Nous",
    footerCopyright: "© 2026 SPOTLIGHT. Tous droits réservés. Projet Colombo-Américain. Barranquilla, Colombie.",
    sponsors: "Nos Partenaires",
    capacityText: "Capacité recommandée",
    logisticOptionTitle: "Sélectionner la Logistique pour l'Événement",
    successBooking: "Réservation réussie !",
    noFavorites: "Pas encore de favoris. Cliquez sur le cœur de n'importe quel espace.",
    createSpace: "Créer un Nouvel Espace",
    editSpace: "Modifier l'Espace",
    visitorCount: "Visiteurs Uniques",
    revenue: "Revenus Totaux",
    bookings: "Réservations Actives",
    spotlightLogisticsFull: "Logistique & Organisation Premium (Spotlight Events)"
  }
};

// Export to window object for vanilla SPA loading
window.DEFAULT_SPACES = DEFAULT_SPACES;
window.DEFAULT_USERS = DEFAULT_USERS;
window.SPONSORS = SPONSORS;
window.SENA_PRESENTATION = SENA_PRESENTATION;
window.DICTIONARY = DICTIONARY;
