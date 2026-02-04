import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Palette, BrainCircuit, Star, CalendarDays, Music, Smile, Users } from 'lucide-react';

const Workshops = () => {
    const [expanded, setExpanded] = useState(false);

    const workshops = [
        {
            title: "Manejo del Estrés",
            description: "Aprende técnicas prácticas de relajación, respiración y mindfulness para recuperar el control y la calma en tu vida diaria.",
            date: "Disponible mensualmente",
            icon: <BrainCircuit className="w-8 h-8" />,
            color: "bg-blue-100 text-blue-600",
            image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: "S/. 30 / Sesión"
        },
        {
            title: "Arteterapia Expresiva",
            description: "Un espacio seguro para explorar tus emociones a través del color, la forma y la creatividad. No necesitas experiencia previa.",
            date: "Todos los Viernes",
            icon: <Palette className="w-8 h-8" />,
            color: "bg-purple-100 text-purple-600",
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: "S/. 35 / Sesión"
        },
        {
            title: "Club de Lectura Psicológica",
            description: "Analizamos obras literarias desde una perspectiva psicológica para entender la mente humana y enriquecer nuestro mundo interior.",
            date: "Primer sábado del mes",
            icon: <BookOpen className="w-8 h-8" />,
            color: "bg-orange-100 text-orange-600",
            image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: "S/. 15 / Encuentro"
        },
        // Nuevos Talleres
        {
            title: "Musicoterapia",
            description: "Conecta con tus emociones a través del sonido y el ritmo. Una experiencia sensorial para liberar tensiones.",
            date: "Jueves por la tarde",
            icon: <Music className="w-8 h-8" />,
            color: "bg-pink-100 text-pink-600",
            image: "https://images.unsplash.com/photo-1514119412050-ebd491a1e9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: "S/. 35 / Sesión"
        },
        {
            title: "Risoterapia Grupal",
            description: "La risa como herramienta de sanación. Mejora tu estado de ánimo y reduce el estrés en un ambiente divertido.",
            date: "Último domingo del mes",
            icon: <Smile className="w-8 h-8" />,
            color: "bg-yellow-100 text-yellow-600",
            image: "https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: "S/. 25 / Sesión"
        },
        {
            title: "Habilidades Sociales",
            description: "Mejora tu comunicación, asertividad y relaciones interpersonales mediante dinámicas de grupo efectivas.",
            date: "Martes por la noche",
            icon: <Users className="w-8 h-8" />,
            color: "bg-green-100 text-green-600",
            image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: "S/. 40 / Sesión"
        }
    ];

    const visibleWorkshops = expanded ? workshops : workshops.slice(0, 3);

    return (
        <section id="workshops" className="py-24 bg-gradient-to-b from-brand-50 to-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-brand-200 rounded-full blur-[100px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[100px] opacity-30 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-bold mb-4">
                            <Star className="w-4 h-4 fill-brand-700" />
                            <span>Nuestros Programas Estelares</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Talleres de Crecimiento Personal
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Potencia tu bienestar con nuestras experiencias grupales diseñadas por expertos.
                            Sumérgete en un ambiente de aprendizaje, apoyo y transformación.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <AnimatePresence>
                        {visibleWorkshops.map((workshop, index) => (
                            <motion.div
                                key={workshop.title || index} // Use title as key if unique, fallback to index
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-slate-100 group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
                                    <img
                                        src={workshop.image}
                                        alt={workshop.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        Inscripciones Abiertas
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-2xl ${workshop.color}`}>
                                            {workshop.icon}
                                        </div>
                                        <span className="text-slate-900 font-bold bg-slate-50 px-3 py-1 rounded-lg">
                                            {workshop.price}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                                        {workshop.title}
                                    </h3>

                                    <p className="text-slate-600 mb-6 flex-1">
                                        {workshop.description}
                                    </p>

                                    <div className="space-y-4 mt-auto">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <CalendarDays className="w-4 h-4 text-brand-500" />
                                            {workshop.date}
                                        </div>
                                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-slate-200">
                                            Reservar Cupo
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="px-8 py-3 bg-white text-brand-700 border-2 border-brand-100 rounded-full font-bold hover:bg-brand-50 hover:border-brand-200 transition-all duration-300 shadow-sm"
                    >
                        {expanded ? "Ver Menos Talleres" : "Explorar Todos los Talleres"}
                    </button>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 mb-4">¿Buscas algo diferente?</p>
                    <a href="#contact" className="inline-flex items-center text-brand-700 font-bold hover:underline gap-1 cursor-pointer">
                        Consulta por talleres personalizados <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Workshops;
