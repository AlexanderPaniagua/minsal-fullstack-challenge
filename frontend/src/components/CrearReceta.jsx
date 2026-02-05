import React, { useState, useEffect } from 'react';
import {
  getEstablecimientos,
  getMedicos,
  getPacientes,
  getMedicamentos,
  createReceta,
} from '../services/api';

function CrearReceta() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  const [establecimientoId, setEstablecimientoId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [pacienteId, setPacienteId] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const [numero] = useState(String(Math.floor(Math.random() * 90) + 10));

  const [detalles, setDetalles] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    getEstablecimientos().then(setEstablecimientos);
    getPacientes().then(setPacientes);
    getMedicamentos().then(setMedicamentos);
  }, []);

  useEffect(() => {
    if (establecimientoId) {
      getMedicos(establecimientoId).then(setMedicos);
      setMedicoId('');
    } else {
      setMedicos([]);
      setMedicoId('');
    }
  }, [establecimientoId]);

  const agregarDetalle = () => {
    setDetalles([...detalles, { medicamentoid: '', cantidad: 1, dosis: '', indicaciones: '' }]);
  };

  const actualizarDetalle = (index, field, value) => {
    const updated = [...detalles];
    updated[index] = { ...updated[index], [field]: value };
    setDetalles(updated);
  };

  const eliminarDetalle = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    if (!medicoId || !pacienteId) {
      setMensaje({ tipo: 'danger', texto: 'Debe seleccionar médico y paciente.' });
      return;
    }
    if (detalles.length === 0) {
      setMensaje({ tipo: 'danger', texto: 'Debe agregar al menos un medicamento.' });
      return;
    }
    for (const d of detalles) {
      if (!d.medicamentoid || !d.cantidad || !d.dosis) {
        setMensaje({ tipo: 'danger', texto: 'Complete todos los campos de cada medicamento.' });
        return;
      }
    }

    try {
      const result = await createReceta({
        medicoid: parseInt(medicoId),
        pacienteid: parseInt(pacienteId),
        detalles: detalles.map(d => ({
          medicamentoid: parseInt(d.medicamentoid),
          cantidad: parseInt(d.cantidad),
          dosis: d.dosis,
          indicaciones: d.indicaciones,
        })),
      });
      setMensaje({ tipo: 'success', texto: `Receta #${result.numero} creada exitosamente.` });
      setEstablecimientoId('');
      setMedicoId('');
      setPacienteId('');
      setDetalles([]);
    } catch {
      setMensaje({ tipo: 'danger', texto: 'Error al guardar la receta.' });
    }
  };

  return (
    <div>
      <h3 className="mb-4">Crear Receta</h3>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible`}>
          {mensaje.texto}
          <button className="btn-close" onClick={() => setMensaje(null)}></button>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">Fecha</label>
          <input type="date" className="form-control" value={today} readOnly />
        </div>
        <div className="col-md-3">
          <label className="form-label">N° Receta</label>
          <input type="text" className="form-control" value={numero} readOnly />
        </div>
        <div className="col-md-6">
          <label className="form-label">Establecimiento</label>
          <select
            className="form-select"
            value={establecimientoId}
            onChange={(e) => setEstablecimientoId(e.target.value)}
          >
            <option value="">-- Seleccione --</option>
            {establecimientos.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Médico</label>
          <select
            className="form-select"
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
            disabled={!establecimientoId}
          >
            <option value="">-- Seleccione --</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Paciente</label>
          <select
            className="form-select"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
          >
            <option value="">-- Seleccione --</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.edad} años)
              </option>
            ))}
          </select>
        </div>
      </div>

      <h5>Detalle de Medicamentos</h5>
      <table className="table table-bordered mt-2">
        <thead className="table-light">
          <tr>
            <th>Medicamento</th>
            <th style={{ width: '100px' }}>Cantidad</th>
            <th style={{ width: '150px' }}>Dosis</th>
            <th>Indicaciones</th>
            <th style={{ width: '60px' }}></th>
          </tr>
        </thead>
        <tbody>
          {detalles.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No hay medicamentos agregados
              </td>
            </tr>
          )}
          {detalles.map((det, i) => (
            <tr key={i}>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={det.medicamentoid}
                  onChange={(e) => actualizarDetalle(i, 'medicamentoid', e.target.value)}
                >
                  <option value="">-- Seleccione --</option>
                  {medicamentos.map((med) => (
                    <option key={med.id} value={med.id}>{med.nombre}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min="1"
                  value={det.cantidad}
                  onChange={(e) => actualizarDetalle(i, 'cantidad', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={det.dosis}
                  onChange={(e) => actualizarDetalle(i, 'dosis', e.target.value)}
                  placeholder="Ej: 1 cada 8h"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={det.indicaciones}
                  onChange={(e) => actualizarDetalle(i, 'indicaciones', e.target.value)}
                  placeholder="Indicaciones..."
                />
              </td>
              <td>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => eliminarDetalle(i)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex gap-2">
        <button className="btn btn-secondary" onClick={agregarDetalle}>
          Agregar Medicamento
        </button>
        <button className="btn btn-primary" onClick={handleGuardar}>
          Guardar Receta
        </button>
      </div>
    </div>
  );
}

export default CrearReceta;
