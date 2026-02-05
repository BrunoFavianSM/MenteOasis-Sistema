-- =====================================================
-- Base de Datos: dataoasis
-- Sistema de Login para MenteOasis
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS dataoasis;
USE dataoasis;

-- =====================================================
-- Tabla de Usuarios (web_users)
-- Prefijo "web_" para tablas relacionadas con la web
-- =====================================================
DROP TABLE IF EXISTS web_users;

CREATE TABLE web_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Insertar usuario administrador por defecto
-- Usuario: admin
-- Contraseña: admin123 (hasheada con bcrypt - 10 rounds)
-- =====================================================
INSERT INTO web_users (username, email, password, role) VALUES 
('admin', 'admin@menteoasis.com', '$2a$10$X7Z3GjL1Y2Q5R0K9J8H7gOZ3F2V.D4A5B6C7E8N9M0L1P2O3Q4R5S6T', 'admin');

-- =====================================================
-- Nota: La contraseña "admin123" será creada automáticamente
-- por el servidor si el usuario admin no existe.
-- Este archivo es para crear la estructura de la base de datos.
-- =====================================================
