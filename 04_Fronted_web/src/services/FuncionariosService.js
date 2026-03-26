import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/funcionarios`;



// obtener headers con token
const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': token
});

export const funcionariosService = {
  // Obtener todos los funcionarios
  getAll: async (token) => {
    const { data } = await axios.get(API, {
      headers: getHeaders(token)
    });
    return data;
  },

  // Crear nuevo funcionario
  create: async (token, funcionarioData) => {
    const { data } = await axios.post(`${API}/agregar`, funcionarioData, {
      headers: getHeaders(token)
    });
    return data;
  },

  // Eliminar funcionario
  delete: async (token, num_documento) => {
    const { data } = await axios.delete(`${API}/${num_documento}`, {
      headers: getHeaders(token)
    });
    return data;
  },

  // Actualizar funcionario 
  update: async (token, num_documento, funcionarioData) => {
    const { data } = await axios.put(`${API}/actualizar/${num_documento}`, funcionarioData, {
      headers: getHeaders(token)
    });
    return data;
  }
};