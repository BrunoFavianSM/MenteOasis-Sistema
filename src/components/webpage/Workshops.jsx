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
                { title: "Habilidades Blandas", desc: "Manejo del comportamiento, tolerancia al estrés, trabajo en equipo, liderazgo, resolución de conflictos, creatividad." },
                {
                    title: "Habilidades Artísticas", desc: "Lectura de partitura musical, tocar instrumentos de guitarra, teclado, melódica o violín, manualidades, dibujo y pintura."
                },
                {
                    title: "Habilidades Cognitivas", desc: "Atención y concentración, memoria, comprensión, planificación, razonamiento."
                }
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
        <section id="workshops" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase text-xs mb-4 block">Experiencias y Aprendizaje</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                            Talleres Especializados
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Espacios diseñados para el crecimiento personal y grupal.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`group cursor-pointer rounded-[2rem] overflow-hidden transition-all duration-300 border border-transparent ${expandedCategory === category.id
                                ? 'col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none'
                                : 'bg-white dark:bg-slate-950 hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <div className="relative p-8">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-start gap-6">
                                        <div className={`shrink-0 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300`}>
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                                                {category.title}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-slate-50 dark:bg-slate-900 p-2 rounded-full text-slate-400 dark:text-slate-500"
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedCategory === category.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="border-t border-slate-100 dark:border-slate-800"
                                    >
                                        <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-900/50">
                                            {category.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800"
                                                >
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            ))}
                                            <div className="md:col-span-2 lg:col-span-3 mt-4 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("Solicitar información");
                                                    }}
                                                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:opacity-90 transition-opacity"
                                                >
                                                    Solicitar Información
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Workshops;
