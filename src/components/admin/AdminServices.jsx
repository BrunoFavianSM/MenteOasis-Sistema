import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit2, Save, X, RefreshCw, CheckCircle2, AlertCircle, User, Users, HeartHandshake, Phone,
    BookOpen, Star, Briefcase, BrainCircuit, GraduationCap, Heart, Laptop,
    Sparkles, Stethoscope, Brain, HandHeart, Activity, Shield, Sun, Moon,
    Zap, Smile, HeartPulse, Target, Flower2, Lightbulb, HelpCircle,
    UserPlus, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ICONS = [
    { name: 'User', icon: User },
    { name: 'Users', icon: Users },
    { name: 'UserPlus', icon: UserPlus },
    { name: 'HeartHandshake', icon: HeartHandshake },
    { name: 'Phone', icon: Phone },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Star', icon: Star },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'BrainCircuit', icon: BrainCircuit },
    { name: 'Brain', icon: Brain },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Heart', icon: Heart },
    { name: 'HeartPulse', icon: HeartPulse },
    { name: 'HandHeart', icon: HandHeart },
    { name: 'Stethoscope', icon: Stethoscope },
    { name: 'Laptop', icon: Laptop },
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Activity', icon: Activity },
    { name: 'Shield', icon: Shield },
    { name: 'Sun', icon: Sun },
    { name: 'Moon', icon: Moon },
    { name: 'Zap', icon: Zap },
    { name: 'Smile', icon: Smile },
    { name: 'Target', icon: Target },
    { name: 'Flower2', icon: Flower2 },
    { name: 'Lightbulb', icon: Lightbulb },
    { name: 'Fingerprint', icon: Fingerprint },
    { name: 'HelpCircle', icon: HelpCircle }
];

const AdminServices = () => {
    const { token } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon_name: 'User',
        active: true
    });
    const [message, setMessage] = useState(null);

    const showStatus = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const fetchServices = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/services`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId ? `${API_URL}/api/admin/services/${editingId}` : `${API_URL}/api/admin/services`;
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
                fetchServices();
                setShowForm(false);
                setFormData({ title: '', description: '', icon_name: 'User', active: true });
                setEditingId(null);
                showStatus('success', editingId ? 'Servicio actualizado' : 'Servicio creado');
            } else {
                showStatus('error', 'Error al guardar el servicio');
            }
        } catch (error) {
            console.error("Error saving service:", error);
            showStatus('error', 'Error de red');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showStatus('success', 'Servicio eliminado');
                fetchServices();
            } else {
                showStatus('error', 'Error al eliminar');
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            showStatus('error', 'Error de red');
        }
    };

    const handleEdit = (service) => {
        setFormData({
            title: service.title,
            description: service.description,
            icon_name: service.icon_name,
            active: Boolean(service.active)
        });
        setEditingId(service.id);
        setShowForm(true);
    };

    if (loading) return <div className="flex justify-center py-12">Cargando...</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Servicios</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ title: '', description: '', icon_name: 'User', active: true });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-lg"
                >
                    <Plus size={20} /> Nuevo Servicio
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
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Título del Servicio</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="Ej. Terapia Individual"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Descripción</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition resize-none"
                                        placeholder="Describe el servicio detalladamente..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Seleccionar Icono</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-3">
                                        {ICONS.map(item => (
                                            <button
                                                key={item.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon_name: item.name })}
                                                className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${formData.icon_name === item.name
                                                    ? 'border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-900/20'
                                                    : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200'
                                                    }`}
                                                title={item.name}
                                            >
                                                <item.icon size={20} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={formData.active}
                                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                        />
                                        <label htmlFor="active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                            Servicio Visible en la Web
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
                                        Guardar Servicio
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {(services && services.length > 0) ? (
                    services.map((service) => {
                        const IconComp = ICONS.find(i => i.name === service.icon_name)?.icon || User;
                        return (
                            <div key={service.id} className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex gap-6 group hover:shadow-md transition-all duration-300">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <IconComp size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-xl text-slate-900 dark:text-white">{service.title}</h4>
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${service.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {service.active ? 'Visible' : 'Oculto'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">{service.description}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <Heart size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No hay servicios registrados</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminServices;
