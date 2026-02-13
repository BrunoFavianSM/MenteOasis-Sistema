import React from 'react';

const Galeria = () => {
    const galleryImages = [
        "https://images.unsplash.com/photo-1529156069896-859328862430?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];

    return (
        <section className="py-24 bg-slate-100 dark:bg-zinc-900 overflow-hidden relative border-y border-slate-200 dark:border-zinc-800/50 transition-colors duration-300">

            <div className="relative w-full">
                {/* Extended gradient masks for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-slate-100 dark:from-zinc-900 via-slate-100/80 dark:via-zinc-900/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-l from-slate-100 dark:from-zinc-900 via-slate-100/80 dark:via-zinc-900/80 to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden">
                    {/* Track: duplicated set for seamless CSS loop */}
                    <div className="flex gap-6 md:gap-8 items-center animate-marquee">
                        {galleryImages.map((img, idx) => (
                            <div key={`a-${idx}`} className="relative w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/5 shadow-2xl group cursor-pointer">
                                <img
                                    src={img}
                                    alt={`Galería ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-brand-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                    {/* Duplicated set (aria-hidden) for seamless visual continuity */}
                    <div className="flex gap-6 md:gap-8 items-center animate-marquee ml-6 md:ml-8" aria-hidden="true">
                        {galleryImages.map((img, idx) => (
                            <div key={`b-${idx}`} className="relative w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/5 shadow-2xl group cursor-pointer">
                                <img
                                    src={img}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-brand-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Galeria;
