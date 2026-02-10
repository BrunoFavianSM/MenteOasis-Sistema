import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Laptop, Users, GraduationCap, Star } from 'lucide-react';

const SocialWork = () => {
    const activities = [
        {
            title: "Banco de Fe",
            description: "Iniciativa para brindar apoyo espiritual y emocional a quienes más lo necesitan en momentos de crisis.",
            icon: <Heart className="w-6 h-6" />
        },
        {
            title: "Talleres técnicos",
            description: "Capacitaciones especializadas para comunidades vulnerables, mejorando sus oportunidades de empleabilidad.",
            icon: <Laptop className="w-6 h-6" />
        },
        {
            title: "Días de voluntariado",
            description: "Permitimos que nuestro equipo dedique un día laboral al año a una causa social de su elección, fomentando la empatía y solidaridad activa.",
            icon: <Users className="w-6 h-6" />
        },
        {
            title: "Programas de mentoría",
            description: "Apoyo a jóvenes emprendedores o estudiantes de sectores vulnerables para facilitar su inserción laboral y crecimiento profesional constante.",
            icon: <GraduationCap className="w-6 h-6" />
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
                            se dedica al servicio directo, creando impacto tangible en la comunidad a través de
                            eventos, educación y asistencia humanitaria.
                        </p>
                    </motion.div>
                </div>

                {/* Evidence Gallery */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.title || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="group relative p-8 rounded-3xl bg-teal-900/40 dark:bg-slate-800/40 border border-teal-800 dark:border-slate-700 hover:bg-teal-800/60 dark:hover:bg-slate-700/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col items-center text-center"
                        >
                            {/* Decorative element */}
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-teal-500/10 dark:bg-brand-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative z-10 flex flex-col h-full items-center">
                                <div className="w-16 h-16 bg-teal-800/80 dark:bg-slate-700/80 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-teal-700 dark:border-slate-600 transition-transform group-hover:scale-110">
                                    {activity.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-teal-300 dark:group-hover:text-brand-300 transition-colors">
                                    {activity.title}
                                </h3>
                                <p className="text-teal-100/90 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                                    {activity.description}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal-400 dark:text-brand-400 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Star className="w-3 h-3" />
                                    Acción Social
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialWork;
