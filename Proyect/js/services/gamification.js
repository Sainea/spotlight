// =====================================================================
// SPOTLIGHT EVENTS — Módulo de Gamificación (Rachas e Insignias)
// =====================================================================

const BADGES = [
    { id: 'primera_chispa',   emoji: '⚡', nombre: 'Primera Chispa',       desc: 'Completaste tu primera reserva',     req: 1,  tipo: 'reservas' },
    { id: 'habitual',         emoji: '🔥', nombre: 'Habitual',             desc: 'Completaste 5 reservas',             req: 5,  tipo: 'reservas' },
    { id: 'organizador_pro',  emoji: '🏆', nombre: 'Organizador Pro',      desc: 'Completaste 10 reservas',            req: 10, tipo: 'reservas' },
    { id: 'leyenda_baq',      emoji: '👑', nombre: 'Leyenda de Barranquilla', desc: 'Completaste 20 reservas',         req: 20, tipo: 'reservas' },
    { id: 'en_racha',         emoji: '🌊', nombre: 'En Racha',             desc: 'Reservaste 3 meses seguidos',        req: 3,  tipo: 'racha'    },
    { id: 'embajador',        emoji: '⭐', nombre: 'Embajador Spotlight',  desc: 'Dejaste 5 reseñas verificadas',      req: 5,  tipo: 'resenas'  },
];

// Obtener historial de reservas
export function getBookingHistory() {
    return JSON.parse(localStorage.getItem('bookingHistory') || '[]');
}

// Agregar una reserva completada
export function agregarReserva(spaceId, amount) {
    const history = getBookingHistory();
    history.push({ date: new Date().toISOString(), spaceId, amount, status: 'completada' });
    localStorage.setItem('bookingHistory', JSON.stringify(history));
    return verificarInsignias();
}

// Simular reservas demo para demostración
export function simularReservasDemo() {
    const existing = getBookingHistory();
    if (existing.length > 0) return;
    const demo = [
        { date: '2026-03-15T10:00:00Z', spaceId: 'arena-sport', amount: 140000, status: 'completada' },
        { date: '2026-04-10T12:00:00Z', spaceId: 'bombonera',   amount: 120000, status: 'completada' },
        { date: '2026-05-05T09:00:00Z', spaceId: 'fabrica',     amount: 250000, status: 'completada' },
        { date: '2026-06-01T14:00:00Z', spaceId: 'pabellon',    amount: 350000, status: 'completada' },
    ];
    localStorage.setItem('bookingHistory', JSON.stringify(demo));
}

// Calcular racha de meses consecutivos
function calcularRacha(history) {
    const completadas = history.filter(b => b.status === 'completada');
    if (completadas.length === 0) return 0;
    
    const meses = [...new Set(completadas.map(b => {
        const d = new Date(b.date);
        return `${d.getFullYear()}-${d.getMonth()}`;
    }))].sort();
    
    let maxRacha = 1, rachaActual = 1;
    for (let i = 1; i < meses.length; i++) {
        const [anioA, mesA] = meses[i-1].split('-').map(Number);
        const [anioB, mesB] = meses[i].split('-').map(Number);
        const diffMeses = (anioB - anioA) * 12 + (mesB - mesA);
        if (diffMeses === 1) {
            rachaActual++;
            maxRacha = Math.max(maxRacha, rachaActual);
        } else {
            rachaActual = 1;
        }
    }
    return maxRacha;
}

// Verificar qué insignias se han ganado, retorna las nuevas
export function verificarInsignias() {
    const history = getBookingHistory();
    const completadas = history.filter(b => b.status === 'completada').length;
    const racha = calcularRacha(history);
    const resenasCount = parseInt(localStorage.getItem('spotlight_resenas_count') || '0');
    const ganadas = JSON.parse(localStorage.getItem('spotlight_badges') || '[]');
    const nuevas = [];

    for (const badge of BADGES) {
        if (ganadas.includes(badge.id)) continue;
        let desbloqueado = false;
        if (badge.tipo === 'reservas' && completadas >= badge.req) desbloqueado = true;
        if (badge.tipo === 'racha' && racha >= badge.req) desbloqueado = true;
        if (badge.tipo === 'resenas' && resenasCount >= badge.req) desbloqueado = true;
        if (desbloqueado) {
            ganadas.push(badge.id);
            nuevas.push(badge);
        }
    }
    localStorage.setItem('spotlight_badges', JSON.stringify(ganadas));
    return nuevas;
}

// Obtener estadísticas del usuario para mostrar en perfil
export function getEstadisticasUsuario() {
    const history = getBookingHistory();
    const completadas = history.filter(b => b.status === 'completada').length;
    const racha = calcularRacha(history);
    const ganadas = JSON.parse(localStorage.getItem('spotlight_badges') || '[]');
    
    // Determinar siguiente insignia
    const proxima = BADGES.find(b => !ganadas.includes(b.id) && b.tipo === 'reservas');
    const progreso = proxima ? Math.min((completadas / proxima.req) * 100, 100) : 100;
    
    return { completadas, racha, ganadas, proxima, progreso, badges: BADGES };
}

// Renderizar la sección de insignias
export function renderInsignias(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const { completadas, racha, ganadas, proxima, progreso, badges } = getEstadisticasUsuario();
    
    container.innerHTML = `
        <div class="mb-8">
            <h2 class="text-2xl font-bold mb-2">Mis Logros</h2>
            <p class="text-gray-400 text-sm mb-4">${completadas} reservas completadas • Racha máxima: ${racha} mes${racha !== 1 ? 'es' : ''}</p>
            
            ${proxima ? `
            <div class="mb-6">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progreso hacia <strong class="text-white">${proxima.nombre}</strong></span>
                    <span>${completadas}/${proxima.req}</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2">
                    <div class="bg-gradient-to-r from-spotlight-cyan to-spotlight-pink h-2 rounded-full transition-all duration-500" style="width: ${progreso}%"></div>
                </div>
            </div>
            ` : '<p class="text-spotlight-cyan font-bold mb-4">🏆 ¡Conseguiste todas las insignias!</p>'}
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            ${badges.map(badge => {
                const desbloqueado = ganadas.includes(badge.id);
                return `
                <div class="rounded-2xl p-4 text-center border transition-all duration-300 ${desbloqueado 
                    ? 'bg-gradient-to-br from-spotlight-cyan/20 to-spotlight-pink/10 border-spotlight-cyan/40 shadow-[0_0_15px_rgba(0,224,255,0.1)]' 
                    : 'bg-white/5 border-white/10 opacity-50'}">
                    <div class="text-4xl mb-2 ${desbloqueado ? '' : 'grayscale'}">${desbloqueado ? badge.emoji : '🔒'}</div>
                    <p class="font-bold text-sm ${desbloqueado ? 'text-white' : 'text-gray-500'}">${badge.nombre}</p>
                    <p class="text-[10px] ${desbloqueado ? 'text-gray-300' : 'text-gray-600'} mt-1">${badge.desc}</p>
                    ${desbloqueado ? '<div class="mt-2 text-[10px] text-spotlight-cyan font-bold uppercase tracking-wider">✓ Desbloqueado</div>' : ''}
                </div>`;
            }).join('')}
        </div>
    `;
}

// Lanzar confeti al desbloquear una insignia
export function lanzarConfeti() {
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 },
            colors: ['#00E0FF', '#FF007F', '#FFD700', '#7C3AED'] });
        setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 250);
        setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 400);
    }
}
