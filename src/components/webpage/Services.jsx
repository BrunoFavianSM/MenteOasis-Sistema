import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, HeartHandshake, Phone, BookOpen, Star } from 'lucide-react';

const Services = () => {
    const services = [
        {
            title: "Terapia Individual",
            description: "Atención 100% personalizada. Desde el manejo de ansiedad y depresión hasta el desarrollo personal. Especialistas en atención adaptada para niños con autismo y TDAH, potenciando sus capacidades únicas.",
            icon: <User className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Terapia de Pareja",
            description: "Recuperen la armonía o transformen sus conflictos en acuerdos constructivos. Apoyo especializado tanto para parejas unidas como separadas que buscan una coparentalidad sana por el bienestar de sus hijos.",
            icon: <HeartHandshake className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Terapia Virtual",
            description: "Tu bienestar no tiene fronteras. Accede a terapia profesional desde la comodidad y privacidad de tu hogar, con la misma calidez y eficacia que una sesión presencial.",
            icon: <Phone className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Terapia Familiar",
            description: "Fortalece los lazos que importan. Intervención sistémica para resolver conflictos y mejorar la dinámica en el hogar, incluyendo el acompañamiento a padres separados en beneficio de sus hijos.",
            icon: <Users className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Talleres Educativos y de desarrollo",
            description: "Espacios de aprendizaje activo para potenciar habilidades clave en ingeniería, arte y función cognitiva.",
            icon: <BookOpen className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Talleres para Adultos",
            description: "Programas diseñados para el crecimiento personal, gestión emocional y desarrollo de nuevas competencias.",
            icon: <User className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Shows sensoriales y eventos",
            description: "Experiencias inmersivas con propósito, diseñadas para estimular los sentidos y crear memorias inolvidables.",
            icon: <Star className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        },
        {
            title: "Servicios Corporativos & Institucionales",
            description: "Charlas, talleres y capacitaciones de alto impacto para empresas, colegios y universidades. Potenciamos el capital humano.",
            icon: <Users className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        }
    ];

    return (
        <section id="services" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Nuestros Servicios</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Soluciones profesionales adaptadas a tu momento de vida.
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
                            className="group bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-white dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-none transition-all duration-300 border border-slate-100 dark:border-slate-700 group-hover:border-brand-100 dark:group-hover:border-brand-900/50">
                                {React.cloneElement(service.icon, { className: "w-7 h-7 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" })}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{service.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
