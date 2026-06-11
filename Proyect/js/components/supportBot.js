// =====================================================================
// COMPONENTE WIDGET DE SOPORTE (BOT Y CONTACTO)
// =====================================================================

export function inicializarBotDeSoporte() {
    // 1. Inyectar el HTML del Bot en el body
    const botHTML = `
        <!-- Floating Button -->
        <button id="btnSupportBot" class="fixed bottom-6 right-6 w-14 h-14 bg-spotlight-cyan text-black rounded-full shadow-[0_0_20px_rgba(0,224,255,0.4)] flex items-center justify-center text-2xl hover:scale-110 transition-transform z-50">
            💬
        </button>

        <!-- Chat Window -->
        <div id="supportChatWindow" class="fixed bottom-24 right-6 w-80 bg-spotlight-dark border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 opacity-0 pointer-events-none translate-y-4">
            
            <!-- Header -->
            <div class="bg-black border-b border-white/10 p-4 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-spotlight-cyan flex items-center justify-center text-black text-sm font-bold">S</div>
                    <div>
                        <h4 class="font-bold text-sm text-white">Soporte Spotlight</h4>
                        <p class="text-xs text-spotlight-cyan">En línea</p>
                    </div>
                </div>
                <button id="btnCloseChat" class="text-gray-400 hover:text-white">✕</button>
            </div>

            <!-- Chat Body -->
            <div id="chatBody" class="p-4 flex-1 h-64 overflow-y-auto bg-black/50 space-y-4 flex flex-col">
                <!-- Bot Message -->
                <div class="bg-white/10 border border-white/5 rounded-xl rounded-tl-none p-3 text-sm text-gray-200 self-start max-w-[85%]">
                    ¡Hola! 👋 Soy el asistente de Spotlight Events. ¿En qué te puedo ayudar hoy? Selecciona una opción o contáctanos directamente.
                </div>
                
                <!-- Opciones FAQ -->
                <div class="flex flex-col gap-2 mt-2" id="faqOptions">
                    <button class="faq-btn bg-spotlight-cyan/10 hover:bg-spotlight-cyan/20 border border-spotlight-cyan/30 text-spotlight-cyan text-xs text-left p-2 rounded-lg transition-colors" data-answer="Para reservar, ve al Catálogo, busca tu espacio ideal y haz clic en 'Reservar'. Luego elige fecha y horario. Debes iniciar sesión antes.">
                        ¿Cómo reservo un espacio?
                    </button>
                    <button class="faq-btn bg-spotlight-cyan/10 hover:bg-spotlight-cyan/20 border border-spotlight-cyan/30 text-spotlight-cyan text-xs text-left p-2 rounded-lg transition-colors" data-answer="Inicia sesión, ve a 'Soy Anfitrión' (Panel Anfitrión) y dale clic a '+ Publicar Nuevo'. Llena los datos y tu espacio aparecerá en nuestro catálogo.">
                        ¿Cómo publico mi salón/cancha?
                    </button>
                    <button class="faq-btn bg-spotlight-cyan/10 hover:bg-spotlight-cyan/20 border border-spotlight-cyan/30 text-spotlight-cyan text-xs text-left p-2 rounded-lg transition-colors" data-answer="Actualmente aceptamos transferencias y pagos a través de Wompi, Nequi y Bancolombia directamente en nuestra plataforma al momento de reservar.">
                        ¿Cuáles son los métodos de pago?
                    </button>
                </div>
            </div>

            <!-- Contact Options Footer -->
            <div class="bg-black border-t border-white/10 p-4">
                <p class="text-xs text-gray-500 text-center mb-3">¿Necesitas ayuda humana?</p>
                <div class="grid grid-cols-2 gap-2">
                    <a href="https://wa.me/573145301116" target="_blank" class="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-2 rounded flex items-center justify-center gap-1 transition-colors">
                        <span>📱</span> WhatsApp
                    </a>
                    <a href="mailto:brayansolinsainea@gmail.com" class="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-2 rounded flex items-center justify-center gap-1 transition-colors">
                        <span>✉️</span> Correo
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botHTML);

    // 2. Lógica de Interacción
    const btnSupportBot = document.getElementById('btnSupportBot');
    const chatWindow = document.getElementById('supportChatWindow');
    const btnCloseChat = document.getElementById('btnCloseChat');
    const chatBody = document.getElementById('chatBody');
    const faqBtns = document.querySelectorAll('.faq-btn');

    // Abrir/Cerrar
    btnSupportBot.addEventListener('click', () => {
        chatWindow.classList.toggle('opacity-0');
        chatWindow.classList.toggle('pointer-events-none');
        chatWindow.classList.toggle('translate-y-4');
    });

    btnCloseChat.addEventListener('click', () => {
        chatWindow.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    });

    // Lógica de FAQ
    faqBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const question = e.target.textContent.trim();
            const answer = e.target.getAttribute('data-answer');

            // Insertar mensaje del usuario
            chatBody.insertAdjacentHTML('beforeend', `
                <div class="bg-spotlight-cyan text-black rounded-xl rounded-tr-none p-3 text-sm self-end max-w-[85%] font-medium">
                    ${question}
                </div>
            `);

            // Simular que el bot escribe (retraso)
            const typingId = 'typing-' + Date.now();
            chatBody.insertAdjacentHTML('beforeend', `
                <div id="${typingId}" class="bg-white/10 border border-white/5 rounded-xl rounded-tl-none p-3 text-sm text-gray-400 self-start max-w-[85%]">
                    Escribiendo...
                </div>
            `);
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                document.getElementById(typingId).remove();
                // Insertar respuesta del bot
                chatBody.insertAdjacentHTML('beforeend', `
                    <div class="bg-white/10 border border-white/5 rounded-xl rounded-tl-none p-3 text-sm text-gray-200 self-start max-w-[85%]">
                        ${answer}
                    </div>
                `);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 800);
        });
    });
}
