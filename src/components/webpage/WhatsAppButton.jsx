import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fade-in transition-colors duration-300">
                    ¿Necesitas ayuda rápida?
                    <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 dark:bg-slate-800 transition-colors duration-300" />
                </div>
            )}

            {/* Button with pulse animation */}
            <a
                href="https://wa.me/51962268667?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20MenteOasis."
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
                aria-label="Chat en WhatsApp"
            >
                {/* Pulse effect */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />

                {/* Icon */}
                <MessageCircle size={28} className="relative z-10" />
            </a>
        </div>
    );
};

export default WhatsAppButton;
