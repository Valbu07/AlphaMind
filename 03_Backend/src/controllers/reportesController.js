// backend/controllers/reportesController.js
const {
  obtenerReporteFuncionario,
  obtenerFuncionarios,
} = require("../models/reportes.model.js");

// ── GET /reportes/:num_documento?mes=N ───────────────────────────────────────
const obtenerReporte = async (req, res) => {
  try {
    const { num_documento } = req.params;
    const { mes }           = req.query;

    // Validación: documento requerido
    if (!num_documento || num_documento.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El número de documento es requerido',
      });
    }

    // Validación: mes debe ser un número entre 1 y 12 si viene informado
    let mesSanitizado = 'todos';

    if (mes && mes !== 'todos') {
      if (!/^\d{1,2}$/.test(mes)) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro mes debe ser un número entero',
        });
      }
      const mesNum = parseInt(mes, 10);
      if (mesNum < 1 || mesNum > 12) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro mes debe estar entre 1 y 12',
        });
      }
      mesSanitizado = mesNum;
    }

    const reporte = await obtenerReporteFuncionario(num_documento, mesSanitizado);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró información para este usuario',
      });
    }

    return res.status(200).json({
      success: true,
      data:    reporte,
      message: 'Reporte generado exitosamente',
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Error al obtener reporte:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error:   error.message,
    });
  }
};

// ── GET /reportes/funcionarios ───────────────────────────────────────────────
const obtenerListaFuncionarios = async (req, res) => {
  try {
    const funcionarios = await obtenerFuncionarios();
    return res.status(200).json({
      success: true,
      data: funcionarios,
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Error al obtener funcionarios:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de funcionarios',
      error:   error.message,
    });
  }
};

module.exports = { obtenerReporte, obtenerListaFuncionarios };