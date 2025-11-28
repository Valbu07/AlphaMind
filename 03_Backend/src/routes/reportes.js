const express = require("express");
const router = express.Router();
const controlador = require("../controllers/reportesController");
const respuesta = require("../utils/repuesta");
const { verificarToken } = require("../middlewares/authMiddleware");
const { autorizaciondeRoles } = require("../middlewares/authMiddleware");

// Obtener reporte por documento
// backend/routes/reportes.js
router.get(
  "/:num_documento",
  verificarToken,
  autorizaciondeRoles(["Administrador"]),
  async (req, res) => {
    try {
      req.params.documento = req.params.num_documento;
      await controlador.getReportes(req, res);

    } catch (error) {

      respuesta.error(req, res, "Error interno del servidor", 500);
    }
  }
);


module.exports = router;