import React, { useState, useEffect } from 'react';
import { Menu, X, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#" className="flex items-center gap-2 text-2xl font-bold text-brand-700">
                    <Brain className="w-8 h-8" />
                    <span>MenteOasis</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                    >
                        Contacto
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-slate-700" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-slate-600 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                className="text-brand-600 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Contacto
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
