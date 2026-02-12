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
        <div className="absolute inset-0 z-0 bg-slate-900">
            <AnimatePresence mode="popLayout">
                {isActive && (
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt="Activity evidence"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.6, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
            </AnimatePresence>
            {/* Overlay gradient to ensure text readability */}
            <div className={`absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/80 to-teal-900/40 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-900/40 transition-opacity duration-300 ${isActive ? 'opacity-90' : 'opacity-100'}`} />
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
            className="group relative p-8 rounded-3xl bg-teal-900/40 dark:bg-slate-800/40 border border-teal-800 dark:border-slate-700 overflow-hidden flex flex-col items-center text-center h-full min-h-[350px]"
        >
            <ImageSlideshow images={activity.images} isActive={isHovered} />

            <div className="relative z-10 flex flex-col h-full items-center transition-transform duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-teal-800/80 dark:bg-slate-700/80 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-teal-700 dark:border-slate-600 transition-transform group-hover:scale-110 shadow-lg">
                    {activity.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-teal-300 dark:group-hover:text-brand-300 transition-colors">
                    {activity.title}
                </h3>
                <p className={`text-teal-100/90 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-grow transition-opacity duration-300 ${isHovered ? 'opacity-100 font-medium' : 'opacity-80'}`}>
                    {activity.description}
                </p>

                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal-300 dark:text-brand-400 transition-all duration-300 ${isHovered ? 'scale-110' : 'opacity-60'}`}>
                    {isHovered ? (
                        <>
                            <ArrowRight className="w-4 h-4" /> Ver Galería
                        </>
                    ) : (
                        <>
                            <Star className="w-3 h-3" /> Acción Social
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SocialWork;
