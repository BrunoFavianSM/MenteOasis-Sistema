import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1529156069896-859328862430?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

const Galeria = () => {
    const [images, setImages] = useState(FALLBACK_IMAGES);
    const [header, setHeader] = useState({
        badge: 'Nuestros Momentos',
        title: 'Galería',
        subtitle: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/gallery`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setImages(data.map(img => img.image_url));
                }

                // Fetch section header texts
                const resHeader = await fetch(`${API_URL}/api/content/gallery`);
                if (resHeader.ok) {
                    const headerData = await resHeader.json();
                    setHeader({
                        badge: headerData.badge || header.badge,
                        title: headerData.title || header.title,
                        subtitle: headerData.subtitle || header.subtitle
                    });
                }
            } catch (error) {
                console.log('Using fallback gallery data');
            }
        };
        fetchData();
    }, []);

    // Duplicate images for infinite scroll effect
    const duplicatedImages = [...images, ...images];

    return (
        <section id="galeria" className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative transition-colors duration-500">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

            <div className="container mx-auto px-6 mb-16">
                <div className="text-center">
                    <span className="text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase text-xs mb-4 block">
                        {header.badge}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        {header.title}
                    </h2>
                    {header.subtitle && (
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            {header.subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="relative w-full overflow-hidden group cursor-grab active:cursor-grabbing">
                {/* Subtle Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-8 w-max"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 40,
                            ease: 'linear',
                        },
                    }}
                    whileHover={{ transition: { duration: 1000 } }} // Slows down significantly on hover (effectively pausing)
                    drag="x"
                    dragConstraints={{ left: -1000, right: 1000 }} // Allow some manual play
                >
                    {duplicatedImages.map((img, index) => (
                        <div
                            key={index}
                            className="shrink-0 w-80 h-60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                        >
                            <img
                                src={img.startsWith('http') ? img : `${API_URL}${img}`}
                                alt={`Galería ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 pointer-events-none"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Galeria;
