import { pool } from './database.js';

async function migrate() {
    try {
        console.log('🔄 Iniciando migración de base de datos...');
        const [rows] = await pool.execute("SHOW COLUMNS FROM gallery_images LIKE 'category'");
        if (rows.length === 0) {
            await pool.execute("ALTER TABLE gallery_images ADD COLUMN category VARCHAR(100) DEFAULT 'General' AFTER alt_text");
            console.log('✅ Columna "category" añadida a gallery_images.');
        } else {
            console.log('ℹ️ La columna "category" ya existe.');
        }
    } catch (error) {
        console.error('❌ Error en la migración:', error);
    } finally {
        process.exit();
    }
}

migrate();
