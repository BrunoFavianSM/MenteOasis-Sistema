import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Calendar, Clock, MapPin, Link as LinkIcon, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from './ImageUpload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AdminEvents = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        event_date: '',
        event_time: '',
        location: '',
        description: '',
        image_url: '',
        form_url: '',
        active: true
    });
    const [message, setMessage] = useState(null);

    const showStatus = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId ? `${API_URL}/api/admin/events/${editingId}` : `${API_URL}/api/admin/events`;
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
                fetchEvents();
                setShowForm(false);
                setFormData({ title: '', event_date: '', event_time: '', location: '', description: '', image_url: '', form_url: '', active: true });
                setEditingId(null);
                showStatus('success', editingId ? 'Evento actualizado' : 'Evento creado');
            } else {
                showStatus('error', 'Error al guardar el evento');
            }
        } catch (error) {
            console.error("Error saving event:", error);
            showStatus('error', 'Error de red');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este evento?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showStatus('success', 'Evento eliminado');
                fetchEvents();
            } else {
                showStatus('error', 'Error al eliminar');
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            showStatus('error', 'Error de red');
        }
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            event_date: event.event_date,
            event_time: event.event_time,
            location: event.location,
            description: event.description || '',
            image_url: event.image_url,
            form_url: event.form_url,
            active: Boolean(event.active)
        });
        setEditingId(event.id);
        setShowForm(true);
    };

    if (loading) return <div className="flex justify-center py-12">Cargando...</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Eventos</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ title: '', event_date: '', event_time: '', location: '', description: '', image_url: '', form_url: '', active: true });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-lg"
                >
                    <Plus size={20} /> Nuevo Evento
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

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {editingId ? 'Editar Evento' : 'Nuevo Evento'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Título del Evento</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="Ej. Día de la Salud Mental"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fecha (Ej. 10 de Octubre)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.event_date}
                                        onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="Ej. 10 de Octubre"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hora (Ej. 5:00 PM)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.event_time}
                                        onChange={e => setFormData({ ...formData, event_time: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="Ej. 5:00 PM"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ubicación</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="Ej. Auditorio Central"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <ImageUpload
                                        label="Imagen del Evento"
                                        currentImage={formData.image_url}
                                        onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">URL de Formulario de Registro</label>
                                    <input
                                        type="text"
                                        value={formData.form_url}
                                        onChange={e => setFormData({ ...formData, form_url: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="https://docs.google.com/forms/..."
                                    />
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 mt-4">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={formData.active}
                                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                        />
                                        <label htmlFor="active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                            Evento Visible en la Web
                                        </label>
                                    </div>
                                </div>
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
                                    className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        <Save size={20} />
                                        Guardar Evento
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(events && events.length > 0) ? (
                    events.map((event) => (
                        <div key={event.id} className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="h-40 overflow-hidden relative">
                                <img
                                    src={event.image_url.startsWith('http') ? event.image_url : `${API_URL}${event.image_url}`}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=200&auto=format&fit=crop'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white font-bold">{event.event_date}</div>
                                <div className="absolute top-4 right-4">
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg ${event.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {event.active ? 'Visible' : 'Oculto'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-1">{event.title}</h4>
                                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    <div className="flex items-center gap-2"><Clock size={16} /> {event.event_time}</div>
                                    <div className="flex items-center gap-2"><MapPin size={16} /> {event.location}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(event)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                    </div>
                                    {event.form_url && (
                                        <a href={event.form_url} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition"><LinkIcon size={18} /></a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No hay eventos registrados</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEvents;
