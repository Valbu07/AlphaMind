// routes/recuperarContraseña.routes.js
const express = require("express");
const router = express.Router();
const controlador = require("../controllers/recuperarContraseña");
const respuesta = require("../utils/repuesta");

// Ruta: POST /recuperar/contraseña
router.post("/contrasena", async (req, res) => {
  console.log('📥 Petición recibida en /recuperar/contraseña');
  console.log('📦 Body:', req.body);
  
  try {
    const { num_documento } = req.body;

    if (!num_documento) {
      console.log('❌ Falta num_documento');
      return respuesta.error(req, res, "El número de documento es requerido", 400);
    }

    console.log('🔍 Buscando documento:', num_documento);
    const data = await controlador.recuperarContrasena(num_documento);
    
    console.log('✅ Correo enviado exitosamente');
    respuesta.success(req, res, data, 200);
    
  } catch (error) {
    console.error("❌ Error en la ruta:", error);
    
    if (error.mensaje === "Funcionario no encontrado") {
      return respuesta.error(req, res, "No existe un funcionario con ese documento", 404);
    }
    
    respuesta.error(req, res, "Error al enviar el correo", 500);
  }
});

module.exports = router;