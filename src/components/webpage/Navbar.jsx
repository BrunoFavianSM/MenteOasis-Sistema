import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useMusic } from '../../context/MusicContext';

import logoAnimado from '../../assets/logoanimado.mp4';
import logoAnimadoOscuro from '../../assets/logoanimadooscuro.mp4';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Navbar = () => {
    const [loginClicks, setLoginClicks] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { isMuted, toggleMute } = useMusic();
    const [menuLabels, setMenuLabels] = useState({
        home: 'Inicio',
        about: 'Nosotros',
        services: 'Servicios',
        workshops: 'Talleres',
        social: 'Labor Social',
        events: 'Eventos',
        contact: 'Reservar Cita'
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const fetchMenuLabels = async () => {
            try {
                const res = await fetch(`${API_URL}/api/content/menu`);
                if (res.ok) {
                    const data = await res.json();
                    if (Object.keys(data).length > 0) {
                        setMenuLabels(prev => ({ ...prev, ...data }));
                    }
                }
            } catch (error) {
                console.log('Using default menu labels');
            }
        };

        fetchMenuLabels();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: menuLabels.home, href: '#home' },
        { name: menuLabels.about, href: '#about' },
        { name: menuLabels.services, href: '#services' },
        { name: menuLabels.workshops, href: '#workshops' },
        { name: menuLabels.social, href: '#social-work' },
        { name: menuLabels.events, href: '#events' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-[color-mix(in_oklab,var(--color-slate-950)_95%,transparent)] backdrop-blur-md border-b border-slate-100 py-4' : 'bg-transparent dark:bg-[color-mix(in_oklab,var(--color-slate-950)_95%,transparent)] py-6'} dark:border-slate-800`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div
                    onClick={() => {
                        const newClicks = loginClicks + 1;
                        setLoginClicks(newClicks);
                        if (newClicks >= 3) {
                            window.location.href = '/login';
                        }
                        setTimeout(() => setLoginClicks(0), 2000);
                    }}
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <video
                        src={theme === 'dark' ? logoAnimadoOscuro : logoAnimado}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-10 h-10 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">MenteOasis</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white transition-colors uppercase tracking-widest"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                            title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        {/* Music Toggle Button */}
                        <button
                            onClick={toggleMute}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                            title={isMuted ? "Reanudar música" : "Silenciar música"}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>

                    <a
                        href="#contact"
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-brand-600 dark:hover:bg-brand-300 transition-colors duration-300"
                    >
                        {menuLabels.contact}
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-900 dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex gap-4 py-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
                                >
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                    {theme === 'dark' ? 'Claro' : 'Oscuro'}
                                </button>
                                <button
                                    onClick={toggleMute}
                                    className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
                                >
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    {isMuted ? 'Sonido' : 'Silencio'}
                                </button>
                            </div>
                            <a
                                href="#contact"
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center font-bold rounded-xl hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {menuLabels.contact}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
