import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/auth`;


export const authService = {

  login: async ({ num_documento, contraseña }) => {
    try {
      console.log('Enviando credenciales:', { num_documento });
      console.log('VITE_API_URL =', import.meta.env.VITE_API_URL);
console.log('API =', API);
      const { data } = await axios.post(`${API}/login`, {
        funcionario: { num_documento },
        usuario: { contraseña }
      });

      console.log('Respuesta completa del servidor:', data);

      return data;

    } catch (error) {
      console.error('Error en authService.login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  getToken: () => localStorage.getItem('token'),
};