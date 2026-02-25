import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool, testConnection } from './database.js';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';

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

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(join(__dirname, 'public', 'uploads')));

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'), false);
        }
    }
});

const audioUpload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4', 'audio/aac', 'audio/ogg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de audio (MP3, WAV, M4A, AAC, OGG)'), false);
        }
    }
});

// =====================================================
// AUTH MIDDLEWARE
// =====================================================
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            console.log('🚫 Acceso denegado: Token ausente');
            return res.status(401).json({ message: 'Sesión no iniciada. Por favor, ingresa tus credenciales.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('🚫 Sesión inválida:', err.message);
        res.status(401).json({ message: 'Sesión expirada o inválida. Por favor, inicia sesión de nuevo.' });
    }
};

// =====================================================
// AUTH ROUTES
// =====================================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }
        const [users] = await pool.execute('SELECT * FROM web_users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );

        res.json({
            message: 'Login exitoso', token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.get('/api/auth/verify', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ valid: false });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await pool.execute('SELECT id, username, email, role FROM web_users WHERE id = ?', [decoded.id]);
        if (users.length === 0) return res.status(401).json({ valid: false });
        res.json({ valid: true, user: users[0] });
    } catch {
        res.status(401).json({ valid: false, message: 'Token inválido' });
    }
});

// =====================================================
// IMAGE UPLOAD & WEBP CONVERSION
// =====================================================
app.post('/api/admin/upload', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }

        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const filePath = join(uploadsDir, fileName);

        await sharp(req.file.buffer)
            .webp({ quality: 80 })
            .toFile(filePath);

        res.json({
            message: 'Imagen subida y convertida a WebP',
            url: `/uploads/${fileName}`
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: 'Error al procesar la imagen' });
    }
});

// MULTIPLE IMAGE UPLOAD
app.post('/api/admin/upload-multiple', authMiddleware, upload.array('images', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se subieron imágenes' });
        }

        const uploadPromises = req.files.map(async (file) => {
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
            const filePath = join(uploadsDir, fileName);

            await sharp(file.buffer)
                .webp({ quality: 80 })
                .toFile(filePath);

            return `/uploads/${fileName}`;
        });

        const urls = await Promise.all(uploadPromises);

        res.json({
            message: `${urls.length} imágenes subidas correctamente`,
            urls
        });
    } catch (error) {
        console.error('Error processing multiple images:', error);
        res.status(500).json({ message: 'Error al procesar las imágenes' });
    }
});

// =====================================================
// SITE CONTENT (key-value texts)
// =====================================================
app.get('/api/content', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT section, content_key, content_value FROM site_content');
        const content = {};
        for (const row of rows) {
            if (!content[row.section]) content[row.section] = {};
            content[row.section][row.content_key] = row.content_value;
        }
        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Error al obtener contenido' });
    }
});

app.get('/api/content/:section', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT content_key, content_value FROM site_content WHERE section = ?', [req.params.section]);
        const content = {};
        for (const row of rows) content[row.content_key] = row.content_value;
        res.json(content);
    } catch (error) {
        console.error('Error fetching section content:', error);
        res.status(500).json({ message: 'Error al obtener contenido' });
    }
});

const updateSectionContent = async (req, res) => {
    try {
        const section = req.params.section;
        const sectionData = req.body;
        console.log(`💾 Guardando [${section}]:`, Object.keys(sectionData));

        for (const [key, value] of Object.entries(sectionData)) {
            await pool.execute(
                'INSERT INTO site_content (section, content_key, content_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content_value = ?',
                [section, key, value, value]
            );
        }
        res.json({ message: 'Sección actualizada con éxito' });
    } catch (error) {
        console.error('❌ Error de base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar.' });
    }
};

app.put('/api/content/:section', authMiddleware, updateSectionContent);
app.put('/api/admin/site-content/:section', authMiddleware, updateSectionContent);

app.put('/api/admin/content', authMiddleware, async (req, res) => {
    try {
        const { section, content_key, content_value } = req.body;
        await pool.execute(
            'INSERT INTO site_content (section, content_key, content_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content_value = ?',
            [section, content_key, content_value, content_value]
        );
        res.json({ message: 'Contenido actualizado' });
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ message: 'Error al actualizar contenido' });
    }
});

app.put('/api/admin/content/bulk', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body; // [{ section, content_key, content_value }]
        for (const item of items) {
            await pool.execute(
                'INSERT INTO site_content (section, content_key, content_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content_value = ?',
                [item.section, item.content_key, item.content_value, item.content_value]
            );
        }
        res.json({ message: 'Contenido actualizado' });
    } catch (error) {
        console.error('Error bulk updating content:', error);
        res.status(500).json({ message: 'Error al actualizar contenido' });
    }
});

// =====================================================
// HERO PHRASES
// =====================================================
app.get('/api/hero-phrases', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM hero_phrases WHERE active = TRUE ORDER BY display_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener frases' });
    }
});

app.get('/api/admin/hero-phrases', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM hero_phrases ORDER BY display_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener frases' });
    }
});

app.post('/api/admin/hero-phrases', authMiddleware, async (req, res) => {
    try {
        const { text, display_order = 0, active = true } = req.body;
        await pool.execute('INSERT INTO hero_phrases (text, display_order, active) VALUES (?, ?, ?)', [text, display_order, active]);
        res.status(201).json({ message: 'Frase creada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear frase' });
    }
});

app.put('/api/admin/hero-phrases/:id', authMiddleware, async (req, res) => {
    try {
        const { text, display_order, active } = req.body;
        await pool.execute('UPDATE hero_phrases SET text = ?, display_order = ?, active = ? WHERE id = ?', [text, display_order, active, req.params.id]);
        res.json({ message: 'Frase actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar frase' });
    }
});

app.delete('/api/admin/hero-phrases/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM hero_phrases WHERE id = ?', [req.params.id]);
        res.json({ message: 'Frase eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar frase' });
    }
});

// =====================================================
// SERVICES
// =====================================================
app.get('/api/services', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM services WHERE active = 1 ORDER BY display_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener servicios' });
    }
});

app.get('/api/admin/services', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM services ORDER BY display_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener servicios' });
    }
});

app.post('/api/admin/services', authMiddleware, async (req, res) => {
    try {
        const { title, description, icon_name, display_order = 0, active = true } = req.body;
        await pool.execute('INSERT INTO services (title, description, icon_name, display_order, active) VALUES (?, ?, ?, ?, ?)',
            [title, description, icon_name, display_order, active]);
        res.status(201).json({ message: 'Servicio creado' });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Error al crear servicio' });
    }
});

app.put('/api/admin/services/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, icon_name, display_order = 0, active = true } = req.body;
        await pool.execute('UPDATE services SET title = ?, description = ?, icon_name = ?, display_order = ?, active = ? WHERE id = ?',
            [title, description, icon_name, display_order, active, req.params.id]);
        res.json({ message: 'Servicio actualizado' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Error al actualizar servicio' });
    }
});

app.delete('/api/admin/services/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM services WHERE id = ?', [req.params.id]);
        res.json({ message: 'Servicio eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar servicio' });
    }
});

// =====================================================
// EVENTS
// =====================================================
app.get('/api/events', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM events WHERE active = 1 ORDER BY display_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

app.get('/api/admin/events', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM events ORDER BY display_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

app.post('/api/admin/events', authMiddleware, async (req, res) => {
    try {
        const { title, event_date, event_time, location, image_url, form_url, display_order = 0, active = true } = req.body;
        await pool.execute('INSERT INTO events (title, event_date, event_time, location, image_url, form_url, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, event_date, event_time, location, image_url, form_url || '#', display_order, active]);
        res.status(201).json({ message: 'Evento creado' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error al crear evento' });
    }
});

app.put('/api/admin/events/:id', authMiddleware, async (req, res) => {
    try {
        const { title, event_date, event_time, location, image_url, form_url, display_order = 0, active = true } = req.body;
        await pool.execute('UPDATE events SET title = ?, event_date = ?, event_time = ?, location = ?, image_url = ?, form_url = ?, display_order = ?, active = ? WHERE id = ?',
            [title, event_date, event_time, location, image_url, form_url, display_order, active, req.params.id]);
        res.json({ message: 'Evento actualizado' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error al actualizar evento' });
    }
});

app.delete('/api/admin/events/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
});

// =====================================================
// AUDIO UPLOAD ROUTE
// =====================================================
app.post('/api/admin/upload-audio', authMiddleware, audioUpload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }

        const ext = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
        const fileName = `music_${Date.now()}${ext}`;
        const filePath = join(uploadsDir, fileName);

        fs.writeFileSync(filePath, req.file.buffer);

        res.json({
            message: 'Audio subido con éxito',
            url: `/uploads/${fileName}`
        });
    } catch (error) {
        console.error('Error uploading audio:', error);
        res.status(500).json({ message: 'Error al procesar el audio' });
    }
});

// =====================================================
// GALLERY
// =====================================================
app.get('/api/gallery', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM gallery_images WHERE active = 1 ORDER BY display_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener galería' });
    }
});

app.get('/api/admin/gallery', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM gallery_images ORDER BY category, display_order');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching admin gallery:', error);
        res.status(500).json({ message: 'Error al obtener galería' });
    }
});

app.post('/api/admin/gallery', authMiddleware, async (req, res) => {
    try {
        const { image_url, alt_text, category = 'General', display_order = 0, active = true } = req.body;
        await pool.execute('INSERT INTO gallery_images (image_url, alt_text, category, display_order, active) VALUES (?, ?, ?, ?, ?)',
            [image_url, alt_text || '', category, display_order, active]);
        res.status(201).json({ message: 'Imagen agregada' });
    } catch (error) {
        console.error('Error adding gallery image:', error);
        res.status(500).json({ message: 'Error al agregar imagen' });
    }
});

app.post('/api/admin/gallery/bulk', authMiddleware, async (req, res) => {
    try {
        const { images } = req.body; // [{ image_url, category, ... }]
        if (!images || !Array.isArray(images)) return res.status(400).json({ message: 'Datos inválidos' });

        for (const img of images) {
            await pool.execute('INSERT INTO gallery_images (image_url, category, display_order) VALUES (?, ?, ?)',
                [img.image_url, img.category || 'General', img.display_order || 0]);
        }
        res.json({ message: `${images.length} imágenes agregadas` });
    } catch (error) {
        console.error('Error bulk adding gallery images:', error);
        res.status(500).json({ message: 'Error al agregar imágenes' });
    }
});

app.put('/api/admin/gallery/bulk-category', authMiddleware, async (req, res) => {
    try {
        const { ids, category } = req.body;
        if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: 'IDs inválidos' });

        await pool.query('UPDATE gallery_images SET category = ? WHERE id IN (?)', [category, ids]);
        res.json({ message: 'Categoría actualizada para las imágenes seleccionadas' });
    } catch (error) {
        console.error('Error bulk updating category:', error);
        res.status(500).json({ message: 'Error al actualizar imágenes' });
    }
});

app.delete('/api/admin/gallery/bulk-delete', authMiddleware, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: 'IDs inválidos' });

        await pool.query('DELETE FROM gallery_images WHERE id IN (?)', [ids]);
        res.json({ message: 'Imágenes eliminadas correctamente' });
    } catch (error) {
        console.error('Error bulk deleting gallery images:', error);
        res.status(500).json({ message: 'Error al eliminar imágenes' });
    }
});

app.put('/api/admin/gallery/:id', authMiddleware, async (req, res) => {
    try {
        const { image_url, alt_text, category, display_order = 0, active = true } = req.body;
        await pool.execute('UPDATE gallery_images SET image_url = ?, alt_text = ?, category = ?, display_order = ?, active = ? WHERE id = ?',
            [image_url, alt_text, category, display_order, active, req.params.id]);
        res.json({ message: 'Imagen actualizada' });
    } catch (error) {
        console.error('Error updating gallery image:', error);
        res.status(500).json({ message: 'Error al actualizar imagen' });
    }
});

app.delete('/api/admin/gallery/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM gallery_images WHERE id = ?', [req.params.id]);
        res.json({ message: 'Imagen eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar imagen' });
    }
});

// =====================================================
// SOCIAL ACTIVITIES
// =====================================================
app.get('/api/social-activities', async (req, res) => {
    try {
        const [activities] = await pool.execute('SELECT * FROM social_activities WHERE active = 1 ORDER BY display_order');
        for (const activity of activities) {
            const [images] = await pool.execute('SELECT * FROM social_activity_images WHERE activity_id = ? ORDER BY display_order', [activity.id]);
            activity.images = images.map(img => img.image_url);
        }
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener actividades sociales' });
    }
});

app.get('/api/admin/social-activities', authMiddleware, async (req, res) => {
    try {
        const [activities] = await pool.execute('SELECT * FROM social_activities ORDER BY display_order');
        for (const activity of activities) {
            const [images] = await pool.execute('SELECT * FROM social_activity_images WHERE activity_id = ? ORDER BY display_order', [activity.id]);
            activity.images = images.map(img => img.image_url);
        }
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener actividades sociales' });
    }
});

app.post('/api/admin/social-activities', authMiddleware, async (req, res) => {
    try {
        const { title, description, icon_name, display_order = 0, active = true, images = [] } = req.body;
        const [result] = await pool.execute('INSERT INTO social_activities (title, description, icon_name, display_order, active) VALUES (?, ?, ?, ?, ?)',
            [title, description, icon_name, display_order, active]);
        const activityId = result.insertId;
        for (let i = 0; i < images.length; i++) {
            const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].image_url;
            await pool.execute('INSERT INTO social_activity_images (activity_id, image_url, display_order) VALUES (?, ?, ?)', [activityId, imgUrl, i]);
        }
        res.status(201).json({ message: 'Actividad creada' });
    } catch (error) {
        console.error('Error creating social activity:', error);
        res.status(500).json({ message: 'Error al crear actividad' });
    }
});

app.put('/api/admin/social-activities/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, icon_name, display_order = 0, active = true, images = [] } = req.body;
        await pool.execute('UPDATE social_activities SET title = ?, description = ?, icon_name = ?, display_order = ?, active = ? WHERE id = ?',
            [title, description, icon_name, display_order, active, req.params.id]);

        // Replace images
        await pool.execute('DELETE FROM social_activity_images WHERE activity_id = ?', [req.params.id]);
        for (let i = 0; i < images.length; i++) {
            const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].image_url;
            await pool.execute('INSERT INTO social_activity_images (activity_id, image_url, display_order) VALUES (?, ?, ?)', [req.params.id, imgUrl, i]);
        }
        res.json({ message: 'Actividad actualizada' });
    } catch (error) {
        console.error('Error updating social activity:', error);
        res.status(500).json({ message: 'Error al actualizar actividad' });
    }
});

app.delete('/api/admin/social-activities/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM social_activities WHERE id = ?', [req.params.id]);
        res.json({ message: 'Actividad eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar actividad' });
    }
});

// =====================================================
// WORKSHOPS (Categories + Items)
// =====================================================
app.get('/api/workshops', async (req, res) => {
    try {
        const [categories] = await pool.execute('SELECT * FROM workshop_categories WHERE active = 1 ORDER BY display_order');
        for (const cat of categories) {
            const [items] = await pool.execute('SELECT * FROM workshop_items WHERE category_id = ? ORDER BY display_order', [cat.id]);
            cat.items = items;
        }
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener talleres' });
    }
});

app.get('/api/admin/workshops', authMiddleware, async (req, res) => {
    try {
        const [categories] = await pool.execute('SELECT * FROM workshop_categories ORDER BY display_order');
        for (const cat of categories) {
            const [items] = await pool.execute('SELECT * FROM workshop_items WHERE category_id = ? ORDER BY display_order', [cat.id]);
            cat.items = items;
        }
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener talleres' });
    }
});

app.post('/api/admin/workshops', authMiddleware, async (req, res) => {
    try {
        const { title, description = '', icon_name, color_class, image_url = '', display_order = 0, active = true, items = [] } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO workshop_categories (title, description, icon_name, color_class, image_url, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, icon_name, color_class, image_url, display_order, active]
        );
        const categoryId = result.insertId;
        for (let i = 0; i < items.length; i++) {
            await pool.execute('INSERT INTO workshop_items (category_id, title, description, display_order) VALUES (?, ?, ?, ?)',
                [categoryId, items[i].title, items[i].description, i]);
        }
        res.status(201).json({ message: 'Taller creado' });
    } catch (error) {
        console.error('Error creating workshop:', error);
        res.status(500).json({ message: 'Error al crear taller' });
    }
});

app.put('/api/admin/workshops/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description = '', icon_name, color_class, image_url = '', display_order = 0, active = true, items = [] } = req.body;
        await pool.execute(
            'UPDATE workshop_categories SET title = ?, description = ?, icon_name = ?, color_class = ?, image_url = ?, display_order = ?, active = ? WHERE id = ?',
            [title, description, icon_name, color_class, image_url, display_order, active, req.params.id]
        );
        // Replace items
        if (items && items.length > 0) {
            await pool.execute('DELETE FROM workshop_items WHERE category_id = ?', [req.params.id]);
            for (let i = 0; i < items.length; i++) {
                await pool.execute('INSERT INTO workshop_items (category_id, title, description, display_order) VALUES (?, ?, ?, ?)',
                    [req.params.id, items[i].title, items[i].description, i]);
            }
        }
        res.json({ message: 'Taller actualizado' });
    } catch (error) {
        console.error('Error updating workshop:', error);
        res.status(500).json({ message: 'Error al actualizar taller' });
    }
});

app.delete('/api/admin/workshops/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM workshop_categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Taller eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar taller' });
    }
});

// WORKSHOP ITEMS (Internal)
app.post('/api/admin/workshops/items', authMiddleware, async (req, res) => {
    try {
        const { category_id, title, description, display_order = 0 } = req.body;
        await pool.execute('INSERT INTO workshop_items (category_id, title, description, display_order) VALUES (?, ?, ?, ?)',
            [category_id, title, description, display_order]);
        res.status(201).json({ message: 'Ítem de taller creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear ítem de taller' });
    }
});

app.put('/api/admin/workshops/items/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, display_order = 0, category_id } = req.body;
        await pool.execute('UPDATE workshop_items SET title = ?, description = ?, display_order = ?, category_id = ? WHERE id = ?',
            [title, description, display_order, category_id, req.params.id]);
        res.json({ message: 'Ítem de taller actualizado' });
    } catch (error) {
        console.error('Error updating workshop item:', error);
        res.status(500).json({ message: 'Error al actualizar ítem de taller' });
    }
});

app.delete('/api/admin/workshops/items/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM workshop_items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Ítem de taller eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar ítem de taller' });
    }
});

// =====================================================
// TESTIMONIALS
// =====================================================
app.get('/api/testimonials', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM testimonials WHERE approved = TRUE ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener testimonios' });
    }
});

app.get('/api/admin/testimonials', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener testimonios' });
    }
});

app.post('/api/testimonials', async (req, res) => {
    try {
        const { patient_name, role, content, approved = false } = req.body;
        await pool.execute('INSERT INTO testimonials (patient_name, role, content, approved) VALUES (?, ?, ?, ?)',
            [patient_name, role || 'Paciente', content, approved]);
        res.status(201).json({ message: 'Testimonio creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear testimonio' });
    }
});

app.put('/api/admin/testimonials/:id', authMiddleware, async (req, res) => {
    try {
        const { patient_name, role, content, approved } = req.body;
        await pool.execute('UPDATE testimonials SET patient_name = ?, role = ?, content = ?, approved = ? WHERE id = ?',
            [patient_name, role, content, approved, req.params.id]);
        res.json({ message: 'Testimonio actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar testimonio' });
    }
});

app.delete('/api/admin/testimonials/:id', authMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
        res.json({ message: 'Testimonio eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar testimonio' });
    }
});

// =====================================================
// UTILITY: Create admin user if not exists
// =====================================================
const createAdminUser = async () => {
    try {
        const [users] = await pool.execute('SELECT * FROM web_users WHERE username = ?', ['admin']);
        if (users.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.execute('INSERT INTO web_users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@menteoasis.com', hashedPassword, 'admin']);
            console.log('✅ Usuario admin creado (admin / admin123)');
        } else {
            console.log('✅ Usuario admin ya existe');
        }
    } catch (error) {
        console.error('❌ Error creando admin:', error.message);
    }
};

setTimeout(createAdminUser, 2000);

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
