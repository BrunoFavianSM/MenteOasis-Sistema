import { pool } from './database.js';

async function checkDB() {
    try {
        const [rows] = await pool.execute('SELECT section, content_key, content_value FROM site_content WHERE section = "hero" AND content_key = "badge_text"');
        console.log('Current badge_text:', rows[0]?.content_value);

        const [testimonials] = await pool.execute('SELECT COUNT(*) as count FROM testimonials');
        console.log('Total testimonials:', testimonials[0].count);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkDB();
