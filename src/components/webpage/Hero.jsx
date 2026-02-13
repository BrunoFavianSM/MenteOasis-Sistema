import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    const phrases = [
        "Todo lo puedes",
        "Cristo me fortalece",
        "Sé tu propia inspiración",
        "No te quedes, busca ayuda",
        "Dios tiene un plan que lleva tu nombre",
        "No dejes de buscar",
        "Equilibra tu vida",
        "Potencia el talento que hay en ti",
        "Tú puedes, eres fuerte, capaz, valiente",
        "Eres autónomo, inteligente, amado"
    ];

    // Helper to generate positions focusing on sides to avoid center text
    const getPosition = (index) => {
        const isLeft = index % 2 === 0;
        // Divide into vertical slots to avoid overlap
        const slots = phrases.length;
        const slotHeight = 80 / slots;
        const top = (index * slotHeight) + 10 + (Math.random() * 5);

        // Horizontal: Left side (5-25%) or Right side (75-90%)
        const left = isLeft
            ? Math.random() * 20 + 5
            : Math.random() * 15 + 75;

        return { top: `${top}%`, left: `${left}%` };
    };

    return (
        <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-brand-200 dark:bg-brand-900 rounded-full blur-3xl opacity-50 dark:opacity-20 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-teal-200 dark:bg-teal-900 rounded-full blur-3xl opacity-50 dark:opacity-20 transition-colors duration-300" />

            {/* Motivational Phrases Background Animation - Random Side-to-Side Fade */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {phrases.map((phrase, index) => {
                    const randomDuration = Math.random() * 4 + 8; // 8-12 seconds
                    const randomDelay = Math.random() * 10;
                    const pos = getPosition(index);

                    return (
                        <motion.span
                            key={index}
                            className="absolute text-brand-700/40 dark:text-brand-300/30 font-handwriting text-xl md:text-2xl lg:text-3xl whitespace-nowrap select-none italic"
                            style={{
                                top: pos.top,
                                left: pos.left,
                                fontSize: `${Math.random() * 0.5 + 1.2}rem`
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                y: -60
                            }}
                            transition={{
                                duration: randomDuration,
                                delay: randomDelay,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 6
                            }}
                        >
                            {phrase}
                        </motion.span>
                    );
                })}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative inline-block mb-6 pt-1">
                            {/* Outer Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-400 to-teal-400 rounded-full blur opacity-30 animate-pulse" />

                            <motion.span
                                animate={{
                                    scale: [1, 1.02, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative flex items-center gap-2 py-1.5 px-5 rounded-full bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900/50 shadow-sm overflow-hidden group"
                            >
                                {/* Shimmer Effect overlay */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-brand-400/10 to-transparent -translate-x-full animate-shimmer" />

                                <Sparkles size={14} className="text-brand-500 animate-pulse" />
                                <span className="bg-gradient-to-r from-brand-700 to-brand-500 dark:from-brand-300 dark:to-teal-300 bg-clip-text text-transparent text-sm font-bold tracking-tight">
                                    Dios tiene un plan que lleva tu nombre
                                </span>
                            </motion.span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
                            Encuentra el equilibrio en <span className="text-brand-600 dark:text-brand-400">MenteOasis</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed transition-colors duration-300">
                            Un enfoque profesional y humano para tu bienestar emocional.
                            Descubre nuestros servicios diseñados para ti".
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="#services"
                                className="px-8 py-4 bg-brand-600 text-white rounded-full font-semibold hover:bg-brand-700 dark:hover:bg-brand-500 transition w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-brand-200 dark:shadow-none"
                            >
                                Ver Servicios <ArrowRight size={20} />
                            </a>
                            <a
                                href="#contact"
                                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition w-full sm:w-auto"
                            >
                                Contáctanos
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
