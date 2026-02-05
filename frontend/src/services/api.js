import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getEstablecimientos = () => api.get('/establecimientos').then(r => r.data);
export const getMedicos = (establecimientoid) => {
  const params = establecimientoid ? { establecimientoid } : {};
  return api.get('/medicos', { params }).then(r => r.data);
};
export const getPacientes = () => api.get('/pacientes').then(r => r.data);
export const getMedicamentos = () => api.get('/medicamentos').then(r => r.data);
export const createReceta = (data) => api.post('/recetas', data).then(r => r.data);
export const getRecetas = (filters) => api.get('/recetas', { params: filters }).then(r => r.data);
