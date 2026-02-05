import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, Laptop, Camera, Star, HandHeart, GraduationCap, Utensils } from 'lucide-react';

const SocialWork = () => {
    const [expanded, setExpanded] = useState(false);

    const activities = [
        {
            title: "Día del Autismo",
            description: "Organización integral de actividades recreativas y terapéuticas gratuitas para niños, asumiendo todos los gastos operativos.",
            image: "https://images.unsplash.com/photo-1596387431189-53e990c00829?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: <Heart className="w-5 h-5" />
        },
        {
            title: "Talleres Técnicos (Software)",
            description: "Cursos de alta capacitación como 'Ingeniería de Software' destinados a jóvenes talentosos con recursos económicos limitados.",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: <Laptop className="w-5 h-5" />
        },
        {
            title: "Apoyo Comunitario",
            description: "Asistencia directa a personas en situación de calle y actividades con cobros simbólicos para fomentar la inclusión social.",
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: <Users className="w-5 h-5" />
        },
        // Nuevas Actividades
        {
            title: "Campaña de Salud Mental",
            description: "Charlas y diagnósticos gratuitos en zonas vulnerables, acercando la psicología a quienes no tienen acceso.",
            image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: <HandHeart className="w-5 h-5" />
        },
        {
            title: "Becas 'Futuro Brillante'",
            description: "Apoyo financiero y mentoring para estudiantes de secundaria con alto rendimiento académico.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: <GraduationCap className="w-5 h-5" />
        },
        {
            title: "Comedor Solidario",
            description: "Iniciativa mensual donde compartimos alimentos y momentos de calidad con comunidades necesitadas.",
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: <Utensils className="w-5 h-5" />
        }
    ];

    const visibleActivities = expanded ? activities : activities.slice(0, 3);

    return (
        <section id="social-work" className="py-24 bg-teal-950 dark:bg-slate-900 text-white relative overflow-hidden transition-colors duration-300">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#115e59_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-800/50 dark:bg-slate-800/50 rounded-full text-teal-200 dark:text-brand-300 text-sm font-semibold mb-6 border border-teal-700 dark:border-slate-700 backdrop-blur-sm transition-colors duration-300">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>Compromiso Social MenteOasis</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Responsabilidad Social
                        </h2>
                        <p className="text-xl text-teal-100/90 dark:text-slate-300 leading-relaxed font-light transition-colors duration-300">
                            Más que una empresa, somos un agente de cambio. Nuestro área de Responsabilidad Social
                            se dedica al servicio directo, creando impacto tangible en la comunidad a través de
                            eventos, educación y asistencia humanitaria.
                        </p>
                    </motion.div>
                </div>

                {/* Evidence Gallery */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <AnimatePresence>
                        {visibleActivities.map((activity, index) => (
                            <motion.div
                                key={activity.title || index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
                            >
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/40 to-transparent dark:from-slate-950 dark:via-slate-950/40 opacity-90 transition-opacity group-hover:opacity-80 transition-colors duration-300" />

                                <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-white transition-colors duration-300">
                                        {activity.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{activity.title}</h3>
                                    <p className="text-teal-100 dark:text-slate-300 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 h-0 group-hover:h-auto overflow-hidden">
                                        {activity.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300 dark:text-brand-400 transition-colors duration-300">
                                        <Camera className="w-4 h-4" />
                                        Evidencia de Actividad
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="px-8 py-3 bg-teal-800 dark:bg-slate-800 text-teal-100 dark:text-slate-200 border-2 border-teal-700 dark:border-slate-700 rounded-full font-bold hover:bg-teal-700 dark:hover:bg-slate-700 hover:border-teal-600 dark:hover:border-slate-600 transition-all duration-300 shadow-lg"
                    >
                        {expanded ? "Ver Menos Actividades" : "Ver Más Evidencias"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SocialWork;
