import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard, LogOut, Home, Settings, Users, Calendar,
    BookOpen, Heart, MessageSquare, Image as ImageIcon,
    MapPin, Globe, ChevronRight, Menu, X
} from 'lucide-react';

// Admin Components
import AdminTestimonials from '../components/admin/AdminTestimonials';
import AdminSiteContent from '../components/admin/AdminSiteContent';
import AdminServices from '../components/admin/AdminServices';
import AdminEvents from '../components/admin/AdminEvents';
import AdminGallery from '../components/admin/AdminGallery';
import AdminSocialWork from '../components/admin/AdminSocialWork';
import AdminWorkshops from '../components/admin/AdminWorkshops';

import logoAnimado from '../assets/logoanimado.mp4';
import logoAnimadoOscuro from '../assets/logoanimadooscuro.mp4';

const AdminPage = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'site-content', label: 'Contenido Web', icon: Globe },
        { id: 'services', label: 'Servicios', icon: Heart },
        { id: 'workshops', label: 'Talleres', icon: BookOpen },
        { id: 'events', label: 'Eventos', icon: Calendar },
        { id: 'social-work', label: 'Labor Social', icon: Users },
        { id: 'gallery', label: 'Galería', icon: ImageIcon },
        { id: 'testimonials', label: 'Testimonios', icon: MessageSquare },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'site-content': return <AdminSiteContent />;
            case 'services': return <AdminServices />;
            case 'workshops': return <AdminWorkshops />;
            case 'events': return <AdminEvents />;
            case 'social-work': return <AdminSocialWork />;
            case 'gallery': return <AdminGallery />;
            case 'testimonials': return <AdminTestimonials />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-8">
                        {/* Welcome Card */}
                        <div className="bg-gradient-to-r from-brand-600 to-teal-600 dark:from-brand-800 dark:to-teal-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    ¡Hola de nuevo, {user?.username}!
                                </h2>
                                <p className="text-brand-100 dark:text-brand-200 text-lg max-w-2xl">
                                    Bienvenido al centro de control de MenteOasis.
                                    Aquí puedes actualizar cada rincón de tu sitio web de forma sencilla.
                                </p>
                            </div>
                            {/* Decorative bubbles or patterns could go here */}
                        </div>

                        {/* Quick Stats / Actions */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {navItems.filter(item => item.id !== 'dashboard').map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left flex flex-col gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white">{item.label}</h4>
                                        <p className="text-xs text-slate-500">Administrar sección</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                        <video
                            src={theme === 'dark' ? logoAnimadoOscuro : logoAnimado}
                            autoPlay loop muted playsInline
                            className="w-10 h-10 object-cover rounded-full"
                        />
                        <div>
                            <h1 className="font-extrabold text-slate-800 dark:text-white">MenteOasis</h1>
                            <p className="text-[10px] uppercase tracking-widest text-brand-600 font-bold">Admin Panel</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 transition-all mb-4 border border-brand-100 dark:border-brand-800"
                        >
                            <Home size={20} />
                            <span className="flex-1 text-left">Ver Sitio Web</span>
                            <ChevronRight size={16} />
                        </a>

                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {activeTab === item.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-50 dark:border-slate-800/50">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.username}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                            <LogOut size={20} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Navbar for Mobile */}
                <header className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center z-30">
                    <div className="flex items-center gap-2">
                        <video
                            src={theme === 'dark' ? logoAnimadoOscuro : logoAnimado}
                            autoPlay loop muted playsInline
                            className="w-8 h-8 object-cover rounded-full"
                        />
                        <span className="font-bold text-slate-800 dark:text-white">Admin Panel</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 dark:text-slate-400">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 scrollbar-none">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;

