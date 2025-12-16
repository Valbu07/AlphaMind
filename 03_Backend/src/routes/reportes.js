// backend/routes/reportes.js
const express = require("express");
const router = express.Router();
const { obtenerReporte } = require("../controllers/reportesController");
const { verificarToken } = require("../middlewares/authMiddleware");

router.get(
  "/:num_documento",
  verificarToken,
  obtenerReporte  // ✅ Llamar directamente
);

/* SWAGGER */
/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Reportes por funcionario
*/

/**
 * @swagger
 * /reportes/{num_documento}:
 *   get:
 *     summary: Obtener reporte del funcionario
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: num_documento
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte generado
*/


module.exports = router;