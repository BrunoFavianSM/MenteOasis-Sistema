import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, HeartHandshake, Phone } from 'lucide-react';

const Services = () => {
    const services = [
        {
            title: "Terapia Individual",
            description: "Espacio personal para abordar ansiedad, depresión y crecimiento personal.",
            icon: <User className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Terapia de Pareja",
            description: "Mejoren la comunicación y fortalezcan su vínculo emocional.",
            icon: <HeartHandshake className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Terapia Familiar",
            description: "Soluciones para conflictos y dinámicas familiares complejas.",
            icon: <Users className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Consulta Online",
            description: "Accede a nuestros especialistas desde la comodidad de tu hogar.",
            icon: <Phone className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        }
    ];

    return (
        <section id="services" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Nuestros Servicios</h2>
                    <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors duration-300">
                        Ofrecemos diversas modalidades de consulta adaptadas a tus necesidades.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800"
                        >
                            <div className="w-14 h-14 bg-brand-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">{service.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 transition-colors duration-300">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
