import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Laptop, Users, GraduationCap, Star, ArrowRight, HeartPulse,
    HandHeart, Stethoscope, Brain, UserPlus, Sparkles, Activity, Shield,
    Sun, Moon, Zap, Smile, Target, Flower2, Lightbulb, Fingerprint, HelpCircle,
    X, Image as ImageIcon
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ICON_MAP = {
    Heart, Laptop, Users, GraduationCap, Star, HeartPulse, HandHeart,
    Stethoscope, Brain, UserPlus, Sparkles, Activity, Shield, Sun, Moon,
    Zap, Smile, Target, Flower2, Lightbulb, Fingerprint, HelpCircle
};

const getIcon = (name) => {
    const Icon = ICON_MAP[name] || Heart;
    return <Icon className="w-6 h-6" />;
};

const WatermarkedImage = ({ src, alt, className, innerClassName, isLarge = false }) => {
    return (
        <div
            className={`relative overflow-hidden select-none group/protected ${className}`}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover pointer-events-none transition-transform duration-700 ${innerClassName}`}
            />

            {/* Tiled Logo Watermark (Background) - More Visible */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.08]"
                style={{
                    backgroundImage: 'url("/logo.webp")',
                    backgroundSize: '80px',
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Central Logo Watermark - Stronger Presence */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                    src="/logo.webp"
                    alt="Watermark"
                    className="w-16 h-16 opacity-20 grayscale brightness-110"
                />
            </div>

            {/* Protective Overlay */}
            <div className="absolute inset-0 bg-transparent z-[5] cursor-default" />
        </div>
    );
};

const FALLBACK_ACTIVITIES = [
    { title: "Banco de Fe", description: "Apoyo espiritual y emocional en momentos de crisis.", icon_name: "Heart", images: ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"] },
    { title: "Talleres Técnicos (Adultos)", description: "Impulsamos el emprendimiento y la vocación.", icon_name: "Laptop", images: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"] },
    { title: "Talleres Educativos (Niños)", description: "Cursos breves para niños en situación vulnerable.", icon_name: "GraduationCap", images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"] },
    { title: "Días de Voluntariado", description: "Jornadas dedicadas a causas sociales.", icon_name: "Users", images: ["https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"] },
    { title: "Programas de Mentoría", description: "Acompañamiento 1 a 1 para jóvenes líderes.", icon_name: "Users", images: ["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"] },
];

const SocialWork = () => {
    const [activities, setActivities] = useState(FALLBACK_ACTIVITIES);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [header, setHeader] = useState({
        badge: 'Compromiso Social',
        title: 'Responsabilidad Social',
        subtitle: 'Más que una empresa, somos un agente de cambio. Nuestro área de Responsabilidad Social se dedica al servicio directo, creando impacto tangible en la comunidad.'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/social-activities`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setActivities(data);
                }

                // Fetch section header texts
                const resHeader = await fetch(`${API_URL}/api/content/social_work`);
                if (resHeader.ok) {
                    const headerData = await resHeader.json();
                    setHeader({
                        badge: headerData.badge || header.badge,
                        title: headerData.title || header.title,
                        subtitle: headerData.subtitle || header.subtitle
                    });
                }
            } catch (error) {
                console.log('Using fallback social activities data');
            }
        };
        fetchData();
    }, []);

    return (
        <section id="social-work" className="py-24 bg-slate-100 dark:bg-transparent text-slate-900 dark:text-white relative transition-colors duration-300">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full text-slate-900 dark:text-white text-xs font-bold mb-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 uppercase tracking-wider">
                            <Star className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                            <span>{header.badge}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
                            {header.title}
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light transition-colors duration-300">
                            {header.subtitle}
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {activities.map((activity, index) => (
                        <ActivityCard
                            key={activity.id || index}
                            activity={activity}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// SpeechBubbleGallery and Lightbox removed to prevent full image viewing as per user request.

const ActivityCard = ({ activity, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        let interval;
        if (isHovered && activity.images && activity.images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % activity.images.length);
            }, 1800);
        } else {
            setCurrentImageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, activity.images]);

    const images = activity.images || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 80 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative p-8 rounded-[3.5rem] bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 z-[10] overflow-hidden"
        >
            {/* Animated Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-[100px] transition-all duration-1000 ${isHovered ? 'opacity-100 scale-150' : 'opacity-40 group-hover:opacity-70'}`} />

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col h-full items-center">
                {/* Visual Header Area */}
                <div className="relative mb-8 w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-[2.5rem]">
                    <AnimatePresence mode="wait">
                        {isHovered && images.length > 0 ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 w-full h-full shadow-2xl"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full h-full"
                                    >
                                        <WatermarkedImage
                                            src={images[currentImageIndex].startsWith('http') ? images[currentImageIndex] : `${API_URL}${images[currentImageIndex]}`}
                                            alt="Vista previa"
                                            className="w-full h-full"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                                {/* Slide counter overlay */}
                                <div className="absolute bottom-5 right-5 px-4 py-1.5 bg-black/50 backdrop-blur-lg rounded-full border border-white/20 text-[9px] text-white font-black tracking-widest uppercase z-10">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="icon"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="w-24 h-24 bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-400 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(240,111,54,0.3)] transition-all duration-500 relative ring-8 ring-slate-50 dark:ring-slate-800/10"
                            >
                                <div className="scale-[1.6]">
                                    {getIcon(activity.icon_name)}
                                </div>
                                <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] animate-pulse pointer-events-none" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <h3 className="text-3xl font-black mb-4 text-slate-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-500 tracking-tighter">
                    {activity.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6 flex-grow font-light max-w-[320px]">
                    {activity.description}
                </p>

                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-500/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </motion.div>
    );
};

export default SocialWork;
