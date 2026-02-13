

const { 
  obtenerReporteFuncionario,
  obtenerFuncionarios
} = require("../models/reportes.model");


const obtenerReporte = async (req, res) => {
  try {

    const { num_documento } = req.params;

    if (!num_documento || num_documento.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El número de documento es requerido'
      });
    }

    const reporte = await obtenerReporteFuncionario(num_documento);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró información para este usuario'
      });
    }

    return res.status(200).json({
      success: true,
      data: reporte,
      message: 'Reporte generado exitosamente'
    });

  } catch (error) {

    console.error('❌ [CONTROLLER] Error al obtener reporte:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error: error.message
    });
  }
};




const obtenerListaFuncionarios = async (req, res) => {
  try {

    const funcionarios = await obtenerFuncionarios();

    return res.status(200).json({
      success: true,
      data: funcionarios
    });

  } catch (error) {

    console.error('❌ [CONTROLLER] Error al obtener funcionarios:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de funcionarios',
      error: error.message
    });
  }
};

module.exports = {
  obtenerReporte,
  obtenerListaFuncionarios
};
