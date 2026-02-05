const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/', (req, res) => {
  try {
    const { establecimientoid } = req.query;
    let query = 'SELECT id, nombre, establecimientoid FROM medicos';
    const params = [];

    if (establecimientoid) {
      query += ' WHERE establecimientoid = ?';
      params.push(establecimientoid);
    }

    query += ' ORDER BY nombre';
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener médicos' });
  }
});

module.exports = router;
