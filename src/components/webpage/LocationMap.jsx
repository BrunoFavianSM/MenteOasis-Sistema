import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationMap = () => {
    const openGoogleMaps = () => {
        window.open('https://www.google.com/maps/dir//Servicios+psicol%C3%B3gicos+Mente+Oasis/@-4.5811073,-81.2682757,17z', '_blank');
    };

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-50 border border-brand-100 dark:border-transparent dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 text-sm font-semibold mb-4 transition-colors duration-300">
                        Encuéntranos
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-300">
                        Nuestra Ubicación
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors duration-300">
                        Visítanos en nuestras instalaciones. Estamos listos para recibirte y acompañarte en tu proceso.
                    </p>
                </motion.div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Map Section - Takes 2 columns */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-xl dark:shadow-slate-900/50 overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300 h-full">
                                <div className="w-full h-[400px] lg:h-[550px] rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-slate-700 group">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0719242525065!2d-81.26827569999999!3d-4.5811073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x903645d0a064cb55%3A0xfb62cf4e9b7eae95!2sServicios%20psicol%C3%B3gicos%20Mente%20Oasis!5e0!3m2!1ses-419!2spe!4v1770138731367!5m2!1ses-419!2spe"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Ubicación MenteOasis"
                                        className="dark:opacity-90 dark:contrast-125 dark:filter dark:grayscale-[0.2]"
                                    ></iframe>

                                    {/* Overlay button for directions */}
                                    <button
                                        onClick={openGoogleMaps}
                                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-brand-50 text-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700 dark:text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-all hover:scale-105 opacity-0 group-hover:opacity-100"
                                    >
                                        <Navigation className="w-5 h-5" />
                                        Cómo llegar
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Info Cards - Takes 1 column */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Address Card */}
                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-8 rounded-[2rem] text-slate-800 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-none transition-all hover:shadow-xl hover:scale-[1.02] h-full flex flex-col justify-center relative overflow-hidden group">
                                {/* Clean Background */}

                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-14 h-14 bg-brand-50 dark:bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-white">
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-2xl mb-3 text-slate-800 dark:text-white">Visítanos</h3>
                                        <p className="text-slate-600 dark:text-brand-50 leading-relaxed text-lg">
                                            Av. E-9, Av. Mariscal Cáceres 43<br />
                                            Talara 20811, Perú
                                        </p>
                                    </div>
                                </div>
                            </div>



                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationMap;
