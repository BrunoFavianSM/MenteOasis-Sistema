import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, Brain, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 text-white font-bold text-2xl mb-6">
                            <Brain className="w-8 h-8 text-brand-400" />
                            <span>MenteOasis</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            Tu compañero en el camino hacia el bienestar mental y emocional.
                            Profesionales comprometidos contigo.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            <li><a href="#about" className="hover:text-brand-400 transition">Nosotros</a></li>
                            <li><a href="#services" className="hover:text-brand-400 transition">Servicios</a></li>
                            <li><a href="#workshops" className="hover:text-brand-400 transition">Talleres</a></li>
                            <li><a href="#events" className="hover:text-brand-400 transition">Eventos</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 w-5 h-5 text-brand-400" />
                                <span>Av. E-9, Av. Mariscal Cáceres 43, Talara 20811</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-400" />
                                <span>+51 962268667</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-400" />
                                <span>contacto@menteoasis.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Síguenos</h4>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/MenteOasisPsicologiaPeru" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 transition text-white" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="https://www.instagram.com/menteoasis_psic/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 transition text-white" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.tiktok.com/@menteoasis" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 transition text-white" aria-label="TikTok">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                            <a href="https://linktr.ee/psicoseverin" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 transition text-white" aria-label="Linktree">
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 dark:border-slate-900 pt-8 text-center text-slate-500 text-sm transition-colors duration-300">
                    <p>&copy; {new Date().getFullYear()} MenteOasis. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
