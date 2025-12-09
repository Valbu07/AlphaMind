// src/services/authService.js
import axios from 'axios';

const API = 'http://localhost:3000/auth';

export const authService = {
  /**
   * Realiza el login del usuario
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.num_documento - Número de documento
   * @param {string} credentials.contraseña - Contraseña
   * @returns {Promise<Object>} - Respuesta del servidor con token y datos del usuario
   */
  login: async ({ num_documento, contraseña }) => {
    try {
      console.log('📤 Enviando credenciales:', { num_documento });
      
      const { data } = await axios.post(`${API}/login`, {
        funcionario: { num_documento },
        usuario: { contraseña }
      });

      console.log('📥 Respuesta completa del servidor:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error en authService.login:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Verifica si hay un token guardado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtiene el token del localStorage
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};