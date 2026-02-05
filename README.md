# MINSAL Recetas

Sistema de gestión de recetas médicas. Backend Node.js/Express con SQLite, frontend React con Bootstrap.

## Estructura del Proyecto

```
minsal-project/
├── backend/
│   ├── data/minsal.db          # Base de datos SQLite (auto-generado)
│   ├── src/
│   │   ├── index.js            # Servidor Express (puerto 3001)
│   │   ├── db.js               # Conexión SQLite
│   │   ├── seed.js             # Script para inicializar la BD
│   │   ├── routes/             # Rutas de la API REST
│   │   │   ├── establecimientos.js
│   │   │   ├── medicos.js
│   │   │   ├── pacientes.js
│   │   │   ├── medicamentos.js
│   │   │   └── recetas.js
│   │   └── sql/
│   │       └── init.sql        # Esquema de tablas + datos iniciales
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Rutas de la aplicación
│   │   ├── index.jsx           # Punto de entrada React
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Barra de navegación
│   │   │   ├── CrearReceta.jsx # Pantalla: crear receta
│   │   │   └── ListarRecetas.jsx # Pantalla: listar recetas
│   │   └── services/
│   │       └── api.js          # Cliente HTTP (Axios)
```

## Requisitos

- Node.js 18 o superior

No se requiere instalar ninguna base de datos externa. SQLite se incluye automáticamente con el paquete `better-sqlite3`.

## Instalación

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Inicializar la Base de Datos (Seed)

```bash
cd backend
npm run seed
```

Esto ejecuta `src/seed.js`, que lee el archivo `src/sql/init.sql` y:
1. Elimina las tablas existentes (si las hay)
2. Crea las 6 tablas: establecimientos, medicos, pacientes, medicamentos, recetas, recetas_detalles
3. Inserta datos de ejemplo: 5 establecimientos, 8 médicos, 8 pacientes, 10 medicamentos

La base de datos se guarda en `backend/data/minsal.db`. Si quieres reiniciar los datos, simplemente ejecuta `npm run seed` de nuevo.

## Ejecutar la Aplicación

Necesitas dos terminales:

```bash
# Terminal 1 — Backend (puerto 3001)
cd backend
npm start

# Terminal 2 — Frontend (puerto 5173)
cd frontend
npm run dev
```

Abrir http://localhost:5173 en el navegador.

## API Endpoints

| Método | Ruta                    | Descripción                                      |
|--------|-------------------------|--------------------------------------------------|
| GET    | /api/establecimientos   | Lista todos los establecimientos                 |
| GET    | /api/medicos?establecimientoid=X | Lista médicos, filtrado opcional por establecimiento |
| GET    | /api/pacientes          | Lista pacientes con edad calculada               |
| GET    | /api/medicamentos       | Lista todos los medicamentos                     |
| POST   | /api/recetas            | Crea una receta con sus detalles                 |
| GET    | /api/recetas            | Lista recetas con filtros opcionales             |

### Filtros de GET /api/recetas

- `establecimientoid` — filtrar por establecimiento
- `medicoid` — filtrar por médico
- `fecha_desde` — fecha mínima (YYYY-MM-DD)
- `fecha_hasta` — fecha máxima (YYYY-MM-DD)
- `medicamentoid` — filtrar por medicamento en los detalles





 Write(README.md)
  ⎿  Wrote 1 lines to README.md
       1 # MINSAL Recetas
       2                                                                                                                       3 Sistema de gestión de recetas médicas. Backend Node.js/Express con SQLite, frontend React con Bootstrap.
       4                                                                                                                       5 ## Estructura del Proyecto
       6
       7 ```
       8 minsal-project/
       9 ├── backend/
      10 │   ├── data/minsal.db          # Base de datos SQLite (auto-generado)

● README created. Now let me explain everything:

  ---
  How the pieces work                                                                                                   
  1. Database Schema (Migration) — backend/src/sql/init.sql                                                             
  This is the "migration" file. It defines the entire database structure:

  establecimientos  ←──  medicos  ←──  recetas  ──→  pacientes
                                          │
                                     recetas_detalles  ──→  medicamentos

  - establecimientos — hospitals/clinics (e.g. "Hospital Nacional Rosales")
  - medicos — doctors, each linked to one establecimiento via establecimientoid
  - pacientes — patients with a birth date
  - medicamentos — medicines (e.g. "Acetaminofén 500mg")
  - recetas — a prescription, linking one doctor + one patient + a date and number
  - recetas_detalles — line items on a prescription (which medicine, how many, dosage, instructions). Each row links
  back to one receta and one medicamento

  The file uses DROP TABLE IF EXISTS at the top so you can re-run it to reset everything cleanly. It's not a versioned
  migration system — it's a full "recreate from scratch" approach, which is fine for this scale.

  2. Seed Script — backend/src/seed.js

  This is a 4-line Node.js script that:
  1. Reads the init.sql file from disk
  2. Calls db.exec(sql) which runs all the SQL statements at once (drops, creates, inserts)

  The result is a ready-to-use backend/data/minsal.db file with sample data. You run it once with npm run seed. If you
  ever need a fresh database, just run it again — it drops everything and recreates it.

  3. Frontend — React + Vite

  Vite is the dev server/bundler (replacement for Create React App). It serves the React app on port 5173 with hot
  reload.

  The frontend has 3 key parts:

  - services/api.js — a thin wrapper around Axios. Every function calls the backend at http://localhost:3001/api/... and
   returns the JSON data. Components just call getEstablecimientos(), createReceta(data), etc.
  - CrearReceta.jsx — the "create prescription" form. It loads dropdowns from the API on mount. When you pick an
  establecimiento, it re-fetches the medicos for that hospital. You add medication rows inline (each row = medicamento +
   cantidad + dosis + indicaciones). "Guardar" POSTs the whole receta + detalles array in one request.
  - ListarRecetas.jsx — the "search prescriptions" screen. Has filter dropdowns (establecimiento, medico, dates,
  medicamento) and a "Buscar" button. Sends the filters as query params to GET /api/recetas and displays results in a
  table.

  Data flow: Frontend components → api.js (Axios) → Backend Express routes → SQLite queries → JSON response back to
  React.