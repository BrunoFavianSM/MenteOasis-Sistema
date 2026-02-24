import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus, Trash2, Edit2, Save, X, Image as ImageIcon,
    RefreshCw, Filter, CheckSquare, Square,
    FolderInput, Grid, List, MoreVertical,
    ChevronDown, AlertCircle, CheckCircle2,
    PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import MultiImageUpload from './MultiImageUpload';
import ImageEditorModal from './ImageEditorModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


const AdminGallery = () => {
    const { token } = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [message, setMessage] = useState(null);
    const [bulkSaving, setBulkSaving] = useState(false);
    const [editingImage, setEditingImage] = useState(null); // { id, src, name }
    const [isUploadingEdited, setIsUploadingEdited] = useState(false);

    const fetchImages = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/gallery`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error("Error fetching gallery:", error);
            showStatus('error', 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const showStatus = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === images.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(images.map(img => img.id));
        }
    };

    const handleDeleteBulk = async () => {
        if (!confirm(`¿Estás seguro de eliminar ${selectedIds.length} imágenes?`)) return;

        setBulkSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/gallery/bulk-delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ids: selectedIds })
            });

            if (response.ok) {
                showStatus('success', `${selectedIds.length} imágenes eliminadas`);
                setSelectedIds([]);
                fetchImages();
            } else {
                showStatus('error', 'Error al eliminar imágenes');
            }
        } catch (error) {
            showStatus('error', 'Error de red');
        } finally {
            setBulkSaving(false);
        }
    };

    const handleDeleteSingle = async (e, id) => {
        e.stopPropagation();
        if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/gallery/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showStatus('success', 'Imagen eliminada');
                fetchImages();
            }
        } catch (error) {
            showStatus('error', 'Error al eliminar');
        }
    };

    const handleEditedImageSave = async (results) => {
        if (!results || results.length === 0) return;

        setIsUploadingEdited(true);
        let successCount = 0;

        try {
            for (const result of results) {
                const { file, index } = result;
                // Important: results[i].index refers to the index in the original 'images' array passed to the modal
                const originalImage = images[index];
                if (!originalImage) continue;

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

                    const saveResponse = await fetch(`${API_URL}/api/admin/gallery/${originalImage.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ ...originalImage, image_url: newUrl })
                    });

                    if (saveResponse.ok) successCount++;
                }
            }

            if (successCount > 0) {
                fetchImages();
                showStatus('success', `${successCount} imagen(es) actualizada(s) exitosamente`);
            } else {
                showStatus('error', 'No se pudo actualizar ninguna imagen');
            }
        } catch (error) {
            console.error("Gallery bulk edit error:", error);
            showStatus('error', 'Error de red durante la actualización masiva');
        } finally {
            setIsUploadingEdited(false);
            setEditingImage(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RefreshCw className="animate-spin text-brand-600" size={48} />
            <p className="text-slate-500 font-bold animate-pulse tracking-widest text-xs uppercase">Sincronizando Galería...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter flex items-center gap-4">
                        <ImageIcon className="text-brand-600" size={40} />
                        Galería Multimedia
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Gestiona, categoriza y organiza todo el material visual</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setShowUpload(!showUpload)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${showUpload
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-brand-600 text-white shadow-brand-500/30'
                            }`}
                    >
                        {showUpload ? <X size={20} /> : <Plus size={20} />}
                        {showUpload ? 'CERRAR CARGA' : 'NUEVO CARGADOR MULTIDRAG'}
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

            {/* Upload Area */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-50 dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 shadow-inner mb-10">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                <PlusCircle className="text-brand-500" size={24} />
                                Añadir Contenido Masivo
                            </h3>
                            <MultiImageUpload
                                category="General"
                                onUploadSuccess={() => {
                                    fetchImages();
                                    showStatus('success', '¡Cargado con éxito!');
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[600px]">
                {/* Secondary Header: Bulk Actions */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Mostrando todas las imágenes</span>
                    </div>

                    {/* Multi-Selection Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={selectAll}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                        >
                            {selectedIds.length === images.length ? <CheckSquare size={16} /> : <Square size={16} />}
                            {selectedIds.length === images.length ? 'DESELECCIONAR TODO' : 'SELECCIONAR TODO'}
                        </button>
                    </div>
                </div>

                {/* Bulk Actions Panel (Floating Style) */}
                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-brand-600 p-4 px-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-brand-700"
                        >
                            <div className="flex items-center gap-4 text-white">
                                <span className="bg-white/20 px-4 py-2 rounded-2xl font-black text-lg">
                                    {selectedIds.length}
                                </span>
                                <span className="font-extrabold uppercase tracking-widest">Elementos Seleccionados</span>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={handleDeleteBulk}
                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    ELIMINAR SELECCIÓN
                                </button>

                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="text-white/70 hover:text-white px-4 font-bold text-xs"
                                >
                                    CANCELAR
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gallery Grid */}
                <div className="p-10">
                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                    >
                        <AnimatePresence mode='popLayout'>
                            {images.map((img) => (
                                <motion.div
                                    key={img.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    onClick={() => toggleSelect(img.id)}
                                    className={`group relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all duration-500 cursor-pointer shadow-sm
                                        ${selectedIds.includes(img.id)
                                            ? 'border-brand-500 shadow-2xl shadow-brand-500/30 scale-95'
                                            : 'border-white dark:border-slate-800 hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl'}`}
                                >
                                    <img
                                        src={img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`}
                                        alt={img.alt_text}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                                        loading="lazy"
                                    />

                                    {/* Selection Overlay */}
                                    <div className={`absolute inset-0 bg-brand-600/20 transition-opacity duration-300 ${selectedIds.includes(img.id) ? 'opacity-100' : 'opacity-0'}`} />

                                    {/* Checkbox Mask */}
                                    <div className={`absolute top-4 left-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedIds.includes(img.id)
                                        ? 'bg-brand-600 text-white scale-100'
                                        : 'bg-black/20 text-white opacity-0 group-hover:opacity-100'
                                        }`}>
                                        <CheckCircle2 size={20} className={selectedIds.includes(img.id) ? 'animate-bounce' : ''} />
                                    </div>

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingImage({
                                                    id: img.id,
                                                    src: img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`,
                                                    name: `gallery-${img.id}.webp`
                                                });
                                            }}
                                            className="p-3 bg-brand-600 text-white rounded-xl shadow-xl hover:bg-brand-500 scale-90 group-hover:scale-100 transition-all duration-300"
                                            title="Editar con Pincel Mágico"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteSingle(e, img.id)}
                                            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-xl scale-90 group-hover:scale-100 transition-all duration-300"
                                            title="Eliminar permanentemente"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {images.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-40 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] mb-6 text-slate-300 dark:text-slate-700">
                                <ImageIcon size={48} />
                            </div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Sin contenido en la Galería</h4>
                            <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Añade imágenes usando el botón superior</p>
                            <button
                                onClick={() => setShowUpload(true)}
                                className="mt-8 px-10 py-4 border-2 border-brand-500 text-brand-500 rounded-full font-black text-sm hover:bg-brand-500 hover:text-white transition-all uppercase tracking-widest"
                            >
                                Empezar a Cargar
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="p-10 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    <span>Total: {images.length} imágenes</span>
                    <span>MenteOasis Media Asset Manager • 2026</span>
                </div>
            </div>

            {/* Editor Modal */}
            <ImageEditorModal
                isOpen={!!editingImage}
                onClose={() => setEditingImage(null)}
                imageSrc={editingImage?.src}
                imageName={editingImage?.name}
                onSave={handleEditedImageSave}
                allImages={images.map(img => ({
                    src: img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`,
                    name: `gallery-${img.id}.webp`,
                    id: img.id
                }))}
                onIndexChange={(newIdx) => {
                    const nextImg = images[newIdx];
                    if (nextImg) {
                        setEditingImage({
                            id: nextImg.id,
                            src: nextImg.image_url.startsWith('http') ? nextImg.image_url : `${API_URL}${nextImg.image_url}`,
                            name: `gallery-${nextImg.id}.webp`
                        });
                    }
                }}
            />

            {isUploadingEdited && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[110] flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-brand-500/20">
                        <RefreshCw className="animate-spin text-brand-600" size={24} />
                        <span className="font-bold text-slate-700 dark:text-white uppercase tracking-widest text-xs">Actualizando galería...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
