// =====================================================================
// SPOTLIGHT EVENTS — Sistema de Notificaciones Toast
// =====================================================================

let toastContainer = null;

function ensureContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none';
        
        // Inyectar CSS para que los toasts siempre sean oscuros (sin importar el tema)
        if (!document.getElementById('toast-css')) {
            const style = document.createElement('style');
            style.id = 'toast-css';
            style.textContent = `
                #toast-container > div { color: #F9F6F0 !important; }
                #toast-container p, #toast-container span, #toast-container strong { color: #F9F6F0 !important; }
                #toast-container .text-gray-300 { color: #D1D5DB !important; }
                #toast-container .text-white { color: #FFFFFF !important; }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toastContainer);
    }
}

const TOAST_CONFIG = {
    success: { bg: 'bg-green-900/90 border-green-500/50', icon: '✅', title: 'Éxito' },
    error:   { bg: 'bg-red-900/90 border-red-500/50',     icon: '❌', title: 'Error' },
    info:    { bg: 'bg-blue-900/90 border-blue-500/50',   icon: 'ℹ️', title: 'Info' },
    warning: { bg: 'bg-yellow-900/90 border-yellow-500/50', icon: '⚠️', title: 'Aviso' },
    badge:   { bg: 'bg-gradient-to-r from-spotlight-cyan/20 to-spotlight-pink/20 border-spotlight-cyan/50', icon: '🏆', title: '¡Insignia desbloqueada!' },
};

export function showToast(message, type = 'info', duration = 3500) {
    ensureContainer();
    const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
    
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto backdrop-blur-md border rounded-xl px-4 py-3 flex items-start gap-3 shadow-2xl min-w-[280px] max-w-[360px] transform translate-x-full transition-transform duration-300 ${config.bg}`;
    toast.innerHTML = `
        <span class="text-xl flex-shrink-0 mt-0.5">${config.icon}</span>
        <div class="flex-1">
            <p class="font-bold text-white text-sm">${config.title}</p>
            <p class="text-gray-300 text-xs mt-0.5">${message}</p>
            <div class="toast-progress h-0.5 bg-white/30 rounded mt-2 relative overflow-hidden">
                <div class="toast-bar h-full bg-white/80 absolute left-0 top-0" style="width:100%; transition: width ${duration}ms linear;"></div>
            </div>
        </div>
        <button class="text-gray-400 hover:text-white text-lg leading-none flex-shrink-0" onclick="this.parentElement.remove()">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animar entrada
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
        // Iniciar barra de progreso
        const bar = toast.querySelector('.toast-bar');
        if (bar) {
            requestAnimationFrame(() => { bar.style.width = '0%'; });
        }
    });
    
    // Auto remover
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Inicializar globalmente para usar en todas las páginas
window.showToast = showToast;
