const express = require("express");
const router = express.Router();
const controlador = require("../controllers/fotoPerfilController");
const { verificarToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload.middleware");
const fs = require("fs");
const path = require("path");

// POST /api/foto-perfil — subir foto
router.post("/", verificarToken, upload.single("foto"), async (req, res) => {
  try {
    const data = await controlador.subirFoto(req);
    res.json({ error: false, body: data });
  } catch (error) {
    console.error("Error al subir foto:", error);
    if (req.file) {
      const ruta = path.join(__dirname, "../../fotos_Perfil", req.file.filename);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }
    res.status(500).json({ error: true, body: "Error al subir la foto de perfil" });
  }
});

// DELETE /api/foto-perfil — eliminar foto
router.delete("/", verificarToken, async (req, res) => {
  try {
    const data = await controlador.eliminarFoto(req);
    res.json({ error: false, body: data });
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    res.status(500).json({ error: true, body: "Error al eliminar la foto" });
  }
});

module.exports = router;