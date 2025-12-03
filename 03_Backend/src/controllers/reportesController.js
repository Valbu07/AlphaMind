// backend/controllers/reportesController.js
const { obtenerReporteFuncionario } = require("../models/reportes.model");

/**
 * 📊 Obtener reporte completo de un funcionario
 * @route GET /reportes/:num_documento
 */
const obtenerReporte = async (req, res) => {
  try {
    const { num_documento } = req.params;
    
    console.log('🎯 [CONTROLLER] Solicitud de reporte para documento:', num_documento);

    // Validación básica
    if (!num_documento || num_documento.trim() === '') {
      console.warn('⚠️ [CONTROLLER] Documento inválido o vacío');
      return res.status(400).json({
        success: false,
        message: 'El número de documento es requerido'
      });
    }

    // Llamar al modelo
    console.log('📡 [CONTROLLER] Consultando modelo...');
    const reporte = await obtenerReporteFuncionario(num_documento);

    // Validar resultado
    if (!reporte) {
      console.log('❌ [CONTROLLER] Usuario no encontrado');
      return res.status(404).json({
        success: false,
        message: 'No se encontró información para este usuario'
      });
    }

    // ✅ Respuesta exitosa
    console.log('✅ [CONTROLLER] Reporte generado exitosamente');
    return res.status(200).json({
      success: true,
      data: reporte,
      message: 'Reporte generado exitosamente'
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Error al obtener reporte:', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error: error.message
    });
  }
};

module.exports = {
  obtenerReporte
};