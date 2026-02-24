import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit2, Save, X, Heart, Laptop, Users, GraduationCap, Star,
    Image as ImageIcon, RefreshCw, Stethoscope, Brain, HandHeart, Sparkles,
    Activity, Shield, Sun, Moon, Zap, Smile, HeartPulse, Target, Flower2,
    CheckCircle2, AlertCircle, ChevronDown, ChevronUp, UserPlus, Lightbulb,
    Fingerprint, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';
import ImageEditorModal from './ImageEditorModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ICONS = [
    { name: 'Heart', icon: Heart },
    { name: 'HeartPulse', icon: HeartPulse },
    { name: 'HandHeart', icon: HandHeart },
    { name: 'Stethoscope', icon: Stethoscope },
    { name: 'Brain', icon: Brain },
    { name: 'Users', icon: Users },
    { name: 'UserPlus', icon: UserPlus },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Laptop', icon: Laptop },
    { name: 'Star', icon: Star },
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

const AdminSocialWork = () => {
    const { token } = useAuth();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon_name: 'Heart',
        images: [''],
        active: true
    });
    const [message, setMessage] = useState(null);
    const [editingImage, setEditingImage] = useState(null); // { index, src, name, directEditActivityId? }
    const [isUploadingEdited, setIsUploadingEdited] = useState(false);

    const showStatus = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const fetchActivities = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/social-activities`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleAddImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const handleRemoveImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId ? `${API_URL}/api/admin/social-activities/${editingId}` : `${API_URL}/api/admin/social-activities`;
            const method = editingId ? 'PUT' : 'POST';

            // Filter out empty image URLs
            const submitData = {
                ...formData,
                images: formData.images.filter(img => img.trim() !== '')
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                fetchActivities();
                setShowForm(false);
                setFormData({ title: '', description: '', icon_name: 'Heart', images: [''], active: true });
                setEditingId(null);
                showStatus('success', editingId ? 'Actividad actualizada' : 'Actividad creada');
            } else {
                showStatus('error', 'Error al guardar la actividad');
            }
        } catch (error) {
            console.error("Error saving activity:", error);
            showStatus('error', 'Error de red');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta actividad y todas sus imágenes?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/social-activities/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showStatus('success', 'Actividad eliminada');
                fetchActivities();
            } else {
                showStatus('error', 'Error al eliminar');
            }
        } catch (error) {
            console.error("Error deleting activity:", error);
            showStatus('error', 'Error de red');
        }
    };
    const handleEdit = (activity) => {
        setFormData({
            title: activity.title,
            description: activity.description,
            icon_name: activity.icon_name,
            images: activity.images && activity.images.length > 0 ? activity.images : [''],
            active: Boolean(activity.active)
        });
        setEditingId(activity.id);
        setShowForm(true);
    };

    const handleEditedImageSave = async (results) => {
        if (!results || results.length === 0) return;

        setIsUploadingEdited(true);
        let updatedImagesInfo = []; // Array of { originalIndex, newUrl }

        try {
            // 1. Process all results and upload them
            for (const result of results) {
                const { file, index } = result;

                const formDataUpload = new FormData();
                formDataUpload.append('images', file);

                const response = await fetch(`${API_URL}/api/admin/upload-multiple`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formDataUpload
                });

                if (response.ok) {
                    const data = await response.json();
                    const newUrl = data.urls[0];
                    updatedImagesInfo.push({ originalIndex: index, newUrl });
                }
            }

            if (updatedImagesInfo.length === 0) {
                showStatus('error', 'No se pudo subir ninguna imagen');
                return;
            }

            // 2. Persist changes
            if (editingImage.directEditActivityId) {
                // Direct edit in an existing activity
                const activity = activities.find(a => a.id === editingImage.directEditActivityId);
                if (activity) {
                    const newImagesArr = [...activity.images];
                    updatedImagesInfo.forEach(upd => {
                        newImagesArr[upd.originalIndex] = upd.newUrl;
                    });

                    const saveResponse = await fetch(`${API_URL}/api/admin/social-activities/${editingImage.directEditActivityId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ ...activity, images: newImagesArr })
                    });

                    if (saveResponse.ok) {
                        fetchActivities();
                        showStatus('success', `${updatedImagesInfo.length} imagen(es) actualizada(s) en la base de datos`);
                    } else {
                        showStatus('error', 'Error al guardar cambios en la actividad');
                    }
                }
            } else {
                // Edit within the creation/edit form
                const newImagesArr = [...formData.images];
                updatedImagesInfo.forEach(upd => {
                    newImagesArr[upd.originalIndex] = upd.newUrl;
                });
                setFormData({ ...formData, images: newImagesArr });
                showStatus('success', `${updatedImagesInfo.length} imagen(es) actualizada(s) en el formulario`);
            }
        } catch (error) {
            console.error("Social Work bulk update error:", error);
            showStatus('error', 'Error durante la actualización masiva');
        } finally {
            setIsUploadingEdited(false);
            setEditingImage(null);
        }
    };

    if (loading) return <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-brand-600" /></div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Labor Social</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ title: '', description: '', icon_name: 'Heart', images: [''], active: true });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-lg"
                >
                    <Plus size={20} /> Nueva Actividad
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
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 w-full max-w-3xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {editingId ? 'Editar Actividad' : 'Nueva Actividad'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Título de la Actividad</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="Ej. Talleres Comunitarios"
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
                                        placeholder="Describe la labor social..."
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
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Imágenes de la Actividad</label>

                                    {/* Existing Images Grid */}
                                    {formData.images.filter(img => img !== '').length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            {formData.images.filter(img => img !== '').map((img, index) => (
                                                <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                                                    <img
                                                        src={img.startsWith('http') ? img : `${API_URL}${img}`}
                                                        alt="Existing"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingImage({
                                                                index,
                                                                src: img.startsWith('http') ? img : `${API_URL}${img}`,
                                                                name: `edit-${index}.webp`
                                                            })}
                                                            className="p-2 bg-brand-500 text-white rounded-xl shadow-xl hover:bg-brand-600 active:scale-90"
                                                            title="Editar imagen"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (confirm('¿Eliminar esta imagen de la actividad?')) {
                                                                    const newImages = formData.images.filter((_, i) => i !== index);
                                                                    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
                                                                }
                                                            }}
                                                            className="p-2 bg-red-500 text-white rounded-xl shadow-xl hover:bg-red-600 active:scale-90"
                                                            title="Eliminar imagen"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Multi Upload Component */}
                                    <MultiImageUpload
                                        standalone={true}
                                        onUploadSuccess={(urls) => {
                                            const existingImages = formData.images.filter(img => img !== '');
                                            setFormData({
                                                ...formData,
                                                images: [...existingImages, ...urls]
                                            });
                                        }}
                                    />

                                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 mt-6">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={formData.active}
                                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                        />
                                        <label htmlFor="active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                            Actividad Visible en la Web
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
                                        Guardar Actividad
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {activities && activities.length > 0 ? (
                    activities.map((activity) => {
                        const IconComp = ICONS.find(i => i.name === activity.icon_name)?.icon || Heart;
                        return (
                            <div key={activity.id} className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0 shadow-sm">
                                                <IconComp size={28} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-bold text-2xl text-slate-900 dark:text-white mb-1">{activity.title}</h4>
                                                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${activity.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {activity.active ? 'Visible' : 'Oculto'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">{activity.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 self-end md:self-center">
                                            <button
                                                onClick={() => handleEdit(activity)}
                                                className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition shadow-sm"
                                                title="Editar"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shadow-sm"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Images Section - More Expansive Grid */}
                                    <div className="mt-8">
                                        <button
                                            onClick={() => {
                                                const newActivities = activities.map(a =>
                                                    a.id === activity.id ? { ...a, isExpanded: !a.isExpanded } : a
                                                );
                                                setActivities(newActivities);
                                            }}
                                            className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-brand-600 transition-colors mb-4 group"
                                        >
                                            <ImageIcon size={16} className="group-hover:scale-110 transition-transform" />
                                            <span>Galería de Imágenes ({activity.images?.length || 0})</span>
                                            {activity.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>

                                        <AnimatePresence>
                                            {activity.isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                                        {activity.images && activity.images.length > 0 ? (
                                                            activity.images.map((img, idx) => (
                                                                <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                                                    <img
                                                                        src={img && img.startsWith('http') ? img : `${API_URL}${img}`}
                                                                        alt={`${activity.title} view ${idx}`}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=200&h=200&auto=format&fit=crop'}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEditingImage({
                                                                                    index: idx,
                                                                                    src: img.startsWith('http') ? img : `${API_URL}${img}`,
                                                                                    name: `refine-${activity.id}-${idx}.webp`,
                                                                                    directEditActivityId: activity.id
                                                                                });
                                                                            }}
                                                                            className="p-3 bg-brand-600 text-white rounded-xl shadow-xl hover:bg-brand-500 scale-90 group-hover:scale-100 transition-all duration-300"
                                                                            title="Editar imagen con Pincel Mágico"
                                                                        >
                                                                            <Edit2 size={18} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-full py-10 text-center text-slate-400 italic">
                                                                No hay imágenes para esta actividad
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <Users size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No hay actividades registradas</h3>
                        <p className="text-slate-400 text-sm mt-2">Haz clic en "Nueva Actividad" para comenzar.</p>
                    </div>
                )}
            </div>

            {/* Editor Modal - Moved outside to be accessible from Gallery List and Form */}
            <ImageEditorModal
                isOpen={!!editingImage}
                onClose={() => setEditingImage(null)}
                imageSrc={editingImage?.src}
                imageName={editingImage?.name}
                onSave={handleEditedImageSave}
                allImages={editingImage?.directEditActivityId
                    ? (activities.find(a => a.id === editingImage.directEditActivityId)?.images || []).map((img, i) => ({
                        src: img.startsWith('http') ? img : `${API_URL}${img}`,
                        name: `refine-${editingImage.directEditActivityId}-${i}.webp`
                    }))
                    : (formData.images || []).map((img, i) => ({
                        src: img.startsWith('http') ? img : `${API_URL}${img}`,
                        name: `edit-${i}.webp`
                    }))
                }
                onIndexChange={(newIdx) => {
                    if (!editingImage) return;
                    const imagesArr = editingImage.directEditActivityId
                        ? (activities.find(a => a.id === editingImage.directEditActivityId)?.images || [])
                        : (formData.images || []);

                    const newImg = imagesArr[newIdx];
                    if (!newImg) return;

                    setEditingImage({
                        ...editingImage,
                        index: newIdx,
                        src: newImg.startsWith('http') ? newImg : `${API_URL}${newImg}`,
                        name: editingImage.directEditActivityId
                            ? `refine-${editingImage.directEditActivityId}-${newIdx}.webp`
                            : `edit-${newIdx}.webp`
                    });
                }}
            />

            {isUploadingEdited && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[110] flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-brand-500/20">
                        <RefreshCw className="animate-spin text-brand-600" size={24} />
                        <span className="font-bold text-slate-700 dark:text-white uppercase tracking-widest text-xs">Actualizando imagen...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSocialWork;
