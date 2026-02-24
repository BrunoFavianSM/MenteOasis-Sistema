import { pool } from './database.js';

async function migrate() {
    try {
        console.log('🔄 Iniciando migración de talleres...');
        await pool.execute("ALTER TABLE workshop_categories MODIFY COLUMN color_class VARCHAR(255) DEFAULT 'bg-teal-50 border-teal-100 text-teal-600'");
        console.log('✅ Columna "color_class" ampliada a 255 caracteres.');
    } catch (error) {
        console.error('❌ Error en la migración:', error);
    } finally {
        process.exit();
    }
}

migrate();
