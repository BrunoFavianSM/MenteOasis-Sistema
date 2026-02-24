import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FALLBACK = {
    contact_phone: '+51 962268667',
    contact_email: 'psicoseverino@gmail.com',
    contact_address: 'Av. E-9, Av. Mariscal Cáceres 43, Talara 20811',
    social_facebook: 'https://www.facebook.com/MenteOasisPsicologiaPeru',
    social_instagram: 'https://www.instagram.com/menteoasis_psic/',
    social_tiktok: 'https://www.tiktok.com/@menteoasis',
    social_linktree: 'https://linktr.ee/psicoseverin',
};

const Footer = () => {
    const [content, setContent] = useState(FALLBACK);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/content/footer`);
                if (res.ok) {
                    const data = await res.json();
                    setContent(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.log('Using fallback footer data');
            }
        };
        fetchData();
    }, []);

    return (
        <footer className="bg-slate-50 dark:bg-transparent text-slate-600 dark:text-slate-400 pt-20 pb-10 transition-colors duration-300 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 text-brand-700 dark:text-white font-bold text-2xl mb-6">
                            <img src="/logo.webp" alt="MenteOasis Logo" className="w-12 h-12 object-contain" />
                            <span>MenteOasis</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Tu compañero en el camino hacia el bienestar mental y emocional.
                            Profesionales comprometidos contigo.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            <li><a href="#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Nosotros</a></li>
                            <li><a href="#services" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Servicios</a></li>
                            <li><a href="#workshops" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Talleres</a></li>
                            <li><a href="#events" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Eventos</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 w-5 h-5 text-brand-600 dark:text-brand-400" />
                                <span>{content.contact_address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                <span>{content.contact_phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                <span>{content.contact_email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Síguenos</h4>
                        <div className="flex gap-4">
                            <a href={content.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white transition text-slate-600 dark:text-white shadow-sm" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href={content.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white transition text-slate-600 dark:text-white shadow-sm" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href={content.social_tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white transition text-slate-600 dark:text-white shadow-sm" aria-label="TikTok">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                            <a href={content.social_linktree} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white transition text-slate-600 dark:text-white shadow-sm" aria-label="Linktree">
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-900 pt-8 text-center text-slate-500 text-sm transition-colors duration-300">
                    <p>&copy; {new Date().getFullYear()} MenteOasis. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
