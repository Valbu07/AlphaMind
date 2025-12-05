// src/services/reporteService.js
import axiosInstance from './axiosConfig';

/**
 * Obtiene el reporte de un funcionario por su número de documento
 * @param {string} num_documento - Número de documento del funcionario
 * @returns {Promise<Object>} - Datos del reporte
 */
export const obtenerReporteFuncionario = async (num_documento) => {
  try {
    const response = await axiosInstance.get(`/reportes/${num_documento}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    throw error;
  }
};

/**
 * Obtiene el reporte del usuario actual (usando token)
 * @returns {Promise<Object>} - Datos del reporte
 */
export const obtenerReporteUsuarioActual = async () => {
  try {
    const response = await axiosInstance.get('/reportes/mi-reporte'); // Endpoint alternativo si lo tienes
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte del usuario actual:', error);
    throw error;
  }
};