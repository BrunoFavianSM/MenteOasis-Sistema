import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'framer-motion';
import { Send, Mail, User, Phone, MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const ContactForm = () => {
    const [state, handleSubmit] = useForm("mykprrjn");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleWhatsApp = () => {
        const message = formData.subject
            ? `Hola, me gustaría obtener información sobre: ${formData.subject}`
            : 'Hola, me gustaría obtener más información sobre los servicios de MenteOasis.';
        window.open(`https://wa.me/51962268667?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Reset form after successful submission
    if (state.succeeded) {
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        }, 3000);
    }

    return (
        <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
            {/* Clean Background */}

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block py-2 px-4 rounded-full bg-white border border-brand-100 dark:border-brand-800/50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 text-sm font-semibold mb-4 shadow-sm shadow-brand-100/50 dark:shadow-none transition-colors duration-300">
                            💬 Contáctanos
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-300">
                            ¿Listo para dar el primer paso?
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors duration-300">
                            Estamos aquí para escucharte. Completa el formulario y nos pondremos en contacto contigo pronto.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-slate-800 p-8 lg:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-brand-900/10"
                    >
                        {state.succeeded ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                                    <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-300">¡Mensaje Enviado!</h3>
                                <p className="text-slate-600 dark:text-slate-300 transition-colors duration-300">
                                    Gracias por contactarnos. Te responderemos pronto.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors duration-300">
                                        Nombre Completo *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <ValidationError prefix="Name" field="name" errors={state.errors} />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors duration-300">
                                        Correo Electrónico *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors duration-300">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400"
                                            placeholder="+51 999 999 999"
                                        />
                                    </div>
                                    <ValidationError prefix="Phone" field="phone" errors={state.errors} />
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors duration-300">
                                        Asunto *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400"
                                    >
                                        <option value="">Selecciona un asunto</option>
                                        <option value="Terapia Individual">Terapia Individual</option>
                                        <option value="Terapia de Pareja">Terapia de Pareja</option>
                                        <option value="Terapia Familiar">Terapia Familiar</option>
                                        <option value="Talleres">Talleres</option>
                                        <option value="Eventos">Eventos</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    <ValidationError prefix="Subject" field="subject" errors={state.errors} />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors duration-300">
                                        Mensaje *
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400"
                                            placeholder="Cuéntanos cómo podemos ayudarte..."
                                        />
                                    </div>
                                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                                </div>

                                {/* Error Message */}
                                {state.errors && state.errors.length > 0 && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 transition-colors duration-300">
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Hubo un error al enviar el mensaje</p>
                                            <p className="text-sm text-red-600 dark:text-red-400">Por favor, intenta nuevamente o contáctanos por WhatsApp.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={state.submitting}
                                    className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 dark:hover:bg-brand-500 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-200/50 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                >
                                    {state.submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            Enviar Mensaje
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {/* WhatsApp Alternative */}
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 transition-colors duration-300">¿Prefieres contactarnos por WhatsApp?</p>
                                    <button
                                        type="button"
                                        onClick={handleWhatsApp}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        Chatear por WhatsApp
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {/* Main Contact Info Card */}
                        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 dark:from-brand-700 dark:via-brand-800 dark:to-brand-900 p-8 rounded-3xl text-white shadow-2xl transition-all duration-300 hover:shadow-brand-500/50 hover:scale-[1.02]">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5" />
                                </div>
                                Información de Contacto
                            </h3>

                            <div className="space-y-5">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-brand-50 mb-1">Teléfono</h4>
                                        <a href="tel:+51962268667" className="text-white hover:text-brand-100 transition font-medium">
                                            +51 962268667
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-brand-50 mb-1">Email</h4>
                                        <a href="mailto:psicoseverino@gmail.com" className="text-white hover:text-brand-100 transition break-all">
                                            psicoseverino@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-brand-50 mb-1">Dirección</h4>
                                        <p className="text-white leading-relaxed">
                                            Av. E-9, Av. Mariscal Cáceres 43<br />
                                            Talara 20811, Perú
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Horarios */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/50 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                </div>
                                Horarios de Atención
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 transition">
                                    <span className="font-medium text-slate-700 dark:text-slate-200">Lunes, Viernes y Sábado</span>
                                    <span className="text-brand-600 dark:text-brand-400 font-semibold">2:00 PM - 7:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 transition">
                                    <span className="font-medium text-slate-700 dark:text-slate-200">Martes, Miércoles y Jueves</span>
                                    <span className="text-brand-600 dark:text-brand-400 font-semibold">9:00 AM - 2:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 transition">
                                    <span className="font-medium text-slate-700 dark:text-slate-200">Domingos</span>
                                    <span className="text-red-600 dark:text-red-400 font-semibold">Cerrado</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl text-white shadow-xl border border-slate-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                            <h3 className="text-xl font-bold mb-2">Síguenos en Redes</h3>
                            <p className="text-slate-300 mb-6 text-sm">
                                Mantente al día con nuestros talleres, eventos y contenido sobre salud mental.
                            </p>
                            <div className="flex gap-3">
                                <a href="https://www.facebook.com/MenteOasisPsicologiaPeru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="https://www.instagram.com/menteoasis_psic/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                                <a href="https://www.tiktok.com/@menteoasis" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-black rounded-xl flex items-center justify-center transition-all hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
