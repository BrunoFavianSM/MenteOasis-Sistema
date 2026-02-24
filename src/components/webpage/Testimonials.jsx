import React, { useState, useEffect } from 'react';
import { Quote, Send, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [header, setHeader] = useState({
        badge: 'Testimonios',
        title: 'Lo que dicen de nosotros',
        subtitle: ''
    });
    const [formData, setFormData] = useState({
        patient_name: '',
        role: '',
        content: ''
    });
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch approved testimonials
                const response = await fetch(`${API_URL}/api/testimonials`);
                if (response.ok) {
                    const data = await response.json();
                    setTestimonials(data);
                }

                // Fetch section header texts
                const resHeader = await fetch(`${API_URL}/api/content/testimonials`);
                if (resHeader.ok) {
                    const headerData = await resHeader.json();
                    setHeader({
                        badge: headerData.badge || header.badge,
                        title: headerData.title || header.title,
                        subtitle: headerData.subtitle || header.subtitle
                    });
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/testimonials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus({
                    type: 'success',
                    message: '¡Gracias! Tu testimonio ha sido enviado y está pendiente de aprobación.'
                });
                setFormData({ patient_name: '', role: '', content: '' });
                setTimeout(() => {
                    setShowForm(false);
                    setSubmitStatus({ type: '', message: '' });
                }, 3000);
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: 'Hubo un error al enviar tu testimonio. Por favor intenta de nuevo.'
                });
            }
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Error de conexión. Por favor intenta de nuevo.'
            });
        }
    };

    if (loading) return null;
    // Removed early return for empty testimonials to allow submission
    // if (testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50 dark:bg-transparent transition-colors duration-300" id="testimonials">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm">
                        {header.badge}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
                        {header.title}
                    </h2>
                    {header.subtitle && (
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
                            {header.subtitle}
                        </p>
                    )}

                    {/* Add Testimonial Button */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 dark:bg-brand-500 text-white font-medium rounded-full shadow-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-all hover:scale-105"
                    >
                        <Quote size={20} />
                        Dejar un Testimonio
                    </button>
                </div>

                {testimonials.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/10 flex flex-col relative"
                            >
                                <Quote className="w-10 h-10 text-brand-100 dark:text-brand-900/50 absolute top-8 right-8" />

                                <p className="text-slate-600 dark:text-slate-300 mb-8 italic leading-relaxed relative z-10">
                                    "{testimonial.content}"
                                </p>

                                <div className="mt-auto flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg">
                                        {testimonial.patient_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                            {testimonial.patient_name}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Aún no hay testimonios visibles. ¡Sé el primero en compartir tu experiencia!
                        </p>
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Comparte tu Experiencia</h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6">
                                {submitStatus.message ? (
                                    <div className={`p-4 rounded-xl flex items-start gap-3 ${submitStatus.type === 'success'
                                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                        {submitStatus.type === 'success' && <Check className="mt-0.5 shrink-0" size={20} />}
                                        <p>{submitStatus.message}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Nombre Completo
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.patient_name}
                                                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                                placeholder="Tu nombre"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Rol / Título (Opcional)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                                placeholder="Ej. Paciente, Familiar, Alumno"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Tu Testimonio
                                            </label>
                                            <textarea
                                                required
                                                rows="4"
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                                                placeholder="Cuéntanos tu experiencia..."
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25 flex items-center gap-2"
                                            >
                                                <Send size={18} />
                                                Enviar Testimonio
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
export default Testimonials;
