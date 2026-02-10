import React from 'react';
import { motion } from 'framer-motion';
import { Music, Palette, BrainCircuit, Users, Star, CalendarDays } from 'lucide-react';

const Workshops = () => {
    const workshops = [
        {
            title: "Música",
            description: "Explora la expresión emocional y el bienestar a través del sonido y el ritmo.",
            date: "Sábados por la mañana",
            icon: <Music className="w-8 h-8" />,
            color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
            image: "https://images.unsplash.com/photo-1514119412050-ebd491a1e9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Arte",
            description: "Un espacio creativo para el autodescubrimiento mediante diversas técnicas artísticas.",
            date: "Viernes por la tarde",
            icon: <Palette className="w-8 h-8" />,
            color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Ingeniería",
            description: "Fomentamos el pensamiento lógico y la resolución de problemas técnicos y creativos.",
            date: "Martes y Jueves",
            icon: <BrainCircuit className="w-8 h-8" />,
            color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Atención y concentración",
            description: "Ejercicios diseñados para fortalecer el enfoque y la presencia mental en el día a día.",
            date: "Lunes y Miércoles",
            icon: <Star className="w-8 h-8" />,
            color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
            image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Habilidades cognitivas",
            description: "Entrenamiento en memoria, resolución de conflictos y otras funciones ejecutivas esenciales.",
            date: "Disponible mensualmente",
            icon: <Users className="w-8 h-8" />,
            color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <section id="workshops" className="py-24 bg-gradient-to-b from-brand-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden transition-colors duration-300">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-brand-200 dark:bg-brand-900/20 rounded-full blur-[100px] opacity-30 pointer-events-none transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-[100px] opacity-30 pointer-events-none transition-colors duration-300" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 rounded-full text-sm font-bold mb-4 transition-colors duration-300">
                            <Star className="w-4 h-4 fill-brand-700 dark:fill-brand-300" />
                            <span>Nuestros Programas Estelares</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-300">
                            Talleres de Crecimiento Personal
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300">
                            Potencia tu bienestar con nuestras experiencias grupales diseñadas por expertos.
                            Sumérgete en un ambiente de aprendizaje, apoyo y transformación.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {workshops.map((workshop, index) => (
                        <motion.div
                            key={workshop.title || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-slate-100 dark:border-slate-800 group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
                                <img
                                    src={workshop.image}
                                    alt={`Taller de ${workshop.title} en MenteOasis`}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    Inscripciones Abiertas
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${workshop.color} transition-colors duration-300`}>
                                        {workshop.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                                    {workshop.title}
                                </h3>

                                <p className="text-slate-600 dark:text-slate-300 mb-6 flex-1 transition-colors duration-300">
                                    {workshop.description}
                                </p>

                                <div className="space-y-4 mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
                                        <CalendarDays className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                                        {workshop.date}
                                    </div>
                                    <button className="w-full py-3 bg-slate-900 dark:bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-600 dark:hover:bg-brand-500 transition-colors shadow-lg shadow-slate-200 dark:shadow-none">
                                        Reservar Cupo
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 dark:text-slate-400 mb-4 transition-colors duration-300">¿Buscas algo diferente?</p>
                    <a href="#contact" className="inline-flex items-center text-brand-700 dark:text-brand-400 font-bold hover:underline gap-1 cursor-pointer transition-colors duration-300">
                        Consulta por talleres personalizados <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Workshops;
