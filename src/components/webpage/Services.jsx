import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Users, HeartHandshake, Phone, BookOpen, Star, Briefcase, BrainCircuit,
    GraduationCap, Heart, Laptop, Sparkles, Stethoscope, Brain, HandHeart,
    Activity, Shield, Sun, Moon, Zap, Smile, HeartPulse, Target, Flower2,
    Lightbulb, HelpCircle, UserPlus, Fingerprint
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ICON_MAP = {
    User, Users, HeartHandshake, Phone, BookOpen, Star, Briefcase, BrainCircuit,
    GraduationCap, Heart, Laptop, Sparkles, Stethoscope, Brain, HandHeart,
    Activity, Shield, Sun, Moon, Zap, Smile, HeartPulse, Target, Flower2,
    Lightbulb, HelpCircle, UserPlus, Fingerprint
};

const getIcon = (name) => {
    const Icon = ICON_MAP[name] || User;
    return <Icon className="w-8 h-8" />;
};

const FALLBACK_SERVICES = [
    { title: "Terapia Individual", description: "Atención 100% personalizada. Desde el manejo de ansiedad y depresión hasta el desarrollo personal.", icon_name: "User" },
    { title: "Terapia de Pareja", description: "Recuperen la armonía o transformen sus conflictos en acuerdos constructivos.", icon_name: "HeartHandshake" },
    { title: "Terapia Virtual", description: "Tu bienestar no tiene fronteras. Accede a terapia profesional desde la comodidad de tu hogar.", icon_name: "Phone" },
    { title: "Terapia Familiar", description: "Fortalece los lazos que importan. Intervención sistémica para resolver conflictos.", icon_name: "Users" },
    { title: "Talleres Educativos y de desarrollo", description: "Espacios de aprendizaje activo para potenciar habilidades clave.", icon_name: "BookOpen" },
    { title: "Talleres para Adultos", description: "Programas diseñados para el crecimiento personal y gestión emocional.", icon_name: "User" },
    { title: "Shows sensoriales y eventos", description: "Experiencias inmersivas con propósito, diseñadas para estimular los sentidos.", icon_name: "Star" },
    { title: "Servicios Corporativos & Institucionales", description: "Charlas, talleres y capacitaciones de alto impacto.", icon_name: "Users" },
];

const Services = () => {
    const [services, setServices] = useState(FALLBACK_SERVICES);
    const [header, setHeader] = useState({
        badge: 'Nuestros Servicios',
        title: 'Soluciones profesionales',
        subtitle: 'adaptadas a tu momento de vida.'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch services items
                const resItems = await fetch(`${API_URL}/api/services`);
                if (resItems.ok) {
                    const data = await resItems.json();
                    if (data.length > 0) setServices(data);
                }

                // Fetch section header texts
                const resHeader = await fetch(`${API_URL}/api/content/services`);
                if (resHeader.ok) {
                    const headerData = await resHeader.json();
                    setHeader({
                        badge: headerData.badge || header.badge,
                        title: headerData.title || header.title,
                        subtitle: headerData.subtitle || header.subtitle
                    });
                }
            } catch (error) {
                console.log('Using fallback services data');
            }
        };
        fetchData();
    }, []);

    return (
        <section id="services" className="py-24 bg-white dark:bg-transparent transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-bold mb-4 uppercase tracking-wider">
                        {header.badge}
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                        {header.title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {header.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-slate-50 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-white dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-none transition-all duration-300 border border-slate-100 dark:border-slate-700 group-hover:border-brand-100 dark:group-hover:border-brand-900/50">
                                <span className="text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    {getIcon(service.icon_name)}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{service.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
