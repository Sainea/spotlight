// =====================================================================
// SPOTLIGHT EVENTS — Guardianes de Rutas (Guards)
// =====================================================================
import { getUsuarioActual } from '../services/auth.js';

export function requerirAutenticacion() {
    const user = getUsuarioActual();
    if (!user) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = '../index.html'; // Redirige al inicio si no hay sesión
        return false;
    }
    return user;
}

export function requerirRol(rolRequerido) {
    const user = requerirAutenticacion();
    if (user && user.rol !== rolRequerido && user.rol !== 'admin') {
        alert(`Acceso denegado. Se requiere rol: ${rolRequerido}`);
        window.location.href = '../index.html';
        return false;
    }
    return user;
}
