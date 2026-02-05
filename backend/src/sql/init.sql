-- MINSAL Recetas - SQLite Schema and Seed Data

DROP TABLE IF EXISTS recetas_detalles;
DROP TABLE IF EXISTS recetas;
DROP TABLE IF EXISTS medicamentos;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS medicos;
DROP TABLE IF EXISTS establecimientos;

CREATE TABLE establecimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

CREATE TABLE medicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    establecimientoid INTEGER NOT NULL REFERENCES establecimientos(id)
);

CREATE TABLE pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    fecha_nacimiento TEXT NOT NULL
);

CREATE TABLE medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

CREATE TABLE recetas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL,
    fecha TEXT NOT NULL DEFAULT (DATE('now')),
    medicoid INTEGER NOT NULL REFERENCES medicos(id),
    pacienteid INTEGER NOT NULL REFERENCES pacientes(id)
);

CREATE TABLE recetas_detalles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cantidad INTEGER NOT NULL,
    dosis TEXT NOT NULL,
    indicaciones TEXT,
    recetaid INTEGER NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    medicamentoid INTEGER NOT NULL REFERENCES medicamentos(id)
);

-- Seed: Establecimientos
INSERT INTO establecimientos (nombre) VALUES
    ('Hospital Nacional Rosales'),
    ('Hospital Nacional de la Mujer'),
    ('Hospital Nacional San Rafael'),
    ('Unidad de Salud Barrios'),
    ('Unidad de Salud San Miguelito');

-- Seed: Medicos
INSERT INTO medicos (nombre, establecimientoid) VALUES
    ('Dr. Carlos Martínez', 1),
    ('Dra. María López', 1),
    ('Dr. José Hernández', 2),
    ('Dra. Ana García', 2),
    ('Dr. Roberto Pérez', 3),
    ('Dra. Laura Sánchez', 3),
    ('Dr. Miguel Torres', 4),
    ('Dra. Carmen Rivera', 5);

-- Seed: Pacientes
INSERT INTO pacientes (nombre, fecha_nacimiento) VALUES
    ('Juan Pérez', '1985-03-15'),
    ('María González', '1990-07-22'),
    ('Carlos Rodríguez', '1978-11-08'),
    ('Ana Martínez', '2000-01-30'),
    ('Pedro López', '1965-05-12'),
    ('Sofía Hernández', '1995-09-25'),
    ('Diego Ramírez', '2010-04-18'),
    ('Valentina Cruz', '1988-12-03');

-- Seed: Medicamentos
INSERT INTO medicamentos (nombre) VALUES
    ('Acetaminofén 500mg'),
    ('Ibuprofeno 400mg'),
    ('Amoxicilina 500mg'),
    ('Omeprazol 20mg'),
    ('Metformina 850mg'),
    ('Losartán 50mg'),
    ('Enalapril 10mg'),
    ('Diclofenaco 50mg'),
    ('Cetirizina 10mg'),
    ('Salbutamol Inhalador');
