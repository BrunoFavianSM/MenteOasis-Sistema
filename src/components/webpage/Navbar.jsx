import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useMusic } from '../../context/MusicContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { isMuted, toggleMute } = useMusic();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Inicio', href: '#home' },
        { name: 'Nosotros', href: '#about' },
        { name: 'Servicios', href: '#services' },
        { name: 'Talleres', href: '#workshops' },
        { name: 'Responsabilidad Social', href: '#social-work' },
        { name: 'Eventos', href: '#events' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#" className="flex items-center gap-2 text-2xl font-bold text-brand-700 dark:text-brand-400 transition-colors">
                    <img src="/logo.webp" alt="MenteOasis Logo" className="w-12 h-12 object-contain" />
                    <span>MenteOasis</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`font-medium transition-colors ${scrolled
                                ? 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
                                : 'text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400'
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}

                    {/* Music Toggle Button */}
                    <button
                        onClick={toggleMute}
                        className="p-2 rounded-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center justify-center gap-2"
                        title={isMuted ? "Reanudar música" : "Silenciar música"}
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 text-slate-500" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-brand-600" />
                        )}
                    </button>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center justify-center gap-2 lg:w-28"
                        title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="w-5 h-5 text-yellow-500" />
                                <span className="text-xs font-semibold md:hidden lg:inline">Claro</span>
                            </>
                        ) : (
                            <>
                                <Moon className="w-5 h-5 text-brand-600" />
                                <span className="text-xs font-semibold md:hidden lg:inline">Oscuro</span>
                            </>
                        )}
                    </button>

                    <a
                        href="#contact"
                        className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 dark:shadow-none active:scale-95"
                    >
                        Contacto
                    </a>

                    <Link
                        to="/login"
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Iniciar sesión"
                    >
                        <LogIn className="w-5 h-5" />
                    </Link>
                </div>

                {/* Mobile Menu Button Group */}
                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
                        title={isMuted ? "Reanudar música" : "Silenciar música"}
                    >
                        {isMuted ? <VolumeX className="w-6 h-6 text-slate-500" /> : <Volume2 className="w-6 h-6 text-brand-600" />}
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
                    >
                        {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-brand-600" />}
                    </button>
                    <button className="p-2 text-slate-700 dark:text-slate-200" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-5">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-slate-600 dark:text-slate-300 font-medium text-lg hover:text-brand-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}

                            <div className="h-px bg-slate-100 dark:bg-slate-800" />

                            <a
                                href="#contact"
                                className="text-brand-600 dark:text-brand-400 font-bold text-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Contacto
                            </a>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                <LogIn className="w-5 h-5" />
                                Admin Login
                            </Link>

                            {/* Mobile specific theme toggle info */}
                            <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tema actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
                                <button
                                    onClick={() => { toggleTheme(); setIsOpen(false); }}
                                    className="px-4 py-2 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-brand-600 dark:text-brand-400"
                                >
                                    Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
