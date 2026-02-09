import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const About = () => {
    const benefits = [
        "Profesionales licenciados y especializados",
        "Ambiente seguro y confidencial",
        "Enfoque integrador y personalizado",
        "Horarios flexibles y atención online"
    ];

    return (
        <section id="about" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="absolute inset-0 bg-brand-200 dark:bg-brand-900/30 rounded-2xl transform rotate-3 scale-105 opacity-30 transition-colors duration-300" />
                        <img
                            src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Psicóloga profesional en sesión de terapia individual en MenteOasis"
                            className="rounded-2xl shadow-xl w-full object-cover h-[400px] lg:h-[500px] relative z-10"
                        />
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 transition-colors duration-300">Sobre MenteOasis</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed transition-colors duration-300">
                            En MenteOasis, nos dedicamos a proporcionar un refugio para tu mente.
                            Somos un equipo de profesionales comprometidos con tu bienestar emocional,
                            ofreciendo herramientas prácticas y apoyo profesional para superar los
                            desafíos de la vida diaria.
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed transition-colors duration-300">
                            Nuestro objetivo no es solo tratar síntomas, sino ayudarte a construir
                            una vida plena y significativa a través del autoconocimiento y el crecimiento personal.
                        </p>

                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-brand-500 dark:text-brand-400 w-5 h-5 flex-shrink-0 transition-colors duration-300" />
                                    <span className="text-slate-700 dark:text-slate-200 transition-colors duration-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
