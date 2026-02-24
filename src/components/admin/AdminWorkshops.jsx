import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit2, Save, X, Users, Sparkles, Briefcase, BrainCircuit,
    GraduationCap, BookOpen, RefreshCw, ChevronDown, ChevronRight, PlusCircle,
    Stethoscope, Brain, HandHeart, Activity, Shield, Sun, Moon, Zap, Smile,
    HeartPulse, Target, Flower2, Lightbulb, HelpCircle, UserPlus, Fingerprint,
    Heart, CheckCircle2, AlertCircle, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ICONS = [
    { name: 'BookOpen', icon: BookOpen },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Brain', icon: Brain },
    { name: 'BrainCircuit', icon: BrainCircuit },
    { name: 'Users', icon: Users },
    { name: 'UserPlus', icon: UserPlus },
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Activity', icon: Activity },
    { name: 'Shield', icon: Shield },
    { name: 'Sun', icon: Sun },
    { name: 'Moon', icon: Moon },
    { name: 'Zap', icon: Zap },
    { name: 'Smile', icon: Smile },
    { name: 'Heart', icon: Heart },
    { name: 'HeartPulse', icon: HeartPulse },
    { name: 'Target', icon: Target },
    { name: 'Flower2', icon: Flower2 },
    { name: 'Lightbulb', icon: Lightbulb },
    { name: 'Fingerprint', icon: Fingerprint },
    { name: 'HelpCircle', icon: HelpCircle }
];

const COLORS = [
    { name: 'Morado', class: 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400' },
    { name: 'Esmeralda', class: 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' },
    { name: 'Ambar', class: 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' },
    { name: 'Rosa', class: 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400' },
    { name: 'Azul', class: 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' },
    { name: 'Violeta', class: 'bg-violet-50 border-violet-100 text-violet-600 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-400' },
    { name: 'Teal', class: 'bg-teal-50 border-teal-100 text-teal-600 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-400' },
    { name: 'Cian', class: 'bg-cyan-50 border-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400' },
    { name: 'Naranja', class: 'bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' },
    { name: 'Lima', class: 'bg-lime-50 border-lime-100 text-lime-600 dark:bg-lime-900/20 dark:border-lime-800 dark:text-lime-400' },
    { name: 'Fucsia', class: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:border-fuchsia-800 dark:text-fuchsia-400' },
    { name: 'Pizarra', class: 'bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-400' }
];

const AdminWorkshops = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editingWorkshopId, setEditingWorkshopId] = useState(null); // Added from diff
    const [message, setMessage] = useState(null); // Added from diff

    const showStatus = (type, text) => { // Added from diff
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const [categoryFormData, setCategoryFormData] = useState({
        title: '',
        description: '',
        icon_name: 'BookOpen',
        color_class: COLORS[0].class,
        active: true
    });

    const [itemFormData, setItemFormData] = useState({
        title: '',
        description: ''
    });

    const [expandedCategories, setExpandedCategories] = useState({});

    const fetchWorkshops = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/workshops`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching workshops:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const toggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCategory ? `${API_URL}/api/admin/workshops/${editingCategory.id}` : `${API_URL}/api/admin/workshops`;
            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(categoryFormData)
            });

            if (response.ok) {
                fetchWorkshops(); // Changed from fetchData() to fetchWorkshops() to match existing function name
                setShowCategoryForm(false);
                setCategoryFormData({ title: '', description: '', icon_name: 'BookOpen', color_class: COLORS[0].class, active: true }); // Changed from setCategoryForm()
                setEditingCategory(null); // Changed from setEditingCategoryId(null)
                showStatus('success', editingCategory ? 'Categoría actualizada' : 'Categoría creada'); // Added from diff
            } else {
                showStatus('error', 'Error al guardar la categoría'); // Added from diff
            }
        } catch (error) {
            console.error("Error saving category:", error);
            showStatus('error', 'Error de red'); // Added from diff
        }
    };

    const handleCategoryDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría y todos sus ítems?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/workshops/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showStatus('success', 'Categoría eliminada'); // Added from diff
                fetchWorkshops(); // Changed from fetchData() to fetchWorkshops() to match existing function name
            } else {
                showStatus('error', 'Error al eliminar'); // Added from diff
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            showStatus('error', 'Error de red'); // Added from diff
        }
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategoryId) {
            showStatus('error', 'Debe seleccionar una categoría');
            return;
        }

        try {
            const url = editingItem ? `${API_URL}/api/admin/workshops/items/${editingItem.id}` : `${API_URL}/api/admin/workshops/items`;
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...itemFormData,
                    category_id: selectedCategoryId,
                    display_order: editingItem ? editingItem.display_order : 0
                })
            });

            if (response.ok) {
                fetchWorkshops();
                setShowItemForm(false);
                setEditingItem(null);
                setItemFormData({ title: '', description: '' });
                showStatus('success', editingItem ? 'Taller actualizado' : 'Taller creado');
            } else {
                const errorData = await response.json();
                console.error("Server error saving workshop:", errorData);
                showStatus('error', errorData.message || 'Error al guardar el taller');
            }
        } catch (error) {
            console.error("Network error saving workshop:", error);
            showStatus('error', 'Error de red');
        }
    };

    const handleItemDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este ítem?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/workshops/items/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showStatus('success', 'Taller eliminado'); // Added for consistency
                fetchWorkshops();
            } else {
                showStatus('error', 'Error al eliminar el taller'); // Added for consistency
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            showStatus('error', 'Error de red'); // Added for consistency
        }
    };

    if (loading) return <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-brand-600" /></div>;

    return (
        <div className="space-y-12 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Talleres y Categorías</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setEditingCategory(null); // Changed from setEditingCategoryId(null)
                            setCategoryFormData({ title: '', description: '', icon_name: 'BookOpen', color_class: COLORS[0].class, active: true }); // Changed from setCategoryForm()
                            setShowCategoryForm(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl font-bold transition"
                    >
                        <Plus size={20} /> Nueva Categoría
                    </button>
                    <button
                        onClick={() => {
                            if (categories.length === 0) {
                                showStatus('error', 'Primero crea una categoría');
                                return;
                            }
                            setEditingWorkshopId(null);
                            setSelectedCategoryId(categories[0]?.id || null);
                            setEditingItem(null);
                            setItemFormData({ title: '', description: '' });
                            setShowItemForm(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-lg"
                    >
                        <Plus size={20} /> Nuevo Taller
                    </button>
                </div>
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

            {/* Category Form Modal */}
            {showCategoryForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h3>
                            <button onClick={() => setShowCategoryForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Título de la Categoría</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryFormData.title}
                                    onChange={e => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                    placeholder="Ej. Programas Educativos"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Descripción (Opcional)</label>
                                <textarea
                                    rows="2"
                                    value={categoryFormData.description}
                                    onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition resize-none"
                                    placeholder="Breve descripción de la categoría..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Seleccionar Icono</label>
                                <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2">
                                    {ICONS.map(item => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            onClick={() => setCategoryFormData({ ...categoryFormData, icon_name: item.name })}
                                            className={`p-2 rounded-lg border flex items-center justify-center transition-all ${categoryFormData.icon_name === item.name
                                                ? 'border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-900/20'
                                                : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200'
                                                }`}
                                            title={item.name}
                                        >
                                            <item.icon size={18} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Color de Acento</label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {COLORS.map(color => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => setCategoryFormData({ ...categoryFormData, color_class: color.class })}
                                            className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${categoryFormData.color_class === color.class
                                                ? 'border-brand-600 scale-105 ring-2 ring-brand-500/20'
                                                : 'border-transparent'
                                                } ${color.class}`}
                                        >
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <input
                                    type="checkbox"
                                    id="cat-active"
                                    checked={categoryFormData.active}
                                    onChange={e => setCategoryFormData({ ...categoryFormData, active: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                />
                                <label htmlFor="cat-active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                    Categoría Visible en la Web
                                </label>
                            </div>
                            <div className="flex justify-end gap-4 mt-8">
                                <button type="button" onClick={() => setShowCategoryForm(false)} className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 rounded-xl transition">Cancelar</button>
                                <button type="submit" className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg transition">Guardar Categoría</button>
                            </div>
                        </form>
                    </div >
                </div >
            )}

            {/* Item Form Modal */}
            {
                showItemForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 w-full max-w-xl shadow-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {editingItem ? 'Editar Taller' : 'Nuevo Taller'}
                                </h3>
                                <button onClick={() => setShowItemForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleItemSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre del Taller</label>
                                    <input
                                        type="text"
                                        required
                                        value={itemFormData.title}
                                        onChange={e => setItemFormData({ ...itemFormData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="Ej. Taller de Autoestima"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Descripción</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={itemFormData.description}
                                        onChange={e => setItemFormData({ ...itemFormData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition resize-none"
                                        placeholder="Breve descripción del taller..."
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-8">
                                    <button type="button" onClick={() => setShowItemForm(false)} className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 rounded-xl transition">Cancelar</button>
                                    <button type="submit" className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg transition">Guardar Taller</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <div className="grid gap-6">
                {categories.map((cat) => {
                    const IconComp = ICONS.find(i => i.name === cat.icon_name)?.icon || BookOpen;
                    const items = cat.items || [];
                    const isExpanded = expandedCategories[cat.id];

                    return (
                        <div key={cat.id} className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
                            <div className="p-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color_class}`}>
                                        <IconComp size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-xl text-slate-900 dark:text-white">{cat.title}</h4>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${cat.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {cat.active ? 'Visible' : 'Oculto'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">{items.length} taller(es)</p>
                                    </div>
                                    <div className="ml-2 text-slate-400">
                                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCategoryId(cat.id);
                                            setEditingItem(null);
                                            setItemFormData({ title: '', description: '' });
                                            setShowItemForm(true);
                                        }}
                                        className="p-2 text-brand-600 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 transition"
                                        title="Añadir taller"
                                    >
                                        <PlusCircle size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingCategory(cat);
                                            setCategoryFormData({
                                                title: cat.title,
                                                description: cat.description || '',
                                                icon_name: cat.icon_name,
                                                color_class: cat.color_class,
                                                active: Boolean(cat.active)
                                            });
                                            setShowCategoryForm(true);
                                        }}
                                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleCategoryDelete(cat.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 grid sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                    {items.map(item => (
                                        <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <h5 className="font-bold text-slate-800 dark:text-white mb-1">{item.title}</h5>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{item.description}</p>
                                            </div>
                                            <div className="flex justify-end gap-2 border-t border-slate-50 dark:border-slate-700/50 pt-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategoryId(cat.id);
                                                        setEditingItem(item);
                                                        setItemFormData({ title: item.title, description: item.description });
                                                        setShowItemForm(true);
                                                    }}
                                                    className="text-xs font-bold text-slate-400 hover:text-brand-600 flex items-center gap-1 transition"
                                                >
                                                    <Edit2 size={14} /> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleItemDelete(item.id)}
                                                    className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 transition"
                                                >
                                                    <Trash2 size={14} /> Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {items.length === 0 && (
                                        <div className="col-span-full py-8 text-center text-slate-400 italic">No hay talleres en esta categoría</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default AdminWorkshops;
