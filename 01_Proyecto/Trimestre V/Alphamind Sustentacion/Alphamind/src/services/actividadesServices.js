import axios from 'axios';

const API = 'http://localhost:3000/tareas';

export const actividadesService = {
  getActividades: async () => {
    const { data } = await axios.get(API);
    return data;
  },
  createActividad: async (actividad) => {
    const { data } = await axios.post(API, actividad);
    return data;
  }
};
