const express = require("express");
const router = express.Router();
const controlador = require("../controllers/reportesController");
const respuesta = require("../utils/repuesta");
const { verificarToken } = require("../middlewares/authMiddleware");
const { autorizaciondeRoles } = require("../middlewares/authMiddleware");

// Obtener reporte por documento
router.get( "/:num_documento",verificarToken, autorizaciondeRoles(["Administrador"]),

  async (req, res) => {
    try {
      const data = await controlador.funcionario(req.params.num_documento);
      respuesta.success(req, res, data, 200);
    } catch (error) {
      
      respuesta.error(req, res, "Error al obtener el reporte", 500);
    }
  }
);

module.exports = router;