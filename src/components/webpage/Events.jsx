import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FALLBACK_EVENTS = [
    { title: 'Salud Integral', event_date: "11 de Abril, 2026", event_time: "4:00 PM", location: "Auditorio Pérez de Cuéllar", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_KVeu3RnnZ_JT_2YWc1qHDOKs7lFqhudp0g&s", form_url: "#" },
    { title: 'Septiembre: Lucha contra el suicidio', event_date: "10 de Septiembre, 2026", event_time: "6:00 PM", location: "Centro de Convenciones", image_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", form_url: "#" },
    { title: 'Día de la Salud Mental', event_date: "10 de Octubre, 2026", event_time: "5:00 PM", location: "Parque Central", image_url: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", form_url: "#" },
    { title: 'Día del Psicólogo', event_date: "30 de Abril, 2026", event_time: "7:00 PM", location: "Auditorio Principal", image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", form_url: "#" },
];

const Events = () => {
    const [events, setEvents] = useState(FALLBACK_EVENTS);
    const [header, setHeader] = useState({
        badge: 'Próximamente',
        title: 'Eventos Futuros',
        subtitle: 'Participa en nuestras actividades diseñadas para tu bienestar. Inscríbete fácilmente a través de nuestro formulario en línea.'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/events`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setEvents(data);
                }

                // Fetch section header texts
                const resHeader = await fetch(`${API_URL}/api/content/events`);
                if (resHeader.ok) {
                    const headerData = await resHeader.json();
                    setHeader({
                        badge: headerData.badge || header.badge,
                        title: headerData.title || header.title,
                        subtitle: headerData.subtitle || header.subtitle
                    });
                }
            } catch (error) {
                console.log('Using fallback events data');
            }
        };
        fetchData();
    }, []);

    return (
        <section id="events" className="py-24 bg-white dark:bg-transparent transition-colors duration-300 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-400 font-bold tracking-widest text-xs mb-6 uppercase">
                            <Sparkles className="w-4 h-4" />
                            {header.badge}
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
                            {header.title}
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-500 mx-auto rounded-full mb-8" />
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            {header.subtitle}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative w-full h-full"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />

                            <div className="flex flex-col bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-100 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-2xl h-full">
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={event.image_url.startsWith('http') ? event.image_url : `${API_URL}${event.image_url}`}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white/90 dark:bg-brand-500/90 backdrop-blur-md text-brand-700 dark:text-white font-black px-3 py-1.5 rounded-xl shadow-xl flex flex-col items-center">
                                            <span className="text-xs uppercase">
                                                {event.event_date.includes('Abril') ? 'ABR' :
                                                    event.event_date.includes('Septiembre') ? 'SEP' :
                                                        event.event_date.includes('Octubre') ? 'OCT' : 'EVENTO'}
                                            </span>
                                            <span className="text-xl -mt-1">{event.event_date.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300 leading-tight">
                                            {event.title}
                                        </h3>
                                        <div className="h-1 w-12 bg-brand-500 rounded-full group-hover:w-20 transition-all duration-500" />
                                    </div>

                                    <div className="space-y-3 mb-6 flex-grow">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{event.event_date}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{event.event_time}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{event.location}</span>
                                        </div>
                                    </div>

                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={event.form_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all duration-300 group/btn mt-auto"
                                    >
                                        Inscribirse
                                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
