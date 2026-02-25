import React, { useState, useEffect } from 'react';
import {
    Save, RefreshCw, AlertCircle, CheckCircle,
    Layout, Info, Heart, BookOpen, Calendar,
    Users, Image as ImageIcon, MessageSquare,
    Phone, MapPin, Globe, ChevronRight, Volume2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from './ImageUpload';
import AudioUpload from './AudioUpload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SECTIONS = [
    {
        id: 'menu',
        title: 'Menú y Navegación',
        icon: Layout,
        keys: ['home', 'about', 'services', 'workshops', 'events', 'social', 'contact'],
        labels: {
            home: 'Inicio',
            about: 'Nosotros',
            services: 'Servicios',
            workshops: 'Talleres',
            events: 'Eventos',
            social: 'Labor Social',
            contact: 'Botón de Reserva (Navbar)'
        }
    },
    {
        id: 'hero',
        title: 'Hero (Inicio)',
        icon: Globe,
        keys: ['badge_text', 'title_line1', 'title_line2', 'subtitle', 'image_url', 'cta_primary_text', 'cta_secondary_text'],
        labels: {
            badge_text: 'Banda Superior (Badge)',
            title_line1: 'Título Línea 1',
            title_line2: 'Título Línea 2 (Color)',
            subtitle: 'Subtítulo Principal',
            image_url: 'Imagen de Fondo',
            cta_primary_text: 'Texto Botón Principal',
            cta_secondary_text: 'Texto Botón Secundario'
        }
    },
    {
        id: 'about',
        title: 'Sobre Nosotros',
        icon: Info,
        keys: ['badge_text', 'title_line1', 'title_line2', 'paragraph1', 'paragraph2', 'image_url', 'benefit1', 'benefit2', 'benefit3', 'benefit4'],
        labels: {
            badge_text: 'Etiqueta',
            title_line1: 'Título Línea 1',
            title_line2: 'Título Línea 2',
            paragraph1: 'Párrafo 1',
            paragraph2: 'Párrafo 2',
            image_url: 'Imagen de Sección',
            benefit1: 'Beneficio 1',
            benefit2: 'Beneficio 2',
            benefit3: 'Beneficio 3',
            benefit4: 'Beneficio 4'
        }
    },
    {
        id: 'sections_text',
        title: 'Títulos de Secciones',
        icon: Layout,
        keys: ['services_badge', 'services_title', 'services_subtitle', 'workshops_badge', 'workshops_title', 'workshops_subtitle', 'events_badge', 'events_title', 'events_subtitle', 'social_work_badge', 'social_work_title', 'social_work_subtitle', 'gallery_badge', 'gallery_title', 'gallery_subtitle', 'testimonials_badge', 'testimonials_title', 'testimonials_subtitle'],
        labels: {
            services_badge: 'Servicios: Banda',
            services_title: 'Servicios: Título',
            services_subtitle: 'Servicios: Descripción',
            workshops_badge: 'Talleres: Banda',
            workshops_title: 'Talleres: Título',
            workshops_subtitle: 'Talleres: Descripción',
            events_badge: 'Eventos: Banda',
            events_title: 'Eventos: Título',
            events_subtitle: 'Eventos: Descripción',
            social_work_badge: 'Labor Social: Banda',
            social_work_title: 'Labor Social: Título',
            social_work_subtitle: 'Labor Social: Descripción',
            gallery_badge: 'Galería: Banda',
            gallery_title: 'Galería: Título',
            gallery_subtitle: 'Galería: Descripción',
            testimonials_badge: 'Testimonios: Banda',
            testimonials_title: 'Testimonios: Título',
            testimonials_subtitle: 'Testimonios: Descripción'
        }
    },
    {
        id: 'contact',
        title: 'Contacto y Horarios',
        icon: Phone,
        keys: ['contact_phone', 'contact_email', 'contact_whatsapp', 'contact_address_line1', 'contact_address_line2', 'schedule_group1_days', 'schedule_group1_hours', 'schedule_group2_days', 'schedule_group2_hours', 'schedule_closed_day'],
        labels: {
            contact_phone: 'Teléfono',
            contact_email: 'Email',
            contact_whatsapp: 'WhatsApp (Número completo)',
            contact_address_line1: 'Dirección Línea 1',
            contact_address_line2: 'Dirección Línea 2',
            schedule_group1_days: 'Horario 1: Días',
            schedule_group1_hours: 'Horario 1: Horas',
            schedule_group2_days: 'Horario 2: Días',
            schedule_group2_hours: 'Horario 2: Horas',
            schedule_closed_day: 'Día Cerrado'
        }
    },
    {
        id: 'location',
        title: 'Ubicación y Mapas',
        icon: MapPin,
        keys: ['location_address_line1', 'location_address_line2', 'location_maps_url', 'location_maps_embed'],
        labels: {
            location_address_line1: 'Dirección Mostrar 1',
            location_address_line2: 'Dirección Mostrar 2',
            location_maps_url: 'URL Externa (Google Maps)',
            location_maps_embed: 'Código Embed (Iframe URL)'
        }
    },
    {
        id: 'footer',
        title: 'Pie de Página',
        icon: ChevronRight,
        keys: ['description', 'contact_phone', 'contact_email', 'contact_address', 'social_facebook', 'social_instagram', 'social_tiktok', 'social_linktree'],
        labels: {
            description: 'Descripción MenteOasis',
            contact_phone: 'Teléfono Visible',
            contact_email: 'Email Visible',
            contact_address: 'Dirección Visible',
            social_facebook: 'URL Facebook',
            social_instagram: 'URL Instagram',
            social_tiktok: 'URL TikTok',
            social_linktree: 'URL Linktree'
        }
    },
    {
        id: 'settings',
        title: 'Configuración y Música',
        icon: Volume2,
        keys: ['music_url', 'music_enabled'],
        labels: {
            music_url: 'Música de Fondo (Ambiental)',
            music_enabled: 'Música Activada (true/false)'
        }
    }
];

const AdminSiteContent = () => {
    const { token } = useAuth();
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('hero');

    const fetchContent = async () => {
        try {
            const response = await fetch(`${API_URL}/api/content`);
            if (response.ok) {
                const data = await response.json();
                // Maintain nested structure { section: { key: value } }
                setContent(data);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleChange = (key, value) => {
        setContent(prev => ({
            ...prev,
            [activeTab]: {
                ...(prev[activeTab] || {}),
                [key]: value
            }
        }));
    };

    const handleSave = async (sectionId) => {
        if (!token) {
            setMessage({ type: 'error', text: 'Sesión no válida. Por favor, inicia sesión de nuevo.' });
            return;
        }

        setSaving(true);
        setMessage(null);
        try {
            const section = SECTIONS.find(s => s.id === sectionId);
            const sectionData = content[sectionId] || {};

            const response = await fetch(`${API_URL}/api/admin/site-content/${sectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sectionData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `Sección "${section.title}" guardada con éxito.` });
            } else {
                setMessage({ type: 'error', text: `ERROR ${response.status}: ${data.message || 'Error al guardar.'}` });
            }
        } catch (error) {
            console.error("Error saving content:", error);
            setMessage({ type: 'error', text: 'Error de red fatal. ¿Servidor caído?' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RefreshCw className="animate-spin text-brand-600" size={48} />
            <p className="text-slate-500 font-bold animate-pulse">Cargando contenido...</p>
        </div>
    );

    const currentSection = SECTIONS.find(s => s.id === activeTab);

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight italic">Contenido General</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Gestiona todos los textos e imágenes principales de la web</p>
                </div>

                {message && (
                    <div className={`px-6 py-3 rounded-[1.5rem] flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800'}`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="font-extrabold text-sm uppercase tracking-wider">{message.text}</p>
                    </div>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="sticky top-0 z-20 p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-lg flex flex-wrap gap-2">
                {SECTIONS.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-500 ${activeTab === section.id
                            ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/30 scale-105'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-white'}`}
                    >
                        <section.icon size={18} />
                        <span className="whitespace-nowrap">{section.title}</span>
                    </button>
                ))}
            </div>

            {/* Active Section Content */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                            <currentSection.icon size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{currentSection.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full inline-block mt-1">Configuración Activa</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleSave(currentSection.id)}
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-[2rem] font-black transition-all disabled:opacity-50 shadow-xl shadow-brand-500/30 hover:-translate-y-1 active:scale-95"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'PROCESANDO...' : 'GUARDAR SECCIÓN'}
                    </button>
                </div>

                <div className="p-10 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {currentSection.keys.map(key => {
                        const isImage = key === 'image_url';
                        const isLongText = key.includes('paragraph') || key.includes('subtitle') || key.includes('description') || key.includes('embed') || key.includes('benefit');

                        return (
                            <div key={`${activeTab}-${key}`} className={`group ${isLongText ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        {currentSection.labels?.[key] || key.replace(/_/g, ' ')}
                                    </label>
                                    <div className="h-px flex-1 mx-4 bg-slate-100 dark:bg-slate-800 group-focus-within:bg-brand-500/30 transition-colors" />
                                </div>

                                {isImage ? (
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
                                        <ImageUpload
                                            label={currentSection.labels?.[key]}
                                            currentImage={content[activeTab]?.[key]}
                                            onUploadSuccess={(url) => handleChange(key, url)}
                                        />
                                    </div>
                                ) : key === 'music_url' ? (
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
                                        <AudioUpload
                                            label={currentSection.labels?.[key]}
                                            currentAudio={content[activeTab]?.[key] || ''}
                                            onUploadSuccess={(url) => handleChange(key, url)}
                                        />
                                    </div>
                                ) : isLongText ? (
                                    <textarea
                                        rows={key.includes('paragraph') ? 6 : (key.includes('benefit') ? 2 : 3)}
                                        value={content[activeTab]?.[key] || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-full px-8 py-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition font-medium text-lg leading-relaxed text-slate-700 shadow-sm"
                                        placeholder={`Escribe aquí el contenido para "${currentSection.labels?.[key]}"...`}
                                    />
                                ) : key === 'music_enabled' ? (
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => handleChange(key, content[activeTab]?.[key] === 'true' ? 'false' : 'true')}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${content[activeTab]?.[key] === 'true' ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${content[activeTab]?.[key] === 'true' ? 'translate-x-7' : 'translate-x-1'}`}
                                            />
                                        </button>
                                        <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm">
                                            {content[activeTab]?.[key] === 'true' ? 'ACTIVADO' : 'DESACTIVADO'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={content[activeTab]?.[key] || ''}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            className="w-full px-8 py-5 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition font-bold text-lg text-slate-800 shadow-sm"
                                            placeholder={`Ingresa ${currentSection.labels?.[key]}...`}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="text-center py-6">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">MenteOasis Content Manager v2.0 • 2026</p>
            </div>
        </div>
    );
};

export default AdminSiteContent;
