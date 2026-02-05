import React, { useState, useEffect } from 'react';
import {
  getEstablecimientos,
  getMedicos,
  getMedicamentos,
  getRecetas,
} from '../services/api';

function ListarRecetas() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [recetas, setRecetas] = useState([]);

  const [filtros, setFiltros] = useState({
    establecimientoid: '',
    medicoid: '',
    fecha_desde: '',
    fecha_hasta: '',
    medicamentoid: '',
  });

  useEffect(() => {
    getEstablecimientos().then(setEstablecimientos);
    getMedicos().then(setMedicos);
    getMedicamentos().then(setMedicamentos);
  }, []);

  useEffect(() => {
    if (filtros.establecimientoid) {
      getMedicos(filtros.establecimientoid).then(setMedicos);
    } else {
      getMedicos().then(setMedicos);
    }
    setFiltros((prev) => ({ ...prev, medicoid: '' }));
  }, [filtros.establecimientoid]);

  const handleChange = (field, value) => {
    setFiltros({ ...filtros, [field]: value });
  };

  const buscar = async () => {
    const params = {};
    for (const [key, val] of Object.entries(filtros)) {
      if (val) params[key] = val;
    }
    const data = await getRecetas(params);
    setRecetas(data);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-SV');
  };

  return (
    <div>
      <h3 className="mb-4">Listar Recetas</h3>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">Establecimiento</label>
          <select
            className="form-select"
            value={filtros.establecimientoid}
            onChange={(e) => handleChange('establecimientoid', e.target.value)}
          >
            <option value="">-- Todos --</option>
            {establecimientos.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Médico</label>
          <select
            className="form-select"
            value={filtros.medicoid}
            onChange={(e) => handleChange('medicoid', e.target.value)}
          >
            <option value="">-- Todos --</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Fecha desde</label>
          <input
            type="date"
            className="form-control"
            value={filtros.fecha_desde}
            onChange={(e) => handleChange('fecha_desde', e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Fecha hasta</label>
          <input
            type="date"
            className="form-control"
            value={filtros.fecha_hasta}
            onChange={(e) => handleChange('fecha_hasta', e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Medicamento</label>
          <select
            className="form-select"
            value={filtros.medicamentoid}
            onChange={(e) => handleChange('medicamentoid', e.target.value)}
          >
            <option value="">-- Todos --</option>
            {medicamentos.map((med) => (
              <option key={med.id} value={med.id}>{med.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary mb-4" onClick={buscar}>
        Buscar
      </button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>N° Receta</th>
            <th>Médico</th>
            <th>Paciente</th>
            <th>Total Medicamentos</th>
          </tr>
        </thead>
        <tbody>
          {recetas.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No se encontraron recetas
              </td>
            </tr>
          )}
          {recetas.map((r) => (
            <tr key={r.id}>
              <td>{formatFecha(r.fecha)}</td>
              <td>{r.numero}</td>
              <td>{r.medico_nombre}</td>
              <td>{r.paciente_nombre}</td>
              <td>{r.total_medicamentos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarRecetas;
