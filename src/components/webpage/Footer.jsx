import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Brain } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-8">
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
                                <span>+123 456 7890</span>
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
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition text-white">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition text-white">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition text-white">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} MenteOasis. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
