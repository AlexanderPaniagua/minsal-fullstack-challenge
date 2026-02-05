const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT id, nombre, fecha_nacimiento,
        CAST((julianday('now') - julianday(fecha_nacimiento)) / 365.25 AS INTEGER) AS edad
       FROM pacientes ORDER BY nombre`
    ).all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

module.exports = router;
