import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-50">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-50" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6">
                            Tu espacio de tranquilidad
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Encuentra el equilibrio en <span className="text-brand-600">MenteOasis</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Un enfoque profesional y humano para tu bienestar emocional.
                            Descubre nuestras terapias, talleres y recursos diseñados para ti.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="#services"
                                className="px-8 py-4 bg-brand-600 text-white rounded-full font-semibold hover:bg-brand-700 transition w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
                            >
                                Ver Servicios <ArrowRight size={20} />
                            </a>
                            <a
                                href="#contact"
                                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition w-full sm:w-auto"
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
