import { pool } from './database.js';

const setupTestimonials = async () => {
    try {
        console.log('🏗️ Setting up Testimonials table...');

        // Create table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(255) NOT NULL,
                role VARCHAR(255) DEFAULT 'Paciente',
                content TEXT NOT NULL,
                image_url VARCHAR(500),
                approved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table `testimonials` created or already exists.');

        // Check if empty
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM testimonials');

        if (rows[0].count === 0) {
            console.log('📝 Seeding sample testimonials...');
            const samples = [
                ['Maria G.', 'Paciente de Ansiedad', 'Gracias a MenteOasis pude recuperar mi tranquilidad. Las sesiones son muy profesionales.', true],
                ['Juan P.', 'Terapia de Pareja', 'Nos ayudaron a comunicarnos mejor. Estamos muy agradecidos.', true],
                ['Ana L.', 'Taller de Estrés', 'Increíble experiencia, aprendí herramientas que uso a diario.', false] // Unapproved
            ];

            for (const [name, role, content, approved] of samples) {
                await pool.execute(
                    'INSERT INTO testimonials (patient_name, role, content, approved) VALUES (?, ?, ?, ?)',
                    [name, role, content, approved]
                );
            }
            console.log('✅ Sample data inserted.');
        } else {
            console.log('ℹ️ Table already has data, skipping seed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up testimonials:', error);
        process.exit(1);
    }
};

setupTestimonials();
