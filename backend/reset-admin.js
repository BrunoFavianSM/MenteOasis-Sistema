import bcrypt from 'bcryptjs';
import { pool } from './database.js';

const resetAdminPassword = async () => {
    try {
        console.log('🔧 Reseteando contraseña del usuario admin...');

        // Hashear la contraseña "admin123"
        const hashedPassword = await bcrypt.hash('admin123', 10);

        console.log('🔐 Hash generado:', hashedPassword.substring(0, 20) + '...');

        // Eliminar usuario admin si existe
        await pool.execute('DELETE FROM web_users WHERE username = ?', ['admin']);
        console.log('🗑️  Usuario admin anterior eliminado');

        // Crear nuevo usuario admin con contraseña correcta
        await pool.execute(
            'INSERT INTO web_users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@menteoasis.com', hashedPassword, 'admin']
        );

        console.log('✅ Usuario admin creado exitosamente');
        console.log('📋 Credenciales:');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123');

        // Verificar que se puede hacer login
        const [users] = await pool.execute('SELECT * FROM web_users WHERE username = ?', ['admin']);
        const user = users[0];

        const isValid = await bcrypt.compare('admin123', user.password);
        console.log('🧪 Test de contraseña:', isValid ? '✅ CORRECTO' : '❌ ERROR');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetAdminPassword();
