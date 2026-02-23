// routes/recuperarContraseña.routes.js
const express = require("express");
const router = express.Router();
const controlador = require("../controllers/recuperarContraseña");
const respuesta = require("../utils/repuesta");

// Ruta: POST /recuperar/contraseña
router.post("/contrasena", async (req, res) => {
  console.log(' Petición recibida en /recuperar/contraseña');
  console.log(' Body:', req.body);
  
  try {
    const { num_documento } = req.body;const express = require("express");
const router = express.Router();
const controlador = require("../controllers/recuperarContraseña");
const respuesta = require("../utils/repuesta");

router.post("/contrasena", async (req, res) => {
  console.log(' Petición recibida en /recuperar/contrasena');
  console.log(' Body:', req.body);
  
  try {
    const { num_documento } = req.body;

    if (!num_documento) {
      console.log(' Falta num_documento');
      return respuesta.error(req, res, "El número de documento es requerido", 400);
    }

    console.log(' Buscando documento:', num_documento);
    const data = await controlador.recuperarContrasena(num_documento);
    
    console.log(' Correo enviado exitosamente');
    return respuesta.success(req, res, data, 200);
    
  } catch (error) {
    console.error(" Error en la ruta:", error);
    
    if (error.mensaje === "Funcionario no encontrado") {
      return respuesta.error(req, res, "No existe un funcionario con ese documento", 404);
    }
    
    return respuesta.error(req, res, error.mensaje || "Error al enviar el correo", 500);
  }
});

module.exports = router;

    if (!num_documento) {
      console.log(' Falta num_documento');
      return respuesta.error(req, res, "El número de documento es requerido", 400);
    }

    console.log(' Buscando documento:', num_documento);
    const data = await controlador.recuperarContrasena(num_documento);
    
    console.log(' Correo enviado exitosamente');
    respuesta.success(req, res, data, 200);
    
  } catch (error) {
    console.error(" Error en la ruta:", error);
    
    if (error.mensaje === "Funcionario no encontrado") {
      return respuesta.error(req, res, "No existe un funcionario con ese documento", 404);
    }
    
    respuesta.error(req, res, "Error al enviar el correo", 500);
  }
});

/* SWAGGER */
/**
 * @swagger
 * tags:
 *   name: Recuperación
 *   description: Recuperación de contraseña
*/

/**
 * @swagger
 * /recuperar/contrasena:
 *   post:
 *     summary: Recuperar contraseña por número de documento
 *     tags: [Recuperación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num_documento:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *       404:
 *         description: Funcionario no encontrado
*/

module.exports = router;