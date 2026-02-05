import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Brain, LogOut, Home, Settings, Users, Calendar, BookOpen, Heart } from 'lucide-react';

const AdminPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Brain className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Panel de Administración</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">MenteOasis</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">{user?.username}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize transition-colors duration-300">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Cerrar sesión"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-brand-600 to-teal-600 dark:from-brand-800 dark:to-teal-800 rounded-3xl p-8 md:p-12 text-white mb-12 shadow-xl transition-colors duration-300">
                    <h2 className="text-3xl font-bold mb-2">
                        ¡Bienvenido, {user?.username}!
                    </h2>
                    <p className="text-brand-100 dark:text-brand-200 text-lg transition-colors duration-300">
                        Este es el panel de administración de MenteOasis.
                        Desde aquí podrás gestionar el contenido de la página web.
                    </p>
                </div>

                {/* Quick Actions */}
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-300">Acciones Rápidas</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer group transition-colors duration-300">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-colors duration-300">
                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1 transition-colors duration-300">Eventos</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Gestionar eventos futuros</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer group transition-colors duration-300">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-colors duration-300">
                            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1 transition-colors duration-300">Talleres</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Administrar talleres</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer group transition-colors duration-300">
                        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-colors duration-300">
                            <Heart className="w-6 h-6 text-teal-600 dark:text-teal-400 transition-colors duration-300" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1 transition-colors duration-300">Responsabilidad Social</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Actualizar evidencias</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer group transition-colors duration-300">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-colors duration-300">
                            <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1 transition-colors duration-300">Configuración</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Ajustes del sistema</p>
                    </div>
                </div>

                {/* Placeholder Content */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-12 text-center transition-colors duration-300">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                        <Settings className="w-12 h-12 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-300">Área en Construcción</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto transition-colors duration-300">
                        Próximamente podrás gestionar todo el contenido de la página web desde este panel.
                        Las funcionalidades se irán agregando progresivamente.
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 dark:hover:bg-brand-500 transition-colors duration-300"
                    >
                        <Home className="w-4 h-4" />
                        Ver Página Web
                    </a>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
