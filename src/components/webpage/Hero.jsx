import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FALLBACK_PHRASES = [
    "Todo lo puedes", "Cristo me fortalece", "Sé tu propia inspiración",
    "No te quedes, busca ayuda", "Dios tiene un plan que lleva tu nombre",
    "No dejes de buscar", "Equilibra tu vida", "Potencia el talento que hay en ti",
    "Tú puedes, eres fuerte, capaz, valiente", "Eres autónomo, inteligente, amado"
];

const FALLBACK_CONTENT = {
    badge_text: 'Tu bienestar es prioridad',
    title_line1: 'Encuentra tu paz',
    title_line2: 'interior hoy.',
    subtitle: 'Espacio seguro para tu crecimiento emocional. Terapia profesional adaptada a tus necesidades en Talara.',
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    cta_primary_text: 'Ver Servicios',
    cta_secondary_text: 'Contáctanos',
};

const Hero = () => {
    const [content, setContent] = useState(FALLBACK_CONTENT);
    const [phrases, setPhrases] = useState(FALLBACK_PHRASES);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contentRes, phrasesRes] = await Promise.all([
                    fetch(`${API_URL}/api/content/hero`),
                    fetch(`${API_URL}/api/hero-phrases`)
                ]);
                if (contentRes.ok) {
                    const data = await contentRes.json();
                    setContent(prev => ({ ...prev, ...data }));
                }
                if (phrasesRes.ok) {
                    const data = await phrasesRes.json();
                    if (data.length > 0) setPhrases(data.map(p => p.text));
                }
            } catch (error) {
                console.log('Using fallback hero data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [phrases.length]);

    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-50 dark:bg-transparent transition-colors duration-300">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="text-sm font-semibold text-brand-700 dark:text-brand-400 tracking-wide uppercase">{content.badge_text}</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                            {content.title_line1} <br />
                            <span className="text-brand-600 dark:text-brand-500">{content.title_line2}</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                            {content.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#services"
                                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                {content.cta_primary_text} <ArrowRight size={20} />
                            </a>
                            <a
                                href="#contact"
                                className="px-8 py-4 bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-full font-bold hover:border-slate-900 dark:hover:border-white transition-colors duration-300 w-full sm:w-auto flex items-center justify-center"
                            >
                                {content.cta_secondary_text}
                            </a>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:w-1/2 relative flex justify-center"
                    >
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 max-h-[75vh] w-auto">
                            <img
                                src={content.image_url.startsWith('http') ? content.image_url : `${API_URL}${content.image_url}`}
                                alt="Sesión de terapia relajante"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-100/50 dark:bg-brand-900/20 rounded-full blur-3xl opacity-50" />

                        {/* Floating Phrases */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-8 -left-4 md:-left-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-10 max-w-[200px]"
                        >
                            <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recordatorio</p>
                                <motion.p
                                    key={currentPhraseIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-sm font-bold text-slate-900 dark:text-white leading-tight"
                                >
                                    {phrases[currentPhraseIndex]}
                                </motion.p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-12 -right-4 md:-right-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-10 max-w-[200px]"
                        >
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                <span className="text-lg">💪</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fortaleza</p>
                                <motion.p
                                    key={currentPhraseIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-sm font-bold text-slate-900 dark:text-white leading-tight"
                                >
                                    {phrases[(currentPhraseIndex + 5) % phrases.length]}
                                </motion.p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;