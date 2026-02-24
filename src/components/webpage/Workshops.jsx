import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Sparkles, Briefcase, BrainCircuit, GraduationCap, BookOpen,
    ChevronDown, Brain, Activity, Shield, Sun, Moon, Zap, Smile, Heart,
    HeartPulse, Target, Flower2, Lightbulb, Fingerprint, HelpCircle, UserPlus
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ICON_MAP = {
    Users, Sparkles, Briefcase, BrainCircuit, GraduationCap, BookOpen,
    Brain, Activity, Shield, Sun, Moon, Zap, Smile, Heart, HeartPulse,
    Target, Flower2, Lightbulb, Fingerprint, HelpCircle, UserPlus
};

const getIcon = (name) => {
    const Icon = ICON_MAP[name] || BookOpen;
    return <Icon className="w-6 h-6" />;
};

const FALLBACK_CATEGORIES = [
    { id: 1, title: "Talleres para Adultos y Adolescentes (GAM)", description: "Espacios de crecimiento y grupos de ayuda mutua.", icon_name: "Users", color_class: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400", items: [{ title: "Manejo de la Ansiedad (GAM)", description: "Grupo de apoyo para compartir y aprender estrategias de afrontamiento." }] },
    { id: 2, title: "Servicios Corporativos", description: "Potenciamos el bienestar y rendimiento en tu empresa.", icon_name: "Briefcase", color_class: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", items: [{ title: "Manejo del Estrés Laboral", description: "Técnicas prácticas para equipos de alto rendimiento." }] },
];

const Workshops = () => {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
    const [header, setHeader] = useState({
        badge: 'Experiencias y Aprendizaje',
        title: 'Talleres Especializados',
        subtitle: 'Espacios diseñados para el crecimiento personal y grupal.'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/workshops`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setCategories(data);
                }

                // Fetch section header texts
                const resHeader = await fetch(`${API_URL}/api/content/workshops`);
                if (resHeader.ok) {
                    const headerData = await resHeader.json();
                    setHeader({
                        badge: headerData.badge || header.badge,
                        title: headerData.title || header.title,
                        subtitle: headerData.subtitle || header.subtitle
                    });
                }
            } catch (error) {
                console.log('Using fallback workshops data');
            }
        };
        fetchData();
    }, []);

    const toggleCategory = (id) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };

    return (
        <section id="workshops" className="py-24 bg-slate-50 dark:bg-transparent transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase text-xs mb-4 block">
                            {header.badge}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                            {header.title}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            {header.subtitle}
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`group cursor-pointer rounded-[2rem] overflow-hidden transition-all duration-300 border border-transparent ${expandedCategory === category.id
                                ? 'col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-950/80 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none'
                                : 'bg-white dark:bg-slate-900/60 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <div className="relative p-8">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-start gap-6">
                                        <div className={`shrink-0 p-4 rounded-2xl transition-colors duration-300 ${category.color_class}`}>
                                            {getIcon(category.icon_name)}
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
                                            {(category.items || []).map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800"
                                                >
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {item.description || item.desc}
                                                    </p>
                                                </div>
                                            ))}
                                            <div className="md:col-span-2 lg:col-span-3 mt-4 text-center">
                                                <a
                                                    href="#contact"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-block px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:bg-brand-600 dark:hover:bg-brand-400 transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-wider"
                                                >
                                                    Solicitar Información
                                                </a>
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
