import React from 'react';
import { MapPin } from 'lucide-react';

const LocationMap = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                        <MapPin className="text-brand-600" />
                        Nuestra Ubicación
                    </h2>
                    <p className="text-slate-600">
                        Visítanos en nuestras instalaciones. Estamos listos para recibirte.
                    </p>
                </div>

                <div className="bg-white p-4 rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-slate-200">
                    <div className="w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden relative bg-slate-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0719242525065!2d-81.26827569999999!3d-4.5811073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x903645d0a064cb55%3A0xfb62cf4e9b7eae95!2sServicios%20psicol%C3%B3gicos%20Mente%20Oasis!5e0!3m2!1ses-419!2spe!4v1770138731367!5m2!1ses-419!2spe"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación MenteOasis"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationMap;
