import { pool } from './database.js';

const seedContent = async () => {
    try {
        console.log('🏗️ Creating tables...');

        // ===== Create all tables =====
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS site_content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section VARCHAR(50) NOT NULL,
                content_key VARCHAR(100) NOT NULL,
                content_value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_section_key (section, content_key)
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS hero_phrases (
                id INT AUTO_INCREMENT PRIMARY KEY,
                text VARCHAR(255) NOT NULL,
                display_order INT DEFAULT 0,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                icon_name VARCHAR(50) NOT NULL DEFAULT 'User',
                display_order INT DEFAULT 0,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                event_date VARCHAR(100) NOT NULL,
                event_time VARCHAR(50) NOT NULL,
                location VARCHAR(255) NOT NULL,
                image_url VARCHAR(500),
                form_url VARCHAR(500) DEFAULT '#',
                active BOOLEAN DEFAULT TRUE,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS gallery_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                image_url VARCHAR(500) NOT NULL,
                alt_text VARCHAR(255) DEFAULT '',
                display_order INT DEFAULT 0,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS social_activities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                icon_name VARCHAR(50) NOT NULL DEFAULT 'Heart',
                display_order INT DEFAULT 0,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS social_activity_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                activity_id INT NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                display_order INT DEFAULT 0,
                FOREIGN KEY (activity_id) REFERENCES social_activities(id) ON DELETE CASCADE
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS workshop_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                icon_name VARCHAR(50) NOT NULL DEFAULT 'BookOpen',
                color_class VARCHAR(100) DEFAULT 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
                image_url VARCHAR(500),
                display_order INT DEFAULT 0,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS workshop_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                display_order INT DEFAULT 0,
                FOREIGN KEY (category_id) REFERENCES workshop_categories(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ All tables created.');

        // ===== SEED: site_content =====
        console.log('📝 Seeding site_content...');
        const siteContent = [
            // Hero
            ['hero', 'badge_text', 'Tu bienestar es prioridad'],
            ['hero', 'title_line1', 'Encuentra tu paz'],
            ['hero', 'title_line2', 'interior hoy.'],
            ['hero', 'subtitle', 'Espacio seguro para tu crecimiento emocional. Terapia profesional adaptada a tus necesidades en Talara.'],
            ['hero', 'image_url', 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
            ['hero', 'cta_primary_text', 'Ver Servicios'],
            ['hero', 'cta_secondary_text', 'Contáctanos'],

            // About
            ['about', 'badge_text', 'Nuestra Esencia'],
            ['about', 'title_line1', 'Un refugio para'],
            ['about', 'title_line2', 'tu mente.'],
            ['about', 'paragraph1', 'Somos un equipo de profesionales comprometidos con tu bienestar emocional, ofreciendo herramientas prácticas y apoyo profesional para superar los desafíos de la vida diaria.'],
            ['about', 'paragraph2', 'Nuestro objetivo no es solo tratar síntomas, sino ayudarte a construir una vida plena y significativa a través del autoconocimiento.'],
            ['about', 'image_url', 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            ['about', 'benefit1', 'Profesionales licenciados y especializados'],
            ['about', 'benefit2', 'Ambiente seguro y confidencial'],
            ['about', 'benefit3', 'Enfoque integrador y personalizado'],
            ['about', 'benefit4', 'Horarios flexibles y atención online'],

            // Contact
            ['contact', 'phone', '+51 962268667'],
            ['contact', 'email', 'psicoseverino@gmail.com'],
            ['contact', 'address_line1', 'Av. E-9, Av. Mariscal Cáceres 43'],
            ['contact', 'address_line2', 'Talara 20811, Perú'],
            ['contact', 'whatsapp_number', '51962268667'],
            ['contact', 'formspree_id', 'mykprrjn'],
            ['contact', 'schedule_1_days', 'Lunes, Viernes y Sábado'],
            ['contact', 'schedule_1_hours', '2:00 PM - 7:00 PM'],
            ['contact', 'schedule_2_days', 'Martes, Miércoles y Jueves'],
            ['contact', 'schedule_2_hours', '9:00 AM - 2:00 PM'],
            ['contact', 'schedule_3_days', 'Domingos'],
            ['contact', 'schedule_3_hours', 'Cerrado'],

            // Social links
            ['social', 'facebook_url', 'https://www.facebook.com/MenteOasisPsicologiaPeru'],
            ['social', 'instagram_url', 'https://www.instagram.com/menteoasis_psic/'],
            ['social', 'tiktok_url', 'https://www.tiktok.com/@menteoasis'],
            ['social', 'linktree_url', 'https://linktr.ee/psicoseverin'],

            // Location
            ['location', 'location_address_line1', 'Av. E-9, Av. Mariscal Cáceres 43'],
            ['location', 'location_address_line2', 'Talara 20811, Perú'],
            ['location', 'location_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0719242525065!2d-81.26827569999999!3d-4.5811073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x903645d0a064cb55%3A0xfb62cf4e9b7eae95!2sServicios%20psicol%C3%B3gicos%20Mente%20Oasis!5e0!3m2!1ses-419!2spe!4v1770138731367!5m2!1ses-419!2spe'],
            ['location', 'location_maps_url', 'https://www.google.com/maps/dir//Servicios+psicol%C3%B3gicos+Mente+Oasis/@-4.5811073,-81.2682757,17z'],

            // Footer
            ['footer', 'description', 'Tu compañero en el camino hacia el bienestar mental y emocional. Profesionales comprometidos contigo.'],

            // Navigation Menu
            ['menu', 'home', 'Inicio'],
            ['menu', 'about', 'Nosotros'],
            ['menu', 'services', 'Servicios'],
            ['menu', 'workshops', 'Talleres'],
            ['menu', 'events', 'Eventos'],
            ['menu', 'social', 'Labor Social'],
            ['menu', 'contact', 'Contacto'],

            // Section Titles (sections_text)
            ['sections_text', 'services_badge', 'Nuestros Servicios'],
            ['sections_text', 'services_title', 'Soluciones profesionales'],
            ['sections_text', 'services_subtitle', 'adaptadas a tu momento de vida.'],
            ['sections_text', 'workshops_badge', 'Talleres y Programas'],
            ['sections_text', 'workshops_title', 'Espacios de aprendizaje'],
            ['sections_text', 'workshops_subtitle', 'Diseñados para potenciar tus habilidades y bienestar emocional.'],
            ['sections_text', 'events_badge', 'Próximos Eventos'],
            ['sections_text', 'events_title', 'Únete a nuestras'],
            ['sections_text', 'events_subtitle', 'actividades y conferencias diseñadas para la comunidad.'],
            ['sections_text', 'social_work_badge', 'Proyección Social'],
            ['sections_text', 'social_work_title', 'Corazón en Acción'],
            ['sections_text', 'social_work_subtitle', 'Nuestra labor fuera del consultorio para ayudar a quienes más lo necesitan.'],
            ['sections_text', 'gallery_badge', 'Nuestra Galería'],
            ['sections_text', 'gallery_title', 'Momentos MenteOasis'],
            ['sections_text', 'gallery_subtitle', 'Un vistazo a nuestras instalaciones, talleres y eventos especiales.'],
            ['sections_text', 'testimonials_badge', 'Testimonios'],
            ['sections_text', 'testimonials_title', 'Lo que dicen'],
            ['sections_text', 'testimonials_subtitle', 'nuestros pacientes sobre su proceso de transformación.'],
        ];

        for (const [section, key, value] of siteContent) {
            await pool.execute(
                'INSERT INTO site_content (section, content_key, content_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)',
                [section, key, value]
            );
        }
        console.log('✅ site_content seeded.');

        // ===== SEED: hero_phrases =====
        console.log('📝 Seeding hero_phrases...');
        const [existingPhrases] = await pool.execute('SELECT COUNT(*) as count FROM hero_phrases');
        if (existingPhrases[0].count === 0) {
            const phrases = [
                'Todo lo puedes',
                'Cristo me fortalece',
                'Sé tu propia inspiración',
                'No te quedes, busca ayuda',
                'Dios tiene un plan que lleva tu nombre',
                'No dejes de buscar',
                'Equilibra tu vida',
                'Potencia el talento que hay en ti',
                'Tú puedes, eres fuerte, capaz, valiente',
                'Eres autónomo, inteligente, amado'
            ];
            for (let i = 0; i < phrases.length; i++) {
                await pool.execute('INSERT INTO hero_phrases (text, display_order) VALUES (?, ?)', [phrases[i], i]);
            }
            console.log('✅ hero_phrases seeded.');
        }

        // ===== SEED: services =====
        console.log('📝 Seeding services...');
        const [existingServices] = await pool.execute('SELECT COUNT(*) as count FROM services');
        if (existingServices[0].count === 0) {
            const services = [
                ['Terapia Individual', 'Atención 100% personalizada. Desde el manejo de ansiedad y depresión hasta el desarrollo personal. Especialistas en atención adaptada para niños con autismo y TDAH, potenciando sus capacidades únicas.', 'User', 0],
                ['Terapia de Pareja', 'Recuperen la armonía o transformen sus conflictos en acuerdos constructivos. Apoyo especializado tanto para parejas unidas como separadas que buscan una coparentalidad sana por el bienestar de sus hijos.', 'HeartHandshake', 1],
                ['Terapia Virtual', 'Tu bienestar no tiene fronteras. Accede a terapia profesional desde la comodidad y privacidad de tu hogar, con la misma calidez y eficacia que una sesión presencial.', 'Phone', 2],
                ['Terapia Familiar', 'Fortalece los lazos que importan. Intervención sistémica para resolver conflictos y mejorar la dinámica en el hogar, incluyendo el acompañamiento a padres separados en beneficio de sus hijos.', 'Users', 3],
                ['Talleres Educativos y de desarrollo', 'Espacios de aprendizaje activo para potenciar habilidades clave en ingeniería, arte y función cognitiva.', 'BookOpen', 4],
                ['Talleres para Adultos', 'Programas diseñados para el crecimiento personal, gestión emocional y desarrollo de nuevas competencias.', 'User', 5],
                ['Shows sensoriales y eventos', 'Experiencias inmersivas con propósito, diseñadas para estimular los sentidos y crear memorias inolvidables.', 'Star', 6],
                ['Servicios Corporativos & Institucionales', 'Charlas, talleres y capacitaciones de alto impacto para empresas, colegios y universidades. Potenciamos el capital humano.', 'Users', 7],
            ];
            for (const [title, desc, icon, order] of services) {
                await pool.execute('INSERT INTO services (title, description, icon_name, display_order) VALUES (?, ?, ?, ?)', [title, desc, icon, order]);
            }
            console.log('✅ services seeded.');
        }

        // ===== SEED: events =====
        console.log('📝 Seeding events...');
        const [existingEvents] = await pool.execute('SELECT COUNT(*) as count FROM events');
        if (existingEvents[0].count === 0) {
            const events = [
                ['Salud Integral', '11 de Abril, 2026', '4:00 PM', 'Auditorio Pérez de Cuéllar', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_KVeu3RnnZ_JT_2YWc1qHDOKs7lFqhudp0g&s', 'https://docs.google.com/forms/d/e/1FAIpQLScVAAGNSYw6dssSoLH_DEO3yqRdteagh0lppJ9vi3UkVq8sdw/viewform?usp=dialog', 0],
                ['Septiembre: Lucha contra el suicidio', '10 de Septiembre, 2026', '6:00 PM', 'Centro de Convenciones', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '#', 1],
                ['Día de la Salud Mental', '10 de Octubre, 2026', '5:00 PM', 'Parque Central', 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '#', 2],
                ['Día del Psicólogo', '30 de Abril, 2026', '7:00 PM', 'Auditorio Principal', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '#', 3],
            ];
            for (const [title, date, time, location, image, form, order] of events) {
                await pool.execute('INSERT INTO events (title, event_date, event_time, location, image_url, form_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, date, time, location, image, form, order]);
            }
            console.log('✅ events seeded.');
        }

        // ===== SEED: gallery_images =====
        console.log('📝 Seeding gallery_images...');
        const [existingGallery] = await pool.execute('SELECT COUNT(*) as count FROM gallery_images');
        if (existingGallery[0].count === 0) {
            const images = [
                'https://images.unsplash.com/photo-1529156069896-859328862430?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ];
            for (let i = 0; i < images.length; i++) {
                await pool.execute('INSERT INTO gallery_images (image_url, alt_text, display_order) VALUES (?, ?, ?)', [images[i], `Galería ${i + 1}`, i]);
            }
            console.log('✅ gallery_images seeded.');
        }

        // ===== SEED: social_activities + images =====
        console.log('📝 Seeding social_activities...');
        const [existingSocial] = await pool.execute('SELECT COUNT(*) as count FROM social_activities');
        if (existingSocial[0].count === 0) {
            const activities = [
                {
                    title: 'Banco de Fe',
                    description: 'Apoyo espiritual y emocional en momentos de crisis. Recolectamos utensilios de primera necesidad entregados con mensajes de esperanza y crecimiento espiritual.',
                    icon: 'Heart',
                    images: [
                        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    ]
                },
                {
                    title: 'Talleres Técnicos (Adultos)',
                    description: 'Impulsamos el emprendimiento y la vocación. Cursos de desarrollo personal y oficios para potenciar la autonomía económica.',
                    icon: 'Laptop',
                    images: [
                        'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    ]
                },
                {
                    title: 'Talleres Educativos (Niños)',
                    description: 'Cursos breves para niños en situación vulnerable. Fomentamos habilidades que mejorarán sus futuras oportunidades de empleabilidad.',
                    icon: 'GraduationCap',
                    images: [
                        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1544928147-79a2e746b50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    ]
                },
                {
                    title: 'Días de Voluntariado',
                    description: 'Nuestro equipo en acción. Jornadas dedicadas a causas sociales donde vivimos la empatía y el servicio de primera mano.',
                    icon: 'Users',
                    images: [
                        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1596387431189-53e990c00829?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    ]
                },
                {
                    title: 'Programas de Mentoría',
                    description: 'Acompañamiento 1 a 1 para jóvenes líderes de sectores vulnerables. No es un taller, es una guía personalizada para su inserción profesional.',
                    icon: 'Users',
                    images: [
                        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    ]
                },
            ];

            for (let i = 0; i < activities.length; i++) {
                const a = activities[i];
                const [result] = await pool.execute(
                    'INSERT INTO social_activities (title, description, icon_name, display_order) VALUES (?, ?, ?, ?)',
                    [a.title, a.description, a.icon, i]
                );
                const activityId = result.insertId;
                for (let j = 0; j < a.images.length; j++) {
                    await pool.execute(
                        'INSERT INTO social_activity_images (activity_id, image_url, display_order) VALUES (?, ?, ?)',
                        [activityId, a.images[j], j]
                    );
                }
            }
            console.log('✅ social_activities seeded.');
        }

        // ===== SEED: workshop_categories + items =====
        console.log('📝 Seeding workshops...');
        const [existingWorkshops] = await pool.execute('SELECT COUNT(*) as count FROM workshop_categories');
        if (existingWorkshops[0].count === 0) {
            const categories = [
                {
                    title: 'Talleres para Adultos y Adolescentes (GAM)',
                    description: 'Espacios de crecimiento y grupos de ayuda mutua.',
                    icon: 'Users',
                    color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
                    image: 'https://images.unsplash.com/photo-1529156069896-859328862430?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    items: [
                        ['Manejo de la Ansiedad (GAM)', 'Grupo de apoyo para compartir y aprender estrategias de afrontamiento.'],
                        ['Habilidades Sociales para Adolescentes', 'Mejora la comunicación y confianza en situaciones sociales.'],
                        ['Gestión Emocional', 'Aprende a identificar y regular tus emociones de manera saludable.'],
                    ]
                },
                {
                    title: 'Shows Sensoriales y Eventos con Propósito',
                    description: 'Experiencias mágicas para cumpleaños y fechas especiales.',
                    icon: 'Sparkles',
                    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    items: [
                        ['Cumpleaños Sensoriales', 'Celebraciones adaptadas con estímulos controlados y divertidos.'],
                        ['Día del Niño Inclusivo', 'Eventos diseñados para que todos disfruten por igual.'],
                        ['Activaciones con Propósito', 'Eventos que educan y entretienen.'],
                    ]
                },
                {
                    title: 'Servicios Corporativos',
                    description: 'Potenciamos el bienestar y rendimiento en tu empresa.',
                    icon: 'Briefcase',
                    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    items: [
                        ['Manejo del Estrés Laboral', 'Técnicas prácticas para equipos de alto rendimiento.'],
                        ['Liderazgo Empático', 'Formación para líderes que inspiran.'],
                        ['Clima Laboral Positivo', 'Dinámicas de integración y comunicación.'],
                    ]
                },
                {
                    title: 'Talleres Educativos y de Desarrollo (STEAM)',
                    description: 'Ingeniería, Arte y Habilidades para el futuro.',
                    icon: 'BrainCircuit',
                    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
                    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    items: [
                        ['Habilidades de Ingeniería', 'Construcción con bloques, retos prácticos, armado y desarmado de sistemas.'],
                        ['Psico Expresa', 'Gestión de emociones, teatro, autoestima, empatía y comunicación.'],
                        ['Habilidades Blandas', 'Manejo del comportamiento, tolerancia al estrés, trabajo en equipo, liderazgo, resolución de conflictos, creatividad.'],
                        ['Habilidades Artísticas', 'Lectura de partitura musical, tocar instrumentos de guitarra, teclado, melódica o violín, manualidades, dibujo y pintura.'],
                        ['Habilidades Cognitivas', 'Atención y concentración, memoria, comprensión, planificación, razonamiento.'],
                    ]
                },
                {
                    title: 'Servicios Institucionales',
                    description: 'Programas integrales para colegios y universidades.',
                    icon: 'GraduationCap',
                    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    items: [
                        ['Escuela para Padres', 'Orientación en crianza respetuosa y límites.'],
                        ['Capacitación Docente', 'Estrategias de manejo conductual en el aula.'],
                        ['Prevención del Bullying', 'Programas de convivencia escolar.'],
                    ]
                },
            ];

            for (let i = 0; i < categories.length; i++) {
                const cat = categories[i];
                const [result] = await pool.execute(
                    'INSERT INTO workshop_categories (title, description, icon_name, color_class, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
                    [cat.title, cat.description, cat.icon, cat.color, cat.image, i]
                );
                const categoryId = result.insertId;
                for (let j = 0; j < cat.items.length; j++) {
                    await pool.execute(
                        'INSERT INTO workshop_items (category_id, title, description, display_order) VALUES (?, ?, ?, ?)',
                        [categoryId, cat.items[j][0], cat.items[j][1], j]
                    );
                }
            }
            console.log('✅ workshops seeded.');
        }

        console.log('\n🎉 All content seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding content:', error);
        process.exit(1);
    }
};

seedContent();
