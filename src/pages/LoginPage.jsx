import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(username, password);

        setIsLoading(false);

        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <a href="/" className="inline-flex items-center gap-2 text-white">
                        <Brain className="w-10 h-10" />
                        <span className="text-3xl font-bold">MenteOasis</span>
                    </a>
                    <p className="text-brand-200 dark:text-slate-400 mt-2 transition-colors duration-300">Panel de Administración</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-10 transition-colors duration-300">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-300">Iniciar Sesión</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 transition-colors duration-300">Ingresa tus credenciales para acceder</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors duration-300">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                                Usuario
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                    placeholder="Ingresa tu usuario"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                    placeholder="Ingresa tu contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 dark:hover:bg-brand-500 transition-colors shadow-lg shadow-brand-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Ingresando...
                                </>
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                        <a href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
                            ← Volver al sitio web
                        </a>
                    </div>
                </div>

                <p className="text-center text-brand-200 dark:text-slate-500 text-sm mt-6 transition-colors duration-300">
                    © {new Date().getFullYear()} MenteOasis. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
