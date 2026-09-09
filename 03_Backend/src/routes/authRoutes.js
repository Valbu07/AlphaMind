const express = require('express');
const router = express.Router();
const controlador = require('../controllers/authController');
const respuesta = require("../utils/repuesta");
router.post('/login', async (req, res) => {
  try {
  
    const { funcionario, usuario } = req.body || {};
    const num_documento = String(funcionario?.num_documento ?? '').trim();
    const contraseña = String(usuario?.contraseña ?? '');
    if (!num_documento || !contraseña) {
      return respuesta.error(req, res, 'Documento y contraseña son requeridos', 400);
    }
    const token = await controlador.login(
      num_documento,
      contraseña
    );
    respuesta.success(req, res, token, 200); 

  } catch (error) {
    console.log("Error en login:", error.message);
    const msg = /no existe|incorrecta/i.test(error.message || '') ? error.message : 'Error con las credenciales';
    respuesta.error(req, res, msg, 401);
  }
});

/* SWAGGER */

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Inicio de sesión y autenticación
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               funcionario:
 *                 type: object
 *                 properties:
 *                   num_documento:
 *                     type: string
 *                     example: "123456"
 *               usuario:
 *                 type: object
 *                 properties:
 *                   contraseña:
 *                     type: string
 *                     example: "1234"
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token
 *       500:
 *         description: Error con las credenciales
*/


module.exports = router;
