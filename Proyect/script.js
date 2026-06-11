// =====================================================================
// SPOTLIGHT BAQ — Engine Principal (SPA + EmailJS + Pagos + Auth)
// Autor: Brayan Sainea (Sagan) · SENA Atlántico 2026
// =====================================================================

// ─── EmailJS Config ───────────────────────────────────────────────
// Para activar correos REALES gratuitos:
// 1. Crea cuenta en https://www.emailjs.com
// 2. Crea un servicio de correo (Gmail)
// 3. Crea una plantilla con las variables: {{to_name}}, {{to_email}}, {{cancha}}, {{fecha}}, {{total}}, {{tx_id}}
// 4. Reemplaza los valores aquí abajo
const EMAILJS_SERVICE_ID  = "service_fhmi9qt";     // ✅ Tu Service ID de EmailJS
const EMAILJS_TEMPLATE_ID = "template_reserva";    // ⏳ Pendiente: crea la plantilla en EmailJS
const EMAILJS_PUBLIC_KEY  = "TU_PUBLIC_KEY_AQUI";  // ⏳ Pendiente: copia tu Public Key de EmailJS Account
const EMAIL_ACTIVADO      = false; // ← Cambia a TRUE cuando tengas Template ID y Public Key

// ─── Estado Global de la App ──────────────────────────────────────
let canchaActual     = null;
let metodoPago       = "Nequi";
let usuarioActual    = null;
let canchasFiltradas = [];

// ─── Init ─────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // EmailJS init (si está activado)
    if (EMAIL_ACTIVADO && EMAILJS_PUBLIC_KEY !== "TU_PUBLIC_KEY_AQUI") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // Establecer fecha mínima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('res-fecha').value = hoy;
    document.getElementById('res-fecha').min   = hoy;

    // Restaurar sesión si existía
    const sesionGuardada = localStorage.getItem('spotlight_user');
    if (sesionGuardada) {
        usuarioActual = JSON.parse(sesionGuardada);
        actualizarHeaderSesion();
    }

    // Renderizar catálogo con todos los espacios
    const todosEspacios = window.ESPACIOS_SPOTLIGHT || window.CANCHAS_BARRANQUILLA || [];
    renderizarCatalogo(todosEspacios);
    renderizarDashboard();
});

// ═══════════════════════════════════════════════════════════════════
// ROUTER SPA
// ═══════════════════════════════════════════════════════════════════
function navegarA(idVista) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const vista = document.getElementById(idVista);
    if (vista) vista.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Actualizar nav
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const mapa = {
        'view-landing':   'nav-inicio',
        'view-catalog':   'nav-canchas',
        'view-host':      'nav-anfitrion',
        'view-dashboard': 'nav-admin'
    };
    if (mapa[idVista]) document.getElementById(mapa[idVista])?.classList.add('active');

    // Acciones especiales al cambiar de vista
    if (idVista === 'view-dashboard') { renderizarDashboard(); renderizarTablaEspacios(); renderizarTablaUsuarios(); }
    if (idVista === 'view-host')      { renderizarPanelHost(); }

    // Cerrar dropdown si está abierto
    document.getElementById('user-dropdown')?.classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════════
// CATÁLOGO DE CANCHAS
// ═══════════════════════════════════════════════════════════════════
function renderizarCatalogo(lista) {
    const grid    = document.getElementById('cards-grid');
    const counter = document.getElementById('catalog-count');
    grid.innerHTML = '';

    const labels = { cancha: 'cancha', salon: 'salón', espacio: 'espacio' };
    const total  = lista.length;
    counter.textContent = `${total} ${total === 1 ? 'espacio' : 'espacios'} verificado${total !== 1 ? 's' : ''} en Barranquilla`;

    if (lista.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
            <div class="empty-icon">🔍</div>
            <div>No encontramos espacios con ese filtro.</div>
        </div>`;
        return;
    }

    lista.forEach((espacio, i) => {
        const card = document.createElement('div');
        card.className = 'space-card animate-up';
        card.style.animationDelay = `${i * 0.05}s`;
        card.onclick = () => verDetalle(espacio.id);

        const stars    = generarEstrellas(espacio.rating);
        const precio   = espacio.precioPorHora.toLocaleString('es-CO');
        const statusClass = espacio.disponible ? 'on' : 'off';
        const catEmoji = { cancha: '⚽', salon: '🎊', espacio: '✨' }[espacio.categoria] || '📍';

        card.innerHTML = `
            <div class="card-img-wrap">
                <img class="card-img" src="${espacio.imagen}" alt="${espacio.nombre}" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80'">
                ${espacio.badge ? `<div class="card-badge">${espacio.badge}</div>` : ''}
                <div class="card-status ${statusClass}" title="${espacio.disponible ? 'Disponible' : 'Ocupado ahora'}"></div>
            </div>
            <div class="card-body">
                <div class="card-tipo">${catEmoji} ${espacio.tipo}</div>
                <div class="card-title">${espacio.nombre}</div>
                <div class="card-addr">📍 ${espacio.barrio} · ${espacio.direccion.split(',')[0]}</div>
                <div class="card-footer">
                    <div class="card-price">
                        <strong class="cyan-text">$${precio}</strong>
                        <span>COP / hora</span>
                    </div>
                    <div class="card-rating">
                        <span class="rating-stars">${stars}</span>
                        <span>${espacio.rating}</span>
                        <span class="rating-count">(${espacio.reviews})</span>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function generarEstrellas(rating) {
    const llenas   = Math.floor(rating);
    const media    = rating % 1 >= 0.5 ? 1 : 0;
    const vacias   = 5 - llenas - media;
    return '★'.repeat(llenas) + (media ? '½' : '') + '☆'.repeat(vacias);
}

// Filtros
function filtrarPor(tipo, btn) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');

    const fuente    = window.ESPACIOS_SPOTLIGHT || window.CANCHAS_BARRANQUILLA || [];
    const busqueda  = document.getElementById('search-input').value.toLowerCase();
    let resultado   = fuente;

    if (tipo === 'cancha')     resultado = resultado.filter(e => e.categoria === 'cancha');
    if (tipo === 'salon')      resultado = resultado.filter(e => e.categoria === 'salon');
    if (tipo === 'espacio')    resultado = resultado.filter(e => e.categoria === 'espacio');
    if (tipo === 'disponible') resultado = resultado.filter(e => e.disponible);

    if (busqueda) {
        resultado = resultado.filter(e =>
            e.nombre.toLowerCase().includes(busqueda) ||
            e.barrio.toLowerCase().includes(busqueda) ||
            e.direccion.toLowerCase().includes(busqueda) ||
            e.tipo.toLowerCase().includes(busqueda)
        );
    }

    renderizarCatalogo(resultado);
}

function buscarCanchas(texto) {
    const fuente   = window.ESPACIOS_SPOTLIGHT || window.CANCHAS_BARRANQUILLA || [];
    const busqueda = texto.toLowerCase();
    const resultado = fuente.filter(e =>
        e.nombre.toLowerCase().includes(busqueda) ||
        e.barrio.toLowerCase().includes(busqueda) ||
        e.direccion.toLowerCase().includes(busqueda) ||
        e.tipo.toLowerCase().includes(busqueda)
    );
    renderizarCatalogo(resultado);
}

// ═══════════════════════════════════════════════════════════════════
// DETALLE DE CANCHA
// ═══════════════════════════════════════════════════════════════════
function verDetalle(id) {
    const fuente  = window.ESPACIOS_SPOTLIGHT || window.CANCHAS_BARRANQUILLA || [];
    const espacio = fuente.find(e => e.id === id);
    if (!espacio) return;
    canchaActual = espacio;

    // Textos
    document.getElementById('det-nombre').textContent    = espacio.nombre;
    document.getElementById('det-tipo').textContent      = espacio.tipo;
    document.getElementById('det-rating').textContent    = espacio.rating;
    document.getElementById('det-reviews').textContent   = espacio.reviews;
    document.getElementById('det-barrio').textContent    = `📍 ${espacio.barrio}`;
    document.getElementById('det-descripcion').textContent = espacio.descripcion;
    document.getElementById('det-direccion').textContent = espacio.direccion;
    document.getElementById('det-telefono').textContent  = espacio.telefono;
    document.getElementById('det-horario').textContent   = espacio.horario;
    document.getElementById('det-capacidad').textContent = espacio.capacidad;
    document.getElementById('det-precio').textContent    = `$${espacio.precioPorHora.toLocaleString('es-CO')}`;

    // WhatsApp link
    const wsLink = document.getElementById('det-whatsapp-link');
    wsLink.href  = `https://wa.me/${espacio.whatsapp}?text=Hola!%20Quiero%20reservar%20${encodeURIComponent(espacio.nombre)}%20a%20través%20de%20Spotlight%20BAQ`;
    wsLink.textContent = `Contactar por WhatsApp →`;

    // Imágenes
    const imgs = espacio.imagenes || [espacio.imagen, espacio.imagen, espacio.imagen];
    document.getElementById('det-img-main').src = imgs[0] || espacio.imagen;
    document.getElementById('det-img-2').src     = imgs[1] || espacio.imagen;
    document.getElementById('det-img-3').src     = imgs[2] || espacio.imagen;

    // Amenidades
    const amenDiv = document.getElementById('det-amenidades');
    amenDiv.innerHTML = '';
    (espacio.amenidades || []).forEach(a => {
        const div = document.createElement('div');
        div.className = 'amenity';
        div.textContent = a;
        amenDiv.appendChild(div);
    });

    // Google Maps embed
    const mapa = document.getElementById('mapa-contenedor');
    mapa.innerHTML = `
        <iframe
            src="https://maps.google.com/maps?q=${encodeURIComponent(espacio.direccion + ', Barranquilla')}&z=16&output=embed"
            width="100%" height="280"
            style="border:0; border-radius:12px;"
            loading="lazy"
            allowfullscreen>
        </iframe>
    `;

    calcularTotal();
    navegarA('view-detail');
}

// ═══════════════════════════════════════════════════════════════════
// CÁLCULO DE PRECIOS
// ═══════════════════════════════════════════════════════════════════
function calcularTotal() {
    if (!canchaActual) return;
    const dur      = parseInt(document.getElementById('res-duracion').value) || 1;
    const subtotal = canchaActual.precioPorHora * dur;

    document.getElementById('lbl-subtotal').textContent = `Subtotal (${dur} hora${dur > 1 ? 's' : ''})`;
    document.getElementById('val-subtotal').textContent = `$${subtotal.toLocaleString('es-CO')} COP`;
    document.getElementById('val-total').textContent    = `$${subtotal.toLocaleString('es-CO')} COP`;
}

// ═══════════════════════════════════════════════════════════════════
// MÉTODO DE PAGO
// ═══════════════════════════════════════════════════════════════════
function elegirPago(metodo, elem) {
    metodoPago = metodo;
    document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
    elem.classList.add('selected');
}

// ═══════════════════════════════════════════════════════════════════
// FLUJO DE PAGO COMPLETO
// ═══════════════════════════════════════════════════════════════════
function ejecutarPago() {
    if (!canchaActual) return;

    const dur      = parseInt(document.getElementById('res-duracion').value);
    const total    = canchaActual.precioPorHora * dur;
    const fecha    = document.getElementById('res-fecha').value;
    const hora     = document.getElementById('res-hora').value;
    const txId     = "TX-BAQ-" + Math.floor(100000 + Math.random() * 900000);

    // Paso 1: Conectando con pasarela
    Swal.fire({
        title: `🔒 Conectando con ${metodoPago}...`,
        html: `Estableciendo túnel cifrado SSL con <b>${metodoPago}</b>.<br>
               Monto: <strong>$${total.toLocaleString('es-CO')} COP</strong>`,
        allowOutsideClick: false,
        showConfirmButton: false,
        background: '#0d1117',
        color: '#ECEEF2',
        didOpen: () => Swal.showLoading()
    });

    // Simular procesamiento (2.5 segundos)
    setTimeout(() => {
        // Paso 2: Pago aprobado
        Swal.fire({
            icon: 'success',
            title: '¡Transacción Aprobada!',
            background: '#0d1117',
            color: '#ECEEF2',
            iconColor: '#00E0FF',
            html: `
                <div style="text-align:left; background:#04060a; border:1px solid #1a2535; border-radius:10px; padding:16px; font-family:monospace; font-size:13px; margin-top:12px; line-height:1.8;">
                    <p>🏟️ <strong>Cancha:</strong> ${canchaActual.nombre}</p>
                    <p>📍 <strong>Dirección:</strong> ${canchaActual.barrio}, Barranquilla</p>
                    <p>📅 <strong>Fecha:</strong> ${fecha} a las ${hora}:00 HS</p>
                    <p>⏱️ <strong>Duración:</strong> ${dur} hora${dur > 1 ? 's' : ''}</p>
                    <p>💳 <strong>Canal:</strong> ${metodoPago}</p>
                    <p>🔑 <strong>ID de Pago:</strong> <span style="color:#00E0FF">${txId}</span></p>
                    <p>✅ <strong>Estado:</strong> <span style="color:#22C55E">APPROVED_00</span></p>
                </div>
                ${usuarioActual ? `<p style="margin-top:12px; font-size:13px; color:#8B929E;">Confirmación enviada a: <strong>${usuarioActual.email}</strong></p>` : ''}
            `,
            confirmButtonText: '📊 Ver en Dashboard',
            confirmButtonColor: '#00E0FF',
        }).then(() => {
            // Guardar en historial
            const registro = {
                id:     txId,
                cancha: canchaActual.nombre,
                barrio: canchaActual.barrio,
                total,
                metodo: metodoPago,
                fecha:  new Date().toLocaleString('es-CO'),
                estado: "Completado"
            };
            const historial = JSON.parse(localStorage.getItem('spotlight_tx') || '[]');
            historial.unshift(registro);
            localStorage.setItem('spotlight_tx', JSON.stringify(historial));

            // Enviar correo de confirmación si hay usuario y EmailJS configurado
            if (usuarioActual && EMAIL_ACTIVADO) {
                enviarCorreoConfirmacion({
                    to_name:  usuarioActual.nombre,
                    to_email: usuarioActual.email,
                    cancha:   canchaActual.nombre,
                    fecha:    `${fecha} a las ${hora}:00`,
                    total:    `$${total.toLocaleString('es-CO')} COP`,
                    tx_id:    txId
                });
            }

            renderizarDashboard();
            navegarA('view-dashboard');
            mostrarToast('✅ Reserva confirmada con éxito', 'success');
        });
    }, 2500);
}

// ═══════════════════════════════════════════════════════════════════
// EMAILJS — ENVÍO DE CORREO DE CONFIRMACIÓN
// ═══════════════════════════════════════════════════════════════════
function enviarCorreoConfirmacion(params) {
    if (!EMAIL_ACTIVADO) return;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
        .then(() => {
            mostrarToast(`📧 Correo enviado a ${params.to_email}`, 'info');
        })
        .catch(err => {
            console.warn('EmailJS error:', err);
        });
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD — AUDITORÍA
// ═══════════════════════════════════════════════════════════════════
function renderizarDashboard() {
    const historial = JSON.parse(localStorage.getItem('spotlight_tx') || '[]');
    const tbody     = document.getElementById('audit-body');
    const kpiIng    = document.getElementById('kpi-ingresos');
    const kpiCount  = document.getElementById('kpi-count');

    tbody.innerHTML = '';

    if (historial.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <div>No hay transacciones registradas aún.</div>
                <div style="font-size:12px;margin-top:4px;">Realiza una reserva para ver los datos aquí.</div>
            </div>
        </td></tr>`;
        kpiIng.textContent   = '$0 COP';
        kpiCount.textContent = '0';
        return;
    }

    let total = 0;
    historial.forEach(tx => {
        total += tx.total;
        const comision = Math.round(tx.total * 0.10);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="tx-id">${tx.id}</span></td>
            <td><strong>${tx.cancha}</strong><br><span style="font-size:11px;color:var(--text-3);">${tx.barrio || 'Barranquilla'}</span></td>
            <td style="font-size:12px;">${tx.fecha}</td>
            <td>📱 ${tx.metodo}</td>
            <td><strong>$${tx.total.toLocaleString('es-CO')} COP</strong></td>
            <td style="color:var(--gold);">$${comision.toLocaleString('es-CO')} COP</td>
            <td><span class="status-badge status-ok">✓ ${tx.estado}</span></td>
        `;
        tbody.appendChild(tr);
    });

    kpiIng.textContent   = `$${total.toLocaleString('es-CO')} COP`;
    kpiCount.textContent = historial.length;
}

function limpiarHistorial() {
    Swal.fire({
        title: '¿Resetear transacciones?',
        text: 'Esto borrará todos los registros de pagos del dashboard.',
        icon: 'warning',
        background: '#0d1117',
        color: '#ECEEF2',
        showCancelButton: true,
        confirmButtonText: 'Sí, resetear',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EF4444',
    }).then(res => {
        if (res.isConfirmed) {
            localStorage.removeItem('spotlight_tx');
            renderizarDashboard();
            mostrarToast('🗑️ Historial de transacciones borrado', 'info');
        }
    });
}

// ═══════════════════════════════════════════════════════════════════
// AUTENTICACIÓN — Login, Registro, Sesión
// ═══════════════════════════════════════════════════════════════════
function iniciarSesion(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass  = document.getElementById('login-pass').value;

    // Buscar en usuarios guardados
    const usuarios = JSON.parse(localStorage.getItem('spotlight_usuarios') || '[]');
    const demos    = window.USUARIOS_DEMO || [];
    const todos    = [...demos, ...usuarios];

    const user = todos.find(u => u.email.toLowerCase() === email && u.password === pass);

    if (user) {
        usuarioActual = user;
        localStorage.setItem('spotlight_user', JSON.stringify(user));
        cerrarModal('modal-login');
        actualizarHeaderSesion();
        mostrarToast(`👋 Bienvenido de nuevo, ${user.nombre.split(' ')[0]}!`, 'success');
    } else {
        mostrarToast('❌ Correo o contraseña incorrectos', 'error');
    }
}

function registrarUsuario(e) {
    e.preventDefault();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email  = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass   = document.getElementById('reg-pass').value;
    const pass2  = document.getElementById('reg-pass2').value;

    if (pass !== pass2) {
        mostrarToast('❌ Las contraseñas no coinciden', 'error');
        return;
    }
    if (pass.length < 6) {
        mostrarToast('❌ La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Verificar si el correo ya existe
    const existentes = JSON.parse(localStorage.getItem('spotlight_usuarios') || '[]');
    const demos      = window.USUARIOS_DEMO || [];
    const todos      = [...demos, ...existentes];

    if (todos.find(u => u.email.toLowerCase() === email)) {
        mostrarToast('❌ Este correo ya está registrado', 'error');
        return;
    }

    const nuevoUser = { nombre, email, password: pass, rol: 'cliente' };
    existentes.push(nuevoUser);
    localStorage.setItem('spotlight_usuarios', JSON.stringify(existentes));

    // Auto-login
    usuarioActual = nuevoUser;
    localStorage.setItem('spotlight_user', JSON.stringify(nuevoUser));

    cerrarModal('modal-register');
    actualizarHeaderSesion();

    // Simular envío de correo de confirmación de registro
    Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada con éxito!',
        html: `
            <p>Bienvenido a SPOTLIGHT BAQ, <strong>${nombre}</strong></p>
            <p style="margin-top:8px; font-size:13px; color:#8B929E;">
                📧 Se enviará un correo de confirmación a <strong>${email}</strong>
                ${EMAIL_ACTIVADO ? '' : '<br><em style="font-size:11px;">(Correo real disponible con EmailJS configurado)</em>'}
            </p>
        `,
        background: '#0d1117',
        color: '#ECEEF2',
        iconColor: '#00E0FF',
        confirmButtonText: '¡Genial, explorar canchas!',
        confirmButtonColor: '#00E0FF',
    }).then(() => {
        navegarA('view-catalog');
    });
}

function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('spotlight_user');
    actualizarHeaderSesion();
    document.getElementById('user-dropdown').classList.remove('open');
    mostrarToast('👋 Sesión cerrada correctamente', 'info');
    navegarA('view-landing');
}

function actualizarHeaderSesion() {
    const guestEl = document.getElementById('header-guest');
    const userEl  = document.getElementById('header-user');
    if (usuarioActual) {
        guestEl.style.display = 'none';
        userEl.style.display  = 'block';
        document.getElementById('user-display-name').textContent = usuarioActual.nombre.split(' ')[0];
        document.getElementById('user-initials').textContent     = usuarioActual.nombre.charAt(0).toUpperCase();
    } else {
        guestEl.style.display = 'flex';
        userEl.style.display  = 'none';
    }
}

function toggleDropdown() {
    document.getElementById('user-dropdown').classList.toggle('open');
}

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', (e) => {
    const wrap = document.getElementById('user-avatar-btn');
    const drop = document.getElementById('user-dropdown');
    if (drop && wrap && !wrap.contains(e.target) && !drop.contains(e.target)) {
        drop.classList.remove('open');
    }
});

// ═══════════════════════════════════════════════════════════════════
// MODALES
// ═══════════════════════════════════════════════════════════════════
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Cerrar modal al hacer clic en el overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
});

// ═══════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════
function mostrarToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toast-container');
    const toast     = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<span>${mensaje}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ═══════════════════════════════════════════════════════════════════
// GEOLOCALIZACIÓN — Ordenar por cercanía
// ═══════════════════════════════════════════════════════════════════
let userLat = null;
let userLng = null;

function detectarUbicacion() {
    const btn    = document.getElementById('btn-geolocate');
    const banner = document.getElementById('geo-banner');
    const geoTxt = document.getElementById('geo-text');

    if (!navigator.geolocation) {
        mostrarToast('❌ Tu navegador no soporta geolocalización', 'error');
        return;
    }

    btn.textContent = '📡 Detectando...';
    btn.disabled    = true;

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            userLat = pos.coords.latitude;
            userLng = pos.coords.longitude;

            // Mostrar banner
            banner.style.display = 'flex';
            geoTxt.textContent   = `Mostrando espacios más cercanos a ti en Barranquilla`;

            btn.textContent = '📍 Mostrando cercanos';
            btn.disabled    = false;

            // Calcular distancias y ordenar
            const fuente = window.ESPACIOS_SPOTLIGHT || window.CANCHAS_BARRANQUILLA || [];
            const conDistancia = fuente.map(e => ({
                ...e,
                distancia: calcularDistanciaKm(userLat, userLng, e.lat || parseCoordenadas(e.coordenadas).lat, e.lng || parseCoordenadas(e.coordenadas).lng)
            })).sort((a, b) => a.distancia - b.distancia);

            renderizarCatalogoCercano(conDistancia);
            mostrarToast('📍 Espacios ordenados por cercanía', 'success');
        },
        (err) => {
            btn.textContent = '📍 Ver los más cercanos a mí';
            btn.disabled    = false;
            mostrarToast('❌ No se pudo obtener tu ubicación. Activa el permiso de ubicación.', 'error');
        },
        { timeout: 8000, enableHighAccuracy: true }
    );
}

function parseCoordenadas(coords) {
    if (!coords) return { lat: 11.0041, lng: -74.8070 }; // Centro Barranquilla
    const partes = coords.split(',');
    return { lat: parseFloat(partes[0]), lng: parseFloat(partes[1]) };
}

function calcularDistanciaKm(lat1, lng1, lat2, lng2) {
    const R    = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a    = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function renderizarCatalogoCercano(lista) {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';

    document.getElementById('catalog-count').textContent = `${lista.length} espacios ordenados por cercanía`;

    lista.forEach((espacio, i) => {
        const card = document.createElement('div');
        card.className = 'space-card animate-up';
        card.style.animationDelay = `${i * 0.05}s`;
        card.onclick = () => verDetalle(espacio.id);

        const stars      = generarEstrellas(espacio.rating);
        const precio     = espacio.precioPorHora.toLocaleString('es-CO');
        const statusCls  = espacio.disponible ? 'on' : 'off';
        const catEmoji   = { cancha: '⚽', salon: '🎊', espacio: '✨' }[espacio.categoria] || '📍';
        const distText   = espacio.distancia < 1
            ? `${Math.round(espacio.distancia * 1000)} m de ti`
            : `${espacio.distancia.toFixed(1)} km de ti`;

        card.innerHTML = `
            <div class="card-img-wrap">
                <img class="card-img" src="${espacio.imagen}" alt="${espacio.nombre}" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80'">
                <div class="card-badge" style="color:var(--cyan);">📍 ${distText}</div>
                <div class="card-status ${statusCls}"></div>
            </div>
            <div class="card-body">
                <div class="card-tipo">${catEmoji} ${espacio.tipo}</div>
                <div class="card-title">${espacio.nombre}</div>
                <div class="card-addr">📍 ${espacio.barrio}</div>
                <div class="card-footer">
                    <div class="card-price">
                        <strong class="cyan-text">$${precio}</strong>
                        <span>COP / hora</span>
                    </div>
                    <div class="card-rating">
                        <span class="rating-stars">${stars}</span>
                        <span>${espacio.rating}</span>
                    </div>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function quitarFiltroGeo() {
    userLat = null;
    userLng = null;
    const banner = document.getElementById('geo-banner');
    banner.style.display = 'none';
    const btn = document.getElementById('btn-geolocate');
    btn.textContent = '📍 Ver los más cercanos a mí';
    btn.disabled = false;
    const fuente = window.ESPACIOS_SPOTLIGHT || window.CANCHAS_BARRANQUILLA || [];
    renderizarCatalogo(fuente);
    mostrarToast('Filtro de ubicación eliminado', 'info');
}

// ═══════════════════════════════════════════════════════════════════
// PANEL ANFITRIÓN
// ═══════════════════════════════════════════════════════════════════
function irPanelAnfitrion() {
    if (!usuarioActual) {
        mostrarToast('⚠️ Inicia sesión para acceder a tu panel', 'error');
        abrirModal('modal-login');
        return;
    }
    navegarA('view-host');
}

function irPanelAdmin() {
    if (!usuarioActual) {
        mostrarToast('⚠️ Inicia sesión para acceder al panel', 'error');
        abrirModal('modal-login');
        return;
    }
    if (usuarioActual.rol !== 'admin') {
        mostrarToast('⛔ Solo los administradores pueden acceder al panel admin', 'error');
        return;
    }
    navegarA('view-dashboard');
}

function renderizarPanelHost() {
    const historial = JSON.parse(localStorage.getItem('spotlight_tx') || '[]');
    const misEspacios = JSON.parse(localStorage.getItem('spotlight_mis_espacios') || '[]');

    // KPIs del host
    const totalBruto = historial.reduce((s, t) => s + (t.total || 0), 0);
    const totalHost  = totalBruto * 0.9; // 90% para el anfitrión
    document.getElementById('host-ingresos').textContent = `$${totalHost.toLocaleString('es-CO')} COP`;
    document.getElementById('host-reservas').textContent = historial.length;

    // Lista de mis espacios
    const lista = document.getElementById('host-espacios-list');
    if (misEspacios.length === 0) {
        lista.innerHTML = `<div class="empty-state"><div class="empty-icon">🏟️</div><div>Aún no has publicado ningún espacio.</div><button class="btn btn-cyan btn-sm" style="margin-top:12px;" onclick="abrirModal('modal-publicar')">Publicar mi primer espacio</button></div>`;
    } else {
        lista.innerHTML = `<table class="audit-table"><thead><tr><th>Nombre</th><th>Categoría</th><th>Precio/hr</th><th>Estado</th><th>Acción</th></tr></thead><tbody>` +
            misEspacios.map(e => `<tr>
                <td><strong>${e.nombre}</strong></td>
                <td>${{ cancha: '⚽ Cancha', salon: '🎊 Salón', espacio: '✨ Espacio' }[e.categoria] || e.categoria}</td>
                <td class="cyan-text">$${parseInt(e.precio).toLocaleString('es-CO')} COP</td>
                <td><span class="status-badge status-ok">✓ Publicado</span></td>
                <td><button class="btn btn-ghost btn-sm" onclick="eliminarMiEspacio('${e.id}')">🗑️</button></td>
            </tr>`).join('') +
            '</tbody></table>';
    }

    // Tabla historial de reservas del host
    const tablaHost = document.getElementById('host-tabla');
    if (historial.length === 0) {
        tablaHost.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📭</div><div>Sin reservas aún</div></div></td></tr>`;
    } else {
        tablaHost.innerHTML = historial.map(tx => `<tr>
            <td class="tx-id">${tx.id}</td>
            <td><strong>${tx.cancha}</strong></td>
            <td style="font-size:12px;">${tx.fecha}</td>
            <td>${usuarioActual?.nombre || 'Cliente'}</td>
            <td>$${tx.total.toLocaleString('es-CO')} COP</td>
            <td class="cyan-text">$${Math.round(tx.total * 0.9).toLocaleString('es-CO')} COP</td>
            <td><span class="status-badge status-ok">✓ Pagado</span></td>
        </tr>`).join('');
    }
}

function publicarEspacio(e) {
    e.preventDefault();

    if (!usuarioActual) {
        cerrarModal('modal-publicar');
        abrirModal('modal-login');
        mostrarToast('⚠️ Inicia sesión para publicar un espacio', 'error');
        return;
    }

    const nuevo = {
        id:          'custom-' + Date.now(),
        nombre:      document.getElementById('pub-nombre').value,
        categoria:   document.getElementById('pub-categoria').value,
        tipo:        { cancha: 'Cancha Deportiva', salon: 'Salón de Eventos', espacio: 'Espacio Único' }[document.getElementById('pub-categoria').value] || 'Espacio',
        precio:      document.getElementById('pub-precio').value,
        precioPorHora: parseInt(document.getElementById('pub-precio').value),
        direccion:   document.getElementById('pub-direccion').value,
        barrio:      document.getElementById('pub-direccion').value.split(',')[1]?.trim() || 'Barranquilla',
        telefono:    document.getElementById('pub-telefono').value || 'Por confirmar',
        whatsapp:    '573000000000',
        capacidad:   document.getElementById('pub-capacidad').value || 'Por confirmar',
        descripcion: document.getElementById('pub-desc').value,
        amenidades:  document.getElementById('pub-amenidades').value.split('\n').filter(Boolean),
        logistica:   document.getElementById('pub-logistica').value,
        horario:     document.getElementById('pub-horario').value || 'Consultar',
        coordenadas: '11.0041,-74.8070',
        rating:      5.0, reviews: 0,
        disponible:  true, reservasHoy: 0,
        badge:       'Nuevo',
        imagen:      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80',
        imagenes:    [],
        propietario: usuarioActual.email
    };

    // Agregar a ESPACIOS_SPOTLIGHT en memoria
    if (window.ESPACIOS_SPOTLIGHT) window.ESPACIOS_SPOTLIGHT.push(nuevo);

    // Guardar en localStorage del anfitrión
    const misEspacios = JSON.parse(localStorage.getItem('spotlight_mis_espacios') || '[]');
    misEspacios.push(nuevo);
    localStorage.setItem('spotlight_mis_espacios', JSON.stringify(misEspacios));

    cerrarModal('modal-publicar');
    e.target.reset();

    Swal.fire({
        icon: 'success',
        title: '¡Espacio Publicado!',
        html: `<strong>${nuevo.nombre}</strong> ya está visible en el catálogo.<br><br>
               📸 Nuestro equipo se comunicará contigo para tomar fotos profesionales gratis.`,
        background: '#0d1117', color: '#ECEEF2', iconColor: '#00E0FF',
        confirmButtonText: 'Ver mi Panel', confirmButtonColor: '#00E0FF',
    }).then(() => {
        renderizarPanelHost();
        renderizarCatalogo(window.ESPACIOS_SPOTLIGHT || []);
    });
}

function eliminarMiEspacio(id) {
    const misEspacios = JSON.parse(localStorage.getItem('spotlight_mis_espacios') || '[]');
    const nuevos      = misEspacios.filter(e => e.id !== id);
    localStorage.setItem('spotlight_mis_espacios', JSON.stringify(nuevos));
    if (window.ESPACIOS_SPOTLIGHT) {
        const idx = window.ESPACIOS_SPOTLIGHT.findIndex(e => e.id === id);
        if (idx !== -1) window.ESPACIOS_SPOTLIGHT.splice(idx, 1);
    }
    renderizarPanelHost();
    mostrarToast('🗑️ Espacio eliminado', 'info');
}

// ═══════════════════════════════════════════════════════════════════
// PANEL ADMIN — Tabs y Tablas
// ═══════════════════════════════════════════════════════════════════
function cambiarTabAdmin(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('[onclick^="cambiarTabAdmin"]').forEach(b => b.classList.remove('active'));
    const tabEl = document.getElementById(`tab-${tab}`);
    if (tabEl) tabEl.style.display = 'block';
    btn.classList.add('active');

    if (tab === 'espacios') renderizarTablaEspacios();
    if (tab === 'usuarios') renderizarTablaUsuarios();
}

function renderizarTablaEspacios() {
    const tbody  = document.getElementById('admin-espacios-body');
    if (!tbody) return;
    const fuente = window.ESPACIOS_SPOTLIGHT || window.CANCHAS_BARRANQUILLA || [];
    const custom = JSON.parse(localStorage.getItem('spotlight_mis_espacios') || '[]');
    const todos  = [...fuente, ...custom.filter(c => !fuente.find(f => f.id === c.id))];

    tbody.innerHTML = todos.map(e => `<tr>
        <td><strong>${e.nombre}</strong></td>
        <td>${{ cancha: '⚽ Cancha', salon: '🎊 Salón', espacio: '✨ Espacio' }[e.categoria] || e.categoria}</td>
        <td style="font-size:12px;">${e.barrio}</td>
        <td class="cyan-text">$${e.precioPorHora.toLocaleString('es-CO')} COP</td>
        <td><span style="color:var(--gold);">⭐ ${e.rating}</span></td>
        <td>${e.disponible ? '<span class="status-badge status-ok">✓ Disponible</span>' : '<span class="status-badge" style="background:rgba(239,68,68,0.12);color:var(--red);">✗ Ocupado</span>'}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="verDetalle('${e.id}'); navegarA('view-detail');">Ver →</button></td>
    </tr>`).join('');

    const kpiEl = document.getElementById('kpi-espacios');
    if (kpiEl) kpiEl.textContent = todos.length;
}

function renderizarTablaUsuarios() {
    const tbody    = document.getElementById('admin-users-body');
    if (!tbody) return;
    const demos    = window.USUARIOS_DEMO || [];
    const custom   = JSON.parse(localStorage.getItem('spotlight_usuarios') || '[]');
    const todos    = [...demos, ...custom];

    tbody.innerHTML = todos.map(u => `<tr>
        <td><strong>${u.nombre}</strong></td>
        <td style="font-size:12px; color:var(--text-2);">${u.email}</td>
        <td>${{ admin: '<span class="status-badge" style="background:rgba(255,184,0,0.15);color:var(--gold);">👑 Admin</span>', host: '<span class="status-badge status-ok">🏠 Anfitrión</span>', cliente: '<span class="status-badge" style="background:var(--cyan-dim);color:var(--cyan);">👤 Cliente</span>' }[u.rol] || u.rol}</td>
        <td><span class="status-badge status-ok">✓ Activo</span></td>
    </tr>`).join('');
}