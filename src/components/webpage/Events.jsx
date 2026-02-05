import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

const Events = () => {
    const events = [
        {
            title: 'Taller "Salud Integral"',
            date: "11 de Abril, 2026",
            time: "4:00 PM",
            location: "Semana de la Salud Integral",
            image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScVAAGNSYw6dssSoLH_DEO3yqRdteagh0lppJ9vi3UkVq8sdw/viewform?usp=dialog"
        },
        {
            title: "Seminario: Ansiedad en el Siglo XXI",
            date: "15 Octubre, 2026",
            time: "18:00 - 20:00",
            location: "Auditorio Central, MenteOasis",
            image: "https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            formUrl: "https://docs.google.com/forms"
        },
        {
            title: "Jornada de Mindfulness en el Parque",
            date: "22 Octubre, 2026",
            time: "09:00 - 12:00",
            location: "Parque de la Ciudad",
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            formUrl: "https://docs.google.com/forms"
        },
        {
            title: "Conferencia: Psicología Positiva",
            date: "05 Noviembre, 2026",
            time: "17:00 - 19:30",
            location: "Centro de Convenciones Oasis",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            formUrl: "https://docs.google.com/forms"
        },
        {
            title: "Taller para Padres: Crianza Respetuosa",
            date: "12 Noviembre, 2026",
            time: "10:00 - 13:00",
            location: "Sede Principal, Sala B",
            image: "https://images.unsplash.com/photo-1484820540004-9591295c43b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            formUrl: "https://docs.google.com/forms"
        },
        {
            title: "Retiro de Fin de Año: Renacer",
            date: "10-12 Diciembre, 2026",
            time: "Fin de Semana Completo",
            location: "Valle Sagrado, Cusco",
            image: "https://images.unsplash.com/photo-1518176258769-f227c798150e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            formUrl: "https://docs.google.com/forms"
        }
    ];


    return (
        <section id="events" className="py-20 bg-brand-900 text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-300 font-semibold tracking-wider text-sm">PRÓXIMAMENTE</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2">Eventos Futuros</h2>
                    <p className="text-brand-100 mt-4 max-w-2xl mx-auto">
                        Participa en nuestras actividades diseñadas para tu bienestar.
                        Inscríbete fácilmente a través de nuestro formulario en línea.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <div key={index} className="flex flex-col bg-brand-800 rounded-2xl overflow-hidden hover:bg-brand-700 transition shadow-lg hover:shadow-2xl duration-300">
                            <div className="h-56 overflow-hidden relative group">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">{event.title}</h3>
                                <div className="space-y-3 text-brand-100 text-sm mb-6 flex-grow">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <a
                                    href={event.formUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto w-full py-3 bg-white text-brand-900 rounded-xl font-bold hover:bg-brand-50 transition flex items-center justify-center gap-2 group"
                                >
                                    Inscribirse Ahora
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
