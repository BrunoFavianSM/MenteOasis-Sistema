import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Laptop, Users, GraduationCap, Star, ArrowRight } from 'lucide-react';

const SocialWork = () => {
    const activities = [
        {
            title: "Banco de Fe",
            description: "Apoyo espiritual y emocional en momentos de crisis. Recolectamos utensilios de primera necesidad entregados con mensajes de esperanza y crecimiento espiritual.",
            icon: <Heart className="w-6 h-6" />,
            images: [
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            title: "Talleres Técnicos (Adultos)",
            description: "Impulsamos el emprendimiento y la vocación. Cursos de desarrollo personal y oficios para potenciar la autonomía económica.",
            icon: <Laptop className="w-6 h-6" />,
            images: [
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            title: "Talleres Educativos (Niños)",
            description: "Cursos breves para niños en situación vulnerable. Fomentamos habilidades que mejorarán sus futuras oportunidades de empleabilidad.",
            icon: <GraduationCap className="w-6 h-6" />,
            images: [
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1544928147-79a2e746b50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            title: "Días de Voluntariado",
            description: "Nuestro equipo en acción. Jornadas dedicadas a causas sociales donde vivimos la empatía y el servicio de primera mano.",
            icon: <Users className="w-6 h-6" />,
            images: [
                "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1596387431189-53e990c00829?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            title: "Programas de Mentoría",
            description: "Acompañamiento 1 a 1 para jóvenes líderes de sectores vulnerables. No es un taller, es una guía personalizada para su inserción profesional.",
            icon: <Users className="w-6 h-6" />,
            images: [
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        }
    ];


    return (
        <section id="social-work" className="py-24 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full text-slate-900 dark:text-white text-xs font-bold mb-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 uppercase tracking-wider">
                            <Star className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                            <span>Compromiso Social</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
                            Responsabilidad Social
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light transition-colors duration-300">
                            Más que una empresa, somos un agente de cambio. Nuestro área de Responsabilidad Social
                            se dedica al servicio directo, creando impacto tangible en la comunidad.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {activities.map((activity, index) => (
                        <CardWithSlideshow key={index} activity={activity} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Slideshow component for the cards
const ImageSlideshow = ({ images, isActive }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 2000); // Change image every 2 seconds
        } else {
            setCurrentIndex(0);
        }
        return () => clearInterval(interval);
    }, [isActive, images.length]);

    return (
        <div className="absolute inset-0 z-0 bg-slate-200 dark:bg-slate-900">
            <AnimatePresence mode="popLayout">
                {isActive && (
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt="Activity evidence"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
            </AnimatePresence>
            {/* Overlay gradient to ensure text readability */}
            <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-90' : 'opacity-0'}`} />
        </div>
    );
};

// Separated component to handle individual hover state
const CardWithSlideshow = ({ activity, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)} // Handle mobile tap
            className="group relative p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col items-center text-center h-full min-h-[400px] shadow-sm hover:shadow-xl transition-all duration-500"
        >
            <ImageSlideshow images={activity.images} isActive={isHovered} />

            <div className="relative z-10 flex flex-col h-full items-center justify-center transition-all duration-500 group-hover:justify-end">
                <div className={`w-16 h-16 bg-brand-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-brand-600 dark:text-white border border-brand-100 dark:border-slate-700 transition-all duration-500 shadow-sm ${isHovered ? 'scale-0 opacity-0 h-0 mb-0' : 'scale-100 opacity-100'}`}>
                    {activity.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-300 ${isHovered ? 'text-white translate-y-0' : 'translate-y-0'}`}>
                    {activity.title}
                </h3>
                <p className={`text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow transition-all duration-500 ${isHovered ? 'opacity-100 text-slate-200 max-h-40' : 'opacity-100 max-h-40'}`}>
                    {activity.description}
                </p>

                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 transition-all duration-300 ${isHovered ? 'text-white translate-y-0' : 'translate-y-4 opacity-0'}`}>
                    <ArrowRight className="w-4 h-4" /> Ver Galería
                </div>
            </div>
        </motion.div>
    );
};

export default SocialWork;
