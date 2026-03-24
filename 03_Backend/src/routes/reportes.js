const express = require("express");
const router = express.Router();

const { obtenerReporte, obtenerListaFuncionarios } = require("../controllers/reportesController");
const { verificarToken } = require("../middlewares/authMiddleware");

router.get("/funcionarios", verificarToken, obtenerListaFuncionarios);
router.get("/:num_documento", verificarToken, obtenerReporte);

module.exports = router;