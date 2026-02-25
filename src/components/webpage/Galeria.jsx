import React, { useState, useEffect, useRef, useCallback } from 'react';

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

    const containerRef = useRef(null);
    const xRef = useRef(0);
    const isDraggingRef = useRef(false);
    const isPausedRef = useRef(false);
    const lastClientXRef = useRef(0);
    const rafId = useRef(null);
    const lastTimeRef = useRef(performance.now());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/gallery`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setImages(data.map(img => img.image_url));
                }

                const resHeader = await fetch(`${API_URL}/api/content/gallery`);
                if (resHeader.ok) {
                    const headerData = await resHeader.json();
                    setHeader(prev => ({
                        badge: headerData.badge || prev.badge,
                        title: headerData.title || prev.title,
                        subtitle: headerData.subtitle || prev.subtitle
                    }));
                }
            } catch (error) {
                console.log('Using fallback gallery data');
            }
        };
        fetchData();
    }, []);

    // Animation Loop — runs continuously via requestAnimationFrame
    useEffect(() => {
        const animate = (time) => {
            if (!isDraggingRef.current && !isPausedRef.current && containerRef.current) {
                const deltaTime = time - lastTimeRef.current;
                const speed = 0.05; // px per ms
                xRef.current -= speed * deltaTime;

                const halfWidth = containerRef.current.scrollWidth / 2;
                if (Math.abs(halfWidth) > 0) {
                    if (xRef.current <= -halfWidth) {
                        xRef.current += halfWidth;
                    } else if (xRef.current > 0) {
                        xRef.current -= halfWidth;
                    }
                }

                containerRef.current.style.transform = `translateX(${xRef.current}px)`;
            }
            lastTimeRef.current = time;
            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    // --- Mouse/Touch Drag Handlers (no framer-motion) ---
    const handlePointerDown = useCallback((e) => {
        isDraggingRef.current = true;
        lastClientXRef.current = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        // Prevent text selection while dragging
        e.preventDefault();
    }, []);

    const handlePointerMove = useCallback((e) => {
        if (!isDraggingRef.current || !containerRef.current) return;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const delta = clientX - lastClientXRef.current;
        lastClientXRef.current = clientX;

        xRef.current += delta;

        const halfWidth = containerRef.current.scrollWidth / 2;
        if (Math.abs(halfWidth) > 0) {
            if (xRef.current <= -halfWidth) {
                xRef.current += halfWidth;
            } else if (xRef.current > 0) {
                xRef.current -= halfWidth;
            }
        }

        containerRef.current.style.transform = `translateX(${xRef.current}px)`;
    }, []);

    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;
    }, []);

    const handleMouseEnter = useCallback(() => {
        isPausedRef.current = true;
    }, []);

    const handleMouseLeave = useCallback(() => {
        isPausedRef.current = false;
        isDraggingRef.current = false;
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

            <div className="relative w-full overflow-hidden group">
                {/* Subtle Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                <div
                    ref={containerRef}
                    className="flex gap-8 w-max cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
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
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Galeria;
