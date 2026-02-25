import { pool } from './database.js';

(async () => {
    try {
        const [existing] = await pool.execute("SELECT * FROM site_content WHERE section = 'settings'");
        console.log('Existing settings rows:', existing.length);

        if (existing.length === 0) {
            await pool.execute("INSERT INTO site_content (section, content_key, content_value) VALUES ('settings', 'music_url', '/bucle.m4a')");
            await pool.execute("INSERT INTO site_content (section, content_key, content_value) VALUES ('settings', 'music_enabled', 'true')");
            console.log('✅ Inserted settings rows');
        } else {
            console.log('Settings already exist:', existing.map(r => r.content_key));
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
})();
