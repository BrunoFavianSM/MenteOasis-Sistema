import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/testimonials');
                if (response.ok) {
                    const data = await response.json();
                    setTestimonials(data);
                }
            } catch (error) {
                console.error("Error loading testimonials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) return null;
    if (testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm">
                        Testimonios
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
                        Lo que dicen de nosotros
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative"
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
            </div>
        </section>
    );
};

export default Testimonials;
