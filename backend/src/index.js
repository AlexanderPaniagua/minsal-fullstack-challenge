const express = require('express');
const cors = require('cors');

const establecimientosRouter = require('./routes/establecimientos');
const medicosRouter = require('./routes/medicos');
const pacientesRouter = require('./routes/pacientes');
const medicamentosRouter = require('./routes/medicamentos');
const recetasRouter = require('./routes/recetas');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/establecimientos', establecimientosRouter);
app.use('/api/medicos', medicosRouter);
app.use('/api/pacientes', pacientesRouter);
app.use('/api/medicamentos', medicamentosRouter);
app.use('/api/recetas', recetasRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
