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

  // Obtener actividades asignadas A MÍ (las que me asignaron)
  getAsignadasAMi: async (token, id_usuario) => {
    const { data } = await axios.get(`${API}/asignadas-a-mi/${id_usuario}`, {
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
  },

  // Completar una actividad
  completarActividad: async (token, id_actividad) => {
    const { data } = await axios.put(
      `${API}/completar/${id_actividad}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data;
  },

  // Obtener actividades para calendario
  getActividadesCalendario: async (token, id_usuario) => {
    const { data } = await axios.get(`${API}/asignadas-a-mi/${id_usuario}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Formatear para el calendario
    return (data.body || data).map(act => ({
      id: act.id_Actividad,
      asunto: act.asunto,
      fecha_vencimiento: act.fecha_vencimiento,
      estado_actual: act.estado_actual,
      prioridad: act.prioridad
    }));
  }
  
};