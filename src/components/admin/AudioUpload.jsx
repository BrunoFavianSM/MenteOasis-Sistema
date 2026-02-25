import React, { useState, useRef } from 'react';
import { Upload, X, Music, RefreshCw, CheckCircle2, Play, Pause } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AudioUpload = ({ onUploadSuccess, currentAudio, label = "Música" }) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentAudio ? (currentAudio.startsWith('http') ? currentAudio : `${API_URL}${currentAudio}`) : null);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const fileInputRef = useRef(null);
    const audioRef = useRef(null);

    React.useEffect(() => {
        setPreview(currentAudio ? (currentAudio.startsWith('http') ? currentAudio : `${API_URL}${currentAudio}`) : null);
    }, [currentAudio]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4', 'audio/aac', 'audio/ogg'];
        if (!allowedTypes.includes(file.type)) {
            setError('Formato no válido. Usa MP3, WAV o M4A.');
            return;
        }

        // Upload
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('audio', file);

        try {
            const response = await fetch(`${API_URL}/api/admin/upload-audio`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const newUrl = data.url;
                setPreview(newUrl.startsWith('http') ? newUrl : `${API_URL}${newUrl}`);
                onUploadSuccess(data.url);
            } else {
                const data = await response.json();
                setError(data.message || 'Error al subir el audio');
            }
        } catch (err) {
            setError('Error de conexión al subir el audio');
        } finally {
            setUploading(false);
        }
    };

    const removeAudio = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
        setPreview(null);
        onUploadSuccess('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label}
            </label>

            <div
                className={`relative group p-6 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center gap-4
                    ${preview ? 'border-brand-500/50 bg-brand-50/10' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/50'}
                `}
            >
                {preview ? (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg">
                                    <Music size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[150px]">
                                        {preview.split('/').pop()}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Fondo Musical</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <audio
                                    ref={audioRef}
                                    src={preview}
                                    onEnded={() => setIsPlaying(false)}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={togglePlay}
                                    className="p-3 bg-brand-600 text-white rounded-xl hover:scale-105 transition shadow-lg"
                                >
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={removeAudio}
                                    className="p-3 bg-white text-red-500 rounded-xl hover:scale-105 transition shadow-lg border border-slate-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-2"
                            >
                                <Upload size={14} /> Reemplazar archivo
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
                            {uploading ? <RefreshCw className="animate-spin" size={32} /> : <Music size={32} />}
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-base font-black text-brand-600 dark:text-brand-400 hover:scale-105 transition-transform inline-block"
                            >
                                SELECCIONAR MÚSICA
                            </button>
                            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">MP3, WAV, M4A hasta 15MB</p>
                        </div>
                    </>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-20 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCw className="animate-spin text-brand-600" size={40} />
                            <p className="text-xs font-black text-brand-600 uppercase tracking-widest animate-pulse">Subiendo Audio...</p>
                        </div>
                    </div>
                )}

                {preview && !uploading && (
                    <div className="absolute top-2 right-2 p-1 bg-green-500 text-white rounded-full shadow-lg">
                        <CheckCircle2 size={14} />
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="audio/*"
                    className="hidden"
                />
            </div>
            {error && (
                <div className="flex items-center gap-2 text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800">
                    <X size={14} />
                    <p className="text-xs font-bold">{error}</p>
                </div>
            )}
        </div>
    );
};

export default AudioUpload;
