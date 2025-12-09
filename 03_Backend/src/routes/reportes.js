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

module.exports = router;