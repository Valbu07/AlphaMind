// backend/controllers/reportesController.js
const { obtenerReporteFuncionario } = require('../models/reportes.model');

async function getReportes(req, res) {
  try {
    const { documento } = req.params;
    if (!documento) {
      return res.status(400).json({ 
        error: 'Documento es requerido' 
      });
    }
    const datos = await obtenerReporteFuncionario(documento);

    if (!datos) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    res.json(datos);

  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener reportes',
      detalle: error.message 
    });
  }
}

module.exports = { getReportes };