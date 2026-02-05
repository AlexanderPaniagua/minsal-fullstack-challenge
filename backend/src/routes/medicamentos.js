const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, nombre FROM medicamentos ORDER BY nombre').all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener medicamentos' });
  }
});

module.exports = router;
