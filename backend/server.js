import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool, testConnection } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
testConnection();

// =====================================================
// AUTH ROUTES
// =====================================================

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('📝 Intento de login:', username);

        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }

        // Buscar usuario en la base de datos
        const [users] = await pool.execute(
            'SELECT * FROM web_users WHERE username = ?',
            [username]
        );

        console.log('👤 Usuarios encontrados:', users.length);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
        console.log('🔍 Usuario encontrado:', { username: user.username, role: user.role });

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);

        console.log('🔐 Contraseña válida:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );

        console.log('✅ Login exitoso para:', user.username);

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Verify Token (para validar si el usuario sigue autenticado)
app.get('/api/auth/verify', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ valid: false, message: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar que el usuario aún existe
        const [users] = await pool.execute(
            'SELECT id, username, email, role FROM web_users WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({ valid: false, message: 'Usuario no encontrado' });
        }

        res.json({ valid: true, user: users[0] });

    } catch (error) {
        res.status(401).json({ valid: false, message: 'Token inválido' });
    }
});

// =====================================================
// DEBUG ROUTE: Ver usuarios (temporal)
// =====================================================
app.get('/api/debug/users', async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT id, username, email, role, created_at FROM web_users');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================================================
// UTILITY: Create admin user if not exists
// =====================================================
const createAdminUser = async () => {
    try {
        console.log('🔍 Verificando usuario admin...');

        const [users] = await pool.execute(
            'SELECT * FROM web_users WHERE username = ?',
            ['admin']
        );

        if (users.length === 0) {
            console.log('👤 Creando usuario admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.execute(
                'INSERT INTO web_users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@menteoasis.com', hashedPassword, 'admin']
            );
            console.log('✅ Usuario admin creado exitosamente');
            console.log('📋 Credenciales: admin / admin123');
        } else {
            console.log('✅ Usuario admin ya existe');
            console.log('📋 Usuario:', users[0].username);
        }
    } catch (error) {
        console.error('❌ Error creando admin:', error.message);
    }
};

// Run after connection
setTimeout(createAdminUser, 2000);

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📍 Endpoints disponibles:`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   - GET  http://localhost:${PORT}/api/auth/verify`);
    console.log(`   - GET  http://localhost:${PORT}/api/debug/users (temporal)`);
});
