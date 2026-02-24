import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Trash2, Edit2, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AdminTestimonials = () => {
    const { token } = useAuth();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        patient_name: '',
        role: '',
        content: '',
        approved: true
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState(null);

    const showStatus = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const fetchTestimonials = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTestimonials(data);
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTestimonials();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `${API_URL}/api/admin/testimonials/${editingId}`
                : `${API_URL}/api/testimonials`;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchTestimonials();
                setShowForm(false);
                setFormData({ patient_name: '', role: '', content: '', approved: true });
                setEditingId(null);
                showStatus('success', editingId ? 'Testimonio actualizado' : 'Testimonio creado');
            } else {
                showStatus('error', 'Error al guardar');
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            showStatus('error', 'Error de red');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este testimonio?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showStatus('success', 'Testimonio eliminado');
                fetchTestimonials();
            } else {
                showStatus('error', 'Error al eliminar');
            }
        } catch (error) {
            console.error("Error deleting:", error);
            showStatus('error', 'Error de red');
        }
    };

    const toggleApproval = async (testimonial) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials/${testimonial.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...testimonial, approved: !testimonial.approved })
            });
            if (response.ok) {
                showStatus('success', testimonial.approved ? 'Ocultado con éxito' : 'Aprobado con éxito');
                fetchTestimonials();
            }
        } catch (error) {
            console.error("Error toggling approval:", error);
            showStatus('error', 'Error al cambiar estado');
        }
    };

    const handleEdit = (testimonial) => {
        setFormData(testimonial);
        setEditingId(testimonial.id);
        setShowForm(true);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Testimonios</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ patient_name: '', role: '', content: '', approved: true });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-lg"
                >
                    <Plus size={20} /> Nuevo Testimonio
                </button>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed top-24 right-8 z-[100] px-6 py-4 rounded-[1.8rem] flex items-center gap-4 shadow-2xl backdrop-blur-md border ${message.type === 'success'
                            ? 'bg-green-500/90 text-white border-green-400'
                            : 'bg-red-500/90 text-white border-red-400'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <span className="font-black uppercase tracking-wider text-sm">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                {editingId ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={28} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del Paciente</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.patient_name}
                                    onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                    className="w-full px-5 py-4 rounded-[1.2rem] border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white focus:border-brand-500 outline-none transition font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Rol / Título</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Paciente de Ansiedad"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-5 py-4 rounded-[1.2rem] border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white focus:border-brand-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Testimonio</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-5 py-4 rounded-[1.2rem] border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white focus:border-brand-500 outline-none transition resize-none leading-relaxed"
                                />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                <input
                                    type="checkbox"
                                    id="approved"
                                    checked={formData.approved}
                                    onChange={e => setFormData({ ...formData, approved: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                />
                                <label htmlFor="approved" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Aprobado y Visible</label>
                            </div>
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-10 py-3 bg-brand-600 text-white rounded-xl font-black shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition"
                                >
                                    GUARDAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid gap-6">
                {(testimonials && testimonials.length > 0) ? (
                    testimonials.map((t) => (
                        <div key={t.id} className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-xl text-slate-900 dark:text-white">{t.patient_name}</h4>
                                            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${t.approved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {t.approved ? 'Visible' : 'Pendiente'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 italic text-lg leading-relaxed relative pl-4 border-l-4 border-slate-100 dark:border-slate-800">
                                    "{t.content}"
                                </p>
                            </div>
                            <div className="flex items-center gap-3 self-end md:self-center">
                                <button
                                    onClick={() => toggleApproval(t)}
                                    title={t.approved ? "Ocultar" : "Aprobar"}
                                    className={`p-3 rounded-xl transition shadow-sm ${t.approved ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                >
                                    {t.approved ? <X size={20} /> : <Check size={20} />}
                                </button>
                                <button
                                    onClick={() => handleEdit(t)}
                                    className="p-3 bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition shadow-sm dark:bg-slate-800 dark:text-slate-500"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="p-3 bg-red-50 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-xl transition shadow-sm dark:bg-red-900/20 dark:text-red-400"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No hay testimonios registrados</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTestimonials;
