// =====================================================================
// SPOTLIGHT EVENTS — Módulo de Tema Global (Claro/Oscuro) e Idioma
// =====================================================================

// CSS global de tema y traducciones — se inyecta en el <head> de cualquier página
const GLOBAL_THEME_CSS = `
    body { transition: background-color 0.3s ease, color 0.3s ease; }
    body.light-mode { background-color: #F3F4F6 !important; color: #111827 !important; }
    body.light-mode nav, body.light-mode .glass-nav { background-color: rgba(255,255,255,0.95) !important; border-color: #E5E7EB !important; }
    body.light-mode .bg-spotlight-dark { background-color: #FFFFFF !important; border-color: #E5E7EB !important; }
    body.light-mode h1, body.light-mode h2, body.light-mode h3, body.light-mode .text-white { color: #111827 !important; }
    body.light-mode .text-gray-400, body.light-mode .text-gray-300 { color: #4B5563 !important; }
    body.light-mode .border-white\\/10, body.light-mode .border-white\\/20 { border-color: #D1D5DB !important; }
    body.light-mode .bg-white\\/5, body.light-mode .bg-white\\/10 { background-color: #F3F4F6 !important; }
    body.light-mode .glass-card { background: rgba(255,255,255,0.85) !important; border-color: #E5E7EB !important; }
    body.light-mode input, body.light-mode select, body.light-mode textarea { background-color: #fff !important; color: #111 !important; border-color: #D1D5DB !important; }
    body.light-mode .bg-black { background-color: #F9FAFB !important; }
`;

// Aplicar el CSS global a la página actual
export function inicializarTema() {
    // Inyectar CSS si no existe
    if (!document.getElementById('global-theme-css')) {
        const style = document.createElement('style');
        style.id = 'global-theme-css';
        style.textContent = GLOBAL_THEME_CSS;
        document.head.appendChild(style);
    }
    
    // Aplicar tema guardado
    const tema = localStorage.getItem('spotlight_theme');
    if (tema === 'light') {
        document.body.classList.add('light-mode');
    } else if (!tema) {
        // Respetar preferencia del sistema si no hay configuración guardada
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add('light-mode');
        }
    }
}

// Cambiar tema y persistir
export function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('spotlight_theme', isLight ? 'light' : 'dark');
    
    // Actualizar ícono del botón
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
        btn.textContent = isLight ? '☀️' : '🌙';
    });
}

// Exponer globalmente
window.toggleTheme = toggleTheme;

// Ejecutar al importar
inicializarTema();
