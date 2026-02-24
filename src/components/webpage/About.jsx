import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FALLBACK = {
    badge_text: 'Nuestra Esencia',
    title_line1: 'Un refugio para',
    title_line2: 'tu mente.',
    paragraph1: 'Somos un equipo de profesionales comprometidos con tu bienestar emocional, ofreciendo herramientas prácticas y apoyo profesional para superar los desafíos de la vida diaria.',
    paragraph2: 'Nuestro objetivo no es solo tratar síntomas, sino ayudarte a construir una vida plena y significativa a través del autoconocimiento.',
    image_url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    benefit1: 'Profesionales licenciados y especializados',
    benefit2: 'Ambiente seguro y confidencial',
    benefit3: 'Enfoque integrador y personalizado',
    benefit4: 'Horarios flexibles y atención online',
};

const About = () => {
    const [content, setContent] = useState(FALLBACK);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/content/about`);
                if (res.ok) {
                    const data = await res.json();
                    setContent(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.log('Using fallback about data');
            }
        };
        fetchData();
    }, []);

    const benefits = [content.benefit1, content.benefit2, content.benefit3, content.benefit4].filter(Boolean);

    return (
        <section id="about" className="py-24 bg-white dark:bg-transparent transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <img
                                src={content.image_url.startsWith('http') ? content.image_url : `${API_URL}${content.image_url}`}
                                alt="Psicóloga profesional en sesión de terapia individual en MenteOasis"
                                className="w-full h-[500px] object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-50 dark:bg-slate-800 rounded-full -z-10" />
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-bold text-slate-800 dark:text-white tracking-widest uppercase">{content.badge_text}</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                            {content.title_line1} <br />
                            <span className="text-brand-600 dark:text-brand-400">{content.title_line2}</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            {content.paragraph1}
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            {content.paragraph2}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                                    <CheckCircle2 className="text-brand-600 dark:text-brand-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-snug">{benefit}</span>
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
