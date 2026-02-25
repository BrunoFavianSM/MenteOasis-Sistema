import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, RefreshCw, CheckCircle2, Files, AlertCircle, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ImageEditorModal from './ImageEditorModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MultiImageUpload = ({ onUploadSuccess, category = "General", standalone = false }) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editingImage, setEditingImage] = useState(null); // { index, src, name }
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    const addFiles = (files) => {
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        if (validFiles.length === 0) {
            setError('Por favor, selecciona solo imágenes.');
            return;
        }

        if (filesToUpload.length + validFiles.length > 50) {
            setError('Límite máximo de 50 imágenes alcanzado.');
            return;
        }

        setError(null);

        const newPreviews = validFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            name: file.name
        }));

        setPreviews(prev => [...prev, ...newPreviews]);
        setFilesToUpload(prev => [...prev, ...validFiles]);
    };

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    }, [filesToUpload]);

    const removeFile = (id, index) => {
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);

        const newFiles = [...filesToUpload];
        newFiles.splice(index, 1);
        setFilesToUpload(newFiles);
    };

    const handleEditSave = (results) => {
        if (!results || results.length === 0) return;
        const { file: editedFile, dataUrl: editedDataUrl } = results[0];

        if (!editingImage) return;

        const { index } = editingImage;

        // Revoke old blob URL
        URL.revokeObjectURL(previews[index].url);

        // Update previews
        const newPreviews = [...previews];
        newPreviews[index] = {
            ...newPreviews[index],
            url: editedDataUrl // We can use the data URL directly as preview
        };
        setPreviews(newPreviews);

        // Update files to upload
        const newFiles = [...filesToUpload];
        newFiles[index] = editedFile;
        setFilesToUpload(newFiles);

        setEditingImage(null);
    };

    const handleUpload = async () => {
        if (filesToUpload.length === 0) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await fetch(`${API_URL}/api/admin/upload-multiple`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();

                if (standalone) {
                    // In standalone mode, we just return the URLs to the parent
                    onUploadSuccess(data.urls);
                    setPreviews([]);
                    setFilesToUpload([]);
                    return;
                }

                // Gallery mode: Register in gallery_images
                const galleryData = data.urls.map(url => ({
                    image_url: url,
                    category: category
                }));

                const galleryResponse = await fetch(`${API_URL}/api/admin/gallery/bulk`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ images: galleryData })
                });

                if (galleryResponse.ok) {
                    onUploadSuccess();
                    setPreviews([]);
                    setFilesToUpload([]);
                } else {
                    setError('Error al registrar imágenes en la base de datos');
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Error al subir las imágenes');
            }
        } catch (err) {
            setError('Error de conexión al subir las imágenes');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative h-64 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 shadow-inner
                    ${isDragging ? 'border-brand-500 bg-brand-50/20 scale-[0.98]' : 'border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500'}
                `}
            >
                <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors shadow-sm">
                    {uploading ? <RefreshCw className="animate-spin text-brand-600" size={32} /> : <Upload size={32} />}
                </div>

                <div className="text-center px-6">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-lg font-black text-brand-600 dark:text-brand-400 hover:underline"
                    >
                        Arrastra tus imágenes o haz clic aquí
                    </button>
                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">
                        Hasta 50 archivos simultáneos • WebP, PNG, JPG
                    </p>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                />

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem] z-10">
                        <RefreshCw className="animate-spin text-brand-600 mb-4" size={48} />
                        <p className="text-brand-600 font-black animate-pulse">SUBIENDO {filesToUpload.length} IMÁGENES...</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-shake">
                    <AlertCircle size={18} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            {previews.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div className="flex items-center gap-3">
                            <Files className="text-brand-600" size={20} />
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                Vista Previa ({previews.length})
                            </h4>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                        >
                            {uploading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                            SUBIR TODO A LA GALERÍA
                        </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {previews.map((preview, index) => (
                            <div key={preview.id} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                                <img
                                    src={preview.url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => setEditingImage({
                                            index,
                                            src: preview.url,
                                            name: preview.name
                                        })}
                                        className="p-1.5 bg-brand-500 text-white rounded-lg shadow-lg hover:bg-brand-600 transition-colors"
                                        title="Editar imagen"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(preview.id, index)}
                                        className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                                        title="Eliminar"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Editor Modal */}
            <ImageEditorModal
                isOpen={!!editingImage}
                onClose={() => setEditingImage(null)}
                imageSrc={editingImage?.src}
                imageName={editingImage?.name}
                onSave={handleEditSave}
            />
        </div>
    );
};

export default MultiImageUpload;
