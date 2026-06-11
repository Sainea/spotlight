// =====================================================================
// DATA DE PRUEBA (SEMILLA) PARA FIREBASE - BARRANQUILLA
// =====================================================================

window.ESPACIOS_SPOTLIGHT = [
    {
        id: "sp-101",
        nombre: "Arena Sport Complex — Buenavista",
        categoria: "Cancha Deportiva",
        barrio: "Riomar / Buenavista",
        precioPorHora: 140000,
        imagen: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        hostUid: "admin_seed",
        hostEmail: "admin@spotlightevents.co",
        creadoEn: new Date().toISOString(),
        // Nuevos datos enriquecidos
        descripcion: "Cancha sintética de última generación en el norte de Barranquilla, ideal para torneos empresariales o partidos entre amigos. Cuenta con grama certificada por la FIFA y un sistema de amortiguación para prevenir lesiones. Además, tenemos un sport bar justo al lado.",
        incluye: ["Balón profesional", "Petos para 2 equipos", "Parqueadero privado", "Baños y duchas", "Iluminación LED", "Gradería techada"],
        estrellas: 4.8,
        lat: 11.0189,
        lng: -74.8251,
        resenas: [
            { autor: "Carlos R.", comentario: "Excelente estado de la grama, la iluminación es perfecta para jugar de noche." },
            { autor: "Andrés F.", comentario: "Muy buen lugar, aunque el parqueadero se llena rápido los fines de semana." }
        ]
    },
    {
        id: "sp-102",
        nombre: "La Bombonera Sport — Sede Norte",
        categoria: "Cancha Deportiva",
        barrio: "Boston / Recreo",
        precioPorHora: 120000,
        imagen: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80",
        hostUid: "admin_seed",
        hostEmail: "admin@spotlightevents.co",
        creadoEn: new Date().toISOString(),
        descripcion: "Una cancha con historia. Ubicada en el corazón del Barrio Boston, perfecta para partidos de 5 contra 5. Nuestro ambiente futbolero te hará sentir como en un estadio real.",
        incluye: ["Balón de juego", "Baños", "Cafetería cercana"],
        estrellas: 4.5,
        lat: 10.9876,
        lng: -74.7954,
        resenas: [
            { autor: "Javier M.", comentario: "La mejor cancha del centro-norte. Excelente ambiente." }
        ]
    },
    {
        id: "sp-103",
        nombre: "Fábrica de Cultura",
        categoria: "Auditorio Empresarial",
        barrio: "Barrio Abajo",
        precioPorHora: 250000,
        imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        hostUid: "admin_seed",
        hostEmail: "admin@spotlightevents.co",
        creadoEn: new Date().toISOString(),
        descripcion: "El escenario artístico y cultural más moderno de Barranquilla. Ubicado en el icónico Barrio Abajo, es el espacio ideal para convenciones empresariales, lanzamientos de marca, obras de teatro y conferencias magistrales.",
        incluye: ["Capacidad para 400 personas", "Sonido profesional", "Pantalla gigante LED", "Sillas acolchadas", "Aire Acondicionado central", "Planta eléctrica"],
        estrellas: 5.0,
        lat: 10.9902,
        lng: -74.7812,
        resenas: [
            { autor: "María Fernanda P.", comentario: "Hicimos el lanzamiento de nuestra marca aquí y fue un éxito total. La acústica es impecable." },
            { autor: "Jorge H.", comentario: "Un lugar hermoso y moderno, digno de nuestra ciudad." },
            { autor: "Empresa XYZ", comentario: "Excelente servicio de logística y parqueo." }
        ]
    },
    {
        id: "sp-104",
        nombre: "Pabellón de Cristal — Gran Malecón",
        categoria: "Salón de Eventos",
        barrio: "Vía 40 / Río Magdalena",
        precioPorHora: 350000,
        imagen: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        hostUid: "admin_seed",
        hostEmail: "admin@spotlightevents.co",
        creadoEn: new Date().toISOString(),
        descripcion: "Ubicado frente al majestuoso Río Magdalena, este salón acristalado ofrece una vista inigualable para bodas, grados y eventos de gala. Su arquitectura permite que la luz natural sea la protagonista durante el día, y las luces de la ciudad brillen durante la noche.",
        incluye: ["Vista al Río Magdalena", "Salón Climatizado", "Capacidad para 800 invitados", "Zonas verdes aledañas", "Parqueadero en el Malecón"],
        estrellas: 4.9,
        lat: 11.0150,
        lng: -74.7980,
        resenas: [
            { autor: "Camila D.", comentario: "Me casé aquí el mes pasado y mis invitados quedaron maravillados con la vista." }
        ]
    },
    {
        id: "sp-105",
        nombre: "Canchas Sintéticas Parque Electrificadora",
        categoria: "Cancha Deportiva",
        barrio: "Riomar",
        precioPorHora: 90000,
        imagen: "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        hostUid: "admin_seed",
        hostEmail: "admin@spotlightevents.co",
        creadoEn: new Date().toISOString(),
        descripcion: "Cancha comunitaria reformada, ubicada dentro de uno de los parques más bonitos y seguros del norte de Barranquilla. Excelente para clases de escuelas de fútbol o partidos rápidos después del trabajo.",
        incluye: ["Parque seguro", "Cancha de 7vs7", "Graderías pequeñas"],
        estrellas: 4.2,
        lat: 11.0105,
        lng: -74.8166,
        resenas: [
            { autor: "Luis C.", comentario: "Buen precio y excelente ubicación, aunque se dificulta el parqueo." }
        ]
    },
    {
        id: "sp-106",
        nombre: "Salón de Eventos Gran Hotel El Prado",
        categoria: "Salón de Eventos",
        barrio: "El Prado",
        precioPorHora: 500000,
        imagen: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        hostUid: "admin_seed",
        hostEmail: "admin@spotlightevents.co",
        creadoEn: new Date().toISOString(),
        descripcion: "El salón más clásico, elegante e histórico de la ciudad de Barranquilla. Con su arquitectura republicana, este salón es el estandarte del lujo y la tradición caribeña, ideal para eventos de altísimo nivel.",
        incluye: ["Arquitectura histórica", "Aire acondicionado central", "Baños de lujo", "Servicio de meseros", "Catering disponible"],
        estrellas: 4.9,
        lat: 10.9995,
        lng: -74.8032,
        resenas: [
            { autor: "Familia Char", comentario: "Un clásico que nunca falla. La atención del personal del hotel es excepcional." }
        ]
    }
];
