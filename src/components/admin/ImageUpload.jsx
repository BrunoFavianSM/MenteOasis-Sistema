import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, RefreshCw, CheckCircle2, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ImageEditorModal from './ImageEditorModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ImageUpload = ({ onUploadSuccess, currentImage, label = "Imagen" }) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage ? (currentImage.startsWith('http') ? currentImage : `${API_URL}${currentImage}`) : null);
    const [error, setError] = useState(null);
    const [editingImage, setEditingImage] = useState(null); // { src, name }
    const fileInputRef = useRef(null);

    React.useEffect(() => {
        setPreview(currentImage ? (currentImage.startsWith('http') ? currentImage : `${API_URL}${currentImage}`) : null);
    }, [currentImage]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${API_URL}/api/admin/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                onUploadSuccess(data.url);
            } else {
                const data = await response.json();
                setError(data.message || 'Error al subir la imagen');
            }
        } catch (err) {
            setError('Error de conexión al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleEditedSave = async (results) => {
        if (!results || results.length === 0) return;
        const { file, dataUrl } = results[0];

        setPreview(dataUrl);
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${API_URL}/api/admin/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                onUploadSuccess(data.url);
            } else {
                const data = await response.json();
                setError(data.message || 'Error al subir la imagen editada');
            }
        } catch (err) {
            setError('Error de conexión al subir la imagen editada');
        } finally {
            setUploading(false);
            setEditingImage(null);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onUploadSuccess('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label}
            </label>

            <div
                className={`relative group h-48 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center gap-3
                    ${preview ? 'border-brand-500/50 bg-brand-50/10' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/50'}
                `}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <button
                                type="button"
                                onClick={() => setEditingImage({ src: preview, name: 'edited-image.webp' })}
                                className="p-2 bg-white text-brand-600 rounded-xl hover:scale-110 transition shadow-lg"
                                title="Editar imagen"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-white text-brand-600 rounded-xl hover:scale-110 transition shadow-lg"
                                title="Cambiar imagen"
                            >
                                <Upload size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="p-2 bg-white text-red-500 rounded-xl hover:scale-110 transition shadow-lg"
                                title="Eliminar imagen"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center z-20">
                                <RefreshCw className="animate-spin text-brand-600" size={32} />
                            </div>
                        )}
                        {!uploading && !error && (
                            <div className="absolute top-2 right-2 p-1 bg-green-500 text-white rounded-full shadow-lg">
                                <CheckCircle2 size={14} />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
                            {uploading ? <RefreshCw className="animate-spin" size={24} /> : <ImageIcon size={24} />}
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline"
                            >
                                Haz clic para subir
                            </button>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">WebP, PNG, JPG hasta 5MB</p>
                        </div>
                    </>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            <ImageEditorModal
                isOpen={!!editingImage}
                onClose={() => setEditingImage(null)}
                imageSrc={editingImage?.src}
                imageName={editingImage?.name}
                onSave={handleEditedSave}
            />
        </div>
    );
};

export default ImageUpload;
