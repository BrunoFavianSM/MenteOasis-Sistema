import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, Sparkles } from 'lucide-react';

const Events = () => {
    const events = [
        {
            title: 'Salud Integral',
            date: "11 de Abril, 2026",
            time: "4:00 PM",
            location: "Semana de la Salud Integral",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_KVeu3RnnZ_JT_2YWc1qHDOKs7lFqhudp0g&s",
            formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScVAAGNSYw6dssSoLH_DEO3yqRdteagh0lppJ9vi3UkVq8sdw/viewform?usp=dialog"
        }
    ];

    return (
        <section id="events" className="py-24 bg-slate-950 text-white relative overflow-hidden transition-colors duration-300">
            {/* Background Animations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse transition-all duration-1000 delay-700" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold tracking-widest text-xs mb-6 uppercase">
                            <Sparkles className="w-4 h-4" />
                            Próximamente
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                            Eventos <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Futuros</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-500 mx-auto rounded-full mb-8" />
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            Participa en nuestras actividades diseñadas para tu bienestar.
                            Inscríbete fácilmente a través de nuestro formulario en línea.
                        </p>
                    </motion.div>
                </div>

                <div className="flex justify-center">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="group relative max-w-2xl w-full"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />

                            <div className="relative flex flex-col md:flex-row bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                                {/* Image Section */}
                                <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-r" />

                                    {/* Date Badge over Image for Mobile */}
                                    <div className="absolute top-6 left-6 md:hidden">
                                        <div className="bg-brand-500/90 backdrop-blur-md text-white font-black px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center">
                                            <span className="text-sm">ABR</span>
                                            <span className="text-2xl -mt-1">11</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="mb-6">
                                        <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-brand-400 transition-colors duration-300 leading-tight">
                                            {event.title}
                                        </h3>
                                        <div className="h-1 w-12 bg-brand-500 rounded-full group-hover:w-24 transition-all duration-500" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                        <div className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-brand-500/20 transition-colors">
                                                <Calendar className="w-5 h-5 text-brand-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Fecha</span>
                                                <span className="text-sm font-semibold">{event.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-brand-500/20 transition-colors">
                                                <Clock className="w-5 h-5 text-brand-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Hora</span>
                                                <span className="text-sm font-semibold">{event.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group/item sm:col-span-2">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-brand-500/20 transition-colors">
                                                <MapPin className="w-5 h-5 text-brand-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Ubicación</span>
                                                <span className="text-sm font-semibold">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={event.formUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 transition-all duration-300 group/btn"
                                    >
                                        Inscribirse Ahora
                                        <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;

