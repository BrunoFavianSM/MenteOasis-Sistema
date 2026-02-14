import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Trash2, Edit2 } from 'lucide-react';

const AdminTestimonials = () => {
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

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/admin/testimonials');
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
        fetchTestimonials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `http://localhost:3001/api/testimonials/${editingId}`
                : 'http://localhost:3001/api/testimonials';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchTestimonials();
                setShowForm(false);
                setFormData({ patient_name: '', role: '', content: '', approved: true });
                setEditingId(null);
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este testimonio?')) return;
        try {
            await fetch(`http://localhost:3001/api/testimonials/${id}`, { method: 'DELETE' });
            fetchTestimonials();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const toggleApproval = async (testimonial) => {
        try {
            await fetch(`http://localhost:3001/api/testimonials/${testimonial.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...testimonial, approved: !testimonial.approved })
            });
            fetchTestimonials();
        } catch (error) {
            console.error("Error toggling approval:", error);
        }
    };

    const handleEdit = (testimonial) => {
        setFormData(testimonial);
        setEditingId(testimonial.id);
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Testimonios</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ patient_name: '', role: '', content: '', approved: true });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                >
                    <Plus size={20} /> Nuevo Testimonio
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                            {editingId ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Paciente</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.patient_name}
                                    onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol / Título</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Paciente de Ansiedad"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Testimonio</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="approved"
                                    checked={formData.approved}
                                    onChange={e => setFormData({ ...formData, approved: e.target.checked })}
                                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                />
                                <label htmlFor="approved" className="text-sm text-slate-700 dark:text-slate-300">Aprobado y Visible</label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid gap-4">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t.patient_name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.approved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                    {t.approved ? 'Visible' : 'Pendiente'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{t.role}</p>
                            <p className="text-slate-600 dark:text-slate-300 italic">"{t.content}"</p>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-center">
                            <button
                                onClick={() => toggleApproval(t)}
                                title={t.approved ? "Ocultar" : "Aprobar"}
                                className={`p-2 rounded-lg transition ${t.approved ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                            >
                                {t.approved ? <X size={20} /> : <Check size={20} />}
                            </button>
                            <button
                                onClick={() => handleEdit(t)}
                                className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition dark:bg-slate-700 dark:text-slate-300"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(t.id)}
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition dark:bg-red-900/20 dark:text-red-400"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTestimonials;
