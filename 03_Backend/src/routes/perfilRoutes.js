const express = require("express");
const router = express.Router();
const { cambiarContrasena, cambiarContrasenaAdmin } = require("../controllers/perfilController");
const { verificarToken, autorizaciondeRoles } = require("../middlewares/authMiddleware");

// PUT /api/perfil/cambiar-contrasena — usuario cambia su propia contraseña
router.put("/cambiar-contrasena", verificarToken, cambiarContrasena);

// PUT /api/perfil/cambiar-contrasena-admin — admin cambia la de cualquier usuario
router.put(
  "/cambiar-contrasena-admin",
  verificarToken,
  autorizaciondeRoles(["Administrador"]),
  cambiarContrasenaAdmin
);

module.exports = router;