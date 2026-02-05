const { Router } = require('express');
const db = require('../db');

const router = Router();

// POST /api/recetas — create receta with detalles in a transaction
router.post('/', (req, res) => {
  try {
    const { medicoid, pacienteid, detalles } = req.body;

    if (!medicoid || !pacienteid || !detalles || detalles.length === 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const numero = String(Math.floor(Math.random() * 90) + 10);
    const fecha = new Date().toISOString().split('T')[0];

    const insertReceta = db.prepare(
      `INSERT INTO recetas (numero, fecha, medicoid, pacienteid) VALUES (?, ?, ?, ?)`
    );
    const insertDetalle = db.prepare(
      `INSERT INTO recetas_detalles (cantidad, dosis, indicaciones, recetaid, medicamentoid)
       VALUES (?, ?, ?, ?, ?)`
    );

    const transaction = db.transaction(() => {
      const info = insertReceta.run(numero, fecha, medicoid, pacienteid);
      const recetaId = info.lastInsertRowid;

      for (const det of detalles) {
        insertDetalle.run(det.cantidad, det.dosis, det.indicaciones || '', recetaId, det.medicamentoid);
      }

      return { id: recetaId, numero, fecha };
    });

    const receta = transaction();
    res.status(201).json(receta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear receta' });
  }
});

// GET /api/recetas — list with filters
router.get('/', (req, res) => {
  try {
    const { establecimientoid, medicoid, fecha_desde, fecha_hasta, medicamentoid } = req.query;

    let query = `
      SELECT r.id, r.fecha, r.numero,
        m.nombre AS medico_nombre,
        p.nombre AS paciente_nombre,
        COUNT(rd.id) AS total_medicamentos
      FROM recetas r
      JOIN medicos m ON r.medicoid = m.id
      JOIN pacientes p ON r.pacienteid = p.id
      LEFT JOIN recetas_detalles rd ON rd.recetaid = r.id
    `;

    const conditions = [];
    const params = [];

    if (establecimientoid) {
      conditions.push('m.establecimientoid = ?');
      params.push(establecimientoid);
    }
    if (medicoid) {
      conditions.push('r.medicoid = ?');
      params.push(medicoid);
    }
    if (fecha_desde) {
      conditions.push('r.fecha >= ?');
      params.push(fecha_desde);
    }
    if (fecha_hasta) {
      conditions.push('r.fecha <= ?');
      params.push(fecha_hasta);
    }
    if (medicamentoid) {
      conditions.push('rd.medicamentoid = ?');
      params.push(medicamentoid);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY r.id, r.fecha, r.numero, m.nombre, p.nombre ORDER BY r.fecha DESC';

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

module.exports = router;
