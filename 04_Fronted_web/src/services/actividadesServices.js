import axios from 'axios';

const API = 'http://localhost:3000/tareas';

export const actividadesService = {
  // Obtener todas las actividades
  getAll: async (token) => {
    const { data } = await axios.get(API, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data;
  },

  // Obtener actividades de un funcionario específico
  getByFuncionario: async (token, num_documento) => {
    const { data } = await axios.get(`${API}/${num_documento}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data;
  },

  // Crear nueva actividad
  create: async (token, actividadData) => {
    const { data } = await axios.post(`${API}/crearTarea`, actividadData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  },

  // Actualizar actividad 
  update: async (token, id_actividad, actividadData) => {
    const { data } = await axios.put(`${API}/editarTarea/${id_actividad}`, actividadData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  },

  // Eliminar actividad
  delete: async (token, id_actividad) => {
    const { data } = await axios.delete(`${API}/${id_actividad}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data;
  }
};