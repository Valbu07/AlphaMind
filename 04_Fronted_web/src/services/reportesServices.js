// src/services/reportesServices.js
import axios from "axios";

const API = "http://localhost:3000/reportes";

/**
 * 📊 Obtener reporte de un funcionario
 * @param {string} num_documento - Número de documento del funcionario
 * @returns {Promise<Object>} Datos del reporte
 */
export const getReportes = async (num_documento) => {
  try {
    console.log('📡 [SERVICE] Solicitando reporte para documento:', num_documento);

    // Obtener token desde localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay sesión activa. Inicia sesión nuevamente.');
    }

    // ✅ Llamada con token en headers
    const res = await axios.get(`${API}/${num_documento}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ [SERVICE] Respuesta recibida:', res.data);

    // ✅ Validar estructura de respuesta
    if (!res.data.success) {
      throw new Error(res.data.message || 'Error al obtener reportes');
    }

    // ✅ Retornar SOLO los datos
    return res.data.data; // 👈 Importante: retornar .data.data

  } catch (error) {
    console.error('❌ [SERVICE] Error al obtener reportes:', {
      mensaje: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Manejo de errores específicos
    if (error.response?.status === 404) {
      throw new Error('No se encontró información para este usuario');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Sesión expirada. Inicia sesión nuevamente.');
    }

    throw new Error(
      error.response?.data?.message || 
      'No se pudieron cargar los reportes. Verifica tu conexión.'
    );
  }
};