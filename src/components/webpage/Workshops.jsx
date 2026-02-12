import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Palette, BrainCircuit, Users, Star, CalendarDays, Briefcase, GraduationCap, Sparkles, ChevronDown } from 'lucide-react';

const Workshops = () => {
    const [expandedCategory, setExpandedCategory] = useState(null);

    const categories = [
        {
            id: 'adults-gam',
            title: "Talleres para Adultos y Adolescentes (GAM)",
            description: "Espacios de crecimiento y grupos de ayuda mutua.",
            icon: <Users className="w-6 h-6" />,
            color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
            image: "https://images.unsplash.com/photo-1529156069896-859328862430?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            items: [
                { title: "Manejo de la Ansiedad (GAM)", desc: "Grupo de apoyo para compartir y aprender estrategias de afrontamiento." },
                { title: "Habilidades Sociales para Adolescentes", desc: "Mejora la comunicación y confianza en situaciones sociales." },
                { title: "Gestión Emocional", desc: "Aprende a identificar y regular tus emociones de manera saludable." }
            ]
        },
        {
            id: 'shows',
            title: "Shows Sensoriales y Eventos con Propósito",
            description: "Experiencias mágicas para cumpleaños y fechas especiales.",
            icon: <Sparkles className="w-6 h-6" />,
            color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            items: [
                { title: "Cumpleaños Sensoriales", desc: "Celebraciones adaptadas con estímulos controlados y divertidos." },
                { title: "Día del Niño Inclusivo", desc: "Eventos diseñados para que todos disfruten por igual." },
                { title: "Activaciones con Propósito", desc: "Eventos que educan y entretienen." }
            ]
        },
        {
            id: 'corporate',
            title: "Servicios Corporativos",
            description: "Potenciamos el bienestar y rendimiento en tu empresa.",
            icon: <Briefcase className="w-6 h-6" />,
            color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            items: [
                { title: "Manejo del Estrés Laboral", desc: "Técnicas prácticas para equipos de alto rendimiento." },
                { title: "Liderazgo Empático", desc: "Formación para líderes que inspiran." },
                { title: "Clima Laboral Positivo", desc: "Dinámicas de integración y comunicación." }
            ]
        },
        {
            id: 'educational',
            title: "Talleres Educativos y de Desarrollo (STEAM)",
            description: "Ingeniería, Arte y Habilidades para el futuro.",
            icon: <BrainCircuit className="w-6 h-6" />,
            color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            items: [
                { title: "Habilidades de Ingeniería", desc: "Construcción con bloques, retos prácticos, armado y desarmado de sistemas." },
                { title: "Psico Expresa", desc: "Gestión de emociones, teatro, autoestima, empatía y comunicación." },
                { title: "Habilidades Blandas", desc: "Liderazgo, trabajo en equipo, resolución de conflictos y tolerancia al estrés." },
                { title: "Habilidades Artísticas", desc: "Música (lectura, instrumentos), dibujo, pintura y manualidades." },
                { title: "Habilidades Cognitivas", desc: "Atención, memoria, planificación y razonamiento." }
            ]
        },
        {
            id: 'institutional',
            title: "Servicios Institucionales",
            description: "Programas integrales para colegios y universidades.",
            icon: <GraduationCap className="w-6 h-6" />,
            color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            items: [
                { title: "Escuela para Padres", desc: "Orientación en crianza respetuosa y límites." },
                { title: "Capacitación Docente", desc: "Estrategias de manejo conductual en el aula." },
                { title: "Prevención del Bullying", desc: "Programas de convivencia escolar." }
            ]
        }
    ];

    const toggleCategory = (id) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };

    return (
        <section id="workshops" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-200/40 dark:bg-brand-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 rounded-full text-sm font-bold mb-4">
                            <Star className="w-4 h-4 fill-brand-700 dark:fill-brand-300" />
                            <span>Programas Especializados</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                            Talleres y Experiencias
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Descubre nuestros espacios diseñados para cada etapa y necesidad.
                            <span className="font-semibold text-brand-600 dark:text-brand-400"> Haz clic en una categoría para ver más.</span>
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <motion.div
                            layout
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 ${expandedCategory === category.id
                                    ? 'col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 shadow-2xl ring-2 ring-brand-500/20'
                                    : 'bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <motion.div layout className="relative h-48 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors" />
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className={`inline-flex p-2 rounded-xl mb-3 ${category.color} backdrop-blur-md bg-white/90 dark:bg-slate-900/80`}>
                                                {category.icon}
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 shadow-sm">
                                                {category.title}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                                            className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white"
                                        >
                                            <ChevronDown className="w-6 h-6" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {expandedCategory === category.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-slate-100 dark:border-slate-700"
                                    >
                                        <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-800/50">
                                            {category.items.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-600/50 hover:border-brand-200 dark:hover:border-brand-500/30 transition-colors"
                                                >
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-brand-500" />
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                                        {item.desc}
                                                    </p>
                                                </motion.div>
                                            ))}
                                            <div className="md:col-span-2 lg:col-span-3 mt-4 text-center">
                                                <button className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-500/20">
                                                    Solicitar Información sobre estos Talleres
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Workshops;
